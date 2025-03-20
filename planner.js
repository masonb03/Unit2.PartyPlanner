const baseUrl = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2501-FTB-ET-WEB-PT/events`;

const state = {
    currentParties: [],
    addParty: [],
    deleteParty: [],
};

const root = document.querySelector(`#root`);
const add = document.querySelector(`#getButton`);
const back = document.querySelector(`#backButton`);
const addPartyForm = document.querySelector('#addPartyForm');

// Function to render parties or party details
const render = (parties) => {
    root.innerHTML = '';  // Clear root before rendering

    if (Array.isArray(parties)) {
        parties.forEach((party) => {
            const card = document.createElement(`div`);
            card.classList.add(`card`);
            card.innerHTML = `
                <h1>${party.name}</h1>
                <h2>${party.date}</h2>
                <h3>${party.time}</h3>
                <h4>${party.location}</h4>
                <button class="getDetails" data-url="${party.url}">Get Details</button>
                <button class="deleteParty" data-id="${party.id}">Delete Party</button>
            `;
            root.append(card);
        });

        // Attach event listeners to the "Get Details" buttons
        document.querySelectorAll('.getDetails').forEach((button) => {
            button.addEventListener('click', (e) => {
                const partyUrl = e.target.dataset.url;
                // Handle displaying party details here
                console.log('Details for party at URL:', partyUrl);
            });
        });

        // Attach event listeners to the "Delete Party" buttons
        document.querySelectorAll('.deleteParty').forEach((button) => {
            button.addEventListener('click', (e) => {
                const partyId = e.target.dataset.id;
                deleteParty(partyId);  // Call deleteParty to delete a specific party
            });
        });
    }
};

// Fetch and render the list of parties
const curParties = async () => {
    try {
        const res = await fetch(baseUrl);
        const data = await res.json();
        events = response.data

        state.currentParties = data.results;
        render(state.currentParties);
    } catch (error) {
        console.error(`Error fetching parties`, error);
    }
};

// Add a new party
const newParty = async (party) => {
    try {
        const res = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(party),
        });
        const data = await res.json();

        // After adding the party, re-fetch and render the updated list
        state.addParty.push(data);
        render(state.addParty);

    } catch (error) {
        console.error(`Error adding party`, error);
    }
};

// Delete a party
const deleteParty = async (partyId) => {
    try {
        const res = await fetch(`${baseUrl}/${partyId}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            console.log(`Party with ID ${partyId} deleted`);
            // Remove the deleted party from the state and re-render
            state.currentParties = state.currentParties.filter((party) => party.id !== partyId);
            render(state.currentParties);
        } else {
            console.error(`Failed to delete party with ID ${partyId}`);
        }
    } catch (error) {
        console.error(`Error deleting party`, error);
    }
};

// Event listener for the "Get All Parties" button
add.addEventListener('click', () => {
    curParties();  // Fetch and display all parties when the button is clicked
});

// Event listener for the "Back" button (optional functionality)
back.addEventListener('click', () => {
    // Implement any back navigation or action if needed
    console.log('Back button clicked');
});

// Event listener for adding a new party (no page refresh)
addPartyForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    const newPartyData = {
        name: document.querySelector('#name').value,
        date: document.querySelector('#date').value,
        time: document.querySelector('#time').value,
        location: document.querySelector('#location').value,
        description: document.querySelector('#description').value,
    };

    newParty(newPartyData); // Call the newParty function to send data to the server
});

// Initialize the app by loading parties
curParties();

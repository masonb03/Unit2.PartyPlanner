const baseUrl = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2501-FTB-ET-WEB-PT/events`;

const state = {
    currentParties: [],
};

const root = document.querySelector(`#root`);
const addPartyForm = document.querySelector('#addPartyForm');

// Function to render parties
const render = (parties) => {
    root.innerHTML = '';  // Clear root before rendering

    if (Array.isArray(parties)) {
        parties.forEach((party) => {
            const card = document.createElement(`div`);
            card.classList.add(`card`);
            card.innerHTML = `
                <h1>${party.name}</h1>
                <h2>Date: ${party.date}</h2>
                <h3>Time: ${party.time}</h3>
                <h4>Location: ${party.location}</h4>
                <p>${party.description}</p>
                <button class="deleteParty" data-id="${party.id}">Delete Party</button>
            `;
            root.append(card);
        });

        // Attach delete functionality
        document.querySelectorAll('.deleteParty').forEach((button) => {
            button.addEventListener('click', (e) => {
                const partyId = e.target.dataset.id;
                deleteParty(partyId);
            });
        });
    }
};

// Fetch all parties
const fetchParties = async () => {
    try {
        const res = await fetch(baseUrl);
        const data = await res.json();

        // Check if the API returns an array or an object with a 'results' key
        state.currentParties = Array.isArray(data) ? data : data.results || [];

        render(state.currentParties);
    } catch (error) {
        console.error(`Error fetching parties:`, error);
    }
};


// Add a new party
const addParty = async (party) => {
    try {
        const res = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(party),
        });

        const newParty = await res.json();

        // Ensure state.currentParties is an array before pushing
        if (Array.isArray(state.currentParties)) {
            state.currentParties.push(newParty);
        } else {
            state.currentParties = [newParty]; // Initialize as array if not
        }

        render(state.currentParties); // Re-render with updated data
    } catch (error) {
        console.error(`Error adding party:`, error);
    }
};


// Delete a party
const deleteParty = async (partyId) => {
    try {
        const res = await fetch(`${baseUrl}/${partyId}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            state.currentParties = state.currentParties.filter((party) => party.id !== partyId);
            render(state.currentParties);
        }
    } catch (error) {
        console.error(`Error deleting party:`, error);
    }
};

// Add a party when the form is submitted
addPartyForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newPartyData = {
        name: document.querySelector('#name').value,
        date: document.querySelector('#date').value,
        time: document.querySelector('#time').value,
        location: document.querySelector('#location').value,
        description: document.querySelector('#description').value,
    };

    addParty(newPartyData);

    // Clear form inputs after submission
    addPartyForm.reset();
});

// Automatically load parties when the page loads
fetchParties();

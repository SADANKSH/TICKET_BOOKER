// Main JavaScript file for GOZibiboGo home page

document.addEventListener('DOMContentLoaded', function () {
    // Initialize date picker with current date + 1 day as default
    const journeyDateInput = document.getElementById('journey-date');
    if (journeyDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Format date as YYYY-MM-DD for the input
        const formattedDate = tomorrow.toISOString().split('T')[0];
        journeyDateInput.value = formattedDate;
        journeyDateInput.min = formattedDate; // Prevent selection of past dates
    }

    // Station suggestions (demo data)
    const stations = [
        "Mumbai Central", "Delhi", "Chennai", "Bangalore", "Kolkata", "Hyderabad",
        "Ahmedabad", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Patna",
        "Bhopal", "Indore", "Thane", "Visakhapatnam", "Vadodara", "Ghaziabad"
    ];

    // Add station suggestion functionality
    const sourceInput = document.getElementById('source');
    const destinationInput = document.getElementById('destination');

    // Function to create and show suggestions
    function setupAutoComplete(inputElement) {
        inputElement.addEventListener('input', function () {
            const value = this.value.toLowerCase();

            // Clear previous suggestions
            clearSuggestions();

            if (value.length < 2) return;

            // Filter matching stations
            const matches = stations.filter(station => {
                return station.toLowerCase().includes(value);
            });

            // Create suggestion dropdown
            if (matches.length > 0) {
                const suggestionsDiv = document.createElement('div');
                suggestionsDiv.className = 'suggestions';

                matches.forEach(match => {
                    const suggestion = document.createElement('div');
                    suggestion.className = 'suggestion-item';
                    suggestion.textContent = match;
                    suggestion.addEventListener('click', function () {
                        inputElement.value = match;
                        clearSuggestions();
                    });

                    suggestionsDiv.appendChild(suggestion);
                });

                // Position and append the suggestions
                inputElement.parentNode.appendChild(suggestionsDiv);
            }
        });

        // Clear suggestions on click outside
        document.addEventListener('click', function (e) {
            if (e.target !== inputElement) {
                clearSuggestions();
            }
        });
    }

    // Clear all suggestion dropdowns
    function clearSuggestions() {
        const suggestions = document.querySelectorAll('.suggestions');
        suggestions.forEach(suggestion => suggestion.remove());
    }

    if (sourceInput) setupAutoComplete(sourceInput);
    if (destinationInput) setupAutoComplete(destinationInput);

    // Handle swap button functionality
    const swapBtn = document.querySelector('.swap-btn');
    if (swapBtn) {
        swapBtn.addEventListener('click', function () {
            const sourceValue = sourceInput.value;
            sourceInput.value = destinationInput.value;
            destinationInput.value = sourceValue;
        });
    }

    // Handle search form submission
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const source = sourceInput.value.trim();
            const destination = destinationInput.value.trim();
            const date = journeyDateInput.value;
            const passengers = document.getElementById('passengers').value;

            // Validate inputs
            if (!source) {
                alert('Please enter source station');
                return;
            }

            if (!destination) {
                alert('Please enter destination station');
                return;
            }

            if (source === destination) {
                alert('Source and destination cannot be the same');
                return;
            }

            // Store search params in session storage
            sessionStorage.setItem('trainSearch', JSON.stringify({
                source,
                destination,
                date,
                passengers
            }));

            // Redirect to trains listing page
            window.location.href = 'pages/trains.html';
        });
    }

    // Popular route card click handlers
    const bookNowButtons = document.querySelectorAll('.book-now-btn');
    bookNowButtons.forEach(button => {
        button.addEventListener('click', function () {
            const routeCard = this.closest('.route-card');
            const routeInfo = routeCard.querySelector('.route-info h3').textContent;

            // Parse the route info (e.g., "Mumbai to Delhi")
            const [source, destination] = routeInfo.split(' to ');

            // Store search params and redirect to trains page
            sessionStorage.setItem('trainSearch', JSON.stringify({
                source,
                destination,
                date: journeyDateInput.value,
                passengers: '1'
            }));

            window.location.href = 'pages/trains.html';
        });
    });
}); 
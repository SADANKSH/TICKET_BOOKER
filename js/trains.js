// Trains listing JavaScript file for GOZibiboGo

document.addEventListener('DOMContentLoaded', function() {
    // Get search parameters from session storage
    const searchParams = JSON.parse(sessionStorage.getItem('trainSearch') || '{}');
    
    // Update the search display with stored parameters
    updateSearchDisplay(searchParams);
    
    // Handle modify search button
    const modifySearchBtn = document.getElementById('modify-search-btn');
    if (modifySearchBtn) {
        modifySearchBtn.addEventListener('click', function() {
            // Redirect back to home page
            window.location.href = '../index.html';
        });
    }
    
    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            
            // Apply filter to train cards
            applyFilter(filter);
        });
    });
    
    // Sort functionality
    const sortSelect = document.getElementById('sort-trains');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            sortTrains(sortBy);
        });
    }
    
    // Train card action buttons
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const trainCard = this.closest('.train-card');
            toggleTrainDetails(trainCard);
        });
    });
    
    const bookBtns = document.querySelectorAll('.book-btn');
    bookBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const trainCard = this.closest('.train-card');
            bookTrain(trainCard);
        });
    });
    
    // Update search display with stored parameters
    function updateSearchDisplay(params) {
        if (!params.source || !params.destination) return;
        
        const sourceElement = document.getElementById('source-display');
        const destinationElement = document.getElementById('destination-display');
        const dateElement = document.getElementById('date-display');
        const passengersElement = document.getElementById('passengers-display');
        
        if (sourceElement) sourceElement.textContent = params.source;
        if (destinationElement) destinationElement.textContent = params.destination;
        
        if (dateElement && params.date) {
            // Format date for display (e.g., "29 Mar, 2023")
            const date = new Date(params.date);
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            dateElement.textContent = date.toLocaleDateString('en-US', options);
        }
        
        if (passengersElement && params.passengers) {
            const passengerCount = parseInt(params.passengers);
            passengersElement.textContent = `${passengerCount} ${passengerCount === 1 ? 'Passenger' : 'Passengers'}`;
        }
    }
    
    // Apply filter to train cards
    function applyFilter(filter) {
        const trainCards = document.querySelectorAll('.train-card');
        
        trainCards.forEach(card => {
            // For demo, we're showing all cards for all filters
            // In a real app, we would have classes on cards for different train types
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                // For demo, randomly show/hide cards for different filters
                const randomShow = Math.random() > 0.3;
                card.style.display = randomShow ? 'block' : 'none';
            }
        });
    }
    
    // Sort trains list
    function sortTrains(sortBy) {
        const trainsList = document.querySelector('.trains-list');
        const trainCards = Array.from(document.querySelectorAll('.train-card'));
        
        // Sort train cards based on selected option
        trainCards.sort((a, b) => {
            if (sortBy === 'departure') {
                // Sort by departure time
                const timeA = a.querySelector('.departure h4').textContent;
                const timeB = b.querySelector('.departure h4').textContent;
                return timeA.localeCompare(timeB);
            } else if (sortBy === 'duration') {
                // Sort by journey duration
                const durationA = parseDuration(a.querySelector('.duration p').textContent);
                const durationB = parseDuration(b.querySelector('.duration p').textContent);
                return durationA - durationB;
            } else if (sortBy === 'price') {
                // Sort by price (low to high)
                const priceA = parsePrice(a.querySelector('.seat-type .price').textContent);
                const priceB = parsePrice(b.querySelector('.seat-type .price').textContent);
                return priceA - priceB;
            } else if (sortBy === 'price-desc') {
                // Sort by price (high to low)
                const priceA = parsePrice(a.querySelector('.seat-type .price').textContent);
                const priceB = parsePrice(b.querySelector('.seat-type .price').textContent);
                return priceB - priceA;
            }
            
            return 0;
        });
        
        // Remove all train cards from DOM
        trainsList.innerHTML = '';
        
        // Re-append sorted train cards
        trainCards.forEach(card => {
            trainsList.appendChild(card);
        });
    }
    
    // Parse duration string (e.g., "15h 35m") to minutes
    function parseDuration(durationStr) {
        const match = durationStr.match(/(\d+)h\s*(\d+)m/);
        if (match) {
            const hours = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            return hours * 60 + minutes;
        }
        return 0;
    }
    
    // Parse price string (e.g., "₹1,200") to number
    function parsePrice(priceStr) {
        return parseInt(priceStr.replace(/[^\d]/g, ''));
    }
    
    // Toggle train details view
    function toggleTrainDetails(trainCard) {
        // For demo, we'll simply toggle a class
        trainCard.classList.toggle('expanded');
        
        // In a real app, this would expand the card with more details or open a modal
        alert('View details functionality would show more information about the train, including stops, amenities, and cancellation policy.');
    }
    
    // Book train functionality
    function bookTrain(trainCard) {
        // Get train information
        const trainName = trainCard.querySelector('.train-name').textContent;
        const trainType = trainCard.querySelector('.train-type').textContent;
        const departureTime = trainCard.querySelector('.departure h4').textContent;
        const departureStation = trainCard.querySelector('.departure p').textContent;
        const arrivalTime = trainCard.querySelector('.arrival h4').textContent;
        const arrivalStation = trainCard.querySelector('.arrival p').textContent;
        
        // Get selected seat class (for demo, we'll use the first available one)
        let selectedClass = '';
        let price = 0;
        
        const seatTypes = trainCard.querySelectorAll('.seat-type');
        for (const seatType of seatTypes) {
            const availability = seatType.querySelector('p').textContent;
            if (availability === 'Available') {
                selectedClass = seatType.querySelector('h4').textContent;
                price = seatType.querySelector('.price').textContent;
                break;
            }
        }
        
        if (!selectedClass) {
            alert('No available seats on this train. Please select another train.');
            return;
        }
        
        // Store booking data in session storage
        const bookingData = {
            trainName,
            trainType,
            departureTime,
            departureStation,
            departureDate: document.getElementById('date-display').textContent,
            arrivalTime,
            arrivalStation,
            selectedClass,
            price,
            passengers: document.getElementById('passengers-display').textContent
        };
        
        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
        
        // Redirect to booking page
        window.location.href = 'booking.html';
    }
}); 
// My Bookings JavaScript file for GOZibiboGo

document.addEventListener('DOMContentLoaded', function () {
    // Load bookings from localStorage
    const myBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');

    // Render bookings list
    renderBookings(myBookings);

    // Handle filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get filter value
            const filter = this.getAttribute('data-filter');

            // Filter and render bookings
            filterAndRenderBookings(filter);
        });
    });

    // Handle search PNR input
    const searchInput = document.getElementById('search-pnr');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function () {
            const pnr = searchInput.value.trim();
            if (pnr) {
                searchBookingsByPNR(pnr);
            } else {
                // If search field is empty, show all bookings
                renderBookings(myBookings);
            }
        });

        // Also search when Enter key is pressed
        searchInput.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    // Render bookings list
    function renderBookings(bookings) {
        const bookingsList = document.querySelector('.bookings-list');

        if (!bookingsList) return;

        // Clear existing bookings
        bookingsList.innerHTML = '';

        if (bookings.length === 0) {
            bookingsList.innerHTML = `
                <div class="no-bookings">
                    <i class="fas fa-ticket-alt"></i>
                    <h3>No bookings found</h3>
                    <p>You haven't made any bookings yet.</p>
                    <a href="../index.html" class="book-now-link">Book a Train Ticket</a>
                </div>
            `;
            return;
        }

        // Render each booking
        bookings.forEach(booking => {
            const bookingCard = createBookingCard(booking);
            bookingsList.appendChild(bookingCard);
        });

        // Add event listeners to action buttons
        addActionButtonListeners();
    }

    // Create a booking card element
    function createBookingCard(booking) {
        const bookingCard = document.createElement('div');
        bookingCard.className = `booking-card ${booking.status}`;

        // Format booking date
        const bookingDate = new Date(booking.bookingDate);
        const formattedBookingDate = bookingDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        const trainInfo = booking.booking.trainName;
        const fromCity = booking.booking.departureStation.split('(')[0].trim();
        const toCity = booking.booking.arrivalStation.split('(')[0].trim();
        const departureTime = booking.booking.departureTime;
        const arrivalTime = booking.booking.arrivalTime;
        const departureDate = booking.booking.departureDate;

        // Calculate arrival date based on departure date
        const arrivalDate = getNextDay(departureDate);

        // Calculate duration
        const duration = booking.booking.duration || '15h 35m'; // Default if not available

        // Get passenger count
        const passengerCount = booking.passengers?.passengers?.length || 1;

        // Get fare
        const fare = booking.passengers?.fareDetails?.totalFare || '₹2,714';

        bookingCard.innerHTML = `
            <div class="booking-status">
                <span class="status-badge ${booking.status}">${capitalizeFirstLetter(booking.status)}</span>
                <span class="booking-date">Booked on: ${formattedBookingDate}</span>
            </div>
            
            <div class="booking-details">
                <div class="train-info">
                    <h3>${trainInfo}</h3>
                    <div class="journey-details">
                        <div class="from-to">
                            <div class="station">
                                <p class="city">${fromCity}</p>
                                <p class="time">${departureTime}</p>
                                <p class="date">${departureDate}</p>
                            </div>
                            <div class="journey-duration">
                                <div class="duration-line"></div>
                                <p>${duration}</p>
                            </div>
                            <div class="station">
                                <p class="city">${toCity}</p>
                                <p class="time">${arrivalTime}</p>
                                <p class="date">${arrivalDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="booking-info">
                    <div class="info-item">
                        <span class="label">PNR:</span>
                        <span class="value">${booking.pnr}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Passengers:</span>
                        <span class="value">${passengerCount}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Class:</span>
                        <span class="value">${booking.booking.selectedClass}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">${booking.status === 'cancelled' ? 'Refund Status:' : 'Amount Paid:'}</span>
                        <span class="value ${booking.status === 'cancelled' ? 'refund-success' : ''}">${booking.status === 'cancelled' ? 'Refunded ' + fare : fare}</span>
                    </div>
                </div>
            </div>
            
            <div class="booking-actions">
                <button class="view-btn" data-pnr="${booking.pnr}">View Details</button>
                ${booking.status === 'upcoming' ? '<button class="cancel-btn" data-pnr="' + booking.pnr + '">Cancel Ticket</button>' : ''}
                <button class="download-btn" data-pnr="${booking.pnr}">${booking.status === 'cancelled' ? 'Download Cancellation' : 'Download E-Ticket'}</button>
                ${booking.status === 'completed' ? '<button class="review-btn" data-pnr="' + booking.pnr + '">Write Review</button>' : ''}
                ${booking.status === 'cancelled' ? '<button class="rebook-btn" data-pnr="' + booking.pnr + '">Book Again</button>' : ''}
            </div>
        `;

        return bookingCard;
    }

    // Add event listeners to booking action buttons
    function addActionButtonListeners() {
        // View details buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const pnr = this.getAttribute('data-pnr');
                viewBookingDetails(pnr);
            });
        });

        // Cancel ticket buttons
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const pnr = this.getAttribute('data-pnr');
                cancelTicket(pnr);
            });
        });

        // Download buttons
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const pnr = this.getAttribute('data-pnr');
                downloadTicket(pnr);
            });
        });

        // Review buttons
        document.querySelectorAll('.review-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const pnr = this.getAttribute('data-pnr');
                writeReview(pnr);
            });
        });

        // Rebook buttons
        document.querySelectorAll('.rebook-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const pnr = this.getAttribute('data-pnr');
                rebookTicket(pnr);
            });
        });
    }

    // Filter and render bookings
    function filterAndRenderBookings(filter) {
        let filteredBookings;

        if (filter === 'all') {
            filteredBookings = myBookings;
        } else {
            filteredBookings = myBookings.filter(booking => booking.status === filter);
        }

        renderBookings(filteredBookings);
    }

    // Search bookings by PNR
    function searchBookingsByPNR(pnr) {
        const filteredBookings = myBookings.filter(booking =>
            booking.pnr.toString().includes(pnr)
        );

        renderBookings(filteredBookings);
    }

    // View booking details
    function viewBookingDetails(pnr) {
        const booking = myBookings.find(b => b.pnr.toString() === pnr);

        if (!booking) {
            alert('Booking not found');
            return;
        }

        // In a real app, we would redirect to a booking details page or show a modal
        // For demo, we'll just redirect to the confirmation page with the booking data
        sessionStorage.setItem('bookingConfirmation', JSON.stringify(booking));
        window.location.href = 'confirmation.html';
    }

    // Cancel ticket
    function cancelTicket(pnr) {
        const bookingIndex = myBookings.findIndex(b => b.pnr.toString() === pnr);

        if (bookingIndex === -1) {
            alert('Booking not found');
            return;
        }

        // Ask for confirmation
        if (!confirm('Are you sure you want to cancel this ticket? Cancellation charges may apply.')) {
            return;
        }

        // Update booking status to cancelled
        myBookings[bookingIndex].status = 'cancelled';

        // Save updated bookings
        localStorage.setItem('myBookings', JSON.stringify(myBookings));

        // Re-render bookings
        filterAndRenderBookings('all');

        // Show success message
        alert('Ticket cancelled successfully. Refund has been initiated.');
    }

    // Download ticket
    function downloadTicket(pnr) {
        const booking = myBookings.find(b => b.pnr.toString() === pnr);

        if (!booking) {
            alert('Booking not found');
            return;
        }

        // In a real app, this would generate and download a PDF
        alert(`Downloading ${booking.status === 'cancelled' ? 'cancellation receipt' : 'e-ticket'} for PNR: ${pnr}`);
    }

    // Write review
    function writeReview(pnr) {
        const booking = myBookings.find(b => b.pnr.toString() === pnr);

        if (!booking) {
            alert('Booking not found');
            return;
        }

        // For demo, we'll just show a prompt
        const rating = prompt('Rate your journey from 1 to 5 stars:', '5');

        if (rating) {
            const feedback = prompt('Do you have any feedback about your journey?');

            // In a real app, this would send the review to a server
            alert('Thank you for your feedback!');
        }
    }

    // Rebook ticket
    function rebookTicket(pnr) {
        const booking = myBookings.find(b => b.pnr.toString() === pnr);

        if (!booking) {
            alert('Booking not found');
            return;
        }

        // Store the journey details in session storage
        sessionStorage.setItem('trainSearch', JSON.stringify({
            source: booking.booking.departureStation.split('(')[0].trim(),
            destination: booking.booking.arrivalStation.split('(')[0].trim(),
            date: getTomorrowDateString(), // Set to tomorrow for new booking
            passengers: booking.passengers.passengers.length.toString()
        }));

        // Redirect to trains page
        window.location.href = 'trains.html';
    }

    // Helper function to get tomorrow's date as YYYY-MM-DD
    function getTomorrowDateString() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    // Helper function to get next day from a date string
    function getNextDay(dateStr) {
        // Parse the date string (e.g., "29 Mar, 2023")
        const parts = dateStr.split(',');
        if (parts.length !== 2) return dateStr;

        const dayMonth = parts[0].trim().split(' ');
        if (dayMonth.length !== 2) return dateStr;

        const day = parseInt(dayMonth[0]);
        const month = dayMonth[1];
        const year = parts[1].trim();

        // Return the next day
        return `${day + 1} ${month}, ${year}`;
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}); 
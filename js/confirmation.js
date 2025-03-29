// Confirmation JavaScript file for GOZibiboGo

document.addEventListener('DOMContentLoaded', function () {
    // Get booking confirmation data from session storage
    const bookingConfirmation = JSON.parse(sessionStorage.getItem('bookingConfirmation') || '{}');

    // Check if we have confirmation data, if not redirect to home
    if (!bookingConfirmation.bookingId) {
        window.location.href = '../index.html';
        return;
    }

    // Update the confirmation page with booking details
    updateConfirmationDetails(bookingConfirmation);

    // Handle ticket action buttons
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            // In a real app, this would generate and download a PDF
            alert('Downloading ticket...');

            // For demo, simulate download delay
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';

            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-download"></i> Download Ticket';
                alert('Ticket downloaded successfully!');
            }, 2000);
        });
    }

    const emailBtn = document.querySelector('.email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', function () {
            // Get email from booking data
            const email = bookingConfirmation.passengers?.contactDetails?.email || '';

            // For demo, just show alert
            alert(`Ticket sent to ${email}`);

            // Show loading state
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-envelope"></i> Email Ticket';
                alert('Ticket sent successfully!');
            }, 1500);
        });
    }

    const printBtn = document.querySelector('.print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function () {
            // Print the ticket
            window.print();
        });
    }

    // Update confirmation details with booking data
    function updateConfirmationDetails(data) {
        // Update booking ID and PNR
        document.querySelector('.booking-id p:nth-child(1) span').textContent = data.bookingId;
        document.querySelector('.booking-id p:nth-child(2) span').textContent = data.pnr;

        // Update train details
        const booking = data.booking;
        document.querySelector('.detail-item:nth-child(1) .value').textContent = booking.trainName.split('(')[0].trim();
        document.querySelector('.detail-item:nth-child(2) .value').textContent = booking.trainName.match(/\(([^)]+)\)/)?.[1] || '';
        document.querySelector('.detail-item:nth-child(3) .value').textContent = booking.selectedClass;
        document.querySelector('.detail-item:nth-child(4) .value').textContent = booking.departureStation;
        document.querySelector('.detail-item:nth-child(5) .value').textContent = booking.arrivalStation;
        document.querySelector('.detail-item:nth-child(6) .value').textContent = booking.departureDate;
        document.querySelector('.detail-item:nth-child(7) .value').textContent = booking.departureTime;
        document.querySelector('.detail-item:nth-child(8) .value').textContent = booking.arrivalTime + ' (' + getNextDay(booking.departureDate) + ')';

        // Update passenger details
        updatePassengerTable(data.passengers);

        // Update fare details
        const fareDetails = data.passengers.fareDetails;
        if (fareDetails) {
            document.querySelector('.fare-details .detail-item:nth-child(1) .value').textContent = fareDetails.baseFare;
            document.querySelector('.fare-details .detail-item:nth-child(2) .value').textContent = fareDetails.reservationCharge;
            document.querySelector('.fare-details .detail-item:nth-child(3) .value').textContent = fareDetails.superfastCharge;
            document.querySelector('.fare-details .detail-item:nth-child(4) .value').textContent = fareDetails.gst;
            document.querySelector('.fare-details .detail-item.total .value').textContent = fareDetails.totalFare;
        }
    }

    // Update passenger table with passenger data
    function updatePassengerTable(passengerData) {
        if (!passengerData.passengers || !passengerData.passengers.length) return;

        const tableBody = document.querySelector('.passenger-table tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        passengerData.passengers.forEach((passenger, index) => {
            // Generate random seat number and berth for demo
            const coach = ['A', 'B', 'S', 'B'][Math.floor(Math.random() * 4)] + Math.floor(Math.random() * 9 + 1);
            const seatNum = Math.floor(Math.random() * 72 + 1);
            const berth = passenger.berthPreference || ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'][Math.floor(Math.random() * 5)];

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${passenger.name}</td>
                <td>${passenger.age}</td>
                <td>${passenger.gender}</td>
                <td>${coach}-${seatNum}, ${berth}</td>
                <td>Confirmed</td>
            `;

            tableBody.appendChild(row);
        });
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

    // Store booking in localStorage for "My Bookings" page
    function storeBookingHistory() {
        // Get existing bookings
        const existingBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');

        // Add current booking with status
        const newBooking = {
            ...bookingConfirmation,
            status: 'upcoming',
            bookingDate: new Date().toISOString()
        };

        // Add to start of array
        existingBookings.unshift(newBooking);

        // Store back in localStorage
        localStorage.setItem('myBookings', JSON.stringify(existingBookings));
    }

    // Call function to store booking
    storeBookingHistory();
}); 
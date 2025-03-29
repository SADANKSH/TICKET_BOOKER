// Payment JavaScript file for GOZibiboGo

document.addEventListener('DOMContentLoaded', function () {
    // Get booking and passenger data from session storage
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || '{}');
    const passengerData = JSON.parse(sessionStorage.getItem('passengerData') || '{}');

    // Check if we have necessary data, if not redirect to home
    if (!bookingData.trainName || !passengerData.passengers) {
        window.location.href = '../index.html';
        return;
    }

    // Update order summary with booking details
    updateOrderSummary(bookingData, passengerData);

    // Handle payment tabs
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active class from all tabs
            tabItems.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Get tab id to show
            const tabId = this.getAttribute('data-tab');

            // Hide all tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });

            // Show selected tab pane
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Handle card form inputs
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        // Format card number as user types (add spaces every 4 digits)
        cardNumberInput.addEventListener('input', function (e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 16) {
                value = value.slice(0, 16);
            }

            // Add spaces for readability
            const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
            this.value = formattedValue;
        });
    }

    const expiryDateInput = document.getElementById('expiry-date');
    if (expiryDateInput) {
        // Format expiry date as MM/YY
        expiryDateInput.addEventListener('input', function (e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 4) {
                value = value.slice(0, 4);
            }

            if (value.length > 2) {
                const month = value.slice(0, 2);
                const year = value.slice(2);
                this.value = `${month}/${year}`;
            } else {
                this.value = value;
            }
        });
    }

    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        // Restrict CVV to 3 digits
        cvvInput.addEventListener('input', function (e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 3);
        });
    }

    // Handle UPI ID validation
    const upiInput = document.getElementById('upi-id');
    if (upiInput) {
        upiInput.addEventListener('blur', function () {
            const value = this.value.trim();
            if (value && !validateUpiId(value)) {
                alert('Please enter a valid UPI ID (e.g., name@upi)');
            }
        });
    }

    // Handle payment button
    const payButton = document.getElementById('pay-now-btn');
    if (payButton) {
        payButton.addEventListener('click', function () {
            processPayment();
        });
    }

    // Function to update order summary
    function updateOrderSummary(booking, passenger) {
        // Update journey summary
        document.querySelector('.summary-item:nth-child(1) span:last-child').textContent = booking.trainName;
        document.querySelector('.summary-item:nth-child(2) span:last-child').textContent = `${booking.departureStation} → ${booking.arrivalStation}`;
        document.querySelector('.summary-item:nth-child(3) span:last-child').textContent = booking.departureDate;

        // Update passenger count
        const passengerCount = passenger.passengers.length;
        document.querySelector('.summary-item:nth-child(4) span:last-child').textContent = passengerCount;

        // Update class
        document.querySelector('.summary-item:nth-child(5) span:last-child').textContent = booking.selectedClass;

        // Update fare details
        if (passenger.fareDetails) {
            document.querySelector('.fare-row:nth-child(1) span:last-child').textContent = passenger.fareDetails.baseFare;
            document.querySelector('.fare-row:nth-child(2) span:last-child').textContent = passenger.fareDetails.reservationCharge;
            document.querySelector('.fare-row:nth-child(3) span:last-child').textContent = passenger.fareDetails.superfastCharge;
            document.querySelector('.fare-row:nth-child(4) span:last-child').textContent = passenger.fareDetails.gst;
            document.querySelector('.fare-row.total span:last-child').textContent = passenger.fareDetails.totalFare;

            // Update pay button text
            payButton.textContent = `Pay ${passenger.fareDetails.totalFare}`;
        }
    }

    // Function to validate UPI ID
    function validateUpiId(upiId) {
        // Simple validation: should contain @ and some text on both sides
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId);
    }

    // Function to process payment
    function processPayment() {
        // Get active payment method
        const activeTab = document.querySelector('.tab-item.active');
        const paymentMethod = activeTab.getAttribute('data-tab');

        let isValid = false;
        let paymentDetails = {};

        if (paymentMethod === 'credit-card') {
            // Validate card details
            const cardName = document.getElementById('card-name').value.trim();
            const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '');
            const expiryDate = document.getElementById('expiry-date').value;
            const cvv = document.getElementById('cvv').value;

            if (!cardName) {
                alert('Please enter name on card');
                return;
            }

            if (!cardNumber || cardNumber.length < 16) {
                alert('Please enter a valid card number');
                return;
            }

            if (!expiryDate || !expiryDate.includes('/')) {
                alert('Please enter a valid expiry date (MM/YY)');
                return;
            }

            if (!cvv || cvv.length < 3) {
                alert('Please enter a valid CVV');
                return;
            }

            isValid = true;
            paymentDetails = {
                method: 'card',
                cardNumber: `**** **** **** ${cardNumber.slice(-4)}`,
                expiryDate,
                cardHolder: cardName
            };

        } else if (paymentMethod === 'net-banking') {
            // Validate bank selection
            const selectedBank = document.querySelector('input[name="bank"]:checked');
            const otherBank = document.getElementById('other-banks').value;

            if (!selectedBank && !otherBank) {
                alert('Please select a bank');
                return;
            }

            isValid = true;
            paymentDetails = {
                method: 'netbanking',
                bank: selectedBank ? selectedBank.value : otherBank
            };

        } else if (paymentMethod === 'upi') {
            // Validate UPI ID
            const upiId = document.getElementById('upi-id').value.trim();

            if (!upiId) {
                alert('Please enter UPI ID or select a UPI app');
                return;
            }

            if (!validateUpiId(upiId)) {
                alert('Please enter a valid UPI ID');
                return;
            }

            isValid = true;
            paymentDetails = {
                method: 'upi',
                upiId
            };

        } else if (paymentMethod === 'wallet') {
            // Validate wallet selection
            const selectedWallet = document.querySelector('input[name="wallet"]:checked');

            if (!selectedWallet) {
                alert('Please select a wallet');
                return;
            }

            isValid = true;
            paymentDetails = {
                method: 'wallet',
                wallet: selectedWallet.value
            };
        }

        if (isValid) {
            // Show loading state
            payButton.disabled = true;
            payButton.textContent = 'Processing...';

            // For demo, simulate payment processing
            setTimeout(() => {
                // Generate booking details
                const bookingDetails = {
                    bookingId: 'GZBG' + Math.floor(10000000 + Math.random() * 90000000),
                    pnr: Math.floor(1000000000 + Math.random() * 9000000000),
                    booking: JSON.parse(sessionStorage.getItem('bookingData')),
                    passengers: JSON.parse(sessionStorage.getItem('passengerData')),
                    payment: {
                        ...paymentDetails,
                        amount: document.querySelector('.fare-row.total span:last-child').textContent,
                        status: 'Confirmed',
                        timestamp: new Date().toISOString()
                    }
                };

                // Store booking details for confirmation page
                sessionStorage.setItem('bookingConfirmation', JSON.stringify(bookingDetails));

                // Redirect to confirmation page
                window.location.href = 'confirmation.html';
            }, 2000);
        }
    }
}); 
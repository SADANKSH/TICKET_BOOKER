// Booking JavaScript file for GOZibiboGo

document.addEventListener('DOMContentLoaded', function () {
    // Get booking data from session storage
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || '{}');

    // Check if we have booking data, if not redirect to home
    if (!bookingData.trainName) {
        window.location.href = '../index.html';
        return;
    }

    // Update the journey details with booking data
    updateJourneyDetails(bookingData);

    // Handle back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            // Go back to trains listing
            window.location.href = 'trains.html';
        });
    }

    // Handle add passenger button
    const addPassengerBtn = document.getElementById('add-passenger-btn');
    if (addPassengerBtn) {
        addPassengerBtn.addEventListener('click', function () {
            addPassengerForm();
        });
    }

    // Handle continue to payment button
    const continueBtn = document.querySelector('.continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Validate passenger details before proceeding
            if (validatePassengerDetails()) {
                // Store passenger details
                storePassengerDetails();

                // Redirect to payment page
                window.location.href = 'payment.html';
            }
        });
    }

    // Update journey details on the page
    function updateJourneyDetails(data) {
        // Update train name and type
        const trainInfoElement = document.querySelector('.train-info h3');
        if (trainInfoElement) {
            trainInfoElement.textContent = data.trainName;
        }

        const trainTypeElement = document.querySelector('.train-type');
        if (trainTypeElement) {
            trainTypeElement.textContent = data.trainType;
            trainTypeElement.className = 'train-type ' + data.trainType.toLowerCase().replace(/\s+/g, '-');
        }

        // Update departure details
        const departureTimeElement = document.querySelector('.journey-stations .station:first-child h4');
        if (departureTimeElement) {
            departureTimeElement.textContent = data.departureTime;
        }

        const departureStationElement = document.querySelector('.journey-stations .station:first-child p:first-of-type');
        if (departureStationElement) {
            departureStationElement.textContent = data.departureStation;
        }

        const departureDateElement = document.querySelector('.journey-stations .station:first-child .date');
        if (departureDateElement) {
            departureDateElement.textContent = data.departureDate;
        }

        // Update arrival details
        const arrivalTimeElement = document.querySelector('.journey-stations .station:last-child h4');
        if (arrivalTimeElement) {
            arrivalTimeElement.textContent = data.arrivalTime;
        }

        const arrivalStationElement = document.querySelector('.journey-stations .station:last-child p:first-of-type');
        if (arrivalStationElement) {
            arrivalStationElement.textContent = data.arrivalStation;
        }

        // Calculate and set arrival date (for demo, we'll just use the next day)
        const arrivalDateElement = document.querySelector('.journey-stations .station:last-child .date');
        if (arrivalDateElement) {
            // Parse departure date and add 1 day for arrival
            const dateParts = data.departureDate.split(',');
            if (dateParts.length === 2) {
                const day = parseInt(dateParts[0].trim().split(' ')[0]);
                const monthYear = dateParts[0].trim().split(' ')[1] + ',' + dateParts[1].trim();

                // For demo, just add 1 to the day
                arrivalDateElement.textContent = (day + 1) + ' ' + monthYear;
            } else {
                arrivalDateElement.textContent = data.departureDate; // Fallback
            }
        }

        // Update journey duration
        const durationElement = document.querySelector('.journey-duration p');
        if (durationElement && data.duration) {
            durationElement.textContent = data.duration;
        }

        // Update selected class
        const classInfoElement = document.querySelector('.class-info h4');
        if (classInfoElement) {
            classInfoElement.textContent = data.selectedClass;
        }

        // Update price
        const priceInfoElement = document.querySelector('.price-info h4');
        if (priceInfoElement) {
            priceInfoElement.textContent = data.price;
        }

        // Update fare details
        const baseFareElement = document.querySelector('.fare-details .fare-row:nth-child(1) span:last-child');
        if (baseFareElement) {
            baseFareElement.textContent = data.price;
        }

        // Calculate total fare based on base fare
        updateTotalFare();
    }

    // Add a new passenger form
    function addPassengerForm() {
        const passengerContainer = document.querySelector('.booking-form');
        const existingPassengers = document.querySelectorAll('.passenger-container');
        const newPassengerNum = existingPassengers.length + 1;

        // Check for passenger limit
        if (newPassengerNum > 5) {
            alert('Maximum 5 passengers allowed per booking');
            return;
        }

        // Create new passenger form
        const newPassengerHtml = `
            <div class="passenger-container" id="passenger-${newPassengerNum}">
                <h3>Passenger ${newPassengerNum} <button type="button" class="remove-passenger" data-passenger="${newPassengerNum}">Remove</button></h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="name-${newPassengerNum}">Full Name</label>
                        <input type="text" id="name-${newPassengerNum}" name="name-${newPassengerNum}" placeholder="Enter full name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="age-${newPassengerNum}">Age</label>
                        <input type="number" id="age-${newPassengerNum}" name="age-${newPassengerNum}" min="1" max="120" placeholder="Age" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="gender-${newPassengerNum}">Gender</label>
                        <select id="gender-${newPassengerNum}" name="gender-${newPassengerNum}" required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="berth-${newPassengerNum}">Berth Preference</label>
                        <select id="berth-${newPassengerNum}" name="berth-${newPassengerNum}">
                            <option value="">No Preference</option>
                            <option value="lower">Lower</option>
                            <option value="middle">Middle</option>
                            <option value="upper">Upper</option>
                            <option value="side-lower">Side Lower</option>
                            <option value="side-upper">Side Upper</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group full-width">
                        <label for="id-proof-${newPassengerNum}">ID Proof</label>
                        <select id="id-proof-${newPassengerNum}" name="id-proof-${newPassengerNum}" required>
                            <option value="">Select ID Type</option>
                            <option value="aadhar">Aadhar Card</option>
                            <option value="pan">PAN Card</option>
                            <option value="passport">Passport</option>
                            <option value="driving">Driving License</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group full-width">
                        <label for="id-number-${newPassengerNum}">ID Number</label>
                        <input type="text" id="id-number-${newPassengerNum}" name="id-number-${newPassengerNum}" placeholder="Enter ID number" required>
                    </div>
                </div>
            </div>
        `;

        // Insert the new passenger form before the add passenger button
        const addPassengerDiv = document.querySelector('.add-passenger');
        addPassengerDiv.insertAdjacentHTML('beforebegin', newPassengerHtml);

        // Update total fare
        updateTotalFare(newPassengerNum);

        // Add event listener for remove button
        document.querySelector(`button[data-passenger="${newPassengerNum}"]`).addEventListener('click', function () {
            removePassenger(newPassengerNum);
        });
    }

    // Remove a passenger form
    function removePassenger(passengerNum) {
        const passengerElement = document.getElementById(`passenger-${passengerNum}`);
        if (passengerElement) {
            passengerElement.remove();

            // Renumber remaining passengers
            const passengerContainers = document.querySelectorAll('.passenger-container');
            passengerContainers.forEach((container, index) => {
                const num = index + 1;
                container.id = `passenger-${num}`;
                container.querySelector('h3').innerHTML = `Passenger ${num} ${num > 1 ? `<button type="button" class="remove-passenger" data-passenger="${num}">Remove</button>` : ''}`;

                // Update form element IDs and names
                container.querySelectorAll('[id^=name-], [id^=age-], [id^=gender-], [id^=berth-], [id^=id-proof-], [id^=id-number-]').forEach(elem => {
                    const fieldName = elem.id.split('-')[0];
                    elem.id = `${fieldName}-${num}`;
                    elem.name = `${fieldName}-${num}`;
                });

                // Update remove button data attribute
                const removeBtn = container.querySelector('.remove-passenger');
                if (removeBtn) {
                    removeBtn.setAttribute('data-passenger', num);

                    // Remove old event listener and add new one
                    removeBtn.replaceWith(removeBtn.cloneNode(true));
                    container.querySelector('.remove-passenger').addEventListener('click', function () {
                        removePassenger(num);
                    });
                }
            });

            // Update total fare
            updateTotalFare();
        }
    }

    // Update total fare based on number of passengers
    function updateTotalFare() {
        const passengerCount = document.querySelectorAll('.passenger-container').length;
        const baseFareElement = document.querySelector('.fare-details .fare-row:nth-child(1) span:last-child');
        const reservationElement = document.querySelector('.fare-details .fare-row:nth-child(2) span:last-child');
        const superfastElement = document.querySelector('.fare-details .fare-row:nth-child(3) span:last-child');
        const gstElement = document.querySelector('.fare-details .fare-row:nth-child(4) span:last-child');
        const totalElement = document.querySelector('.fare-details .fare-row.total span:last-child');

        if (!baseFareElement || !totalElement) return;

        // Get base fare
        const baseFare = parsePrice(baseFareElement.textContent);

        // Calculate charges
        const baseTotal = baseFare * passengerCount;
        const reservationCharge = 40 * passengerCount;
        const superfastCharge = 45 * passengerCount;
        const subtotal = baseTotal + reservationCharge + superfastCharge;
        const gst = Math.round(subtotal * 0.05); // 5% GST
        const total = subtotal + gst;

        // Update UI
        baseFareElement.textContent = `₹${baseTotal}`;
        if (reservationElement) reservationElement.textContent = `₹${reservationCharge}`;
        if (superfastElement) superfastElement.textContent = `₹${superfastCharge}`;
        if (gstElement) gstElement.textContent = `₹${gst}`;
        totalElement.textContent = `₹${total}`;
    }

    // Parse price string (e.g., "₹1,200") to number
    function parsePrice(priceStr) {
        return parseInt(priceStr.replace(/[^\d]/g, ''));
    }

    // Validate passenger details before proceeding
    function validatePassengerDetails() {
        const passengers = document.querySelectorAll('.passenger-container');
        let isValid = true;

        passengers.forEach((passenger, index) => {
            const num = index + 1;
            const name = document.getElementById(`name-${num}`).value.trim();
            const age = document.getElementById(`age-${num}`).value.trim();
            const gender = document.getElementById(`gender-${num}`).value;
            const idProof = document.getElementById(`id-proof-${num}`).value;
            const idNumber = document.getElementById(`id-number-${num}`).value.trim();

            if (!name) {
                alert(`Please enter the name for Passenger ${num}`);
                isValid = false;
                return;
            }

            if (!age) {
                alert(`Please enter the age for Passenger ${num}`);
                isValid = false;
                return;
            }

            if (!gender) {
                alert(`Please select gender for Passenger ${num}`);
                isValid = false;
                return;
            }

            if (!idProof) {
                alert(`Please select ID proof type for Passenger ${num}`);
                isValid = false;
                return;
            }

            if (!idNumber) {
                alert(`Please enter the ID number for Passenger ${num}`);
                isValid = false;
                return;
            }
        });

        // Validate contact details
        const contactEmail = document.getElementById('contact-email').value.trim();
        const contactPhone = document.getElementById('contact-phone').value.trim();

        if (!contactEmail) {
            alert('Please enter contact email');
            isValid = false;
            return;
        }

        if (!validateEmail(contactEmail)) {
            alert('Please enter a valid email address');
            isValid = false;
            return;
        }

        if (!contactPhone) {
            alert('Please enter contact phone number');
            isValid = false;
            return;
        }

        if (!validatePhone(contactPhone)) {
            alert('Please enter a valid phone number');
            isValid = false;
            return;
        }

        return isValid;
    }

    // Store passenger details for the next step
    function storePassengerDetails() {
        const passengers = document.querySelectorAll('.passenger-container');
        const passengerData = [];

        passengers.forEach((passenger, index) => {
            const num = index + 1;
            passengerData.push({
                name: document.getElementById(`name-${num}`).value.trim(),
                age: document.getElementById(`age-${num}`).value.trim(),
                gender: document.getElementById(`gender-${num}`).value,
                berthPreference: document.getElementById(`berth-${num}`).value,
                idProofType: document.getElementById(`id-proof-${num}`).value,
                idNumber: document.getElementById(`id-number-${num}`).value.trim()
            });
        });

        const contactDetails = {
            email: document.getElementById('contact-email').value.trim(),
            phone: document.getElementById('contact-phone').value.trim()
        };

        // Get fare details
        const fareDetails = {
            baseFare: document.querySelector('.fare-details .fare-row:nth-child(1) span:last-child').textContent,
            reservationCharge: document.querySelector('.fare-details .fare-row:nth-child(2) span:last-child').textContent,
            superfastCharge: document.querySelector('.fare-details .fare-row:nth-child(3) span:last-child').textContent,
            gst: document.querySelector('.fare-details .fare-row:nth-child(4) span:last-child').textContent,
            totalFare: document.querySelector('.fare-details .fare-row.total span:last-child').textContent
        };

        // Store in session storage for payment page
        sessionStorage.setItem('passengerData', JSON.stringify({
            passengers: passengerData,
            contactDetails,
            fareDetails
        }));
    }

    // Helper function to validate email format
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    // Helper function to validate phone number (simple validation for demo)
    function validatePhone(phone) {
        const re = /^\d{10}$/; // Simple 10-digit validation
        return re.test(phone.replace(/[^0-9]/g, '')); // Remove non-digits
    }
}); 
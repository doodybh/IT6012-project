document.addEventListener("DOMContentLoaded", () => {
    console.log("JS loaded");
});

// ---------------------------
// PRE-SELECT DOCTOR FROM URL
// ---------------------------
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const doctorName = params.get('doctor');

    if (doctorName) {
        const doctorInput = document.getElementById('appointmentDoctor');
        if (doctorInput) doctorInput.value = doctorName;

        const modalTitle = document.getElementById('appointmentModalLabel');
        if (modalTitle) modalTitle.innerText = `Book Appointment with ${doctorName}`;

        // Optional: scroll to the doctor's card
        const card = document.querySelector(`.card[data-name="${doctorName}"]`);
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
});




// ---------------------------
// SIGN-IN SYSTEM
// ---------------------------
function openSignIn() {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'flex';
}

(() => {
    'use strict';

    const form = document.getElementById('signInForm');
    if (!form) return;
    const submitBtn = form.querySelector('button[type="submit"]');
    const errorBox = document.getElementById('errorMessage');
    const successBox = document.getElementById('successMessage');

    const controls = [
        { el: document.getElementById('firstName'), pattern: /^[A-Za-z\s'-]{3,}$/, error: "First Name must be at least 3 characters." },
        { el: document.getElementById('lastName'), pattern: /^[A-Za-z\s'-]{3,}$/, error: "Last Name must be at least 3 characters." },
        { el: document.getElementById('phoneNumber'), pattern: /^[0-9]{8}$/, error: "Phone Number must contain exactly 8 digits." },
        { el: document.getElementById('email'), pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: "Please enter a valid email." }
    ];

    submitBtn.disabled = true;

    const updateValidationClass = (control) => {
        const value = control.el.value.trim();
        if (value === "") {
            control.el.classList.remove("is-valid", "is-invalid");
        } else if (control.pattern.test(value)) {
            control.el.classList.add("is-valid");
            control.el.classList.remove("is-invalid");
        } else {
            control.el.classList.add("is-invalid");
            control.el.classList.remove("is-valid");
        }
    };

    const validateForm = () => {
        let allValid = true;
        controls.forEach(c => {
            updateValidationClass(c);
            if (!c.pattern.test(c.el.value.trim())) allValid = false;
        });
        submitBtn.disabled = !allValid;
    };

    controls.forEach(control => {
        control.el.addEventListener('input', validateForm);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let firstError = "";
        controls.forEach(c => {
            if (!c.pattern.test(c.el.value.trim()) && !firstError) {
                firstError = c.error;
            }
        });

        if (firstError) {
            errorBox.innerText = firstError;
            successBox.innerText = "";
            return;
        }

        const first = document.getElementById('firstName').value.trim();
        const last = document.getElementById('lastName').value.trim();
        const fullName = `${first} ${last}`;

        successBox.innerText = `Welcome, ${fullName}! Sign-in successful.`;
        localStorage.setItem("username", fullName);

        const greeting = document.getElementById('userGreeting');
        if (greeting) greeting.innerText = `Welcome, ${fullName}`;

        setTimeout(() => {
            const modal = document.getElementById('modal');
            if (modal) modal.style.display = 'none';
        }, 1500);

        form.reset();
        controls.forEach(c => {
            c.el.classList.remove("is-valid", "is-invalid");
        });
        submitBtn.disabled = true;
        errorBox.innerText = "";
    });

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modal');
        if (modal && e.target === modal) modal.style.display = 'none';
    });

    validateForm();
})();


// ---------------------------
// POPUPS
// ---------------------------

const popupOverlayEl = document.getElementById('popupOverlay');
if (popupOverlayEl) {
    popupOverlayEl.onclick = function (e) {
        if (e.target.id === 'popupOverlay') closePopup();
    };
}

// ---------------------------
// APPOINTMENT MODAL
// ---------------------------
let appointmentModal = null;

window.addEventListener('DOMContentLoaded', function () {
    const name = localStorage.getItem("username");
    const greeting = document.getElementById("userGreeting");
    if (name && greeting) greeting.innerText = `Welcome, ${name}`;

    const appointmentModalEl = document.getElementById('appointmentModal');
    if (appointmentModalEl) {
        appointmentModal = new bootstrap.Modal(appointmentModalEl, { backdrop: 'static', keyboard: false });
    }

    const carouselElement = document.querySelector('#mainCarousel');
    if (carouselElement) {
        new bootstrap.Carousel(carouselElement, { interval: 5000, ride: 'carousel' });
    }
    const patientNameInput = document.getElementById('patientName');
    if (name && patientNameInput) {
        patientNameInput.value = name;
    }


    // ---------------------------
    // APPOINTMENT FORM VALIDATION
    // ---------------------------
    const form = document.getElementById('appointmentForm');
    if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');

        const createErrorBox = (el) => {
            let box = document.createElement('div');
            box.className = 'error-box';
            el.parentNode.appendChild(box);
            return box;
        };

        const controls = [
            { el: document.getElementById('patientName'), pattern: /^[A-Za-z\s'-]{3,}$/, error: "Name must be at least 3 characters.", box: null },
            { el: document.getElementById('patientCPR'), pattern: /^[0-9]{9}$/, error: "CPR must be exactly 9 digits.", box: null },
            { el: document.getElementById('appointmentDate'), pattern: /^\d{4}-\d{2}-\d{2}$/, error: "Please select a valid date.", box: null },
            { el: document.getElementById('appointmentReason'), pattern: /^.{5,}$/, error: "Reason must be at least 5 characters.", box: null }
        ];

        controls.forEach(c => c.box = createErrorBox(c.el));
        submitBtn.disabled = true;

        const updateValidationClass = (control) => {
            const value = control.el.value.trim();
            if (value === "") {
                control.el.classList.remove("is-valid", "is-invalid");
                control.box.innerText = "";
            } else if (control.pattern.test(value)) {
                control.el.classList.add("is-valid");
                control.el.classList.remove("is-invalid");
                control.box.innerText = "";
            } else {
                control.el.classList.add("is-invalid");
                control.el.classList.remove("is-valid");
                control.box.innerText = control.error;
            }
        };

        const validateForm = () => {
            let allValid = true;
            controls.forEach(c => {
                updateValidationClass(c);
                if (!c.pattern.test(c.el.value.trim())) allValid = false;
            });
            submitBtn.disabled = !allValid;
        };

        controls.forEach(c => c.el.addEventListener('input', validateForm));

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const doctor = document.getElementById('appointmentDoctor').value;
            const name = document.getElementById('patientName').value.trim();
            const cpr = document.getElementById('patientCPR').value.trim();
            const date = document.getElementById('appointmentDate').value;
            const reason = document.getElementById('appointmentReason').value.trim();

            const appointment = { doctor, name, cpr, date, reason, bookedAt: new Date().toLocaleString() };
            let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            appointments.push(appointment);
            localStorage.setItem('appointments', JSON.stringify(appointments));

            showPopup("Appointment Booked", `Successfully booked with ${doctor} on ${date}!`);

            form.reset();
            submitBtn.disabled = true;
            controls.forEach(c => {
                c.el.classList.remove("is-valid", "is-invalid");
                c.box.innerText = "";
            });
            appointmentModal.hide();
        });

        validateForm();
    }
});

// ---------------------------
// BUY FORM MODAL
// ---------------------------
function openBuyForm(medicineName) {
    const buyModalEl = document.getElementById('buyModal');
    if (!buyModalEl) return;

    const modalTitle = buyModalEl.querySelector('.modal-title');
    if (modalTitle) modalTitle.innerText = `Buy ${medicineName}`;

    const storedName = localStorage.getItem('username') || '';
    const patientNameInput = buyModalEl.querySelector('#patientName');
    if (patientNameInput) patientNameInput.value = storedName;

    const patientCPRInput = buyModalEl.querySelector('#patientCPR');
    if (patientCPRInput) patientCPRInput.value = '';

    const addressInput = buyModalEl.querySelector('#address');
    if (addressInput) addressInput.value = '';

    const prescriptionInput = buyModalEl.querySelector('#prescription');
    if (prescriptionInput) prescriptionInput.value = '';

    const quantityInput = buyModalEl.querySelector('#amount');
    if (quantityInput) quantityInput.value = 1;

    const totalPriceEl = buyModalEl.querySelector('#totalPrice');
    if (totalPriceEl) totalPriceEl.innerText = '0.00';

    const submitBtn = buyModalEl.querySelector('button[type="submit"]');

    const controls = [
        { el: patientNameInput, pattern: /^[A-Za-z\s'-]{3,}$/, error: "Name must be at least 3 characters." },
        { el: patientCPRInput, pattern: /^[0-9]{9}$/, error: "CPR must be exactly 9 digits." },
        { el: addressInput, pattern: /^.{5,}$/, error: "Address must be at least 5 characters." },
        { el: prescriptionInput, pattern: /^.{5,}$/, error: "Prescription info must be at least 5 characters." }
    ];

    const updateValidationClass = (control) => {
        const value = control.el.value.trim();
        if (value === "") {
            control.el.classList.remove("is-valid", "is-invalid");
        } else if (control.pattern.test(value)) {
            control.el.classList.add("is-valid");
            control.el.classList.remove("is-invalid");
        } else {
            control.el.classList.add("is-invalid");
            control.el.classList.remove("is-valid");
        }
    };

    const updateTotalPrice = () => {
        const qty = parseInt(quantityInput.value, 10) || 1;
        const pricePerUnit = 10; // default price
        totalPriceEl.innerText = (pricePerUnit * qty).toFixed(2);
    };

    const validateForm = () => {
        let allValid = true;
        controls.forEach(c => {
            updateValidationClass(c);
            if (!c.pattern.test(c.el.value.trim())) allValid = false;
        });
        submitBtn.disabled = !allValid;
        updateTotalPrice();
    };

    controls.forEach(c => c.el.addEventListener('input', validateForm));
    if (quantityInput) quantityInput.addEventListener('input', updateTotalPrice);

    submitBtn.disabled = true;
    validateForm();

    const buyModal = new bootstrap.Modal(buyModalEl, { backdrop: 'static', keyboard: false });
    buyModal.show();

    buyModalEl.querySelector('form')?.addEventListener('submit', (event) => {
        event.preventDefault();

        let firstError = "";
        controls.forEach(c => {
            if (!c.pattern.test(c.el.value.trim()) && !firstError) firstError = c.error;
        });

        if (firstError) {
            showPopup("Validation Error", firstError);
            return;
        }

        const name = patientNameInput.value.trim();
        const cpr = patientCPRInput.value.trim();
        const address = addressInput.value.trim();
        const prescription = prescriptionInput.value.trim();
        const qty = parseInt(quantityInput.value, 10);
        const pricePerUnit = 10;
        const total = (pricePerUnit * qty).toFixed(2);

        // Save purchase info
        let purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
        purchases.push({ medicineName, name, cpr, address, prescription, qty, total, boughtAt: new Date().toLocaleString() });
        localStorage.setItem('purchases', JSON.stringify(purchases));

        showPopup("Purchase Successful", `You bought ${qty} x ${medicineName} for $${total}.`);

        buyModal.hide();
        buyModalEl.querySelector('form')?.reset();
        controls.forEach(c => c.el.classList.remove("is-valid", "is-invalid"));
        submitBtn.disabled = true;
        totalPriceEl.innerText = '0.00';
    }, { once: true });
}


function openAppointmentForm(doctorName) {
    if (!appointmentModal) return;
    document.getElementById('appointmentDoctor').value = doctorName;
    document.getElementById('appointmentModalLabel').innerText = `Book Appointment with ${doctorName}`;
    appointmentModal.show();
}

// ---------------------------
// MEDICINE SEARCH
// ---------------------------
const medicineSearchInput = document.getElementById("medicineSearch");
const medicineSuggestions = document.getElementById("medicineSuggestions");
const medicines = ["Panadol Extra", "Augmentin 625mg", "Claritin"];

if (medicineSearchInput) {
    medicineSearchInput.oninput = () => {
        const query = medicineSearchInput.value.toLowerCase().trim();
        medicineSuggestions.innerHTML = "";
        if (!query) return (medicineSuggestions.style.display = "none");

        const matches = medicines.filter(m => m.toLowerCase().includes(query));
        if (matches.length === 0) return (medicineSuggestions.style.display = "none");

        matches.forEach(m => {
            const li = document.createElement("button");
            li.className = "list-group-item list-group-item-action";
            li.textContent = m;
            li.addEventListener("click", () => {
                medicineSearchInput.value = m;
                medicineSuggestions.style.display = "none";
                openBuyForm(m);
                const card = document.querySelector(`.medicine-card[data-name="${m}"]`);
                if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
            });
            medicineSuggestions.appendChild(li);
        });
        medicineSuggestions.style.display = "block";
    };

    document.onclick = e => {
        if (!medicineSearchInput.contains(e.target) && !medicineSuggestions.contains(e.target)) {
            medicineSuggestions.style.display = "none";
        }
    };
}

// ---------------------------
// 'Making of'
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
    const viewer = document.getElementById("imageViewer");
    const viewerImg = document.getElementById("viewerImg");

    if (!viewer || !viewerImg) return;

    let zoomed = false;

    const wireframeImages = document.querySelectorAll(".wireframe-card img");
    if (wireframeImages.length > 0) {
        wireframeImages.forEach(img => {
            img.addEventListener("click", (e) => {
                viewerImg.src = img.src;
                viewer.style.display = "flex";

                zoomed = false;
                viewerImg.style.transform = "scale(1)";
                viewerImg.style.transformOrigin = "50% 50%";
                viewerImg.style.cursor = "zoom-in";
            });
        });
    }

    viewerImg.addEventListener("click", (e) => {
        e.stopPropagation();
        const rect = viewerImg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const offsetX = (x / rect.width) * 100;
        const offsetY = (y / rect.height) * 100;

        if (!zoomed) {
            zoomed = true;
            viewerImg.style.transformOrigin = `${offsetX}% ${offsetY}%`;
            viewerImg.style.transform = "scale(2)";
            viewerImg.style.cursor = "zoom-out";
        } else {
            zoomed = false;
            viewerImg.style.transformOrigin = `${offsetX}% ${offsetY}%`;
            viewerImg.style.transform = "scale(1)";
            viewerImg.style.cursor = "zoom-in";
        }
    });

    viewerImg.addEventListener("mousemove", (e) => {
        if (!zoomed) return;
        const rect = viewerImg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const offsetX = (x / rect.width) * 100;
        const offsetY = (y / rect.height) * 100;
        viewerImg.style.transformOrigin = `${offsetX}% ${offsetY}%`;
    });

    viewer.addEventListener("click", () => {
        viewer.style.display = "none";
        zoomed = false;
        viewerImg.style.transform = "scale(1)";
        viewerImg.style.transformOrigin = "50% 50%";
        viewerImg.style.cursor = "default";
    });
});

// ---------------------------
// CART SYSTEM
// ---------------------------
let cart = [];

const cartToggle = document.getElementById('cartToggle');
const cartPanel = document.getElementById('cartPanel');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');
const checkoutButton = document.getElementById('checkoutButton');

// ---------------------------
// CART TOGGLE
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
    if (!cartToggle || !cartPanel) return;

    cartToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        cartPanel.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        const clickedInsideCart = cartPanel.contains(e.target);
        const clickedToggleButton = cartToggle.contains(e.target);
        const clickedAddButton = e.target.closest('.btn-primary'); // Add-to-Cart buttons outside
        const clickedQtyInput = e.target.closest('.form-control'); // Quantity inputs outside
        const clickedCartButton = e.target.closest('.cart-remove, .qty-plus, .qty-minus, .cart-qty-input');

        // Only close if click is outside cart, toggle, Add-to-Cart buttons, quantity inputs, AND cart buttons
        if (!clickedInsideCart && !clickedToggleButton && !clickedAddButton && !clickedQtyInput && !clickedCartButton) {
            cartPanel.classList.remove('show');
        }
    });
});

// ---------------------------
// ADD TO CART
// ---------------------------
function addCardToCart(name, qtyInputId, imgSrc) {
    const qty = parseInt(document.getElementById(qtyInputId).value, 10) || 1;

    const card = [...document.querySelectorAll('.medicine-card')]
        .find(c => c.dataset.name === name);

    let price = 10;
    if (card) price = parseFloat(card.dataset.price);

    const existingIndex = cart.findIndex(item => item.name === name);
    if (existingIndex !== -1) {
        cart[existingIndex].qty += qty;
    } else {
        cart.push({ name, qty, img: imgSrc, price });
    }

    updateCartUI();
    showPopup("Added to Cart", `${qty} x ${name} added.`);

    // Open cart automatically when adding items
    if (!cartPanel.classList.contains('show')) cartPanel.classList.add('show');
}

// ---------------------------
// UPDATE CART UI
// ---------------------------
function updateCartUI() {
    cartItemsEl.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        const li = document.createElement('li');
        li.className = 'd-flex justify-content-between align-items-center mb-2 flex-wrap';

        li.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.img}" alt="${item.name}">
                <span>${item.name}</span>
            </div>
            <div class="quantity-controls">
                <button class="qty-minus" data-index="${index}">-</button>
                <input type="number" class="cart-qty-input form-control form-control-sm" 
                    data-index="${index}" value="${item.qty}" min="1" style="width:60px;">
                <button class="qty-plus" data-index="${index}">+</button>
                <span>${itemTotal.toFixed(3)} BHD</span>
                <button class="btn btn-sm btn-danger cart-remove" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsEl.appendChild(li);
    });

    cartTotalEl.innerText = total.toFixed(3) + ' BHD';
    cartCountEl.innerText = cart.reduce((sum, item) => sum + item.qty, 0);

    // Event listeners inside cart
    cartItemsEl.querySelectorAll('.cart-remove, .qty-plus, .qty-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent cart from closing

            const i = parseInt(btn.dataset.index);

            if (btn.classList.contains('cart-remove')) {
                cart.splice(i, 1);
            } else if (btn.classList.contains('qty-plus')) {
                cart[i].qty++;
            } else if (btn.classList.contains('qty-minus')) {
                if (cart[i].qty > 1) cart[i].qty--;
            }

            updateCartUI();
        });
    });

    // Quantity input inside cart
    cartItemsEl.querySelectorAll('.cart-qty-input').forEach(input => {
        const i = parseInt(input.dataset.index);

        const updateQty = () => {
            let val = parseInt(input.value);
            if (isNaN(val) || val < 1) val = 1;
            cart[i].qty = val;
            updateCartUI();
        };

        input.addEventListener('blur', updateQty);
        input.addEventListener('keydown', (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                updateQty();
            }
        });
    });
}

// ---------------------------
// CHECKOUT
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.getElementById("checkoutButton");

    if (!checkoutButton) return;

    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            showPopup("Cart Empty", "Please add items to your cart first.");
            return;
        }
        openCheckoutForm();
    });

    function openCheckoutForm() {
        const existingModal = document.getElementById('checkoutModal');
        if (existingModal) existingModal.remove();

        const modalHTML = `
<div class="modal fade" id="checkoutModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Checkout</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <h6>Items:</h6>
                <ul class="list-group mb-3" id="checkoutItems"></ul>
                <div class="mb-3">
                    <label for="patientName" class="form-label">Full Name</label>
                    <input type="text" id="patientName" class="form-control" placeholder="Enter your full name">
                    <div class="error-box"></div>
                </div>
                <div class="mb-3">
                    <label for="patientCPR" class="form-label">CPR</label>
                    <input type="text" id="patientCPR" class="form-control" maxlength="9" placeholder="Enter your 9-digit CPR">
                    <div class="error-box"></div>
                </div>
                <div class="mb-3">
                    <label for="address" class="form-label">Address</label>
                    <input type="text" id="address" class="form-control" placeholder="Enter your address">
                    <div class="error-box"></div>
                </div>
                <div class="mb-3">
                    <label for="prescription" class="form-label">Prescription Info</label>
                    <input type="text" id="prescription" class="form-control" placeholder="Enter prescription info">
                    <div class="error-box"></div>
                </div>
                <h6>Total: <span id="checkoutTotal">0.000 BHD</span></h6>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-success" id="submitCheckout">Confirm Purchase</button>
            </div>
        </div>
    </div>
</div>
`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const checkoutItemsEl = document.getElementById('checkoutItems');

        const mergedCart = [];
        cart.forEach(item => {
            const existing = mergedCart.find(i => i.name === item.name);
            if (existing) {
                existing.qty += item.qty;
            } else {
                mergedCart.push({ ...item });
            }
        });

        let total = 0;
        mergedCart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between';
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            li.innerHTML = `${item.name} x ${item.qty} <span>${itemTotal.toFixed(3)} BHD</span>`;
            checkoutItemsEl.appendChild(li);
        });
        document.getElementById('checkoutTotal').innerText = total.toFixed(3) + ' BHD';

        document.getElementById('patientName').value = localStorage.getItem('username') || '';

        const controls = [
            { el: document.getElementById('patientName'), pattern: /^[A-Za-z\s'-]{3,}$/, error: "Full Name should be at least 3 letters (e.g., John Doe).", box: null },
            { el: document.getElementById('patientCPR'), pattern: /^[0-9]{9}$/, error: "CPR should be exactly 9 digits (e.g., 123456789).", box: null },
            { el: document.getElementById('address'), pattern: /^.{5,}$/, error: "Address should be at least 5 characters (e.g., 123 Main Street).", box: null },
            { el: document.getElementById('prescription'), pattern: /^.{5,}$/, error: "Prescription info must be at least 5 characters.", box: null }
        ];

        controls.forEach(c => {
            c.box = c.el.parentNode.querySelector('.error-box');
        });

        const submitBtn = document.getElementById('submitCheckout');

        const validateForm = () => {
            let allValid = true;
            controls.forEach(c => {
                const value = c.el.value.trim();
                if (value === "") {
                    c.el.classList.remove("is-valid", "is-invalid");
                    c.box.innerText = "";
                    allValid = false;
                } else if (c.pattern.test(value)) {
                    c.el.classList.add("is-valid");
                    c.el.classList.remove("is-invalid");
                    c.box.innerText = "";
                } else {
                    c.el.classList.add("is-invalid");
                    c.el.classList.remove("is-valid");
                    c.box.innerText = c.error;
                    allValid = false;
                }
            });
            submitBtn.disabled = !allValid;
        };

        controls.forEach(c => c.el.addEventListener('input', validateForm));
        validateForm();

        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'), { backdrop: 'static', keyboard: false });
        checkoutModal.show();

        submitBtn.addEventListener('click', () => {
            validateForm();
            if (submitBtn.disabled) return;

            const name = controls[0].el.value.trim();
            const cpr = controls[1].el.value.trim();
            const address = controls[2].el.value.trim();
            const prescription = controls[3].el.value.trim();

            const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
            mergedCart.forEach(item => {
                purchases.push({
                    medicineName: item.name,
                    qty: item.qty,
                    total: (item.price * item.qty).toFixed(3),
                    name,
                    cpr,
                    address,
                    prescription,
                    boughtAt: new Date().toLocaleString()
                });
            });
            localStorage.setItem('purchases', JSON.stringify(purchases));

            cart = [];
            updateCartUI();

            showPopup("Purchase Successful", "Your order has been placed!");
            checkoutModal.hide();
            document.getElementById('checkoutModal').remove();
        }, { once: true });
    }
});


// ---------------------------
// SIMPLE POPUP FUNCTION
// ---------------------------
function showPopup(title, message) {
    // Create popup container
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.right = '20px';
    popup.style.backgroundColor = '#28a745';
    popup.style.color = 'white';
    popup.style.padding = '15px 25px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    popup.style.zIndex = 1055;
    popup.style.fontWeight = 'bold';
    popup.style.minWidth = '200px';
    popup.innerText = `${title}: ${message}`;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 3500);
}


// ---------------------------
// MEDICINE SEARCH
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('medicineSearch');
    const suggestionsList = document.getElementById('medicineSuggestions');

    if (!searchInput || !suggestionsList) return;

    const medicineCards = Array.from(document.querySelectorAll('.medicine-card'));
    if (!medicineCards.length) return;

    const medicines = medicineCards.map(card => card.dataset.name);

    function levenshteinDistance(a, b) {
        const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
        return dp[a.length][b.length];
    }

    function fuzzyMatch(query, text) {
        query = query.toLowerCase();
        text = text.toLowerCase();

        let i = 0;
        for (let char of text) {
            if (char === query[i]) i++;
            if (i === query.length) return true;
        }

        return levenshteinDistance(query, text) <= 1;
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        suggestionsList.innerHTML = '';

        if (!query) {
            medicineCards.forEach(card => {
                const parentCol = card.closest('.col-md-4');
                if (parentCol) parentCol.style.display = 'block';
            });
            return;
        }

        medicineCards.forEach(card => card.style.display = 'block');

        const filtered = medicines.filter(med => fuzzyMatch(query, med));

        medicineCards.forEach(card => {
            const parentCol = card.closest('.col-md-4');
            if (parentCol) {
                parentCol.style.display = filtered.includes(card.dataset.name) ? 'block' : 'none';
            }
        });

        filtered.forEach(med => {
            const card = document.querySelector(`.medicine-card[data-name="${med}"]`);
            const imgSrc = card ? card.querySelector('img')?.src : '';

            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action';
            li.innerHTML = `
                <img src="${imgSrc}" alt="${med}" style="width:30px; height:30px; object-fit:cover; margin-right:8px; vertical-align:middle;">
                <span>${med}</span>
            `;
            li.addEventListener('click', () => {
                searchInput.value = med;
                suggestionsList.innerHTML = '';

                medicineCards.forEach(card => {
                    const parentCol = card.closest('.col-md-4');
                    if (parentCol) {
                        parentCol.style.display = card.dataset.name === med ? 'block' : 'none';
                        if (card.dataset.name === med) parentCol.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
            });

            suggestionsList.appendChild(li);
        });
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
            suggestionsList.innerHTML = '';
        }
    });
});


// ---------------------------
// HEALTH SEARCH
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('healthSearch');
    const suggestionsList = document.getElementById('searchSuggestions');
    if (!searchInput || !suggestionsList) return;

    const healthCards = Array.from(document.querySelectorAll('.health-card'));
    if (!healthCards.length) return;
    const healthItems = healthCards.map(card => card.dataset.name);

    function levenshteinDistance(a, b) {
        const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
        return dp[a.length][b.length];
    }

    function fuzzyMatch(query, text) {
        query = query.toLowerCase();
        text = text.toLowerCase();
        let i = 0;
        for (let char of text) { if (char === query[i]) i++; if (i === query.length) return true; }
        return levenshteinDistance(query, text) <= 1;
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = query ? 'block' : 'none';

        const filtered = query ? healthItems.filter(item => fuzzyMatch(query, item)) : [];

        healthCards.forEach(card => {
            const col = card.closest('.col-md-4');
            if (col) {
                col.style.display = filtered.length === 0 || filtered.includes(card.dataset.name) ? '' : 'none';
            }
        });


        filtered.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.addEventListener('click', () => {
                searchInput.value = item;
                suggestionsList.innerHTML = '';
                healthCards.forEach(card => {
                    card.closest('.col-md-4').style.display = (card.dataset.name === item) ? '' : 'none';
                    if (card.dataset.name === item) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            });
            suggestionsList.appendChild(li);
        });
    });

    document.addEventListener('click', e => {
        if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
            suggestionsList.innerHTML = '';
            suggestionsList.style.display = 'none';
        }
    });
});


// ---------------------------
// DOCTOR SEARCH
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('doctorSearch');
    const suggestionsList = document.getElementById('doctorSuggestions');

    if (!searchInput || !suggestionsList) return;

    const doctorCards = Array.from(document.querySelectorAll('.card[data-name]'));
    if (!doctorCards.length) return;

    const doctorNames = doctorCards.map(card => card.dataset.name);

    function levenshteinDistance(a, b) {
        const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],
                    dp[i][j - 1],
                    dp[i - 1][j - 1]
                );
            }
        }

        return dp[a.length][b.length];
    }

    function fuzzyMatch(query, text) {
        query = query.toLowerCase();
        text = text.toLowerCase();

        let i = 0;
        for (let char of text) {
            if (char === query[i]) i++;
            if (i === query.length) return true;
        }

        return levenshteinDistance(query, text) <= 1;
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = query ? 'block' : 'none';

        if (!query) {
            doctorCards.forEach(card => {
                const parentCol = card.closest('.col-12');
                if (parentCol) parentCol.style.display = 'block';
            });
            return;
        }

        doctorCards.forEach(card => card.style.display = 'block');

        const filtered = doctorNames.filter(name => fuzzyMatch(query, name));

        doctorCards.forEach(card => {
            const parentCol = card.closest('.col-12');
            if (parentCol) {
                parentCol.style.display = filtered.includes(card.dataset.name) ? 'block' : 'none';
            }
        });

        filtered.forEach(name => {
            const card = document.querySelector(`.card[data-name="${name}"]`);
            const imgSrc = card ? card.querySelector('img')?.src : '';

            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action';
            li.textContent = name;
            li.addEventListener('click', () => {
                searchInput.value = name;
                suggestionsList.innerHTML = '';


                doctorCards.forEach(card => {
                    const parentCol = card.closest('.col-12');
                    if (parentCol) {
                        parentCol.style.display = card.dataset.name === name ? 'block' : 'none';
                        if (card.dataset.name === name) parentCol.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
            });

            suggestionsList.appendChild(li);
        });
    });
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
            suggestionsList.innerHTML = '';
        }
    });
});


// ---------------------------
// HEALTH POP UP (SEPARATE)
// ---------------------------
function showHealthPopup(title, text) {
    const overlay = document.getElementById("healthPopupOverlay");
    const titleElement = document.getElementById("healthPopupTitle");
    const textElement = document.getElementById("healthPopupText");

    if (!overlay || !titleElement || !textElement) {
        console.error("Health popup elements are missing from the DOM");
        return;
    }

    titleElement.innerText = title;
    textElement.innerHTML = text;

    overlay.style.display = "flex";
}

function closeHealthPopup() {
    const overlay = document.getElementById("healthPopupOverlay");
    if (overlay) {
        overlay.style.display = "none";
    }
}

// ---------------------------
// GLOBAL POPUP FUNCTION
// ---------------------------

const MAX_POPUPS = 3;

function showPopup(title, message) {
    const popup = document.createElement('div');
    popup.className = 'popup-toast';
    popup.style.background = 'rgba(0, 123, 158, 0.8)';
    popup.style.color = '#fff';
    popup.style.padding = '15px 20px';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    popup.style.opacity = '0';
    popup.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    popup.style.pointerEvents = 'none';

    popup.innerHTML = `<strong>${title}</strong><br>${message}`;

    popupContainer.appendChild(popup);

    while (popupContainer.children.length > MAX_POPUPS) {
        popupContainer.firstChild.remove();
    }

    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translateY(0)';
    }, 50);

    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'translateY(20px)';
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}



// ---------------------------
// POPUP CONTAINER
// ---------------------------
let popupContainer = document.getElementById('popupContainer');
if (!popupContainer) {
    popupContainer = document.createElement('div');
    popupContainer.id = 'popupContainer';
    popupContainer.style.position = 'fixed';
    popupContainer.style.bottom = '20px';
    popupContainer.style.left = '20px';
    popupContainer.style.display = 'flex';
    popupContainer.style.flexDirection = 'column-reverse';
    popupContainer.style.gap = '10px';
    popupContainer.style.zIndex = '9999';
    popupContainer.style.pointerEvents = 'none';
    document.body.appendChild(popupContainer);
}

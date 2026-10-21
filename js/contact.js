document.addEventListener('DOMContentLoaded', function () {
    console.log('[contact.js] DOMContentLoaded fired');

    const form = document.querySelector('form');
    if (!form) {
        console.error('[contact.js] No <form> element found on this page — aborting.');
        return;
    }
    console.log('[contact.js] form element:', form);

    if (typeof APP_CONFIG === 'undefined' || !APP_CONFIG.API_URL) {
        console.error('[contact.js] APP_CONFIG.API_URL is missing — is js/config.js loaded before js/contact.js?');
    } else {
        console.log('[contact.js] APP_CONFIG.API_URL =', APP_CONFIG.API_URL);
    }

    const successMessage = document.createElement('div');
    const errorMessage = document.createElement('div');
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    form.appendChild(successMessage);
    form.appendChild(errorMessage);

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        console.log('[contact.js] submit event fired, default prevented');

        const nameInput = form.querySelector('input[type="text"][placeholder="Name"]');
        const emailInput = form.querySelector('input[type="email"][placeholder="Email"]');
        const phoneInput = form.querySelector('input[type="text"][placeholder="Phone"]');
        const messageInput = form.querySelector('textarea[placeholder="Your message"]');
        console.log('[contact.js] resolved field elements:', { nameInput, emailInput, phoneInput, messageInput });

        const name = nameInput ? nameInput.value : undefined;
        const email = emailInput ? emailInput.value : undefined;
        const phone = phoneInput ? phoneInput.value : undefined;
        const message = messageInput ? messageInput.value : undefined;
        console.log('[contact.js] field values:', { name, email, phone, message });

        if (!name || !email || !phone || !message) {
            console.warn('[contact.js] validation failed — a required field is empty or the input was not found');
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Please fill all fields and agree to the terms and conditions.';
            return;
        }

        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('message', message);

        const url = `${APP_CONFIG.API_URL}/common/contact`;
        console.log('[contact.js] submitting POST to:', url);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });
            console.log('[contact.js] response received — status:', response.status, response.statusText);

            const result = await response.json().catch((parseErr) => {
                console.error('[contact.js] response.json() failed to parse:', parseErr);
                return null;
            });
            console.log('[contact.js] response body:', result);

            if (response.ok) {
                console.log('[contact.js] submission succeeded');
                successMessage.style.display = 'block';
                successMessage.textContent = 'Your message has been sent successfully!';
                form.reset();
            } else {
                console.error('[contact.js] server returned an error status:', response.status, result);
                errorMessage.style.display = 'block';
                errorMessage.textContent = (result && result.message) || 'Something went wrong. Please try again.';
            }
        } catch (error) {
            console.error('[contact.js] fetch() threw before a response was received:', error);
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'An error occurred. Please try again later.';
        }
    });
});
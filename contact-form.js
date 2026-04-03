/**
 * Contact form handler — submits to CRM /api/contact endpoint
 */
(function() {
  const API_URL = 'https://estimate.woodwardrenovationsinc.com/api/contact';

  document.querySelectorAll('.contact-form form').forEach(function(form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const btn = form.querySelector('.btn-send');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Gather form data
      const inputs = form.querySelectorAll('input, textarea');
      const data = {};
      inputs.forEach(function(input) {
        if (input.type === 'checkbox') return;
        // Map placeholder/label to field name
        const label = input.closest('.form-group')?.querySelector('label')?.textContent || '';
        if (label.includes('first name')) data.first_name = input.value.trim();
        else if (label.includes('last name')) data.last_name = input.value.trim();
        else if (label.includes('email')) data.email = input.value.trim();
        else if (label.includes('phone')) data.phone = input.value.trim();
        else if (label.includes('Description') || input.tagName === 'TEXTAREA') data.description = input.value.trim();
      });

      // Honeypot
      const honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) {
        btn.textContent = 'Sent!';
        return;
      }

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          btn.textContent = 'Message Sent!';
          btn.style.background = '#2e7d32';
          form.reset();
          setTimeout(function() {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        } else {
          const result = await res.json();
          const errorMsg = result.errors
            ? Object.values(result.errors).join(', ')
            : result.error || 'Something went wrong';
          alert('Error: ' + errorMsg);
          btn.textContent = originalText;
          btn.disabled = false;
        }
      } catch (err) {
        alert('Network error. Please try again.');
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  });
})();

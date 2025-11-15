(function(){
    const THEME_KEY = 'site-theme'; // 'light' or 'dark'
    const buttonId = 'theme-toggle';

    function applyTheme(theme){
        if(theme === 'light'){
            document.body.classList.add('light');
            const btn = document.getElementById(buttonId);
            if(btn) btn.textContent = '☀️';
        } else {
            document.body.classList.remove('light');
            const btn = document.getElementById(buttonId);
            if(btn) btn.textContent = '🌙';
        }
    }

    function toggleTheme(){
        const current = localStorage.getItem(THEME_KEY) || 'dark';
        const next = current === 'light' ? 'dark' : 'light';
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const saved = localStorage.getItem(THEME_KEY) || 'dark';
        applyTheme(saved);

        const btn = document.getElementById(buttonId);
        if(btn){
            btn.addEventListener('click', toggleTheme);
        }

        
        initContactValidation();
    });

    -
    function initContactValidation(){
        const form = document.querySelector('form#contact-form, form.contacto-form');
        if(!form) return;

        
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function createErrorEl(message){
            const el = document.createElement('div');
            el.className = 'error-message';
            el.style.color = '#e74c3c';
            el.style.fontSize = '0.9rem';
            el.style.marginTop = '6px';
            el.textContent = message;
            return el;
        }

        function showError(field, message){
            removeError(field);
            const err = createErrorEl(message);
            
            if(field.parentNode && field.parentNode.lastElementChild === field){
                field.parentNode.appendChild(err);
            } else {
                field.insertAdjacentElement('afterend', err);
            }
            field.classList.add('input-error');
        }

        function removeError(field){
            field.classList.remove('input-error');
            const next = field.nextElementSibling;
            if(next && next.classList && next.classList.contains('error-message')){
                next.remove();
            }
        }

        function validateField(field){
            const val = field.value.trim();
            const type = (field.getAttribute('type') || '').toLowerCase();
            if(field.hasAttribute('required') && val === ''){
                return 'Este campo es obligatorio.';
            }
            if(type === 'email' || /email/i.test(field.name || '')){
                if(val !== '' && !emailRe.test(val)) return 'Email no válido.';
            }
            return '';
        }

       
        form.addEventListener('input', (e) => {
            const field = e.target;
            if(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement){
                const err = validateField(field);
                if(!err) removeError(field);
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fields = Array.from(form.querySelectorAll('input[required], textarea[required], select[required], input[type="email"], input[type="text"], textarea'));
            let firstErrorField = null;
            let hasError = false;

            fields.forEach(field => {
                
                if(field.disabled || field.type === 'hidden' || field.offsetParent === null) return;
                const error = validateField(field);
                if(error){
                    showError(field, error);
                    hasError = true;
                    if(!firstErrorField) firstErrorField = field;
                } else {
                    removeError(field);
                }
            });

            if(hasError){
                if(firstErrorField) firstErrorField.focus();
                return;
            }

            alert('Mensaje enviado exitosamente.');
            form.reset();
            Array.from(form.querySelectorAll('.error-message')).forEach(el => el.remove());
        });
    }
})();


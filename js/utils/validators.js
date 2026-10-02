
/**
 * Valida los datos del formulario de registro.
 * @param {Object} formData
 * @returns {Object|null} Objeto con clave/mensaje de error por campo o null si es válido.
 */
export function validateRegisterForm(formData) {
    const { name, lastName, email, password, confirmPassword, terms, captchaValid } = formData;
    const errors = {};

    if (!name) errors.name = "Requerido";
    if (!lastName) errors.lastName = "Requerido";

    if (!email) {
        errors.email = "Requerido";
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = "Email inválido";
        }
    }

    if (!password) {
        errors.password = "Requerido";
    } else if (password.length < 6) {
        errors.password = "Mínimo 6 caracteres";
    }

    if (!confirmPassword) {
        errors.confirmPassword = "Requerido";
    } else if (password && password !== confirmPassword) {
        errors.confirmPassword = "No coinciden";
    }

    if (!terms) errors.terms = "Aceptá los términos";
    if (!captchaValid) errors.captchaValid = "Verificá el captcha";

    return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Agrega la funcionalidad de alternar visibilidad de contraseña a un input.
 * @param {HTMLInputElement} inputElement
 * @param {string} [iconsPath="../assets/icons/"]
 */
export function setupPasswordToggle(inputElement, iconsPath = "../assets/icons/") {
    if (!inputElement) return;

    const wrapper = inputElement.parentElement;
    if (wrapper) {
        wrapper.classList.add("password-input-wrapper");
    }

    const basePath = iconsPath.endsWith("/") ? iconsPath : `${iconsPath}/`;

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "toggle-password-btn";
    toggleBtn.setAttribute("aria-label", "Mostrar contraseña");

    const iconImg = document.createElement("img");
    iconImg.className = "toggle-password-icon";
    iconImg.src = `${basePath}eye-alt.svg`;
    iconImg.alt = "";

    iconImg.onerror = () => {
        if (!iconImg.dataset.retried) {
            iconImg.dataset.retried = "true";
            iconImg.src = `./assets/icons/eye-alt.svg`;
        }
    };

    toggleBtn.appendChild(iconImg);

    toggleBtn.addEventListener("click", () => {
        const isPassword = inputElement.type === "password";
        inputElement.type = isPassword ? "text" : "password";

        const iconName = isPassword ? "eye-close.svg" : "eye-alt.svg";
        iconImg.src = `${basePath}${iconName}`;
        toggleBtn.setAttribute("aria-label", isPassword ? "Ocultar contraseña" : "Mostrar contraseña");
    });

    if (wrapper) {
        wrapper.appendChild(toggleBtn);
    }
}

/**
 * Inyecta o elimina un <span> con la clase .field-error dentro del .form-field-header
 * @param {HTMLElement} fieldContainer - Contenedor de la molécula del campo
 * @param {string|null} message - Mensaje a mostrar o null para ocultar/limpiar
 */
export function showFieldError(fieldContainer, message) {
    if (!fieldContainer) return;

    // Resaltar border del input/select si existe error
    const inputEl = fieldContainer.querySelector("input, select");
    if (inputEl) {
        inputEl.classList.toggle("input-error", Boolean(message));
    }

    // Header destino (o el mismo contenedor si no posee header separado)
    const headerContainer = fieldContainer.querySelector(".form-field-header") || fieldContainer;
    let errorSpan = headerContainer.querySelector("span.field-error");

    if (message) {
        if (!errorSpan) {
            errorSpan = document.createElement("span");
            errorSpan.className = "field-error";
            headerContainer.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
        errorSpan.style.display = "inline-block";
    } else if (errorSpan) {
        errorSpan.textContent = "";
        errorSpan.style.display = "none";
    }
}

/**
 * Aplica los errores de un objeto de validación a un mapa de campos DOM.
 * @param {Object} fieldsMap - Objeto { [fieldName]: fieldElement }
 * @param {Object|null} errors - Objeto devuelto por validateRegisterForm
 */
export function applyFormErrors(fieldsMap, errors) {
    // 1. Limpiar todos los errores previos
    Object.values(fieldsMap).forEach(field => showFieldError(field, null));

    // 2. Si hay errores, inyectar el <span> en cada header afectado
    if (errors) {
        Object.entries(errors).forEach(([fieldName, message]) => {
            if (fieldsMap[fieldName]) {
                showFieldError(fieldsMap[fieldName], message);
            }
        });
    }
}
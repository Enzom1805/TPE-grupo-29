/**
 * Valida los datos del formulario de registro.
 *
 * @param {Object} formData
 * @returns {string|null} Mensaje de error o null si es válido.
 */
export function validateRegisterForm(formData) {
    const { name, lastName, email, password, confirmPassword, terms, captcha } = formData;

    if (!name ||  !lastName || !email || !password) {
        return "Por favor, completa todos los campos obligatorios.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Ingresá un correo electrónico válido.";
    }

    if (password.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres.";
    }

    if (password !== confirmPassword) {
        return "Las contraseñas no coinciden.";
    }

    if (!terms) {
        return "Debes aceptar los términos y condiciones para continuar.";
    }
    if (!captcha) {
        return "Debes verificar que eres humano antes de continuar.";
    }

    return null;
}

/**
 * Agrega la funcionalidad de alternar visibilidad de contraseña a un input.
 *
 * @param {HTMLInputElement} inputElement
 * @param {string} [iconsPath="../assets/icons/"] Ruta relativa desde la vista HTML abierta
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

    // Fallback en caso de que la ruta varíe según la página que invoca el JS
    iconImg.onerror = () => {
        if (!iconImg.dataset.retried) {
            iconImg.dataset.retried = "true";
            // Intenta cargar desde la raíz del servidor si falla la ruta relativa
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
/**
 * Valida los datos del formulario de registro.
 * Retorna null si no hay errores, o un string con el mensaje de error.
 */
export function validateRegisterForm(formData) {
    const { name, email, password, confirmPassword, terms } = formData;

    if (!name || !email || !password) {
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

    return null; // Sin errores
}

/**
 * Agrega la funcionalidad de alternar visibilidad de contraseña a un input
 */
export function setupPasswordToggle(inputElement) {
    if (!inputElement) return;

    const wrapper = inputElement.parentElement;
    wrapper.style.position = "relative";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.innerText = "👁";
    toggleBtn.className = "toggle-password-btn";
    toggleBtn.style.cssText = "position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #fff;";

    toggleBtn.addEventListener("click", () => {
        const isPassword = inputElement.type === "password";
        inputElement.type = isPassword ? "text" : "password";
        toggleBtn.innerText = isPassword ? "🙈" : "👁";
    });

    wrapper.appendChild(toggleBtn);
}
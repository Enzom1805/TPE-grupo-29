// src/js/molecules/CaptchaField.js

export default function CaptchaField() {
    // Wrapper exterior (sirve como contenedor flex para la molécula y el error)
    const wrapper = document.createElement("div");
    wrapper.className = "molecule-captcha-field";

    // Recuadro visible de KinglyGuard
    const container = document.createElement("div");
    container.className = "captcha-widget";

    let isVerified = false;

    // --- Lado izquierdo: Checkbox + Texto ---
    const leftGroup = document.createElement("label");
    leftGroup.className = "captcha-left";

    const checkboxWrapper = document.createElement("div");
    checkboxWrapper.className = "captcha-checkbox-wrapper";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "captcha-checkbox";

    const customCheck = document.createElement("span");
    customCheck.className = "captcha-custom-box";

    const spinner = document.createElement("span");
    spinner.className = "captcha-spinner";

    checkboxWrapper.append(checkbox, customCheck, spinner);

    const labelText = document.createElement("span");
    labelText.className = "captcha-label-text";
    labelText.textContent = "No soy un robot";

    leftGroup.append(checkboxWrapper, labelText);

    // --- Lado derecho: Branding institucional ---
    const rightGroup = document.createElement("div");
    rightGroup.className = "captcha-right";

    const logoIcon = document.createElement("img");
    logoIcon.src = "../assets/icons/logo-mini.svg";
    logoIcon.alt = "Kingly Security";
    logoIcon.className = "captcha-brand-logo";

    logoIcon.onerror = () => {
        logoIcon.style.display = "none";
    };

    const brandTitle = document.createElement("span");
    brandTitle.className = "captcha-brand-title";
    brandTitle.textContent = "KinglyGuard";

    const brandSub = document.createElement("span");
    brandSub.className = "captcha-brand-sub";
    brandSub.textContent = "Privacidad - Términos";

    rightGroup.append(logoIcon, brandTitle, brandSub);

    container.append(leftGroup, rightGroup);
    wrapper.appendChild(container);

    // Interacción: Simula la verificación del Captcha al marcar el checkbox
    checkbox.addEventListener("change", () => {
        if (checkbox.checked && !isVerified) {
            container.classList.add("is-loading");
            checkbox.disabled = true;

            setTimeout(() => {
                isVerified = true;
                container.classList.remove("is-loading");
                container.classList.add("is-verified");
            }, 600);
        } else if (!checkbox.checked) {
            isVerified = false;
            container.classList.remove("is-verified");
        }
    });

    // Métodos públicos asociados al wrapper
    wrapper.isValid = () => isVerified;
    wrapper.reset = () => {
        isVerified = false;
        checkbox.checked = false;
        checkbox.disabled = false;
        container.classList.remove("is-loading", "is-verified");
    };

    return wrapper;
}
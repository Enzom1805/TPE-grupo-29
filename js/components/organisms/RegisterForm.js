import FormField from '../molecules/FormField.js';
import CheckboxField from '../molecules/CheckboxField.js';
import Button from '../atoms/Button.js';
import Link from "../atoms/Link.js";
import { validateRegisterForm, setupPasswordToggle } from '../../utils/validators.js';
import Icon from "../atoms/Icon.js";
import { countries } from '../../data/countries.js';

export default function RegisterForm() {
    const form = document.createElement("form");
    form.className = "form";

    // Header
    const mainHeaderContent = document.createElement("div");
    mainHeaderContent.className = "form-header";

    const title = document.createElement("h1");
    title.innerText = "Crear una cuenta";
    title.className = "form-h1";

    const logo = Icon("../assets/icons/logo-crown-variant.svg", "Logo");
    logo.classList.add("form-icon-logo");

    mainHeaderContent.append(logo, title);

    const subTitle = document.createElement("p");
    subTitle.innerText = "Completa tus datos para crear tu cuenta en Kingly Games.";

    const requiredLegend = document.createElement("p");
    requiredLegend.className = "form-required-legend";
    requiredLegend.innerText = "Los campos marcados con (*) son requeridos.";

    // Campos
    const fullNameDiv = document.createElement("div");
    const nameField = FormField("Nombre", "text", "name", "Ingresá tu nombre", true);
    const lastNameField = FormField("Apellido", "text", "lastName", "Ingresá tu apellido", true);
    fullNameDiv.append(nameField, lastNameField);
    fullNameDiv.className = "form-row-2";

    const emailPhoneDiv = document.createElement("div");
    const emailField = FormField("Email", "email", "email", "ejemplo@mail.com", true);
    const phoneField = FormField("Teléfono", "tel", "phone", "+54-2494777777", false);
    emailPhoneDiv.append(emailField, phoneField);
    emailPhoneDiv.className = "form-row-2";

    const agePostalCountryDiv = document.createElement("div");
    const birthDateField = FormField("Edad", "date", "birthdate", "", false);
    const postalCodeField = FormField("Código postal", "text", "postalcode", "B7000", false);

    const countryField = FormField("País", "select", "country", "Seleccioná tu país", false, countries);

    agePostalCountryDiv.append(birthDateField, postalCodeField, countryField);
    agePostalCountryDiv.className = "form-row-3";

    // Campos de contraseña
    const passwordField = FormField("Contraseña", "password", "password", "Mínimo 6 caracteres", true);
    const confirmPasswordField = FormField("Repetí contraseña", "password", "password", "", true);

    setupPasswordToggle(passwordField.querySelector("input"));

    // Checkboxes
    const termsField = CheckboxField("terms", "Acepto los términos y condiciones", true);
    termsField.classList.add("terms-field");
    const captchaField = CheckboxField("captcha", "Confirma que no eres un robot", true);
    captchaField.classList.add("captcha-field");

    // Botón Submit
    const submitBtn = Button("Registrarse", "submit");

    // Divisor
    const divider = document.createElement("div");
    divider.className = "form-divider";
    divider.innerHTML = "<span>o continuar con</span>";

    // Botones sociales
    const mediaDiv = document.createElement("div");
    mediaDiv.className = "form-row-2";
    const googleBtn = Button("Google", "button", "social atom-button--google", "medium");
    const facebookBtn = Button("Facebook", "button", "social atom-button--facebook", "medium");
    mediaDiv.append(googleBtn, facebookBtn);

    const redirectToLogin = () => {
        window.location.href = "login.html";
    };
    googleBtn.addEventListener("click", redirectToLogin);
    facebookBtn.addEventListener("click", redirectToLogin);

    // Footer
    const footerText = document.createElement("p");
    footerText.className = "form-footer";
    footerText.textContent = "¿Ya tenés una cuenta? ";
    const loginLink = Link("Ingresar", "login.html");
    footerText.appendChild(loginLink);

    // Mensaje de Error
    const errorMessage = document.createElement("div");
    errorMessage.className = "form-error-message";

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = {
            name: nameField.querySelector("input")?.value.trim(),
            lastName: lastNameField.querySelector("input")?.value.trim(),
            email: emailField.querySelector("input")?.value.trim(),
            password: passwordField.querySelector("input")?.value,
            confirmPassword: confirmPasswordField.querySelector("input")?.value,
            terms: termsField.querySelector("input[type='checkbox']")?.checked,
            captcha: captchaField.querySelector("input[type='checkbox']")?.checked
        };

        const error = validateRegisterForm(formData);

        if (error) {
            errorMessage.textContent = error;
            errorMessage.style.display = "block";
            return;
        }

        errorMessage.style.display = "none";
        submitBtn.disabled = true;
        submitBtn.classList.add("atom-button--loading");

        setTimeout(() => {
            submitBtn.classList.remove("atom-button--loading");
            submitBtn.classList.add("atom-button--success");
            const btnSpan = submitBtn.querySelector("span");
            if (btnSpan) btnSpan.textContent = "✓ ¡Cuenta creada!";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        }, 1500);
    });

    form.append(
        mainHeaderContent,
        subTitle,
        requiredLegend,
        errorMessage,
        fullNameDiv,
        emailPhoneDiv,
        agePostalCountryDiv,
        passwordField,
        confirmPasswordField,
        termsField,
        captchaField,
        submitBtn,
        divider,
        mediaDiv,
        footerText
    );

    return form;
}
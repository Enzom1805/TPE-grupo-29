import FormField from '../molecules/FormField.js';
import CheckboxField from '../molecules/CheckboxField.js';
import CaptchaField from '../molecules/CaptchaField.js';
import Button from '../atoms/Button.js';
import Link from "../atoms/Link.js";
import { validateRegisterForm, setupPasswordToggle, applyFormErrors } from '../../utils/validators.js';
import Icon from "../atoms/Icon.js";
import { countries } from '../../data/countries.js';

export default function RegisterForm() {
    const form = document.createElement("form");
    form.className = "form";
    form.noValidate = true;

    // Header Organismo
    const mainHeaderContent = document.createElement("div");
    mainHeaderContent.className = "form-header";

    const title = document.createElement("h1");
    title.innerText = "Crear una cuenta";
    title.className = "form-h1";

    const logo = Icon("../assets/icons/logo-form.svg", "Logo");
    mainHeaderContent.append(logo, title);

    const subTitle = document.createElement("p");
    subTitle.innerText = "Completa tus datos para crear tu cuenta en Kingly Games.";

    const requiredLegend = document.createElement("p");
    requiredLegend.className = "form-required-legend";
    requiredLegend.innerText = "Los campos marcados con (*) son requeridos.";

    // Campos de texto
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
    const confirmPasswordField = FormField("Repetí contraseña", "password", "confirmPassword", "", true);

    setupPasswordToggle(passwordField.querySelector("input"));
    setupPasswordToggle(confirmPasswordField.querySelector("input"));

    // Checkbox y Captcha
    const termsField = CheckboxField("terms", "Acepto los términos y condiciones", true);
    termsField.classList.add("terms-field");

    const captchaField = CaptchaField();

    // Mapeo entre la clave de error y la molécula DOM
    const fieldsMap = {
        name: nameField,
        lastName: lastNameField,
        email: emailField,
        password: passwordField,
        confirmPassword: confirmPasswordField,
        terms: termsField,
        captchaValid: captchaField
    };

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


// Submit handler
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = {
            name: nameField.querySelector("input")?.value.trim(),
            lastName: lastNameField.querySelector("input")?.value.trim(),
            email: emailField.querySelector("input")?.value.trim(),
            password: passwordField.querySelector("input")?.value,
            confirmPassword: confirmPasswordField.querySelector("input")?.value,
            terms: termsField.querySelector("input[type='checkbox']")?.checked,
            captchaValid: typeof captchaField.isValid === "function" ? captchaField.isValid() : true
        };

        const errors = validateRegisterForm(formData);

        // Aplica o limpia los errores individuales en los campos
        applyFormErrors(fieldsMap, errors);

        if (errors) {
            // Reinicia la clase para re-ejecutar la animación si vuelve a presionar submit
            form.classList.remove("form--error");
            void form.offsetWidth; // Fuerza un reflow rápido del DOM
            form.classList.add("form--error");
            return;
        }

        // Limpia el estado de error si la validación pasa
        form.classList.remove("form--error");

        // Proceso de submit exitoso
        submitBtn.disabled = true;
        submitBtn.classList.add("atom-button--loading");

        setTimeout(() => {
            submitBtn.classList.remove("atom-button--loading");
            submitBtn.classList.add("atom-button--success");

            // Activa elevación y sombra verde de éxito
            form.classList.add("form--success");

            const btnSpan = submitBtn.querySelector("span");
            if (btnSpan) btnSpan.textContent = "✓ ¡Cuenta creada!";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);
        }, 1500);
    });

    form.append(
        mainHeaderContent,
        subTitle,
        requiredLegend,
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
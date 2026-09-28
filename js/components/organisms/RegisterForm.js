import FormField from '../molecules/FormField.js';
import CheckboxField from '../molecules/CheckboxField.js';
import Button from '../atoms/Button.js';
import Link from "../atoms/Link.js";
import { validateRegisterForm, setupPasswordToggle } from '../../utils/validators.js';
import Icon from "../atoms/Icon.js";

export default function RegisterForm() {
    const form = document.createElement("form");
    form.className = "form";

    // Contenedor principal del header
    const mainHeaderContent = document.createElement("div");
    mainHeaderContent.className = "form-header";
    const title = document.createElement("h1");
    title.innerText = "Crear una cuenta";
    title.className = "form-h1";

    // Instanciamos el átomo Icon
    const logo = Icon("../assets/icons/logo-crown-variant.svg", "Logo");
    logo.className = "form-icon-logo";
    mainHeaderContent.append(logo, title);

    const subTitle = document.createElement("p");
    subTitle.innerText = "Completa tus datos para crear tu cuenta en Kingly Games.";

    // Campos
    const fullNameDiv = document.createElement("div");
    const nameField = FormField("Nombre", "text", "name", "Ingresá tu nombre");
    const lastNameField = FormField("Apellido", "text", "lastName", "Ingresá tu apellido");
    fullNameDiv.append(nameField, lastNameField);
    fullNameDiv.className = "form-row-2";

    const emailPhoneDiv = document.createElement("div");
    const emailField = FormField("Correo electrónico", "email", "email", "ejemplo@mail.com");
    const phoneField = FormField("Teléfono", "tel", "phone", "+54-2494777777");
    emailPhoneDiv.append(emailField, phoneField);
    emailPhoneDiv.className = "form-row-2";

    const agePostalCountryDiv = document.createElement("div");
    const birthDateField = FormField("Edad", "date", "birthdate", "");
    const postalCodeField = FormField("Código postal", "text", "postalcode", "B7000");
    const countryField = FormField("País", "select", "country", "Argentina");
    agePostalCountryDiv.append(birthDateField, postalCodeField, countryField);
    agePostalCountryDiv.className = "form-row-3";

    // Campos de contraseña
    const passwordField = FormField("Contraseña", "password", "password", "Mínimo 6 caracteres");
    const confirmPasswordField = FormField("Repetí contraseña", "password", "password", "");

    // Activamos el toggle llamando al helper externo
    setupPasswordToggle(passwordField.querySelector("input"));

    // Checkboxes
    const termsField = CheckboxField("terms", "Acepto los términos y condiciones");
    termsField.className = "terms-field";
    const captchaField = CheckboxField("captcha", "Confirma que no eres un robot");
    captchaField.className = "captcha-field";

    // Botón Submit
    const submitBtn = Button("Registrarse", "submit");

    // Divisor visual "o continuar con"
    const divider = document.createElement("div");
    divider.className = "form-divider";
    divider.innerHTML = "<span>o continuar con</span>";

    // Contenedor de botones sociales
    const mediaDiv = document.createElement("div");
    mediaDiv.className = "form-row-2";
    const googleBtn = Button("Google", "button", "social", "medium");
    const facebookBtn = Button("Facebook", "button", "social", "medium");
    mediaDiv.append(googleBtn, facebookBtn);

    // Pie de página
    const footerText = document.createElement("p");
    footerText.className = "form-footer";
    footerText.textContent = "¿Ya tenés una cuenta? ";
    const loginLink = Link("Ingresar", "login.html");
    footerText.appendChild(loginLink);

    // Contenedor de mensaje de error
    const errorMessage = document.createElement("div");
    errorMessage.className = "form-error-message";

    // Evento submit utilizando validador
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = {
            name: nameField.querySelector("input")?.value.trim(),
            email: emailField.querySelector("input")?.value.trim(),
            password: passwordField.querySelector("input")?.value,
            confirmPassword: confirmPasswordField.querySelector("input")?.value,
            terms: termsField.querySelector("input[type='checkbox']")?.checked
        };

        const error = validateRegisterForm(formData);

        if (error) {
            errorMessage.textContent = error;
            errorMessage.style.display = "block";
            return;
        }

        errorMessage.style.display = "none";
        alert("¡Registro exitoso!");
        window.location.href = "login.html";
    });

    // Ensamblamos el organismo
    form.append(
        mainHeaderContent,
        subTitle,
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
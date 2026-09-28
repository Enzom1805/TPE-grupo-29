import FormField from '../molecules/FormField.js';
import CheckboxField from '../molecules/CheckboxField.js';
import Button from '../atoms/Button.js';
import Link from "../atoms/Link.js";
import Icon from "../atoms/Icon.js";
import { setupPasswordToggle } from '../../utils/validators.js';

export default function LoginForm() {
    const form = document.createElement("form");
    form.className = "form";

    // Contenedor principal del header
    const mainHeaderContent = document.createElement("div");
    mainHeaderContent.className = "form-header";
    const title = document.createElement("h1");
    title.innerText = "Ingresar";
    title.className = "form-h1";

    // Instanciamos el átomo Icon
    const logo = Icon("../assets/icons/logo-crown-variant.svg", "Logo");
    logo.className = "form-icon-logo";
    mainHeaderContent.append(logo, title);

    const subTitle = document.createElement("p");
    subTitle.innerText = "Inicia sesión para continuar en Kingly Games.";

    const emailField = FormField("Correo electrónico", "email", "email", "ejemplo@mail.com");

    const passwordField = FormField("Contraseña", "password", "password", "Mínimo 6 caracteres");

    // --- REUTILIZACIÓN DEL TOGGLE ---
    const passwordInput = passwordField.querySelector("input");
    if (passwordInput) {
        setupPasswordToggle(passwordInput);
    }

    // Contenedor de opciones: Recordarme + ¿Olvidaste tu contraseña?
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "form-options";

    const rememberMeField = CheckboxField("remember", "Recordarme");
    const forgotPasswordLink = Link("¿Olvidaste tu contraseña?", "#");
    forgotPasswordLink.className = "atom-link atom-link--forgot";

    optionsDiv.append(rememberMeField, forgotPasswordLink);

    // Reutilizamos el átomo Button
    const submitBtn = Button("Iniciar sesión", "submit");

    // Divisor visual "o iniciar con"
    const divider = document.createElement("div");
    divider.className = "form-divider";
    divider.innerHTML = "<span>o iniciar con</span>";

    // Contenedor de botones sociales
    const mediaDiv = document.createElement("div");
    mediaDiv.className = "form-row-2";

    const googleBtn = Button("Google", "button", "social", "medium");
    const facebookBtn = Button("Facebook", "button", "social", "medium");
    mediaDiv.append(googleBtn, facebookBtn);

    // --- MANEJADORES DE REDIRECCIÓN A HOME ---

    // 1. Redirección al enviar el formulario (Submit)
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Evitamos el comportamiento por defecto de envío del formulario
        window.location.href = "home.html";
    });

    // 2. Redirección al hacer clic en Google
    googleBtn.addEventListener("click", () => {
        window.location.href = "home.html";
    });

    // 3. Redirección al hacer clic en Facebook
    facebookBtn.addEventListener("click", () => {
        window.location.href = "home.html";
    });

    // Pie de página con el link a Registro
    const footerText = document.createElement("p");
    footerText.className = "form-footer";
    footerText.textContent = "¿No tenés una cuenta? ";

    const registerLink = Link("Crear una", "registro.html");
    footerText.appendChild(registerLink);

    // Ensamblamos el organismo
    form.append(
        mainHeaderContent,
        subTitle,
        emailField,
        passwordField,
        optionsDiv,
        submitBtn,
        divider,
        mediaDiv,
        footerText
    );

    return form;
}
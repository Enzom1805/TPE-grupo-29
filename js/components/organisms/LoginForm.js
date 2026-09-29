import FormField from '../molecules/FormField.js';
import CheckboxField from '../molecules/CheckboxField.js';
import Button from '../atoms/Button.js';
import Link from "../atoms/Link.js";
import Icon from "../atoms/Icon.js";
import { setupPasswordToggle } from '../../utils/validators.js';

export default function LoginForm() {

    const form = document.createElement("form");
    form.className = "form";

    // ==========================================
    // CONTENEDOR PRINCIPAL DEL HEADER
    // ==========================================

    const mainHeaderContent = document.createElement("div");
    mainHeaderContent.className = "form-header";

    const title = document.createElement("h1");
    title.innerText = "Ingresar";
    title.className = "form-h1";

    const logo = Icon("../assets/icons/logo-crown-variant.svg", "Logo");
    logo.className = "form-icon-logo";

    mainHeaderContent.append(logo, title);

    // ==========================================
    // SUBTÍTULO
    // ==========================================

    const subTitle = document.createElement("p");
    subTitle.innerText = "Inicia sesión para continuar en Kingly Games.";

    // ==========================================
    // CAMPOS
    // ==========================================

    const emailField = FormField(
        "Correo electrónico",
        "email",
        "email",
        "ejemplo@mail.com"
    );

    const passwordField = FormField(
        "Contraseña",
        "password",
        "password",
        "Mínimo 6 caracteres"
    );

    // Toggle de contraseña
    const passwordInput = passwordField.querySelector("input");

    if (passwordInput) {
        setupPasswordToggle(passwordInput);
    }

    // ==========================================
    // CONTENEDOR DE OPCIONES
    // ==========================================

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "form-options";

    const rememberMeField = CheckboxField(
        "remember",
        "Recordarme"
    );

    const forgotPasswordLink = Link(
        "¿Olvidaste tu contraseña?",
        "#"
    );

    forgotPasswordLink.className = "atom-link atom-link--forgot";

    optionsDiv.append(
        rememberMeField,
        forgotPasswordLink
    );

    // ==========================================
    // BOTÓN DE SUBMIT
    // ==========================================

    const submitBtn = Button(
        "Iniciar sesión",
        "submit"
    );

    // ==========================================
    // DIVISOR VISUAL
    // ==========================================

    const divider = document.createElement("div");
    divider.className = "form-divider";
    divider.innerHTML = "<span>o iniciar con</span>";

    // ==========================================
    // BOTONES SOCIALES
    // ==========================================

    const mediaDiv = document.createElement("div");
    mediaDiv.className = "form-row-2";

    const googleBtn = Button(
        "Google",
        "button",
        "social",
        "medium"
    );

    const facebookBtn = Button(
        "Facebook",
        "button",
        "social",
        "medium"
    );

    mediaDiv.append(
        googleBtn,
        facebookBtn
    );

    // ==========================================
    // REDIRECCIÓN DIRECTA A HOME
    // ==========================================

    const redirectToHome = () => {
        window.location.href = "home.html";
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        redirectToHome();
    });

    googleBtn.addEventListener("click", redirectToHome);
    facebookBtn.addEventListener("click", redirectToHome);

    // ==========================================
    // FOOTER
    // ==========================================

    const footerText = document.createElement("p");
    footerText.className = "form-footer";
    footerText.textContent = "¿No tenés una cuenta? ";

    const registerLink = Link(
        "Crear una",
        "registro.html"
    );

    footerText.appendChild(registerLink);

    // ==========================================
    // ENSAMBLADO DEL ORGANISMO
    // ==========================================

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
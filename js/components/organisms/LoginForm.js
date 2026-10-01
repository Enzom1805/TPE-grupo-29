import FormField from '../molecules/FormField.js';
import CheckboxField from '../molecules/CheckboxField.js';
import Button from '../atoms/Button.js';
import Link from "../atoms/Link.js";
import Icon from "../atoms/Icon.js";
import { setupPasswordToggle } from '../../utils/validators.js';

export default function LoginForm() {

    const form = document.createElement("form");
    form.className = "form";

    // Header
    const mainHeaderContent = document.createElement("div");
    mainHeaderContent.className = "form-header";

    const title = document.createElement("h1");
    title.innerText = "Ingresar";
    title.className = "form-h1";

    const logo = Icon("../assets/icons/logo-form.svg", "Logo");

    mainHeaderContent.append(logo, title);

    // Subtítulo
    const subTitle = document.createElement("p");
    subTitle.innerText = "Inicia sesión para continuar en Kingly Games.";

    // Campos
    const emailField = FormField(
        "Correo electrónico",
        "email",
        "email",
        "ejemplo@mail.com",
        true
    );

    const passwordField = FormField(
        "Contraseña",
        "password",
        "password",
        "Mínimo 6 caracteres",
        true
    );

    const passwordInput = passwordField.querySelector("input");
    if (passwordInput) {
        setupPasswordToggle(passwordInput);
    }

    // Opciones (Recordarme / Olvidaste contraseña)
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

    // Botón Submit
    const submitBtn = Button(
        "Iniciar sesión",
        "submit"
    );

    // Divisor
    const divider = document.createElement("div");
    divider.className = "form-divider";
    divider.innerHTML = "<span>o iniciar con</span>";

    // Botones sociales
    const mediaDiv = document.createElement("div");
    mediaDiv.className = "form-row-2";

    const googleBtn = Button(
        "Google",
        "button",
        "social atom-button--google",
        "medium"
    );

    const facebookBtn = Button(
        "Facebook",
        "button",
        "social atom-button--facebook",
        "medium"
    );

    mediaDiv.append(
        googleBtn,
        facebookBtn
    );

    const redirectToHome = () => {
        window.location.href = "home.html";
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        redirectToHome();
    });

    googleBtn.addEventListener("click", redirectToHome);
    facebookBtn.addEventListener("click", redirectToHome);

    // Footer
    const footerText = document.createElement("span");
    footerText.className = "form-footer";
    footerText.textContent = "¿No tenés una cuenta? ";

    const registerLink = Link(
        "Crear una",
        "register.html"
    );

    footerText.appendChild(registerLink);

    // Ensamblado
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
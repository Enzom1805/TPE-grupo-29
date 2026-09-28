import LoginForm from "../components/organisms/LoginForm.js";

document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("app");

    // Instanciamos y montamos el organismo
    const loginFormNode = LoginForm();
    appContainer.appendChild(loginFormNode);
});
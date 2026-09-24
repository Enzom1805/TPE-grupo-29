import RegisterForm from '../components/organisms/RegisterForm.js';

document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("app");

    // Instanciamos y montamos el organismo
    const registerFormNode = RegisterForm();
    appContainer.appendChild(registerFormNode);
});
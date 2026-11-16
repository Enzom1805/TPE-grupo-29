import RegisterForm from '../features/auth/components/RegisterForm.js';

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    const registerFormNode = RegisterForm();
    appContainer.appendChild(registerFormNode);
});
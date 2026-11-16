import LoginForm from '../features/auth/components/LoginForm.js';

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    const loginFormNode = LoginForm();
    appContainer.appendChild(loginFormNode);
});
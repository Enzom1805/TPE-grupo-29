import LoginForm from '../components/organisms/LoginForm.js';

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    const loginFormNode = LoginForm();
    appContainer.appendChild(loginFormNode);
});
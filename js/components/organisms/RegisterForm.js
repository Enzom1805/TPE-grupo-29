import FormField from '../molecules/FormField.js';
import CheckboxField from '../molecules/CheckboxField.js';
import Button from '../atoms/Button.js';

export default function RegisterForm() {
    const form = document.createElement("form");
    form.className = "register-form";

    // Reutilizamos la molécula FormField para cada campo del formulario
    const nameField = FormField("Nombre", "text", "username", "Ingresá tu nombre");
    const emailField = FormField("Correo electrónico", "email", "email", "ejemplo@mail.com");
    const passwordField = FormField("Contraseña", "password", "password", "Mínimo 6 caracteres");
    const confirmPasswordField = FormField("Repetí contraseña", "password", "password", "");
    const birthDateField = FormField("Fecha de nacimiento", "date", "birthdate", "");

    // Reutilizamos CheckboxField para los términos
    const termsField = CheckboxField("terms", "Acepto los términos y condiciones");

    const captchaField = CheckboxField("captcha", "Confirma que no eres un robot");

    // Reutilizamos el átomo Button
    const submitBtn = Button("Registrarse", "submit");

    // Ensamblamos el organismo
    form.append(nameField, emailField, passwordField, confirmPasswordField,birthDateField, termsField, captchaField ,submitBtn);

    return form;
}
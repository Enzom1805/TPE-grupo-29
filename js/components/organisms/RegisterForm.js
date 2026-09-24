import FormField from "../molecules/FormField";
import CheckboxField from "../molecules/CheckboxField";
import Button from "../atoms/Button";

export default function RegisterForm() {
    const form = document.createElement("form");

    // Campos que componen el formulario de registro

    const nameField = FormField(
        "Nombre",
        "text",
        "name",
        "Ingresá tu nombre"
    );

    const lastNameField = FormField(
        "Apellido",
        "text",
        "lastName",
        "Ingresá tu apellido"
    );

    const emailField = FormField(
        "Email",
        "email",
        "email",
        "Ingresá tu email"
    );

    const phoneField = FormField(
        "Teléfono",
        "tel",
        "phone",
        "Ingresá tu número de teléfono"
    );

    const ageField = FormField(
        "Edad",
        "number",
        "age",
        "Ingresá tu edad"
    );

    const postalField = FormField(
        "Código postal",
        "text",
        "postalCode",
        "7000"
    );

    const countryField = FormField(
        "País",
        "text",
        "country",
        "Argentina"
    );

    const passwordField = FormField(
        "Contraseña",
        "password",
        "password",
        "Ingresá tu contraseña"
    );

    const confirmPasswordField = FormField(
        "Confirmar contraseña",
        "password",
        "confirmPassword",
        "Repetí tu contraseña"
    );

    // Términos y condiciones

    const termsField = CheckboxField(
        "terms",
        "Acepto los Términos y condiciones, y la Política de privacidad."
    );

    // CAPTCHA
    const captchaField = CheckboxField(
        "captcha",
        "Verificar CAPTCHA"
    );

    // Botón de registro

    const submitButton = Button(
        "Registrarse",
        "submit"
    );

    // Componemos el formulario

    form.appendChild(nameField);
    form.appendChild(lastNameField);
    form.appendChild(emailField);
    form.appendChild(phoneField);
    form.appendChild(ageField);
    form.appendChild(postalField);
    form.appendChild(countryField);
    form.appendChild(passwordField);
    form.appendChild(confirmPasswordField);
    form.appendChild(termsField);
    form.appendChild(captchaField);
    form.appendChild(submitButton);

    return form;
}
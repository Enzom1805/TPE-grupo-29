import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import Checkbox from "../atoms/Checkbox";

export default function RegisterForm() {
    const form = document.createElement("form");

    //Lo que hacemos acá es crear cada parte que compone el formulario de registro
    const nameField = FormField (
        "Nombre",
        "text",
        "name",
        "Ingresá tu nombre"
    );

    const ageField = FormField(
        "Edad",
        "number",
        "age",
        "Ingresá tu edad"
    )

    const emailField = FormField (
        "Email",
        "email",
        "name",
        "Ingresá tu email"
    );

    const passwordField = FormField (
        "Contraseña",
        "password",
        "password",
        "Ingresá tu contraseña"
    );
    const confirmPasswordField = FormField (
        "Confirmar contraseña",
        "password",
        "confirmPassword",
        "Repetí tu contraseña"
    );


    //Captcha field
    const checkboxField = Checkbox("checkbox");

    const text = document.createElement("p");
    text.innerHTML = "Confirma que no eres un robot";

    checkboxField.appendChild(text);

    const captchaField = FormField (
        "Re-Captcha",
        "captcha",
        "captcha",
        ""
    );
    captchaField.appendChild(checkboxField);

    const submitButton = Button ("Registrarse", "submit");

    //acá medio que enganchamos lo que creamos anteriormente a "form"
    form.appendChild(nameField);
    form.appendChild(emailField);
    form.appendChild(ageField);
    form.appendChild(passwordField);
    form.appendChild(confirmPasswordField);
    form.appendChild(captchaField);
    form.appendChild(submitButton);

    return form;

}
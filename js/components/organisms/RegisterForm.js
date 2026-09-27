import FormField from '../molecules/FormField.js';
import CheckboxField from '../molecules/CheckboxField.js';
import Button from '../atoms/Button.js';

export default function RegisterForm() {
    const form = document.createElement("form");
    form.className = "register-form";

    //Contenedor principal del header
    const mainHeaderContent = document.createElement("div");
    mainHeaderContent.className = "register-form-header";
    const title = document.createElement("h1");
    title.innerText = "Crear una cuenta";
    const logo = document.createElement("img");
    logo.src = "img/logo.png";
    mainHeaderContent.append(title,logo);

    const subTitle = document.createElement("p");
    subTitle.innerText = "Completa tus datos para crear tu cuenta en Kingly Games.";



    // Reutilizamos la molécula FormField para cada campo del formulario
    //Contenedor con 2 campos
    const fullNameDiv = document.createElement("div");
    const nameField = FormField("Nombre", "text", "name", "Ingresá tu nombre");
    const lastNameField = FormField("Apellido", "text", "lastName", "Ingresá tu apellido");
    fullNameDiv.append(nameField,lastNameField);
    fullNameDiv.className = "register-form-row-2";

    //Contenedor con 2 campos
    const emailPhoneDiv = document.createElement("div");
    const emailField = FormField("Correo electrónico", "email", "email", "ejemplo@mail.com");
    const phoneField = FormField("Teléfono", "tel", "phone", "+54-2494777777");
    emailPhoneDiv.append(emailField,phoneField);
    emailPhoneDiv.className = "register-form-row-2";

    // Div contenedor de 3 campos
    const agePostalCountryDiv = document.createElement("div");
    const birthDateField = FormField("Edad", "date", "birthdate", "");
    const postalCodeField = FormField("Código postal", "text", "postalcode", "B7000");
    const countryField = FormField ("País", "select","country","Argentina");
    agePostalCountryDiv.append(birthDateField,postalCodeField,countryField);
    agePostalCountryDiv.className = "register-form-row-3";

    const passwordField = FormField("Contraseña", "password", "password", "Mínimo 6 caracteres");
    const confirmPasswordField = FormField("Repetí contraseña", "password", "password", "");


    // Reutilizamos CheckboxField para los términos
    const termsField = CheckboxField("terms", "Acepto los términos y condiciones");

    const captchaField = CheckboxField("captcha", "Confirma que no eres un robot");

    // Reutilizamos el átomo Button
    const submitBtn = Button("Registrarse", "submit");

    // Ensamblamos el organismo
    form.append(mainHeaderContent, subTitle, emailPhoneDiv, agePostalCountryDiv,passwordField, confirmPasswordField, termsField, captchaField ,submitBtn);

    return form;
}
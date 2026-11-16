import { assert, assertEquals } from "./assert.js";
import { validateRegisterForm } from "../shared/utils/validators.js";

export default [
    {
        name: "validators: formulario válido devuelve null",
        fn: () => {
            const result = validateRegisterForm({
                name: "Ada", lastName: "Lovelace", email: "ada@mail.com",
                password: "secreta1", confirmPassword: "secreta1", terms: true
            });
            assertEquals(result, null, "sin errores");
        }
    },
    {
        name: "validators: campos vacíos generan errores por campo",
        fn: () => {
            const errors = validateRegisterForm({});
            assert(errors !== null, "debe haber errores");
            assert("name" in errors && "lastName" in errors && "email" in errors, "campos requeridos");
            assert("password" in errors && "confirmPassword" in errors, "contraseñas requeridas");
            assert("terms" in errors, "términos requeridos");
        }
    },
    {
        name: "validators: email inválido es rechazado",
        fn: () => {
            const errors = validateRegisterForm({
                name: "A", lastName: "B", email: "no-es-un-mail",
                password: "123456", confirmPassword: "123456", terms: true
            });
            assert(errors !== null && errors.email === "Email inválido", "email inválido detectado");
        }
    },
    {
        name: "validators: contraseña corta es rechazada",
        fn: () => {
            const errors = validateRegisterForm({
                name: "A", lastName: "B", email: "a@b.com",
                password: "123", confirmPassword: "123", terms: true
            });
            assert(errors !== null && errors.password === "Mínimo 6 caracteres", "mínimo de caracteres");
        }
    },
    {
        name: "validators: contraseñas que no coinciden son rechazadas",
        fn: () => {
            const errors = validateRegisterForm({
                name: "A", lastName: "B", email: "a@b.com",
                password: "123456", confirmPassword: "654321", terms: true
            });
            assert(errors !== null && errors.confirmPassword === "No coinciden", "no coinciden");
        }
    }
];

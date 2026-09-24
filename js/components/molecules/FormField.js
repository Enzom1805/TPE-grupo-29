import Label from '../atoms/Label.js'
import Input from '../atoms/Input.js';

export default function FormField(labelText, type, name, placeholder) {
    const container = document.createElement("div");
    container.className = "molecule-form-field"; // <--- Añadir clase hereeeee

    const label = Label(labelText, name);
    const input = Input(type, name, placeholder);

    container.append(label);
    container.append(input);

    return container;

}
//AHora se podria hacer FormField("Nombre de usuario", "text", "username", "Ingresá tu nombre")
/* conceptualmente seria como hacer:
<div>
    <label for="username">
        Nombre de usuario
    </label>

    <input
        type="text"
        name="username"
        placeholder="Ingresá tu nombre"
    >
</div>
 */
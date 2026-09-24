import Label from '../atoms/Label'
import Input from '../atoms/Input';

export default function FormField(labelText, type, name, placeholder) {
    const container = document.createElement("div");

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
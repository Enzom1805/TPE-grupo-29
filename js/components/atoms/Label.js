
export default function Label(text, htmlFor) {

    const label = document.createElement("label");

    label.textContent = text;
    label.htmlFor = htmlFor;

    return label;
}

//se podria hacer por ejemplo Label("Nombre de usuario", "username"); . COnceptualmente generaria algo tipo
// <label for = "username"> Nombre de usuario </label>


export default function Button (text, type = "button"){

    const button = document.createElement("button")

    button.type = type;
    button.textContent = text;

    return button;
}

//ejemplo de uso Button("Registrarse", "submit");
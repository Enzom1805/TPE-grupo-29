export default function Button (text, type = "button"){

    const button = document.createElement("button")

    button.type = type;
    button.textContent = text;
    button.className = "atom-button-register"; // <--- Aca hay que añadir el nombre de clase


    return button;
}

//ejemplo de uso Button("Registrarse", "submit");
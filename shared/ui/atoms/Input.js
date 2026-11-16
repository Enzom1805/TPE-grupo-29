//tiene que tener un text email password y date

export default function Input(type, name, placeholder){
    const input = document.createElement("input");

    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.className = "atom-input"; // <--- Añadimos el nombre de clase

    return input;
}
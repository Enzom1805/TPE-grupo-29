export default function Checkbox(name) {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = name;
    input.id = name;
    input.className = "atom-checkbox";
    return input;
}
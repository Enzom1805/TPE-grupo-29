import Checkbox from "../atoms/Checkbox";

export default function CheckboxField(name, text) {
    const container = document.createElement("div");

    const checkbox = Checkbox(name);

    const label = document.createElement("label");
    label.textContent = text;

    container.appendChild(checkbox);
    container.appendChild(label);

    return container;
}
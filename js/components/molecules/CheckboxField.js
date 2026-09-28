import Checkbox from '../atoms/Checkbox.js';

export default function CheckboxField(name, text) {
    const container = document.createElement("div");
    container.className = "molecule-checkbox-field";

    const checkbox = Checkbox(name);

    const label = document.createElement("label");
    label.htmlFor = name; // Vincula el label al checkbox por id
    label.textContent = text;
    label.className = "checkbox-label";

    // El input DEBE ir antes del label para que en CSS funcione: input:checked + .checkbox-label
    container.appendChild(checkbox);
    container.appendChild(label);

    return container;
}
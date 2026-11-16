import Checkbox from '../atoms/Checkbox.js';

export default function CheckboxField(name, text, isRequired = false) {
    const container = document.createElement("div");
    container.classList.add("molecule-checkbox-field");

    const checkbox = Checkbox(name);
    const inputEl = checkbox.tagName === "INPUT"
        ? checkbox
        : checkbox.querySelector("input[type='checkbox']");

    if (inputEl) {
        if (name) {
            inputEl.id = name;
            inputEl.name = name;
        }
        if (isRequired) {
            inputEl.required = true;
        }
    }

    const labelWrapper = document.createElement("div");
    labelWrapper.className = "checkbox-label-wrapper";

    const label = document.createElement("label");
    if (name) label.htmlFor = name;
    label.textContent = text;
    label.className = "checkbox-label";
    labelWrapper.appendChild(label);

    if (isRequired) {
        const requiredSpan = document.createElement("span");
        requiredSpan.className = "form-field-required";
        requiredSpan.innerText = "*"; // Solo el asterisco
        labelWrapper.appendChild(requiredSpan);
    }

    container.appendChild(checkbox);
    container.appendChild(labelWrapper);

    return container;
}
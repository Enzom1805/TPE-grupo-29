export default function FormField(label, type = "text", name = "", placeholder = "", isRequired = false, options = []) {
    const container = document.createElement("div");
    container.className = "molecule-form-field";

    const header = document.createElement("div");
    header.className = "form-field-header";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    if (name) labelEl.htmlFor = name;
    header.appendChild(labelEl);

    if (isRequired) {
        const requiredSpan = document.createElement("span");
        requiredSpan.className = "form-field-required";
        requiredSpan.innerText = "*";
        header.appendChild(requiredSpan);
    }

    container.appendChild(header);

    let inputEl;
    if (type === "select") {
        inputEl = document.createElement("select");

        // Opción por defecto (Placeholder)
        if (placeholder) {
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = placeholder;
            defaultOption.disabled = true;
            defaultOption.selected = true;
            inputEl.appendChild(defaultOption);
        }

        // Inserción dinámica de países
        options.forEach(optionText => {
            const opt = document.createElement("option");
            opt.value = optionText;
            opt.textContent = optionText;
            inputEl.appendChild(opt);
        });
    } else {
        inputEl = document.createElement("input");
        inputEl.type = type;
        if (placeholder) inputEl.placeholder = placeholder;
    }

    inputEl.className = "atom-input";
    if (name) {
        inputEl.id = name;
        inputEl.name = name;
    }
    if (isRequired) inputEl.required = true;

    if (type === "password") {
        const passwordWrapper = document.createElement("div");
        passwordWrapper.className = "password-input-wrapper";
        passwordWrapper.appendChild(inputEl);
        container.appendChild(passwordWrapper);
    } else {
        container.appendChild(inputEl);
    }

    return container;
}
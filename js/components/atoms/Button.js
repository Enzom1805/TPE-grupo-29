export default function Button(text, type = "button", variant = "primary", size = "medium") {
    const button = document.createElement("button");
    button.type = type;
    button.textContent = text;

    // Asignación de clases dinámicas según la variante
    button.className = `atom-button atom-button--${variant} atom-button--${size}`;

    return button;
}

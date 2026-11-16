export default function Button(text = '', type = 'button', variant = 'primary', size = 'medium', iconClass = '') {
    const button = document.createElement('button');
    button.type = type;
    button.className = `atom-button atom-button--${variant} atom-button--${size}`;

    // si pasamos una clase de ícono, creamos el elemento
    if (iconClass) {
        const icon = document.createElement('i');
        icon.className = `icon ${iconClass}`;
        button.appendChild(icon);
    }
    // si hay texto, lo agregamos despues del ícono
    if (text) {
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        button.appendChild(textSpan);
    }

    return button;
}
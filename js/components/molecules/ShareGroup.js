import Button from '../atoms/Button.js';

export default function ShareGroup() {
    const container = document.createElement('div');
    container.className = 'share-group';

    // El texto previo a los botones
    const title = document.createElement('span');
    title.className = 'share-group__title';
    title.textContent = 'COMPARTE NUESTRO JUEGO EN:';

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'share-group__buttons';

    // Instanciamos los átomos usando la variante "social"
    // Pasamos el texto, tipo, variante, tamaño, y la clase de tu librería de íconos
    const btnFacebook = Button("Facebook", "button", "primary", "small", "icon-facebook");
    const btnInstagram = Button("Instagram", "button", "primary", "small", "icon-instagram");
    const btnGmail = Button("Gmail", "button", "primary", "small", "icon-google-circle");
    const btnMensaje = Button("Mensaje", "button", "primary", "small", "icon-chat-lines");
    const btnYoutube = Button("Youtube", "button", "primary", "small", "icon-youtube");

    // Ensamblamos
    buttonsContainer.append(btnFacebook, btnInstagram, btnGmail, btnMensaje, btnYoutube);
    container.append(title, buttonsContainer);

    return container;
}
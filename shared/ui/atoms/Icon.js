export default function Icon(src, alt = "Icono") {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = "atom-icon";

    return img;
}

//Ejemplo de uso enzito:
//const logo = Icon("../assets/icons/full-logo.svg", "Logo completo");
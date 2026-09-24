export default function Link(text, href){
    const link = document.createElement("a");

    link.textContent = text;
    link.href = href;

    return link;
}
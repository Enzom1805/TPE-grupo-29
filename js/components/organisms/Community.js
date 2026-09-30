//Encabezado + CommentForm.js + Lista de CommentCard.js + Button.js ("Ver más")
import CommentForm from '../molecules/CommentForm.js';
import CommentCard from '../molecules/CommentCard.js';
import Button from '../atoms/Button.js';

export default function Community({ gameTitle = "The Batman Peg Solitaire", comments = [] }) {
    const section = document.createElement("section");
    section.className = "organism-community";

    // Encabezado del Foro
    const header = document.createElement("header");
    header.className = "community__header";

    const title = document.createElement("h2");
    title.className = "community__title";
    title.textContent = `Comunidad - ${gameTitle}`;

    const countSpan = document.createElement("span");
    countSpan.className = "community__count";
    const totalCount = comments.length > 0 ? comments.length : 128;
    countSpan.textContent = `${totalCount} comentarios`;

    header.append(title, countSpan);

    // Contenedor de la lista de comentarios
    const listContainer = document.createElement("div");
    listContainer.className = "community__list";

    // Formulario para publicar comentarios
    const commentForm = CommentForm((newText) => {
        const newCard = CommentCard({
            username: "tu_usuario",
            timeAgo: "hace un momento",
            content: newText,
            likes: 0
        });
        listContainer.prepend(newCard);

        // Actualización dinámica del contador
        const currentTotal = listContainer.children.length;
        countSpan.textContent = `${currentTotal} comentarios`;
    });

    // Carga de comentarios desde la data
    comments.forEach((commentData) => {
        const card = CommentCard(commentData);
        listContainer.appendChild(card);
    });

    // Botón de cargar más comentarios
    const loadMoreWrapper = document.createElement("div");
    loadMoreWrapper.className = "community__load-more";

    const loadMoreBtn = Button("Ver más comentarios", "button", "primary", "medium");
    loadMoreBtn.classList.add("atom-button--pill-large");

    loadMoreWrapper.appendChild(loadMoreBtn);

    section.append(header, commentForm, listContainer, loadMoreWrapper);

    return section;
}
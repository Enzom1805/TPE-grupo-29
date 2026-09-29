import Icon from '../atoms/Icon.js';
import Button from '../atoms/Button.js';

export default function CommentCard({ username, timeAgo, content, likes = 0, avatarSrc }) {
    const card = document.createElement("article");
    card.className = "molecule-comment-card";

    // Header: Avatar (usando Icon.js) + Nombre de usuario y antigüedad
    const header = document.createElement("header");
    header.className = "comment-card__header";

    const avatarImg = Icon(avatarSrc || "../assets/icons/Avatar.svg", username);
    avatarImg.className = "atom-icon-avatar";

    const userInfo = document.createElement("div");
    userInfo.className = "comment-card__user-info";

    const nameSpan = document.createElement("strong");
    nameSpan.className = "comment-card__username";
    nameSpan.textContent = username;

    const timeSpan = document.createElement("span");
    timeSpan.className = "comment-card__time";
    timeSpan.textContent = ` ${timeAgo}`;

    userInfo.append(nameSpan, timeSpan);
    header.append(avatarImg, userInfo);

    // Contenido del comentario
    const body = document.createElement("p");
    body.className = "comment-card__body";
    body.textContent = content;

    // Footer: Botón de Likes (con estado interactivo) + Botón Responder
    const footer = document.createElement("footer");
    footer.className = "comment-card__footer";

    let currentLikes = likes;
    let isLiked = false;

    // Usamos la firma de tu Button.js con icono "icon-like"
    const likeBtn = Button(String(currentLikes), "button", "ghost", "small", "icon-like");
    likeBtn.classList.add("comment-card__like-btn");

    likeBtn.addEventListener("click", () => {
        isLiked = !isLiked;
        currentLikes += isLiked ? 1 : -1;
        likeBtn.classList.toggle("is-liked", isLiked);

        const spanText = likeBtn.querySelector("span");
        if (spanText) {
            spanText.textContent = String(currentLikes);
        }
    });

    const replyBtn = Button("Responder", "button", "outline", "small");
    replyBtn.classList.add("comment-card__reply-btn");

    footer.append(likeBtn, replyBtn);

    card.append(header, body, footer);
    return card;
}
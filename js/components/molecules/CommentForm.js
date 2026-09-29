//Label + Textarea.js + Button.js ("Publicar")
import Textarea from '../atoms/Textarea.js';
import Button from '../atoms/Button.js';

export default function CommentForm(onSubmit) {
    const form = document.createElement("form");
    form.className = "molecule-comment-form";

    const title = document.createElement("h3");
    title.className = "comment-form__title";
    title.textContent = "Deja un comentario";

    const labelRow = document.createElement("div");
    labelRow.className = "comment-form__label-row";

    const label = document.createElement("label");
    label.textContent = "Escribe tu comentario";

    const optionalSpan = document.createElement("span");
    optionalSpan.className = "comment-form__optional";
    optionalSpan.textContent = "Ayuda";

    labelRow.append(label, optionalSpan);

    const textarea = Textarea("Comparte tu opinión sobre el juego...", "comment", 3);

    const actionsRow = document.createElement("div");
    actionsRow.className = "comment-form__actions";

    // Usamos la firma de tu Button.js: Button(text, type, variant, size)
    const submitBtn = Button("Publicar", "submit", "primary", "medium");
    submitBtn.classList.add("atom-button--pill");

    actionsRow.appendChild(submitBtn);

    form.append(title, labelRow, textarea, actionsRow);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = textarea.value.trim();
        if (text && onSubmit) {
            onSubmit(text);
            textarea.value = "";
        }
    });

    return form;
}
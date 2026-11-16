export default function Textarea(placeholder = "", name = "", rows = 3) {
    const textarea = document.createElement("textarea");
    textarea.className = "atom-textarea";
    textarea.placeholder = placeholder;
    textarea.name = name;
    textarea.rows = rows;
    return textarea;
}
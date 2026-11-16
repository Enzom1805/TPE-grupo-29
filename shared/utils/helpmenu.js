export default function helpMenu(trigger, target, active = 'isActive'){

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        target.classList.toggle(active);

    });

    document.addEventListener('click', (e) => {
        // Si el click no está dentro del target ni dentro del trigger, cerramos el modal
        if (!target.contains(e.target) && !trigger.contains(e.target)) {
            target.classList.remove(active);
        }
    });
}
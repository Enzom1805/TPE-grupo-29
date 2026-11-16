export default function Dropdown(trigger, content, align = "left"){

    const container = document.createElement('div');
    container.className = "util-dropdown";

    content.classList.add('util-dropdown__content');
    if(align === 'right'){
        content.classList.add('util-dropdown__content--right');
    }
    let isOpen = false;

    const toggleDropdown = (e) => {
        e.stopPropagation();
        isOpen = !isOpen;

        if(isOpen){
            content.classList.add('is-open');
            console.log('Dropdown: abierto');
        } else {
            content.classList.remove('is-open');
            console.log('Dropdown: cerrado');
        }
    };

    trigger.addEventListener('click', toggleDropdown);

    document.addEventListener('click', (e) => {

        if (isOpen && !container.contains(e.target)) {
            isOpen = false;
            content.classList.remove('is-open');
            console.log('Dropdown: cerrado');
        }
    });

    container.appendChild(trigger);
    container.appendChild(content);

    return container;


}
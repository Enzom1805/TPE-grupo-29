import GameCard from '../molecules/GameCard.js';
import Button from '../atoms/Button.js'; // Importamos el átomo
import { playSwipeLeftSound, playSwipeRightSound } from '../../utils/sound.js';


export default function CategoryCarousel(title, gamesArray) {
    const section = document.createElement('section');
    section.className = 'category-carousel';

    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
        <h2 class="category-title">${title}</h2>
        <a href="#" class="category-more">Ver Más &rarr;</a>
    `;
    section.appendChild(header);

    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';

    // Instanciamos los botones atómicos
    // Button(text, type, variant, size, iconClass)
    const btnPrev = Button("", "button", "carousel", "medium", "icon-nav-arrow-left");
    btnPrev.classList.add('prev', 'atom-button--hidden'); // Añadimos clases para posicionar y ocultar

    const btnNext = Button("", "button", "carousel", "medium", "icon-nav-arrow-right");
    btnNext.classList.add('next'); // Añadimos clase para posicionar

    const track = document.createElement('div');
    track.className = 'carousel-track';

    gamesArray.forEach(game => {
        const card = GameCard(game);
        track.appendChild(card);
    });

    const scrollAmount = 300;

    btnPrev.addEventListener('click', () => {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        playSwipeLeftSound(); // Sonido al desplazar hacia la izquierda


    });

    btnNext.addEventListener('click', () => {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        playSwipeRightSound(); // Sonido al desplazar hacia la izquierda

    });

    // Lógica para ocultar/mostrar botones
    const updateButtonVisibility = () => {
        if (track.scrollLeft <= 1) {
            btnPrev.classList.add('atom-button--hidden');
        } else {
            btnPrev.classList.remove('atom-button--hidden');
        }

        if (Math.ceil(track.scrollLeft) >= (track.scrollWidth - track.clientWidth) - 1) {
            btnNext.classList.add('atom-button--hidden');
        } else {
            btnNext.classList.remove('atom-button--hidden');
        }
    };

    track.addEventListener('scroll', updateButtonVisibility);

    const observer = new ResizeObserver(() => {
        updateButtonVisibility();
    });
    observer.observe(track);

    wrapper.appendChild(btnPrev);
    wrapper.appendChild(track);
    wrapper.appendChild(btnNext);

    section.appendChild(wrapper);

    return section;
}
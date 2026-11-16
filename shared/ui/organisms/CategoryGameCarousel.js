import GameCard from '../molecules/GameCard.js';
import Button from '../atoms/Button.js';
import { playSwipeLeftSound, playSwipeRightSound } from '../../utils/sound.js';

export default function CategoryCarousel(title, gamesArray = []) {
    const section = document.createElement('section');
    section.className = 'category-carousel';

    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
    <h2 class="category-title">${title}</h2>
    <a href="#" class="category-more">Ver Más →</a>
  `;
    section.appendChild(header);

    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';

    const btnPrev = Button("", "button", "carousel", "medium", "icon-nav-arrow-left");
    btnPrev.classList.add('prev', 'atom-button--hidden');

    const btnNext = Button("", "button", "carousel", "medium", "icon-nav-arrow-right");
    btnNext.classList.add('next');

    const track = document.createElement('div');
    track.className = 'carousel-track';

    gamesArray.forEach(game => {
        const card = GameCard(game);
        track.appendChild(card);
    });

    // --- LÓGICA DE FÍSICA Y DESPLAZAMIENTO ---
    let motionTimeout = null;

    // Activa la clase que desencadena el impulso, frenado elástico y skew
    const triggerMotionPhysics = (direction) => {
        track.classList.remove('is-moving-next', 'is-moving-prev');

        // Forzamos un reflow rápido para reiniciar la animación CSS si se presiona seguido
        void track.offsetWidth;

        if (direction === 'next') {
            track.classList.add('is-moving-next');
        } else {
            track.classList.add('is-moving-prev');
        }

        clearTimeout(motionTimeout);
        motionTimeout = setTimeout(() => {
            track.classList.remove('is-moving-next', 'is-moving-prev');
        }, 450);
    };

    const scrollAmount = 320;

    btnPrev.addEventListener('click', () => {
        triggerMotionPhysics('prev');
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        playSwipeLeftSound();
    });

    btnNext.addEventListener('click', () => {
        triggerMotionPhysics('next');
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        playSwipeRightSound();
    });

    // Lógica de visibilidad de botones
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

    track.addEventListener('scroll', updateButtonVisibility, { passive: true });

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
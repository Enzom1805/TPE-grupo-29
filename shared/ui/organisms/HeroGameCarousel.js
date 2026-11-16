import Button from '../atoms/Button.js';
import HeroCard from '../molecules/HeroGameCard.js';
import { playSwipeLeftSound, playSwipeRightSound } from '../../utils/sound.js';

export default function HeroCarousel(gamesArray) {
    const section = document.createElement('section');
    section.className = 'hero-carousel';
    const header = document.createElement('header');
    header.className = 'hero-carousel__header';

    const crownIcon = document.createElement('i');
    crownIcon.className = 'icon icon-crown hero-carousel__icon';

    const title = document.createElement('h2');
    title.className = 'hero-carousel__title';

    title.innerHTML = 'Nuestras Recomendaciones <br> <span class="text-premium">Premium</span>';

    header.appendChild(crownIcon);
    header.appendChild(title);
    section.appendChild(header);
    const container = document.createElement('div');
    container.className = 'hero-track-container';

    let currentIndex = 2; // Arranca en el centro (índice 2, la tercera tarjeta)
    const cards = [];

    gamesArray.forEach((game) => {
        const card = HeroCard(game);
        container.appendChild(card);
        cards.push(card);
    });

    const btnPrev = Button("", "button", "carousel", "medium", "icon-nav-arrow-left");
    btnPrev.classList.add('btn-prev');

    const btnNext = Button("", "button", "carousel", "medium", "icon-nav-arrow-right");
    btnNext.classList.add('btn-next');

    // Lógica de asignación de clases para el efecto Coverflow
    const updateCarousel = () => {
        cards.forEach((card, index) => {
            // Limpiamos las clases de estado
            card.classList.remove('active', 'prev', 'next', 'hidden-left', 'hidden-right');

            if (index === currentIndex) {
                card.classList.add('active'); // Centro
            } else if (index === currentIndex - 1) {
                card.classList.add('prev'); // 1 a la izquierda
            } else if (index === currentIndex + 1) {
                card.classList.add('next'); // 1 a la derecha
            } else if (index === currentIndex - 2) {
                card.classList.add('hidden-left'); // 2 a la izquierda
            } else if (index === currentIndex + 2) {
                card.classList.add('hidden-right'); // 2 a la derecha
            }
        });

        btnPrev.style.display = currentIndex === 0 ? 'none' : 'flex';
        btnNext.style.display = currentIndex === cards.length - 1 ? 'none' : 'flex';
    };

    btnPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            playSwipeLeftSound(); // Sonido al desplazar hacia la izquierda
            updateCarousel();
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            playSwipeRightSound(); // Sonido al desplazar hacia la derecha
            updateCarousel();
        }
    });

    updateCarousel();

    container.appendChild(btnPrev);
    container.appendChild(btnNext);
    section.appendChild(container);

    return section;
}
/**
 * Átomo: StatCard
 * Tarjeta de métrica individual.
 */
export function StatCard({ label, initialValue = '0', id = '' }) {
    const container = document.createElement('div');
    container.className = 'peg-stat-card';

    const labelEl = document.createElement('span');
    labelEl.className = 'peg-stat-card__label';
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.className = 'peg-stat-card__value';
    if (id) valueEl.id = id;
    valueEl.textContent = initialValue;

    container.append(labelEl, valueEl);

    container.update = (newValue, color = null) => {
        valueEl.textContent = newValue;
        if (color) valueEl.style.color = color;
    };

    return container;
}
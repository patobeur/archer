import { config } from '../config/gameConfig.js';
import { arrows_datas } from '../config/data/arrows_datas.js';

const LandingPage = {
    init: function() {
        this.populateBows();
        this.populateArrows();
    },

    populateBows: function() {
        const bowsGrid = document.getElementById('bows-grid');
        if (!bowsGrid) return;

        for (const bowName in config.bows) {
            const bowData = config.bows[bowName];
            const description = `
                Matériau: ${bowData.materiau}<br>
                Puissance: ${bowData.power}
            `;
            const card = this.createCard(
                bowName.charAt(0).toUpperCase() + bowName.slice(1),
                description,
                bowData.description
            );
            bowsGrid.appendChild(card);
        }
    },

    populateArrows: function() {
        const arrowsGrid = document.getElementById('arrows-grid');
        if (!arrowsGrid) return;

        arrows_datas.forEach(arrowData => {
            const description = `
                Matériau: ${arrowData.materiau}<br>
                Poids: ${arrowData.poids_gr} gr<br>
                Précision: ${arrowData.precision}/10<br>
                Dégâts: ${arrowData.degats}/10
            `;
            const card = this.createCard(arrowData.nom, description);
            arrowsGrid.appendChild(card);
        });
    },

    createCard: function(title, content, footerText = '') {
        const card = document.createElement('div');
        card.className = 'card';

        const titleEl = document.createElement('h3');
        titleEl.textContent = title;
        card.appendChild(titleEl);

        const contentEl = document.createElement('p');
        contentEl.innerHTML = content;
        card.appendChild(contentEl);

        if (footerText) {
            const footerEl = document.createElement('p');
            footerEl.style.marginTop = '10px';
            footerEl.style.fontStyle = 'italic';
            footerEl.textContent = footerText;
            card.appendChild(footerEl);
        }

        return card;
    }
};

export { LandingPage };
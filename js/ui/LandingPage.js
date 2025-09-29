import { config } from '../config/gameConfig.js';
import { arrows_datas } from '../config/data/arrows_datas.js';

const LandingPage = {
    app: null,

    init: function(app) {
        this.app = app;
        this.populateBows();
        this.populateArrows();
        this.initStartButton();

        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.disabled = true;
            startButton.innerHTML = 'Loading...';
        }
    },

    enableStartButton: function() {
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.disabled = false;
            startButton.innerHTML = 'Start Game';
        }
    },

    initStartButton: function() {
        const startButton = document.getElementById('startButton');
        const bowSelectionArea = document.getElementById('bow-selection-area');

        if (!startButton || !bowSelectionArea) return;

        startButton.addEventListener('click', () => {
            startButton.style.display = 'none';
            bowSelectionArea.style.display = 'block';
            this.populateBowSelection();
        });
    },

    populateBowSelection: function() {
        const bowSelectionArea = document.getElementById('bow-selection-area');
        bowSelectionArea.innerHTML = ''; // Clear previous content

        const title = document.createElement('h2');
        title.textContent = 'Choisissez votre Arc';
        title.style.color = 'white';
        bowSelectionArea.appendChild(title);

        const selectionContainer = document.createElement('div');
        selectionContainer.className = 'equipment-grid';

        for (const bowName in config.bows) {
            const bowData = config.bows[bowName];
            const card = this.createBowSelectionCard(bowName, bowData);
            card.addEventListener('click', () => {
                this.app.selectedBow = bowData;
                document.body.classList.remove('landing-page-active');
                this.app.start();
            });
            selectionContainer.appendChild(card);
        }
        bowSelectionArea.appendChild(selectionContainer);

        const backButton = document.createElement('button');
        backButton.textContent = 'Retour';
        backButton.id = 'backButton';
        backButton.addEventListener('click', () => {
            document.getElementById('startButton').style.display = 'block';
            bowSelectionArea.style.display = 'none';
        });
        bowSelectionArea.appendChild(backButton);
    },

    createBowSelectionCard: function(bowName, bowData) {
        const card = document.createElement('div');
        card.className = 'card bow-selection-card';
        card.style.cursor = 'pointer';

        const titleEl = document.createElement('h3');
        titleEl.textContent = bowName.charAt(0).toUpperCase() + bowName.slice(1);
        card.appendChild(titleEl);

        const contentEl = document.createElement('p');
        contentEl.innerHTML = `
            Matériau: ${bowData.materiau}<br>
            Puissance: ${bowData.power}
        `;
        card.appendChild(contentEl);

        const footerEl = document.createElement('p');
        footerEl.style.marginTop = '10px';
        footerEl.textContent = bowData.description;
        card.appendChild(footerEl);

        return card;
    },

    populateBows: function() {
        const bowsGrid = document.getElementById('bows-grid');
        if (!bowsGrid) return;
        bowsGrid.innerHTML = '';
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
        arrowsGrid.innerHTML = '';
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
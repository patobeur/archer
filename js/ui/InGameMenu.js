const InGameMenu = {
    init: function(app) {
        this.app = app;
        this.createMenu();
    },

    createMenu: function() {
        const menuContainer = document.createElement('div');
        menuContainer.id = 'in-game-menu';
        Object.assign(menuContainer.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            padding: '10px 20px',
            backgroundColor: 'rgba(25, 25, 25, 0.5)',
            backdropFilter: 'blur(8px)',
            webkitBackdropFilter: 'blur(8px)',
            zIndex: '1000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxSizing: 'border-box'
        });

        const scoreContainer = document.createElement('div');
        Object.assign(scoreContainer.style, {
            display: 'flex',
            gap: '20px'
        });

        const scoreDisplay = this.createScoreElement('Score: 0', 'score-display');
        const bestScoreDisplay = this.createScoreElement('Top: 0', 'best-score-display');

        scoreContainer.appendChild(scoreDisplay);
        scoreContainer.appendChild(bestScoreDisplay);

        const exitButton = this.createButton('Exit', () => {
            window.location.reload();
        });

        menuContainer.appendChild(scoreContainer);
        menuContainer.appendChild(exitButton);
        document.body.appendChild(menuContainer);
    },

    createButton: function(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        Object.assign(button.style, {
            color: 'white',
            backgroundColor: 'transparent',
            border: '1px solid white',
            padding: '8px 15px',
            cursor: 'pointer',
            borderRadius: '5px',
            fontSize: '14px'
        });
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            onClick();
        });
        return button;
    },

    createScoreElement: function(text, id) {
        const element = document.createElement('div');
        element.id = id;
        element.textContent = text;
        Object.assign(element.style, {
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold'
        });
        return element;
    }
};

export { InGameMenu };
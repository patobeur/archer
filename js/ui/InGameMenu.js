const InGameMenu = {
    init: function(app) {
        this.app = app;
        this.createMenu();
    },

    createMenu: function() {
        const menuContainer = document.createElement('div');
        menuContainer.id = 'in-game-menu';
        Object.assign(menuContainer.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: '1000'
        });

        const exitButton = this.createButton('Exit', () => {
            window.location.reload();
        });

        menuContainer.appendChild(exitButton);
        document.body.appendChild(menuContainer);
    },

    createButton: function(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        Object.assign(button.style, {
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid white',
            padding: '8px 15px',
            cursor: 'pointer',
            borderRadius: '5px',
            fontSize: '14px'
        });
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from triggering game actions like shooting
            onClick();
        });
        return button;
    }
};

export { InGameMenu };
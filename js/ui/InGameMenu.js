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
            padding: '10px',
            backgroundColor: 'rgba(25, 25, 25, 0.5)',
            backdropFilter: 'blur(8px)',
            webkitBackdropFilter: 'blur(8px)',
            zIndex: '1000',
            display: 'flex',
            justifyContent: 'flex-end',
            boxSizing: 'border-box'
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
    }
};

export { InGameMenu };
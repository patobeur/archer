import { _front } from "./DomHelper.js";
import { config } from "../config/gameConfig.js";

const _uiManager = {
	app: null,
	warningMessage: null,

	init: function (app) {
		this.app = app;
	},

	enableStartButton: function () {
		const startButton = document.getElementById("startButton");
		if (startButton) {
			startButton.disabled = false;
			startButton.innerHTML = "Start";
			startButton.addEventListener(
				"click",
				() => {
					this.showBowSelection();
				},
				{ once: true }
			);
		}
	},

	showBowSelection: function () {
		const navbar = document.getElementById("navbar");
		if (navbar) {
			navbar.style.display = "none";
		}

		const bowSelectionContainer = _front.createDiv({
			attributes: { id: "bowSelection" },
			style: {
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				textAlign: "center",
				backgroundColor: "rgba(0,0,0,0.5)",
				padding: "20px",
				borderRadius: "10px",
				zIndex: "20",
			},
		});
		document.body.appendChild(bowSelectionContainer);

		const title = _front.createDiv({
			tag: "h2",
			attributes: { innerHTML: "Choose Your Bow" },
			style: { color: "white" },
		});
		bowSelectionContainer.appendChild(title);

		Object.keys(config.bows).forEach((bowKey) => {
			const bow = config.bows[bowKey];
			const bowButton = _front.createDiv({
				tag: "button",
				attributes: {
					innerHTML: `${
						bowKey.charAt(0).toUpperCase() + bowKey.slice(1)
					} (Power: ${bow.power})`,
				},
				style: {
					margin: "10px",
					padding: "10px 20px",
					fontSize: "16px",
					cursor: "pointer",
				},
			});

			bowButton.addEventListener("click", () => {
				this.app.selectedBow = bow;
				document.body.removeChild(bowSelectionContainer);
				this.app.start(); // Corrected from next2() to start()
			});

			bowSelectionContainer.appendChild(bowButton);
		});
	},

	createCrosshair: function () {
		let mire = _front.createDiv({
			style: {
				backgroundColor: "black",
				position: "absolute",
				top: "calc( 50% - 1px)",
				left: "calc( 50% - 1px)",
				width: "4px",
				height: "4px",
				zIndex: "30",
			},
		});
		document.body.append(mire);
	},

	createWarningMessage: function () {
		this.warningMessage = _front.createDiv({
			attributes: {
				innerHTML: "Vous êtes hors limites ! Vos tirs ne compteront pas.",
			},
			style: {
				position: "absolute",
				bottom: "20px",
				left: "50%",
				transform: "translateX(-50%)",
				backgroundColor: "rgba(255, 0, 0, 0.7)",
				color: "white",
				padding: "10px",
				borderRadius: "5px",
				display: "none",
				zIndex: "30",
			},
		});
		document.body.appendChild(this.warningMessage);
	},
};

export { _uiManager };

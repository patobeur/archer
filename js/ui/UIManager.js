import { _front } from "./DomHelper.js";

const _uiManager = {
	app: null,
	warningMessage: null,

	init: function (app) {
		this.app = app;
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
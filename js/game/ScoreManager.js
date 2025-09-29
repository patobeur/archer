import { _board } from '../ui/ScoreBoard.js';
import { _front } from '../ui/DomHelper.js';

const _score = {
	score: new Number(0),
	bestScore: new Number(0),
    scoreDisplay: null,
    bestScoreDisplay: null,

	addToScore: function (point) {
        this.score += parseInt(point, 10)
        this.updateScoreDisplay();
        this.showPoints(point);
		if(this.score > this.bestScore) {
			this.bestScore = this.score;
			localStorage.setItem(_board.gameName+"BestScore", this.bestScore);
			this.updateBestScoreDisplay();
		}
	},

    showPoints: function(points) {
        const pointsDiv = _front.createDiv({
            tag: 'div',
            attributes: {
                textContent: `+${points}`,
                className: 'points-animation'
            }
        });
        document.body.appendChild(pointsDiv);
        setTimeout(() => {
            pointsDiv.remove();
        }, 2000); // Remove after 2 seconds
    },

    init:function (){
        this.scoreDisplay = document.getElementById('score-display');
        this.bestScoreDisplay = document.getElementById('best-score-display');
		this.bestScore = localStorage.getItem(_board.gameName+"BestScore") ? parseInt(localStorage.getItem(_board.gameName+"BestScore"), 10) : 0  
		this.updateBestScoreDisplay();
		this.score = 0;
        this.updateScoreDisplay();
    },

    updateScoreDisplay: function(){
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = `Score: ${this.score}`;
        }
    },

    updateBestScoreDisplay: function(){
        if (this.bestScoreDisplay) {
            this.bestScoreDisplay.textContent = `Top: ${this.bestScore}`;
        }
    }
}
export { _score }
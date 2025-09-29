import { _board } from '../ui/ScoreBoard.js';
import { _front } from '../ui/DomHelper.js';

const _score = {
	score: new Number(0),
	bestScore: new Number(0),
	addToScore: function (point) {
        this.score += parseInt(point, 10)
        _board.scoreBoard.textContent = `Score: ${this.score}`;
        _score.updateScoreDisplay();
        this.showPoints(point);
		if(this.score > this.bestScore) {
			this.bestScore = this.score;
			localStorage.setItem(_board.gameName+"BestScore", this.bestScore);
			_score.updateBestScoreDisplay();
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
		this.bestScore = localStorage.getItem(_board.gameName+"BestScore") ? parseInt(localStorage.getItem(_board.gameName+"BestScore"), 10) : 0  
		_score.updateBestScoreDisplay();
		this.score = 0  
    },
    updateScoreDisplay: function(){
        _board.scoreBoard.textContent = `${this.score}`;
    },
    updateBestScoreDisplay: function(){
        _board.bestScoreBoard.textContent = `Top: ${this.bestScore}`;
    }
}
export { _score }

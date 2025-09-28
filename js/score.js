import { _board } from './board.js';
const _score = {
	score: new Number(0),
	bestScore: new Number(0),
	addToScore: function (point) {
        this.score += parseInt(point, 10)
        _board.scoreBoard.textContent = `Score: ${this.score}`;
        _score.updateScoreDisplay();
		if(this.score > this.bestScore) {
			this.bestScore = this.score;
			localStorage.setItem(_board.gameName+"BestScore", this.bestScore);
			_score.updateBestScoreDisplay();
		}
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

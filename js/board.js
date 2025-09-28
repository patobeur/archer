
import { _front } from './front.js';
import { _score } from './score.js';
const _board = {
    gameName:undefined,width:undefined,height:undefined,
    board:undefined,scoreBoard:undefined,bestScoreBoard:undefined,
    rules:{board:false,scoreBoard:false,bestScoreBoard:false},
    init: function (gameName,rules,stringcss) {
        this.rules.board=rules.board??false
        this.rules.scoreBoard=rules.scoreBoard??false
        this.rules.bestScoreBoard=rules.bestScoreBoard??false
        this.gameName = gameName ?? 'Aim'
        this.initBodyCss(stringcss)
	},
	createBoard: function () {
        if(this.rules.board) this.board = _front.createDiv({tag:'div',style:{},attributes:{id:'container',className:'container'}})
        if(this.rules.scoreBoard) this.scoreBoard = _front.createDiv({tag:'div',style:{},attributes:{textContent:`${_score.score}`,className:'score'}})
        if(this.rules.bestScoreBoard) this.bestScoreBoard = _front.createDiv({tag:'div',style:{},attributes:{textContent:`Top ${_score.bestScore}`,className:'bestscore'}})
        
	},
    addToDom: function () {
        document.body.prepend(this.scoreBoard,this.bestScoreBoard)
        if(this.rules.board) {
            document.body.prepend(this.board)
            this.updateDimensions();
            window.addEventListener("resize", () => {
                _board.updateDimensions();
            });
        }
	},
    initBodyCss: function (string) {
        _front.addCss(string,this.gameName);
		this.createBoard()
		this.addToDom()
	},
    updateDimensions: function () {
        const rect = this.board.getBoundingClientRect();
        this.width= rect.width
        this.height= rect.height
        return {
            width: rect.width,
            height: rect.height,
        };
	},
}
export { _board }

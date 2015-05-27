
var startGame = function() {
    Game.setBoard(0,new capaClear(0))
    Game.setBoard(1,new TitleScreen("HOW MANY BOTTLES CAN YOU OPEN???", 
                                    "ARE YOU READY??",
                                    playGame));
}


var playGame = function() {
    //Añadidos el reloj y el marcador, si el marcador llega a 0, callback=startGame()
    Game.setGame();   //puntuaciones a 0
    Game.setBoard(4,new Clock());
    Game.setBoard(2,new GamePoints());
    //Game.setBoard(3,new Coundown(endGame));
    
    var board = new GameBoard();
    //board.add(new Juice(401,201));
    
  
    board.add(new Beer(420,400));
    Game.setBoard(1,board);
    if (MusicOn) Sound.playGameSound('music', {loop: true, sound: 1})
    
}
var endGame = function(){
    if (MusicOn) Sound.stopGameSound('music');
    Clock.stop=true;
    //alert('record: '+Game.time/10+' segundos');
    
    Game.setBoard(1,new TitleScreen("GAME OVER!!!!", 
                                    "ARE YOU READY???",
                                    playGame));
}

var gameLoop = function(board){
        var even = _.find(board.objects, function(obj){ return obj.sprite == "bottle"; });
    	if (!even) {
            var nextTrhowNumber = Math.floor((Math.random() * (4-1)) + 1);
            for (i=0; i<nextTrhowNumber; i++) {
                Math.random() < 0.80 ? board.add(new Beer()) : newJuice(board);
            }
        }
        if (Game.time>Game.parcialTime) {
            //console.log(Game.parcialVel)
            Game.parcialTime+=Game.parcialTimeFactor;
            if (Game.parcialVel<Game.maxpacialVel) {
                Game.parcialVel+=0.25;  
            }
        }
}


var newJuice = function(board){
    var type = Math.floor(Math.random() * (3));
    console.log(type)
    board.add(new Juice(type));
}

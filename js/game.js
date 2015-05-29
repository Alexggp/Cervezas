
var readyGame = function() {
    window.location.href ="#ranking";
}


var playGame = function() {
    //Añadidos el reloj y el marcador, si el marcador llega a 0, callback=startGame()
    Game.setBoard(0,new capaClear(0))
    Game.setGame();   //puntuaciones a 0
    Game.setBoard(4,new Clock());
    Game.setBoard(2,new GamePoints());
    //Game.setBoard(3,new Coundown(endGame));
    barrelTime = setBarrelTime();
    
    //board.add(new Juice(401,201));
    
    var board = new GameBoard();
    board.add(new Beer(42,40));
    Game.setBoard(1,board);
    Game.running=true;   //Semaforo del bucle Game.loop
    Game.loop();            // iniciamos el bucle
    if (MusicOn) Sound.playGameSound('music', {loop: true, sound: 1})
}
var endGame = function(){
    if (MusicOn) Sound.stopGameSound('music');
    Game.running=false;     //Detenemos el bucle
    Clock.stop=true;        //Detenemos el reloj
    window.location.href ="#ranking";
    
}

var gameLoop = function(board){
        
        
    
        var even = _.find(board.objects, function(obj){ return obj.sprite == "bottle"; });
    	if (!even) {
            var nextTrhowNumber = Math.floor((Math.random() * (6-1)) + 1);
            for (i=0; i<nextTrhowNumber; i++) {
                Math.random() < 0.80 ? board.add(new Beer()) : newJuice(board);
            }
        }
        if (Game.time>Game.parcialTime) {
            Game.parcialTime+=Game.parcialTimeFactor;
            if (Game.parcialVel<Game.maxpacialVel) {
                Game.parcialVel+=0.25;  
            }
        }
        //if (Game.time>barrelTime) {
        //    board.add(new Barrel());
        //    barrelTime= setBarrelTime();
        //}
}


var newJuice = function(board){
    var type = Math.floor(Math.random() * (3));
    //board.add(new Juice(type));
    board.add(new Beer())
}

var setBarrelTime=function(){
    var interval= Math.floor((Math.random() * (200 -100)) + 100)*Game.canvasMultiplier;
    return Game.time+interval;
}
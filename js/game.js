
var startGame = function() {
    Game.setBoard(0,new capaClear(0))
    Game.setBoard(1,new TitleScreen("HOW MANY BOTTLES CAN YOU OPEN???", 
                                    "PRESS THE SPACE BAR TO PLAY",
                                    playGame));
}


var playGame = function() {
    //Añadidos el reloj y el marcador, si el marcador llega a 0, callback=startGame()
    Game.setGame();   //puntuaciones a 0
    Game.setBoard(4,new Clock());
    Game.setBoard(2,new GamePoints());
    Game.setBoard(3,new Coundown(endGame));
    
    var board = new GameBoard();
    //board.add(new Splash(401,401));
    
  
    board.add(new Beer(420,400));

   
    Game.setBoard(1,board);

    
}
var endGame = function(){
    Clock.stop=true;
    alert('record: '+Game.time/10+' segundos');
    
    Game.setBoard(1,new TitleScreen("GAME OVER!!!!", 
                                    "PRESS TO PLAY AGAIN",
                                    playGame));
}


$(function() {
    Game.initialize("game",sprites,startGame);
});

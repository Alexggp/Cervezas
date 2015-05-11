
sprites = {
    bottle: { sx: 0, sy: 0, w: 57, h: 200, frames: 3 },
    chapa: { sx: 0, sy: 210, w: 40, h: 40, frames: 4 }
};



var startGame = function() {
    Game.setBoard(0,new capaClear(0))
    Game.setBoard(1,new TitleScreen("HOW MANY BOTTLES CAN YOU OPEN???", 
                                    "PRESS THE SPACE BAR TO PLAY",
                                    playGame));
}


var playGame = function() {
    //Añadidos el reloj y el marcador, si el marcador llega a 0, callback=startGame()
    Game.setBoard(3,new Clock(30, endGame));
    Game.setBoard(4,new GamePoints(0));
    
    var board = new GameBoard();
    board.add(new Throw(420,400));
    //board.add(new Chapa(400,400));

    Game.setBoard(1,board);

    
}
var endGame = function(){

    Game.setBoard(1,new TitleScreen("GAME OVER!!!!", 
                                    "PRESS TO PLAY AGAIN",
                                    playGame));
}



// Esta capa se refresca constantemente y hace que se borren las trazas de los objetos al moverse
var capaClear = function() {

    var capa = $('<canvas/>')
	.attr('width', Game.width)
	.attr('height', Game.height)[0];



    var capaCtx = capa.getContext("2d");

	var background = new Image();
    background.src = "images/background.png";
    
    this.draw = function(ctx) {
		ctx.drawImage(background,
			  0, 0,
			  capa.width, capa.height,
			  0, 0,
			  capa.width, capa.height);
    }

    this.step = function(dt) {}
}


// La clase Throw tambien ofrece la interfaz step(), draw() para
// poder ser dibujada desde el bucle principal del juego
var Throw = function(xx,yy) {
    
    this.setup('bottle', {frame:0, reloadTime:0.25});
    this.subFrame = 0;
    this.captured=false;   //indica si hemos pinchado en el objeto
    
    
    // factor de direccion, decide de que lado de la pantalla sale el objeto
    this.d = Math.random() < 0.5 ? -1 : 1;
    if (this.d>0) {
        this.x = -this.w;
    }
    else{
            this.x = Game.width;
    }
    
    // haremos aleatoria la altura, de manera que nunca sobrepase el limite superior
    // y que salgan de la mitad inferior de la pantalla
    this.y = Math.floor((Math.random() * (2*Game.height/3 - Game.height/3)) + (Game.height/3));

    // vy marca el margen de distancia de subida, al que se le suma this.G
    // cuando vy deja de ser negativo, el objeto dejara de subir y caera.
    
    this.vy = - Math.floor((Math.random() * (500-300) ) + 300);
    this.G = Math.floor((Math.random() * (7 -3)) + 3);
    
    
    this.vx = Math.floor((Math.random() * (650-400)) + 400) * this.d;
    
    
    
    this.deleteObject= function(){
        this.board.remove(this);      // lo eliminamos de la lista de objetos del board
    }

 
    this.step = function(dt) {    
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            //this.x =xx;
            //this.y = yy;
            
            this.vy=this.vy+this.G; // cuando vy deja de ser negativo, el objeto dejara de subir y caera.
            
            // Si el objeto sale de la pantalla lo eliminamos de la lista de objetos
            if(this.y > Game.height || this.x< -this.w || this.x > Game.width) {                   
                this.deleteObject();                       
            }
            if(mouse.checkMouse(this)){
                
                this.captured=true;
                Game.points++;
                
            }
            if (this.captured & this.frame<2){ //si capturamos la botella, secuencia de imagenes de descorche
                this.frame = Math.floor(this.subFrame++ /5);
            }

            
            
    }
}


Throw.prototype = new Sprite();

var Chapa = function(ox,oy){
    this.setup('chapa', {frame:2, reloadTime:0.25});
    this.y=oy;
    this.x=ox;
    this.subFrame = 0;
    this.step = function(dt) {
    //this.frame = Math.floor(this.subFrame++ /75);
    //  if(this.subFrame >= 300) {
    //  this.board.remove(this);
    //}

    }
}
Chapa.prototype = new Sprite();
    

$(function() {
    Game.initialize("game",sprites,startGame);
});

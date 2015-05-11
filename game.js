
sprites = {
    bottle: { sx: 0, sy: 0, w: 58, h: 200, frames: 1 },
   
};



var startGame = function() {
    Game.setBoard(0,new capaClear(0))
    Game.setBoard(1,new TitleScreen("Acepta el reto!!!", 
                                    "Si eres el que mas cervezas abre, premio asegurado",
                                    playGame));
}


var playGame = function() {
    var board = new GameBoard();
    board.add(new Throw());
    
    Game.setBoard(1,board);
    
    
}




// Esta capa se refresca constantemente y hace que se borren las trazas de los objetos al moverse
var capaClear = function() {

    var capa = $('<canvas/>')
	.attr('width', Game.width)
	.attr('height', Game.height)[0];



    var capaCtx = capa.getContext("2d");

 
	  //capaCtx.fillStyle = "#101010";
	  //capaCtx.fillRect(0,0,capa.width,capa.height);
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
var Throw = function() { 
    
    
    
    
    this.w =  SpriteSheet.map['bottle'].w;
    this.h =  SpriteSheet.map['bottle'].h;
    
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
                     
        //Si es el ultimo objeto de la lista, al eliminarlo realizamos un nuevo lanzamiento
        //Lanzará entre 1 y 3 objetos. 
        
        if (this.board.objects.length==1) {
                                  
            var nextTrhowNumber = Math.floor((Math.random() * (4-1)) + 1);
            for (i=0; i<nextTrhowNumber; i++) {
                this.board.add(new Throw());
            }
        }
    }

 
    this.step = function(dt) {    
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            //this.x =400;
            //this.y = 400;
            
            this.vy=this.vy+this.G; // cuando vy deja de ser negativo, el objeto dejara de subir y caera.
            
            // Si el objeto sale de la pantalla lo eliminamos de la lista de objetos
            if(this.y > Game.height || this.x< -this.w || this.x > Game.width) {                   
                this.deleteObject();                       
            }
            if(mouse.checkMouse(this)){
                this.deleteObject(); 
            }
    }
	

    this.draw = function(ctx) {
        SpriteSheet.draw(ctx,'bottle',this.x,this.y,0);
    }
}



$(function() {
    Game.initialize("game",sprites,startGame);
});

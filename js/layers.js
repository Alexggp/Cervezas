

//Capa GAMEBOARD en GAME.JS
////////////////////////////////////////////////////////////////////////////////////////////////// CAPA CLEAR
// Esta capa se refresca constantemente y hace que se borren las trazas de los objetos al moverse
var capaClear = function() {





	var background = new Image();
    background.src = "images/background.png";
    
    this.draw = function() {
		Game.ctx.drawImage(background,
			  0, 0,
			  1280, 720,
			  0, 0,
			  Game.width, Game.height);
    }

    this.step = function(dt) {}
}

////////////////////////////////////////////////////////////////////////////////////////////////// Title Screen

// Usa fillText, con el siguiente font enlazado en index.html <link
// href='http://fonts.googleapis.com/css?family=Bangers'
// rel='stylesheet' type='text/css'> Otros fonts:
// http://www.google.com/fonts

var TitleScreen = function TitleScreen(title,subtitle,callback) {
    var up = false;

    // En cada paso, comprobamos si la tecla ha pasado de no pulsada a
    // pulsada. Si comienza el juego con la tecla pulsada, hay que
    // soltarla y
	var capa = $('<canvas/>')
		.attr('width', Game.width)
		.attr('height', Game.height)[0];
	
	var capaCtx = capa.getContext("2d");

 
	capaCtx.fillStyle = "#101010";
	capaCtx.fillRect(0,0,capa.width,capa.height);
	
	
    this.step = function(dt) {
		if(!mouse.down) up = true;
		if(up && mouse.down && callback) callback();
		
		if(!touch.down) up = true;
		if(up && touch.down && callback) callback();
		
    };

    this.draw = function(ctx) {
		
	ctx.drawImage(capa,
			  0, 0,
			  capa.width, capa.height,
			  0, 0,
			  capa.width, capa.height);	
		
		
		
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "center";

	ctx.font = "bold 40px bangers";
	ctx.fillText(title,Game.width/2,Game.height/2);

	ctx.font = "bold 20px bangers";
	ctx.fillText(subtitle,Game.width/2,Game.height/2 + 40);
    };
};

////////////////////////////////////////////////////////////////////////////////// CLOCK
var Clock = function(seg,callback) {  
  
  
  var cuenta= function(){
      seg--;
      if (seg>0) {
		setTimeout(function(){cuenta()},1000)
	  }else{
		callback();
	  }
    }

  cuenta();

  this.draw = function(ctx) {
    var oy= 90;
    if (seg <6 ){
        ctx.font = "bold 100px arial";
        ctx.fillStyle= "red";
        oy= 130;
    }else if (seg<11){  
        ctx.font = "bold 30px arial";
        ctx.fillStyle= "red";
    }else {
        ctx.font = "bold 30px arial";
        ctx.fillStyle= "#FFFFFF";
    }
    

    var txt =  seg + "\'\'" ;

    ctx.fillText(txt,Game.width/2,oy);
    ctx.restore();

  };

  this.step = function(dt) {};
};

//////////////////////////////////////////////////////////////////////////////////// GAME POINTS
var GamePoints = function(x) {
  Game.points  = x;


  this.draw = function(ctx) {
    ctx.font = "bold 30px arial";
    ctx.fillStyle= "#FFFFFF";

    var txt = 'Points: '+Game.points;


    ctx.fillText(txt,Game.width/2,50 - 10);
    ctx.restore();

  };

  this.step = function(dt) { };
};



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
		if(up && mouse.down) { callback()};
		
		if(!touch.down) up = true;
		if(up && touch.down) { callback()};
		
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
var Clock = function() {  
  
  this.stop = false;
    
  
  var cuenta= function(){

      if (!Clock.stop){
		Game.time++;
        setTimeout(function(){cuenta()},100);
      }    
    
  }
  cuenta();
  

  this.draw = function(ctx) {

	ctx.font = "bold 30px arial";
	ctx.fillStyle= "#FFFFFF";
    
	
	var minutes = Math.floor(Game.time / 600);
    var seconds = ((Game.time % 600) / 10).toFixed(0);
	
	var seconds = ("0" + seconds).slice (-2);    //to put leading 0 if seconds < 10
    var txt =minutes+"\'" + seconds + "\'\'" ;
	
    ctx.fillText(txt,60,40);
    ctx.restore();

  };

  this.step = function(dt) {};
};

//////////////////////////////////////////////////////////////////////////////////// GAME POINTS
var GamePoints = function() {

	var chapaPoints= new Image();
	chapaPoints.src = "images/sprites.png";

	this.draw = function(ctx) {
		var ox=150;
		
		ctx.font = "bold 30px arial";
		ctx.fillStyle= "#FFFFFF";	
		var txt = 'x'+Game.points;
		ctx.fillText(txt,ox,40);	


		ctx.drawImage(chapaPoints,
			  0, 212,
			  29 , 29 ,
			  ox+txt.length*10, 15,
			  29, 29);	
	};
	this.step = function(dt) { };
};

var Coundown = function(callback){
	

	
	var countdownImg= new Image();
	countdownImg.src = "images/countdown.png";
	var w=84;
	var h=210;
	var paint=true;
	
	var countdown= function(){
		Game.parcial--;
		console.log('parcial',Game.parcial)
		if (Game.parcial>0){
			setTimeout(function(){countdown()},4000);
		}else{
			paint=false;
			callback();
		}
        
    
	}
	setTimeout(function(){countdown()},3000);
	
	this.step = function(dt) {
		frame=Math.floor(Game.parcial);
		if (frame<1) {
			frame=1;
		}
		if (frame>5) {
			frame=5;
			Game.parcial=Game.maxLiveLvl; //Nivel de vida máxima que pueden tener
		}
	};
	
	this.draw = function(ctx) {
		var ox=150;
		
		ctx.font = "bold 30px arial";
		ctx.fillStyle= "#FFFFFF";	
		var txt = 'x'+Game.points;
		ctx.fillText(txt,ox,40);	
		if (paint) {
			  ctx.drawImage(countdownImg,
			  14+((frame-1) * w), 10,
			  w , h ,
			  Game.width-w/1.5-20, 20,
			  w/1.5, h/1.5);
		}
	
	};
}




//Capa GAMEBOARD en GAME.JS
////////////////////////////////////////////////////////////////////////////////////////////////// CAPA CLEAR
// Esta capa se refresca constantemente y hace que se borren las trazas de los objetos al moverse
var capaClear = function() {


    
    this.draw = function() {
		Game.ctx.drawImage(Game.imgs[3],
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
//
// Deshabilitada, Jose Luis no lo quiere, incomprensible... 
//
//var TitleScreen = function TitleScreen(title,subtitle,callback) {
//
//	var index=5;
//	var capa = $('<canvas/>')
//		.attr('width', Game.width)
//		.attr('height', Game.height)[0];
//	
//	
//	if (Game.points) {
//		title='You got  '+Game.points+'  points!!'
//	}
//	
//	var capaCtx = capa.getContext("2d");
//	var countdown=function(){
//		index--;
//		if (index==0) {
//			setTimeout(function(){callback()},200);
//		}else{
//			setTimeout(function(){countdown()},200);
//		}
//		
//		
//	}
//
//
//	setTimeout(function(){countdown()},200);
//	
//	
// 
// 
//	capaCtx.fillStyle = "#101010";
//	capaCtx.fillRect(0,0,capa.width,capa.height);
//	
//	
//    this.step = function(dt) {};
//
//    this.draw = function(ctx) {
//		
//	ctx.drawImage(capa,
//			  0, 0,
//			  capa.width, capa.height,
//			  0, 0,
//			  capa.width, capa.height);	
//		
//		
//		
//	ctx.fillStyle = "#FFFFFF";
//	ctx.textAlign = "center";
//
//	ctx.font = "40px bangers";
//	ctx.fillText(title,Game.width/2,Game.height/2-100);
//
//	ctx.font = "20px bangers";
//	ctx.fillText(subtitle,Game.width/2,Game.height/2 - 60);
//	
//	ctx.font = "bold 100px bangers";
//	ctx.fillText(index,Game.width/2,Game.height/2 + 100);
//    };
//};

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
	
    ctx.fillText(txt,30,40);
    ctx.restore();

  };

  this.step = function(dt) {};
};

//////////////////////////////////////////////////////////////////////////////////// GAME POINTS
var GamePoints = function() {


	this.draw = function(ctx) {
		var ox=120;
		
		ctx.font = "bold 30px arial";
		ctx.fillStyle= "#FFFFFF";	
		var txt = 'x'+Game.points;
		ctx.fillText(txt,ox,40);	


		ctx.drawImage(Game.imgs[4],
			  0, 212,
			  29 , 29 ,
			  ox+txt.length*20, 15,
			  29, 29);	
	};
	this.step = function(dt) { };
};


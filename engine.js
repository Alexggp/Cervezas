$(document).ready(function() {
		//$('#container').height($(window).height());
		//$('#container').width($(window).width());
		//$('#container').height(600);
		//$('#container').width(900);
		//
		//Game.initialize("game",sprites,startGame);
});




// Objeto singleton Game: se guarda una unica instancia del
// constructor anónimo en el objeto Game
var Game = new function() {                                                                  

    // Inicializa el juego
    this.initialize = function(canvasElementId,sprite_data,callback) {

		
		this.canvas = document.getElementById(canvasElementId);
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		
		
		
		this.width = this.canvas.width;
		this.height= this.canvas.height;
	
		
		
		this.points=0;
		
		
		this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
		if(!this.ctx) { return alert("Please upgrade your browser to play"); }
	
		this.setupMobile();
	
		if(this.mobile) {
	          alert("Desliza el dedo por la parte superior de la pantalla para activar la pantalla completa");
	      }
	
		this.setupInput();
	
		this.loop(); 
	
		//Iniciamos los handlers del mouse
		mouse.init();
		Sound.init();
		SpriteSheet.load (sprite_data,callback);
    };
	
	
	this.setupMobile = function() {
		
            // Comprobar si el browser soporta eventos táctiles
            hasTouch =  !!('ontouchstart' in window),
      // Ancho y alto de la ventana del browser
            w = window.innerWidth, h = window.innerHeight;

	      if(hasTouch) { this.mobile = true; }
	      
    };
	
	
	
	
	

    // Gestión de la entrada (teclas para izda/derecha y disparo)
    var KEY_CODES = { 37:'left', 39:'right', 32 :'fire' };
    this.keys = {};
	this.setupInput = function() {
	$(window).keydown(function(event){
	    if (KEY_CODES[event.which]) {
		Game.keys[KEY_CODES[event.which]] = true;
		return false;
	    }
	});
	
	$(window).keyup(function(event){
	    if (KEY_CODES[event.which]) {
		Game.keys[KEY_CODES[event.which]] = false;
		return false;
	    }
	});
	
    }

	
    // Bucle del juego
    var boards = [];

    this.loop = function() { 
	// segundos transcurridos
	var dt = 10 / 1000;

	// Para cada board, de 0 en adelante, se 
	// llama a su método step() y luego a draw()
	for(var i=0,len = boards.length;i<len;i++) {
	    if(boards[i]) { 
		boards[i].step(dt);
		boards[i].draw(Game.ctx);
	    }
	}

	// Ejecutar dentro de 30 ms
	setTimeout(Game.loop,10);
    };
    
    // Para cambiar el panel activo en el juego.
    // Son capas: se dibujan de menor num a mayor
    // Cada capa tiene que tener en su interfaz step() y draw()
    this.setBoard = function(num,board) { boards[num] = board; };
};



// Objeto singleton SpriteSheet: se guarda una unica instancia del
// constructor anónimo en el objeto SpriteSheet
var SpriteSheet = new function() {

    // Almacena nombre_de_sprite: rectángulo para que sea mas facil
    // gestionar los sprites del fichero images/sprite.png
    this.map = { }; 

    // Para cargar hoja de sprites. 
    //
    // Parámetros: spriteData: parejas con nombre de sprite, rectángulo
    // callback: para llamarla cuando se haya cargado la hoja de
    // sprites
    this.load = function(spriteData,callback) { 
	this.map = spriteData;
	this.image = new Image();
	this.image.onload = callback;
	this.image.src = 'images/beer_bottle.png';
    };

    
    // Para dibujar sprites individuales en el contexto de canvas ctx
    //
    // Parámetros: contexto, string con nombre de sprite para buscar
    //  en this.map, x e y en las que dibujarlo, y opcionalmente,
    //  frame para seleccionar el frame de un sprite que tenga varios
    //  como la explosion
    this.draw = function(ctx,sprite,x,y,frame) {
	var s = this.map[sprite];
	if(!frame) frame = 0;
	ctx.drawImage(this.image,
                      s.sx + frame * s.w, 
                      s.sy, 
                      s.w, s.h, 
                      Math.floor(x), Math.floor(y),
                      s.w, s.h);
    };
}



// La clase TitleScreen ofrece la interfaz step(), draw() para que
// pueda ser mostrada desde el bucle principal del juego

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
	if(!Game.keys['fire']) up = true;
	if(up && Game.keys['fire'] && callback) callback();
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




// GameBoard implementa un tablero de juego que gestiona la
// interacción entre los elementos del juego sobre el que se disponen
// los elementos del juego (fichas, cartas, naves, proyectiles, etc.)

// La clase GameBoard ofrece la interfaz step(), draw() para que sus
// elementos puedan ser mostrados desde el bucle principal del juego.

var GameBoard = function() {
    var board = this;

    // Colección de objetos contenidos por este tablero
    this.objects = [];
	// Colección de splashes contenidos por este tablero
	this.splashes = [];

    // Añade obj a objects
    this.add = function(obj) { 
		obj.board=this;  // Para que obj pueda referenciar el tablero
		if (obj.sprite=='splash') {
			this.splashes.push(obj);    //Si es un splash lo guardamos en la lista de splashes
		}else{
			this.objects.push(obj);
		}
		return obj; 
    };

    // Los siguientes 3 métodos gestionan el borrado.  Cuando un board
    // está siendo recorrido (en step()) podría eliminarse algún
    // objeto, lo que interferiría en el recorrido. Por ello borrar se
    // hace en dos fases: marcado, y una vez terminado el recorrido,
    // se modifica objects.

    // Marcar un objeto para borrar
    this.remove = function(obj) { 
	this.removed.push(obj); 
    };

    // Inicializar la lista de objetos pendientes de ser borrados
    this.resetRemoved = function() { this.removed = []; }

    // Elimina de objects los objetos pendientes de ser borrados
    this.finalizeRemoved = function() {
		for(var i=0, len=this.removed.length; i<len;i++) {
			// Buscamos qué índice tiene en objects[] el objeto i de
			// removed[]
			var idx = this.objects.indexOf(this.removed[i]);
	
			// splice elimina de objects el objeto en la posición idx
			if(idx != -1) this.objects.splice(idx,1); 
		}
    }


	// Iterador que aplica el método funcName a todos los
	// objetos de objects	y splash
  this.iterate = function(funcName) {
    var args = Array.prototype.slice.call(arguments,1);
    _.each(this.objects,function(obj){obj[funcName].apply(obj,args)});
	_.each(this.splashes,function(obj){obj[funcName].apply(obj,args)});
  };

  // Devuelve el primer objeto de objects para el que func es true
  this.detect = function(func) {
    return ( _.find(this.splashes,function(obj){return func.call(obj)}));
  };

    // Cuando Game.loop() llame a step(), hay que llamar al método
    // step() de todos los objetos contenidos en el tablero.  Antes se
    // inicializa la lista de objetos pendientes de borrar, y después
    // se borran los que hayan aparecido en dicha lista
    this.step = function(dt) { 
		this.resetRemoved();
		this.iterate('step',dt);
		this.finalizeRemoved();
		
		if (this.objects.length==0) {
                                  
            var nextTrhowNumber = Math.floor((Math.random() * (4-1)) + 1);
            for (i=0; i<nextTrhowNumber; i++) {
                Math.random() < 0.80 ? this.add(new Beer()) : this.add(new Juice());
				
            }
        }
		
    };

    // Cuando Game.loop() llame a draw(), hay que llamar al método
    // draw() de todos los objetos contenidos en el tablero
    this.draw= function(ctx) {
		this.iterate('draw',ctx);
    };

    // Comprobar si hay intersección entre los rectángulos que
    // circunscriben a los objetos o1 y o2
    this.overlap = function(o2,o1) {
	
	return ((o1.y+o1.h>o2.y+o2.h) && (o1.y<o2.y) &&
		 (o1.x+o1.w>o2.x+o2.w) && (o1.x<o2.x));
	

	
    };

    // Encontrar el primer objeto de tipo type que colisiona con obj
    // Si se llama sin type, en contrar el primer objeto de cualquier
    // tipo que colisiona con obj
    this.collide = function(obj,type) {
		return this.detect(function() {
			if(obj != this) {
			var col = (!type || this.type & type) && board.overlap(obj,this)
			return col ? this : false;
			}
		});
    };
};
var mouse ={
  x:0,
  y:0,
  down:false,
  init:function(){
      $('#game').mousedown(mouse.mousedownhandler);
      $('#game').mouseup(mouse.mouseuphandler);
  },
  mousedownhandler:function(ev){
	
	var offset = $('#game').offset();
    mouse.x= ev.pageX - offset.left;
    mouse.y= ev.pageY - offset.top;
	
    mouse.down = true;
    mouse.downX = mouse.x;
    mouse.downY = mouse.y;
    ev.originalEvent.preventDefault();
  },
  mouseuphandler:function(ev){
    mouse.down = false;
	mouse.current= undefined; 
  },
  checkMouse:function(object){
	    
	  //Si pinchamos dentro del objeto entramos
      if (mouse.down && mouse.x > object.x && mouse.x < object.x+object.w && mouse.y > object.y 
                                      && mouse.y < object.y+object.h && !mouse.current){
		
		mouse.current=true;
        return true;
	  }
        

      
  },
};

// Constructor Sprite 
var Sprite = function() { }

Sprite.prototype.setup = function(sprite,props) {
    this.sprite = sprite;
    this.merge(props);
    this.frame = this.frame || 0;
    this.w =  SpriteSheet.map[sprite].w;
    this.h =  SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function(props) {
    if(props) {
	      for (var prop in props) {
	          this[prop] = props[prop];
	      }
    }
}

Sprite.prototype.draw = function(ctx) {
    SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
}


var Clock = function(seg,callback) {     //si reg = true cuenta regresiva
  
  
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



var Sound= {
        //loaded:true,
        //loadedCount:0, // Assets that have been loaded so far
        //totalCount:0, // Total number of assets that need to be loaded
        mp3Support:false,
        init:function(){
                // check for sound support
                var audio = document.createElement('audio');
                if (audio.canPlayType) {
                         // Currently canPlayType() returns: "", "maybe" or "probably"
                         this.mp3Support = true;
						 console.log("musica")
                } else {
                        //The audio tag is not supported
                        this.mp3Support = false;
						console.log('no hay musica')
                }
                        
        },
        SoundPlay(url){			
            var audio = new Audio();
            audio.src = 'audio/'+url+'.mp3';
            audio.load();
			audio.play();
                        
        }
        
}



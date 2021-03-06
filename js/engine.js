


// Objeto singleton Game: se guarda una unica instancia del
// constructor an�nimo en el objeto Game
var Game = new function() {                                                                  
	
	this.running=false;
    // Inicializa el juego
    this.initialize = function(canvasElementId,sprite_data,callback) {
		this.canvas = document.getElementById(canvasElementId);
		this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
		if(!this.ctx) { return alert("Please upgrade your browser to play"); }
		

		this.setGame();
		//para movil
		this.canvasMultiplier =1;    //constante de proporcionalidad de los objetos y la pantalla
		
		//Comprobamos si la pantalla es tactil, y lanzamos touch o mouse
		this.mobile=false;
		this.setupMobile();
		if (this.mobile){
			touch.init();
		}else{
			mouse.init();
		}
		
		this.setupDimensions();			//Ajusta el juego a la pantalla

	
		
		Sound.init();
		SpriteSheet.load (sprite_data,callback);
		
    };
	
    var boards = [];
	this.boardsReset=function(){boards=[]}
	this.setGame=function(){
		//Contador de puntos y tiempo a cero, parcial es el contador de vida de 0 a 5
		this.points=0;
		this.time=0;
		//this.parcial=5;
		Clock.stop=false;
		this.parcialTimeFactor=300;
		this.parcialTime=this.parcialTimeFactor;
		this.parcialVel=1;
		this.maxpacialVel=2;
		this.maxLiveLvl=6;
		
	}
	



    this.loop = function() {

		// segundos transcurridos
		var dt = 10 / 1000;
	

	
		// Para cada board, de 0 en adelante, se 
		// llama a su m�todo step() y luego a draw()
		if(Game.running==true){
			for(var i=0,len = boards.length;i<len;i++) {
				if(boards[i]) { 
				boards[i].step(dt);
				boards[i].draw(Game.ctx);
				}
			}
		
			// Ejecutar dentro de 10 ms
			setTimeout(Game.loop,10)
		}else{
			Game.boardsReset();
		}
    };
    
    // Para cambiar el panel activo en el juego.
    // Son capas: se dibujan de menor num a mayor
    // Cada capa tiene que tener en su interfaz step() y draw()
    this.setBoard = function(num,board) { boards[num] = board; };

	
	
	this.setupMobile = function() {

 	      var container = document.getElementById("container");
            // Comprobar si el browser soporta eventos t�ctiles
            hasTouch =  !!('ontouchstart' in window);
			// Ancho y alto de la ventana del browser

	      if(hasTouch) { this.mobile = true;}

	      // Salir si la pantalla es mayor que cierto tama�o m�ximo o si no
	      // tiene soporte para eventos t�ctiles
	      if(screen.width >= 1280 || !hasTouch) { this.mobile=false; }
	}
	this.setupDimensions= function(){
	
		var w = window.innerWidth;
		var h = window.innerHeight;
	    
		this.canvas.style.position='absolute';
        this.canvas.style.left="0px";
        this.canvas.style.top="0px";
	
		this.canvas.width=w;
		this.canvas.height=h;
		this.width=this.canvas.width;
        this.height=this.canvas.height;
		
		this.canvasMultiplier=this.canvas.width/1280;
		
		$('#game').height(h);
		$('#game').width(w);
    };
	

	
};




/////////////////////////////////////////////////////////////////////////////// GAMEBOARD
// GameBoard implementa un tablero de juego que gestiona la
// interacci�n entre los elementos del juego sobre el que se disponen
// los elementos del juego (fichas, cartas, naves, proyectiles, etc.)

// La clase GameBoard ofrece la interfaz step(), draw() para que sus
// elementos puedan ser mostrados desde el bucle principal del juego.

var GameBoard = function() {
    var board = this;

    // Colecci�n de objetos contenidos por este tablero
    this.objects = [];
	// Colecci�n de splashes contenidos por este tablero
	this.splashes = [];

    // A�ade obj a objects
    this.add = function(obj) { 
		obj.board=this;  // Para que obj pueda referenciar el tablero
		if (obj.sprite=='splash') {
			this.splashes.push(obj);    //Si es un splash lo guardamos en la lista de splashes
		}else{
			this.objects.push(obj);
		}
		return obj; 
    };

    // Los siguientes 3 m�todos gestionan el borrado.  Cuando un board
    // est� siendo recorrido (en step()) podr�a eliminarse alg�n
    // objeto, lo que interferir�a en el recorrido. Por ello borrar se
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
			// Buscamos qu� �ndice tiene en objects[] el objeto i de
			// removed[]
			var idx = this.objects.indexOf(this.removed[i]);
	
			// splice elimina de objects el objeto en la posici�n idx
			if(idx != -1) this.objects.splice(idx,1); 
		}
    }


	// Iterador que aplica el m�todo funcName a todos los
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

    // Cuando Game.loop() llame a step(), hay que llamar al m�todo
    // step() de todos los objetos contenidos en el tablero.  Antes se
    // inicializa la lista de objetos pendientes de borrar, y despu�s
    // se borran los que hayan aparecido en dicha lista
    this.step = function(dt) {

			this.resetRemoved();
			this.iterate('step',dt);
			this.finalizeRemoved();
			
			gameLoop(this);
		
    };

    // Cuando Game.loop() llame a draw(), hay que llamar al m�todo
    // draw() de todos los objetos contenidos en el tablero
    this.draw= function(ctx) {
		this.iterate('draw',ctx);
    };

    // Comprobar si hay intersecci�n entre los rect�ngulos que
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


///////////////////////////////////////////////////////////////////////////////////// SpriteSheet

// Objeto singleton SpriteSheet: se guarda una unica instancia del
// constructor an�nimo en el objeto SpriteSheet
var SpriteSheet = new function() {

    // Almacena nombre_de_sprite: rect�ngulo para que sea mas facil
    // gestionar los sprites del fichero images/sprite.png
    this.map = { }; 

    // Para cargar hoja de sprites. 
    //
    // Par�metros: spriteData: parejas con nombre de sprite, rect�ngulo
    // callback: para llamarla cuando se haya cargado la hoja de
    // sprites
    this.load = function(spriteData,callback) {
	this.map = spriteData;


	function createImages(srcs, fn) {
		var imgs = [], img;
		var remaining = srcs.length;
		for (var i = 0; i < srcs.length; i++) {
			img = new Image();
			imgs.push(img);
			img.onload = function() {
				--remaining;
				if (remaining == 0) {
					callback();
				}
			};
			img.src = srcs[i];
		}
		return(imgs);
	 }
		 
		Game.imgs = createImages(['images/splash_green.png', 'images/splash_orange.png', 'images/splash_red.png',"images/background.png","images/sprites.png"]);
			
	this.image=Game.imgs[4];
	
	
	
	
	
    };

    
    // Para dibujar sprites individuales en el contexto de canvas ctx
    //
    // Par�metros: contexto, string con nombre de sprite para buscar
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
                      s.w*Game.canvasMultiplier, s.h*Game.canvasMultiplier);
    };
}


///////////////////////////////////////////////////////////////////////////// Constructor Sprite

// pinta los objetos en el tablero con los sprites correspondientes
var Sprite = function() { }

Sprite.prototype.setup = function(sprite,props) {
    this.sprite = sprite;
    this.merge(props);
    this.frame = this.frame || 0;
    this.w =  SpriteSheet.map[sprite].w*Game.canvasMultiplier;
    this.h =  SpriteSheet.map[sprite].h*Game.canvasMultiplier;
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


///////////////////////////////////////////////////////////////////////////////// EVENTOS DE MOUSE
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

///////////////////////////////////////////////////////////////////////////// EVENTOS DE TOUCH
var touch ={
  x:0,
  y:0,
  down:false,
  init:function(){
	  Game.canvas.addEventListener('touchstart',function(ev){
		var offset = $('#game').offset();
		touch.x= ev.changedTouches[0].pageX ;//- offset.left;
		touch.y= ev.changedTouches[0].pageY ;//- offset.top;	
		touch.down = true;
		touch.downX = mouse.x;
		touch.downY = mouse.y;
		
	   },true);
	  Game.canvas.addEventListener('touchend',function(ev){
		touch.down = false;
     	touch.current= undefined; 
	  },false);	
  },

  checkTouch:function(object){
	    
	  //Si pinchamos dentro del objeto entramos
      if (touch.down && touch.x > object.x && touch.x < object.x+object.w && touch.y > object.y 
                                      && touch.y < object.y+object.h && !touch.current){
		
		touch.current=true;
        return true;
	  }
        
	
      
  },
};

///////////////////////////////////////////////////////////////////////////////////// Listener para cambios en la pantalla

//Listener para detectar cuando cambiamos la orientacion de la pantalla
    var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

    window.addEventListener(orientationEvent, function() {
        Game.setupDimensions();
    }, false);



////////////////////////////////////////////////////////////////////////////////////// SOUND
// Audio con la API para que suene tambien en el movil
var Sound = new function(){
	this.init=function(){
		if (typeof AudioContext !== 'undefined') {
		  Game.audio_ctx = new AudioContext();
		}
		   
		function loadMusic(url, cb) {
		  var req = new XMLHttpRequest();
		  req.open('GET', url, true);
		  // XHR2
		  req.responseType = 'arraybuffer';
		 
		  req.onload = function() {
			Game.audio_ctx.decodeAudioData(req.response, cb);
		  };		 
		  req.send();
		}
		
		Game.audio = {};
		Game.audio_src = {};
		
		var audio={
			beer_open:"audio/beer_open.mp3",
			splash:"audio/splash.mp3",
			music:"audio/music.mp3"
		}
		
		var loadAudioData = function(name, url) {
 
			// Async
			loadMusic(url, function(buffer) {
			  Game.audio[name] = buffer;
			});
	   
		};
	   
		for (var name in audio) {
		  var url = audio[name];
		  loadAudioData(name, url);
		}
	}
	
	this.playSound=function(buffer, name, opt) {
		opt = opt || {};
	   
		var src = Game.audio_ctx.createBufferSource();
		src.buffer = buffer;
	   
		gain_node = Game.audio_ctx.createGain();
		src.connect(gain_node);
		 
		gain_node.connect(Game.audio_ctx.destination);
	   
		if (typeof opt.sound !== 'undefined')
		  gain_node.gain.value = opt.sound;
		else
		  gain_node.gain.value = 1;
	   
		// Options
		if (opt.loop)
		  src.loop = true;
		src.start();
		Game.audio_src[name] = src;
	}
	   
	this.stopSound =function(src) {
		src.stop();
	}
	
	this.playGameSound=function(name, opt) {
		opt = opt || {};
		if (Game.audio[name]) {
			Sound.playSound(Game.audio[name], name, opt);
		}
		
		
		
	}
	this.stopGameSound=function(name){
		if (Game.audio_src[name]) {
			Sound.stopSound(Game.audio_src[name]);
		}
	}
	
}







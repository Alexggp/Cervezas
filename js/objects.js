
sprites = {
    bottle: { sx: 0, sy: 0, w: 57, h: 200, frames: 3 },
    chapa: { sx: 0, sy: 212, w: 29 , h: 29, frames: 4 },
    juice: { sx: 0, sy: 250, w: 78 , h: 200, frames: 1 }
};


var SPLASH_OBJECT       =   1,
    JUICE_OBJECT        =   2;



///////////////////////////////////////////////////////////////////////////////////////////////// BEER
// La clase Beer tambien ofrece la interfaz step(), draw() para
// poder ser dibujada desde el bucle principal del juego
var Beer = function(xx,yy) {
    
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
    
 
    this.step = function(dt) {    
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            //this.x =xx;
            //this.y = yy;
            
            this.vy=this.vy+this.G; // cuando vy deja de ser negativo, el objeto dejara de subir y caera.
            
            // Si el objeto sale de la pantalla lo eliminamos de la lista de objetos
            if(this.y > Game.height || this.x< -this.w || this.x > Game.width) {                   
                this.board.remove(this);      // lo eliminamos de la lista de objetos del board                  
            }
            
            var underSplash= this.board.collide(this,SPLASH_OBJECT);
            
            if(mouse.checkMouse(this) && !this.captured && !underSplash){
                
                this.captured=true;
                Game.points++;
                if(Sound.extension) Sound.SoundPlay("beer_open");
                this.board.add(new Chapa(this.x,this.y,this.vx));

                
                
            }
            if(touch.checkTouch(this) && !this.captured && !underSplash){
                
                this.captured=true;
                Game.points++;
                if(Sound.extension) Sound.SoundPlay("beer_open");
                this.board.add(new Chapa(this.x,this.y,this.vx));

                
                
            }
            if (this.captured && this.frame<2){ //si capturamos la botella, secuencia de imagenes de descorche
                this.frame = Math.floor(this.subFrame++ /5);
            }

            
            
    }
}
Beer.prototype = new Sprite();

////////////////////////////////////////////////////////////////////////////////////////////////////CHAPA
var Chapa = function(ox,oy,vx){
    this.setup('chapa', {frame:0, reloadTime:0.25});
    this.y=oy;
    this.x=ox;
    
    this.vx= vx + (-vx*0.25);
    
    this.vy=-400;
    this.subFrame = 0;
    this.step = function(dt) {
        
        this.y += this.vy * dt;
        this.vy+=15;
        this.x += this.vx * dt;
    
        
        this.frame = Math.floor(this.subFrame++ /6);
          if(this.frame>3) {
           this.frame=0;
           this.subFrame = 0;
        }
        
        
        if(this.y > Game.height || this.x< -this.w || this.x > Game.width) {                   
                this.board.remove(this);                       
            }

    }
}
Chapa.prototype = new Sprite();


///////////////////////////////////////////////////////////////////////////////////////////////// JUICE
var Juice = function(xx,yy) {
    
    this.setup('juice', {frame:0, reloadTime:0.25});
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
    
 
    this.step = function(dt) {    
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            //this.x =xx;
            //this.y = yy;
            //
            this.vy=this.vy+this.G; // cuando vy deja de ser negativo, el objeto dejara de subir y caera.
            
            // Si el objeto sale de la pantalla lo eliminamos de la lista de objetos
            if(this.y > Game.height || this.x< -this.w || this.x > Game.width) {                   
                this.board.remove(this);      // lo eliminamos de la lista de objetos del board                  
            }


            var underSplash= this.board.collide(this,SPLASH_OBJECT);
            //console.log(underSplash);
            if(mouse.checkMouse(this) && !this.captured && !underSplash){   
                this.captured=true;
                this.board.remove(this);
                if(Sound.extension) {Sound.SoundPlay("splash")} else {console.log('ajsa')};
                this.board.add(new Splash(this.x,this.y));
            }
            if(touch.checkTouch(this) && !this.captured && !underSplash){   
                this.captured=true;
                this.board.remove(this);
                if(Sound.extension) {Sound.SoundPlay("splash")} else {console.log('ajsa')};
                this.board.add(new Splash(this.x,this.y));
            }
            
    }
}
Juice.prototype = new Sprite();
Juice.prototype.type = JUICE_OBJECT;


//////////////////////////////////////////////////////////////////////////////////////////////// SPLASH
//Splash es la mancha verde que sale cuando capturamos un brick de zumo
var Splash = function(ox,oy) {

    this.sprite="splash";
    (ox-200)
    this.x=ox-200;
    this.y=oy-150;
    this.w=500;
    this.h=500;




    

	var background = new Image();
    background.src = "images/splash.png";
    
    this.draw = function(ctx) {
		ctx.drawImage(background,
			  0, 0,
			  640, 528,
			  this.x, this.y,
			  this.w, this.h);
    }

    this.step = function(dt) {}
}
Splash.prototype.type = SPLASH_OBJECT;



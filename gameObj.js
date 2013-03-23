/*------------------- 
a player entity
-------------------------------- */
var PlayerEntity = me.ObjectEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
    init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
 
    // set the walking & jumping speed
    this.setVelocity(3, 3);
    this.setFriction(0.1,0.1);

    this.angle=0;

    // add a basic gun
    this.weapon = new GunEntity(this, { image: 'basic_gun', spritewidth: 16 });
    me.game.add(this.weapon, this.z);
    me.game.sort();
 

    // adjust the bounding box
    this.updateColRect(8, 48, 8, 48);
 
    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
},
 
   /* -----
update the player pos
------ */
update: function() {
 /*
    if (me.input.isKeyPressed('left')) {
        this.doWalk(true);
    } else if (me.input.isKeyPressed('right')) {
        this.doWalk(false);
    } else {
        this.vel.x = 0;
    }
    if (me.input.isKeyPressed('jump')) {
    if (this.doJump()) {
        me.audio.play("jump");
    }
*/
  
	// up left
	if (me.input.isKeyPressed('left') && me.input.isKeyPressed('up'))
	{
	    this.vel.x -= this.accel.x * me.timer.tick;
        this.vel.y -= this.accel.y * me.timer.tick;
        this.angle = Number.prototype.degToRad (225);
	}

    // down left
    if (me.input.isKeyPressed('left') && me.input.isKeyPressed('down'))
    {
        this.vel.x -= this.accel.x * me.timer.tick;
        this.vel.y += this.accel.y * me.timer.tick;
        this.angle = Number.prototype.degToRad (135);
    }

    // left only
    if (me.input.isKeyPressed('left') && !me.input.isKeyPressed('down') && !me.input.isKeyPressed('up'))
    {
        this.vel.x -= this.accel.x * me.timer.tick;
        this.angle = Number.prototype.degToRad (180);
    }

    // up right
    if (me.input.isKeyPressed('right') && me.input.isKeyPressed('up'))
    {
        this.vel.x += this.accel.x * me.timer.tick;
        this.vel.y -= this.accel.y * me.timer.tick;
        this.angle = Number.prototype.degToRad (315);
    }

    // down right
    if (me.input.isKeyPressed('right') && me.input.isKeyPressed('down'))
    {
        this.vel.x += this.accel.x * me.timer.tick;
        this.vel.y += this.accel.y * me.timer.tick;
        this.angle = Number.prototype.degToRad (45);
    }

    // right only
    if (me.input.isKeyPressed('right') && !me.input.isKeyPressed('down') && !me.input.isKeyPressed('up'))
    {
        this.vel.x += this.accel.x * me.timer.tick;
        this.angle = Number.prototype.degToRad (0);
    }

    // up only
    if (me.input.isKeyPressed('up') && !me.input.isKeyPressed('left') && !me.input.isKeyPressed('right'))
    {
        this.vel.y -= this.accel.y * me.timer.tick;
        this.angle = Number.prototype.degToRad (270);
    }

    // down only
    if (me.input.isKeyPressed('down') && !me.input.isKeyPressed('left') && !me.input.isKeyPressed('right'))
    {
        this.vel.y += this.accel.y * me.timer.tick;
        this.angle = Number.prototype.degToRad (90);
    }


	/*else if (me.input.isKeyPressed('right'))
	{
	    this.vel.x += this.accel.x * me.timer.tick;
        this.angle = Number.prototype.degToRad (0);
	}
	if (me.input.isKeyPressed('up'))
	{
	    this.vel.y -= this.accel.y * me.timer.tick;
        this.angle = Number.prototype.degToRad (270);
	}
	else if (me.input.isKeyPressed('down'))
	{
	    this.vel.y += this.accel.y * me.timer.tick;
        this.angle = Number.prototype.degToRad (90);
	}*/
	// update player position
	var res = this.updateMovement();

	// check for collision result with the environment
	if (res.x != 0)
	{
	  // x axis
	  if (res.x<0)
	     console.log("x axis : left side !");
	  else
	     console.log("x axis : right side !");
	}
	else if(res.y != 0)
	{
	   // y axis
	   if (res.y<0)
	      console.log("y axis : top side !");
	   else
	      console.log("y axis : bottom side !");

		  // display the tile type
	   console.log(res.yprop.type)
	}

	/*
	// check player status after collision check
	var updated = (this.vel.x!=0 || this.vel.y!=0);


 
	    // check & update player movement
	    this.updateMovement();
	 
	    // check for collision
	    var res = me.game.collide(this);
 
	 
	if (res) {
	    if (res.obj.type == me.game.ENEMY_OBJECT) {
		if ((res.y > 0) && ! this.jumping) {
		    // bounce
		    me.audio.play("stomp");
		    this.forceJump();
		} else {
		    // let's flicker in case we touched an enemy
		    this.flicker(45);
		}
	    }
	}

	*/ 
    // update animation if necessary
    if (this.vel.x!=0 || this.vel.y!=0) {
        // update object animation
        this.parent(this);
        return true;
    }
    return false;
 
}
 
});

/*
 * Weapons
 */

var GunEntity = me.ObjectEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
init: function(mainPlayer, settings) {
    // call the constructor
    this.parent(0, 0, settings);
 
    // save a reference to mainPlayer
    this.mainPlayer = mainPlayer;
    
    this.bulletVelocity = 6;

    this.reloading = false;

    this.reloadTime = 30;
    this.reloadCounter=0;

    this.gunOffset = {x:this.mainPlayer.width/2,y:-7};

    // adjust the bounding box
    this.updateColRect(1, 12, 1, 12);
  
},
 
   /* -----
update the player pos
------ */
update: function() {

    // update gun relative to mainPlayer
    this.angle = this.mainPlayer.angle;
    this.pos.x = this.mainPlayer.pos.x + 20;
    this.pos.y = this.mainPlayer.pos.y + 26;
 
    if(me.input.isKeyPressed('fire')) {
        if(!this.reloading) {
         this.fireGun();
        }
    }

    if(this.reloading) {
        this.reloadCounter++;
        if(this.reloadCounter >= this.reloadTime) {
            // loaded
            console.log("reload complete");
            this.reloadCounter=0;
            this.reloading=false;
        }
    }

},

fireGun: function() {

    // fire a bullet
    console.log("fire!");

    this.reloading=true;
    
    // add a bullet
    // bullet velocity based on angle of player
    var xVel = this.bulletVelocity * Math.cos(this.mainPlayer.angle);
    var yVel = this.bulletVelocity * Math.sin(this.mainPlayer.angle);

    var cosA = Math.cos(this.mainPlayer.angle);
    var sinA = Math.sin(this.mainPlayer.angle);
    // calc start position of bullet based on angle of player
    
    // rotate location of bullet around plane   
    var bx = (this.gunOffset.x * cosA) - (this.gunOffset.y * sinA);
    var by = (this.gunOffset.x * sinA) + (this.gunOffset.y * cosA);

    // add position of player
    bx = bx + this.mainPlayer.pos.x + this.mainPlayer.width/2;
    by = by + this.mainPlayer.pos.y + this.mainPlayer.height/2;
    var shot = new BulletEntity(bx, by, 
        { image: 'bullet', spritewidth: 13 });
    shot.angle = 0;//this.mainPlayer.angle;

    shot.setVelocity(xVel, yVel);

    shot.setMaxVelocity(Math.abs(xVel), Math.abs(yVel));

    me.game.add(shot, this.mainPlayer.z);
    me.game.sort();


},
draw: function(context, x, y) {
        this.z=-1;
        context.drawImage(this.image, this.pos.x, this.pos.y);
    }

 
});



/*------------------- 
a bullet entity
-------------------------------- */
var BulletEntity = me.ObjectEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
 
    // set bullet speed
    //this.setVelocity(3, 0);
    this.setFriction(0,0);

    //this.angle=0;
 
    // adjust the bounding box
    this.updateColRect(1, 12, 1, 12);
  
},
 
   /* -----
update the bullet pos
------ */
update: function() {

    this.vel.y += this.accel.y * me.timer.tick;
    this.vel.x += this.accel.x * me.timer.tick;
        
    
    // update position
    var res = this.updateMovement();
    
        
    // check for collision result with the environment
    if (res.x != 0)
    {
      // x axis
      if (res.x<0)
         console.log("x axis : left side !");
      else
         console.log("x axis : right side !");

      me.game.remove(this);
    }
    else if(res.y != 0)
    {
       // y axis
       if (res.y<0)
          console.log("y axis : top side !");
       else
          console.log("y axis : bottom side !");

       me.game.remove(this);

    }

   

    // update animation if necessary
    if (this.vel.x!=0 || this.vel.y!=0) {
        // update objet animation
        this.parent(this);
        return true;
    }
    return false;
 
},
 
});


/*-------------- 
a score HUD Item
--------------------- */
 
var ScoreObject = me.HUD_Item.extend({
    init: function(x, y) {
        // call the parent constructor
        this.parent(x, y);
        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);
    },
 
    /* -----
 
    draw our score
 
    ------ */
    draw: function(context, x, y) {
        this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
    }
 
});

/*----------------------
 
    A title screen
 
  ----------------------*/
 
var TitleScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);
 
        // title screen image
        this.title = null;
 
        this.font = null;
        this.scrollerfont = null;
        this.scrollertween = null;
 
        this.scroller = "UTRILLIUM ...  YET ANOTHER SHOOT-EM-UP GAME. CODED BY TELECODA USING MELON.JS           (C) 2013              ";
        this.scrollerpos = 600;
    },
 
    // reset function
    onResetEvent: function() {
        if (this.title == null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("title_screen");
            // font to display the menu items
            this.font = new me.BitmapFont("32x32_font", 32);
            this.font.set("left");
 
            // set the scroller
            this.scrollerfont = new me.BitmapFont("32x32_font", 32);
            this.scrollerfont.set("left");
 
        }
 
        // reset to default value
        this.scrollerpos = 640;
 
        // a tween to animate the arrow
        this.scrollertween = new me.Tween(this).to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();
 
        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
 
        // play something
        me.audio.play("cling");
 
    },
 
    // some callback for the tween objects
    scrollover: function() {
        // reset to default value
        this.scrollerpos = 640;
        this.scrollertween.to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();
    },
 
    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },
 
    // draw function
    draw: function(context) {
        context.drawImage(this.title, 0, 0);
 
        this.font.draw(context, "PRESS ENTER TO PLAY", 20, 240);
        this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 440);
    },
 
    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
 
        //just in case
        this.scrollertween.stop();
    }
 
});

// game resources

//game resources
var g_resources = [{
    name: "level01_level_tiles",
    type: "image",
    src: "data/level01_tileset/level01_level_tiles.png"
}, {
    name: "level01",
    type: "tmx",
    src: "data/level01.tmx"
},
{
    name: "plane",
    type: "image",
    src: "data/sprite/plane.png"
},
{
    name: "bullet",
    type: "image",
    src: "data/sprite/bullet01.png"
},
{
    name: "basic_gun",
    type: "image",
    src: "data/sprite/basic_gun.png"
},
// title screen
{
    name: "title_screen",
    type: "image",
    src: "data/GUI/title_screen.png"
},
// game font
{
    name: "32x32_font",
    type: "image",
    src: "data/sprite/32x32_font.png"
},
// audio resources
{
    name: "cling",
    type: "audio",
    src: "data/audio/",
    channel: 2
}];

var jsApp = {
    /* ---
 
     Initialize the jsApp
 
     --- */
    onload: function() {
 
        // init the video
        if (!me.video.init('jsapp', 640, 480, false, 1.0)) {
            alert("Sorry but your browser does not support html 5 canvas.");
            return;
        }
 
        // initialize the "audio"
        me.audio.init("mp3,ogg");

	    me.sys.gravity=0;
 
        // set all resources to be loaded
        me.loader.onload = this.loaded.bind(this);
 
        // set all resources to be loaded
        me.loader.preload(g_resources);
 
        // load everything & display a loading screen
        me.state.change(me.state.LOADING);
    },
 
    /* ---
 
     callback when everything is loaded
 
     --- */
    loaded: function() {
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.MENU, new TitleScreen());
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());
 	    // add our player entity in the entity pool
   	    me.entityPool.add("mainPlayer", PlayerEntity);
             
       	// enable the keyboard
       	me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.A,  "left");
       	me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.W, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
       	me.input.bindKey(me.input.KEY.S, "down");
        me.input.bindKey(me.input.KEY.SPACE,  "fire");
    

        // display the menu title
        me.state.change(me.state.MENU);
    }
 
};
// jsApp
/* the in game stuff*/
/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend({
 
    onResetEvent: function() {
        // stuff to reset on state change
        // load a level
        me.levelDirector.loadLevel("level01");
    },
 
    /* ---
 
    action to perform when game is finished (state change)
 
    --- */
    onDestroyEvent: function() {
}
 
});
 
//bootstrap :)
window.onReady(function() {
    jsApp.onload();
});

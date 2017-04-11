var $ = require('jquery');
var Hammer = require('hammerjs');
$.fn.hammer = Plugin;
$.fn.hammer.Constructor = Myhammer;
$.fn.hammer.noConflict=function(){
    $.fn.hammer=old;
    return this;
}
var old= $.fn.hammer;
    

function Plugin(opt,params){
    return this.each(function(){
        var $this=$(this);
        //if($this.is("canvas")){
        var data = $this.data("tom.hammer");
        var opts = $.extend({},Myhammer.DEFAULTS,$this.data(),typeof opt=="object" &&opt)
        if(!data) $this.data("tom.hammer",(data=new Myhammer(this,opts)))
        //2016-01-08 update fix opts to opt
        if(typeof opt=="string") data[opt](params)
        /*  }else{
         console.log("need a  canvas element")
         }*/
    })
}
Myhammer.DEFAULTS={
    transform_always_block: true,
    transform_min_scale: 1,
    drag_block_horizontal: true,
    drag_block_vertical: true,
    drag_min_distance: 0,
    gestureCb:function(){
        console.log('手势回调')
    }
}

function Myhammer(canvas,opts){
    //console.log(opts.gestureCb.toString())
    this.rotation=0;
    var posX=0, posY=0,
        lastPosX=0, lastPosY=0,
        bufferX=0, bufferY=0,
        scale=1, last_scale=1 , last_rotation, dragReady= 0,self=this;
        $.extend(opts,{domEvents: true})
    var mc = new Hammer(canvas, opts);
    var hammertime = mc;
    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
    mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
    mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);
    hammertime.on('panstart panmove panend rotatemove', function(ev) {
        if(!self.isStop){
            manageMultitouch(ev);
        }
    });
    function manageMultitouch(ev){
        console.log(ev.type)
        switch(ev.type) {
            case 'panstart':
                last_scale = scale;
                last_rotation = self.rotation;
                break;
            case 'panmove':
                posX = ev.deltaX + lastPosX;
                posY = ev.deltaY + lastPosY;
                opts.gestureCb.call(self,{x:posX,y:posY,scale:last_scale,rotate:last_rotation})
                break;
            case 'rotatemove':
                self.rotation = last_rotation + ev.rotation;
                // self.rotation = last_rotation ;
                scale = Math.max(0, Math.min(last_scale * ev.scale, 10));
                opts.gestureCb.call(self,{x:lastPosX,y:lastPosY,scale:scale,rotate:self.rotation})
                break;
            case 'panend':
                lastPosX = posX;
                lastPosY = posY;
                break;
        }
    }
    this.reset=function(){
        console.log("in")
        posX=0;posY=0;
        lastPosX=0;lastPosY=0;
        bufferX=0; bufferY=0;
        scale=1; last_scale=1 ;this.rotation= 0;last_rotation=0;
    }
}
Myhammer.prototype.stop=function(){
    this.isStop=true;
}
Myhammer.prototype.start=function(){
    this.isStop=false;
}
Myhammer.prototype.setRotate=function(rotation){
    this.rotation=rotation;
}

export default Myhammer
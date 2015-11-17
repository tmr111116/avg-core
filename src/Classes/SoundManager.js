var Howler = require('../Library/howler.js/howler');
var Err = require('./ErrorHandler');

/*By default, audio on iOS is locked until a sound is played within a user interaction, 
* and then it plays normally the rest of the page session (Apple documentation). 
* The default behavior of howler.js is to attempt to silently unlock audio playback by 
* playing an empty buffer on the first touchend event. 
* This behavior can be disabled by calling:
*/
Howler.iOSAutoEnable = false;

class SoundManager {
    constructor(args) {
        // code
    }

    // query
    static file(channel,file){
        if(!SoundManager.cache[channel])
            SoundManager.cache[channel] = {};
        SoundManager.cache[channel].file = file;
        return this;
    }
    static autoPlay(channel,bool){
        if(!SoundManager.cache[channel])
            SoundManager.cache[channel] = {};
        SoundManager.cache[channel].autoplay = bool;
        SoundManager.cache[channel].m_status = bool;
        return this;
    }
    static buffer(channel,bool){
        if(!SoundManager.cache[channel])
            SoundManager.cache[channel] = {};
        SoundManager.cache[channel].buffer = bool;
        return this;
    }
    static loop(channel,bool){
        if(!SoundManager.cache[channel])
            SoundManager.cache[channel] = {};
        SoundManager.cache[channel].loop = bool;
        return this;
    }
    static volume(channel,value){
        if(!SoundManager.cache[channel])
            SoundManager.cache[channel] = {};
        SoundManager.cache[channel].volume = value;
        return this;
    }
    static onEnd(channel,cb){
        if(!SoundManager.cache[channel])
            SoundManager.cache[channel] = {};
        SoundManager.cache[channel].onEnd = cb;
        return this;
    }
    static onPlay(channel,cb){
        if(!SoundManager.cache[channel])
            SoundManager.cache[channel] = {};
        SoundManager.cache[channel].onPlay = cb;
        return this;
    }
    static onLoad(channel,cb){
        if(!SoundManager.cache[channel])
            SoundManager.cache[channel] = {};
        SoundManager.cache[channel].onLoad = cb;
        return this;
    }
    static exec(channel){
        let ch = SoundManager.channels[channel];
        if(ch){
            ch.stop();
            ch.unload();
            SoundManager.channels[channel] = ch = null;
        }
        let cache = SoundManager.cache[channel];
        ch = new Howler.Howl({
            urls: [cache.file],
            autoplay: (typeof cache.autoplay==='boolean')?cache.autoplay:true,
            buffer: (typeof cache.buffer==='boolean')?cache.buffer:true,
            loop: (typeof cache.loop==='boolean')?cache.loop:true,
            volume: (typeof cache.volume==='number')?cache.volume:1,
            onend: cache.onEnd,
            onplay: cache.onPlay,
            onload: cache.onLoad,
        })
        SoundManager.channels[channel] = ch;
    }


    // methods
    static setVolume(channel,value){    //value区间0-1
        let ch = SoundManager.channels[channel];
        if(ch){
            ch.volume(value);
        }
        else
            Err.warn('通道'+channel+'未初始化，请先调用.load()方法');
    }
    static setPosition(channel,value){  //value单位是秒
        let ch = SoundManager.channels[channel];
        if(ch){
            ch.pos(value);
        }
        else
            Err.warn('通道'+channel+'未初始化，请先调用.load()方法');
    }
    static play(channel){
        let ch = SoundManager.channels[channel];
        if(ch){
            ch.play();
            ch.m_status = 'play';
        }
        else
            Err.warn('通道'+channel+'未初始化，请先调用.load()方法');
    }

    static pause(channel){
        let ch = SoundManager.channels[channel];
        if(ch){
            ch.pause();
            ch.m_status = (ch.m_status==='pause')?'play':'pause';
        }
        else
            Err.warn('通道'+channel+'未初始化，请先调用.load()方法');
    }
    static stop(channel){
        let ch = SoundManager.channels[channel];
        if(ch){
            ch.stop();
            ch.unload();
        }
        else
            Err.warn('通道'+channel+'未初始化，请先调用.load()方法');
    }
    static fadeTo(channel,to,duration,cb){
        let ch = SoundManager.channels[channel];
        if(ch){
            ch.fade(ch.volume(),to,duration,cb);
        }
        else
            Err.warn('通道'+channel+'未初始化，请先调用.load()方法');
    }
    static stopAll(){
        if(SoundManager.channels.length)
            for(let ch of SoundManager.channels){
                ch.stop();
                ch.unload();
            }
    }
    static state(channel){
        let ch = SoundManager.channels[channel];
        if(ch){
            return ch.m_status;
        }
        else
            Err.warn('通道'+channel+'未初始化，请先调用.load()方法');
    }

}


SoundManager.channels = [];
SoundManager.cache = [];


module.exports = SoundManager;
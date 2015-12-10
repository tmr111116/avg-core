var Err = require('./ErrorHandler');

export default class SpriteManager {
    constructor(args) {
        
    }

    static fromIndex(index){
        return SpriteManager.sprites[index];
    }

    static insert(index,sprite){
        sprite.index = index;
        return SpriteManager.sprites[index] = sprite;
    }

    static remove(index){
        return delete SpriteManager.sprites[index];
    }

    static setZorder(index,value){
        let sprite = SpriteManager.sprites[index];
        if(!sprite)
            Err.warn("精灵(index="+index+")不存在");
        else{
            if(sprite.zorder!=0 && sprite.zorder===value)
                return;
            sprite.zorder = value;
            if(sprite.parent)
                sprite.parent.children.sort(function(a,b) {
                    a.zorder = a.zorder || 0;
                    b.zorder = b.zorder || 0;
                    return a.zorder - b.zorder
                });
        }
    }
}

SpriteManager.sprites = [];










module.exports = SpriteManager;
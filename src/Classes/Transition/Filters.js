let fs = require('fs');
import AbstractFilter from './AbstractFilter';

let commonVertex = fs.readFileSync(__dirname + '/shaders/common.vert', 'utf8');

export class CrossFadeFilter extends AbstractFilter{
    constructor(duration=1000){
        super(commonVertex,
        fs.readFileSync(__dirname + '/shaders/crossfade.frag', 'utf8'));
        
        this.duration = 1000;
    }
}


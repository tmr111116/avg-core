var PIXI = require('../Library/pixi.js/src/index');

const FPS = {
	TOPLEFT: 0,
	TOPRIGHT: 1,
	BOTTOMLEFT: 2,
	BOTTOMRIGHT: 3,
	showFPS: true,
	installFPSView: function(stage){
		this.m_text = new PIXI.Text('fps initing...',{font : '24px Arial', fill : 0xFFD700, align : 'center'});
		this.m_text.x = 10;
		this.m_text.y = 10;
		this.m_text.zorder = 9999;
		this.m_ticker = new PIXI.ticker.Ticker();
		this.m_lasttime = Date.now();
		if(stage)
			stage.addChild(this.m_text);
		else
			console.log("ERROR: "+stage+" is not a stage/container/sprite.");
		this.m_ticker.add(this.update.bind(this));
		this.m_ticker.start();
	},
	update: function(ticker){
		if(Date.now()-this.m_lasttime>=300)
		{
			this.m_text.text = this.m_ticker.FPS<<0;
			this.m_lasttime = Date.now()
		}
	}
}

export default FPS;

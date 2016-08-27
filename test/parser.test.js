'use strict';

const parser = require('../src/Classes/Parser.js');
const expect = require('chai').expect;
const sinon = require("sinon");

describe('Parser', () => {
	it('parse simple script (wrapped with \'[]\')', () => {
		expect(parser.parse('[action await ease="func()" time=2000 pos=100 enabled=true]'))
		.to.eql({
			command: 'action',
			flags: ['await'],
			params: {
				ease: 'func()',
				time: 2000,
				pos: 100,
				enabled: true
			}
		})
	});
	it('parse simple script (starts with \'@\')', () => {
		expect(parser.parse('@action await ease="func()" time=2000 pos=100 enabled=true'))
		.to.eql({
			command: 'action',
			flags: ['await'],
			params: {
				ease: 'func()',
				time: 2000,
				pos: 100,
				enabled: true
			}
		})
	});
	it('parse complex script', () => {
		expect(parser.parse('[action await ease="func()" time=2000 pos=[0,0,100,200] enabled=true]'))
		.to.eql({
			command: 'action',
			flags: ['await'],
			params: {
				ease: 'func()',
				time: 2000,
				pos: [0,0,100,200],
				enabled: true
			}
		})
	});
	it('handle muti-space between params', () => {
		expect(parser.parse('[action await ease="func()"    time=2000   pos=100 enabled=true]'))
		.to.eql({
			command: 'action',
			flags: ['await'],
			params: {
				ease: 'func()',
				time: 2000,
				pos: 100,
				enabled: true
			}
		})
	});
	it('handle spaces in string params', () => {
		expect(parser.parse('[action await ease="func( 123  )" time=2000 pos=100 enabled=true]'))
		.to.eql({
			command: 'action',
			flags: ['await'],
			params: {
				ease: 'func( 123  )',
				time: 2000,
				pos: 100,
				enabled: true
			}
		})
	});
	it('handle quotes', () => {
		expect(parser.parse('[action await ease=\'func()\' time=2000 pos=100 enabled=true]'))
		.to.eql({
			command: 'action',
			flags: ['await'],
			params: {
				ease: 'func()',
				time: 2000,
				pos: 100,
				enabled: true
			}
		});
		expect(parser.parse('[action await ease=\`func()\` time=2000 pos=100 enabled=true]'))
		.to.eql({
			command: 'action',
			flags: ['await'],
			params: {
				ease: 'func()',
				time: 2000,
				pos: 100,
				enabled: true
			}
		});
	});
	it('handle template strings in string params', () => {
		expect(parser.parse('[action await ease=\`func(  ${"abc"+123}  )\` time=2000 pos=100 enabled=true]'))
		.to.eql({
			command: 'action',
			flags: ['await'],
			params: {
				ease: 'func(  abc123  )',
				time: 2000,
				pos: 100,
				enabled: true
			}
		})
	});
	it('handle errors', function() {
		this.timeout(10000);
		expect(() => parser.parse('action await ease="func()" time=a2000 pos=100 enabled=true'))
		.to.throw(/Invalid script format/);
		expect(() => parser.parse('[action await ease="func()" time=a2000 pos=100 enabled=true'))
		.to.throw(/Invalid script format/);
		expect(() => parser.parse('[action await ease="func()" time=2000 pos=a100 enabled=true]'))
		.to.throw(/Invalid value/);
		expect(() => parser.parse('[action await ease=\`func()\' time=2000 pos=100 enabled=true]'))
		.to.throw(/Invalid value/);
		expect(() => parser.parse('[action await ease="func()" time=20 00 pos=100 enabled=true]'))
		.to.throw(/Wrong script/);
		expect(() => parser.parse('[action await ease="func()" time=2000 pos= enabled=true]'))
		.to.throw(/Wrong script/);
		expect(() => parser.parse('[action await ease="func(  )" time=2000 pos=100 enabled=true]'))
		.not.to.throw(/Wrong script/);
	});
	it('time cost', function() {
		this.timeout(10000);
		expect(cost(() => parser.parse('[action await ease="func()" time=20 00 pos=100 enabled=true]')))
		.to.be.below(2000);
		expect(cost(() => parser.parse('[action await ease="func()" time=2000 pos= enabled=true]')))
		.to.be.below(80000);
	})
});

function cost(fn) {
	let start = Date.now();
	try {
		fn && fn();
	} catch (e) {

	}
	return Date.now() - start;
}

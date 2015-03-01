requirejs.config({
	baseUrl: '/',
	paths: {
		backbone: 	'bower_components/backbone/backbone',
		underscore: 'bower_components/underscore/underscore',
		text: 		'bower_components/requirejs-text/text',
		jquery: 	'bower_components/jquery/dist/jquery',
		jqueryui:   'bower_components/jqueryui/jquery-ui',
		handlebars: 'bower_components/handlebars/handlebars',
		marionette: 'bower_components/marionette/lib/backbone.marionette',
		bootstrap:  'bower_components/bootstrap/dist/js/bootstrap',
		moment:     'bower_components/moment/moment',
		highcharts: 'bower_components/highcharts-release/highcharts.src'
	}, 
	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: [ 'underscore', 'jquery', 'handlebars', 'bootstrap' ],
			exports: 'Backbone'
		},
		'marionette' : {
			deps : ['backbone', 'handlebars', 'bootstrap'],
			exports : 'Marionette'
		},
		'bootstrap': {
			deps: [ 'jquery', 'jqueryui' ],
			exports: 'Bootstrap'
		},
		'handlebars': {
			exports: 'Handlebars'
		},
		'highcharts': {
			'exports': 'Highcharts'
		}
	}
});

require(['js/app'], function( myApp ) {
	myApp.start();
	app = myApp;
});
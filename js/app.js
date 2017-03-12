var app = angular.module('cubeApp', [
		'appCon',
		'appDirtive',
		'ui.router',
		])


.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider

	.state('main', {
		url: "/",
		templateUrl: '/tpl/main.html',
		controller: 'mainCon'
	})
	.state('cube', {
		url: "/cube/:dim",
		templateUrl: '/tpl/cube.html',
		controller: 'cubeCon'
	})
	.state('cube3', {
		url: "/cube3/:dim",
		templateUrl: '/tpl/cube.html',
		controller: 'cubeCon'
	})
	;

	$urlRouterProvider.otherwise('/');



})



;



var appDirtive = angular.module('appDirtive', []);

appDirtive.directive('cube', ['$document', function($document) {
	return {
	    template: 
	    '<div>' + 
	    	'<control-pannel pannel-button-maping = "cubeButtonMaping"></control-pannel>' +
	    	'<cube-faces ng-repeat = "(faceIndex,innerFaceMaping) in facesMaping" faces-position = "faceIndex" is-safari = isSafari face-dimension = "cubeDimension">' + 
	    		'<div class="cube-inner-container" ng-repeat = "(innerFaceIndex, innerFaceData) in innerFaceMaping" face-index = "faceIndex" face-dimension = "cubeDimension" is-safari = "isSafari" spin-effect = "innerFaceData.spin">' + 
	    			'<cube-inner-faces face-index = "faceIndex" inner-face-index = "innerFaceIndex" inner-face-data = "innerFaceData" face-dimension = "cubeDimension" rotate-gesture = "rotateGesture(start,faceIndex,innerFaceIndex)" is-processing = "isProcessing" class = "{{innerFaceData.value}}">' +
					'</cube-inner-faces>' +
				'</div>' +
			'</cube-faces>' + 
		'</div>' + 
		'<timer></timer>',
	    restrict: 'E',
		controller: function($scope) {
			this.passRotateData = function(x,y) {
				$scope.rotateViewX = x;
				$scope.rotateViewY = y;
			};
		},
	    link: function(scope, element, attrs) {
	    	var startX = 0, startY = 0;
			//Cube rotate effect
			var cube = element.find('div');
			var rotateDegX = -25;
			var rotateDegY = -30;
			var rotatePreDegX, rotatePreDegY;
			var cubeAdjustPosition = scope.cubeDimension;

			scope.SetCubeView = function(rotateDegX, rotateDegY, scaleView){
				var transformation = 'rotatex(' + rotateDegX + 'deg) rotatey(' + rotateDegY + 'deg) scale3d(' + scaleView + ',' + scaleView + ',' + scaleView +')';

				cube.css({
					position: 'relative',		
					'transform-style':' preserve-3d',
					'-webkit-transform-style': 'preserve-3d',
					'-moz-transform-style': 'preserve-3d',

			    	'-moz-transform': transformation,

	                '-webkit-transform': transformation,

				    '-o-transform': transformation,

	                transform: transformation,

	                top: (-scope.cubeDimension * 50 + 120) + 'px',

	                left: (-scope.cubeDimension * 50 + 120) + 'px',

					//width: scope.cubeDimension * 100 + 'px',
					//height: scope.cubeDimension * 100 + 'px',
	                'transform-origin': scope.cubeDimension * 50 + 'px ' + scope.cubeDimension * 50 + 'px ' + '0',
					'-webkit-transform-origin': scope.cubeDimension * 50 + 'px ' + scope.cubeDimension * 50 + 'px ' + '0',

				});
			}
			
			scope.$watch('cubeDimension', function(newValue, oldValue) {
				scaleView = 2.6 / newValue;
	      		scope.SetCubeView(rotateDegX, rotateDegY, scaleView);
	      	});

	      	scope.$watchGroup(['rotateViewX', 'rotateViewY'], function() {
	      		var rotateSensitiveLvl = 4;
	      		rotateViewDegX = -scope.rotateViewY * rotateSensitiveLvl;
	      		rotateViewDegY = scope.rotateViewX * rotateSensitiveLvl;
        		scope.SetCubeView(rotateViewDegX, rotateViewDegY, scaleView);
	      	});
		        	


	    }
	}

}])

appDirtive.directive('cubeFaces', function() {
	return {
	    restrict: 'E',
	    scope: {
	    	faceDimension : '=',
            facesPosition: '=',
            isSafari: '='
	    },	    
	    link: function(scope, element, attributes) {


			if (!scope.isSafari) {
				//offset faces to form 3d cube
				offsetDistance = scope.faceDimension * 50;

			    switch (scope.facesPosition) {
				    case 0:
				        posotion = 'translateZ(' + offsetDistance + 'px)';
				        break;
				    case 1:
				        posotion = 'translateZ(-' + offsetDistance + 'px)';
				        break;
				    case 2:
				        posotion = 'rotateX(90deg) translateZ(' + offsetDistance + 'px)';
				        break;
				    case 3:
				        posotion = 'rotateX(90deg) translateZ(-' + offsetDistance + 'px)';
				        break;
				    case 4:
				        posotion = 'rotateY(90deg) translateZ(' + offsetDistance + 'px)';
				        break;
				    case 5:
				        posotion = 'rotateY(90deg) translateZ(-' + offsetDistance + 'px)';
				        break;			        
				    default:
				    	throw ('directive cubeface positoin error');
				};

			} /*else {
				//Special faces postion for safari
				switch (scope.facesPosition) {
			    case 0:
			        posotion = '';
			        break;
			    case 1:
			        posotion = '';
			        break;
			    case 2:
			        posotion = 'rotateX(90deg)';
			        break;
			    case 3:
			        posotion = 'rotateX(90deg)';
			        break;
			    case 4:
			        posotion = 'rotateY(90deg)';
			        break;
			    case 5:
			        posotion = 'rotateY(90deg)';
			        break;			        
			    default:
			    	console.log('directive cubeface positoin error');
				};

			}*/
			
	    	element.css({
	    		width:  scope.faceDimension * 100 + 'px',
				height: scope.faceDimension * 100 + 'px',
	        	'-moz-transform': posotion,
                '-webkit-transform': posotion,
                '-o-transform': posotion,
                transform: posotion,			

	    	}); 
		}
	}
})

appDirtive.directive('cubeInnerContainer', function($document) {
	return {
	    restrict: 'C',
	    scope: {
	    	faceIndex : '=',
	    	faceDimension: '=',
	    	spinEffect: '=',
	    	isSafari: '='
	    },
	    link: function(scope, element, attributes) {

	    	scope.$watch('spinEffect', function() {
	    		var adjustAxis = 50 * scope.faceDimension;
    			if (scope.faceIndex % 2 == 0) {
	    			var sign = -1;
	    		} else {
	    			var sign = 1;
	    		}
	    		/*if (scope.isSafari) {

	    			if (scope.spinEffect == '') {
	    				element.css({
			    			'-moz-transform': 'translateZ(' + -sign * adjustAxis + 'px)',
						    '-webkit-transform': 'translateZ(' + -sign * adjustAxis + 'px)',
						    '-o-transform': 'translateZ(' + -sign * adjustAxis + 'px)',
						    transform: 'translateZ(' + -sign * adjustAxis + 'px)',
		    				'transform-origin': '50% 50% 0',
							'-webkit-transform-origin': '50% 50% 0'
				    	});	  

	    			} else {
						element.css({

			    			'-moz-transform': 'translateZ(0px)',
						    '-webkit-transform': 'translateZ(0px)',
						    '-o-transform': 'translateZ(0px)',
						    transform: 'translateZ(0px)',
							'transform-origin': adjustAxis + 'px ' + adjustAxis + 'px ' + sign *adjustAxis + 'px ',
							'-webkit-transform-origin': adjustAxis + 'px ' + adjustAxis + 'px ' + sign *adjustAxis + 'px '
				    	});	    				
	    			}

	    		} else {*/
					element.css({
						'transform-origin': adjustAxis + 'px ' + adjustAxis + 'px ' + sign *adjustAxis + 'px ',
						'-webkit-transform-origin': adjustAxis + 'px ' + adjustAxis + 'px ' + sign *adjustAxis + 'px '
			    	});
	    		//}

	    		if (scope.spinEffect == "") {
	    			element.removeClass('spin_effect_yp_s spin_effect_yp_t spin_effect_yn_s spin_effect_yn_t spin_effect_xp_s spin_effect_xp_t spin_effect_xn_s spin_effect_xn_t spin_effect_zp_s_0 spin_effect_zp_s_1 spin_effect_zp_t spin_effect_zn_s_0 spin_effect_zn_s_1 spin_effect_zn_t');
	    		} else {
	    			element.addClass(scope.spinEffect);
	    		}
	    		

	    		
	    	});
	    	
		}
	}
})

appDirtive.directive('cubeInnerFaces', function() {
	return {
		template: '<div></div>',
	    restrict: 'E',
	    scope: {
	    	faceDimension : '=',
	    	faceIndex: '=',
	        innerFaceIndex: '=',
	        innerFaceData: '=',
	        rotateGestureVer2: '&',
	        rotateGesture: '&',
	        isProcessing:'='

	    },	    
	    link: function(scope, element, attributes) {

	    	var borderWidth = 3, width = 100, height = 100;
	    	//calculate inner face position	    	
	    	var row = Math.floor(scope.innerFaceIndex / scope.faceDimension);
	    	var column = scope.innerFaceIndex % scope.faceDimension;
	    	var offtop = 100 * row;
	    	var offleft = 100 * column;

			var innerface = element.children();
			var startX = 0, startY = 0, x = 0, y = 0;

	    	element.css({
				position: 'absolute',
				width: width + 'px',
				height: height + 'px',
				background: '#000',
				left: offleft + 'px',
				top: offtop + 'px',

	    	});

	    	
	    	innerface.css({
	    		margin: borderWidth + 'px',
	    		'border-radius': '8px',
	    		//border: borderWidth +'#000 solid',
	    		width: width - borderWidth * 2 + 'px',
				height: height - borderWidth * 2 + 'px',
	    	})

			element.on('mousedown', function(event) {//
		        // Prevent default dragging of selected content
		        event.preventDefault();
		        scope.rotateGesture({start:true,faceIndex:scope.faceIndex,innerFaceIndex:scope.innerFaceIndex})		       
	      	});


			element.on('mouseenter', function(event) {//mouseenter
		        // Prevent default dragging of selected content
		        event.preventDefault();
				scope.rotateGesture({start:false,faceIndex:scope.faceIndex,innerFaceIndex:scope.innerFaceIndex})


	      	});

		}
	}
})



appDirtive.directive('timer', function($interval) {
	return {
		template: '<button id="startTimerBtn" type="button" class="btn btn-default" ng-click = "StartTimer()" ng-disabled="start">start</button><span> Time: {{time | number: 2}} s</span>',
	    restrict: 'E',
	    link: function(scope, element, attributes) {

			var num = element.find('span');

			element.css({
				position: 'absolute',
				display:'block',
				width: '300px',
				left:'324px',
				top: '145px',
				'z-index':50,
				color:'#D5D5D5'
			})

			var buttons = element.find('button');

			num.css({
				'font-size': '20px',
				'font-weight': 600
			})

			buttons.css({
				'margin-right': '5px',
			})

	    	scope.time = 0;
	    	scope.start = false;
	    	scope.paused = false;

	    	scope.timerId = undefined;
	    	scope.StartTimer = function() {
	    		scope.$emit('startPlayCube', true)
	    		scope.time = 0;
	    		scope.start = true;
				scope.timerId = $interval(function() {
					scope.time += 0.01; 
			    }, 10);
	    	}


	    	scope.EndTimer = function() {
	    		if (scope.timerId !== undefined) {
					scope.start = false;
		    		$interval.cancel(scope.timerId);
	    		}
	    		
	    	}

	    	scope.$on('checkCubeComplete', function(event, complete){
	    		if (scope.start && complete) {
	    			scope.EndTimer();	
	    		}	    		    		
	    	});

	    }
	}
})


appDirtive.directive('viewAdjust', function($window) {
	return {
		restrict: 'A',
	    link: function(scope, element, attributes) {
			angular.element($window).bind('resize', function(){
				scope.$broadcast('screenOrientation', $window.innerHeight)				
			});
	    }
	}
})


appDirtive.directive('cubeDemo', ['$document', function($document) {
	return {
	    template: 
	    '<div>' + 
	    	'<cube-faces ng-repeat = "(faceIndex,innerFaceMaping) in facesMaping" faces-position = "faceIndex" is-safari = isSafari face-dimension = "cubeDimension">' + 
	    		'<div class="cube-inner-container" ng-repeat = "(innerFaceIndex, innerFaceData) in innerFaceMaping" face-index = "faceIndex" face-dimension = "cubeDimension" is-safari = "isSafari" spin-effect = "innerFaceData.spin">' + 
	    			'<cube-inner-faces face-index = "faceIndex" inner-face-index = "innerFaceIndex" inner-face-data = "innerFaceData" face-dimension = "cubeDimension" class = "{{innerFaceData.value}}">' +
					'</cube-inner-faces>' +
				'</div>' +
			'</cube-faces>' + 
		'</div>',
	    restrict: 'E',
	    link: function(scope, element, attrs) {
	    	var startX = 0, startY = 0;
			//Cube rotate effect
			var cube = element.find('div');
			var rotateDegX = -20;
			var rotateDegY = -45;
			var rotatePreDegX, rotatePreDegY;
			var cubeAdjustPosition = scope.cubeDimension;

			scope.SetCubeView =  function(rotateDegX, rotateDegY, scaleView){
				var transformation = 'rotatex(' + rotateDegX + 'deg) rotatey(' + rotateDegY + 'deg) scale3d(' + scaleView + ',' + scaleView + ',' + scaleView +')';

				cube.css({
					position: 'relative',		
					'transform-style':' preserve-3d',
					'-webkit-transform-style': 'preserve-3d',
					'-moz-transform-style': 'preserve-3d',

			    	'-moz-transform': transformation,

	                '-webkit-transform': transformation,

				    '-o-transform': transformation,

	                transform: transformation,


				});
			}
			
			scope.$watch('cubeDimension', function(newValue, oldValue) {
				scaleView = 1 / newValue;
	      		scope.SetCubeView(rotateDegX, rotateDegY, scaleView);
	      	});



	    }
	}

}])
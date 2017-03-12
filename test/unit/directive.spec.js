describe('angular:directive unit test',function(){
	var rootScope,compile,scope;
	beforeEach(module('cubeApp'));
	beforeEach(
		inject(function($rootScope,$compile){
			rootScope = $rootScope;
			scope = $rootScope.$new();
			compile = $compile;
		})		
	);

	describe('directive:cube',function(){
		var ctrl,testElement,timeout;
		beforeEach(function(){			
			inject(function($controller,$timeout){				
				ctrl = $controller('cubeCon', {$scope:scope});
				timeout = $timeout;
			})
			testElement = compile("<cube></cube>")(scope);
			$('body').append(testElement);


		});


		afterEach(function(){
			//cleanup
		})

		it('should initialize cube when dimension is specified',function(){	
			scope.transformTo(3);
			scope.$digest();
			expect(testElement).toBeDefined();

		});

		it('should call SetCubeView() when view parameters are changed',function(){	
			spyOn(scope, 'SetCubeView');
			scope.rotateViewX++;
			scope.$digest();
			expect(scope.SetCubeView).toHaveBeenCalled();
		});




		//test child directive
		describe('directive:cubeFaces',function(){			
			it('should throw error if faceIndex is not correct',function(){
				expect(function(){
					compile(angular.element("<cube-faces faces-position='6'></cube-faces>"))(scope)
				}).toThrow('directive cubeface positoin error');
				expect(function(){
					compile(angular.element("<cube-faces faces-position='a'></cube-faces>"))(scope)
				}).toThrow('directive cubeface positoin error');

			});

		})
		describe('directive:cubeInnerContainer',function(){			
			it('should contain spinEffect',function(){
				scope.transformTo(3);
				scope.$digest();
				var thisElement = angular.element(document.querySelector(".cube-inner-container"));
				scope.RandomMovement()
				rootScope.$digest()
				expect(thisElement.isolateScope().spinEffect).toBe('');	
			});


		})
		describe('directive:cubeInnerFaces',function(){			
			it('should call rotateGesture() according to mouse event',function(){
				var thisElement = angular.element(document.querySelector("cube-inner-faces")),
					isolatedScope = thisElement.isolateScope();

				spyOn(isolatedScope, 'rotateGesture');
				thisElement.triggerHandler("mousedown");
				expect(isolatedScope.rotateGesture.calls.argsFor(0)).toEqual([{start:true,faceIndex:isolatedScope.faceIndex,innerFaceIndex:isolatedScope.innerFaceIndex}]);
				thisElement.triggerHandler("mouseenter");
				expect(isolatedScope.rotateGesture.calls.argsFor(1)).toEqual([{start:false,faceIndex:isolatedScope.faceIndex,innerFaceIndex:isolatedScope.innerFaceIndex}]);
			});
		})

	})

	

	describe('directive:cubeDemo',function(){
		var ctrl,testElement;
		beforeEach(function(){			
			inject(function($controller){				
				ctrl = $controller('cubeCon', {$scope:scope});
			})
			testElement = compile("<cube-demo></cube-demo>")(scope);

		});


		afterEach(function(){
			//cleanup
		})

		it('should initialize cube when dimension is specified',function(){				
			expect(testElement).toBeDefined();
		});
		it('should call SetCubeView() when dimension is changed',function(){				
			spyOn(scope, 'SetCubeView');
			scope.cubeDimension++;	
			scope.$digest();
			expect(scope.SetCubeView).toHaveBeenCalled();
		});
		

	})


	describe('directive:viewAdjust',function(){
		var testElement,windowObj;
		beforeEach(function(){			
			inject(function($window){					
				windowObj = $window;
				spyOn(scope, '$broadcast');
			});
			testElement = compile(angular.element("<div view-adjust></div>"))(scope);		
		});


		afterEach(function(){
			//cleanup
		})

		it('should $broadcast screenOrientation event when window resize',function(){
			angular.element(windowObj).triggerHandler('resize');
			expect(scope.$broadcast).toHaveBeenCalledWith('screenOrientation',windowObj.innerHeight);		

		});		

	})

	describe('directive:timer',function(){
		var scope,testElement,interval;
		beforeEach(function(){			
			scope = rootScope.$new();
			testElement = compile("<timer></timer>")(scope);
			inject(function($interval){					
				interval = $interval;
			});
		});


		afterEach(function(){
			
		})

		it('should start timer when button is clicked',function(){
			spyOn(scope,'StartTimer');
			testElement.find('button').triggerHandler("click");
			expect(scope.StartTimer).toHaveBeenCalled();			

		});

		it('should end timer when cube is completed',function(){
			spyOn(scope,'EndTimer');
			//start timer
			testElement.find('button').triggerHandler("click");
			//should not be called if cube if not conpleted
			scope.$broadcast('checkCubeComplete', false);
			expect(scope.EndTimer).not.toHaveBeenCalled();
			scope.$broadcast('checkCubeComplete', true);
			expect(scope.EndTimer).toHaveBeenCalled();

		});
		it('should time correctly within deviation(=1ms)',function(){
			//set 3000ms
			var time = 3000;
			scope.StartTimer();
			interval.flush(time);
			scope.EndTimer();
			expect(Math.abs(scope.time - time/1000)).toBeLessThan(1);
		});


	})


})
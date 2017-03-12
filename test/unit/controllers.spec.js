describe('angular:controllers unit test',function(){

	beforeEach(module('cubeApp'));
	describe('controller:cubeCon',function(){
		var scope,ctrl,timeout;
		beforeEach(
			inject(function($controller,$rootScope,$timeout){
				scope = $rootScope.$new();
				ctrl = $controller('cubeCon', {$scope:scope});
				timeout = $timeout;
			})
		);

		afterEach(function(){
			//cleanup
		})

		describe('initializtion',function(){
			var state,stateParams;
			beforeEach(
				inject(function($state,$stateParams){
					state = $state;
					stateParams = $stateParams;
				})
			);

			it('should initialize cube by calling transformTo() when dimension is paased',function(){	
				spyOn(scope,'transformTo');
				stateParams.dim = 3;
				//use timeout to set initialization in the next life cycle
				timeout.flush();
				expect(scope.transformTo).toHaveBeenCalledWith(3);

			});
			it('should also initialize cube by calling transformTo() with random dimension when undefined dimension is accidently paased',function(){	
				spyOn(scope,'transformTo');
				stateParams.dim = undefined;
				timeout.flush();
				expect(scope.transformTo).toHaveBeenCalled();	

			});

		});


		describe('transformTo',function(){
			it('should initialize the cube if dimension is passed',function(){
				scope.transformTo(3);
				//6 cube faces, 3*3 innerfaces in each face
				expect(scope.facesMaping.length).toBe(6);
				for (var i = 0; i < scope.facesMaping.length; i++) {
					expect(scope.facesMaping[i].length).toBe(3*3)
				}
				scope.transformTo(4);
				//6 cube faces, 5*5 innerfaces in each face
				expect(scope.facesMaping.length).toBe(6);
				for (var i = 0; i < scope.facesMaping.length; i++) {
					expect(scope.facesMaping[i].length).toBe(4*4)
				}
				scope.transformTo(5);
				//6 cube faces, 5*5 innerfaces in each face
				expect(scope.facesMaping.length).toBe(6);
				for (var i = 0; i < scope.facesMaping.length; i++) {
					expect(scope.facesMaping[i].length).toBe(5*5)
				}

			})
			it('should not initialize the cube if no dimension is passed',function(){
				spyOn(scope,'ResetCube');
				scope.transformTo();
				expect(scope.ResetCube).not.toHaveBeenCalled();
			})
		});



		describe('Notation',function(){
			it('should fire rotation if notation is provided',function(){
				var rotateCount=0,wholeRotateCount=0;
				scope.transformTo(3);
				spyOn(scope,'Rotate');
				spyOn(scope,'WholeRotate');

				//combine all available notations
				var availableNotation =[];
				availableNotation.push(scope.pannelButtonMaping0);
				availableNotation.push(scope.pannelButtonMaping1);
				availableNotation.push(scope.pannelButtonMaping2);
				availableNotation.push(scope.pannelButtonMaping3);

				//check if all rotations called correctly
				for (var i = availableNotation.length - 1; i >= 0; i--) {
					for (var j = availableNotation[i].length - 1; j >= 0; j--) {
						for (var k = availableNotation[i][j].length - 1; k >= 0; k--) {
							var notation = availableNotation[i][j][k].value;
							if (notation == 'X' || notation == 'X`' || notation == 'Y' || notation == 'Y`' || notation == 'Z' || notation == 'Z`' ) {
								wholeRotateCount++;
							} else{
								rotateCount++;
							}
							scope.Notation(notation);
							
						}
					}
				}
				expect(scope.Rotate.calls.count()).toEqual(rotateCount);
				expect(scope.WholeRotate.calls.count()).toEqual(wholeRotateCount);			

			});

			it('should be called on "rotate" event',function(){
				spyOn(scope,'Notation');
				scope.$emit('rotate','U1');
				expect(scope.Notation).toHaveBeenCalled();
			})

		});
		
		describe('Rotate',function(){			
			//The purpose of this function is to identify and return affected inner faces for each rotation
			it('should identify affected inner face',function(){
				var dimension = 3;	
				scope.transformTo(dimension);				
				var allAxises = ['x','y','z'],
					allDirections = ['p','n'];
				for (var i = allAxises.length - 1; i >= 0; i--) {
					for (var j = allDirections.length - 1; j >= 0; j--) {
						var affectedFaces = scope.Rotate(allAxises[i],allDirections[j],0);
						for (var k = affectedFaces.length - 1; k >= 0; k--) {
							expect(affectedFaces[k].length).toBeGreaterThan(0);
						}
					}						
					
				}

			})
		})


		describe('WholeRotate',function(){
			it('should run Rotate() for each layer',function(){
				var dimension = 3,count=0;
				scope.transformTo(dimension);
				spyOn(scope,'Rotate');
				scope.WholeRotate('x','p');
				//call Rotate() n times for nxn cube
				expect(scope.Rotate.calls.count()).toEqual(dimension);
			})
		})


		describe('CompleteMovement',function(){
			it('should be called after a rotation',function(){
				spyOn(scope,'CompleteMovement');
				scope.Rotate('x','p',1);
				timeout.flush();
				expect(scope.CompleteMovement).toHaveBeenCalled();
			})
			it('should broadcast when the cube is completed after each rotation',function(){
				scope.transformTo(5);
				spyOn(scope,'$broadcast');
				//rotate a layer
				scope.Notation('U1');				
				//undo the previous move to complete the cube
				scope.Notation('U1`');
				//check
				scope.CompleteMovement();
				expect(scope.$broadcast).toHaveBeenCalledWith('checkCubeComplete',true);

			})
			it('should not broadcast if the cube is not completed',function(){
				scope.transformTo(5);
				spyOn(scope,'$broadcast');
				//rotate a layer
				scope.Notation('L1');
				//check
				scope.CompleteMovement();
				expect(scope.$broadcast).not.toHaveBeenCalledWith('checkCubeComplete',true);
			})
			it('should change $scope.isProcessing at the end',function(){
				scope.CompleteMovement();
				timeout.flush();
				expect(scope.isProcessing).toBe(false);
			})
		})

		describe('rotateGesture',function(){
			it('should fire Rotate() if correct gesture is given',function(){
				scope.transformTo(3);

				var testCase = [
					{
						faceIndex:0,
						startInnerFaceIndex:0,
						endInnerFaceIndex:1,
						expectedRotation:{
							axis:'y',
							direction:'p',
							layer:0

						}
					},{
						faceIndex:4,
						startInnerFaceIndex:0, 
						endInnerFaceIndex:3,
						expectedRotation:{
							axis:'z',
							direction:'n',
							layer:0
						}
					},{
						faceIndex:2,
						startInnerFaceIndex:1, 
						endInnerFaceIndex:0,
						expectedRotation:{
							axis:'z',
							direction:'p',
							layer:2
						}
					},{
						faceIndex:1,
						startInnerFaceIndex:4, 
						endInnerFaceIndex:1,
						expectedRotation:{
							axis:'x',
							direction:'n',
							layer:1
						}
					}

				]
				spyOn(scope,'Rotate');

				for (var i = 0; i < testCase.length; i++) {
					scope.rotateGesture(true,testCase[i].faceIndex,testCase[i].startInnerFaceIndex);
					scope.rotateGesture(false,testCase[i].faceIndex,testCase[i].endInnerFaceIndex);
				}

				timeout.flush();

				for (var i = 0; i < testCase.length; i++) {
					expect(scope.Rotate.calls.argsFor(i)).toEqual([testCase[i].expectedRotation.axis,testCase[i].expectedRotation.direction,testCase[i].expectedRotation.layer]);
				}

			})
			it('should not fire Rotate() if incorrect gesture is given',function(){
				spyOn(scope,'Rotate');				
				//incorrect faceIndex
				scope.rotateGesture(true,1,0);
				scope.rotateGesture(false,2,1);				
				//incorrect InnerFaceIndex
				scope.rotateGesture(true,1,0);
				scope.rotateGesture(false,1,2);
				timeout.flush();
				expect(scope.Rotate).not.toHaveBeenCalled()
			})

		})

		describe('RandomMovement',function(){
			it('should call a random rotation',function(){
				spyOn(scope,'Rotate');
				scope.RandomMovement();
				expect(scope.Rotate).toHaveBeenCalled();
			});		

		})
		describe('RandomInitialization',function(){
			it('should call RandomMovement() 30 time',function(){
				spyOn(scope,'RandomMovement');
				scope.RandomInitialization();
				expect(scope.RandomMovement.calls.count()).toEqual(30);
			})
			it('should be called on "startPlayCube" event',function(){
				spyOn(scope,'RandomInitialization');
				scope.$broadcast('startPlayCube',true);
				expect(scope.RandomInitialization).toHaveBeenCalled();
			})
		})


	})
	
	describe('controller:viewCon',function(){
		var scope,ctrl;
		beforeEach(
			inject(function($controller,$rootScope){
				scope = $rootScope.$new();
				ctrl = $controller('viewCon', {$scope:scope});
			})
		);

		afterEach(function(){
			//cleanup
		})

		describe('changeView',function(){
			it('should be called when view parameters are changed',function(){
				spyOn(scope,'changeView');
				expect(scope.changeView.calls.count()).toEqual(0);
				scope.viewScale++;
				scope.$digest();
				expect(scope.changeView.calls.count()).toEqual(1);
				scope.viewX++;
				scope.$digest();
				expect(scope.changeView.calls.count()).toEqual(2);
				scope.viewY++;
				scope.$digest();
				expect(scope.changeView.calls.count()).toEqual(3);
			})
		})

		describe('panelInput',function(){
			it('should emit rotation',function(){
				spyOn(scope,'$emit');
				scope.panelInput();
				expect(scope.$emit).toHaveBeenCalled();
			})

		})

	})

	describe('controller:mainCon',function(){
		var scope,ctrl,state;
		beforeEach(
			inject(function($controller,$rootScope,$state){
				scope = $rootScope.$new();
				ctrl = $controller('mainCon', {$scope:scope});
				state = $state;
			})
		);


		afterEach(function(){
			//cleanup
		})

		describe('selectCube',function(){
			it('should change $state',function(){
				spyOn(state,'go');
				scope.selectCube(3);
				expect(state.go).toHaveBeenCalled();
			})
		})

	})

})
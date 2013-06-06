(function(flandria,settings){
    var tdir = settings.tmplDir,
        idir = settings.imgsDir;

    flandria
        .directive('content', function() {
            return {
                restrict    : 'E',
                transclude  : true,
                templateUrl : tdir + 'content.tpl.html',
                replace     : true,
                controller:['$scope',function($scope){
                    $scope.$on('startPlay',function( evt, video){
                        $scope.$broadcast('startPlaying',video);
                    });
                    $scope.$on('stopPlay',function(){
                        $scope.$broadcast('stopPlaying');
                    });
                }]
            };
        })
        .directive('navigator',function(){
            return {
                restrict    : 'E',
                transclude  : true,
                templateUrl : tdir + 'navigator.tpl.html',
                scope       : {},
                controller  : ['$scope',function($scope){
                    var video = null;
                    $scope.$on('startPlaying',function( evt, elVideo ){
                        video = elVideo;
                        $scope.isPlayed = true;
                    });
                    $scope.stop = function(){
                        if(video){
                            video.pause();
                            video.currentTime = 0;
                        }
                        $scope.isPlayed = false;
                        $scope.$emit('stopPlay');
                    };
                    $scope.toggleMute = function(){
                        video.muted = !video.muted;
                        $scope.isMuted = video.muted;
                    };
                }],
                replace     : true
            };
        })
        .directive('blockVideo',function(){
            return {
                restrict    : 'E',
                transclude  : true,
                templateUrl : tdir + 'block.video.tpl.html',
                scope       :{},
                controller  : ['$scope','$window','$element',function($scope,$window,$element){
                    $scope.blockWidth = $window.innerWidth;
                    $scope.blockHeight = $window.innerWidth * 720 / 1280;
                    $scope.isPlayed = false;

                    var video = $element.find('video');
                    var playButton = $element.find('#playVideo');

                    angular.element($window).bind('resize',function(){
                        $scope.$apply(function () {
                            $scope.blockHeight = $element.width() * 720 / 1280;
                            $scope.isPlayed = !!$scope.isPlayed;
                        });
                    });

                    $scope.play = function(){
                        video[0].play();
                        $scope.isPlayed = true;
                        $scope.$emit('startPlay',video[0]);
                    }
                    $scope.$on('stopPlaying',function(){
                        $scope.isPlayed = false;
                    });

                }],
                replace     : true
            };
        })
        .directive('blockShowVariants',function(){
            return {
                restrict    : 'E',
                transclude  : true,
                templateUrl : tdir + 'block.show.variants.tpl.html',
                replace     : true
            };
        })
        .directive('blockFlow',function(){
            return {
                restrict    : 'E',
                transclude  : true,
                templateUrl : tdir + 'block.flow.tpl.html',
                scope       : { blockId:"@" },
                controller  : ['$scope','$element',function( $scope, $element ){
                    var frontPlane = $element.attr('front-plane');
                    if (frontPlane){
                        $scope.frontPlane = idir + frontPlane + '.png'
                    }
                }],
                replace     : true
            };
        })
        .directive('blockTryIt',function(){
            return {
                restrict    : 'E',
                transclude  : true,
                templateUrl : tdir + 'block.try.it.tpl.html',
                replace     : true
            };
        })
        .directive('blockFeedback',function(){
            return {
                restrict    : 'E',
                transclude  : true,
                templateUrl : tdir + 'block.feedback.tpl.html',
                replace     : true
            };
        })
        .directive('slider',function(){
            return {
                restrict    : 'E',
                transclude  : true,
                templateUrl : tdir + 'controls/slider.tpl.html',
                scope       : {},
                controller  : ['$scope','$element',function($scope,$element){


                    var waWidth = $element.find('.slider-work-area').width();
                    var ww = waWidth * 0.8,
                        lf = waWidth * 0.1,
                        rt = waWidth * 0.9;


                    $scope.start = $element.attr( 'start' );
                    $scope.end   = $element.attr( 'end' );
                    $scope.min   = $element.attr( 'min' )|0;
                    $scope.max   = $element.attr( 'max' )|1;
                    $scope.value   = $element.attr( 'value' )|0;

                    $scope.mouseLeaveWA = function(){
                        $scope.mouseUp();
                    };

                    $scope.updatePos = function(evt){
                        if ( evt.which == 1 ){

                            var pos =  evt.clientX - $( evt.delegateTarget ).offset().left;
                            if ( pos < lf ) {
                                pos = lf;
                            }

                            if ( pos > rt ){
                                pos = rt;
                            }

                            $scope.value = ($scope.min + ( pos - lf ) * ( $scope.max - $scope.min) / ww );
                            evt.preventDefault();

                            $scope.updateValue();
                        }
                    };

                    $scope.updateValue = function(){
                        $scope.offset   = 10 + ( $scope.value - $scope.min ) * 80 / ( $scope.max - $scope.min) ;
                    };


                    $scope.updateValue();

                }],
                replace     : true
            };
        })
})(flandria, flandriaSettings);

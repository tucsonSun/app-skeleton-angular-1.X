/**
 * Directive used to display a Image in card layout
 * Requires jQuery Magnific Popup plugin.
 */
(function() {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrImageCard', egrImageCard);

	function egrImageCard() {
		var directive = {
			restrict: 'AE',
			"scope": {
				"title": "@",
				"imageSrc": "@",
			},

			template: '<div class="item col-sm-6 col-md-3">' +
                        '<div class="project-wrapper">' +
                            '<div class="project-link">' +
                                '<a href="{{imageSrc}}" class="zoom" title="{{title}}">' +
                                    '<i class="icon-Full-Screen"></i>' +
                                '</a>' +
                                '<a href="#/single-portfolio-1" class="external-link">' +
                                    '<i class="icon-Link"></i>' +
                                '</a>' +
                            '</div>' +
                            '<div class="project-title"><h4>{{title}}</h4></div>'+
                            '<img src="{{imageSrc}}" alt="" class="img-responsive small-thumnail" />'+
                            '<div style="padding:10px 15px; margin-bottom:10px; background-color:red;">'+
                            	'<h3 class="text-center">{{title}}</h3>'+
                            	'<div ng-transclude></div>'+
                        	'</div>'+
                        '</div>' +
                    '</div>',
            replace: true, //element to which the directive declared should be replaced with template        
			transclude: true, //allow HTML into angular directive 
			link: link,
			//controller: controller
		};

		return directive;

		function link(scope, element, attrs, ngModel) {
			//TODO: I know that i am initalizing the magnificPopup multiple times 
			//(ever time this directive is declared). But as of right now this is the 
			//only quick way to make this work. If i have time I will revist this later.
		    if ($.fn.magnificPopup){
		        $("#portfolio-gallery").magnificPopup({
		            delegate: 'a.zoom',
		            type: 'image',
		            fixedContentPos: false,

		            // Delay in milliseconds before popup is removed
		            removalDelay: 300,

		            // Class that is added to popup wrapper and background
		            mainClass: 'mfp-fade',

		            gallery: {
		                enabled: true,
		                preload: [0,2],
		                arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
		                tPrev: 'Previous Project',
		                tNext: 'Next Project'
		            }
		        });
		    }
		    else 
		    	throw new Error("unable to detected the need framework 'magnificPopup' please check included libs");
		}


		//      function controller($scope) {
		//	
		//		}
	}
})();

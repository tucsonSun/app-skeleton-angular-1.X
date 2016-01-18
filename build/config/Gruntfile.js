/*jshint scripturl:true */
module.exports = function(grunt) {
	var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});

	var appFiles = [
		// application files 
		'../../app/app.module.js',
		'../../app/app.routes.js',

    	// core files
		'../../app/core/core.module.js',
		'../../app/core/constants.js',

		// directives files
		'../../app/core/directives/directives.module.js',
		'../../app/core/directives/animateInView.directive.js',
		'../../app/core/directives/chartCircle.directive.js',
		'../../app/core/directives/googleMaps.directive.js',
		'../../app/core/directives/imageCard.directive.js',
		'../../app/core/directives/loader.directive.js',
		'../../app/core/directives/matchHeight.directive.js',
		'../../app/core/directives/messagePanel.directive.js',
		'../../app/core/directives/pageScroll.directive.js',
		'../../app/core/directives/parallax.directive.js',
		'../../app/core/directives/stickyMenu.directive.js',

		// model objects 
		'../../app/core/modelObjects/modelObjects.module.js',
		'../../app/core/modelObjects/MessageObj.js',

		// services files 
		'../../app/core/services/services.module.js',
		'../../app/core/services/globalWeather.service.js',
		'../../app/core/services/myFirst.base.service.js',
		'../../app/core/services/nextMessage.service.js',
		'../../app/core/services/underscore.service.js',

		// featureSets files
		'../../app/featureSets/home/home.module.js',
		'../../app/featureSets/home/home.controller.js',
		'../../app/featureSets/home/home.service.js',

		// auto generated by grunt task
		'../dist/js/app.templates.js',
	];

	var app_js_file_path = '../dist/js/app.js';
	var scssFiles = {
		'../dist/css/bundle.css': '../../assets/scss/style.scss', // 'destination': 'source'
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// watcher to automatically build during dev
		watch: {
			js: {
				files: ['../../app/*.js', '../../assets/js/*.js'],
				tasks: ['buildjs']
			},
			scss: {
				files: ['../../assets/scss/**/*.scss', '../../assets/scss/*.scss'],
				tasks: ['buildcss']
			}
		},
		// concatenate files into bundles
		concat: {
			// all js files for jenkins build and deploy
			buildjs: {
				src: appFiles,
				dest: app_js_file_path
			}
		},
		// register angular templates in the $templateCache
		ngtemplates: {
			app: {
				cwd: '../../',
				src: 'app/**/*.html',
				dest: '../dist/js/app.templates.js',
				options: {
					module: 'myFirstApp',
					//String to prefix template URLs with. Defaults to ''
					//prefix: ''
				}
			}
		},
		// add missing angular dependency injection annotations
		ngAnnotate: {
			options: {
				singleQuotes: true
			},
			app: {
				files: {
					'../dist/js/app.min.js': [app_js_file_path]
				}
			}
		},
		// minify js and create source map
		uglify: {
			options: {
				sourceMap: true,
				mangle: true, //uglyify params
			},
			my_target: {
				files: {
					'../dist/js/app.min.js': [app_js_file_path]
				}
			}
		},
		// convert scass to css file
		sass: {
			options: {
				//sourceMap: true,
				sourceComments: true
			},
			dist: {
				files: scssFiles // Dictionary of files
			}
		},
		// minify css
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1,
				sourceMap: true
			},
			target: {
				files: {
					'../dist/css/bundle.min.css': ['../dist/css/bundle.css'] //dest : source
				}
			}
		},
		// replace 'app' refrences with unique guid
		replace: {
			view_js: {
				src: ['../../index.html'],
				overwrite: true,
				replacements: [{
					//from: '<!-- JS_BUNDLE_TARGET -->',
					//to: '<script src="app/bundle_' + guid + '.js"></script>'

					//find string that 
					//starts with: 'assets/js_auto/bundle_'
					//ends with: '.min.js'
					from: /assets\/js_auto\/bundle_.*\.min\.js/g,
					to: 'assets/js_auto/bundle_' + guid + '.min.js'
				}]
			},
			mapfile_js: {
				src: ['../dist/js/app.min.js.map'],
				overwrite: true,
				replacements: [{
					from: '"file":"app.min.js"',
					to: '"file":"bundle_' + guid + '.min.js"'
				}, {
					from: '"sources":["app.js"]',
					to: '"sources":["bundle.js"]'
				}]
			},
			mapurl_js: {
				src: ['../dist/js/app.min.js'],
				overwrite: true,
				replacements: [{
					from: '//# sourceMappingURL=app.min.js.map',
					to: '//# sourceMappingURL=bundle_' + guid + '.min.js.map'
				}]
			},
			view_css: {
				src: ['../../index.html'],
				overwrite: true,
				replacements: [{
					//find string that 
					//starts with: 'assets/scss_auto/bundle_'
					//ends with: '.min.css'
					from: /assets\/scss_auto\/bundle_.*\.min\.css/g,
					to: 'assets/scss_auto/bundle_' + guid + '.min.css'
				}]
			},
			mapfile_css: {
				src: ['../dist/css/bundle.min.css.map'],
				overwrite: true,
				replacements: [{
					from: '"sources":["../dist/css/bundle.css"]',
					to: '"sources":["bundle_' + guid + '.min.css"]'
				}]
			},
			mapurl_css: {
				src: ['../dist/css/bundle.min.css'],
				overwrite: true,
				replacements: [{
					from: '/*# sourceMappingURL=bundle.min.css.map',
					to: '/*# sourceMappingURL=bundle_' + guid + '.min.css.map'
				}]
			}
		},
		// rename file names with unique guid
		rename: {
			app_js: {
				src: app_js_file_path,
				dest: '../dist/js/bundle.js'
			},
			app_js_min: {
				src: '../dist/js/app.min.js',
				dest: '../dist/js/bundle_' + guid + '.min.js'
			},
			app_js_map: {
				src: '../dist/js/app.min.js.map',
				dest: '../dist/js/bundle_' + guid + '.min.js.map'
			},
			//MOVE THE FILE
			move_js_min: {
				src: '../dist/js/bundle_' + guid + '.min.js',
				dest: '../../assets/js_auto/bundle_' + guid + '.min.js'
			},
			//MOVE THE FILE
			move_js_map: {
				src: '../dist/js/bundle_' + guid + '.min.js.map',
				dest: '../../assets/js_auto/bundle_' + guid + '.min.js.map'
			},
			css_min: {
				src: '../dist/css/bundle.min.css',
				dest: '../dist/css/bundle_' + guid + '.min.css'
			},
			css_map: {
				src: '../dist/css/bundle.min.css.map',
				dest: '../dist/css/bundle_' + guid + '.min.css.map'
			},
			//MOVE THE FILE
			move_css_min: {
				src: '../dist/css/bundle_' + guid + '.min.css',
				dest: '../../assets/scss_auto/bundle_' + guid + '.min.css'
			},
			//MOVE THE FILE
			move_css_map: {
				src: '../dist/css/bundle_' + guid + '.min.css.map',
				dest: '../../assets/scss_auto/bundle_' + guid + '.min.css.map'
			}
		},
		// remove angular templates file after concatenation
		clean: {
			options: {
				force: true
			},
			//js: ["../dist/js/app.templates.js"],
			delete_old_js: ["../../assets/js_auto/bundle*.*"],
			delete_old_css: ["../../assets/scss_auto/bundle_*.*"],
			//delete_old_js: ["../../assets/scss/bundle_*.*"],
		},

	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-rename');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-sass');


	//
	// Targets
	//
	grunt.registerTask('buildcss', ['sass', 'cssmin', 'replace:view_css',
		'replace:mapfile_css', 'replace:mapurl_css', 'rename:css_min', 'rename:css_map',
		'clean:delete_old_css', 'rename:move_css_min', 'rename:move_css_map'
	]);

	grunt.registerTask('buildjs', ['ngtemplates', 'concat:buildjs', 'ngAnnotate',
		'uglify', 'replace:view_js', 'replace:mapfile_js', 'replace:mapurl_js',
		'clean:delete_old_js', 'rename:app_js', 'rename:app_js_min', 'rename:app_js_map',
		'rename:move_js_min', 'rename:move_js_map'
	]);

	grunt.registerTask('build', ['buildcss', 'buildjs']);
	grunt.registerTask('default', ['build']);

};

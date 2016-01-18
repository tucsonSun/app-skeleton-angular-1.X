/*jshint scripturl:true */
module.exports = function(grunt) {
	var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});

	var appFiles = [
		'../../app/app.module.js',
		'../../app/app.routes.js',
		//'../../app/app.templates.js',
		'../../app/core/core.module.js',
		'../../app/core/constants.js',
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

		'../../app/core/modelObjects/modelObjects.module.js',
		'../../app/core/modelObjects/MessageObj.js',

		'../../app/core/services/services.module.js',
		'../../app/core/services/globalWeather.service.js',
		'../../app/core/services/myFirst.base.service.js',
		'../../app/core/services/nextMessage.service.js',
		'../../app/core/services/underscore.service.js',

		'../../app/featureSets/home/home.module.js',
		'../../app/featureSets/home/home.controller.js',
		'../../app/featureSets/home/home.service.js',
	];

	var app_js_file_path = '../dist/app.js';
	var scssFiles = {
		'../dist/css/bundle.css': '../../assets/scss/style.scss', // 'destination': 'source'
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// watcher to automatically build during dev
		watch: {
			js: {
				files: ['../../app/*.js', '../../assets/**/*.js', '../../assets/scss/**/*.scss', '../../assets/scss/*.scss'],
				tasks: ['build']
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
				dest: '../dist/app.templates.js',
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
					'../dist/app.min.js': [app_js_file_path]
				}
			}
		},
		// minify js and create source map
		uglify: {
			options: {
				sourceMap: true
			},
			my_target: {
				files: {
					'../dist/app.min.js': [app_js_file_path]
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
					from: '<!-- JS_BUNDLE_TARGET -->',
					to: '<script src="app/bundle_' + guid + '.js"></script>'
				}]
			},
			mapfile_js: {
				src: ['../dist/app.min.js.map'],
				overwrite: true,
				replacements: [{
					from: '"file":"app.min.js"',
					to: '"file":"bundle_' + guid + '.min.js"'
				}, {
					from: '"sources":["app.js"]',
					to: '"sources":["bundle_' + guid + '.js"]'
				}]
			},
			mapurl_js: {
				src: ['../dist/app.min.js'],
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
					from: 'href="assets/scss/bundle_*.min.css"',
					to: '<link rel="stylesheet" href="assets/css/bundle_' + guid + '.min.css">'
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
				dest: '../dist/bundle.js'
			},
			app_js_min: {
				src: '../dist/app.min.js',
				dest: '../dist/bundle_' + guid + '.min.js'
			},
			app_js_map: {
				src: '../dist/app.min.js.map',
				dest: '../dist/bundle_' + guid + '.min.js.map'
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
				dest: '../../assets/scss/bundle_' + guid + '.min.css'
			},
			//MOVE THE FILE
			move_css_map: {
				src: '../dist/css/bundle_' + guid + '.min.css.map',
				dest: '../../assets/scss/bundle_' + guid + '.min.css.map'
			}
		},
		// remove angular templates file after concatenation
		clean: {
			options: {
				force: true
			},
			js: ["../dist/app.templates.js"],
			delete_old_css: ["../../assets/scss/bundle_*.*"],
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
		'rename:app_js', 'rename:app_js_min', 'rename:app_js_map', 'clean:js'
	]);

	grunt.registerTask('build', ['buildcss', 'buildjs']);
	grunt.registerTask('default', ['build']);

};

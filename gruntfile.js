module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		concat: {   
		    dist: {
		        src: [
		            'src/Spectrum4Leaflet.js',
		            'src/Request.js',
		        ],
		        dest: 'build/spectrum4leaflet-dev.js',
		    }
		},
		qunit: {
		    all: ['tests/**/*.html']
		},
		jsdoc : {
		        dist : {
		            src: ['src/*.js'], 
		            options: {
		                destination: 'doc'
		            }
		        }
	    }
    });
		
		    // 3. Where we tell Grunt we plan to use this plug-in.
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-qunit');
		    
	// 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
	grunt.registerTask('default', ['jsdoc','concat','qunit']);
};
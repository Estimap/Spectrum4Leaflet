
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src:  [
		     'src/Spectrum4Leaflet.js',
		     'src/utils/Utils.js',
		     'src/utils/Xml.js',
		     'src/geo/projection/Projection.Mercator.js',
		     'src/geo/crs/CRS.EPSG41001.js',
		     'src/Request.js',
		     'src/services/Operation.js',
		     'src/services/Service.js',
		     'src/services/MapService.js',
		     'src/services/TileService.js',
		     'src/services/FeatureService.js',
		     'src/services/NamedResourceService.js',
		     'src/services/GeometryService.js',
		     'src/layers/MapServiceLayer.js',
		     'src/layers/TileServiceLayer.js',
		     'src/controls/Layers.js',
		     'src/controls/Legend.js',
		     'src/controls/Feature.js',
		     'src/controls/Resources.js'
		],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          console: true,
          module: true,
          document: true
        }
      }
    },
	jsdoc : {
	        dist : {
	            src: ['src/**/*.js'], 
	            options: {
	                destination: 'doc'
	            }
	        }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
  });
  
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('dev', ['jshint', 'concat']);
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
  grunt.registerTask('production', ['jshint', 'qunit', 'concat', 'uglify','jsdoc']);

};
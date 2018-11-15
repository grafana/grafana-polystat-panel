const sass = require('node-sass');
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-package-modules');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-run');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    clean: ["dist"],

    copy: {
      dev: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '!**/*.jsxxx', '!**/*.scss'],
        dest: 'dist/src'
      },
      main: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '!**/*.jsxxx', '!**/*.ts', '!**/*.ts.d', '!**/*.scss'],
        dest: 'dist'
      },
      bower: {
        cwd: 'bower_components',
        expand: true,
        src: ['font-awesome'],
        dest: 'dist'
      },
      externals: {
        cwd: 'src',
        expand: true,
        src: ['**/external/*'],
        dest: 'dist'
      },
      pluginDef: {
        expand: true,
        src: ['README.md', 'CHANGELOG.md'],
        dest: 'dist',
      }
    },

    packageModules: {
        dist: {
          src: 'package.json',
          dest: 'dist/src'
        },
    },

    tslint: {
      options: {
        // Task-specific options go here.
        configuration: "tslint.json"
      },
      files: {
          // Target-specific file lists and/or options go here.
          src: ['src/**/*.ts'],
      },
    },

    ts: {
      build: {
        tsconfig: './tsconfig.json'
      }
    },

    sass: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      dist: {
        files: {
          "dist/css/polystat.dark.css": "src/sass/polystat.dark.scss",
          "dist/css/polystat.light.css": "src/sass/polystat.light.scss",
          "dist/css/polystat.css": "src/sass/polystat.scss",
        }
      }
    },

    run: {
      options: {
        // Task-specific options go here.
      },
      tests: {
        cmd: 'jest',
        args: [
          '--color',
          '--verbose'
        ]
      }
    },

    watch: {
      files: ['src/**/*.ts', 'src/**/*.html', 'src/**/*.scss', 'src/**/*.css', 'src/img/*.*', 'src/plugin.json', 'tests/**/*.ts', 'README.md', 'CHANGELOG.md'],
      tasks: ['default'],
      options: {
        debounceDelay: 250,
      },
    }

  });


  grunt.registerTask('default', [
      'tslint',
      'ts:build',
      'sass',
      'run:tests',
      "copy:dev",
      "copy:main",
      "copy:bower",
      "copy:externals",
      "copy:pluginDef"
    ]
  );
  grunt.registerTask('release', [
      'clean',
      'tslint',
      'ts:build',
      'sass',
      'run:tests',
      "copy:main",
      "copy:bower",
      "copy:externals",
      "copy:pluginDef"
    ]
  );
};

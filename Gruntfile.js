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
      main: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '!**/*.jsxxx', '!**/*.ts', '!**/*.ts.d', '!**/*.scss'],
        dest: 'dist'
      },
      tsmain: {
        cwd: 'src',
        expand: true,
        src: ['**/*.ts', '**/*.ts.d'],
        dest: 'dist/src'
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
        src: ['README.md'],
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
        src: ['src/**/*.ts', '!src/**/*.d.ts'],
        dest: 'dist',
        options: {
          module: 'system',
          target: 'es5',
          rootDir: 'src',
          sourceMap: true,
          sourceRoot: 'src',
          declaration: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          noImplicitAny: false,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noImplicitReturns: true,
          noImplicitThis: true,
          noFallthroughCasesInSwitch: true,
          strictNullChecks: false,
          strictPropertyInitialization: true,
          allowJs: false,
          jsx: "react",
          strictFunctionTypes: false,
          alwaysStrict: true
        }
      }
    },

    sass: {
      options: {
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
      files: ['src/**/*.ts', 'src/**/*.html', 'src/**/*.css', 'src/img/*.*', 'src/plugin.json', 'tests/**/*.ts', 'README.md'],
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
      "copy:main",
      "copy:tsmain",
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
      "copy:tsmain",
      "copy:bower",
      "copy:externals",
      "copy:pluginDef"
    ]
  );
};

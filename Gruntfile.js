'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'assets',
            dist: 'dist'
        },

        compass: {                  // Task
            dist: {                   // Target
                options: {              // Target options
                    sassDir: '<%= yeoman.app %>/styles',
                    cssDir: '<%= yeoman.app %>/styles',
                    environment: 'production',
                    raw: 'preferred_syntax = :sass\n'
                }
            },
            dev: {                    // Another target
                options: {
                    sassDir: '<%= yeoman.app %>/styles',
                    cssDir: '<%= yeoman.app %>/styles',
                    raw: 'preferred_syntax = :sass\n'
                }
            }
        },

        // Concatenate JS
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                src: [

                    '<%= yeoman.app %>/bower_components/angular/angular.js',
                    '<%= yeoman.app %>/bower_components/angular-bootstrap/ui-bootstrap.min.js',
                    '<%= yeoman.app %>/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    '<%= yeoman.app %>/bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    '<%= yeoman.app %>/bower_components/angular-resource/angular-resource.min.js',
                    //'<%= yeoman.app %>/bower_components/bootstrap/dist/js/bootstrap.min.js',
                    '<%= yeoman.app %>/js/navigation/states.js',

                    // Services
                    '<%= yeoman.app %>/js/airport/service.js',
                    '<%= yeoman.app %>/js/country/service.js',
                    '<%= yeoman.app %>/js/route/service.js',
                    '<%= yeoman.app %>/js/flight/service.js',
                    
                    // Resources
                    '<%= yeoman.app %>/js/airport/resource.js',
                    '<%= yeoman.app %>/js/country/resource.js',
                    '<%= yeoman.app %>/js/route/resource.js',
                    '<%= yeoman.app %>/js/flight/resource.js',
            
                    // Controllers
                    '<%= yeoman.app %>/js/flight/controller.js',

                    // Runtime
                    '<%= yeoman.app %>/js/runtime/events.js',
                    '<%= yeoman.app %>/js/runtime/config.js',
                    '<%= yeoman.app %>/js/runtime/filter.js',
                    '<%= yeoman.app %>/js/runtime/functions.js',
                    '<%= yeoman.app %>/js/runtime/directives.js',
                   
                    // App.js
                    '<%= yeoman.app %>/js/app.js'
                ],
                dest: '<%= yeoman.app %>/js/dist/built.js'
            }
        },
        watch: {
            scripts: {
                files: ['<%= yeoman.app %>/**/*.js'],
                tasks: ['concat'],
                options: {
                    spawn: false
                }
            }
        },

        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            my_target: {
                files: {
                    '<%= yeoman.app %>/js/dist/built.min.js': ['<%= yeoman.app %>/js/dist/built.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.registerTask('jsmin', ['concat', 'uglify']);
    grunt.registerTask('default', ['compass', 'concat']);

    // grunt.registerTask('uglify', ['concat', 'uglify']);

    // Mirror test.
};

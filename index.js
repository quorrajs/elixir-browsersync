/**
 * index.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2016, QuorraJS.
 * @license See LICENSE.txt
 */

var util = require('util');
var Elixir = require('laravel-elixir');
var assign;
var browserSync;

/*
 |----------------------------------------------------------------
 | BrowserSync
 |----------------------------------------------------------------
 |
 | Browsersync makes your browser testing workflow faster by
 | synchronizing URLs, behavior, and code changes across
 | across multiple devices. And, now it's in Elixir!
 |
 */

Elixir.extend('browserSync', function (options) {
    loadPlugins();

    // Browsersync will only run during `gulp watch`.
    if (Elixir.isWatching()) {
        browserSync.init(getOptions(options));
    }

    new Elixir.Task('browserSync', function () {
        if (Elixir.isWatching()) {
            this.recordStep('Starting Browsersync');
        }
    }).watch();
});


/**
 * Load the required Gulp plugins on demand.
 */
function loadPlugins() {
    assign = require('lodash.assign');
    browserSync = require('browser-sync').create();
}


/**
 * Get all Browsersync options.
 *
 * @param  {object|null} options
 * @return {object}
 */
function getOptions(options) {
    var config = Elixir.config;

    return assign({
            files: [
                config.appPath + '/**/*.js',
                config.get('public.css.outputFolder') + '/**/*.css',
                config.get('public.js.outputFolder') + '/**/*.js',
                config.get('public.versioning.buildFolder') + '/rev-manifest.json',
                config.viewPath + '/*'
            ],

            watchOptions: {
                usePolling: true
            },

            reloadDebounce: 1000,

            snippetOptions: {
                rule: {
                    match: /(<\/body>|<\/pre>)/i,
                    fn: function (snippet, match) { return snippet + match }
            }
        }
    }, config.browserSync, options);
}

var fs = require('fs');
var path = require('path');
var assign = require('object-assign');
var expect = require('expect.js');
var webpack = require('webpack');

describe('svg-url-loader', function() {
    'use strict';

    var outputDir = path.resolve(__dirname, './output'),
        bundleFileName = 'bundle.js',
        getBundleFile = function() {
            return path.join(outputDir, bundleFileName);
        };
    var svgUrlLoader = path.resolve(__dirname, '../');
    var globalConfig = {
        context: path.resolve(__dirname, '../'),
        output: {
            path: outputDir,
            filename: bundleFileName
        },
        module: {
            loaders: [
                {
                    test: /\.svg/,
                    loader: svgUrlLoader,
                    query: {},
                    exclude: /node_modules/
                }
            ]
        }
    };

    // Clean generated cache files before each test so that we can call each test with an empty state.
    afterEach(function(done) {
        fs.unlink(getBundleFile(), done);
    });


    it('should convert SVG file to utf-8 encoded data-uri string, enclosed in quotes', function(done) {
        var config = assign({}, globalConfig, {
            entry: './test/input/icon.js',
        });
        config.module.loaders[0].query.noquotes = false;

        webpack(config, function(err, stats) {
            expect(err).to.be(null);
            fs.readFile(getBundleFile(), function(err, data) {
                expect(err).to.be(null);
                var encoded = (0,eval)(data.toString());
                expect(encoded.indexOf('"')).to.be(0);
                expect(encoded.lastIndexOf('"')).to.be(encoded.length - 1);
                expect(encoded.indexOf('data:image/svg+xml;charset=utf8,%3Csvg')).to.be(1);
                return done();
            });
        });
    });


    it('should not enclose output in quotes if \'noquotes\' option is specified', function(done) {
        var config = assign({}, globalConfig, {
            entry: './test/input/icon.js',
        });
        config.module.loaders[0].query.noquotes = true;

        webpack(config, function(err, stats) {
            expect(err).to.be(null);
            fs.readFile(getBundleFile(), function(err, data) {
                expect(err).to.be(null);
                var encoded = (0,eval)(data.toString());
                expect(encoded.indexOf('data:image/svg+xml;charset=utf8,%3Csvg')).to.be(0);
                expect(encoded.lastIndexOf('svg%3E')).to.be(encoded.length - 'svg%3E'.length);
                return done();
            });
        });
    });


    it('should convert SVG file to utf-8 encoded data-uri string, when embedded in LESS file', function(done) {
        var config = assign({}, globalConfig, {
            entry: './test/input/less.js',
        });
        config.module.loaders[0].query.noquotes = false;
        config.module.loaders.push({
            test: /\.less$/,
            loaders: [
				'css-loader',
				'less-loader'
            ]
        });

        webpack(config, function(err, stats) {
            expect(err).to.be(null);
            fs.readFile(getBundleFile(), function(err, data) {
                expect(err).to.be(null);
                var encoded = (0,eval)(data.toString()),
                    found = false;
                for(var i=0; i<encoded[0].length; ++i) {
                    var v = encoded[0][i];
                    if (typeof v === 'string' && v.indexOf('background-image: url("data:image/svg+xml;charset=utf8,%3Csvg') !== -1) {
                        found = true;
                    }
                }
                expect(found).to.be(true);
                return done();
            });
        });
    });


    it('should convert SVG file to utf-8 encoded data-uri string, when embedded in SCSS file', function(done) {
        var config = assign({}, globalConfig, {
            entry: './test/input/scss.js',
        });
        config.module.loaders[0].query.noquotes = false;
        config.module.loaders.push({
            test: /\.scss$/,
            loaders: [
				'css-loader',
				'sass-loader'
            ]
        });

        webpack(config, function(err, stats) {
            expect(err).to.be(null);
            fs.readFile(getBundleFile(), function(err, data) {
                expect(err).to.be(null);
                var encoded = (0,eval)(data.toString()),
                    found = false;
                for(var i=0; i<encoded[0].length; ++i) {
                    var v = encoded[0][i];
                    if (typeof v === 'string' && v.indexOf('background-image: url("data:image/svg+xml;charset=utf8,%3Csvg') !== -1) {
                        found = true;
                    }
                }
                expect(found).to.be(true);
                return done();
            });
        });
    });


    it('should convert SVG file to utf-8 encoded data-uri string, when embedded in CSS file', function(done) {
        var config = assign({}, globalConfig, {
            entry: './test/input/css.js',
        });
        config.module.loaders[0].query.noquotes = false;
        config.module.loaders.push({
            test: /\.css$/,
            loaders: [
				'css-loader'
            ]
        });

        webpack(config, function(err, stats) {
            expect(err).to.be(null);
            fs.readFile(getBundleFile(), function(err, data) {
                expect(err).to.be(null);
                var encoded = (0,eval)(data.toString()),
                    found = false;
                for(var i=0; i<encoded[0].length; ++i) {
                    var v = encoded[0][i];
                    if (typeof v === 'string' && v.indexOf('background-image: url("data:image/svg+xml;charset=utf8,%3Csvg') !== -1) {
                        found = true;
                    }
                }
                expect(found).to.be(true);
                return done();
            });
        });
    });
});

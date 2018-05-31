module.exports = function(config) {
    config.set({
        frameworks: ['mocha'],
        singleRun: true,
        files: [
            'test/test.js'
        ],
        preprocessors: {
            'test/test.js': ['webpack']
        },
        browsers: ['Chrome'],
        webpack: {
            module: {
                rules: [{
                    test: /\.js$/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    }]
                }]
            }
        }
    });
};

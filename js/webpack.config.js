const path = require('path');
module.exports = {
     entry: {
         options: './src/options.js',
         linear: './src/linear.js',
         model3D: './src/model3D.js',
     },
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, 'dist/')
    },
};
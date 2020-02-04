const path = require('path');

module.exports = {
    target: 'node',
    entry: ['./index.js', './src/client.js', './src/embed.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'test.js'
    }
};
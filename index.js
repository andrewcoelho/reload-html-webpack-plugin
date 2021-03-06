var io = require('socket.io')(8196);

const newConnection = function() {
    const socket = io.connect('http://localhost:8196/');

    socket.on('reload', function() {
        window.location.reload();
    });
};

function ReloadPlugin() {};

ReloadPlugin.prototype.apply = function(compiler) {
    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
            htmlPluginData.html += '<script src="http://localhost:8196/socket.io/socket.io.js"></script>';
            htmlPluginData.html += '<script>var socket = io.connect("http://localhost:8196");socket.on("reload", function(){window.location.reload()});</script>'
            callback(null, htmlPluginData);
        });

        compilation.plugin('html-webpack-plugin-after-emit', function(htmlPluginData, callback) {
            io.emit('reload');
            callback(null, htmlPluginData);
        });
    });
};

module.exports = ReloadPlugin;

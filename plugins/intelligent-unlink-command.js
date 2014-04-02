(function(root) {
var modules = {};
modules['scribe_plugin_intelligent_unlink_command'] = function () {
    return function (scribe) {
        var unlinkCommand = new scribe.api.Command('unlink');
        unlinkCommand.execute = function () {
            var selection = new scribe.api.Selection();
            if (selection.selection.isCollapsed) {
                scribe.transactionManager.run(function () {
                    /**
                     * If the selection is collapsed, we can remove the containing anchor.
                     */
                    var aNode = selection.getContaining(function (node) {
                            return node.nodeName === 'A';
                        });
                    if (aNode) {
                        new scribe.api.Element(aNode.parentNode).unwrap(aNode);
                    }
                }.bind(this));
            } else {
                scribe.api.Command.prototype.execute.apply(this, arguments);
            }
        };
        unlinkCommand.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            if (selection.selection.isCollapsed) {
                return !!selection.getContaining(function (node) {
                    return node.nodeName === 'A';
                });
            } else {
                return scribe.api.Command.prototype.queryEnabled.apply(this, arguments);
            }
        };
        scribe.commands.unlink = unlinkCommand;
    };
};
var exportModule = modules['scribe_plugin_intelligent_unlink_command'];
if (typeof define === 'function' && define.amd) {
	// AMD. Register as an anonymous module.
	define(['scribe-plugin-intelligent-unlink-command'], function() {
		return exportModule;
	});
} else if (typeof exports === 'object') {
	// Node. Does not work with strict CommonJS, but
	// only CommonJS-like enviroments that support module.exports,
	// like Node.
	module.exports = exportModule;
}
}(this));

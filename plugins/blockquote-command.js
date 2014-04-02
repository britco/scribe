(function(root) {
var modules = {};
modules['scribe_plugin_blockquote_command'] = function () {
    return function (scribe) {
        var blockquoteCommand = new scribe.api.SimpleCommand('blockquote', 'BLOCKQUOTE');
        blockquoteCommand.execute = function () {
            var command = scribe.getCommand(this.queryState() ? 'outdent' : 'indent');
            command.execute();
        };
        blockquoteCommand.queryEnabled = function () {
            var command = scribe.getCommand(this.queryState() ? 'outdent' : 'indent');
            return command.queryEnabled();
        };
        blockquoteCommand.queryState = function () {
            var selection = new scribe.api.Selection();
            var blockquoteElement = selection.getContaining(function (element) {
                    return element.nodeName === 'BLOCKQUOTE';
                });
            return scribe.allowsBlockElements() && !!blockquoteElement;
        };
        scribe.commands.blockquote = blockquoteCommand;
        /**
         * If the paragraphs option is set to true, we unapply the blockquote on
         * <enter> keypresses if the caret is on a new line.
         */
        if (scribe.allowsBlockElements()) {
            scribe.el.addEventListener('keydown', function (event) {
                if (event.keyCode === 13) {
                    // enter
                    var command = scribe.getCommand('blockquote');
                    if (command.queryState()) {
                        var selection = new scribe.api.Selection();
                        if (selection.isCaretOnNewLine()) {
                            event.preventDefault();
                            command.execute();
                        }
                    }
                }
            });
        }
    };
};
var exportModule = modules['scribe_plugin_blockquote_command'];
if (typeof define === 'function' && define.amd) {
	// AMD. Register as an anonymous module.
	define(['scribe-plugin-blockquote-command'], function() {
		return exportModule;
	});
} else if (typeof exports === 'object') {
	// Node. Does not work with strict CommonJS, but
	// only CommonJS-like enviroments that support module.exports,
	// like Node.
	module.exports = exportModule;
}
}(this));

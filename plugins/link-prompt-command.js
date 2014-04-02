(function(root) {
var modules = {};
modules['scribe_plugin_link_prompt_command'] = function () {
    return function (scribe) {
        var linkPromptCommand = new scribe.api.Command('createLink');
        linkPromptCommand.nodeName = 'A';
        linkPromptCommand.execute = function () {
            var selection = new scribe.api.Selection();
            var range = selection.range;
            var anchorNode = selection.getContaining(function (node) {
                    return node.nodeName === this.nodeName;
                }.bind(this));
            var initialLink = anchorNode ? anchorNode.href : 'http://';
            var link = window.prompt('Enter a link.', initialLink);
            if (anchorNode) {
                range.selectNode(anchorNode);
                selection.selection.removeAllRanges(range);
                selection.selection.addRange(range);
            }
            // FIXME: I don't like how plugins like this do so much. Is there a way
            // to compose?
            if (link) {
                // Prepend href protocol if missing
                // For emails we just look for a `@` symbol as it is easier.
                if (!/^mailto\:/.test(link) && /@/.test(link)) {
                    var shouldPrefixEmail = window.confirm('The URL you entered appears to be an email address. ' + 'Do you want to add the required \u201Cmailto:\u201D prefix?');
                    if (shouldPrefixEmail) {
                        link = 'mailto:' + link;
                    }
                } else if (!/^https?\:\/\//.test(link)) {
                    var shouldPrefixLink = window.confirm('The URL you entered appears to be a link. ' + 'Do you want to add the required \u201Chttp://\u201D prefix?');
                    if (shouldPrefixLink) {
                        link = 'http://' + link;
                    }
                }
                scribe.api.SimpleCommand.prototype.execute.call(this, link);
            }
        };
        linkPromptCommand.queryState = function () {
            /**
             * We override the native `document.queryCommandState` for links because
             * the `createLink` and `unlink` commands are not supported.
             * As per: http://jsbin.com/OCiJUZO/1/edit?js,console,output
             */
            var selection = new scribe.api.Selection();
            return !!selection.getContaining(function (node) {
                return node.nodeName === this.nodeName;
            }.bind(this));
        };
        scribe.commands.linkPrompt = linkPromptCommand;
    };
};
var exportModule = modules['scribe_plugin_link_prompt_command'];
if (typeof define === 'function' && define.amd) {
	// AMD. Register as an anonymous module.
	define(['scribe-plugin-link-prompt-command'], function() {
		return exportModule;
	});
} else if (typeof exports === 'object') {
	// Node. Does not work with strict CommonJS, but
	// only CommonJS-like enviroments that support module.exports,
	// like Node.
	module.exports = exportModule;
}
}(this));

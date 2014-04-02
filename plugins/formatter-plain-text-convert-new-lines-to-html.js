(function(root) {
var modules = {};
modules['scribe_plugin_formatter_plain_text_convert_new_lines_to_html'] = function () {
    return function (scribe) {
        scribe.plainTextFormatter.formatters.push(function (html) {
            return html.replace(/\n([ \t]*\n)+/g, '</p><p>').replace(/\n/g, '<br>');
        });
    };
};
var exportModule = modules['scribe_plugin_formatter_plain_text_convert_new_lines_to_html'];
if (typeof define === 'function' && define.amd) {
	// AMD. Register as an anonymous module.
	define(['scribe-plugin-formatter-plain-text-convert-new-lines-to-html'], function() {
		return exportModule;
	});
} else if (typeof exports === 'object') {
	// Node. Does not work with strict CommonJS, but
	// only CommonJS-like enviroments that support module.exports,
	// like Node.
	module.exports = exportModule;
}
}(this));

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var loaderUtils = require("loader-utils"),
	path = require("path");
module.exports = function() {};
module.exports.pitch = function(remainingRequest) {
	if(this.cacheable) this.cacheable();
	var query = loaderUtils.parseQuery(this.query);
	return [
		"// style-loader: Adds some css to the DOM by adding a <style> tag",
		"",
		"// load the styles",
		"var content = require(" + loaderUtils.stringifyRequest(this, "!!" + remainingRequest) + ");",
		"if(typeof content === 'string') content = [[module.id, content, '']];",
		"// add the styles to the DOM",
		"var load = require(" + loaderUtils.stringifyRequest(this, "!" + path.join(__dirname, "addStyles.js")) + ")(content);",
		"var options = " + JSON.stringify(query),
		"if(content.locals) module.exports = content.locals;",
		"// Hot Module Replacement",
		"var updateHandles = [];",
		"function registerUpdate(update) {",
		"    if(module.hot) {",
		"    	// When the styles change, update the <style> tags",
		"    	if(!content.locals && updaters.length === 0) {",
		"    		module.hot.accept(" + loaderUtils.stringifyRequest(this, "!!" + remainingRequest) + ", function() {",
		"    			var newContent = require(" + loaderUtils.stringifyRequest(this, "!!" + remainingRequest) + ");",
		"    			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];",
		"               updateHandles.forEach(function(update) { update(newContent); });",
		"    		});",
		"    	}",
		"       updateHandles.push(update);",
		"    	// When the module is disposed, remove the <style> tags",
		"    	module.hot.dispose(function() {",
		"           update();",
		"           updateHandles.splice(updateHandles.indexOf(update), 1);",
		"       });",
		"    }",
		"    return update;",
		"}",
		"if(options.loadable) {",
		"    exports.load = function(opts) {",
		"        opts = Object.assign({}, options, opts || {});",
		"        var update = registerUpdate(load(opts));",
		"        return function() { update(); };",
		"    };",
		"}else{",
		"    registerUpdate(load(options));",
		"}"
	].join("\n");
};

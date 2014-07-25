(function (root, factory) {
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // Rhino, and plain browser loading.
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory(root);
    }
}(this, function (exports) {

function TokenStream(tokens) {
	// Assume that tokens is an array.
	this.tokens = tokens;
	this.i = -1;
}
TokenStream.prototype.tokenAt = function(i) {
	if(i < this.tokens.length)
		return this.tokens[i];
	return new EOFToken();
}
TokenStream.prototype.consume = function(num) {
	if(num === undefined) num = 1;
	this.i += num;
	this.token = this.tokenAt(this.i);
	//console.log(this.i, this.token);
	return true;
}
TokenStream.prototype.next = function() {
	return this.tokenAt(this.i+1);
}
TokenStream.prototype.reconsume = function() {
	this.i--;
}

function parseerror(s, msg) {
	console.log("Parse error at token " + s.i + ": " + s.token + ".\n" + msg);
	return true;
}
function donothing(){ return true; };

function consumeAListOfRules(s, topLevel) {
	rules = [];
	var rule;
	while(s.consume()) {
		if(s.token instanceof WhitespaceToken) {
			continue;
		} else if(s.token instanceof EOFToken) {
			return rules;
		} else if(s.token instanceof CDOToken || s.token instanceof CDCToken) {
			if(topLevel == "top-level") continue;
			s.reconsume();
			if(rule = consumeAQualifiedRule(s)) rules.push(rule);
		} else if(s.token instanceof AtKeywordToken) {
			s.reconsume();
			if(rule = consumeAnAtRule(s)) rules.push(rule);
		} else {
			s.reconsume();
			if(rule = consumeAQualifiedRule(s)) rules.push(rule);
		}
	}
}

function consumeAnAtRule(s) {
	s.consume();
	var rule = new AtRule(s.token.value);
	while(s.consume()) {
		if(s.token instanceof SemicolonToken || s.token instanceof EOFToken) {
			return rule;
		} else if(s.token instanceof OpenCurlyToken) {
			rule.value = consumeASimpleBlock(s);
			return rule;
		} else if(s.token instanceof SimpleBlock && s.token.name == "{") {
			rule.value = s.token;
			return rule;
		} else {
			s.reconsume();
			rule.prelude.push(consumeAComponentValue(s));
		}
	}
}

function consumeAQualifiedRule(s) {
	var rule = new QualifiedRule();
	while(s.consume()) {
		if(s.token instanceof EOFToken) {
			parseerror(s, "Hit EOF when trying to parse the prelude of a qualified rule.");
			return;
		} else if(s.token instanceof OpenCurlyToken) {
			rule.value = consumeASimpleBlock(s);
			return rule;
		} else if(s.token instanceof SimpleBlock && s.token.name == "{") {
			rule.value = token;
			return rule;
		} else {
			s.reconsume();
			rule.prelude.push(consumeAComponentValue(s));
		}
	}
}

function consumeAListOfDeclarations(s) {
	var decls = [];
	while(s.consume()) {
		if(s.token instanceof WhitespaceToken || s.token instanceof SemicolonToken) {
			donothing();
		} else if(s.token instanceof EOFToken) {
			return decls;
		} else if(s.token instanceof AtKeywordToken) {
			s.reconsume();
			decls.push(consumeAnAtRule(s));
		} else if(s.token instanceof IdentToken) {
			var temp = [token];
			while(!(s.next() instanceof SemicolonToken || s.next() instanceof EOFToken))
				temp.push(consumeAComponentValue(s));
			var decl;
			if(decl = consumeADeclaration(new TokenStream(temp))) decls.push(decl);
		} else {
			parseerror(s);
			reconsume();
			while(!(s.next() instanceof SemicolonToken || s.next() instanceof EOFToken))
				consumeAComponentValue(s);
		}
	}
}

function consumeADeclaration(s) {
	// Assumes that the next input token will be an ident token.
	s.consume();
	var decl = new Declaration(s.token.value);
	while(s.next() instanceof WhitespaceToken) s.consume();
	if(!(s.next() instanceof ColonToken)) {
		parseerror(s);
		return;
	} else {
		s.consume();
	}
	while(!(s.next() instanceof EOFToken)) {
		decl.value.push(consumeAComponentValue(s));
	}
	var foundImportant = false;
	for(var i = decl.value.length - 1; i >= 0; i--) {
		if(decl.value[i] instanceof WhitespaceToken) {
			continue;
		} else if(decl.value[i] instanceof IdentToken && decl.value[i].ASCIIMatch("important")) {
			foundImportant = true;
		} else if(foundImportant && decl.value[i] instanceof DelimToken && decl.value[i].value == "!") {
			decl.value.splice(i, decl.value.length);
			decl.important = true;
			break;
		} else {
			break;
		}
	}
	return decl;
}

function consumeAComponentValue(s) {
	s.consume();
	if(s.token instanceof OpenCurlyToken || s.token instanceof OpenSquareToken || s.token instanceof OpenParenToken)
		return consumeASimpleBlock();
	if(s.token instanceof FunctionToken)
		return consumeAFunction();
	return s.token;
}

function consumeASimpleBlock(s) {
	var mirror = s.token.mirror;
	var block = new SimpleBlock(s.token.value);
	while(s.consume()) {
		if(s.token instanceof EOFToken || (s.token instanceof GroupingToken  && s.token.value == mirror))
			return block;
		else {
			s.reconsume();
			block.value.push(consumeAComponentValue(s));
		}
	}
}

function consumeAFunction(s) {
	var func = new Func(s.token.value);
	while(s.consume()) {
		if(s.token instanceof EOFToken || s.token instanceof CloseParenToken)
			return func;
		else {
			s.reconsume();
			func.value.push(consumeAComponentValue(s));
		}
	}
}

function normalizeInput(input) {
	if(typeof input == "string")
		return new TokenStream(tokenize(input));
	if(input instanceof TokenStream)
		return input;
	if(input.length !== undefined)
		return new TokenStream(input);
	else throw SyntaxError(input);
}

function parseAStylesheet(s) {
	s = normalizeInput(s);
	var sheet = new Stylesheet();
	sheet.value = consumeAListOfRules(s, "top-level");
	return sheet;
}

function parseAListOfRules(s) {
	s = normalizeInput(s);
	return consumeAListOfRules(s);
}

function parseARule(s) {
	s = normalizeInput(s);
	while(s.next() instanceof WhitespaceToken) s.consume();
	if(s.next() instanceof EOFToken) throw SyntaxError();
	if(s.next() instanceof AtKeywordToken) {
		var rule = consumeAnAtRule(s);
	} else {
		var rule = consumeAQualifiedRule(s);
		if(!rule) throw SyntaxError();
	}
	while(s.next() instanceof WhitespaceToken) s.consume();
	if(s.next() instanceof EOFToken)
		return rule;
	throw SyntaxError();
}

function parseADeclaration(s) {
	s = normalizeInput(s);
	while(s.next() instanceof WhitespaceToken) s.consume();
	if(!(s.next() instanceof IdentToken)) throw SyntaxError();
	var decl = consumeADeclaration();
	if(decl)
		return decl
	else
		throw SyntaxError();
}

function parseAListOfDeclarations(s) {
	s = normalizeInput(s);
	return consumeAListOfDeclarations(s);
}

function parseAComponentValue(s) {
	s = normalizeInput(s);
	while(s.next() instanceof WhitespaceToken) s.consume();
	if(s.next() instanceof EOFToken) throw SyntaxError();
	var val = consumeAComponentValue(s);
	if(!val) throw SyntaxError();
	while(s.next() instanceof WhitespaceToken) s.consume();
	if(s.next() instanceof EOFToken)
		return val;
	throw SyntaxError();
}

function parseAListOfComponentValues(s) {
	var vals = [];
	while(true) {
		var val = consumeAComponentValue(s);
		if(val instanceof EOFToken)
			return vals
		else
			vals.push(val);
	}
}

function parseACommaSeparatedListOfComponentValues(s) {
	var listOfCVLs = [];
	while(true) {
		var vals = [];
		while(true) {
			var val = consumeAComponentValue(s);
			if(val instanceof EOFToken) {
				return listOfCVLS;
			} else if(val instanceof CommaToken) {
				listOfCVLS.push(vals);
				break;
			} else {
				vals.push(val);
			}
		}
	}
}


function CSSParserRule() { throw "Abstract Base Class"; }
CSSParserRule.prototype.toString = function(indent) {
	return JSON.stringify(this,null,indent);
}
CSSParserRule.prototype.toJSON = function() {
	return {type:this.type, value:this.value};
}

function Stylesheet() {
	this.value = [];
	return this;
}
Stylesheet.prototype = Object.create(CSSParserRule.prototype);
Stylesheet.prototype.type = "STYLESHEET";

function AtRule(name) {
	this.name = name;
	this.prelude = [];
	this.value = null;
	return this;
}
AtRule.prototype = Object.create(CSSParserRule.prototype);
AtRule.prototype.type = "AT-RULE";
AtRule.prototype.toJSON = function() {
	var json = this.constructor.prototype.constructor.prototype.toJSON.call(this);
	json.name = this.name;
	json.prelude = this.prelude;
	return json;
}

function QualifiedRule() {
	this.prelude = [];
	this.value = [];
	return this;
}
QualifiedRule.prototype = Object.create(CSSParserRule.prototype);
QualifiedRule.prototype.type = "QUALIFIED-RULE";
QualifiedRule.prototype.toJSON = function() {
	var json = this.constructor.prototype.constructor.prototype.toJSON.call(this);
	json.prelude = this.prelude;
	return json;
}

function Declaration(name) {
	this.name = name;
	this.value = [];
	this.important = false;
	return this;
}
Declaration.prototype = Object.create(CSSParserRule.prototype);
Declaration.prototype.type = "DECLARATION";

function SimpleBlock(type) {
	this.name = type;
	this.value = [];
	return this;
}
SimpleBlock.prototype = Object.create(CSSParserRule.prototype);
SimpleBlock.prototype.type = "BLOCK";
SimpleBlock.prototype.toJSON = function() {
	var json = this.constructor.prototype.constructor.prototype.toJSON.call(this);
	json.name = this.name;
	return json;
}

function Func(name) {
	this.name = name;
	this.value = [];
	return this;
}
Func.prototype = Object.create(CSSParserRule.prototype);
Func.prototype.type = "FUNCTION";
Func.prototype.toJSON = function() {
	var json = this.constructor.prototype.constructor.prototype.toJSON.call(this);
	json.name = this.name;
	return json;
}

// Exportation.
exports.CSSParserRule = CSSParserRule;
exports.Stylesheet = Stylesheet;
exports.AtRule = AtRule;
exports.QualifiedRule = QualifiedRule;
exports.Declaration = Declaration;
exports.SimpleBlock = SimpleBlock;
exports.Func = Func;
exports.parseAStylesheet = parseAStylesheet;
exports.parseAListOfRules = parseAListOfRules;
exports.parseARule = parseARule;
exports.parseADeclaration = parseADeclaration;
exports.parseAListOfDeclarations = parseAListOfDeclarations;
exports.parseAComponentValue = parseAComponentValue;
exports.parseAListOfComponentValues = parseAListOfComponentValues;
exports.parseACommaSeparatedListOfComponentValues = parseACommaSeparatedListOfComponentValues;

}));

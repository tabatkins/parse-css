function parse(tokens) {
	var mode = 'top-level';
	var i = -1;
	var token;

	var stylesheet = new Stylesheet;
	var stack = [stylesheet];
	var rule = stack[0];
	var decl;

	var consume = function(advance) {
		if(advance === undefined) advance = 1;
		i += advance;
		if(i < tokens.length)
			token = tokens[i];
		else
			token = new EOFToken;
		return true;
	};
	var reprocess = function() {
		i--;
		return true;
	}
	var next = function() {
		return tokens[i+1];
	};
	var switchto = function(newmode) {
		if(newmode === undefined) {
			if(rule.ruleType == 'SELECTOR-RULE' || (rule.ruleType == 'AT-RULE' && rule.fillType == 'decl'))
				mode = 'declaration';
			else if(rule.ruleType == 'AT-RULE' && rule.fillType == 'rule')
				mode = 'rule';
			else if(rule.ruleType == 'STYLESHEET')
				mode = 'top-level'
			else { console.log("Unknown rule-type while switching to current rule's content mode: ",rule); mode = ''; }
		} else {
			mode = newmode;
		}
		return true;
	}
	var create = function(newRule) {
		rule = newRule;
		stack.push(rule);
		return true;
	}
	var createdecl = function(name) {
		decl = new Declaration(name);
		return true;
	}
	var discarddecl = function() {
		decl = undefined;
		return true;
	}
	var parseerror = function() {
		console.log("Parse error at token " + i + ": " + token);
		return true;
	}
	var pop = function() {
		var oldrule = stack.pop();
		rule = stack[stack.length - 1];
		rule.append(oldrule);
		return true;
	}
	var finish = function() {
		while(stack.length > 1) {
			pop();
		}
	}

	for(;;) {
		consume();

		if(token.tokenType == 'EOF') {
			finish();
			return stylesheet;
		}

		switch(mode) {
		case "top-level":
			switch(token.tokenType) {
			case "CDO":
			case "CDC":
			case "WHITESPACE": break;
			case "AT-KEYWORD": create(new AtRule(token.value)) && switchto('at-rule'); break;
			case "{": parseerror() && consumeASimpleBlock(token); break;
			default: create(new SelectorRule) && switchto('selector') && reprocess();
			}
			break;

		case "at-rule":
			switch(token.tokenType) {
			case ";": pop() && switchto(); break;
			case "{":
				if(rule.fillType == 'rule') switchto('rule');
				else if(rule.fillType == 'decl') switchto('declaration');
				else parseerror() && switchto('next-block') && reprocess();
				break;
			case "[":
			case "(": rule.appendPrelude(consumeASimpleBlock(token)); break;
			case "FUNCTION": rule.appendPrelude(consumeAFunction(token)); break;
			default: rule.appendPrelude(token);
			}
			break;

		case "rule":
			switch(token.tokenType) {
			case "BADSTRING":
			case "BADURL": parseerror() && switchto('next-block'); break;
			case "}": pop() && switchto(); break;
			case "AT-KEYWORD": create(new AtRule(token.value)) && switchto('at-rule'); break;
			default: create(new SelectorRule) && switchto('selector') && reprocess();
			}
			break;

		case "selector":
			switch(token.tokenType) {
			case "{": switchto('declaration'); break;
			case "[":
			case "(": rule.appendSelector(consumeASimpleBlock(token)); break;
			case "FUNCTION": rule.appendSelector(consumeAFunction(token)); break;
			default: rule.appendSelector(token); 
			}
			break;

		case "declaration":
			switch(token.tokenType) {
			case "WHITESPACE":
			case ";": break;
			case "}": pop() && switchto(); break;
			case "AT-RULE": create(new AtRule(token.value)) && switchto('at-rule'); break;
			case "IDENT": createdecl(token.value) && switchto('after-declaration-name'); break;
			default: parseerror() && switchto('next-declaration');
			}
			break;

		case "after-declaration-name":
			switch(token.tokenType) {
			case "WHITESPACE": break;
			case ":": switchto('declaration-value'); break;
			case ";": parseerror() && discarddecl() && switchto(); break;
			default: parseerror() && discarddecl() && switchto('next-declaration');
			}
			break;

		case "declaration-value":
			switch(token.tokenType) {
			case "{":
			case "[":
			case "(": decl.append(consumeASimpleBlock(token)); break;
			case "FUNCTION": decl.append(consumeAFunction(token)); break;
			case "DELIM":
				if(token.value == "!" && next().tokenType == 'IDENTIFIER' && next().value.toLowerCase() == "important") {
					consume();
					decl.important = true;
					switchto('declaration-end');
				} else {
					decl.append(token);
				}
				break;
			case ";": rule.append(decl) && discarddecl() && switchto(); break;
			case "}": rule.append(decl) && discarddecl() && pop() && switchto(); break;
			default: decl.append(token);
			}
			break;

		case "declaration-end":
			switch(token.tokenType) {
			case "WHITESPACE": break;
			case ";": rule.append(decl) && discarddecl() && switchto(); break;
			case "}": rule.append(decl) && discarddecl() && pop() && switchto(); break;
			default: parseerror() && discarddecl() && switchto('next-declaration');
			}
			break;

		case "next-block":
			switch(token.tokenType) {
			case "{": consumeASimpleBlock(token) && switchto(); break;
			case "[":
			case "(": consumeASimpleBlock(token); break;
			case "FUNCTION": consumeAFunction(token); break;
			default: break;
			}
			break;

		case "next-declaration":
			switch(token.tokenType) {
			case ";": switchto('declaration'); break;
			case "}": switchto('declaration') && reprocess(); break;
			case "{":
			case "[":
			case "(": consumeASimpleBlock(token); break;
			case "FUNCTION": consumeAFunction(token); break;
			default: break;
			}
			break;

		default:
			console.log('Unknown parsing mode: ' + mode);
		}
	}

	function consumeASimpleBlock(startToken) {
		var endingTokenType = {"(":")", "[":"]", "{":"}"}[startToken.tokenType];
		var block = new SimpleBlock(startToken.tokenType);

		for(;;) {
			consume();
			switch(token.tokenType) {
			case "EOF":
			case endingTokenType: return block;
			case "{":
			case "[":
			case "(": block.append(consumeASimpleBlock(token)); break;
			case "FUNCTION": block.append(consumeAFunction(token)); break;
			default: block.append(token);
			}
		}
	}

	function consumeAFunction(startToken) {
		var func = new Function(startToken.value);
		var arg = new FunctionArg();

		for(;;) {
			consume();
			switch(token.tokenType) {
			case "EOF":
			case ")": func.append(arg); return func;
			case "DELIM":
				if(token.value == ",") {
					func.append(arg);
					arg = new FunctionArg();
				} else {
					arg.append(token);
				}
				break;
			case "{":
			case "[":
			case "(": arg.append(consumeASimpleBlock(token)); break;
			case "FUNCTION": arg.append(consumeAFunction(token)); break;
			default: arg.append(token);
			}
		}
	}
}

function CSSParserRule() { return this; }
CSSParserRule.prototype.toString = function(indent) {
	return JSON.stringify(this.toJSON(),null,indent);
}
CSSParserRule.prototype.append = function(val) {
	this.value.push(val);
	return this;
}

function Stylesheet() {
	this.value = [];
	return this;
}
Stylesheet.prototype = new CSSParserRule;
Stylesheet.prototype.ruleType = "STYLESHEET";
Stylesheet.prototype.toJSON = function() {
	return {type:'stylesheet', value: this.value.map(function(e){return e.toJSON();})};
}

function AtRule(name) {
	this.name = name;
	this.prelude = [];
	this.value = [];
	if(name in AtRule.registry)
		this.fillType = AtRule.registry[name];
	else 
		this.fillType = '';
	return this;
}
AtRule.prototype = new CSSParserRule;
AtRule.prototype.ruleType = "AT-RULE";
AtRule.prototype.appendPrelude = function(val) {
	this.prelude.push(val);
	return this;
}
AtRule.prototype.toJSON = function() {
	return {type:'at', name:this.name, prelude:this.prelude.map(function(e){return e.toJSON();}), value:this.value.map(function(e){return e.toJSON();})};
}
AtRule.registry = {
	'import': '',
	'media': 'rule',
	'font-face': 'decl',
	'page': 'decl',
	'keyframes': 'rule',
	'namespace': '',
	'counter-style': 'decl',
	'supports': 'rule',
	'document': 'rule',
	'font-feature-values': 'decl',
	'viewport': '',
	'region-style': 'rule'
};

function SelectorRule() {
	this.selector = [];
	this.value = [];
	return this;
}
SelectorRule.prototype = new CSSParserRule;
SelectorRule.prototype.ruleType = "SELECTOR-RULE";
SelectorRule.prototype.appendSelector = function(val) {
	this.selector.push(val);
	return this;
}
SelectorRule.prototype.toJSON = function() {
	return {type:'selector', selector:this.selector.map(function(e){return e.toJSON();}), value:this.value.map(function(e){return e.toJSON();})};
}

function Declaration(name) {
	this.name = name;
	this.value = [];
	return this;
}
Declaration.prototype = new CSSParserRule;
Declaration.prototype.ruleType = "DECLARATION";
Declaration.prototype.toJSON = function() {
	return {type:'decl', name:this.name, value:this.value.map(function(e){return e.toJSON();})};
}

function SimpleBlock(type) {
	this.type = type;
	this.value = [];
	return this;
}
SimpleBlock.prototype = new CSSParserRule;
SimpleBlock.prototype.ruleType = "BLOCK";
SimpleBlock.prototype.toJSON = function() {
	return {type:'block', type:this.type, value:this.value.map(function(e){return e.toJSON();})};
}

function Function(name) {
	this.name = name;
	this.value = [];
	return this;
}
Function.prototype = new CSSParserRule;
Function.prototype.ruleType = "FUNCTION";
FunctionArg.prototype.toJSON = function() {
	return {type:'func', name:this.name, value:this.value.map(function(e){return e.toJSON();})};
}

function FunctionArg() {
	this.value = [];
	return this;
}
FunctionArg.prototype = new CSSParserRule;
FunctionArg.prototype.ruleType = "FUNCTION-ARG";
FunctionArg.prototype.toJSON = function() {
	return this.value.map(function(e){return e.toJSON();});
}

// Make this usable from NodeJS
// TODO: also export the various rule objects?
if (typeof(exports) != 'undefined') {
    exports.parse = parse;
}

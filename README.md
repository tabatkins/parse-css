Standards-Based CSS Parser
==========================

This project implements a standards-based CSS Parser.
I'm writing the CSS Syntax spec <http://dev.w3.org/csswg/css-syntax/>,
and need an implementation of it for testing purposes.

This parser is *not* designed to be fast,
but users tell me it's actually rather speedy.
(I suppose it's faster than running a ton of regexes over a bunch of text!)
Its structure and coding style are instead meant to be very close to the spec,
so that it's easy to verify that the code matches the spec
(and vice versa)
and to make it easy,
when the spec changes,
to make the same change in the parser.

It is intended to fully and completely match browser behavior
(at least, as much as the final spec does).

There's a [dingus](https://rawgit.com/tabatkins/parse-css/master/example.html) for testing it out,
or just quickly checking what some CSS parses into.

Using the Library
-----------------

Include `parse-css.js` in your page.
Then just call the desired parsing function,
named after the algorithms in the spec:
`parseAStylesheet()`, etc.
You can pass a string
or a list of tokens
(such as what's produced by the `tokenize()` function).
It'll return an appropriate object,
as specified by the parsing function.

If you want to get access to the tokens directly,
call `tokenize()` with a string;
it'll return a list of tokens.

Note that the Syntax spec,
and thus this parser,
is *extremely generic*.
It doesn't have any specific knowledge of CSS rules,
just the core syntax,
so it won't throw out invalid or unknown things,
and it can't even actually parse the contents of blocks
(because it doesn't know if they'll contain rules or declarations,
and those are ambiguous without any context).
I plan to add some functions that add more CSS knowledge
(in an extensible way, so it'll retain anything custom that you want to handle yourself),
but for now you have to do all the verification and additional parsing yourself.

Parsing Functions
-----------------

Here's the full list of parsing functions.
They do exactly what they say in their name,
because they're named exactly the same as the corresponding section of the Syntax spec:

* `parseAStylesheet()`
* `parseAListOfRules()`
* `parseARule()`
* `parseADeclaration()`
* `parseAListOfDeclarations()`
* `parseAComponentValue()`
* `parseAListOfComponentValues()`
* `parseACommaSeparatedListOfComponentValues()`

Canonicalizing Against A Grammar
--------------------------------

By default, the parser can only do so much;
it knows how to interpret the top-level rules in a stylesheet,
but not how to interpret the contents of anything below that.
This means that anything nested within a top-level block is left as a bare token stream,
requiring you to call the correct parsing function on it.

The `canonicalize()` function takes a parsing result and a grammar
and transforms the result accordingly,
rendering the result into an easier-to-digest form.

A grammar is an object with one of the following four forms:

1. ```
	{"stylesheet":true}
	```

2. ```
	{
		"qualified": <grammar>,
		"@foo": <grammar>,
		"unknown": <function>
	}
	```

3. ```
	{
		"declarations": true,
		"@foo": <grammar>
		"unknown": <function>
	}
	```

4. `null`

A `stylesheet` block contains nothing else;
it just means that this rule uses the top-level grammar for its contents.
This is true, for example, of the `@media` rule.

A `qualified` block means that the rule's contents are qualified rules (style rules) and at-rules.
The "qualified" key must have another grammar as its value (often `{declarations:true}`).
Any at-rules that are valid in this context must be listed,
also with a grammar for their contents.
Optionally, the "unknown" key can be provided with a function value;
this will be called with any unknown at-rules (ones not listed in the grammar)/
If it returns a truthy value, it's inserted into the structure with everything else;
if falsey, the rule is put into the "errors" entry of the resulting block for later processing or ignoring.

A `declarations` block means that the rule's contents are declarations and at-rules.
Currently, the "declarations" key only accepts the value `true`;
eventually it'll allow you to specify what declarations are valid.
Similar to `qualified` blocks,
you must list what at-rules are allowed,
and can provide an "unknown" function.

A `null` just means that the block has no contents.
This is used for at-rules that are statements,
ended with a semicolon rather than a block,
like `@import`.

A `CSSGrammar` object is provided with a default grammar for CSS.
If you call `canonicalize()` without a grammar,
this is used automatically.

Node Integration
----------------

`parse-css.js` uses the UMD module pattern,
exporting the parser functions, the `tokenize()` function,
and all of the classes used by the parser and tokenizer.

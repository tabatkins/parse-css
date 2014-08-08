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

Node Integration
----------------

`parse-css.js` uses the UMD module pattern,
exporting the parser functions, the `tokenize()` function,
and all of the classes used by the parser and tokenizer.

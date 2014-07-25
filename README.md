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

Include both tokenizer.js and parser.js in your page;
they're separated for organizational purposes.

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

Node Integration
----------------

Simon Sapin added some CommonJS export statements to the bottom of tokenizer.js and parser.js
exporting the tokenize and parse functions,
so as far as I know it will Just Work(tm).
I have no idea how to fix it if anything goes wrong, though.

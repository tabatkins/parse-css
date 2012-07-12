Standards-Based CSS Parser
==========================

This project implements a standards-based CSS Parser.
I'm writing the CSS Syntax spec <http://dev.w3.org/csswg/css3-syntax>,
and need an implementation of it for testing purposes.

This parser is *not* designed to be fast.
Its structure and coding style are instead meant to be very close to the spec,
so that it's easy to verify that the code matches the spec
(and vice versa)
and to make it easy,
when the spec changes,
to make the same change in the parser.

However, it may still be useful to someone in production,
as it is intended to fully and completely match browser behavior
(at least, as much as the final spec does).

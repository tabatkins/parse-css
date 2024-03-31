"use strict";
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    require(
      ['./parse-css', 'ansidiff'],
      factory,
    );
  } else if (typeof exports !== 'undefined') {
    factory(
      require('./parse-css'),
      require('ansidiff'),
    );
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    factory(
      global,
      {lines: global.diffString, words: global.diffString},
      global.log,
    );
  }
}(this, function (parseCss, ansidiff, log) {

var TESTS = [
  // preprocess()
  {
    parser: "",
    css: `\u{20000},\u{0},\uD800,\uDFFF`,
    expected: [
      {type: "IDENT", value: "\u{20000}"},
      {type: "COMMA"},
      {type: "IDENT", value: "\uFFFD"},
      {type: "COMMA"},
      {type: "IDENT", value: "\uFFFD"},
      {type: "COMMA"},
      {type: "IDENT", value: "\uFFFD"},
    ]
  },

  // tokenize()

  // -- SingleCharacterTokens
  {
    parser: "",
    css: "(",
    expected: [{type: "OPEN-PAREN"}],
  },
  {
    parser: "",
    css: ")",
    expected: [{type: "CLOSE-PAREN"}],
  },
  {
    parser: "",
    css: "[",
    expected: [{type: "OPEN-SQUARE"}],
  },
  {
    parser: "",
    css: "]",
    expected: [{type: "CLOSE-SQUARE"}],
  },
  {
    parser: "",
    css: ",",
    expected: [{type: "COMMA"}],
  },
  {
    parser: "",
    css: ":",
    expected: [{type: "COLON"}],
  },
  {
    parser: "",
    css: ";",
    expected: [{type: "SEMICOLON"}],
  },
  {
    parser: "",
    css: ")[",
    expected: [{type: "CLOSE-PAREN"}, {type: "OPEN-SQUARE"}],
  },
  {
    parser: "",
    css: "[)",
    expected: [{type: "OPEN-SQUARE"}, {type: "CLOSE-PAREN"}],
  },
  {
    parser: "",
    css: "{}",
    expected: [{type: "OPEN-CURLY"}, {type: "CLOSE-CURLY"}],
  },
  {
    parser: "",
    css: ",,",
    expected: [{type: "COMMA"}, {type: "COMMA"}],
  },

  // -- MultipleCharacterTokens
  {
    parser: "",
    css: "~=",
    expected: [{type: "DELIM", value: '~'}, {type: "DELIM", value: '='}],
  },
  {
    parser: "",
    css: "|=",
    expected: [{type: "DELIM", value: '|'}, {type: "DELIM", value: '='}],
  },
  {
    parser: "",
    css: "^=",
    expected: [{type: "DELIM", value: '^'}, {type: "DELIM", value: '='}],
  },
  {
    parser: "",
    css: "$=",
    expected: [{type: "DELIM", value: '$'}, {type: "DELIM", value: '='}],
  },
  {
    parser: "",
    css: "*=",
    expected: [{type: "DELIM", value: '*'}, {type: "DELIM", value: '='}],
  },
  {
    parser: "",
    css: "||",
    expected: [{type: "DELIM", value: '|'}, {type: "DELIM", value: '|'}],
  },
  {
    parser: "",
    css: "|||",
    expected: [{type: "DELIM", value: '|'}, {type: "DELIM", value: '|'}, {type: "DELIM", value: '|'}],
  },
  {
    parser: "",
    css: "<!--",
    expected: [{type: "CDO"}],
  },
  {
    parser: "",
    css: "<!---",
    expected: [{type: "CDO"}, {type: "DELIM", value: '-'}],
  },
  {
    parser: "",
    css: "-->",
    expected: [{type: "CDC"}],
  },

  // -- DelimiterToken
  {
    parser: "",
    css: "^",
    expected: [{type: "DELIM", value: '^'}],
  },
  {
    parser: "",
    css: "*",
    expected: [{type: "DELIM", value: '*'}],
  },
  {
    parser: "",
    css: "%",
    expected: [{type: "DELIM", value: '%'}],
  },
  {
    parser: "",
    css: "~",
    expected: [{type: "DELIM", value: '~'}],
  },
  {
    parser: "",
    css: "&",
    expected: [{type: "DELIM", value: '&'}],
  },
  {
    parser: "",
    css: "|",
    expected: [{type: "DELIM", value: '|'}],
  },
  {
    parser: "",
    css: "\x7f",
    expected: [{type: "DELIM", value: '\x7f'}],
  },
  {
    parser: "",
    css: "\x01",
    expected: [{type: "DELIM", value: '\x01'}],
  },
  {
    parser: "",
    css: "~-",
    expected: [{type: "DELIM", value: '~'}, {type: "DELIM", value: '-'}],
  },
  {
    parser: "",
    css: "^|",
    expected: [{type: "DELIM", value: '^'}, {type: "DELIM", value: '|'}],
  },
  {
    parser: "",
    css: "$~",
    expected: [{type: "DELIM", value: '$'}, {type: "DELIM", value: '~'}],
  },
  {
    parser: "",
    css: "*^",
    expected: [{type: "DELIM", value: '*'}, {type: "DELIM", value: '^'}],
  },

  // -- WhitespaceTokens
  {
    parser: "",
    css: "   ",
    expected: [{type: "WHITESPACE"}],
  },
  {
    parser: "",
    css: "\n\rS",
    expected: [{type: "WHITESPACE"}, {type: "IDENT", value: "S"}],
  },
  {
    parser: "",
    css: "   *",
    expected: [{type: "WHITESPACE"}, {type: "DELIM", value: '*'}],
  },
  {
    parser: "",
    css: "\r\n\f\t2",
    expected: [{type: "WHITESPACE"}, {type: "NUMBER", value: 2, isInteger: true}],
  },

  // -- Escapes
  {
    parser: "",
    css: "hel\\6Co",
    expected: [{type: "IDENT", value: "hello"}],
  },
  {
    parser: "",
    css: "\\26 B",
    expected: [{type: "IDENT", value: "&B"}],
  },
  {
    parser: "",
    css: "'hel\\6c o'",
    expected: [{type: "STRING", value: "hello"}],
  },
  {
    parser: "",
    css: "'spac\\65\r\ns'",
    expected: [{type: "STRING", value: "spaces"}],
  },
  {
    parser: "",
    css: "spac\\65\r\ns",
    expected: [{type: "IDENT", value: "spaces"}],
  },
  {
    parser: "",
    css: "spac\\65\n\rs",
    expected: [{type: "IDENT", value: "space"}, {type: "WHITESPACE"}, {type: "IDENT", value: "s"}],
  },
  {
    parser: "",
    css: "sp\\61\tc\\65\fs",
    expected: [{type: "IDENT", value: "spaces"}],
  },
  {
    parser: "",
    css: "hel\\6c  o",
    expected: [{type: "IDENT", value: "hell"}, {type: "WHITESPACE"}, {type: "IDENT", value: "o"}],
  },
  {
    parser: "",
    css: "test\\\n",
    expected: [{type: "IDENT", value: "test"}, {type: "DELIM", value: '\\'}, {type: "WHITESPACE"}],
  },
  {
    parser: "",
    css: "test\\D799",
    expected: [{type: "IDENT", value: "test\uD799"}],
  },
  {
    parser: "",
    css: "\\E000",
    expected: [{type: "IDENT", value: "\uE000"}],
  },
  {
    parser: "",
    css: "te\\s\\t",
    expected: [{type: "IDENT", value: "test"}],
  },
  {
    parser: "",
    css: "spaces\\ in\\\tident",
    expected: [{type: "IDENT", value: "spaces in\tident"}],
  },
  {
    parser: "",
    css: "\\.\\,\\:\\!",
    expected: [{type: "IDENT", value: ".,:!"}],
  },
  {
    parser: "",
    css: "\\\r",
    expected: [{type: "DELIM", value: '\\'}, {type: "WHITESPACE"}],
  },
  {
    parser: "",
    css: "\\\f",
    expected: [{type: "DELIM", value: '\\'}, {type: "WHITESPACE"}],
  },
  {
    parser: "",
    css: "\\\r\n",
    expected: [{type: "DELIM", value: '\\'}, {type: "WHITESPACE"}],
  },
  {
    parser: "",
    css: "null\\\0",
    expected: [{type: "IDENT", value: "null\uFFFD"}],
  },
  {
    parser: "",
    css: "null\\\0\0",
    expected: [{type: "IDENT", value: "null\uFFFD\uFFFD"}],
  },
  {
    parser: "",
    css: "null\\0",
    expected: [{type: "IDENT", value: "null\uFFFD"}],
  },
  {
    parser: "",
    css: "null\\0",
    expected: [{type: "IDENT", value: "null\uFFFD"}],
  },
  {
    parser: "",
    css: "null\\0000",
    expected: [{type: "IDENT", value: "null\uFFFD"}],
  },
  {
    parser: "",
    css: "large\\110000",
    expected: [{type: "IDENT", value: "large\uFFFD"}],
  },
  {
    parser: "",
    css: "large\\23456a",
    expected: [{type: "IDENT", value: "large\uFFFD"}],
  },
  {
    parser: "",
    css: "surrogate\\D800",
    expected: [{type: "IDENT", value: "surrogate\uFFFD"}],
  },
  {
    parser: "",
    css: "surrogate\\0DABC",
    expected: [{type: "IDENT", value: "surrogate\uFFFD"}],
  },
  {
    parser: "",
    css: "\\00DFFFsurrogate",
    expected: [{type: "IDENT", value: "\uFFFDsurrogate"}],
  },
  {
    parser: "",
    css: "\\10fFfF",
    expected: [{type: "IDENT", value: "\u{10ffff}"}],
  },
  {
    parser: "",
    css: "\\10fFfF0",
    expected: [{type: "IDENT", value: "\u{10ffff}0"}],
  },
  {
    parser: "",
    css: "\\10000000",
    expected: [{type: "IDENT", value: "\u{100000}00"}],
  },
  {
    parser: "",
    css: "eof\\",
    expected: [{type: "IDENT", value: "eof\uFFFD"}],
  },

  // -- IdentToken
  {
    parser: "",
    css: "simple-ident",
    expected: [{type: "IDENT", value: "simple-ident"}],
  },
  {
    parser: "",
    css: "testing123",
    expected: [{type: "IDENT", value: "testing123"}],
  },
  {
    parser: "",
    css: "hello!",
    expected: [{type: "IDENT", value: "hello"}, {type: "DELIM", value: '!'}],
  },
  {
    parser: "",
    css: "world\x05",
    expected: [{type: "IDENT", value: "world"}, {type: "DELIM", value: '\x05'}],
  },
  {
    parser: "",
    css: "_under score",
    expected: [{type: "IDENT", value: "_under"}, {type: "WHITESPACE"}, {type: "IDENT", value: "score"}],
  },
  {
    parser: "",
    css: "-_underscore",
    expected: [{type: "IDENT", value: "-_underscore"}],
  },
  {
    parser: "",
    css: "-text",
    expected: [{type: "IDENT", value: "-text"}],
  },
  {
    parser: "",
    css: "-\\6d",
    expected: [{type: "IDENT", value: "-m"}],
  },
  {
    parser: "",
    css: "--abc",
    expected: [{type: "IDENT", value: "--abc"}],
  },
  {
    parser: "",
    css: "--",
    expected: [{type: "IDENT", value: "--"}],
  },
  {
    parser: "",
    css: "--11",
    expected: [{type: "IDENT", value: "--11"}],
  },
  {
    parser: "",
    css: "---",
    expected: [{type: "IDENT", value: "---"}],
  },
  {
    parser: "",
    css: "\u2003",  // em-space
    expected: [{type: "IDENT", value: "\u2003"}],
  },
  {
    parser: "",
    css: "\u{A0}",  // non-breaking space
    expected: [{type: "IDENT", value: "\u{A0}"}],
  },
  {
    parser: "",
    css: "\u1234",
    expected: [{type: "IDENT", value: "\u1234"}],
  },
  {
    parser: "",
    css: "\u{12345}",
    expected: [{type: "IDENT", value: "\u{12345}"}],
  },
  {
    parser: "",
    css: "\0",
    expected: [{type: "IDENT", value: "\uFFFD"}],
  },
  {
    parser: "",
    css: "ab\0c",
    expected: [{type: "IDENT", value: "ab\uFFFDc"}],
  },
  {
    parser: "",
    css: "ab\0c",
    expected: [{type: "IDENT", value: "ab\uFFFDc"}],
  },

  // -- FunctionToken
  {
    parser: "",
    css: "scale(2)",
    expected: [{type: "FUNCTION", value: "scale"}, {type: "NUMBER", value: 2, isInteger: true}, {type: "CLOSE-PAREN"}],
  },
  {
    parser: "",
    css: "foo-bar\\ baz(",
    expected: [{type: "FUNCTION", value: "foo-bar baz"}],
  },
  {
    parser: "",
    css: "fun\\(ction(",
    expected: [{type: "FUNCTION", value: "fun(ction"}],
  },
  {
    parser: "",
    css: "-foo(",
    expected: [{type: "FUNCTION", value: "-foo"}],
  },
  {
    parser: "",
    css: "url(\"foo.gif\"",
    expected: [{type: "FUNCTION", value: "url"}, {type: "STRING", value: "foo.gif"}],
  },
  {
    parser: "",
    css: "foo(  \'bar.gif\'",
    expected: [{type: "FUNCTION", value: "foo"}, {type: "WHITESPACE"}, {type: "STRING", value: "bar.gif"}],
  },
  {
    parser: "",
    css: "url(  \'bar.gif\'",
    expected: [{type: "FUNCTION", value: "url"}, {type: "STRING", value: "bar.gif"}],
  },

  // -- AtKeywordToken
  {
    parser: "",
    css: "@at-keyword",
    expected: [{type: "AT-KEYWORD", value: "at-keyword"}],
  },
  {
    parser: "",
    css: "@testing123",
    expected: [{type: "AT-KEYWORD", value: "testing123"}],
  },
  {
    parser: "",
    css: "@hello!",
    expected: [{type: "AT-KEYWORD", value: "hello"}, {type: "DELIM", value: '!'}],
  },
  {
    parser: "",
    css: "@-text",
    expected: [{type: "AT-KEYWORD", value: "-text"}],
  },
  {
    parser: "",
    css: "@--abc",
    expected: [{type: "AT-KEYWORD", value: "--abc"}],
  },
  {
    parser: "",
    css: "@--",
    expected: [{type: "AT-KEYWORD", value: "--"}],
  },
  {
    parser: "",
    css: "@--11",
    expected: [{type: "AT-KEYWORD", value: "--11"}],
  },
  {
    parser: "",
    css: "@---",
    expected: [{type: "AT-KEYWORD", value: "---"}],
  },
  {
    parser: "",
    css: "@\\ ",
    expected: [{type: "AT-KEYWORD", value: " "}],
  },
  {
    parser: "",
    css: "@-\\ ",
    expected: [{type: "AT-KEYWORD", value: "- "}],
  },
  {
    parser: "",
    css: "@@",
    expected: [{type: "DELIM", value: '@'}, {type: "DELIM", value: '@'}],
  },
  {
    parser: "",
    css: "@2",
    expected: [{type: "DELIM", value: '@'}, {type: "NUMBER", value: 2, isInteger: true}],
  },
  {
    parser: "",
    css: "@-1",
    expected: [{type: "DELIM", value: '@'}, {type: "NUMBER", value: -1, isInteger: true, sign: "-"}],
  },

  // -- UrlToken
  {
    parser: "",
    css: "url(foo.gif)",
    expected: [{type: "URL", value: "foo.gif"}],
  },
  {
    parser: "",
    css: "urL(https://example.com/cats.png)",
    expected: [{type: "URL", value: "https://example.com/cats.png"}],
  },
  {
    parser: "",
    css: "uRl(what-a.crazy^URL~this\\ is!)",
    expected: [{type: "URL", value: "what-a.crazy^URL~this is!"}],
  },
  {
    parser: "",
    css: "uRL(123#test)",
    expected: [{type: "URL", value: "123#test"}],
  },
  {
    parser: "",
    css: "Url(escapes\\ \\\"\\'\\)\\()",
    expected: [{type: "URL", value: "escapes \"')("}],
  },
  {
    parser: "",
    css: "UrL(   whitespace   )",
    expected: [{type: "URL", value: "whitespace"}],
  },
  {
    parser: "",
    css: "URl( whitespace-eof ",
    expected: [{type: "URL", value: "whitespace-eof"}],
  },
  {
    parser: "",
    css: "URL(eof",
    expected: [{type: "URL", value: "eof"}],
  },
  {
    parser: "",
    css: "url(not/*a*/comment)",
    expected: [{type: "URL", value: "not/*a*/comment"}],
  },
  {
    parser: "",
    css: "urL()",
    expected: [{type: "URL", value: ""}],
  },
  {
    parser: "",
    css: "uRl(white space),",
    expected: [{type: "BADURL"}, {type: "COMMA"}],
  },
  {
    parser: "",
    css: "Url(b(ad),",
    expected: [{type: "BADURL"}, {type: "COMMA"}],
  },
  {
    parser: "",
    css: "uRl(ba'd):",
    expected: [{type: "BADURL"}, {type: "COLON"}],
  },
  {
    parser: "",
    css: "urL(b\"ad):",
    expected: [{type: "BADURL"}, {type: "COLON"}],
  },
  {
    parser: "",
    css: "uRl(b\"ad):",
    expected: [{type: "BADURL"}, {type: "COLON"}],
  },
  {
    parser: "",
    css: "Url(b\\\rad):",
    expected: [{type: "BADURL"}, {type: "COLON"}],
  },
  {
    parser: "",
    css: "url(b\\\nad):",
    expected: [{type: "BADURL"}, {type: "COLON"}],
  },
  {
    parser: "",
    css: "url(/*'bad')*/",
    expected: [{type: "BADURL"}, {type: "DELIM", value: '*'}, {type: "DELIM", value: '/'}],
  },
  {
    parser: "",
    css: "url(ba'd\\\\))",
    expected: [{type: "BADURL"}, {type: "CLOSE-PAREN"}],
  },

  // -- StringToken
  {
    parser: "",
    css: "'text'",
    expected: [{type: "STRING", value: "text"}],
  },
  {
    parser: "",
    css: "\"text\"",
    expected: [{type: "STRING", value: "text"}],
  },
  {
    parser: "",
    css: "'testing, 123!'",
    expected: [{type: "STRING", value: "testing, 123!"}],
  },
  {
    parser: "",
    css: "'es\\'ca\\\"pe'",
    expected: [{type: "STRING", value: "es'ca\"pe"}],
  },
  {
    parser: "",
    css: "'\"quotes\"'",
    expected: [{type: "STRING", value: "\"quotes\""}],
  },
  {
    parser: "",
    css: "\"'quotes'\"",
    expected: [{type: "STRING", value: "'quotes'"}],
  },
  {
    parser: "",
    css: "\"mismatch'",
    expected: [{type: "STRING", value: "mismatch'"}],
  },
  {
    parser: "",
    css: "'text\x05\t\x13'",
    expected: [{type: "STRING", value: "text\x05\t\x13"}],
  },
  {
    parser: "",
    css: "\"end on eof",
    expected: [{type: "STRING", value: "end on eof"}],
  },
  {
    parser: "",
    css: "'esca\\\nped'",
    expected: [{type: "STRING", value: "escaped"}],
  },
  {
    parser: "",
    css: "\"esc\\\faped\"",
    expected: [{type: "STRING", value: "escaped"}],
  },
  {
    parser: "",
    css: "'new\\\rline'",
    expected: [{type: "STRING", value: "newline"}],
  },
  {
    parser: "",
    css: "\"new\\\r\nline\"",
    expected: [{type: "STRING", value: "newline"}],
  },
  {
    parser: "",
    css: "'bad\nstring",
    expected: [{type: "BADSTRING"}, {type: "WHITESPACE"}, {type: "IDENT", value: "string"}],
  },
  {
    parser: "",
    css: "'bad\rstring",
    expected: [{type: "BADSTRING"}, {type: "WHITESPACE"}, {type: "IDENT", value: "string"}],
  },
  {
    parser: "",
    css: "'bad\r\nstring",
    expected: [{type: "BADSTRING"}, {type: "WHITESPACE"}, {type: "IDENT", value: "string"}],
  },
  {
    parser: "",
    css: "'bad\fstring",
    expected: [{type: "BADSTRING"}, {type: "WHITESPACE"}, {type: "IDENT", value: "string"}],
  },
  {
    parser: "",
    css: "'\0'",
    expected: [{type: "STRING", value: "\uFFFD"}],
  },
  {
    parser: "",
    css: "'hel\0lo'",
    expected: [{type: "STRING", value: "hel\uFFFDlo"}],
  },
  {
    parser: "",
    css: "'h\\65l\0lo'",
    expected: [{type: "STRING", value: "hel\uFFFDlo"}],
  },

  // -- HashToken
  {
    parser: "",
    css: "#id-selector",
    expected: [{type: "HASH", value: "id-selector", isIdent: true}],
  },
  {
    parser: "",
    css: "#FF7700",
    expected: [{type: "HASH", value: "FF7700", isIdent: true}],
  },
  {
    parser: "",
    css: "#3377FF",
    expected: [{type: "HASH", value: "3377FF", isIdent: false}],
  },
  {
    parser: "",
    css: "#\\ ",
    expected: [{type: "HASH", value: " ", isIdent: true}],
  },
  {
    parser: "",
    css: "# ",
    expected: [{type: "DELIM", value: '#'}, {type: "WHITESPACE"}],
  },
  {
    parser: "",
    css: "#\\\n",
    expected: [{type: "DELIM", value: '#'}, {type: "DELIM", value: '\\'}, {type: "WHITESPACE"}],
  },
  {
    parser: "",
    css: "#\\\r\n",
    expected: [{type: "DELIM", value: '#'}, {type: "DELIM", value: '\\'}, {type: "WHITESPACE"}],
  },
  {
    parser: "",
    css: "#!",
    expected: [{type: "DELIM", value: '#'}, {type: "DELIM", value: '!'}],
  },

  // -- NumberToken
  {
    parser: "",
    css: "10",
    expected: [{type: "NUMBER", value: 10, isInteger: true}],
  },
  {
    parser: "",
    css: "12.0",
    expected: [{type: "NUMBER", value: 12, isInteger: false}],
  },
  {
    parser: "",
    css: "+45.6",
    expected: [{type: "NUMBER", value: 45.6, isInteger: false, sign: "+"}],
  },
  {
    parser: "",
    css: "-7",
    expected: [{type: "NUMBER", value: -7, isInteger: true, sign: "-"}],
  },
  {
    parser: "",
    css: "010",
    expected: [{type: "NUMBER", value: 10, isInteger: true}],
  },
  {
    parser: "",
    css: "10e0",
    expected: [{type: "NUMBER", value: 10, isInteger: false}],
  },
  {
    parser: "",
    css: "12e3",
    expected: [{type: "NUMBER", value: 12000, isInteger: false}],
  },
  {
    parser: "",
    css: "3e+1",
    expected: [{type: "NUMBER", value: 30, isInteger: false}],
  },
  {
    parser: "",
    css: "12E-1",
    expected: [{type: "NUMBER", value: 1.2, isInteger: false}],
  },
  {
    parser: "",
    css: ".7",
    expected: [{type: "NUMBER", value: 0.7, isInteger: false}],
  },
  {
    parser: "",
    css: "-.3",
    expected: [{type: "NUMBER", value: -0.3, isInteger: false, sign: "-"}],
  },
  {
    parser: "",
    css: "+637.54e-2",
    expected: [{type: "NUMBER", value: 6.3754, isInteger: false, sign: "+"}],
  },
  {
    parser: "",
    css: "-12.34E+2",
    expected: [{type: "NUMBER", value: -1234, isInteger: false, sign: "-"}],
  },
  {
    parser: "",
    css: "+ 5",
    expected: [{type: "DELIM", value: '+'}, {type: "WHITESPACE"}, {type: "NUMBER", value: 5, isInteger: true}],
  },
  {
    parser: "",
    css: "-+12",
    expected: [{type: "DELIM", value: '-'}, {type: "NUMBER", value: 12, isInteger: true, sign: "+"}],
  },
  {
    parser: "",
    css: "+-21",
    expected: [{type: "DELIM", value: '+'}, {type: "NUMBER", value: -21, isInteger: true, sign: "-"}],
  },
  {
    parser: "",
    css: "++22",
    expected: [{type: "DELIM", value: '+'}, {type: "NUMBER", value: 22, isInteger: true, sign: "+"}],
  },
  {
    parser: "",
    css: "13.",
    expected: [{type: "NUMBER", value: 13, isInteger: true}, {type: "DELIM", value: '.'}],
  },
  {
    parser: "",
    css: "1.e2",
    expected: [{type: "NUMBER", value: 1, isInteger: true}, {type: "DELIM", value: '.'}, {type: "IDENT", value: "e2"}],
  },
  {
    parser: "",
    css: "2e3.5",
    expected: [{type: "NUMBER", value: 2000, isInteger: false}, {type: "NUMBER", value: 0.5, isInteger: false}],
  },
  {
    parser: "",
    css: "2e3.",
    expected: [{type: "NUMBER", value: 2000, isInteger: false}, {type: "DELIM", value: '.'}],
  },
  {
    parser: "",
    css: "1000000000000000000000000",
    expected: [{type: "NUMBER", value: 1e24, isInteger: true}],
  },

  // -- DimensionToken
  {
    parser: "",
    css: "10px",
    expected: [{type: "DIMENSION", value: 10, isInteger: true, unit: "px"}],
  },
  {
    parser: "",
    css: "12.0em",
    expected: [{type: "DIMENSION", value: 12, isInteger: false, unit: "em"}],
  },
  {
    parser: "",
    css: "-12.0em",
    expected: [{type: "DIMENSION", value: -12, isInteger: false, unit: "em"}],
  },
  {
    parser: "",
    css: "+45.6__qem",
    expected: [{type: "DIMENSION", value: 45.6, isInteger: false, unit: "__qem"}],
  },
  {
    parser: "",
    css: "5e",
    expected: [{type: "DIMENSION", value: 5, isInteger: true, unit: "e"}],
  },
  {
    parser: "",
    css: "5px-2px",
    expected: [{type: "DIMENSION", value: 5, isInteger: true, unit: "px-2px"}],
  },
  {
    parser: "",
    css: "5e-",
    expected: [{type: "DIMENSION", value: 5, isInteger: true, unit: "e-"}],
  },
  {
    parser: "",
    css: "5\\ ",
    expected: [{type: "DIMENSION", value: 5, isInteger: true, unit: " "}],
  },
  {
    parser: "",
    css: "40\\70\\78",
    expected: [{type: "DIMENSION", value: 40, isInteger: true, unit: "px"}],
  },
  {
    parser: "",
    css: "4e3e2",
    expected: [{type: "DIMENSION", value: 4000, isInteger: false, unit: "e2"}],
  },
  {
    parser: "",
    css: "0x10px",
    expected: [{type: "DIMENSION", value: 0, isInteger: true, unit: "x10px"}],
  },
  {
    parser: "",
    css: "4unit ",
    expected: [{type: "DIMENSION", value: 4, isInteger: true, unit: "unit"}, {type: "WHITESPACE"}],
  },
  {
    parser: "",
    css: "5e+",
    expected: [{type: "DIMENSION", value: 5, isInteger: true, unit: "e"}, {type: "DELIM", value: '+'}],
  },
  {
    parser: "",
    css: "2e.5",
    expected: [{type: "DIMENSION", value: 2, isInteger: true, unit: "e"}, {type: "NUMBER", value: 0.5, isInteger: false}],
  },
  {
    parser: "",
    css: "2e+.5",
    expected: [{type: "DIMENSION", value: 2, isInteger: true, unit: "e"}, {type: "NUMBER", value: 0.5, isInteger: false, sign: "+"}],
  },

  // -- PercentageToken
  {
    parser: "",
    css: "10%",
    expected: [{type: "PERCENTAGE", value: 10}],
  },
  {
    parser: "",
    css: "+12.0%",
    expected: [{type: "PERCENTAGE", value: 12}],
  },
  {
    parser: "",
    css: "-48.99%",
    expected: [{type: "PERCENTAGE", value: -48.99}],
  },
  {
    parser: "",
    css: "6e-1%",
    expected: [{type: "PERCENTAGE", value: 0.6}],
  },
  {
    parser: "",
    css: "5%%",
    expected: [{type: "PERCENTAGE", value: 5}, {type: "DELIM", value: '%'}],
  },

  // -- UnicodeRangeToken
  {
    parser: "",
    css: "u+012345-123456",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "NUMBER", value: 12345, isInteger: true, sign: "+"},
      {type: "NUMBER", value: -123456, isInteger: true, sign: "-"},
    ],
  },
  {
    parser: "",
    css: "U+1234-2345",
    expected: [
      {type: "IDENT", value: "U"},
      {type: "NUMBER", value: 1234, isInteger: true, sign: "+"},
      {type: "NUMBER", value: -2345, isInteger: true, sign: "-"},
    ],
  },
  {
    parser: "",
    css: "u+222-111",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "NUMBER", value: 222, isInteger: true, sign: "+"},
      {type: "NUMBER", value: -111, isInteger: true, sign: "-"},
    ],
  },
  {
    parser: "",
    css: "U+CafE-d00D",
    expected: [
      {type: "IDENT", value: "U"},
      {type: "DELIM", value: "+"},
      {type: "IDENT", value: "CafE-d00D"},
    ],
  },
  {
    parser: "",
    css: "U+2??",
    expected: [
      {type: "IDENT", value: "U"},
      {type: "NUMBER", value: 2, isInteger: true, sign: "+"},
      {type: "DELIM", value: "?"},
      {type: "DELIM", value: "?"},
    ],
  },
  {
    parser: "",
    css: "U+ab12??",
    expected: [
      {type: "IDENT", value: "U"},
      {type: "DELIM", value: "+"},
      {type: "IDENT", value: "ab12"},
      {type: "DELIM", value: "?"},
      {type: "DELIM", value: "?"},
    ],
  },
  {
    parser: "",
    css: "u+??????",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "DELIM", value: "+"},
      {type: "DELIM", value: "?"},
      {type: "DELIM", value: "?"},
      {type: "DELIM", value: "?"},
      {type: "DELIM", value: "?"},
      {type: "DELIM", value: "?"},
      {type: "DELIM", value: "?"},
    ],
  },
  {
    parser: "",
    css: "u+??",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "DELIM", value: "+"},
      {type: "DELIM", value: "?"},
      {type: "DELIM", value: "?"},
    ],
  },
  {
    parser: "",
    css: "u+222+111",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "NUMBER", value: 222, isInteger: true, sign: "+"},
      {type: "NUMBER", value: 111, isInteger: true, sign: "+"},
    ],
  },
  {
    parser: "",
    css: "u+12345678",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "NUMBER", value: 12345678, isInteger: true, sign: "+"},
    ],
  },
  {
    parser: "",
    css: "u+123-12345678",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "NUMBER", value: 123, isInteger: true, sign: "+"},
      {type: "NUMBER", value: -12345678, isInteger: true, sign: "-"},
    ],
  },
  {
    parser: "",
    css: "u+cake",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "DELIM", value: "+"},
      {type: "IDENT", value: "cake"},
    ],
  },
  {
    parser: "",
    css: "u+1234-gggg",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "DIMENSION", value: 1234, isInteger: true, unit: "-gggg", sign: "+"},
    ],
  },
  {
    parser: "",
    css: "U+ab12???",
    expected: [
      {type: "IDENT", value: "U"},
      {type: "DELIM", value: "+"},
      {type: "IDENT", value: "ab12"},
      {type: "DELIM", value: "?"},
      {type: "DELIM", value: "?"},
      {type: "DELIM", value: "?"},
    ],
  },
  {
    parser: "",
    css: "u+a1?-123",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "DELIM", value: "+"},
      {type: "IDENT", value: "a1"},
      {type: "DELIM", value: "?"},
      {type: "NUMBER", value: -123, isInteger: true, sign: "-"},
    ],
  },
  {
    parser: "",
    css: "u+1??4",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "NUMBER", value: 1, isInteger: true, sign: "+"},
      {type: "DELIM", value: "?"},
      {type: "DELIM", value: "?"},
      {type: "NUMBER", value: 4, isInteger: true},
    ],
  },
  {
    parser: "",
    css: "u+z",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "DELIM", value: "+"},
      {type: "IDENT", value: "z"},
    ],
  },
  {
    parser: "",
    css: "u+",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "DELIM", value: "+"},
    ],
  },
  {
    parser: "",
    css: "u+-543",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "DELIM", value: "+"},
      {type: "NUMBER", value: -543, isInteger: true, sign: "-"},
    ],
  },

  // -- CommentToken
  {
    parser: "",
    css: "/*comment*/a",
    expected: [{type: "IDENT", value: "a"}],
  },
  {
    parser: "",
    css: "/**\\2f**//",
    expected: [{type: "DELIM", value: '/'}],
  },
  {
    parser: "",
    css: "/**y*a*y**/ ",
    expected: [{type: "WHITESPACE"}],
  },
  {
    parser: "",
    css: ",/* \n :) \n */)",
    expected: [{type: "COMMA"}, {type: "CLOSE-PAREN"}],
  },
  {
    parser: "",
    css: ":/*/*/",
    expected: [{type: "COLON"}],
  },
  {
    parser: "",
    css: "/**/*",
    expected: [{type: "DELIM", value: '*'}],
  },
  {
    parser: "",
    css: ";/******",
    expected: [{type: "SEMICOLON"}],
  },

  // parseAStylesheet()
  {
    css: `foo {
        bar: baz;
    }`,
    expected: {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "foo"
            },
            {
              "type": "WHITESPACE"
            }
          ],
          "declarations": [
            {
              "type": "DECLARATION",
              "name": "bar",
              "value": [
                {
                  "type": "IDENT",
                  "value": "baz"
                }
              ],
              "important": false
            }
          ],
          "rules": []
        }
      ]
    }
  },
  {
    css: 'foo { bar: rgb(255, 0, 127); }',
    expected: {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "foo"
            },
            {
              "type": "WHITESPACE"
            }
          ],
          "declarations": [
            {
              "type": "DECLARATION",
              "name": "bar",
              "value": [
                {
                  "type": "FUNCTION",
                  "name": "rgb",
                  "value": [
                    {
                      "type": "NUMBER",
                      "value": 255,
                      "isInteger": true,
                    },
                    {
                      "type": "COMMA"
                    },
                    {
                      "type": "WHITESPACE"
                    },
                    {
                      "type": "NUMBER",
                      "value": 0,
                      "isInteger": true,
                    },
                    {
                      "type": "COMMA"
                    },
                    {
                      "type": "WHITESPACE"
                    },
                    {
                      "type": "NUMBER",
                      "value": 127,
                      "isInteger": true,
                    }
                  ]
                }
              ],
              "important": false
            }
          ],
          "rules": []
        }
      ]
    }
  },
  {
    css: '#foo {}',
    expected: {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "HASH",
              "value": "foo",
              "isIdent": true
            },
            {
              "type": "WHITESPACE"
            }
          ],
          "declarations": [],
          "rules": []
        }
      ]
    }
  },
  {
    css: '@media{ }',
    expected: {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "AT-RULE",
          "name": "media",
          "prelude": [],
          "declarations": [],
          "rules": []
        }
      ]
    }
  },
  {
    css: '.foo {color: red; @media { foo: bar } color: green }',
    expected: {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "DELIM",
              "value": "."
            },
            {
              "type": "IDENT",
              "value": "foo"
            },
            {
              "type": "WHITESPACE"
            }
          ],
          "declarations": [
            {
              "type": "DECLARATION",
              "name": "color",
              "value": [
                {
                  "type": "IDENT",
                  "value": "red"
                }
              ],
              "important": false
            },
            {
              "type": "DECLARATION",
              "name": "color",
              "value": [
                {
                  "type": "IDENT",
                  "value": "green"
                }
              ],
              "important": false
            }
          ],
          "rules": [
            {
              "type": "AT-RULE",
              "name": "media",
              "prelude": [
                {
                  "type": "WHITESPACE"
                }
              ],
              "declarations": [
                {
                  "type": "DECLARATION",
                  "name": "foo",
                  "value": [
                    {
                      "type": "IDENT",
                      "value": "bar"
                    }
                  ],
                  "important": false
                }
              ],
              "rules": []
            }
          ]
        }
      ]
    }
  },
  {
    css: 'foo{div:hover; color:red{};}',
    expected: {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "foo"
            }
          ],
          "declarations": [
            {
              "type": "DECLARATION",
              "name": "div",
              "value": [
                {
                  "type": "IDENT",
                  "value": "hover"
                }
              ],
              "important": false
            }
          ],
          "rules": [
            {
              "type": "QUALIFIED-RULE",
              "prelude": [
                {
                  "type": "IDENT",
                  "value": "color"
                },
                {
                  "type": "COLON"
                },
                {
                  "type": "IDENT",
                  "value": "red"
                }
              ],
              "declarations": [],
              "rules": []
            }
          ]
        }
      ]
    }
  },
  {
    css: `@foo;;foo {}`,
    expected: {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "AT-RULE",
          "name": "foo",
          "prelude": [],
          "declarations": null,
          "rules": null
        }
      ]
    }
  },
  {
    css: `foo{@foo;;foo {}}`,
    expected: {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "foo"
            }
          ],
          "declarations": [],
          "rules": [
            {
              "type": "AT-RULE",
              "name": "foo",
              "prelude": [],
              "declarations": null,
              "rules": null
            },
            {
              "type": "QUALIFIED-RULE",
              "prelude": [
                {
                  "type": "IDENT",
                  "value": "foo"
                },
                {
                  "type": "WHITESPACE"
                }
              ],
              "declarations": [],
              "rules": []
            }
          ]
        }
      ]
    }
  },
  {
    css: `foo { --div:hover{}}`,
    expected: {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "foo"
            },
            {
              "type": "WHITESPACE"
            }
          ],
          "declarations": [
            {
              "type": "DECLARATION",
              "name": "--div",
              "value": [
                {
                  "type": "IDENT",
                  "value": "hover"
                },
                {
                  "type": "BLOCK",
                  "name": "{",
                  "value": []
                }
              ],
              "important": false
            }
          ],
          "rules": []
        }
      ]
    }
  }
];


var log = log || console.log;

var total = TESTS.length, failures = 0,
    i, test, tokens, parser, result, dump, expected_dump;

for (i = 0; i < total; i++) {
  test = TESTS[i];
  tokens = parseCss.tokenize(test.css);
  parser = parseCss[typeof test.parser === 'string' ? test.parser : 'parseAStylesheet'];
  result = (typeof parser === 'function') ? parser(tokens) : tokens;
  dump = JSON.stringify(result, null, '  ');
  expected_dump = JSON.stringify(test.expected, null, '  ');
  if (dump == expected_dump) {
    log(`Test ${i} of ${total}: PASS`);
  } else {
    log(`Test ${i} of ${total}: FAIL\nCSS: ${test.css}\nTokens: ${tokens.join(' ')}`);
    log(ansidiff.lines(expected_dump, dump));
    failures++;
  }
}

// Abuse the differ to get colored output
if (failures == 0) {
  log(ansidiff.words(`${total} tests, `, `${total} tests, all passed :)`));
} else {
  log(ansidiff.words(`${total} tests, ${failures} failures :(`, `${total} tests, `));
}

}));

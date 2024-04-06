"use strict";
(function (global, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    // CommonJS/Node.js
    exports.TESTS = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(factory);
  } else {
    // browser global
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    global.TESTS = factory();
  }
}(this, function () {

return [
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
      {type: "EOF"},
    ]
  },

  // tokenize()

  // -- SingleCharacterTokens
  {
    parser: "",
    css: "(",
    expected: [{type: "OPEN-PAREN"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: ")",
    expected: [{type: "CLOSE-PAREN"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "[",
    expected: [{type: "OPEN-SQUARE"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "]",
    expected: [{type: "CLOSE-SQUARE"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: ",",
    expected: [{type: "COMMA"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: ":",
    expected: [{type: "COLON"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: ";",
    expected: [{type: "SEMICOLON"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: ")[",
    expected: [{type: "CLOSE-PAREN"}, {type: "OPEN-SQUARE"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "[)",
    expected: [{type: "OPEN-SQUARE"}, {type: "CLOSE-PAREN"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "{}",
    expected: [{type: "OPEN-CURLY"}, {type: "CLOSE-CURLY"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: ",,",
    expected: [{type: "COMMA"}, {type: "COMMA"}, {type: "EOF"}],
  },

  // -- MultipleCharacterTokens
  {
    parser: "",
    css: "~=",
    expected: [{type: "DELIM", value: '~'}, {type: "DELIM", value: '='}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "|=",
    expected: [{type: "DELIM", value: '|'}, {type: "DELIM", value: '='}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "^=",
    expected: [{type: "DELIM", value: '^'}, {type: "DELIM", value: '='}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "$=",
    expected: [{type: "DELIM", value: '$'}, {type: "DELIM", value: '='}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "*=",
    expected: [{type: "DELIM", value: '*'}, {type: "DELIM", value: '='}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "||",
    expected: [{type: "DELIM", value: '|'}, {type: "DELIM", value: '|'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "|||",
    expected: [{type: "DELIM", value: '|'}, {type: "DELIM", value: '|'}, {type: "DELIM", value: '|'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "<!--",
    expected: [{type: "CDO"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "<!---",
    expected: [{type: "CDO"}, {type: "DELIM", value: '-'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "-->",
    expected: [{type: "CDC"}, {type: "EOF"}],
  },

  // -- DelimiterToken
  {
    parser: "",
    css: "^",
    expected: [{type: "DELIM", value: '^'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "*",
    expected: [{type: "DELIM", value: '*'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "%",
    expected: [{type: "DELIM", value: '%'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "~",
    expected: [{type: "DELIM", value: '~'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "&",
    expected: [{type: "DELIM", value: '&'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "|",
    expected: [{type: "DELIM", value: '|'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\x7f",
    expected: [{type: "DELIM", value: '\x7f'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\x01",
    expected: [{type: "DELIM", value: '\x01'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "~-",
    expected: [{type: "DELIM", value: '~'}, {type: "DELIM", value: '-'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "^|",
    expected: [{type: "DELIM", value: '^'}, {type: "DELIM", value: '|'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "$~",
    expected: [{type: "DELIM", value: '$'}, {type: "DELIM", value: '~'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "*^",
    expected: [{type: "DELIM", value: '*'}, {type: "DELIM", value: '^'}, {type: "EOF"}],
  },

  // -- WhitespaceTokens
  {
    parser: "",
    css: "   ",
    expected: [{type: "WHITESPACE"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\n\rS",
    expected: [{type: "WHITESPACE"}, {type: "IDENT", value: "S"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "   *",
    expected: [{type: "WHITESPACE"}, {type: "DELIM", value: '*'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\r\n\f\t2",
    expected: [{type: "WHITESPACE"}, {type: "NUMBER", value: 2, isInteger: true}, {type: "EOF"}],
  },

  // -- Escapes
  {
    parser: "",
    css: "hel\\6Co",
    expected: [{type: "IDENT", value: "hello"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\\26 B",
    expected: [{type: "IDENT", value: "&B"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'hel\\6c o'",
    expected: [{type: "STRING", value: "hello"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'spac\\65\r\ns'",
    expected: [{type: "STRING", value: "spaces"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "spac\\65\r\ns",
    expected: [{type: "IDENT", value: "spaces"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "spac\\65\n\rs",
    expected: [{type: "IDENT", value: "space"}, {type: "WHITESPACE"}, {type: "IDENT", value: "s"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "sp\\61\tc\\65\fs",
    expected: [{type: "IDENT", value: "spaces"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "hel\\6c  o",
    expected: [{type: "IDENT", value: "hell"}, {type: "WHITESPACE"}, {type: "IDENT", value: "o"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "test\\\n",
    expected: [{type: "IDENT", value: "test"}, {type: "DELIM", value: '\\'}, {type: "WHITESPACE"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "test\\D799",
    expected: [{type: "IDENT", value: "test\uD799"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\\E000",
    expected: [{type: "IDENT", value: "\uE000"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "te\\s\\t",
    expected: [{type: "IDENT", value: "test"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "spaces\\ in\\\tident",
    expected: [{type: "IDENT", value: "spaces in\tident"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\\.\\,\\:\\!",
    expected: [{type: "IDENT", value: ".,:!"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\\\r",
    expected: [{type: "DELIM", value: '\\'}, {type: "WHITESPACE"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\\\f",
    expected: [{type: "DELIM", value: '\\'}, {type: "WHITESPACE"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\\\r\n",
    expected: [{type: "DELIM", value: '\\'}, {type: "WHITESPACE"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "null\\\0",
    expected: [{type: "IDENT", value: "null\uFFFD"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "null\\\0\0",
    expected: [{type: "IDENT", value: "null\uFFFD\uFFFD"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "null\\0",
    expected: [{type: "IDENT", value: "null\uFFFD"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "null\\0000",
    expected: [{type: "IDENT", value: "null\uFFFD"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "large\\110000",
    expected: [{type: "IDENT", value: "large\uFFFD"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "large\\23456a",
    expected: [{type: "IDENT", value: "large\uFFFD"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "surrogate\\D800",
    expected: [{type: "IDENT", value: "surrogate\uFFFD"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "surrogate\\0DABC",
    expected: [{type: "IDENT", value: "surrogate\uFFFD"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\\00DFFFsurrogate",
    expected: [{type: "IDENT", value: "\uFFFDsurrogate"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\\10fFfF",
    expected: [{type: "IDENT", value: "\u{10ffff}"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\\10fFfF0",
    expected: [{type: "IDENT", value: "\u{10ffff}0"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\\10000000",
    expected: [{type: "IDENT", value: "\u{100000}00"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "eof\\",
    expected: [{type: "IDENT", value: "eof\uFFFD"}, {type: "EOF"}],
  },

  // -- IdentToken
  {
    parser: "",
    css: "simple-ident",
    expected: [{type: "IDENT", value: "simple-ident"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "testing123",
    expected: [{type: "IDENT", value: "testing123"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "hello!",
    expected: [{type: "IDENT", value: "hello"}, {type: "DELIM", value: '!'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "world\x05",
    expected: [{type: "IDENT", value: "world"}, {type: "DELIM", value: '\x05'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "_under score",
    expected: [{type: "IDENT", value: "_under"}, {type: "WHITESPACE"}, {type: "IDENT", value: "score"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "-_underscore",
    expected: [{type: "IDENT", value: "-_underscore"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "-text",
    expected: [{type: "IDENT", value: "-text"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "-\\6d",
    expected: [{type: "IDENT", value: "-m"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "--abc",
    expected: [{type: "IDENT", value: "--abc"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "--",
    expected: [{type: "IDENT", value: "--"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "--11",
    expected: [{type: "IDENT", value: "--11"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "---",
    expected: [{type: "IDENT", value: "---"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\u2003",  // em-space
    expected: [{type: "DELIM", value: "\u2003"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\u{A0}",  // non-breaking space
    expected: [{type: "DELIM", value: "\u{A0}"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\u1234",
    expected: [{type: "IDENT", value: "\u1234"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\u{12345}",
    expected: [{type: "IDENT", value: "\u{12345}"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\0",
    expected: [{type: "IDENT", value: "\uFFFD"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "ab\0c",
    expected: [{type: "IDENT", value: "ab\uFFFDc"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "ab\0c",
    expected: [{type: "IDENT", value: "ab\uFFFDc"}, {type: "EOF"}],
  },

  // -- FunctionToken
  {
    parser: "",
    css: "scale(2)",
    expected: [{type: "FUNCTION", value: "scale"}, {type: "NUMBER", value: 2, isInteger: true}, {type: "CLOSE-PAREN"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "foo-bar\\ baz(",
    expected: [{type: "FUNCTION", value: "foo-bar baz"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "fun\\(ction(",
    expected: [{type: "FUNCTION", value: "fun(ction"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "-foo(",
    expected: [{type: "FUNCTION", value: "-foo"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "url(\"foo.gif\"",
    expected: [{type: "FUNCTION", value: "url"}, {type: "STRING", value: "foo.gif"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "foo(  \'bar.gif\'",
    expected: [{type: "FUNCTION", value: "foo"}, {type: "WHITESPACE"}, {type: "STRING", value: "bar.gif"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "url(  \'bar.gif\'",
    expected: [{type: "FUNCTION", value: "url"}, {type: "WHITESPACE"}, {type: "STRING", value: "bar.gif"}, {type: "EOF"}],
  },

  // -- AtKeywordToken
  {
    parser: "",
    css: "@at-keyword",
    expected: [{type: "AT-KEYWORD", value: "at-keyword"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "@testing123",
    expected: [{type: "AT-KEYWORD", value: "testing123"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "@hello!",
    expected: [{type: "AT-KEYWORD", value: "hello"}, {type: "DELIM", value: '!'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "@-text",
    expected: [{type: "AT-KEYWORD", value: "-text"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "@--abc",
    expected: [{type: "AT-KEYWORD", value: "--abc"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "@--",
    expected: [{type: "AT-KEYWORD", value: "--"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "@--11",
    expected: [{type: "AT-KEYWORD", value: "--11"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "@---",
    expected: [{type: "AT-KEYWORD", value: "---"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "@\\ ",
    expected: [{type: "AT-KEYWORD", value: " "}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "@-\\ ",
    expected: [{type: "AT-KEYWORD", value: "- "}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "@@",
    expected: [{type: "DELIM", value: '@'}, {type: "DELIM", value: '@'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "@2",
    expected: [{type: "DELIM", value: '@'}, {type: "NUMBER", value: 2, isInteger: true}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "@-1",
    expected: [{type: "DELIM", value: '@'}, {type: "NUMBER", value: -1, isInteger: true, sign: "-"}, {type: "EOF"}],
  },

  // -- UrlToken
  {
    parser: "",
    css: "url(foo.gif)",
    expected: [{type: "URL", value: "foo.gif"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "urL(https://example.com/cats.png)",
    expected: [{type: "URL", value: "https://example.com/cats.png"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "uRl(what-a.crazy^URL~this\\ is!)",
    expected: [{type: "URL", value: "what-a.crazy^URL~this is!"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "uRL(123#test)",
    expected: [{type: "URL", value: "123#test"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "Url(escapes\\ \\\"\\'\\)\\()",
    expected: [{type: "URL", value: "escapes \"')("}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "UrL(   whitespace   )",
    expected: [{type: "URL", value: "whitespace"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "URl( whitespace-eof ",
    expected: [{type: "URL", value: "whitespace-eof"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "URL(eof",
    expected: [{type: "URL", value: "eof"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "url(not/*a*/comment)",
    expected: [{type: "URL", value: "not/*a*/comment"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "urL()",
    expected: [{type: "URL", value: ""}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "uRl(white space),",
    expected: [{type: "BADURL"}, {type: "COMMA"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "Url(b(ad),",
    expected: [{type: "BADURL"}, {type: "COMMA"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "uRl(ba'd):",
    expected: [{type: "BADURL"}, {type: "COLON"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "urL(b\"ad):",
    expected: [{type: "BADURL"}, {type: "COLON"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "uRl(b\"ad):",
    expected: [{type: "BADURL"}, {type: "COLON"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "Url(b\\\rad):",
    expected: [{type: "BADURL"}, {type: "COLON"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "url(b\\\nad):",
    expected: [{type: "BADURL"}, {type: "COLON"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "url(/*'bad')*/",
    expected: [{type: "BADURL"}, {type: "DELIM", value: '*'}, {type: "DELIM", value: '/'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "url(ba'd\\))",
    expected: [{type: "BADURL"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "url(ba'd\\\\))",
    expected: [{type: "BADURL"}, {type: "CLOSE-PAREN"}, {type: "EOF"}],
  },

  // -- StringToken
  {
    parser: "",
    css: "'text'",
    expected: [{type: "STRING", value: "text"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\"text\"",
    expected: [{type: "STRING", value: "text"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'testing, 123!'",
    expected: [{type: "STRING", value: "testing, 123!"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'es\\'ca\\\"pe'",
    expected: [{type: "STRING", value: "es'ca\"pe"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'\"quotes\"'",
    expected: [{type: "STRING", value: "\"quotes\""}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\"'quotes'\"",
    expected: [{type: "STRING", value: "'quotes'"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\"mismatch'",
    expected: [{type: "STRING", value: "mismatch'"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'text\x05\t\x13'",
    expected: [{type: "STRING", value: "text\x05\t\x13"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\"end on eof",
    expected: [{type: "STRING", value: "end on eof"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'esca\\\nped'",
    expected: [{type: "STRING", value: "escaped"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\"esc\\\faped\"",
    expected: [{type: "STRING", value: "escaped"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'new\\\rline'",
    expected: [{type: "STRING", value: "newline"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "\"new\\\r\nline\"",
    expected: [{type: "STRING", value: "newline"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'bad\nstring",
    expected: [{type: "BADSTRING"}, {type: "WHITESPACE"}, {type: "IDENT", value: "string"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'bad\rstring",
    expected: [{type: "BADSTRING"}, {type: "WHITESPACE"}, {type: "IDENT", value: "string"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'bad\r\nstring",
    expected: [{type: "BADSTRING"}, {type: "WHITESPACE"}, {type: "IDENT", value: "string"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'bad\fstring",
    expected: [{type: "BADSTRING"}, {type: "WHITESPACE"}, {type: "IDENT", value: "string"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'\0'",
    expected: [{type: "STRING", value: "\uFFFD"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'hel\0lo'",
    expected: [{type: "STRING", value: "hel\uFFFDlo"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "'h\\65l\0lo'",
    expected: [{type: "STRING", value: "hel\uFFFDlo"}, {type: "EOF"}],
  },

  // -- HashToken
  {
    parser: "",
    css: "#id-selector",
    expected: [{type: "HASH", value: "id-selector", isIdent: true}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "#FF7700",
    expected: [{type: "HASH", value: "FF7700", isIdent: true}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "#3377FF",
    expected: [{type: "HASH", value: "3377FF", isIdent: false}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "#\\ ",
    expected: [{type: "HASH", value: " ", isIdent: true}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "# ",
    expected: [{type: "DELIM", value: '#'}, {type: "WHITESPACE"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "#\\\n",
    expected: [{type: "DELIM", value: '#'}, {type: "DELIM", value: '\\'}, {type: "WHITESPACE"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "#\\\r\n",
    expected: [{type: "DELIM", value: '#'}, {type: "DELIM", value: '\\'}, {type: "WHITESPACE"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "#!",
    expected: [{type: "DELIM", value: '#'}, {type: "DELIM", value: '!'}, {type: "EOF"}],
  },

  // -- NumberToken
  {
    parser: "",
    css: "10",
    expected: [{type: "NUMBER", value: 10, isInteger: true}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "12.0",
    expected: [{type: "NUMBER", value: 12, isInteger: false}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "+45.6",
    expected: [{type: "NUMBER", value: 45.6, isInteger: false, sign: "+"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "-7",
    expected: [{type: "NUMBER", value: -7, isInteger: true, sign: "-"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "010",
    expected: [{type: "NUMBER", value: 10, isInteger: true}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "10e0",
    expected: [{type: "NUMBER", value: 10, isInteger: false}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "12e3",
    expected: [{type: "NUMBER", value: 12000, isInteger: false}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "3e+1",
    expected: [{type: "NUMBER", value: 30, isInteger: false}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "12E-1",
    expected: [{type: "NUMBER", value: 1.2, isInteger: false}, {type: "EOF"}],
  },
  {
    parser: "",
    css: ".7",
    expected: [{type: "NUMBER", value: 0.7, isInteger: false}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "-.3",
    expected: [{type: "NUMBER", value: -0.3, isInteger: false, sign: "-"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "+637.54e-2",
    expected: [{type: "NUMBER", value: 6.3754, isInteger: false, sign: "+"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "-12.34E+2",
    expected: [{type: "NUMBER", value: -1234, isInteger: false, sign: "-"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "+ 5",
    expected: [{type: "DELIM", value: '+'}, {type: "WHITESPACE"}, {type: "NUMBER", value: 5, isInteger: true}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "-+12",
    expected: [{type: "DELIM", value: '-'}, {type: "NUMBER", value: 12, isInteger: true, sign: "+"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "+-21",
    expected: [{type: "DELIM", value: '+'}, {type: "NUMBER", value: -21, isInteger: true, sign: "-"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "++22",
    expected: [{type: "DELIM", value: '+'}, {type: "NUMBER", value: 22, isInteger: true, sign: "+"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "13.",
    expected: [{type: "NUMBER", value: 13, isInteger: true}, {type: "DELIM", value: '.'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "1.e2",
    expected: [{type: "NUMBER", value: 1, isInteger: true}, {type: "DELIM", value: '.'}, {type: "IDENT", value: "e2"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "2e3.5",
    expected: [{type: "NUMBER", value: 2000, isInteger: false}, {type: "NUMBER", value: 0.5, isInteger: false}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "2e3.",
    expected: [{type: "NUMBER", value: 2000, isInteger: false}, {type: "DELIM", value: '.'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "1000000000000000000000000",
    expected: [{type: "NUMBER", value: 1e24, isInteger: true}, {type: "EOF"}],
  },

  // -- DimensionToken
  {
    parser: "",
    css: "10px",
    expected: [{type: "DIMENSION", value: 10, isInteger: true, unit: "px"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "12.0em",
    expected: [{type: "DIMENSION", value: 12, isInteger: false, unit: "em"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "-12.0em",
    expected: [{type: "DIMENSION", value: -12, isInteger: false, unit: "em", sign: "-"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "+45.6__qem",
    expected: [{type: "DIMENSION", value: 45.6, isInteger: false, unit: "__qem", sign: "+"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "5e",
    expected: [{type: "DIMENSION", value: 5, isInteger: true, unit: "e"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "5px-2px",
    expected: [{type: "DIMENSION", value: 5, isInteger: true, unit: "px-2px"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "5e-",
    expected: [{type: "DIMENSION", value: 5, isInteger: true, unit: "e-"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "5\\ ",
    expected: [{type: "DIMENSION", value: 5, isInteger: true, unit: " "}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "40\\70\\78",
    expected: [{type: "DIMENSION", value: 40, isInteger: true, unit: "px"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "4e3e2",
    expected: [{type: "DIMENSION", value: 4000, isInteger: false, unit: "e2"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "0x10px",
    expected: [{type: "DIMENSION", value: 0, isInteger: true, unit: "x10px"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "4unit ",
    expected: [{type: "DIMENSION", value: 4, isInteger: true, unit: "unit"}, {type: "WHITESPACE"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "5e+",
    expected: [{type: "DIMENSION", value: 5, isInteger: true, unit: "e"}, {type: "DELIM", value: '+'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "2e.5",
    expected: [{type: "DIMENSION", value: 2, isInteger: true, unit: "e"}, {type: "NUMBER", value: 0.5, isInteger: false}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "2e+.5",
    expected: [{type: "DIMENSION", value: 2, isInteger: true, unit: "e"}, {type: "NUMBER", value: 0.5, isInteger: false, sign: "+"}, {type: "EOF"}],
  },

  // -- PercentageToken
  {
    parser: "",
    css: "10%",
    expected: [{type: "PERCENTAGE", value: 10}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "+12.0%",
    expected: [{type: "PERCENTAGE", value: 12, sign: "+"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "-48.99%",
    expected: [{type: "PERCENTAGE", value: -48.99, sign: "-"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "6e-1%",
    expected: [{type: "PERCENTAGE", value: 0.6}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "5%%",
    expected: [{type: "PERCENTAGE", value: 5}, {type: "DELIM", value: '%'}, {type: "EOF"}],
  },

  // -- UnicodeRangeToken
  {
    parser: "",
    css: "u+012345-123456",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "NUMBER", value: 12345, isInteger: true, sign: "+"},
      {type: "NUMBER", value: -123456, isInteger: true, sign: "-"},
      {type: "EOF"},
    ],
  },
  {
    parser: "",
    css: "U+1234-2345",
    expected: [
      {type: "IDENT", value: "U"},
      {type: "NUMBER", value: 1234, isInteger: true, sign: "+"},
      {type: "NUMBER", value: -2345, isInteger: true, sign: "-"},
      {type: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+222-111",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "NUMBER", value: 222, isInteger: true, sign: "+"},
      {type: "NUMBER", value: -111, isInteger: true, sign: "-"},
      {type: "EOF"},
    ],
  },
  {
    parser: "",
    css: "U+CafE-d00D",
    expected: [
      {type: "IDENT", value: "U"},
      {type: "DELIM", value: "+"},
      {type: "IDENT", value: "CafE-d00D"},
      {type: "EOF"},
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
      {type: "EOF"},
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
      {type: "EOF"},
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
      {type: "EOF"},
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
      {type: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+222+111",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "NUMBER", value: 222, isInteger: true, sign: "+"},
      {type: "NUMBER", value: 111, isInteger: true, sign: "+"},
      {type: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+12345678",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "NUMBER", value: 12345678, isInteger: true, sign: "+"},
      {type: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+123-12345678",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "NUMBER", value: 123, isInteger: true, sign: "+"},
      {type: "NUMBER", value: -12345678, isInteger: true, sign: "-"},
      {type: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+cake",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "DELIM", value: "+"},
      {type: "IDENT", value: "cake"},
      {type: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+1234-gggg",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "DIMENSION", value: 1234, isInteger: true, unit: "-gggg", sign: "+"},
      {type: "EOF"},
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
      {type: "EOF"},
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
      {type: "EOF"},
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
      {type: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+z",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "DELIM", value: "+"},
      {type: "IDENT", value: "z"},
      {type: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "DELIM", value: "+"},
      {type: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+-543",
    expected: [
      {type: "IDENT", value: "u"},
      {type: "DELIM", value: "+"},
      {type: "NUMBER", value: -543, isInteger: true, sign: "-"},
      {type: "EOF"},
    ],
  },

  // -- CommentToken
  {
    parser: "",
    css: "/*comment*/a",
    expected: [{type: "IDENT", value: "a"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "/**\\2f**//",
    expected: [{type: "DELIM", value: '/'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "/**y*a*y**/ ",
    expected: [{type: "WHITESPACE"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: ",/* \n :) \n */)",
    expected: [{type: "COMMA"}, {type: "CLOSE-PAREN"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: ":/*/*/",
    expected: [{type: "COLON"}, {type: "EOF"}],
  },
  {
    parser: "",
    css: "/**/*",
    expected: [{type: "DELIM", value: '*'}, {type: "EOF"}],
  },
  {
    parser: "",
    css: ";/******",
    expected: [{type: "SEMICOLON"}, {type: "EOF"}],
  },

  // parseAStylesheet()
  {
    "parser": "parseAStylesheet",
    "css": "",
    "expected": {
      "type": "STYLESHEET",
      "rules": []
    }
  },
  {
    "parser": "parseAStylesheet",
    "css": "foo",
    "expected": {
      "type": "STYLESHEET",
      "rules": []
    }
  },
  {
    "parser": "parseAStylesheet",
    "css": "foo 4",
    "expected": {
      "type": "STYLESHEET",
      "rules": []
    }
  },
  {
    "parser": "parseAStylesheet",
    "css": "@foo",
    "expected": {
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
    "parser": "parseAStylesheet",
    "css": "@foo bar; \t/* comment */",
    "expected": {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "AT-RULE",
          "name": "foo",
          "prelude": [
            {
              "type": "WHITESPACE"
            },
            {
              "type": "IDENT",
              "value": "bar"
            }
          ],
          "declarations": null,
          "rules": null
        }
      ]
    }
  },
  {
    "parser": "parseAStylesheet",
    "css": " /**/ @foo bar{[(4",
    "expected": {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "AT-RULE",
          "name": "foo",
          "prelude": [
            {
              "type": "WHITESPACE"
            },
            {
              "type": "IDENT",
              "value": "bar"
            }
          ],
          "declarations": [],
          "rules": []
        }
      ]
    }
  },
  {
    "parser": "parseAStylesheet",
    "css": "@foo { bar",
    "expected": {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "AT-RULE",
          "name": "foo",
          "prelude": [
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
    "parser": "parseAStylesheet",
    "css": "@foo [ bar",
    "expected": {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "AT-RULE",
          "name": "foo",
          "prelude": [
            {
              "type": "WHITESPACE"
            },
            {
              "type": "BLOCK",
              "name": "[",
              "value": [
                {
                  "type": "WHITESPACE"
                },
                {
                  "type": "IDENT",
                  "value": "bar"
                }
              ]
            }
          ],
          "declarations": null,
          "rules": null
        }
      ]
    }
  },
  {
    "parser": "parseAStylesheet",
    "css": " /**/ div > p { color: #aaa;  } /**/ ",
    "expected": {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "div"
            },
            {
              "type": "WHITESPACE"
            },
            {
              "type": "DELIM",
              "value": ">"
            },
            {
              "type": "WHITESPACE"
            },
            {
              "type": "IDENT",
              "value": "p"
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
                  "type": "HASH",
                  "value": "aaa",
                  "isIdent": true
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
    "parser": "parseAStylesheet",
    "css": " /**/ { color: #aaa  ",
    "expected": {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [],
          "declarations": [
            {
              "type": "DECLARATION",
              "name": "color",
              "value": [
                {
                  "type": "HASH",
                  "value": "aaa",
                  "isIdent": true
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
    "parser": "parseAStylesheet",
    "css": " /* CDO/CDC are ignored between rules */ <!-- --> {",
    "expected": {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [],
          "declarations": [],
          "rules": []
        }
      ]
    }
  },
  {
    "parser": "parseAStylesheet",
    "css": " <!-- --> a<!---->{",
    "expected": {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "a"
            },
            {
              "type": "CDO"
            },
            {
              "type": "CDC"
            }
          ],
          "declarations": [],
          "rules": []
        }
      ]
    }
  },
  {
    "parser": "parseAStylesheet",
    "css": "div { color: #aaa; } p{}",
    "expected": {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "div"
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
                  "type": "HASH",
                  "value": "aaa",
                  "isIdent": true
                }
              ],
              "important": false
            }
          ],
          "rules": []
        },
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "p"
            }
          ],
          "declarations": [],
          "rules": []
        }
      ]
    }
  },
  {
    "parser": "parseAStylesheet",
    "css": "div {} -->",
    "expected": {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "div"
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
    "parser": "parseAStylesheet",
    "css": "{}a",
    "expected": {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [],
          "declarations": [],
          "rules": []
        }
      ]
    }
  },
  {
    "parser": "parseAStylesheet",
    "css": "{}@a",
    "expected": {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [],
          "declarations": [],
          "rules": []
        },
        {
          "type": "AT-RULE",
          "name": "a",
          "prelude": [],
          "declarations": null,
          "rules": null
        }
      ]
    }
  },
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
  },
  {
    "parser": "parseAStylesheet",
    "css": `p { color: red; } @media print { p { color: green; } }`,
    "expected": {
      "type": "STYLESHEET",
      "rules": [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "p"
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
            }
          ],
          "rules": []
        },
        {
          "type": "AT-RULE",
          "name": "media",
          "prelude": [
            {
              "type": "WHITESPACE"
            },
            {
              "type": "IDENT",
              "value": "print"
            },
            {
              "type": "WHITESPACE"
            }
          ],
          "declarations": [],
          "rules": [
            {
              "type": "QUALIFIED-RULE",
              "prelude": [
                {
                  "type": "IDENT",
                  "value": "p"
                },
                {
                  "type": "WHITESPACE"
                },
              ],
              "declarations": [
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
              "rules": []
            }
          ]
        }
      ]
    }
  },

  // parseAStylesheetsContents()
  {
    "parser": "parseAStylesheetsContents",
    "css": "",
    "expected": []
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": "foo",
    "expected": []
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": "foo 4",
    "expected": []
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": "@foo",
    "expected": [
      {
        "type": "AT-RULE",
        "name": "foo",
        "prelude": [],
        "declarations": null,
        "rules": null
      }
    ]
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": "@foo bar; \t/* comment */",
    "expected": [
      {
        "type": "AT-RULE",
        "name": "foo",
        "prelude": [
          {
            "type": "WHITESPACE"
          },
          {
            "type": "IDENT",
            "value": "bar"
          }
        ],
        "declarations": null,
        "rules": null
      }
    ]
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": " /**/ @foo bar{[(4",
    "expected": [
      {
        "type": "AT-RULE",
        "name": "foo",
        "prelude": [
          {
            "type": "WHITESPACE"
          },
          {
            "type": "IDENT",
            "value": "bar"
          }
        ],
        "declarations": [],
        "rules": []
      }
    ]
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": "@foo { bar",
    "expected": [
      {
        "type": "AT-RULE",
        "name": "foo",
        "prelude": [
          {
            "type": "WHITESPACE"
          }
        ],
        "declarations": [],
        "rules": []
      }
    ]
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": "@foo [ bar",
    "expected": [
      {
        "type": "AT-RULE",
        "name": "foo",
        "prelude": [
          {
            "type": "WHITESPACE"
          },
          {
            "type": "BLOCK",
            "name": "[",
            "value": [
              {
                "type": "WHITESPACE"
              },
              {
                "type": "IDENT",
                "value": "bar"
              }
            ]
          }
        ],
        "declarations": null,
        "rules": null
      }
    ]
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": " /**/ div > p { color: #aaa;  } /**/ ",
    "expected": [
      {
        "type": "QUALIFIED-RULE",
        "prelude": [
          {
            "type": "IDENT",
            "value": "div"
          },
          {
            "type": "WHITESPACE"
          },
          {
            "type": "DELIM",
            "value": ">"
          },
          {
            "type": "WHITESPACE"
          },
          {
            "type": "IDENT",
            "value": "p"
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
                "type": "HASH",
                "value": "aaa",
                "isIdent": true
              }
            ],
            "important": false
          }
        ],
        "rules": []
      }
    ]
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": " /**/ { color: #aaa  ",
    "expected": [
      {
        "type": "QUALIFIED-RULE",
        "prelude": [],
        "declarations": [
          {
            "type": "DECLARATION",
            "name": "color",
            "value": [
              {
                "type": "HASH",
                "value": "aaa",
                "isIdent": true
              }
            ],
            "important": false
          }
        ],
        "rules": []
      }
    ]
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": " /* CDO/CDC are ignored between rules */ <!-- --> {",
    "expected": [
      {
        "type": "QUALIFIED-RULE",
        "prelude": [],
        "declarations": [],
        "rules": []
      }
    ]
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": " <!-- --> a<!---->{",
    "expected": [
      {
        "type": "QUALIFIED-RULE",
        "prelude": [
          {
            "type": "IDENT",
            "value": "a"
          },
          {
            "type": "CDO"
          },
          {
            "type": "CDC"
          }
        ],
        "declarations": [],
        "rules": []
      }
    ]
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": "div { color: #aaa; } p{}",
    "expected": [
      {
        "type": "QUALIFIED-RULE",
        "prelude": [
          {
            "type": "IDENT",
            "value": "div"
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
                "type": "HASH",
                "value": "aaa",
                "isIdent": true
              }
            ],
            "important": false
          }
        ],
        "rules": []
      },
      {
        "type": "QUALIFIED-RULE",
        "prelude": [
          {
            "type": "IDENT",
            "value": "p"
          }
        ],
        "declarations": [],
        "rules": []
      }
    ]
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": "div {} -->",
    "expected": [
      {
        "type": "QUALIFIED-RULE",
        "prelude": [
          {
            "type": "IDENT",
            "value": "div"
          },
          {
            "type": "WHITESPACE"
          }
        ],
        "declarations": [],
        "rules": []
      }
    ]
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": "{}a",
    "expected": [
      {
        "type": "QUALIFIED-RULE",
        "prelude": [],
        "declarations": [],
        "rules": []
      }
    ]
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": "{}@a",
    "expected": [
      {
        "type": "QUALIFIED-RULE",
        "prelude": [],
        "declarations": [],
        "rules": []
      },
      {
        "type": "AT-RULE",
        "name": "a",
        "prelude": [],
        "declarations": null,
        "rules": null
      }
    ]
  },
  {
    "parser": "parseAStylesheetsContents",
    "css": `p { color: red; } @media print { p { color: green; } }`,
    "expected": [
      {
        "type": "QUALIFIED-RULE",
        "prelude": [
          {
            "type": "IDENT",
            "value": "p"
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
          }
        ],
        "rules": []
      },
      {
        "type": "AT-RULE",
        "name": "media",
        "prelude": [
          {
            "type": "WHITESPACE"
          },
          {
            "type": "IDENT",
            "value": "print"
          },
          {
            "type": "WHITESPACE"
          }
        ],
        "declarations": [],
        "rules": [
          {
            "type": "QUALIFIED-RULE",
            "prelude": [
              {
                "type": "IDENT",
                "value": "p"
              },
              {
                "type": "WHITESPACE"
              },
            ],
            "declarations": [
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
            "rules": []
          }
        ]
      }
    ]
  },

  // parseABlocksContents()
  {
    "parser": "parseABlocksContents",
    "css": ";; /**/ ; ;",
    "expected": [
      [],
      []
    ]
  },
  {
    "parser": "parseABlocksContents",
    "css": "a:b; c:d 42!important;\n",
    "expected": [
      [
        {
          "type": "DECLARATION",
          "name": "a",
          "value": [
            {
              "type": "IDENT",
              "value": "b"
            }
          ],
          "important": false
        },
        {
          "type": "DECLARATION",
          "name": "c",
          "value": [
            {
              "type": "IDENT",
              "value": "d"
            },
            {
              "type": "WHITESPACE"
            },
            {
              "type": "NUMBER",
              "value": 42,
              "isInteger": true
            }
          ],
          "important": true
        }
      ],
      []
    ]
  },
  {
    "parser": "parseABlocksContents",
    "css": "z;a:b",
    "expected": [
      [
        {
          "type": "DECLARATION",
          "name": "a",
          "value": [
            {
              "type": "IDENT",
              "value": "b"
            }
          ],
          "important": false
        }
      ],
      []
    ]
  },
  {
    "parser": "parseABlocksContents",
    "css": "z:x!;a:b",
    "expected": [
      [
        {
          "type": "DECLARATION",
          "name": "z",
          "value": [
            {
              "type": "IDENT",
              "value": "x"
            },
            {
              "type": "DELIM",
              "value": "!"
            }
          ],
          "important": false
        },
        {
          "type": "DECLARATION",
          "name": "a",
          "value": [
            {
              "type": "IDENT",
              "value": "b"
            }
          ],
          "important": false
        }
      ],
      []
    ]
  },
  {
    "parser": "parseABlocksContents",
    "css": "a:b; c+:d",
    "expected": [
      [
        {
          "type": "DECLARATION",
          "name": "a",
          "value": [
            {
              "type": "IDENT",
              "value": "b"
            }
          ],
          "important": false
        }
      ],
      []
    ]
  },
  {
    "parser": "parseABlocksContents",
    "css": "@import 'foo.css'; a:b; @import 'bar.css'",
    "expected": [
      [
        {
          "type": "DECLARATION",
          "name": "a",
          "value": [
            {
              "type": "IDENT",
              "value": "b"
            }
          ],
          "important": false
        }
      ],
      [
        {
          "type": "AT-RULE",
          "name": "import",
          "prelude": [
            {
              "type": "WHITESPACE"
            },
            {
              "type": "STRING",
              "value": "foo.css"
            }
          ],
          "declarations": null,
          "rules": null
        },
        {
          "type": "AT-RULE",
          "name": "import",
          "prelude": [
            {
              "type": "WHITESPACE"
            },
            {
              "type": "STRING",
              "value": "bar.css"
            }
          ],
          "declarations": null,
          "rules": null
        }
      ]
    ]
  },
  {
    "parser": "parseABlocksContents",
    "css": "@media screen { div{;}} a:b;; @media print{div{",
    "expected": [
      [
        {
          "type": "DECLARATION",
          "name": "a",
          "value": [
            {
              "type": "IDENT",
              "value": "b"
            }
          ],
          "important": false
        }
      ],
      [
        {
          "type": "AT-RULE",
          "name": "media",
          "prelude": [
            {
              "type": "WHITESPACE"
            },
            {
              "type": "IDENT",
              "value": "screen"
            },
            {
              "type": "WHITESPACE"
            }
          ],
          "declarations": [],
          "rules": [
            {
              "type": "QUALIFIED-RULE",
              "prelude": [
                {
                  "type": "IDENT",
                  "value": "div"
                }
              ],
              "declarations": [],
              "rules": []
            }
          ]
        },
        {
          "type": "AT-RULE",
          "name": "media",
          "prelude": [
            {
              "type": "WHITESPACE"
            },
            {
              "type": "IDENT",
              "value": "print"
            }
          ],
          "declarations": [],
          "rules": [
            {
              "type": "QUALIFIED-RULE",
              "prelude": [
                {
                  "type": "IDENT",
                  "value": "div"
                }
              ],
              "declarations": [],
              "rules": []
            }
          ]
        }
      ]
    ]
  },
  {
    "parser": "parseABlocksContents",
    "css": "@ media screen { div{;}} a:b;; @media print{div{",
    "expected": [
      [
        {
          "type": "DECLARATION",
          "name": "a",
          "value": [
            {
              "type": "IDENT",
              "value": "b"
            }
          ],
          "important": false
        }
      ],
      [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "DELIM",
              "value": "@"
            },
            {
              "type": "WHITESPACE"
            },
            {
              "type": "IDENT",
              "value": "media"
            },
            {
              "type": "WHITESPACE"
            },
            {
              "type": "IDENT",
              "value": "screen"
            },
            {
              "type": "WHITESPACE"
            }
          ],
          "declarations": [],
          "rules": [
            {
              "type": "QUALIFIED-RULE",
              "prelude": [
                {
                  "type": "IDENT",
                  "value": "div"
                }
              ],
              "declarations": [],
              "rules": []
            }
          ]
        },
        {
          "type": "AT-RULE",
          "name": "media",
          "prelude": [
            {
              "type": "WHITESPACE"
            },
            {
              "type": "IDENT",
              "value": "print"
            }
          ],
          "declarations": [],
          "rules": [
            {
              "type": "QUALIFIED-RULE",
              "prelude": [
                {
                  "type": "IDENT",
                  "value": "div"
                }
              ],
              "declarations": [],
              "rules": []
            }
          ]
        }
      ]
    ]
  },
  {
    "parser": "parseABlocksContents",
    "css": "z:x;a b{c:d;;e:f}",
    "expected": [
      [
        {
          "type": "DECLARATION",
          "name": "z",
          "value": [
            {
              "type": "IDENT",
              "value": "x"
            }
          ],
          "important": false
        }
      ],
      [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "a"
            },
            {
              "type": "WHITESPACE"
            },
            {
              "type": "IDENT",
              "value": "b"
            }
          ],
          "declarations": [
            {
              "type": "DECLARATION",
              "name": "c",
              "value": [
                {
                  "type": "IDENT",
                  "value": "d"
                }
              ],
              "important": false
            },
            {
              "type": "DECLARATION",
              "name": "e",
              "value": [
                {
                  "type": "IDENT",
                  "value": "f"
                }
              ],
              "important": false
            }
          ],
          "rules": []
        }
      ]
    ]
  },
  {
    "parser": "parseABlocksContents",
    "css": "a {c:1}",
    "expected": [
      [],
      [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "a"
            },
            {
              "type": "WHITESPACE"
            }
          ],
          "declarations": [
            {
              "type": "DECLARATION",
              "name": "c",
              "value": [
                {
                  "type": "NUMBER",
                  "value": 1,
                  "isInteger": true
                }
              ],
              "important": false
            }
          ],
          "rules": []
        }
      ]
    ]
  },
  {
    "parser": "parseABlocksContents",
    "css": "a:hover {c:1}",
    "expected": [
      [],
      [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "a"
            },
            {
              "type": "COLON"
            },
            {
              "type": "IDENT",
              "value": "hover"
            },
            {
              "type": "WHITESPACE"
            }
          ],
          "declarations": [
            {
              "type": "DECLARATION",
              "name": "c",
              "value": [
                {
                  "type": "NUMBER",
                  "value": 1,
                  "isInteger": true
                }
              ],
              "important": false
            }
          ],
          "rules": []
        }
      ]
    ]
  },
  {
    "parser": "parseABlocksContents",
    "css": "z:x;a b{c:d}e:f",
    "expected": [
      [
        {
          "type": "DECLARATION",
          "name": "z",
          "value": [
            {
              "type": "IDENT",
              "value": "x"
            }
          ],
          "important": false
        },
        {
          "type": "DECLARATION",
          "name": "e",
          "value": [
            {
              "type": "IDENT",
              "value": "f"
            }
          ],
          "important": false
        }
      ],
      [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "a"
            },
            {
              "type": "WHITESPACE"
            },
            {
              "type": "IDENT",
              "value": "b"
            }
          ],
          "declarations": [
            {
              "type": "DECLARATION",
              "name": "c",
              "value": [
                {
                  "type": "IDENT",
                  "value": "d"
                }
              ],
              "important": false
            }
          ],
          "rules": []
        }
      ]
    ]
  },
  {
    "parser": "parseABlocksContents",
    "css": "",
    "expected": [
      [],
      []
    ]
  },
  {
    "parser": "parseABlocksContents",
    "css": `p { color: red; } @media print { p { color: green; } }`,
    "expected": [
      [],
      [
        {
          "type": "QUALIFIED-RULE",
          "prelude": [
            {
              "type": "IDENT",
              "value": "p"
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
            }
          ],
          "rules": []
        },
        {
          "type": "AT-RULE",
          "name": "media",
          "prelude": [
            {
              "type": "WHITESPACE"
            },
            {
              "type": "IDENT",
              "value": "print"
            },
            {
              "type": "WHITESPACE"
            }
          ],
          "declarations": [],
          "rules": [
            {
              "type": "QUALIFIED-RULE",
              "prelude": [
                {
                  "type": "IDENT",
                  "value": "p"
                },
                {
                  "type": "WHITESPACE"
                },
              ],
              "declarations": [
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
              "rules": []
            }
          ]
        }
      ]
    ]
  },

  // parseARule()
  {
    "parser": "parseARule",
    "css": "",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseARule",
    "css": "foo",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseARule",
    "css": "foo 4",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseARule",
    "css": "@foo",
    "expected": {
      "type": "AT-RULE",
      "name": "foo",
      "prelude": [],
      "declarations": null,
      "rules": null
    }
  },
  {
    "parser": "parseARule",
    "css": "@foo bar; \t/* comment */",
    "expected": {
      "type": "AT-RULE",
      "name": "foo",
      "prelude": [
        {
          "type": "WHITESPACE"
        },
        {
          "type": "IDENT",
          "value": "bar"
        }
      ],
      "declarations": null,
      "rules": null
    }
  },
  {
    "parser": "parseARule",
    "css": " /**/ @foo bar{[(4",
    "expected": {
      "type": "AT-RULE",
      "name": "foo",
      "prelude": [
        {
          "type": "WHITESPACE"
        },
        {
          "type": "IDENT",
          "value": "bar"
        }
      ],
      "declarations": [],
      "rules": []
    }
  },
  {
    "parser": "parseARule",
    "css": "@foo { bar",
    "expected": {
      "type": "AT-RULE",
      "name": "foo",
      "prelude": [
        {
          "type": "WHITESPACE"
        }
      ],
      "declarations": [],
      "rules": []
    }
  },
  {
    "parser": "parseARule",
    "css": "@foo [ bar",
    "expected": {
      "type": "AT-RULE",
      "name": "foo",
      "prelude": [
        {
          "type": "WHITESPACE"
        },
        {
          "type": "BLOCK",
          "name": "[",
          "value": [
            {
              "type": "WHITESPACE"
            },
            {
              "type": "IDENT",
              "value": "bar"
            }
          ]
        }
      ],
      "declarations": null,
      "rules": null
    }
  },
  {
    "parser": "parseARule",
    "css": " /**/ div > p { color: #aaa;  } /**/ ",
    "expected": {
      "type": "QUALIFIED-RULE",
      "prelude": [
        {
          "type": "IDENT",
          "value": "div"
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "DELIM",
          "value": ">"
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "IDENT",
          "value": "p"
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
              "type": "HASH",
              "value": "aaa",
              "isIdent": true
            }
          ],
          "important": false
        }
      ],
      "rules": []
    }
  },
  {
    "parser": "parseARule",
    "css": " /**/ { color: #aaa  ",
    "expected": {
      "type": "QUALIFIED-RULE",
      "prelude": [],
      "declarations": [
        {
          "type": "DECLARATION",
          "name": "color",
          "value": [
            {
              "type": "HASH",
              "value": "aaa",
              "isIdent": true
            }
          ],
          "important": false
        }
      ],
      "rules": []
    }
  },
  {
    "parser": "parseARule",
    "css": " /* CDO/CDC are not special */ <!-- --> {",
    "expected": {
      "type": "QUALIFIED-RULE",
      "prelude": [
        {
          "type": "CDO"
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "CDC"
        },
        {
          "type": "WHITESPACE"
        }
      ],
      "declarations": [],
      "rules": []
    }
  },
  {
    "parser": "parseARule",
    "css": "div { color: #aaa; } p{}",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseARule",
    "css": "div {} -->",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseARule",
    "css": "{}a",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },

  // parseADeclaration()
  {
    "parser": "parseADeclaration",
    "css": "",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "  /**/\n",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseADeclaration",
    "css": " ;",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "@foo:",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "#foo:",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseADeclaration",
    "css": ".foo:",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo*:",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo.. 9000",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo:",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [],
      "important": false
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo :",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [],
      "important": false
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "\n/**/ foo: ",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [],
      "important": false
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo:;",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [],
      "important": false
    }
  },
  {
    "parser": "parseADeclaration",
    "css": " /**/ foo /**/ :",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [],
      "important": false
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo:;bar:;",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [],
      "important": false
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo: 9000  !Important",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [
        {
          "type": "NUMBER",
          "value": 9000,
          "isInteger": true
        }
      ],
      "important": true
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo: 9000  ! /**/\t IMPORTant /**/\f",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [
        {
          "type": "NUMBER",
          "value": 9000,
          "isInteger": true
        }
      ],
      "important": true
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo: 9000  /* Dotted capital I */!İmportant",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [
        {
          "type": "NUMBER",
          "value": 9000,
          "isInteger": true
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "DELIM",
          "value": "!"
        },
        {
          "type": "IDENT",
          "value": "İmportant"
        }
      ],
      "important": false
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo: 9000  !important!",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [
        {
          "type": "NUMBER",
          "value": 9000,
          "isInteger": true
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "DELIM",
          "value": "!"
        },
        {
          "type": "IDENT",
          "value": "important"
        },
        {
          "type": "DELIM",
          "value": "!"
        }
      ],
      "important": false
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo: 9000  important",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [
        {
          "type": "NUMBER",
          "value": 9000,
          "isInteger": true
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "IDENT",
          "value": "important"
        }
      ],
      "important": false
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo:important",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [
        {
          "type": "IDENT",
          "value": "important"
        }
      ],
      "important": false
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo:{}",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [
        {
          "type": "BLOCK",
          "name": "{",
          "value": []
        }
      ],
      "important": false
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo: {}",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [
        {
          "type": "BLOCK",
          "name": "{",
          "value": []
        }
      ],
      "important": false
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo:{} ",
    "expected": {
      "type": "DECLARATION",
      "name": "foo",
      "value": [
        {
          "type": "BLOCK",
          "name": "{",
          "value": []
        }
      ],
      "important": false
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo:bar{}",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo:{}bar",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "foo:{}{}",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "-foo:bar{}",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseADeclaration",
    "css": "--foo:bar{}",
    "expected": {
      "type": "DECLARATION",
      "name": "--foo",
      "value": [
        {
          "type": "IDENT",
          "value": "bar"
        },
        {
          "type": "BLOCK",
          "name": "{",
          "value":  []
        }
      ],
      "important": false
    }
  },

  // parseAComponentValue()
  {
    "parser": "parseAComponentValue",
    "css": "",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseAComponentValue",
    "css": " ",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseAComponentValue",
    "css": "/**/",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseAComponentValue",
    "css": "  /**/\t/* a */\n\n",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },
  {
    "parser": "parseAComponentValue",
    "css": ".",
    "expected": {
      "type": "DELIM",
      "value": "."
    }
  },
  {
    "parser": "parseAComponentValue",
    "css": "a",
    "expected": {
      "type": "IDENT",
      "value": "a"
    }
  },
  {
    "parser": "parseAComponentValue",
    "css": "/**/ 4px",
    "expected": {
      "type": "DIMENSION",
      "value": 4,
      "isInteger": true,
      "unit": "px"
    }
  },
  {
    "parser": "parseAComponentValue",
    "css": "rgba(100%, 0%, 50%, .5)",
    "expected": {
      "type": "FUNCTION",
      "name": "rgba",
      "value": [
        {
          "type": "PERCENTAGE",
          "value": 100
        },
        {
          "type": "COMMA"
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "PERCENTAGE",
          "value": 0
        },
        {
          "type": "COMMA"
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "PERCENTAGE",
          "value": 50
        },
        {
          "type": "COMMA"
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "NUMBER",
          "value": 0.5,
          "isInteger": false
        }
      ]
    }
  },
  {
    "parser": "parseAComponentValue",
    "css": " /**/ { foo: bar; @baz [)",
    "expected": {
      "type": "BLOCK",
      "name": "{",
      "value": [
        {
          "type": "WHITESPACE"
        },
        {
          "type": "IDENT",
          "value": "foo"
        },
        {
          "type": "COLON"
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "IDENT",
          "value": "bar"
        },
        {
          "type": "SEMICOLON"
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "AT-KEYWORD",
          "value": "baz"
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "BLOCK",
          "name": "[",
          "value": [
            {
              "type": "CLOSE-PAREN"
            }
          ]
        }
      ]
    }
  },
  {
    "parser": "parseAComponentValue",
    "css": ".foo",
    "expectedThrow": {
      "name": "SyntaxError"
    }
  },

  // parseAListOfComponentValues()
  {
    "parser": "parseAListOfComponentValues",
    "css": "",
    "expected": []
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "/*/*///** /* **/*//* ",
    "expected": [
      {
        "type": "DELIM",
        "value": "/"
      },
      {
        "type": "DELIM",
        "value": "*"
      },
      {
        "type": "DELIM",
        "value": "/"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "red",
    "expected": [
      {
        "type": "IDENT",
        "value": "red"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "  \t\t\r\n\nRed ",
    "expected": [
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "Red"
      },
      {
        "type": "WHITESPACE"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "red/* CDC */-->",
    "expected": [
      {
        "type": "IDENT",
        "value": "red"
      },
      {
        "type": "CDC"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "red-->/* Not CDC */",
    "expected": [
      {
        "type": "IDENT",
        "value": "red--"
      },
      {
        "type": "DELIM",
        "value": ">"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "\\- red0 -red --red -\\-red\\ blue 0red -0red \x00red _Red .red rêd r\\êd \x7f\x80\x81",
    "expected": [
      {
        "type": "IDENT",
        "value": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "red0"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "-red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "--red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "--red blue"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 0,
        "isInteger": true,
        "unit": "red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 0,
        "isInteger": true,
        "unit": "red",
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "\uFFFDred"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "_Red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DELIM",
        "value": "."
      },
      {
        "type": "IDENT",
        "value": "red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "rêd"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "rêd"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DELIM",
        "value": "\x7f"
      },
      {
        "type": "DELIM",
        "value": "\x80"
      },
      {
        "type": "DELIM",
        "value": "\x81"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "\\30red \\00030 red \\30\r\nred \\0000000red \\1100000red \\red \\r ed \\.red \\ red \\\nred \\376\\37 6\\000376\\0000376\\",
    "expected": [
      {
        "type": "IDENT",
        "value": "0red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "0red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "0red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "\uFFFD0red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "\uFFFD0red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "r"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "ed"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": ".red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": " red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DELIM",
        "value": "\\"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "\u{0376}76\u{0376}76\uFFFD"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "rgba0('a' rgba1(a b rgba2(rgba3('b",
    "expected": [
      {
        "type": "FUNCTION",
        "name": "rgba0",
        "value": [
          {
            "type": "STRING",
            "value": "a"
          },
          {
            "type": "WHITESPACE"
          },
          {
            "type": "FUNCTION",
            "name": "rgba1",
            "value": [
              {
                "type": "IDENT",
                "value": "a"
              },
              {
                "type": "WHITESPACE"
              },
              {
                "type": "IDENT",
                "value": "b"
              },
              {
                "type": "WHITESPACE"
              },
              {
                "type": "FUNCTION",
                "name": "rgba2",
                "value": [
                  {
                    "type": "FUNCTION",
                    "name": "rgba3",
                    "value": [
                      {
                        "type": "STRING",
                        "value": "b"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "rgba0() -rgba() --rgba() -\\-rgba() 0rgba() -0rgba() _rgba() .rgba() rgbâ() \\30rgba() rgba () @rgba() #rgba()",
    "expected": [
      {
        "type": "FUNCTION",
        "name": "rgba0",
        "value": []
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "-rgba",
        "value": []
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "--rgba",
        "value": []
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "--rgba",
        "value": []
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 0,
        "isInteger": true,
        "unit": "rgba"
      },
      {
        "type": "BLOCK",
        "name": "(",
        "value": []
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 0,
        "isInteger": true,
        "unit": "rgba",
        "sign": "-"
      },
      {
        "type": "BLOCK",
        "name": "(",
        "value": []
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "_rgba",
        "value": []
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DELIM",
        "value": "."
      },
      {
        "type": "FUNCTION",
        "name": "rgba",
        "value": []
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "rgbâ",
        "value": []
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "0rgba",
        "value": []
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "rgba"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BLOCK",
        "name": "(",
        "value": []
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "AT-KEYWORD",
        "value": "rgba"
      },
      {
        "type": "BLOCK",
        "name": "(",
        "value": []
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "HASH",
        "value": "rgba",
        "isIdent": true
      },
      {
        "type": "BLOCK",
        "name": "(",
        "value": []
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "@media0 @-Media @--media @-\\-media @0media @-0media @_media @.media @medİa @\\30 media\\",
    "expected": [
      {
        "type": "AT-KEYWORD",
        "value": "media0"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "AT-KEYWORD",
        "value": "-Media"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "AT-KEYWORD",
        "value": "--media"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "AT-KEYWORD",
        "value": "--media"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DELIM",
        "value": "@"
      },
      {
        "type": "DIMENSION",
        "value": 0,
        "isInteger": true,
        "unit": "media"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DELIM",
        "value": "@"
      },
      {
        "type": "DIMENSION",
        "value": 0,
        "isInteger": true,
        "unit": "media",
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "AT-KEYWORD",
        "value": "_media"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DELIM",
        "value": "@"
      },
      {
        "type": "DELIM",
        "value": "."
      },
      {
        "type": "IDENT",
        "value": "media"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "AT-KEYWORD",
        "value": "medİa"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "AT-KEYWORD",
        "value": "0media\uFFFD"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "#red0 #-Red #--red #-\\-red #0red #-0red #_Red #.red #rêd #êrd #\\.red\\",
    "expected": [
      {
        "type": "HASH",
        "value": "red0",
        "isIdent": true
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "HASH",
        "value": "-Red",
        "isIdent": true
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "HASH",
        "value": "--red",
        "isIdent": true
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "HASH",
        "value": "--red",
        "isIdent": true
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "HASH",
        "value": "0red",
        "isIdent": false
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "HASH",
        "value": "-0red",
        "isIdent": false
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "HASH",
        "value": "_Red",
        "isIdent": true
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DELIM",
        "value": "#"
      },
      {
        "type": "DELIM",
        "value": "."
      },
      {
        "type": "IDENT",
        "value": "red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "HASH",
        "value": "rêd",
        "isIdent": true
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "HASH",
        "value": "êrd",
        "isIdent": true
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "HASH",
        "value": ".red\uFFFD",
        "isIdent": true
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "p[example=\"\\\nfoo(int x) {\\\n   this.x = x;\\\n}\\\n\"]",
    "expected": [
      {
        "type": "IDENT",
        "value": "p"
      },
      {
        "type": "BLOCK",
        "name": "[",
        "value": [
          {
            "type": "IDENT",
            "value": "example"
          },
          {
            "type": "DELIM",
            "value": "="
          },
          {
            "type": "STRING",
            "value": "foo(int x) {   this.x = x;}"
          }
        ]
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "'' 'Lorem \"îpsum\"' 'a\\\nb' 'a\nb 'eof",
    "expected": [
      {
        "type": "STRING",
        "value": ""
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "STRING",
        "value": "Lorem \"îpsum\""
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "STRING",
        "value": "ab"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADSTRING"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "b"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "STRING",
        "value": "eof"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "\"\" \"Lorem 'îpsum'\" \"a\\\nb\" \"a\nb \"eof",
    "expected": [
      {
        "type": "STRING",
        "value": ""
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "STRING",
        "value": "Lorem 'îpsum'"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "STRING",
        "value": "ab"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADSTRING"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "b"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "STRING",
        "value": "eof"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "\"Lo\\rem \\130 ps\\u m\" '\\376\\37 6\\000376\\0000376\\",
    "expected": [
      {
        "type": "STRING",
        "value": "Lorem İpsu m"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "STRING",
        "value": "\u{0376}76\u{0376}76"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "url( '') url('Lorem \"îpsum\"'\n) url('a\\\nb' ) url('a\nb) url('eof",
    "expected": [
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "WHITESPACE"
          },
          {
            "type": "STRING",
            "value": ""
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "STRING",
            "value": "Lorem \"îpsum\""
          },
          {
            "type": "WHITESPACE"
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "STRING",
            "value": "ab"
          },
          {
            "type": "WHITESPACE"
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "BADSTRING"
          },
          {
            "type": "WHITESPACE"
          },
          {
            "type": "IDENT",
            "value": "b"
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "STRING",
            "value": "eof"
          }
        ]
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "url(",
    "expected": [
      {
        "type": "URL",
        "value": ""
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "url( \t",
    "expected": [
      {
        "type": "URL",
        "value": ""
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "url(\"\") url(\"Lorem 'îpsum'\"\n) url(\"a\\\nb\" ) url(\"a\nb) url(\"eof",
    "expected": [
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "STRING",
            "value": ""
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "STRING",
            "value": "Lorem 'îpsum'"
          },
          {
            "type": "WHITESPACE"
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "STRING",
            "value": "ab"
          },
          {
            "type": "WHITESPACE"
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "BADSTRING"
          },
          {
            "type": "WHITESPACE"
          },
          {
            "type": "IDENT",
            "value": "b"
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "STRING",
            "value": "eof"
          }
        ]
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "url(\"Lo\\rem \\130 ps\\u m\") url('\\376\\37 6\\000376\\0000376\\",
    "expected": [
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "STRING",
            "value": "Lorem İpsu m"
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "STRING",
            "value": "\u{0376}76\u{0376}76"
          }
        ]
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "URL(foo) Url(foo) ûrl(foo) url (foo) url\\ (foo) url(\t 'foo' ",
    "expected": [
      {
        "type": "URL",
        "value": "foo"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "URL",
        "value": "foo"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "ûrl",
        "value": [
          {
            "type": "IDENT",
            "value": "foo"
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "url"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BLOCK",
        "name": "(",
        "value": [
          {
            "type": "IDENT",
            "value": "foo"
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "url ",
        "value": [
          {
            "type": "IDENT",
            "value": "foo"
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "WHITESPACE"
          },
          {
            "type": "STRING",
            "value": "foo"
          },
          {
            "type": "WHITESPACE"
          }
        ]
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "url('a' b) url('c' d)",
    "expected": [
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "STRING",
            "value": "a"
          },
          {
            "type": "WHITESPACE"
          },
          {
            "type": "IDENT",
            "value": "b"
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "STRING",
            "value": "c"
          },
          {
            "type": "WHITESPACE"
          },
          {
            "type": "IDENT",
            "value": "d"
          }
        ]
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "url('a\nb) url('c\n",
    "expected": [
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "BADSTRING"
          },
          {
            "type": "WHITESPACE"
          },
          {
            "type": "IDENT",
            "value": "b"
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "FUNCTION",
        "name": "url",
        "value": [
          {
            "type": "BADSTRING"
          },
          {
            "type": "WHITESPACE"
          }
        ]
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "url() url( \t) url(\n Foô\\030\n!\n) url(\na\nb\n) url(a\\ b) url(a(b) url(a\\(b) url(a'b) url(a\\'b) url(a\"b) url(a\\\"b) url(a\nb) url(a\\\nb) url(a\\a b) url(a\\",
    "expected": [
      {
        "type": "URL",
        "value": ""
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "URL",
        "value": ""
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "URL",
        "value": "Foô0!"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "URL",
        "value": "a b"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "URL",
        "value": "a(b"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "URL",
        "value": "a'b"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "URL",
        "value": "a\"b"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "URL",
        "value": "a\nb"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "URL",
        "value": "a\uFFFD"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "url(\x00!#$%&*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~\x80\x81 ¡¢",
    "expected": [
      {
        "type": "URL",
        "value": "\uFFFD!#$%&*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~\x80\x81 ¡¢"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "url(\x01) url(\x02) url(\x03) url(\x04) url(\x05) url(\x06) url(\x07) url(\x08) url(\x0b) url(\x0e) url(\x0f) url(\x10) url(\x11) url(\x12) url(\x13) url(\x14) url(\x15) url(\x16) url(\x17) url(\x18) url(\x19) url(\x1a) url(\x1b) url(\x1c) url(\x1d) url(\x1e) url(\x1f) url(\x7f)",
    "expected": [
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BADURL"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "12 +34 -45 .67 +.89 -.01 2.3 +45.0 -0.67",
    "expected": [
      {
        "type": "NUMBER",
        "value": 12,
        "isInteger": true
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 34,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": -45,
        "isInteger": true,
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 0.67,
        "isInteger": false
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 0.89,
        "isInteger": false,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": -0.01,
        "isInteger": false,
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 2.3,
        "isInteger": false
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 45,
        "isInteger": false,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": -0.67,
        "isInteger": false,
        "sign": "-"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "12e2 +34e+1 -45E-0 .68e+3 +.79e-1 -.01E2 2.3E+1 +45.0e6 -0.67e0",
    "expected": [
      {
        "type": "NUMBER",
        "value": 1200,
        "isInteger": false
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 340,
        "isInteger": false,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": -45,
        "isInteger": false,
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 680,
        "isInteger": false
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 0.079,
        "isInteger": false,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": -1,
        "isInteger": false,
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 23,
        "isInteger": false
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 45000000,
        "isInteger": false,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": -0.67,
        "isInteger": false,
        "sign": "-"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "3. /* Decimal point must have following digits */",
    "expected": [
      {
        "type": "NUMBER",
        "value": 3,
        "isInteger": true
      },
      {
        "type": "DELIM",
        "value": "."
      },
      {
        "type": "WHITESPACE"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "3\\65-2 /* Scientific notation E can not be escaped */",
    "expected": [
      {
        "type": "DIMENSION",
        "value": 3,
        "isInteger": true,
        "unit": "e-2"
      },
      {
        "type": "WHITESPACE"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "3e-2.1 /* Integer exponents only */",
    "expected": [
      {
        "type": "NUMBER",
        "value": 0.03,
        "isInteger": false
      },
      {
        "type": "NUMBER",
        "value": 0.1,
        "isInteger": false
      },
      {
        "type": "WHITESPACE"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "12% +34% -45% .67% +.89% -.01% 2.3% +45.0% -0.67%",
    "expected": [
      {
        "type": "PERCENTAGE",
        "value": 12
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": 34,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": -45,
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": 0.67
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": 0.89,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": -0.01,
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": 2.3
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": 45,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": -0.67,
        "sign": "-"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "12e2% +34e+1% -45E-0% .68e+3% +.79e-1% -.01E2% 2.3E+1% +45.0e6% -0.67e0%",
    "expected": [
      {
        "type": "PERCENTAGE",
        "value": 1200
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": 340,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": -45,
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": 680
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": 0.079,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": -1,
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": 23
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": 45000000,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "PERCENTAGE",
        "value": -0.67,
        "sign": "-"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "12\\% /* Percent sign can not be escaped */",
    "expected": [
      {
        "type": "DIMENSION",
        "value": 12,
        "isInteger": true,
        "unit": "%"
      },
      {
        "type": "WHITESPACE"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "12px +34px -45px .67px +.89px -.01px 2.3px +45.0px -0.67px",
    "expected": [
      {
        "type": "DIMENSION",
        "value": 12,
        "isInteger": true,
        "unit": "px"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 34,
        "isInteger": true,
        "unit": "px",
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": -45,
        "isInteger": true,
        "unit": "px",
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 0.67,
        "isInteger": false,
        "unit": "px"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 0.89,
        "isInteger": false,
        "unit": "px",
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": -0.01,
        "isInteger": false,
        "unit": "px",
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 2.3,
        "isInteger": false,
        "unit": "px"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 45,
        "isInteger": false,
        "unit": "px",
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": -0.67,
        "isInteger": false,
        "unit": "px",
        "sign": "-"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "12e2px +34e+1px -45E-0px .68e+3px +.79e-1px -.01E2px 2.3E+1px +45.0e6px -0.67e0px",
    "expected": [
      {
        "type": "DIMENSION",
        "value": 1200,
        "isInteger": false,
        "unit": "px"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 340,
        "isInteger": false,
        "unit": "px",
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": -45,
        "isInteger": false,
        "unit": "px",
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 680,
        "isInteger": false,
        "unit": "px"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 0.079,
        "isInteger": false,
        "unit": "px",
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": -1,
        "isInteger": false,
        "unit": "px",
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 23,
        "isInteger": false,
        "unit": "px"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 45000000,
        "isInteger": false,
        "unit": "px",
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": -0.67,
        "isInteger": false,
        "unit": "px",
        "sign": "-"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "12red0 12.0-red 12--red 12-\\-red 120red 12-0red 12\x00red 12_Red 12.red 12rêd",
    "expected": [
      {
        "type": "DIMENSION",
        "value": 12,
        "isInteger": true,
        "unit": "red0"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 12,
        "isInteger": false,
        "unit": "-red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 12,
        "isInteger": true,
        "unit": "--red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 12,
        "isInteger": true,
        "unit": "--red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 120,
        "isInteger": true,
        "unit": "red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 12,
        "isInteger": true
      },
      {
        "type": "DIMENSION",
        "value": 0,
        "isInteger": true,
        "unit": "red",
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 12,
        "isInteger": true,
        "unit": "\uFFFDred"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 12,
        "isInteger": true,
        "unit": "_Red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 12,
        "isInteger": true
      },
      {
        "type": "DELIM",
        "value": "."
      },
      {
        "type": "IDENT",
        "value": "red"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DIMENSION",
        "value": 12,
        "isInteger": true,
        "unit": "rêd"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "u+1 U+10 U+100 U+1000 U+10000 U+100000 U+1000000",
    "expected": [
      {
        "type": "IDENT",
        "value": "u"
      },
      {
        "type": "NUMBER",
        "value": 1,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 10,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 100,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 1000,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 10000,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 100000,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 1000000,
        "isInteger": true,
        "sign": "+"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "u+? u+1? U+10? U+100? U+1000? U+10000? U+100000?",
    "expected": [
      {
        "type": "IDENT",
        "value": "u"
      },
      {
        "type": "DELIM",
        "value": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "u"
      },
      {
        "type": "NUMBER",
        "value": 1,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 10,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 100,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 1000,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 10000,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 100000,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "u+?? U+1?? U+10?? U+100?? U+1000?? U+10000??",
    "expected": [
      {
        "type": "IDENT",
        "value": "u"
      },
      {
        "type": "DELIM",
        "value": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 1,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 10,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 100,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 1000,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 10000,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "u+??? U+1??? U+10??? U+100??? U+1000???",
    "expected": [
      {
        "type": "IDENT",
        "value": "u"
      },
      {
        "type": "DELIM",
        "value": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 1,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 10,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 100,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 1000,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "u+???? U+1???? U+10???? U+100????",
    "expected": [
      {
        "type": "IDENT",
        "value": "u"
      },
      {
        "type": "DELIM",
        "value": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 1,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 10,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 100,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "u+????? U+1????? U+10?????",
    "expected": [
      {
        "type": "IDENT",
        "value": "u"
      },
      {
        "type": "DELIM",
        "value": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 1,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 10,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "u+?????? U+1??????",
    "expected": [
      {
        "type": "IDENT",
        "value": "u"
      },
      {
        "type": "DELIM",
        "value": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 1,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "DELIM",
        "value": "?"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "u+1-2 U+100000-2 U+1000000-2 U+10-200000",
    "expected": [
      {
        "type": "IDENT",
        "value": "u"
      },
      {
        "type": "NUMBER",
        "value": 1,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "NUMBER",
        "value": -2,
        "isInteger": true,
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 100000,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "NUMBER",
        "value": -2,
        "isInteger": true,
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 1000000,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "NUMBER",
        "value": -2,
        "isInteger": true,
        "sign": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 10,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "NUMBER",
        "value": -200000,
        "isInteger": true,
        "sign": "-"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "ù+12 Ü+12 u +12 U+ 12 U+12 - 20 U+1?2 U+1?-50",
    "expected": [
      {
        "type": "IDENT",
        "value": "ù"
      },
      {
        "type": "NUMBER",
        "value": 12,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "Ü"
      },
      {
        "type": "NUMBER",
        "value": 12,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "u"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 12,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "DELIM",
        "value": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 12,
        "isInteger": true
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 12,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DELIM",
        "value": "-"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "NUMBER",
        "value": 20,
        "isInteger": true
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 1,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "NUMBER",
        "value": 2,
        "isInteger": true
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "U"
      },
      {
        "type": "NUMBER",
        "value": 1,
        "isInteger": true,
        "sign": "+"
      },
      {
        "type": "DELIM",
        "value": "?"
      },
      {
        "type": "NUMBER",
        "value": -50,
        "isInteger": true,
        "sign": "-"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "3n+1",
    "expected": [
      {
        "type": "DIMENSION",
        "value": 3,
        "isInteger": true,
        "unit": "n"
      },
      {
        "type": "NUMBER",
        "value": 1,
        "isInteger": true,
        "sign": "+"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "+3n+1",
    "expected": [
      {
        "type": "DIMENSION",
        "value": 3,
        "isInteger": true,
        "unit": "n",
        "sign": "+"
      },
      {
        "type": "NUMBER",
        "value": 1,
        "isInteger": true,
        "sign": "+"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "-3n+1",
    "expected": [
      {
        "type": "DIMENSION",
        "value": -3,
        "isInteger": true,
        "unit": "n",
        "sign": "-"
      },
      {
        "type": "NUMBER",
        "value": 1,
        "isInteger": true,
        "sign": "+"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "n+2",
    "expected": [
      {
        "type": "IDENT",
        "value": "n"
      },
      {
        "type": "NUMBER",
        "value": 2,
        "isInteger": true,
        "sign": "+"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "+n+2",
    "expected": [
      {
        "type": "DELIM",
        "value": "+"
      },
      {
        "type": "IDENT",
        "value": "n"
      },
      {
        "type": "NUMBER",
        "value": 2,
        "isInteger": true,
        "sign": "+"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "-n+2",
    "expected": [
      {
        "type": "IDENT",
        "value": "-n"
      },
      {
        "type": "NUMBER",
        "value": 2,
        "isInteger": true,
        "sign": "+"
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "~=|=^=$=*=||<!------> |/**/| ~/**/=",
    "expected": [
      {
        "type": "DELIM",
        "value": "~"
      },
      {
        "type": "DELIM",
        "value": "="
      },
      {
        "type": "DELIM",
        "value": "|"
      },
      {
        "type": "DELIM",
        "value": "="
      },
      {
        "type": "DELIM",
        "value": "^"
      },
      {
        "type": "DELIM",
        "value": "="
      },
      {
        "type": "DELIM",
        "value": "$"
      },
      {
        "type": "DELIM",
        "value": "="
      },
      {
        "type": "DELIM",
        "value": "*"
      },
      {
        "type": "DELIM",
        "value": "="
      },
      {
        "type": "DELIM",
        "value": "|"
      },
      {
        "type": "DELIM",
        "value": "|"
      },
      {
        "type": "CDO"
      },
      {
        "type": "IDENT",
        "value": "----"
      },
      {
        "type": "DELIM",
        "value": ">"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DELIM",
        "value": "|"
      },
      {
        "type": "DELIM",
        "value": "|"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "DELIM",
        "value": "~"
      },
      {
        "type": "DELIM",
        "value": "="
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "a:not([href^=http\\:],  [href ^=\t'https\\:'\n]) { color: rgba(0%, 100%, 50%); }",
    "expected": [
      {
        "type": "IDENT",
        "value": "a"
      },
      {
        "type": "COLON"
      },
      {
        "type": "FUNCTION",
        "name": "not",
        "value": [
          {
            "type": "BLOCK",
            "name": "[",
            "value": [
              {
                "type": "IDENT",
                "value": "href"
              },
              {
                "type": "DELIM",
                "value": "^"
              },
              {
                "type": "DELIM",
                "value": "="
              },
              {
                "type": "IDENT",
                "value": "http:"
              }
            ]
          },
          {
            "type": "COMMA"
          },
          {
            "type": "WHITESPACE"
          },
          {
            "type": "BLOCK",
            "name": "[",
            "value": [
              {
                "type": "IDENT",
                "value": "href"
              },
              {
                "type": "WHITESPACE"
              },
              {
                "type": "DELIM",
                "value": "^"
              },
              {
                "type": "DELIM",
                "value": "="
              },
              {
                "type": "WHITESPACE"
              },
              {
                "type": "STRING",
                "value": "https:"
              },
              {
                "type": "WHITESPACE"
              }
            ]
          }
        ]
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BLOCK",
        "name": "{",
        "value": [
          {
            "type": "WHITESPACE"
          },
          {
            "type": "IDENT",
            "value": "color"
          },
          {
            "type": "COLON"
          },
          {
            "type": "WHITESPACE"
          },
          {
            "type": "FUNCTION",
            "name": "rgba",
            "value": [
              {
                "type": "PERCENTAGE",
                "value": 0
              },
              {
                "type": "COMMA"
              },
              {
                "type": "WHITESPACE"
              },
              {
                "type": "PERCENTAGE",
                "value": 100
              },
              {
                "type": "COMMA"
              },
              {
                "type": "WHITESPACE"
              },
              {
                "type": "PERCENTAGE",
                "value": 50
              }
            ]
          },
          {
            "type": "SEMICOLON"
          },
          {
            "type": "WHITESPACE"
          }
        ]
      }
    ]
  },
  {
    "parser": "parseAListOfComponentValues",
    "css": "@media print { (foo]{bar) }baz",
    "expected": [
      {
        "type": "AT-KEYWORD",
        "value": "media"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "IDENT",
        "value": "print"
      },
      {
        "type": "WHITESPACE"
      },
      {
        "type": "BLOCK",
        "name": "{",
        "value": [
          {
            "type": "WHITESPACE"
          },
          {
            "type": "BLOCK",
            "name": "(",
            "value": [
              {
                "type": "IDENT",
                "value": "foo"
              },
              {
                "type": "CLOSE-SQUARE"
              },
              {
                "type": "BLOCK",
                "name": "{",
                "value": [
                  {
                    "type": "IDENT",
                    "value": "bar"
                  },
                  {
                    "type": "CLOSE-PAREN"
                  },
                  {
                    "type": "WHITESPACE"
                  }
                ]
              },
              {
                "type": "IDENT",
                "value": "baz"
              }
            ]
          }
        ]
      }
    ]
  },

  // parseACommaSeparatedListOfComponentValues()
  {
    "parser": "parseACommaSeparatedListOfComponentValues",
    "css": "",
    "expected": []
  },
  {
    "parser": "parseACommaSeparatedListOfComponentValues",
    "css": "foo ,bar, baz",
    "expected": [
      [
        {
          "type": "IDENT",
          "value": "foo"
        },
        {
          "type": "WHITESPACE"
        }
      ],
      [
        {
          "type": "IDENT",
          "value": "bar"
        }
      ],
      [
        {
          "type": "WHITESPACE"
        },
        {
          "type": "IDENT",
          "value": "baz"
        }
      ]
    ]
  },
  {
    "parser": "parseACommaSeparatedListOfComponentValues",
    "css": "foo bar, baz qua",
    "expected": [
      [
        {
          "type": "IDENT",
          "value": "foo"
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "IDENT",
          "value": "bar"
        }
      ],
      [
        {
          "type": "WHITESPACE"
        },
        {
          "type": "IDENT",
          "value": "baz"
        },
        {
          "type": "WHITESPACE"
        },
        {
          "type": "IDENT",
          "value": "qua"
        }
      ]
    ]
  },
  {
    "parser": "parseACommaSeparatedListOfComponentValues",
    "css": "foo{}}",
    "expected": [
      [
        {
          "type": "IDENT",
          "value": "foo"
        },
        {
          "type": "BLOCK",
          "name": "{",
          "value": []
        },
        {
          "type": "CLOSE-CURLY"
        }
      ]
    ]
  },
  {
    "parser": "parseACommaSeparatedListOfComponentValues",
    "css": "var(--abc,--def)",
    "expected": [
      [
        {
          "type": "FUNCTION",
          "name": "var",
          "value": [
            {
              "type": "IDENT",
              "value": "--abc"
            },
            {
              "type": "COMMA"
            },
            {
              "type": "IDENT",
              "value": "--def"
            }
          ]
        }
      ]
    ]
  }
];

}));

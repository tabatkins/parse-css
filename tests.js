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
      {TYPE: "IDENT", value: "\u{20000}"},
      {TYPE: "COMMA"},
      {TYPE: "IDENT", value: "\uFFFD"},
      {TYPE: "COMMA"},
      {TYPE: "IDENT", value: "\uFFFD"},
      {TYPE: "COMMA"},
      {TYPE: "IDENT", value: "\uFFFD"},
      {TYPE: "EOF"},
    ]
  },

  // tokenize()

  // -- SingleCharacterTokens
  {
    parser: "",
    css: "(",
    expected: [{TYPE: "OPEN-PAREN"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: ")",
    expected: [{TYPE: "CLOSE-PAREN"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "[",
    expected: [{TYPE: "OPEN-SQUARE"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "]",
    expected: [{TYPE: "CLOSE-SQUARE"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: ",",
    expected: [{TYPE: "COMMA"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: ":",
    expected: [{TYPE: "COLON"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: ";",
    expected: [{TYPE: "SEMICOLON"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: ")[",
    expected: [{TYPE: "CLOSE-PAREN"}, {TYPE: "OPEN-SQUARE"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "[)",
    expected: [{TYPE: "OPEN-SQUARE"}, {TYPE: "CLOSE-PAREN"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "{}",
    expected: [{TYPE: "OPEN-CURLY"}, {TYPE: "CLOSE-CURLY"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: ",,",
    expected: [{TYPE: "COMMA"}, {TYPE: "COMMA"}, {TYPE: "EOF"}],
  },

  // -- MultipleCharacterTokens
  {
    parser: "",
    css: "~=",
    expected: [{TYPE: "DELIM", value: '~'}, {TYPE: "DELIM", value: '='}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "|=",
    expected: [{TYPE: "DELIM", value: '|'}, {TYPE: "DELIM", value: '='}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "^=",
    expected: [{TYPE: "DELIM", value: '^'}, {TYPE: "DELIM", value: '='}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "$=",
    expected: [{TYPE: "DELIM", value: '$'}, {TYPE: "DELIM", value: '='}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "*=",
    expected: [{TYPE: "DELIM", value: '*'}, {TYPE: "DELIM", value: '='}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "||",
    expected: [{TYPE: "DELIM", value: '|'}, {TYPE: "DELIM", value: '|'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "|||",
    expected: [{TYPE: "DELIM", value: '|'}, {TYPE: "DELIM", value: '|'}, {TYPE: "DELIM", value: '|'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "<!--",
    expected: [{TYPE: "CDO"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "<!---",
    expected: [{TYPE: "CDO"}, {TYPE: "DELIM", value: '-'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "-->",
    expected: [{TYPE: "CDC"}, {TYPE: "EOF"}],
  },

  // -- DelimiterToken
  {
    parser: "",
    css: "^",
    expected: [{TYPE: "DELIM", value: '^'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "*",
    expected: [{TYPE: "DELIM", value: '*'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "%",
    expected: [{TYPE: "DELIM", value: '%'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "~",
    expected: [{TYPE: "DELIM", value: '~'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "&",
    expected: [{TYPE: "DELIM", value: '&'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "|",
    expected: [{TYPE: "DELIM", value: '|'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\x7f",
    expected: [{TYPE: "DELIM", value: '\x7f'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\x01",
    expected: [{TYPE: "DELIM", value: '\x01'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "~-",
    expected: [{TYPE: "DELIM", value: '~'}, {TYPE: "DELIM", value: '-'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "^|",
    expected: [{TYPE: "DELIM", value: '^'}, {TYPE: "DELIM", value: '|'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "$~",
    expected: [{TYPE: "DELIM", value: '$'}, {TYPE: "DELIM", value: '~'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "*^",
    expected: [{TYPE: "DELIM", value: '*'}, {TYPE: "DELIM", value: '^'}, {TYPE: "EOF"}],
  },

  // -- WhitespaceTokens
  {
    parser: "",
    css: "   ",
    expected: [{TYPE: "WHITESPACE"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\n\rS",
    expected: [{TYPE: "WHITESPACE"}, {TYPE: "IDENT", value: "S"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "   *",
    expected: [{TYPE: "WHITESPACE"}, {TYPE: "DELIM", value: '*'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\r\n\f\t2",
    expected: [{TYPE: "WHITESPACE"}, {TYPE: "NUMBER", value: 2, type: "integer"}, {TYPE: "EOF"}],
  },

  // -- Escapes
  {
    parser: "",
    css: "hel\\6Co",
    expected: [{TYPE: "IDENT", value: "hello"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\\26 B",
    expected: [{TYPE: "IDENT", value: "&B"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'hel\\6c o'",
    expected: [{TYPE: "STRING", value: "hello"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'spac\\65\r\ns'",
    expected: [{TYPE: "STRING", value: "spaces"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "spac\\65\r\ns",
    expected: [{TYPE: "IDENT", value: "spaces"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "spac\\65\n\rs",
    expected: [{TYPE: "IDENT", value: "space"}, {TYPE: "WHITESPACE"}, {TYPE: "IDENT", value: "s"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "sp\\61\tc\\65\fs",
    expected: [{TYPE: "IDENT", value: "spaces"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "hel\\6c  o",
    expected: [{TYPE: "IDENT", value: "hell"}, {TYPE: "WHITESPACE"}, {TYPE: "IDENT", value: "o"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "test\\\n",
    expected: [{TYPE: "IDENT", value: "test"}, {TYPE: "DELIM", value: '\\'}, {TYPE: "WHITESPACE"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "test\\D799",
    expected: [{TYPE: "IDENT", value: "test\uD799"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\\E000",
    expected: [{TYPE: "IDENT", value: "\uE000"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "te\\s\\t",
    expected: [{TYPE: "IDENT", value: "test"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "spaces\\ in\\\tident",
    expected: [{TYPE: "IDENT", value: "spaces in\tident"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\\.\\,\\:\\!",
    expected: [{TYPE: "IDENT", value: ".,:!"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\\\r",
    expected: [{TYPE: "DELIM", value: '\\'}, {TYPE: "WHITESPACE"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\\\f",
    expected: [{TYPE: "DELIM", value: '\\'}, {TYPE: "WHITESPACE"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\\\r\n",
    expected: [{TYPE: "DELIM", value: '\\'}, {TYPE: "WHITESPACE"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "null\\\0",
    expected: [{TYPE: "IDENT", value: "null\uFFFD"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "null\\\0\0",
    expected: [{TYPE: "IDENT", value: "null\uFFFD\uFFFD"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "null\\0",
    expected: [{TYPE: "IDENT", value: "null\uFFFD"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "null\\0",
    expected: [{TYPE: "IDENT", value: "null\uFFFD"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "null\\0000",
    expected: [{TYPE: "IDENT", value: "null\uFFFD"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "large\\110000",
    expected: [{TYPE: "IDENT", value: "large\uFFFD"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "large\\23456a",
    expected: [{TYPE: "IDENT", value: "large\uFFFD"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "surrogate\\D800",
    expected: [{TYPE: "IDENT", value: "surrogate\uFFFD"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "surrogate\\0DABC",
    expected: [{TYPE: "IDENT", value: "surrogate\uFFFD"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\\00DFFFsurrogate",
    expected: [{TYPE: "IDENT", value: "\uFFFDsurrogate"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\\10fFfF",
    expected: [{TYPE: "IDENT", value: "\u{10ffff}"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\\10fFfF0",
    expected: [{TYPE: "IDENT", value: "\u{10ffff}0"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\\10000000",
    expected: [{TYPE: "IDENT", value: "\u{100000}00"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "eof\\",
    expected: [{TYPE: "IDENT", value: "eof\uFFFD"}, {TYPE: "EOF"}],
  },

  // -- IdentToken
  {
    parser: "",
    css: "simple-ident",
    expected: [{TYPE: "IDENT", value: "simple-ident"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "testing123",
    expected: [{TYPE: "IDENT", value: "testing123"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "hello!",
    expected: [{TYPE: "IDENT", value: "hello"}, {TYPE: "DELIM", value: '!'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "world\x05",
    expected: [{TYPE: "IDENT", value: "world"}, {TYPE: "DELIM", value: '\x05'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "_under score",
    expected: [{TYPE: "IDENT", value: "_under"}, {TYPE: "WHITESPACE"}, {TYPE: "IDENT", value: "score"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "-_underscore",
    expected: [{TYPE: "IDENT", value: "-_underscore"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "-text",
    expected: [{TYPE: "IDENT", value: "-text"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "-\\6d",
    expected: [{TYPE: "IDENT", value: "-m"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "--abc",
    expected: [{TYPE: "IDENT", value: "--abc"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "--",
    expected: [{TYPE: "IDENT", value: "--"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "--11",
    expected: [{TYPE: "IDENT", value: "--11"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "---",
    expected: [{TYPE: "IDENT", value: "---"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\u2003",  // em-space
    expected: [{TYPE: "DELIM", value: "\u2003"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\u{A0}",  // non-breaking space
    expected: [{TYPE: "DELIM", value: "\u{A0}"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\u1234",
    expected: [{TYPE: "IDENT", value: "\u1234"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\u{12345}",
    expected: [{TYPE: "IDENT", value: "\u{12345}"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\0",
    expected: [{TYPE: "IDENT", value: "\uFFFD"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "ab\0c",
    expected: [{TYPE: "IDENT", value: "ab\uFFFDc"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "ab\0c",
    expected: [{TYPE: "IDENT", value: "ab\uFFFDc"}, {TYPE: "EOF"}],
  },

  // -- FunctionToken
  {
    parser: "",
    css: "scale(2)",
    expected: [{TYPE: "FUNCTION", value: "scale"}, {TYPE: "NUMBER", value: 2, type: "integer"}, {TYPE: "CLOSE-PAREN"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "foo-bar\\ baz(",
    expected: [{TYPE: "FUNCTION", value: "foo-bar baz"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "fun\\(ction(",
    expected: [{TYPE: "FUNCTION", value: "fun(ction"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "-foo(",
    expected: [{TYPE: "FUNCTION", value: "-foo"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "url(\"foo.gif\"",
    expected: [{TYPE: "FUNCTION", value: "url"}, {TYPE: "STRING", value: "foo.gif"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "foo(  \'bar.gif\'",
    expected: [{TYPE: "FUNCTION", value: "foo"}, {TYPE: "WHITESPACE"}, {TYPE: "STRING", value: "bar.gif"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "url(  \'bar.gif\'",
    expected: [{TYPE: "FUNCTION", value: "url"}, {TYPE: "WHITESPACE"}, {TYPE: "STRING", value: "bar.gif"}, {TYPE: "EOF"}],
  },

  // -- AtKeywordToken
  {
    parser: "",
    css: "@at-keyword",
    expected: [{TYPE: "AT-KEYWORD", value: "at-keyword"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "@testing123",
    expected: [{TYPE: "AT-KEYWORD", value: "testing123"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "@hello!",
    expected: [{TYPE: "AT-KEYWORD", value: "hello"}, {TYPE: "DELIM", value: '!'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "@-text",
    expected: [{TYPE: "AT-KEYWORD", value: "-text"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "@--abc",
    expected: [{TYPE: "AT-KEYWORD", value: "--abc"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "@--",
    expected: [{TYPE: "AT-KEYWORD", value: "--"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "@--11",
    expected: [{TYPE: "AT-KEYWORD", value: "--11"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "@---",
    expected: [{TYPE: "AT-KEYWORD", value: "---"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "@\\ ",
    expected: [{TYPE: "AT-KEYWORD", value: " "}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "@-\\ ",
    expected: [{TYPE: "AT-KEYWORD", value: "- "}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "@@",
    expected: [{TYPE: "DELIM", value: '@'}, {TYPE: "DELIM", value: '@'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "@2",
    expected: [{TYPE: "DELIM", value: '@'}, {TYPE: "NUMBER", value: 2, type: "integer"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "@-1",
    expected: [{TYPE: "DELIM", value: '@'}, {TYPE: "NUMBER", value: -1, type: "integer", sign: "-"}, {TYPE: "EOF"}],
  },

  // -- UrlToken
  {
    parser: "",
    css: "url(foo.gif)",
    expected: [{TYPE: "URL", value: "foo.gif"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "urL(https://example.com/cats.png)",
    expected: [{TYPE: "URL", value: "https://example.com/cats.png"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "uRl(what-a.crazy^URL~this\\ is!)",
    expected: [{TYPE: "URL", value: "what-a.crazy^URL~this is!"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "uRL(123#test)",
    expected: [{TYPE: "URL", value: "123#test"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "Url(escapes\\ \\\"\\'\\)\\()",
    expected: [{TYPE: "URL", value: "escapes \"')("}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "UrL(   whitespace   )",
    expected: [{TYPE: "URL", value: "whitespace"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "URl( whitespace-eof ",
    expected: [{TYPE: "URL", value: "whitespace-eof"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "URL(eof",
    expected: [{TYPE: "URL", value: "eof"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "url(not/*a*/comment)",
    expected: [{TYPE: "URL", value: "not/*a*/comment"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "urL()",
    expected: [{TYPE: "URL", value: ""}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "uRl(white space),",
    expected: [{TYPE: "BADURL"}, {TYPE: "COMMA"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "Url(b(ad),",
    expected: [{TYPE: "BADURL"}, {TYPE: "COMMA"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "uRl(ba'd):",
    expected: [{TYPE: "BADURL"}, {TYPE: "COLON"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "urL(b\"ad):",
    expected: [{TYPE: "BADURL"}, {TYPE: "COLON"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "uRl(b\"ad):",
    expected: [{TYPE: "BADURL"}, {TYPE: "COLON"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "Url(b\\\rad):",
    expected: [{TYPE: "BADURL"}, {TYPE: "COLON"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "url(b\\\nad):",
    expected: [{TYPE: "BADURL"}, {TYPE: "COLON"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "url(/*'bad')*/",
    expected: [{TYPE: "BADURL"}, {TYPE: "DELIM", value: '*'}, {TYPE: "DELIM", value: '/'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "url(ba'd\\))",
    expected: [{TYPE: "BADURL"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "url(ba'd\\\\))",
    expected: [{TYPE: "BADURL"}, {TYPE: "CLOSE-PAREN"}, {TYPE: "EOF"}],
  },

  // -- StringToken
  {
    parser: "",
    css: "'text'",
    expected: [{TYPE: "STRING", value: "text"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\"text\"",
    expected: [{TYPE: "STRING", value: "text"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'testing, 123!'",
    expected: [{TYPE: "STRING", value: "testing, 123!"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'es\\'ca\\\"pe'",
    expected: [{TYPE: "STRING", value: "es'ca\"pe"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'\"quotes\"'",
    expected: [{TYPE: "STRING", value: "\"quotes\""}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\"'quotes'\"",
    expected: [{TYPE: "STRING", value: "'quotes'"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\"mismatch'",
    expected: [{TYPE: "STRING", value: "mismatch'"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'text\x05\t\x13'",
    expected: [{TYPE: "STRING", value: "text\x05\t\x13"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\"end on eof",
    expected: [{TYPE: "STRING", value: "end on eof"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'esca\\\nped'",
    expected: [{TYPE: "STRING", value: "escaped"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\"esc\\\faped\"",
    expected: [{TYPE: "STRING", value: "escaped"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'new\\\rline'",
    expected: [{TYPE: "STRING", value: "newline"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "\"new\\\r\nline\"",
    expected: [{TYPE: "STRING", value: "newline"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'bad\nstring",
    expected: [{TYPE: "BADSTRING"}, {TYPE: "WHITESPACE"}, {TYPE: "IDENT", value: "string"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'bad\rstring",
    expected: [{TYPE: "BADSTRING"}, {TYPE: "WHITESPACE"}, {TYPE: "IDENT", value: "string"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'bad\r\nstring",
    expected: [{TYPE: "BADSTRING"}, {TYPE: "WHITESPACE"}, {TYPE: "IDENT", value: "string"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'bad\fstring",
    expected: [{TYPE: "BADSTRING"}, {TYPE: "WHITESPACE"}, {TYPE: "IDENT", value: "string"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'\0'",
    expected: [{TYPE: "STRING", value: "\uFFFD"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'hel\0lo'",
    expected: [{TYPE: "STRING", value: "hel\uFFFDlo"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "'h\\65l\0lo'",
    expected: [{TYPE: "STRING", value: "hel\uFFFDlo"}, {TYPE: "EOF"}],
  },

  // -- HashToken
  {
    parser: "",
    css: "#id-selector",
    expected: [{TYPE: "HASH", value: "id-selector", type: "id"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "#FF7700",
    expected: [{TYPE: "HASH", value: "FF7700", type: "id"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "#3377FF",
    expected: [{TYPE: "HASH", value: "3377FF", type: "unrestricted"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "#\\ ",
    expected: [{TYPE: "HASH", value: " ", type: "id"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "# ",
    expected: [{TYPE: "DELIM", value: '#'}, {TYPE: "WHITESPACE"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "#\\\n",
    expected: [{TYPE: "DELIM", value: '#'}, {TYPE: "DELIM", value: '\\'}, {TYPE: "WHITESPACE"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "#\\\r\n",
    expected: [{TYPE: "DELIM", value: '#'}, {TYPE: "DELIM", value: '\\'}, {TYPE: "WHITESPACE"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "#!",
    expected: [{TYPE: "DELIM", value: '#'}, {TYPE: "DELIM", value: '!'}, {TYPE: "EOF"}],
  },

  // -- NumberToken
  {
    parser: "",
    css: "10",
    expected: [{TYPE: "NUMBER", value: 10, type: "integer"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "12.0",
    expected: [{TYPE: "NUMBER", value: 12, type: "number"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "+45.6",
    expected: [{TYPE: "NUMBER", value: 45.6, type: "number", sign: "+"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "-7",
    expected: [{TYPE: "NUMBER", value: -7, type: "integer", sign: "-"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "010",
    expected: [{TYPE: "NUMBER", value: 10, type: "integer"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "10e0",
    expected: [{TYPE: "NUMBER", value: 10, type: "number"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "12e3",
    expected: [{TYPE: "NUMBER", value: 12000, type: "number"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "3e+1",
    expected: [{TYPE: "NUMBER", value: 30, type: "number"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "12E-1",
    expected: [{TYPE: "NUMBER", value: 1.2, type: "number"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: ".7",
    expected: [{TYPE: "NUMBER", value: 0.7, type: "number"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "-.3",
    expected: [{TYPE: "NUMBER", value: -0.3, type: "number", sign: "-"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "+637.54e-2",
    expected: [{TYPE: "NUMBER", value: 6.3754, type: "number", sign: "+"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "-12.34E+2",
    expected: [{TYPE: "NUMBER", value: -1234, type: "number", sign: "-"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "+ 5",
    expected: [{TYPE: "DELIM", value: '+'}, {TYPE: "WHITESPACE"}, {TYPE: "NUMBER", value: 5, type: "integer"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "-+12",
    expected: [{TYPE: "DELIM", value: '-'}, {TYPE: "NUMBER", value: 12, type: "integer", sign: "+"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "+-21",
    expected: [{TYPE: "DELIM", value: '+'}, {TYPE: "NUMBER", value: -21, type: "integer", sign: "-"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "++22",
    expected: [{TYPE: "DELIM", value: '+'}, {TYPE: "NUMBER", value: 22, type: "integer", sign: "+"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "13.",
    expected: [{TYPE: "NUMBER", value: 13, type: "integer"}, {TYPE: "DELIM", value: '.'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "1.e2",
    expected: [{TYPE: "NUMBER", value: 1, type: "integer"}, {TYPE: "DELIM", value: '.'}, {TYPE: "IDENT", value: "e2"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "2e3.5",
    expected: [{TYPE: "NUMBER", value: 2000, type: "number"}, {TYPE: "NUMBER", value: 0.5, type: "number"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "2e3.",
    expected: [{TYPE: "NUMBER", value: 2000, type: "number"}, {TYPE: "DELIM", value: '.'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "1000000000000000000000000",
    expected: [{TYPE: "NUMBER", value: 1e24, type: "integer"}, {TYPE: "EOF"}],
  },

  // -- DimensionToken
  {
    parser: "",
    css: "10px",
    expected: [{TYPE: "DIMENSION", value: 10, type: "integer", unit: "px"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "12.0em",
    expected: [{TYPE: "DIMENSION", value: 12, type: "number", unit: "em"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "-12.0em",
    expected: [{TYPE: "DIMENSION", value: -12, type: "number", unit: "em", sign: "-"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "+45.6__qem",
    expected: [{TYPE: "DIMENSION", value: 45.6, type: "number", unit: "__qem", sign: "+"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "5e",
    expected: [{TYPE: "DIMENSION", value: 5, type: "integer", unit: "e"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "5px-2px",
    expected: [{TYPE: "DIMENSION", value: 5, type: "integer", unit: "px-2px"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "5e-",
    expected: [{TYPE: "DIMENSION", value: 5, type: "integer", unit: "e-"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "5\\ ",
    expected: [{TYPE: "DIMENSION", value: 5, type: "integer", unit: " "}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "40\\70\\78",
    expected: [{TYPE: "DIMENSION", value: 40, type: "integer", unit: "px"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "4e3e2",
    expected: [{TYPE: "DIMENSION", value: 4000, type: "number", unit: "e2"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "0x10px",
    expected: [{TYPE: "DIMENSION", value: 0, type: "integer", unit: "x10px"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "4unit ",
    expected: [{TYPE: "DIMENSION", value: 4, type: "integer", unit: "unit"}, {TYPE: "WHITESPACE"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "5e+",
    expected: [{TYPE: "DIMENSION", value: 5, type: "integer", unit: "e"}, {TYPE: "DELIM", value: '+'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "2e.5",
    expected: [{TYPE: "DIMENSION", value: 2, type: "integer", unit: "e"}, {TYPE: "NUMBER", value: 0.5, type: "number"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "2e+.5",
    expected: [{TYPE: "DIMENSION", value: 2, type: "integer", unit: "e"}, {TYPE: "NUMBER", value: 0.5, type: "number", sign: "+"}, {TYPE: "EOF"}],
  },

  // -- PercentageToken
  {
    parser: "",
    css: "10%",
    expected: [{TYPE: "PERCENTAGE", value: 10}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "+12.0%",
    expected: [{TYPE: "PERCENTAGE", value: 12, sign: "+"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "-48.99%",
    expected: [{TYPE: "PERCENTAGE", value: -48.99, sign: "-"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "6e-1%",
    expected: [{TYPE: "PERCENTAGE", value: 0.6}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "5%%",
    expected: [{TYPE: "PERCENTAGE", value: 5}, {TYPE: "DELIM", value: '%'}, {TYPE: "EOF"}],
  },

  // -- UnicodeRangeToken
  {
    parser: "",
    css: "u+012345-123456",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "NUMBER", value: 12345, type: "integer", sign: "+"},
      {TYPE: "NUMBER", value: -123456, type: "integer", sign: "-"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "U+1234-2345",
    expected: [
      {TYPE: "IDENT", value: "U"},
      {TYPE: "NUMBER", value: 1234, type: "integer", sign: "+"},
      {TYPE: "NUMBER", value: -2345, type: "integer", sign: "-"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+222-111",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "NUMBER", value: 222, type: "integer", sign: "+"},
      {TYPE: "NUMBER", value: -111, type: "integer", sign: "-"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "U+CafE-d00D",
    expected: [
      {TYPE: "IDENT", value: "U"},
      {TYPE: "DELIM", value: "+"},
      {TYPE: "IDENT", value: "CafE-d00D"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "U+2??",
    expected: [
      {TYPE: "IDENT", value: "U"},
      {TYPE: "NUMBER", value: 2, type: "integer", sign: "+"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "U+ab12??",
    expected: [
      {TYPE: "IDENT", value: "U"},
      {TYPE: "DELIM", value: "+"},
      {TYPE: "IDENT", value: "ab12"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+??????",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "DELIM", value: "+"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+??",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "DELIM", value: "+"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+222+111",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "NUMBER", value: 222, type: "integer", sign: "+"},
      {TYPE: "NUMBER", value: 111, type: "integer", sign: "+"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+12345678",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "NUMBER", value: 12345678, type: "integer", sign: "+"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+123-12345678",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "NUMBER", value: 123, type: "integer", sign: "+"},
      {TYPE: "NUMBER", value: -12345678, type: "integer", sign: "-"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+cake",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "DELIM", value: "+"},
      {TYPE: "IDENT", value: "cake"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+1234-gggg",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "DIMENSION", value: 1234, type: "integer", unit: "-gggg", sign: "+"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "U+ab12???",
    expected: [
      {TYPE: "IDENT", value: "U"},
      {TYPE: "DELIM", value: "+"},
      {TYPE: "IDENT", value: "ab12"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+a1?-123",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "DELIM", value: "+"},
      {TYPE: "IDENT", value: "a1"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "NUMBER", value: -123, type: "integer", sign: "-"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+1??4",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "NUMBER", value: 1, type: "integer", sign: "+"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "DELIM", value: "?"},
      {TYPE: "NUMBER", value: 4, type: "integer"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+z",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "DELIM", value: "+"},
      {TYPE: "IDENT", value: "z"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "DELIM", value: "+"},
      {TYPE: "EOF"},
    ],
  },
  {
    parser: "",
    css: "u+-543",
    expected: [
      {TYPE: "IDENT", value: "u"},
      {TYPE: "DELIM", value: "+"},
      {TYPE: "NUMBER", value: -543, type: "integer", sign: "-"},
      {TYPE: "EOF"},
    ],
  },

  // -- CommentToken
  {
    parser: "",
    css: "/*comment*/a",
    expected: [{TYPE: "IDENT", value: "a"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "/**\\2f**//",
    expected: [{TYPE: "DELIM", value: '/'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "/**y*a*y**/ ",
    expected: [{TYPE: "WHITESPACE"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: ",/* \n :) \n */)",
    expected: [{TYPE: "COMMA"}, {TYPE: "CLOSE-PAREN"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: ":/*/*/",
    expected: [{TYPE: "COLON"}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: "/**/*",
    expected: [{TYPE: "DELIM", value: '*'}, {TYPE: "EOF"}],
  },
  {
    parser: "",
    css: ";/******",
    expected: [{TYPE: "SEMICOLON"}, {TYPE: "EOF"}],
  },

  // parseAStylesheet()
  {
    css: `foo {
        bar: baz;
    }`,
    expected: {
      "TYPE": "STYLESHEET",
      "rules": [
        {
          "TYPE": "QUALIFIED-RULE",
          "prelude": [
            {
              "TYPE": "IDENT",
              "value": "foo"
            },
            {
              "TYPE": "WHITESPACE"
            }
          ],
          "declarations": [
            {
              "TYPE": "DECLARATION",
              "name": "bar",
              "value": [
                {
                  "TYPE": "IDENT",
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
      "TYPE": "STYLESHEET",
      "rules": [
        {
          "TYPE": "QUALIFIED-RULE",
          "prelude": [
            {
              "TYPE": "IDENT",
              "value": "foo"
            },
            {
              "TYPE": "WHITESPACE"
            }
          ],
          "declarations": [
            {
              "TYPE": "DECLARATION",
              "name": "bar",
              "value": [
                {
                  "TYPE": "FUNCTION",
                  "name": "rgb",
                  "value": [
                    {
                      "TYPE": "NUMBER",
                      "value": 255,
                      "type": "integer",
                    },
                    {
                      "TYPE": "COMMA"
                    },
                    {
                      "TYPE": "WHITESPACE"
                    },
                    {
                      "TYPE": "NUMBER",
                      "value": 0,
                      "type": "integer",
                    },
                    {
                      "TYPE": "COMMA"
                    },
                    {
                      "TYPE": "WHITESPACE"
                    },
                    {
                      "TYPE": "NUMBER",
                      "value": 127,
                      "type": "integer",
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
      "TYPE": "STYLESHEET",
      "rules": [
        {
          "TYPE": "QUALIFIED-RULE",
          "prelude": [
            {
              "TYPE": "HASH",
              "value": "foo",
              "type": "id"
            },
            {
              "TYPE": "WHITESPACE"
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
      "TYPE": "STYLESHEET",
      "rules": [
        {
          "TYPE": "AT-RULE",
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
      "TYPE": "STYLESHEET",
      "rules": [
        {
          "TYPE": "QUALIFIED-RULE",
          "prelude": [
            {
              "TYPE": "DELIM",
              "value": "."
            },
            {
              "TYPE": "IDENT",
              "value": "foo"
            },
            {
              "TYPE": "WHITESPACE"
            }
          ],
          "declarations": [
            {
              "TYPE": "DECLARATION",
              "name": "color",
              "value": [
                {
                  "TYPE": "IDENT",
                  "value": "red"
                }
              ],
              "important": false
            },
            {
              "TYPE": "DECLARATION",
              "name": "color",
              "value": [
                {
                  "TYPE": "IDENT",
                  "value": "green"
                }
              ],
              "important": false
            }
          ],
          "rules": [
            {
              "TYPE": "AT-RULE",
              "name": "media",
              "prelude": [
                {
                  "TYPE": "WHITESPACE"
                }
              ],
              "declarations": [
                {
                  "TYPE": "DECLARATION",
                  "name": "foo",
                  "value": [
                    {
                      "TYPE": "IDENT",
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
      "TYPE": "STYLESHEET",
      "rules": [
        {
          "TYPE": "QUALIFIED-RULE",
          "prelude": [
            {
              "TYPE": "IDENT",
              "value": "foo"
            }
          ],
          "declarations": [
            {
              "TYPE": "DECLARATION",
              "name": "div",
              "value": [
                {
                  "TYPE": "IDENT",
                  "value": "hover"
                }
              ],
              "important": false
            }
          ],
          "rules": [
            {
              "TYPE": "QUALIFIED-RULE",
              "prelude": [
                {
                  "TYPE": "IDENT",
                  "value": "color"
                },
                {
                  "TYPE": "COLON"
                },
                {
                  "TYPE": "IDENT",
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
      "TYPE": "STYLESHEET",
      "rules": [
        {
          "TYPE": "AT-RULE",
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
      "TYPE": "STYLESHEET",
      "rules": [
        {
          "TYPE": "QUALIFIED-RULE",
          "prelude": [
            {
              "TYPE": "IDENT",
              "value": "foo"
            }
          ],
          "declarations": [],
          "rules": [
            {
              "TYPE": "AT-RULE",
              "name": "foo",
              "prelude": [],
              "declarations": null,
              "rules": null
            },
            {
              "TYPE": "QUALIFIED-RULE",
              "prelude": [
                {
                  "TYPE": "IDENT",
                  "value": "foo"
                },
                {
                  "TYPE": "WHITESPACE"
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
      "TYPE": "STYLESHEET",
      "rules": [
        {
          "TYPE": "QUALIFIED-RULE",
          "prelude": [
            {
              "TYPE": "IDENT",
              "value": "foo"
            },
            {
              "TYPE": "WHITESPACE"
            }
          ],
          "declarations": [
            {
              "TYPE": "DECLARATION",
              "name": "--div",
              "value": [
                {
                  "TYPE": "IDENT",
                  "value": "hover"
                },
                {
                  "TYPE": "BLOCK",
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

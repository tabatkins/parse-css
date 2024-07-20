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
      global.parseCss,
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

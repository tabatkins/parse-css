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

  // -- Escapes
  {
    parser: "",
    css: `\\20000 \\0 \\D800 \\DFFF \\110000 `,
    expected: [{type: "IDENT", value: "\u{20000}\uFFFD\uFFFD\uFFFD\uFFFD"}],
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

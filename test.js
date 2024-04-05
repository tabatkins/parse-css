"use strict";
(function (global, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    // CommonJS/Node.js
    factory(
      require('./tests').TESTS,
      require('./parse-css'),
      require('ansidiff'),
    );
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    require(
      ['./tests', './parse-css', 'ansidiff'],
      factory,
    );
  } else {
    // browser global
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    factory(
      global.TESTS,
      global,
      {lines: global.diffString, words: global.diffString},
      global.log,
    );
  }
}(this, function (TESTS, parseCss, ansidiff, log) {

log = log || console.log;

var total = TESTS.length, failures = 0,
    i, test, tokens, parser, result, dump, expected_dump;

for (i = 0; i < total; i++) {
  test = TESTS[i];
  tokens = parseCss.tokenize(test.css);
  try {
    parser = parseCss[typeof test.parser === 'string' ? test.parser : 'parseAStylesheet'];
    result = (typeof parser === 'function') ? parser(tokens) : tokens;
    if (test.expectedThrow) {
      log(`Test ${i} of ${total}: FAIL\nCSS: ${test.css}\nTokens: ${tokens.join(' ')}`);
      log(`Expected error not thrown: ` + ansidiff.words(test.expectedThrow.name, ''));
      failures++;
      continue;
    }
    dump = JSON.stringify(result, null, '  ');
    expected_dump = JSON.stringify(test.expected, null, '  ');
    if (dump == expected_dump) {
      log(`Test ${i} of ${total}: PASS`);
    } else {
      log(`Test ${i} of ${total}: FAIL\nCSS: ${test.css}\nTokens: ${tokens.join(' ')}`);
      log(ansidiff.lines(expected_dump, dump));
      failures++;
    }
  } catch (ex) {
    if (test.expectedThrow) {
      if (ex.name === test.expectedThrow.name) {
        log(`Test ${i} of ${total}: PASS`);
      } else {
        log(`Test ${i} of ${total}: FAIL\nCSS: ${test.css}\nTokens: ${tokens.join(' ')}`);
        log(`Expected error not thrown: ` + ansidiff.words(test.expectedThrow.name, ex.name));
        failures++;
      }
    } else {
      log(`Test ${i} of ${total}: FAIL\nCSS: ${test.css}\nTokens: ${tokens.join(' ')}`);
      log(ansidiff.words(`Unexpected error: ${ex}`, ``));
      failures++;
    }
  }
}

// Abuse the differ to get colored output
if (failures == 0) {
  log(ansidiff.words(`${total} tests, `, `${total} tests, all passed :)`));
} else {
  log(ansidiff.words(`${total} tests, ${failures} failures :(`, `${total} tests, `));
}

}));

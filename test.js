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

var total = TESTS.length, failures = 0;

for (let i = 0; i < total; i++) {
  const test = TESTS[i];
  const tokens = parseCss.tokenize(test.css);
  let result, error;
  try {
    const parser = parseCss[typeof test.parser === 'string' ? test.parser : 'parseAStylesheet'];
    result = (typeof parser === 'function') ? parser(tokens) : tokens;
    if (test.expectedThrow) { throw null; }
  } catch (ex) {
    error = ex;
  }

  if (test.expectedThrow) {
    if (error && error.name === test.expectedThrow.name) {
      log(`Test ${i} of ${total}: PASS`);
    } else {
      log(`Test ${i} of ${total}: FAIL\nCSS: ${test.css}\nTokens: ${tokens.join(' ')}`);
      log(`Expected error not thrown: ` + ansidiff.words(test.expectedThrow.name, error && error.name || ''));
      failures++;
    }
  } else if (error) {
    log(`Test ${i} of ${total}: FAIL\nCSS: ${test.css}\nTokens: ${tokens.join(' ')}`);
    log(ansidiff.words(`Unexpected error: ${error}`, ``));
    failures++;
  } else if (test.expected) {
    const dump = JSON.stringify(result, null, '  ');
    const expected_dump = JSON.stringify(test.expected, null, '  ');
    if (dump == expected_dump) {
      log(`Test ${i} of ${total}: PASS`);
    } else {
      log(`Test ${i} of ${total}: FAIL\nCSS: ${test.css}\nTokens: ${tokens.join(' ')}`);
      log(ansidiff.lines(expected_dump, dump || ''));
      failures++;
    }
  } else if (test.expectedToSource) {
    const source = Array.isArray(result) ? result.map(x => x.toSource()).join('') : result.toSource();
    const expected_source = test.expectedToSource;
    if (source == expected_source) {
      log(`Test ${i} of ${total}: PASS`);
    } else {
      log(`Test ${i} of ${total}: FAIL\nCSS: ${test.css}\nTokens: ${tokens.join(' ')}`);
      log(`Unexpected toSource(): ` + ansidiff.lines(expected_source, source || ''));
      failures++;
    }
  } else {
    // no specified test, fallback to pass
    log(`Test ${i} of ${total}: PASS`);
  }
}

// Abuse the differ to get colored output
if (failures == 0) {
  log(ansidiff.words(`${total} tests, `, `${total} tests, all passed :)`));
} else {
  log(ansidiff.words(`${total} tests, ${failures} failures :(`, `${total} tests, `));
}

}));

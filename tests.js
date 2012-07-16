// This test suite runs on NodeJS and uses the 'ansidiff' package.
// Once you have NodeJS, install ansidiff with:
//
//    npm install ansidiff
//
// Then run the test suite with:
//
//    node tests.js

var TESTS = [
  {
    css: 'foo { bar: baz; }',
    expected: {"type": "stylesheet", "value": [
      {
        "type": "selector",
        "selector": ["IDENT(foo)", "WS"],
        "value": [
          {
            "type": "declaration",
            "name": "bar",
            "value": ["WS", "IDENT(baz)"]}]}]
    }
  }, {
    css: 'foo { bar: rgb(255, 0, 127); }',
    expected: {"type": "stylesheet", "value": [
      {
        "type": "selector",
        "selector": ["IDENT(foo)", "WS"],
        "value": [
          {
            "type": "declaration",
            "name": "bar",
            "value": ["WS", {"type": "func", "name": "rgb", "value": [
                ["INT(255)"], ["WS", "INT(0)"], ["WS", "INT(127)"]]}]}]}]
    }
  }, {
    css: '#foo {}',
    expected: {"type": "stylesheet", "value": [
      {
        "type": "selector",
        "selector": ["HASH(foo)", "WS"],
        "value": []}]
    }
  }, {
    css: '@media{ }',
    expected: {"type": "stylesheet", "value": [
      {
        "type": "at", "name": "media",
        "prelude": [],
        "value": []}]}
  }
];


var ansidiff = require('ansidiff'),
    tokenize = require('./tokenizer').tokenize,
    parse = require('./parser').parse;

var total = TESTS.length, failures = 0,
    i, test, tokens, sheet, dump, expected_dump;

for (i = 0; i < total; i++) {
    test = TESTS[i];
    tokens = tokenize(test.css);
    sheet = parse(tokens);
    dump = sheet.toString('  ');
    expected_dump = JSON.stringify(test.expected, null, '  ');
    if (dump == expected_dump) {
        console.log('Test %d of %d: PASS', i, total);
    } else {
        console.log('Test %d of %d: FAIL\nCSS: %s\nTokens: %s',
            i, total, test.css, tokens.join(' '));
        console.log(ansidiff.lines(expected_dump, dump));
        failures++;
    }
}

// Abuse the differ to get colored output
if (failures == 0) {
    console.log(ansidiff.words('%d tests, ', '%d tests, all passed :)'),
                total);
} else {
    console.log(ansidiff.words('%d tests, %d failures :(', '%d tests, '),
                total, failures);
}

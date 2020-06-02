'use strict';
const util = require('util');
const expect = require('chai').expect;
function importTest(name, path) {
	describe(name, function () {
		require(path);
	});
}

describe("test entry point (main.js)\n", function () {
	beforeEach(function () {
	});

	importTest("Yahoo Finance Service\n", './finance.spec.js');
	importTest("Client-side Helper Functions (C3)\n", './c3-helpers.spec.js');

	after(function () {
	});
});
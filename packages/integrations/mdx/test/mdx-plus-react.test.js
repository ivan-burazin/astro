import { describe, it, before } from 'node:test';
import * as assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import { loadFixture } from '../../../astro/test/test-utils.js';

function hookError() {
	const error = console.error;
	const errors = [];
	console.error = function (...args) {
		errors.push(args);
	};
	return () => {
		console.error = error;
		return errors;
	};
}

describe('MDX and React', () => {
	let fixture;
	let unhook;

	before(async () => {
		fixture = await loadFixture({
			root: new URL('./fixtures/mdx-plus-react/', import.meta.url),
		});
		unhook = hookError();
		await fixture.build();
	});

	it('can be used in the same project', async () => {
		const html = await fixture.readFile('/index.html');
		const { document } = parseHTML(html);

		const p = document.querySelector('p');

		assert.equal(p.textContent, 'Hello world');
	});

	it('mdx renders fine', async () => {
		const html = await fixture.readFile('/post/index.html');
		const { document } = parseHTML(html);
		const h = document.querySelector('#testing');
		assert.equal(h.textContent, 'Testing');
	});

	it('does not get a invalid hook call warning', () => {
		const errors = unhook();
		assert.equal(errors.length === 0, true);
	});
});

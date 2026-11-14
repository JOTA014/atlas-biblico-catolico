import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'api/content/atlas.json'), 'utf8'));
const books = fs.readdirSync(path.join(root, 'api/content/books')).filter(file => file.endsWith('.json'))
  .map(file => JSON.parse(fs.readFileSync(path.join(root, 'api/content/books', file), 'utf8')))
  .sort((a, b) => a.order - b.order);
const atlas = { ...catalog, books };

test('the Catholic canon contains 46 Old Testament and 27 New Testament books', () => {
  assert.equal(atlas.books.length, 73);
  assert.deepEqual(atlas.counts, { total: 73, oldTestament: 46, newTestament: 27 });
  assert.equal(new Set(atlas.books.map(book => book.slug)).size, 73);
});

test('each book has all three reading levels with matching stable section IDs', () => {
  const expectedLevels = ['descubrir', 'comprender', 'investigar'];
  for (const book of atlas.books) {
    assert.deepEqual(book.levels.map(level => level.id), expectedLevels, book.slug);
    const canonicalSections = book.sections.map(section => section.id);
    for (const level of book.levels) {
      assert.deepEqual(level.sections.map(section => section.id), canonicalSections, `${book.slug}/${level.id}`);
      assert.ok(level.sections.every(section => section.text.trim().length > 0));
      assert.ok(level.sections.every(section => section.sourceRefs.length > 0));
    }
    assert.equal(book.reviewStatus, 'borrador-editorial');
    assert.ok(book.authorship.claim.length > 0, `${book.slug} authorship`);
    assert.ok(book.audience.claim.length > 0, `${book.slug} audience`);
    assert.equal(book.authorship.sourceUrl, book.sourceUrl, `${book.slug} authorship source`);
    assert.equal(book.audience.sourceUrl, book.sourceUrl, `${book.slug} audience source`);
  }
});

test('the three Genesis pilot PDFs are present and clearly separated from the 73-book catalog', () => {
  for (const level of ['descubrir', 'comprender', 'investigar']) {
    const file = path.join(root, `ui/public/pdfs/genesis-${level}.pdf`);
    assert.ok(fs.existsSync(file), file);
    assert.ok(fs.statSync(file).size > 1000, file);
  }
  assert.ok(fs.existsSync(path.join(root, 'ui/public/guia-biblica-catolica.pdf')));
});


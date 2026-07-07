const test = require('node:test');
const assert = require('node:assert/strict');
const Note = require('../src/models/Note');

test('Note schema supports comments and mentions', () => {
  const note = new Note({
    title: 'Test note',
    comments: [{
      text: 'Looks good',
      author: 'Alice',
      mentions: ['Bob']
    }]
  });

  assert.equal(note.comments.length, 1);
  assert.equal(note.comments[0].text, 'Looks good');
  assert.equal(note.comments[0].author, 'Alice');
  assert.deepEqual(note.comments[0].mentions, ['Bob']);
});

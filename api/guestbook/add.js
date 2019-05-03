const url = require('url');
const request = require('request-promise');
const db = require('../../lib/db');
const escape = require('sql-template-strings');

module.exports = async (req, res) => {
  const { query } = url.parse(req.url, true);
  const { id, avatar_url, login } = await request({
    uri: 'https://api.github.com/user',
    headers: {
      Authorization: `bearer ${query.token}`,
      'User-Agent': 'Serverless Guestbook'
    },
    json: true
  });
  const existing = await db.query(escape`
    SELECT * FROM guestbook WHERE id = ${id}
`);
  if (!existing.length) {
    await db.query(escape`
      INSERT INTO
      guestbook (id, avatar, login, comment, updated)
      VALUES (${id}, ${avatar_url}, ${login}, null, ${Date.now()})
    `);
    res.end(JSON.stringify({ id, login }));
  }
  res.end();
};

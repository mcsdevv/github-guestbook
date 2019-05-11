const request = require('request-promise');
const db = require('../../lib/db');
const escape = require('sql-template-strings');
const { json } = require('micro');

module.exports = async (req, res) => {
  const { comment, id, token } = await json(req);
  const updated = Date.now();
  const existing = await db.query(escape`
  SELECT * FROM guestbook WHERE id = ${id}
  `);
  if (!existing.length) {
    const { avatar_url, login } = await request({
      uri: 'https://api.github.com/user',
      headers: {
        Authorization: `bearer ${token}`,
        'User-Agent': 'Serverless Guestbook'
      },
      json: true
    });
    await db.query(escape`
    INSERT INTO
    guestbook (id, avatar, login, comment, updated)
    VALUES (${id}, ${avatar_url}, ${login}, ${comment}, ${updated})
  `);
    res.end(
      JSON.stringify({ id, avatar: avatar_url, login, comment, updated })
    );
  } else {
    const sign = await db.query(
      escape`UPDATE guestbook
       SET comment = ${comment}, updated = ${updated}
       WHERE id = ${id}`
    );
    console.log('SIGN', sign);
    res.setHeader(
      'cache-control',
      's-maxage=1 maxage=0, stale-while-revalidate'
    );
    res.end();
  }
};

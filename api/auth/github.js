const url = require('url');
const request = require('request-promise');
const db = require('../../lib/db');
const escape = require('sql-template-strings');

module.exports = async (req, res) => {
  const { query } = url.parse(req.url, true);
  const { access_token } = await request({
    method: 'POST',
    uri: 'https://github.com/login/oauth/access_token',
    body: {
      client_id: process.env.GG_ID,
      client_secret: process.env.GG_SECRET,
      code: query.code
    },
    json: true
  });
  const { id, avatar_url, login, html_url } = await request({
    uri: 'https://api.github.com/user',
    headers: {
      Authorization: `bearer ${access_token}`,
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
      guestbook (id, avatar, url, login, comment, updated)
      VALUES (${id}, ${avatar_url}, ${html_url}, ${login}, null, ${Date.now()})
    `);
  }
  res.writeHead(301, {
    Location: `/?provider=github&token=${access_token}&login=${login}&id=${id}`
  });
  res.end();
};

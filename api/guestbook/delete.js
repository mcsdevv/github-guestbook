const url = require('url');
const db = require('../../lib/db');
const escape = require('sql-template-strings');

module.exports = async (req, res) => {
  const { query } = url.parse(req.url, true);
  await db.query(
    escape`DELETE FROM guestbook
         WHERE id = ${query.id}`
  );
  let page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;
  if (page < 1) page = 1;
  const guestbook = await db.query(escape`
      SELECT *
      FROM guestbook
      ORDER BY updated DESC
      LIMIT ${(page - 1) * limit}, ${limit}
    `);
  res.setHeader('cache-control', 's-maxage=1 maxage=0, stale-while-revalidate');
  res.end(JSON.stringify({ guestbook }));
};

const url = require('url');
const db = require('../../lib/db');
const escape = require('sql-template-strings');

module.exports = async (req, res) => {
  const { query } = url.parse(req.url, true);
  await db.query(
    escape`DELETE FROM guestbook
         WHERE id = ${query.id}`
  );
  res.end();
};

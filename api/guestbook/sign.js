const db = require('../../lib/db');
const escape = require('sql-template-strings');
const { json } = require('micro');

module.exports = async (req, res) => {
  const { comment, id } = await json(req);
  await db.query(
    escape`UPDATE guestbook
       SET comment = ${comment}
       WHERE id = ${id}`
  );
  res.writeHead(302, {
    Location: '/?provider=github'
  });
  res.end();
};

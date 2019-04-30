const db = require('../../lib/db');

module.exports = async (req, res) => {
  const guestbook = await db.query(`
      SELECT *
      FROM guestbook
      ORDER BY updated DESC
    `);
  res.end(JSON.stringify({ guestbook }));
};

const url = require('url');
const request = require('request-promise');

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
  console.log(
    'SICKKKKKK',
    `http://${req.headers.host}/guestbook/add?token=${access_token}`
  );
  const { id, login } = await request({
    uri: `http://${req.headers.host}/guestbook/add?token=${access_token}`
  });
  res.writeHead(301, {
    Location: `/?provider=github&token=${access_token}&login=${login}&id=${id}`
  });
  res.end();
};

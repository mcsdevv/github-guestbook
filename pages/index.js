import fetch from 'isomorphic-unfetch';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import Head from 'next/head';
import Link from 'next/link';

function HomePage({ baseURL, existing, guestbook, id, login, token }) {
  const handleSubmit = async e => {
    e.preventDefault();
    const comment = e.target.comment.value;
    await fetch(`${baseURL}/api/guestbook/sign`, {
      method: 'PATCH',
      body: JSON.stringify({
        comment,
        id
      })
    });
    window.location = '/';
  };
  return (
    <>
      <Head>
        <title>GitHub Guestbook</title>
        <link
          rel="stylesheet"
          href="https://css.zeit.sh/v1.css"
          type="text/css"
        />
      </Head>
      <header>
        <h1>GitHub Guestbook</h1>
        <Link
          href={
            !token ? `${baseURL}/api/auth?provider=github` : `/?token=logout`
          }
        >
          <a>
            <button>
              {token !== undefined ? 'Logout' : 'Login With GitHub'}
            </button>
          </a>
        </Link>
      </header>
      {token && (
        <>
          <h3>
            Hello, {login},{' '}
            {existing
              ? 'want to update your signature?'
              : 'want to sign the guestbook?'}
          </h3>
          <form onSubmit={handleSubmit}>
            <input id="comment" name="comment" />
            <button type="submit">Sign</button>
          </form>
        </>
      )}
      {guestbook.length >= 1 && (
        <>
          <h2>Signatures</h2>
          <ul>
            {guestbook.map(g => (
              <li>
                <Link href={`https://github.com/${g.url}`}>
                  <a className="comment">
                    <img src={g.avatar} />
                    <div className="description">
                      <h3>{g.login}</h3>
                      <p>{g.comment}</p>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <style jsx>{`
        header {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }
        ul {
          margin-left: 0;
        }
        ul li::before {
          content: '';
        }
        li {
          border-radius: 5px;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 6px 12px;
          display: flex;
          height: 150px;
          margin-bttom: 24px;
        }
        a:hover {
          border-bottom: none;
        }
        img {
          border-bottom-left-radius: 5px;
          border-top-left-radius: 5px;
          height: 100%;
          width: 150px;
        }
        h3 {
          margin: 0;
        }
        .comment {
          display: flex;
        }
        .description {
          color: #333;
          padding: 1em;
        }
        form {
          display: flex;
          width: 100%;
        }
        input {
          flex-grow: 100;
          margin-right: 20px;
        }
      `}</style>
    </>
  );
}

HomePage.getInitialProps = async ctx => {
  const { req, query } = ctx;
  const protocol = req
    ? `${req.headers['x-forwarded-proto']}:`
    : location.protocol;
  const host = req ? req.headers['x-forwarded-host'] : location.host;
  const baseURL = `${protocol}//${host}`;
  const guestbookRequest = await fetch(`${baseURL}/api/guestbook`);
  const { guestbook } = await guestbookRequest.json();
  const existing = !!guestbook.find(s => s.id === parseInt(id));
  if (query.token === 'logout') {
    destroyCookie(ctx, 'token');
    destroyCookie(ctx, 'id');
    destroyCookie(ctx, 'name');
  }
  if (query.id) {
    await setCookie(ctx, 'id', query.id, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    });
    await setCookie(ctx, 'login', query.login, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    });
  }
  if (query.token && query.token !== 'logout') {
    await setCookie(ctx, 'token', query.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    });
  }
  const { id, login, token } = await parseCookies(ctx);
  return { baseURL, existing, guestbook, id, login, token };
};

export default HomePage;

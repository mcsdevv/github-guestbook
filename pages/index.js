import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import Head from 'next/head';

import Header from '../components/header';
import Input from '../components/input';
import Nav from '../components/nav';
import Signatures from '../components/signatures';

HomePage.getInitialProps = async ctx => {
  const { req, query } = ctx;
  const protocol = req
    ? `${req.headers['x-forwarded-proto']}:`
    : location.protocol;
  const host = req ? req.headers['x-forwarded-host'] : location.host;
  const baseURL = `${protocol}//${host}`;
  const guestbookRequest = await fetch(
    `${baseURL}/api/guestbook?page=${query.page}&limit=${query.limit}`
  );
  const { guestbook, page, pageCount } = await guestbookRequest.json();
  let props = { guestbook, page, pageCount };
  if (query.token === 'logout') {
    destroyCookie(ctx, 'token');
    destroyCookie(ctx, 'id');
    destroyCookie(ctx, 'name');
    return { ...props };
  }
  const options = {
    maxAge: 30 * 24 * 60 * 60,
    path: '/'
  };
  if (query.id) {
    await setCookie(ctx, 'id', query.id, options);
    await setCookie(ctx, 'login', query.login, options);
    await setCookie(ctx, 'token', query.token, options);
    const { id, login, token } = query;
    props = { ...props, id, login, token };
  } else {
    const { id, login, token } = await parseCookies(ctx);
    props = { ...props, id, login, token };
  }
  return { ...props };
};

function HomePage({ guestbook, id, login, page, pageCount, token }) {
  const [signatures, setSignatures] = useState([]);
  useEffect(() => {
    setSignatures([...guestbook]);
  }, [guestbook]);
  const existing = signatures.find(s => s.id == id);
  const handleSubmit = async e => {
    e.preventDefault();
    let comment = e.target.comment.value;
    e.target.comment.value = '';
    const res = await fetch(`/api/guestbook/sign`, {
      method: 'PATCH',
      body: JSON.stringify({
        comment,
        id,
        token
      })
    });
    if (res.status === 200) {
      if (existing) {
        const updatedSignatures = signatures.map(s => {
          if (s.id === existing.id) s.comment = comment;
          return s;
        });
        setSignatures([...updatedSignatures]);
      } else {
        const newSignature = await res.json();
        const updatedSignatures = [newSignature, ...signatures.slice(0, 4)];
        setSignatures([...updatedSignatures]);
      }
    }
  };
  const handleDelete = async () => {
    const res = await fetch(
      `/api/guestbook/delete?id=${id}&page=${page}&limit=5`,
      {
        method: 'DELETE'
      }
    );
    if (res.status === 200) {
      const data = await res.json();
      setSignatures([...data.guestbook]);
    }
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
      <Header token={token} />
      <Input
        existing={existing}
        handleSubmit={handleSubmit}
        login={login}
        token={token}
      />
      <Signatures handleDelete={handleDelete} id={id} signatures={signatures} />
      <Nav page={page} pageCount={pageCount} />
    </>
  );
}

export default HomePage;

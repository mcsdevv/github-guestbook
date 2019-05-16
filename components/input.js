const Input = ({ existing, handleSubmit, login, token }) =>
  token && (
    <>
      <h3>
        Hello, {login},{' '}
        {existing && existing.comment
          ? 'want to update your signature?'
          : 'want to sign the guestbook?'}
      </h3>
      <form onSubmit={handleSubmit}>
        <input id="comment" name="comment" required />
        <button type="submit">Sign</button>
      </form>
      <style jsx>{`
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

export default Input;

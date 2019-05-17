import Link from 'next/link';

const Signatures = ({ handleDelete, id, signatures }) =>
  signatures.length >= 1 && (
    <>
      <h2>Signatures</h2>
      <ul>
        {signatures.map(
          s =>
            s.comment && (
              <li key={s.login}>
                <Link href={`https://github.com/${s.login}`}>
                  <a className="comment">
                    <img src={s.avatar} />
                  </a>
                </Link>
                <div className="description">
                  <div className="row">
                    <h4>{s.login}</h4>
                    <div className="time">
                      {new Date(s.updated).toTimeString()}
                    </div>
                  </div>
                  <div className="row">
                    <p>{s.comment}</p>
                    {id == s.id && (
                      <button className="delete" onClick={handleDelete}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            )
        )}
      </ul>
      <style jsx>{`
        ul {
          margin-left: 0;
        }
        ul li::before {
          content: '';
        }
        li {
          border-radius: 5px;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 6px 12px;
          display: grid;
          grid-template-columns: 150px 1fr;
          height: 150px;
          margin-bottom: 24px;
        }
        a {
          border-bottom: none;
        }
        a:hover {
          border-bottom: none;
        }
        img {
          border-bottom-left-radius: 5px;
          border-top-left-radius: 5px;
          height: 100%;
          width: 100%;
        }
        h4 {
          margin: 0;
        }
        .comment {
          width: 150px;
        }
        .description {
          box-sizing: border-box;
          color: #333;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1em;
        }
        .row {
          display: flex;
          height: fit-content;
          justify-content: space-between;
          width: 100%;
        }
        .delete {
          align-self: center;
          height: 37px;
          min-width: fit-content;
          max-width: fit-content;
        }
      `}</style>
    </>
  );

export default Signatures;

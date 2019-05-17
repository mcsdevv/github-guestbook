import Link from 'next/link';

const Nav = ({ page, pageCount }) => (
  <>
    <nav>
      {page > 1 && (
        <Link prefetch href={`/?page=${page - 1}&limit=5`}>
          <a>Previous</a>
        </Link>
      )}
      {page < pageCount && (
        <Link prefetch href={`/?page=${page + 1}&limit=5`}>
          <a className="next">Next</a>
        </Link>
      )}
    </nav>
    <style jsx>{`
      nav {
        display: flex;
        justify-content: space-between;
      }
      .next {
        margin-left: auto;
      }
    `}</style>
  </>
);

export default Nav;

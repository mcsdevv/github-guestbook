import Link from 'next/link';

const Header = ({ token }) => (
  <>
    <header>
      <h1>GitHub Guestbook</h1>
      <Link href={!token ? `/api/auth?provider=github` : `/?token=logout`}>
        <a>
          <button>
            {token !== undefined ? 'Logout' : 'Login With GitHub'}
          </button>
        </a>
      </Link>
    </header>
    <style jsx>{`
      header {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }
      a {
        border-bottom: none;
      }
      a:hover {
        border-bottom: none;
      }
    `}</style>
  </>
);

export default Header;

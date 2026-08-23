function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header__container">
        <a href="/" className="logo">
          PifPaf Bloggers
        </a>

        {user && (
          <nav className="nav">
            <span className="nav__user">
              {user.name || user.email}
            </span>

            <button
              type="button"
              className="nav__logout"
              onClick={onLogout}
            >
              Выйти
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './Layout.css';

export function Header() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <span className="header__logo-icon">🛡️</span>
          <h1 className="header__title">DigitalHeritage</h1>
        </div>
        {user && (
          <div className="header__actions">
            <span className="header__user">{user.email}</span>
            <button className="header__logout" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export function Main({ children }) {
  return <main className="main">{children}</main>;
}

export function Container({ children, className = '' }) {
  return <div className={`container ${className}`}>{children}</div>;
}

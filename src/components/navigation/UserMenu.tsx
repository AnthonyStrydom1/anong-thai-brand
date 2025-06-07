import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface UserMenuProps {
  isLoggedIn: boolean;
  onLogin: (email: string, password: string) => Promise<void> | void;
  onLogout: () => void;
  translations: { [key: string]: string };
}

const UserMenu = ({ isLoggedIn, onLogin, onLogout, translations }: UserMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openLogin = () => setShowLoginModal(true);
  const closeLogin = () => setShowLoginModal(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onLogin(email, password);
      setEmail("");
      setPassword("");
      closeLogin();

      // Redirect after login to previous page or home "/"
      const from = (location.state as any)?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div>
        <button onClick={onLogout}>{translations.logout}</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={openLogin}>{translations.login}</button>

      {showLoginModal && (
        <div className="modal">
          <form onSubmit={handleLoginSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : translations.login}
            </button>
            <button type="button" onClick={closeLogin} disabled={isLoading}>
              Cancel
            </button>
            {error && <div style={{ color: "red" }}>{error}</div>}
          </form>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

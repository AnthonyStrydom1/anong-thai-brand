import React from "react";
import { navigationTranslations, NavigationTranslations } from "@/translations/navigation";

interface UserMenuProps {
  isLoggedIn: boolean;
  onLogin: (email?: string, password?: string) => Promise<void> | void;
  onLogout: () => void;
  translations: NavigationTranslations;
}

const UserMenu: React.FC<UserMenuProps> = ({ isLoggedIn, onLogin, onLogout, translations }) => {
  return (
    <nav>
      <ul>
        <li>{translations.home}</li>
        <li>{translations.shop}</li>
        {/* ... other navigation items ... */}
        {!isLoggedIn ? (
          <li>
            <button onClick={() => onLogin("demo@example.com", "password")}>{translations.login}</button>
          </li>
        ) : (
          <>
            <li>{translations.profile}</li>
            <li>
              <button onClick={onLogout}>{translations.logout}</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default UserMenu;

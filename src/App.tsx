export type UserMenuProps = {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  translations: {
    login: string;
    logout: string;
    profile: string;
  };
};

import { navigationTranslations } from "@/path/to/translations";

const translations = navigationTranslations.en; // or .th depending on language

<UserMenu
  isLoggedIn={isLoggedIn}
  onLogin={handleLogin}
  onLogout={handleLogout}
  translations={translations}
/>

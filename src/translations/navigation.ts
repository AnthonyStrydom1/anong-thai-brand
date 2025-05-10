
import { Language } from "@/contexts/LanguageContext";

export type NavigationTranslation = {
  home: string;
  shop: string;
  recipes: string;
  about: string;
  contact: string;
  search: string;
  cart: string;
  account: string;
  login: string;
  logout: string;
  profile: string;
  settings: string;
  searchPlaceholder: string;
  clearSearch: string;
  loginSuccess: string;
  logoutSuccess: string;
  welcomeBack: string;
};

export const navigationTranslations: Record<Language, NavigationTranslation> = {
  en: {
    home: "Home",
    shop: "Shop",
    recipes: "Recipes",
    about: "About",
    contact: "Contact",
    search: "Search",
    cart: "Cart",
    account: "Account",
    login: "Login",
    logout: "Logout",
    profile: "Profile",
    settings: "Settings",
    searchPlaceholder: "Search products or recipes...",
    clearSearch: "Clear",
    loginSuccess: "Successfully logged in",
    logoutSuccess: "Successfully logged out",
    welcomeBack: "Welcome back to Anong Thai!"
  },
  th: {
    home: "หน้าหลัก",
    shop: "ซื้อสินค้า",
    recipes: "สูตรอาหาร",
    about: "เกี่ยวกับอนงค์",
    contact: "ติดต่อเรา",
    search: "ค้นหา",
    cart: "ตะกร้า",
    account: "บัญชี",
    login: "เข้าสู่ระบบ",
    logout: "ออกจากระบบ",
    profile: "โปรไฟล์",
    settings: "ตั้งค่า",
    searchPlaceholder: "ค้นหาสินค้าหรือสูตรอาหาร...",
    clearSearch: "ล้าง",
    loginSuccess: "เข้าสู่ระบบสำเร็จ",
    logoutSuccess: "ออกจากระบบสำเร็จ",
    welcomeBack: "ยินดีต้อนรับกลับสู่อนงค์ไทย!"
  }
};

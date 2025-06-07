interface NavigationTranslations {
  home: string;
  shop: string;
  recipes: string;
  about: string;
  contact: string;
  search: string;
  searchPlaceholder: string;
  login: string;
  logout: string;
  profile: string;
  myCart: string;
  account: string;
  orders: string;
  settings: string;
  loginSuccess: string;
  welcomeBack: string;
  logoutSuccess: string;

  [key: string]: string;  // <-- This line makes it compatible with string index signatures
}

export const navigationTranslations: Record<'en' | 'th', NavigationTranslations> = {
  en: {
    home: 'Home',
    shop: 'Shop',
    recipes: 'Recipes',
    about: 'About Us',
    contact: 'Contact',
    search: 'Search',
    searchPlaceholder: 'What are you looking for?',
    login: 'Login',
    logout: 'Logout',
    profile: 'Profile',
    myCart: 'My Cart',
    account: 'My Account',
    orders: 'My Orders',
    settings: 'Settings',
    loginSuccess: 'Login Successful',
    welcomeBack: 'Welcome back!',
    logoutSuccess: 'You have been logged out'
  },
  th: {
    home: 'หน้าแรก',
    shop: 'ร้านค้า',
    recipes: 'สูตรอาหาร',
    about: 'เกี่ยวกับเรา',
    contact: 'ติดต่อ',
    search: 'ค้นหา',
    searchPlaceholder: 'คุณกำลังมองหาอะไร?',
    login: 'เข้าสู่ระบบ',
    logout: 'ออกจากระบบ',
    profile: 'โปรไฟล์',
    myCart: 'ตะกร้าของฉัน',
    account: 'บัญชีของฉัน',
    orders: 'คำสั่งซื้อของฉัน',
    settings: 'ตั้งค่า',
    loginSuccess: 'เข้าสู่ระบบสำเร็จ',
    welcomeBack: 'ยินดีต้อนรับกลับ!',
    logoutSuccess: 'คุณได้ออกจากระบบแล้ว'
  }
};

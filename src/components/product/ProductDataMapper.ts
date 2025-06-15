
export interface ProductData {
  name: { en: string; th: string };
  shortDescription: { en: string; th: string };
  description: { en: string; th: string };
  ingredients: { en: string[]; th: string[] };
  useIn: { en: string[]; th: string[] };
}

const productDataMap: { [key: string]: ProductData } = {
  'Tom Yum Chili Paste': {
    name: { 
      en: 'Tom Yum Chili Paste', 
      th: 'น้ำพริกต้มยำ' 
    },
    shortDescription: { 
      en: 'Spicy and tangy paste for authentic Tom Yum soup', 
      th: 'น้ำพริกรสเผ็ดเปรี้ยวสำหรับต้มยำแท้' 
    },
    description: { 
      en: 'Spicy and tangy Tom Yum Chili Paste with roasted dry chili, shallots, garlic, coconut sugar, fish sauce, shrimp paste, oyster sauce, and dark soy sauce.', 
      th: 'น้ำพริกต้มยำรสเผ็ดเปรี้ยว ผสมพริกแห้งคั่ว หอมแดง กระเทียม น้ำตาลมะพร้าว น้ำปลา กะปิ น้ำมันหอย และซีอิ๊วดำ' 
    },
    ingredients: { 
      en: ['Roasted dry chili', 'Shallots', 'Garlic', 'Coconut sugar', 'Fish sauce', 'Shrimp paste', 'Oyster sauce', 'Dark soy sauce'], 
      th: ['พริกแห้งคั่ว', 'หอมแดง', 'กระเทียม', 'น้ำตาลมะพร้าว', 'น้ำปลา', 'กะปิ', 'น้ำมันหอย', 'ซีอิ๊วดำ'] 
    },
    useIn: { 
      en: ['Tom Yum soup', 'Stir-fry dishes', 'Seafood dishes'], 
      th: ['ต้มยำ', 'ผัดผัก', 'อาหารทะเล'] 
    }
  },
  'Red Curry Paste': {
    name: { 
      en: 'Red Curry Paste', 
      th: 'น้ำพริกแกงเผ็ด' 
    },
    shortDescription: { 
      en: 'Authentic red curry paste for traditional Thai curries', 
      th: 'น้ำพริกแกงเผ็ดแท้สำหรับแกงไทยดั้งเดิม' 
    },
    description: { 
      en: 'Traditional red curry paste made with red chilies, galangal, lemongrass, garlic, shallots, and aromatic spices for authentic Thai red curry.', 
      th: 'น้ำพริกแกงเผ็ดดั้งเดิมทำจากพริกแห้งแดง ข่า ตะไคร้ กระเทียม หอมแดง และเครื่องเทศหอมสำหรับแกงเผ็ดไทยแท้' 
    },
    ingredients: { 
      en: ['Red chilies', 'Galangal', 'Lemongrass', 'Garlic', 'Shallots', 'Kaffir lime zest', 'Coriander root', 'White peppercorns'], 
      th: ['พริกแห้งแดง', 'ข่า', 'ตะไคร้', 'กระเทียม', 'หอมแดง', 'ผิวมะกรูด', 'รากผักชี', 'พริกไทยขาว'] 
    },
    useIn: { 
      en: ['Red curry', 'Panang curry', 'Stir-fry dishes'], 
      th: ['แกงเผ็ด', 'แกงพะแนง', 'ผัดผัก'] 
    }
  },
  'Green Curry Paste': {
    name: { 
      en: 'Green Curry Paste', 
      th: 'น้ำพริกแกงเขียวหวาน' 
    },
    shortDescription: { 
      en: 'Fresh and aromatic green curry paste', 
      th: 'น้ำพริกแกงเขียวหวานสดหอม' 
    },
    description: { 
      en: 'Fresh green curry paste made with green chilies, Thai basil, galangal, and aromatic herbs for the perfect green curry.', 
      th: 'น้ำพริกแกงเขียวหวานสดทำจากพริกเขียว โหระพา ข่า และสมุนไพรหอมสำหรับแกงเขียวหวานที่สมบูรณ์แบบ' 
    },
    ingredients: { 
      en: ['Green chilies', 'Thai basil', 'Galangal', 'Lemongrass', 'Garlic', 'Shallots', 'Kaffir lime leaves'], 
      th: ['พริกเขียว', 'โหระพา', 'ข่า', 'ตะไคร้', 'กระเทียม', 'หอมแดง', 'ใบมะกรูด'] 
    },
    useIn: { 
      en: ['Green curry', 'Stir-fry with basil', 'Soup dishes'], 
      th: ['แกงเขียวหวาน', 'ผัดกะเพรา', 'แกงซุป'] 
    }
  },
  'Panang Curry Paste': {
    name: { 
      en: 'Panang Curry Paste', 
      th: 'น้ำพริกแกงพะแนง' 
    },
    shortDescription: { 
      en: 'Rich and creamy Panang curry paste', 
      th: 'น้ำพริกแกงพะแนงหอมครีมมี่' 
    },
    description: { 
      en: 'Rich Panang curry paste with roasted peanuts, red chilies, and aromatic spices for a creamy and flavorful curry.', 
      th: 'น้ำพริกแกงพะแนงเข้มข้นด้วยถั่วลิสงคั่ว พริกแห้งแดง และเครื่องเทศหอมสำหรับแกงครีมมี่รสชาติเข้มข้น' 
    },
    ingredients: { 
      en: ['Roasted peanuts', 'Red chilies', 'Galangal', 'Lemongrass', 'Garlic', 'Shallots', 'Coriander seeds'], 
      th: ['ถั่วลิสงคั่ว', 'พริกแห้งแดง', 'ข่า', 'ตะไคร้', 'กระเทียม', 'หอมแดง', 'ลูกผักชี'] 
    },
    useIn: { 
      en: ['Panang curry', 'Beef curry', 'Pork curry'], 
      th: ['แกงพะแนง', 'แกงเนื้อ', 'แกงหมู'] 
    }
  },
  'Massaman Curry Paste': {
    name: { 
      en: 'Massaman Curry Paste', 
      th: 'น้ำพริกแกงมัสมั่น' 
    },
    shortDescription: { 
      en: 'Mild and aromatic Massaman curry paste', 
      th: 'น้ำพริกแกงมัสมั่นหอมอ่อนโยน' 
    },
    description: { 
      en: 'Mild Massaman curry paste with warming spices, roasted peanuts, and aromatic herbs for a rich and complex flavor.', 
      th: 'น้ำพริกแกงมัสมั่นรสอ่อนโยนด้วยเครื่องเทศอุ่น ถั่วลิสงคั่ว และสมุนไพรหอมสำหรับรสชาติเข้มข้นและซับซ้อน' 
    },
    ingredients: { 
      en: ['Roasted peanuts', 'Red chilies', 'Cinnamon', 'Cardamom', 'Cloves', 'Galangal', 'Lemongrass'], 
      th: ['ถั่วลิสงคั่ว', 'พริกแห้งแดง', 'อบเชย', 'กระวาน', 'กานพลู', 'ข่า', 'ตะไคร้'] 
    },
    useIn: { 
      en: ['Massaman curry', 'Beef stew', 'Potato curry'], 
      th: ['แกงมัสมั่น', 'เนื้อตุ๋น', 'แกงมันฝรั่ง'] 
    }
  },
  'Yellow Curry Paste': {
    name: { 
      en: 'Yellow Curry Paste', 
      th: 'น้ำพริกแกงเหลือง' 
    },
    shortDescription: { 
      en: 'Mild yellow curry paste with turmeric', 
      th: 'น้ำพริกแกงเหลืองอ่อนโยนด้วยขมิ้น' 
    },
    description: { 
      en: 'Mild yellow curry paste with turmeric, lemongrass, and aromatic spices for a gentle and flavorful curry.', 
      th: 'น้ำพริกแกงเหลืองรสอ่อนโยนด้วยขมิ้น ตะไคร้ และเครื่องเทศหอมสำหรับแกงรสชาติอ่อนโยนและหอม' 
    },
    ingredients: { 
      en: ['Turmeric', 'Lemongrass', 'Galangal', 'Garlic', 'Shallots', 'Yellow chilies', 'Coriander seeds'], 
      th: ['ขมิ้น', 'ตะไคร้', 'ข่า', 'กระเทียม', 'หอมแดง', 'พริกเหลือง', 'ลูกผักชี'] 
    },
    useIn: { 
      en: ['Yellow curry', 'Fish curry', 'Chicken curry'], 
      th: ['แกงเหลือง', 'แกงปลา', 'แกงไก่'] 
    }
  },
  'Pad Thai Sauce': {
    name: { 
      en: 'Pad Thai Sauce', 
      th: 'น้ำจิ้มผัดไทย' 
    },
    shortDescription: { 
      en: 'Authentic Pad Thai sauce for perfect noodles', 
      th: 'น้ำจิ้มผัดไทยแท้สำหรับก๋วยเตี๋ยวที่สมบูรณ์แบบ' 
    },
    description: { 
      en: 'Traditional Pad Thai sauce with tamarind, fish sauce, palm sugar, and aromatic spices for authentic Thai noodles.', 
      th: 'น้ำจิ้มผัดไทยดั้งเดิมด้วยมะขาม น้ำปลา น้ำตาลปึก และเครื่องเทศหอมสำหรับก๋วยเตี๋ยวไทยแท้' 
    },
    ingredients: { 
      en: ['Tamarind paste', 'Fish sauce', 'Palm sugar', 'Rice vinegar', 'Chili flakes'], 
      th: ['น้ำมะขาม', 'น้ำปลา', 'น้ำตาลปึก', 'น้ำส้มสายชู', 'พริกป่น'] 
    },
    useIn: { 
      en: ['Pad Thai', 'Stir-fried noodles', 'Noodle soups'], 
      th: ['ผัดไทย', 'ก๋วยเตี๋ยวผัด', 'ก๋วยเตี๋ยวน้ำ'] 
    }
  },
  'Sukiyaki Dipping Sauce': {
    name: { 
      en: 'Sukiyaki Dipping Sauce', 
      th: 'น้ำจิ้มสุกี้' 
    },
    shortDescription: { 
      en: 'Spicy and tangy sukiyaki dipping sauce', 
      th: 'น้ำจิ้มสุกี้เผ็ดเปรี้ยว' 
    },
    description: { 
      en: 'Spicy and tangy sukiyaki dipping sauce with chilies, lime, garlic, and fish sauce for the perfect sukiyaki experience.', 
      th: 'น้ำจิ้มสุกี้รสเผ็ดเปรี้ยวด้วยพริก มะนาว กระเทียม และน้ำปลาสำหรับประสบการณ์สุกี้ที่สมบูรณ์แบบ' 
    },
    ingredients: { 
      en: ['Thai chilies', 'Lime juice', 'Garlic', 'Fish sauce', 'Sugar', 'Cilantro'], 
      th: ['พริกไทย', 'น้ำมะนาว', 'กระเทียม', 'น้ำปลา', 'น้ำตาล', 'ผักชี'] 
    },
    useIn: { 
      en: ['Sukiyaki', 'Hot pot', 'Grilled meat'], 
      th: ['สุกี้', 'ชาบู', 'เนื้อย่าง'] 
    }
  }
};

export const getProductData = (productName: string): ProductData => {
  const data = productDataMap[productName];
  if (!data) {
    // Return default English data if no translation found
    return {
      name: { en: productName, th: productName },
      shortDescription: { en: '', th: '' },
      description: { en: '', th: '' },
      ingredients: { en: [], th: [] },
      useIn: { en: [], th: [] }
    };
  }
  return data;
};

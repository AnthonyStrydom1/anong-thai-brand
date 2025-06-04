import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "red-curry-paste",
    name: {
      en: "Red Curry Paste",
      th: "พริกแกงเผ็ด"
    },
    description: {
      en: "Our authentic Red Curry Paste is crafted using Anong's traditional family recipe. Made with a perfect blend of dried red chili, garlic, lemongrass, galangal, and other premium Thai ingredients. A perfect base for creating delicious Thai curries and other dishes.",
      th: "พริกแกงเผ็ดของเราทำจากสูตรดั้งเดิมของครอบครัวอนงค์ ผลิตจากพริกแห้ง กระเทียม ตะไคร้ ข่า และส่วนผสมไทยระดับพรีเมียมอื่นๆ เป็นพื้นฐานที่สมบูรณ์แบบสำหรับการสร้างแกงไทยและอาหารอื่นๆที่อร่อย"
    },
    shortDescription: {
      en: "A rich, aromatic paste for authentic Thai red curry",
      th: "พริกแกงเผ็ดสูตรต้นตำรับจากอนงค์ เหมาะสำหรับแกงไทยแท้"
    },
    price: 120.00,
    image: "/lovable-uploads/59d60aec-006e-402a-b7fe-08e8f466618c.png",
    category: "curry-pastes",
    ingredients: {
      en: ["Dried red chili", "Garlic", "Lemongrass", "Galangal", "Shallots", "Kaffir lime zest", "Shrimp paste", "Salt"],
      th: ["พริกแห้ง", "กระเทียม", "ตะไคร้", "ข่า", "หอมแดง", "ผิวมะกรูด", "กระปิ", "เกลือ"]
    },
    useIn: {
      en: ["Red Curry Chicken", "Spicy Tofu Curry"],
      th: ["แกงเผ็ดไก่", "แกงเผ็ดเต้าหู้"]
    }
  },
  {
    id: "pad-thai-sauce",
    name: {
      en: "Pad Thai Sauce",
      th: "ซอสผัดไทย"
    },
    description: {
      en: "Our Pad Thai Sauce captures the perfect balance of sweet, tangy and savory flavors essential for Thailand's most famous stir-fried noodle dish. Made with premium tamarind, palm sugar, and fish sauce following Anong's secret recipe.",
      th: "ซอสผัดไทยของเราจับความสมดุลที่สมบูรณ์แบบของรสชาติหวาน เปรี้ยว และเค็มที่จำเป็นสำหรับอาหารผัดเส้นที่มีชื่อเสียงที่สุดของประเทศไทย ทำจากมะขามเทศคุณภาพสูง น้ำตาลมะพร้าว และน้ำปลา ตามสูตรลับของอนงค์"
    },
    shortDescription: {
      en: "Sweet, tangy, and savory for authentic Pad Thai",
      th: "ซอสผัดไทย รสกลมกล่อม ใช้ง่ายพร้อมปรุง"
    },
    price: 75.00,
    image: "https://i.postimg.cc/QtKc51d0/pad-thai.png",
    category: "stir-fry-sauces",
    ingredients: {
      en: ["Tamarind", "Palm sugar", "Fish sauce", "Garlic", "Chili"],
      th: ["มะขาม", "น้ำตาลมะพร้าว", "น้ำปลา", "กระเทียม", "พริก"]
    },
    useIn: {
      en: ["Classic Pad Thai", "Pad Thai with Tofu"],
      th: ["ผัดไทยสูตรต้นตำรับ", "ผัดไทยเต้าหู้"]
    }
  },
  {
    id: "panang-curry-paste",
    name: {
      en: "Panang Curry Paste",
      th: "พริกแกงแพนง"
    },
    description: {
      en: "Rich and aromatic Panang Curry Paste featuring dried chili, galangal, lemongrass, kaffir lime peel, shallots, garlic, coriander seeds, krachai, peas, cumin, pepper, and krapid.",
      th: "พริกแกงแพนงที่มีกลิ่นหอมและรสชาติเข้มข้น ประกอบด้วยพริกแห้ง ข่า ตะไคร้ ผิวมะกรูด หอมแดง กระเทียม เมล็ดผักชี กระชาย ถั่วริสง ยี่หล่า พริกไทย และกระปิด"
    },
    shortDescription: {
      en: "Rich and nutty Thai curry paste with a hint of sweetness",
      th: "พริกแกงแพนงรสชาติเข้มข้น มีความหอมของถั่ว และหวานนิดๆ"
    },
    price: 135.00,
    image: "/lovable-uploads/fbfc8d89-fd2d-424e-b4da-d308f2b934aa.png",
    category: "curry-pastes",
    ingredients: {
      en: ["Dried chili", "Galangal", "Lemongrass", "Kaffir lime peel", "Shallots", "Garlic", "Coriander seeds", "Krachai", "Peas", "Cumin", "Pepper", "Krapid"],
      th: ["พริกแห้ง", "ข่า", "ตะไคร้", "ผิวมะกรูด", "หอมแดง", "กระเทียม", "เมล็ดผักชี", "กระชาย", "ถั่วริสง", "ยี่หล่า", "พริกไทย", "กระปิด"]
    },
    useIn: {
      en: ["Panang Curry", "Grilled dishes"],
      th: ["แกงแพนง", "อาหารย่าง"]
    }
  },
  {
    id: "green-curry-paste",
    name: {
      en: "Green Curry Paste",
      th: "พริกแกงเขียวหวาน"
    },
    description: {
      en: "Fragrant Green Curry Paste made with fresh green chili, shallots, garlic, galangal, lemongrass, shrimp paste, soybean paste, coriander seeds, salt, and sweet dark soy sauce.",
      th: "พริกแกงเขียวหวานที่มีกลิ่นหอม ทำจากพริกเขียวสด หอมแดง กระเทียม ข่า ตะไคร้ กระปิ เต้าเขี้ยว เมล็ดผักชี เกลือ และซีอิ่วดำหวาน"
    },
    shortDescription: {
      en: "Aromatic green curry paste with a fresh herbaceous flavor",
      th: "พริกแกงเขียวหวานกลิ่นหอมสดชื่นจากสมุนไพร"
    },
    price: 130.00,
    image: "/lovable-uploads/a9343c5d-3d1a-4926-bb18-4c2794610f89.png",
    category: "curry-pastes",
    ingredients: {
      en: ["Fresh green chili", "Shallots", "Garlic", "Galangal", "Lemongrass", "Shrimp paste", "Soybean paste", "Coriander seeds", "Salt", "Sweet dark soy sauce"],
      th: ["พริกเขียวสด", "หอมแดง", "กระเทียม", "ข่า", "ตะไคร้", "กระปิ", "เต้าเขี้ยว", "เมล็ดผักชี", "เกลือ", "ซีอิ่วดำหวาน"]
    },
    useIn: {
      en: ["Green Curry", "Steamed dishes"],
      th: ["แกงเขียวหวาน", "อาหารนึ่ง"]
    }
  },
  {
    id: "tom-yum-chili-paste",
    name: {
      en: "Tom Yum Chili Paste",
      th: "พริกเผาต้มยำ"
    },
    description: {
      en: "Spicy and tangy Tom Yum Chili Paste with roasted dry chili, shallots, garlic, coconut sugar, fish sauce, shrimp paste, oyster sauce, and dark soy sauce.",
      th: "พริกเผาต้มยำรสเผ็ดและเปรี้ยว ทำจากพริกแห้งคั่ว หอมแดง กระเทียม น้ำตาลมะพร้าว น้ำปลา กระปิ น้ำมันหอย และซีอิ่วดำ"
    },
    shortDescription: {
      en: "Spicy and tangy paste perfect for Tom Yum soup",
      th: "พริกเผารสเผ็ดเปรี้ยว เหมาะสำหรับต้มยำ"
    },
    price: 115.00,
    image: "https://i.postimg.cc/0jc5yH13/tom-yum.png",
    category: "curry-pastes",
    ingredients: {
      en: ["Roasted Dry Chili", "Shallots", "Garlic", "Coconut Sugar", "Fish Sauce", "Shrimp Paste", "Oyster Sauce", "Dark Soy Sauce"],
      th: ["พริกแห้งคั่ว", "หอมแดง", "กระเทียม", "น้ำตาลมะพร้าว", "น้ำปลา", "กระปิ", "น้ำมันหอย", "ซีอิ่วดำ"]
    },
    useIn: {
      en: ["Tom Yum Soup", "Stir-fried seafood"],
      th: ["ต้มยำ", "อาหารทะเลผัด"]
    }
  },
  {
    id: "massaman-curry-paste",
    name: {
      en: "Massaman Curry Paste",
      th: "พริกแกงมัสมั่น"
    },
    description: {
      en: "Complex and aromatic Massaman Curry Paste featuring dried chili, shallots, garlic, galangal, lemongrass, fresh ginger, peanuts, cornstarch, coriander seeds, cumin, cinnamon, rice bran oil, cloves, shrimp paste, and lime peel.",
      th: "พริกแกงมัสมั่นที่มีรสชาติซับซ้อนและหอม ประกอบด้วยพริกแห้ง หอมแดง กระเทียม ข่า ตะไคร้ ขิงสด เป้ยกั๊ก ลูกจัน เมล็ดผักชี ยี่หล่า อบเชย น้ำมันรำข้าว กานพู กระปิ และผิวมะกรูด"
    },
    shortDescription: {
      en: "Complex curry paste with warm spices and nutty flavors",
      th: "พริกแกงรสซับซ้อน มีกลิ่นเครื่องเทศอบอุ่นและถั่ว"
    },
    price: 140.00,
    image: "/lovable-uploads/79ede76f-515f-435f-b671-7d1bbe124f12.png",
    category: "curry-pastes",
    ingredients: {
      en: ["Dried chili", "Shallots", "Garlic", "Galangal", "Lemongrass", "Fresh ginger", "Peanuts", "Cornstarch", "Coriander seeds", "Cumin", "Cinnamon", "Rice bran oil", "Cloves", "Shrimp paste", "Lime peel"],
      th: ["พริกแห้ง", "หอมแดง", "กระเทียม", "ข่า", "ตะไคร้", "ขิงสด", "เป้ยกั๊ก", "ลูกจัน", "เมล็ดผักชี", "ยี่หล่า", "อบเชย", "น้ำมันรำข้าว", "กานพู", "กระปิ", "ผิวมะกรูด"]
    },
    useIn: {
      en: ["Massaman Curry", "Slow-cooked dishes"],
      th: ["แกงมัสมั่น", "อาหารตุ๋น"]
    }
  },
  {
    id: "sukiyaki-sauce",
    name: {
      en: "Sukiyaki Sauce",
      th: "น้ำจิ้มสุกี้ยากี้"
    },
    description: {
      en: "Savory and sweet Sukiyaki Sauce with fresh chili, garlic, pickled garlic, coriander seeds, fermented bean curd, roasted sesame seeds, cane sugar, tamarind paste, chili sauce, light soy sauce, sesame oil, oyster sauce, tomato sauce, and salt.",
      th: "น้ำจิ้มสุกี้ยากี้รสเค็มและหวาน ทำจากพริกสด กระเทียม กระเทียมดอง เมล็ดผักชี เต้าหู้ยี้ งาคั่ว น้ำตาลอ้อย มะขามเปียก ซอสพริก ซีอิ้วขาว น้ำมันงา น้ำมันหอย ซอสมะเขือเทศ และเกลือ"
    },
    shortDescription: {
      en: "Sweet and tangy dipping sauce perfect for hot pot",
      th: "น้ำจิ้มรสหวานเปรี้ยว เหมาะสำหรับสุกี้"
    },
    price: 85.00,
    image: "https://i.postimg.cc/2j2CvJg9/moo-kra-ta.png",
    category: "dipping-sauces",
    ingredients: {
      en: ["Fresh chili", "Garlic", "Pickled garlic", "Coriander seeds", "Fermented bean curd", "Roasted sesame seeds", "Cane sugar", "Tamarind paste", "Chili sauce", "Light soy sauce", "Sesame oil", "Oyster sauce", "Tomato sauce", "Salt"],
      th: ["พริกสด", "กระเทียม", "กระเทียมดอง", "เมล็ดผักชี", "เต้าหู้ยี้", "งาคั่ว", "น้ำตาลอ้อย", "มะขามเปียก", "ซอสพริก", "ซีอิ้วขาว", "น้ำมันงา", "น้ำมันหอย", "ซอสมะเขือเทศ", "เกลือ"]
    },
    useIn: {
      en: ["Sukiyaki", "Hot Pot", "Grilled meats"],
      th: ["สุกี้ยากี้", "หม้อไฟ", "เนื้อย่าง"]
    }
  }
];

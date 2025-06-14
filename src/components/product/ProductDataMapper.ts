
export const getProductImage = (productName: string): string => {
  const imageMap: { [key: string]: string } = {
    'Pad Thai Sauce': '/lovable-uploads/5a0dec88-a26c-4e29-bda6-8d921887615e.png',
    'Sukiyaki Dipping Sauce': '/lovable-uploads/322ef915-5db5-4834-9e45-92a34dc3adb6.png',
    'Tom Yum Chili Paste': '/lovable-uploads/fc66a288-b44b-4bf4-a82f-a2c844b58979.png',
    'Red Curry Paste': '/lovable-uploads/dbb561f8-a97a-447c-8946-5a1d279bed05.png',
    'Panang Curry Paste': '/lovable-uploads/5308a5d2-4f12-42ed-b3f8-f2aa5d7fbac9.png',
    'Massaman Curry Paste': '/lovable-uploads/c936ed96-2c61-4919-9e6d-14f740c80b80.png',
    'Green Curry Paste': '/lovable-uploads/1ae4d3c5-e136-4ed4-9a71-f1e9d6123a83.png',
    'Yellow Curry Paste': '/lovable-uploads/acf32ec1-9435-4a5c-8baf-1943b85b93bf.png'
  };

  return imageMap[productName] || '/placeholder.svg';
};

export const getProductData = (productName: string) => {
  const productData: { [key: string]: { 
    ingredients: { en: string[], th: string[] }, 
    howToUse: { en: string[], th: string[] },
    description: { en: string, th: string },
    name: { en: string, th: string },
    shortDescription: { en: string, th: string }
  }} = {
    'Pad Thai Sauce': {
      name: { en: 'Pad Thai Sauce', th: 'ซอสผัดไทย' },
      shortDescription: { 
        en: 'Authentic Thai Pad Thai sauce with the perfect balance of sweet, sour, and savory flavors.',
        th: 'ซอสผัดไทยแท้รสชาติสมดุลระหว่างหวาน เปรียว และเค็ม'
      },
      ingredients: {
        en: ['Tamarind paste', 'Palm sugar', 'Fish sauce', 'Tomato paste', 'Garlic', 'Shallots', 'Dried shrimp', 'Vegetable oil'],
        th: ['น้ำมะขามเปียก', 'น้ำตาลปี๊บ', 'น้ำปลา', 'มะเขือเทศ', 'กระเทียม', 'หอมแดง', 'กุ้งแห้ง', 'น้ำมันพืช']
      },
      howToUse: {
        en: ['Heat 2 tbsp oil in wok', 'Add 3-4 tbsp sauce to stir-fry', 'Toss with rice noodles and vegetables', 'Garnish with peanuts and lime'],
        th: ['ตั้งน้ำมัน 2 ช้อนโต๊ะในกระทะ', 'ใส่ซอส 3-4 ช้อนโต๊ะลงผัด', 'ผัดกับเส้นหวยเตี๋ยวและผัก', 'โรยถั่วลิสงและมะนาว']
      },
      description: {
        en: 'Authentic Thai Pad Thai sauce with the perfect balance of sweet, sour, and savory flavors. Made with traditional ingredients for an authentic taste.',
        th: 'ซอสผัดไทยแท้รสชาติสมดุลระหว่างหวาน เปรียว และเค็ม ทำจากส่วนผสมดั้งเดิมเพื่อรสชาติที่แท้จริง'
      }
    },
    'Panang Curry Paste': {
      name: { en: 'Panang Curry Paste', th: 'พริกแกงพะแนง' },
      shortDescription: { 
        en: 'Rich and nutty Thai curry paste with a hint of sweetness',
        th: 'พริกแกงไทยเข้มข้นหอมถั่วคั่ว มีรสหวานอ่อนๆ'
      },
      ingredients: {
        en: ['Red chilies', 'Galangal', 'Lemongrass', 'Kaffir lime zest', 'Garlic', 'Shallots', 'Peanuts', 'Shrimp paste'],
        th: ['พริกแกงพะแนง', 'ข่า', 'ตะไคร้', 'ผิวมะกรูด', 'กระเทียม', 'หอมแดง', 'ถั่วลิสง', 'กะปิ']
      },
      howToUse: {
        en: ['Fry paste in oil until aromatic', 'Add thick coconut cream', 'Simmer with meat until tender', 'Garnish with Thai basil'],
        th: ['ผัดพริกแกงในน้ำมันให้หอม', 'ใส่หัวกะทิข้น', 'ต้มกับเนื้อจนนุ่ม', 'โรยใบโหระพา']
      },
      description: {
        en: 'Rich and nutty Panang curry paste with roasted peanuts. Creates thick, creamy curry with mild heat and complex flavors.',
        th: 'พริกแกงพะแนงเข้มข้นหอมถั่วคั่ว สร้างแกงข้นครีมี รสไม่เผ็ดมาก และซับซ้อน'
      }
    },
    'Sukiyaki Dipping Sauce': {
      name: { en: 'Sukiyaki Dipping Sauce', th: 'น้ำจิ้มสุกี้ยากี้' },
      shortDescription: { 
        en: 'Traditional Japanese-style dipping sauce perfect for sukiyaki and hot pot',
        th: 'น้ำจิ้มสไตล์ญี่ปุ่นแบบดั้งเดิม เหมาะสำหรับสุกี้ยากี้และหม้อไฟ'
      },
      ingredients: {
        en: ['Soy sauce', 'Sugar', 'Rice vinegar', 'Sesame oil', 'Garlic', 'Chili', 'Lime juice'],
        th: ['ซีอิ๊วขาว', 'น้ำตาล', 'น้ำส้มสายชูข้าว', 'น้ำมันงา', 'กระเทียม', 'พริก', 'น้ำมะนาว']
      },
      howToUse: {
        en: ['Serve as dipping sauce for sukiyaki', 'Great with grilled meats', 'Perfect for hot pot dining', 'Mix with fresh vegetables'],
        th: ['เสิร์ฟเป็นน้ำจิ้มสุกี้ยากี้', 'เหมาะกับเนื้อย่าง', 'เพอร์เฟกต์สำหรับหม้อไฟ', 'ผสมกับผักสด']
      },
      description: {
        en: 'Traditional Japanese-style dipping sauce perfect for sukiyaki, hot pot, and grilled meats. Sweet and tangy flavor profile.',
        th: 'น้ำจิ้มสไตล์ญี่ปุ่นแบบดั้งเดิม เหมาะสำหรับสุกี้ยากี้ หม้อไฟ และเนื้อย่าง รสหวานและเปรี้ยว'
      }
    },
    'Tom Yum Chili Paste': {
      name: { en: 'Tom Yum Chili Paste', th: 'น้ำพริกต้มยำ' },
      shortDescription: { 
        en: 'Authentic Tom Yum paste with aromatic herbs and spices',
        th: 'น้ำพริกต้มยำแท้ด้วยสมุนไพรหอมๆ'
      },
      ingredients: {
        en: ['Red chilies', 'Lemongrass', 'Galangal', 'Kaffir lime leaves', 'Shallots', 'Garlic', 'Shrimp paste', 'Tamarind'],
        th: ['พริกแห้ง', 'ตะไคร้', 'ข่า', 'ใบมะกรูด', 'หอมแดง', 'กระเทียม', 'กะปิ', 'มะขาม']
      },
      howToUse: {
        en: ['Add 2-3 tbsp to boiling broth', 'Perfect for Tom Yum soup', 'Great for stir-fries', 'Mix with coconut milk for curry'],
        th: ['ใส่ 2-3 ช้อนโต๊ะในน้ำซุปเดือด', 'เหมาะสำหรับต้มยำ', 'ดีสำหรับผัด', 'ผสมกับกะทิทำแกง']
      },
      description: {
        en: 'Authentic Tom Yum paste with aromatic herbs and spices. Creates the signature hot and sour flavor of traditional Thai Tom Yum soup.',
        th: 'น้ำพริกต้มยำแท้ด้วยสมุนไพรหอมๆ สร้างรสเปรี้ยวจี๊ดจ๊าดแบบต้มยำไทยดั้งเดิม'
      }
    },
    'Red Curry Paste': {
      name: { en: 'Red Curry Paste', th: 'พริกแกงแดง' },
      shortDescription: { 
        en: 'Traditional Thai red curry paste made from fresh chilies and aromatic herbs',
        th: 'พริกแกงแดงไทยแท้จากพริกสดและสมุนไพรหอม'
      },
      ingredients: {
        en: ['Red chilies', 'Galangal', 'Lemongrass', 'Garlic', 'Shallots', 'Kaffir lime zest', 'Coriander root', 'Shrimp paste'],
        th: ['พริกแกงแดง', 'ข่า', 'ตะไคร้', 'กระเทียม', 'หอมแดง', 'ผิวมะกรูด', 'รากผักชี', 'กะปิ']
      },
      howToUse: {
        en: ['Fry 2-3 tbsp in oil until fragrant', 'Add coconut milk gradually', 'Perfect for red curry dishes', 'Great with chicken, beef, or vegetables'],
        th: ['ผัด 2-3 ช้อนโต๊ะในน้ำมันให้หอม', 'ใส่กะทิทีละน้อย', 'เหมาะสำหรับแกงแดง', 'ดีกับไก่ เนื้อ หรือผัก']
      },
      description: {
        en: 'Traditional Thai red curry paste made from fresh chilies and aromatic herbs. Creates rich, spicy, and flavorful curry dishes.',
        th: 'พริกแกงแดงไทยแท้จากพริกสดและสมุนไพรหอม สร้างแกงรสจัดจ้าน เผ็ดร้อน และหอมหวน'
      }
    },
    'Massaman Curry Paste': {
      name: { en: 'Massaman Curry Paste', th: 'พริกแกงมัสมั่น' },
      shortDescription: { 
        en: 'Persian-influenced Thai curry paste with warm spices',
        th: 'พริกแกงไทยที่ได้รับอิทธิพลเปอร์เซีย มีเครื่องเทศหอมอบอุ่น'
      },
      ingredients: {
        en: ['Red chilies', 'Galangal', 'Lemongrass', 'Garlic', 'Shallots', 'Cinnamon', 'Cardamom', 'Cloves', 'Nutmeg'],
        th: ['พริกแกงมัสมั่น', 'ข่า', 'ตะไคร้', 'กระเทียม', 'หอมแดง', 'อบเชย', 'ลูกกระวาน', 'กานพลู', 'จันทน์เทศ']
      },
      howToUse: {
        en: ['Fry paste until fragrant', 'Add coconut milk and meat', 'Simmer with potatoes and peanuts', 'Cook until tender and rich'],
        th: ['ผัดพริกแกงให้หอม', 'ใส่กะทิและเนื้อ', 'ต้มกับมันฝรั่งและถั่วลิสง', 'ปรุงจนนุ่มและเข้มข้น']
      },
      description: {
        en: 'Persian-influenced Thai curry paste with warm spices. Creates mild, sweet curry perfect with beef and potatoes.',
        th: 'พริกแกงไทยที่ได้รับอิทธิพลเปอร์เซีย มีเครื่องเทศหอมอบอุ่น สร้างแกงหวานอ่อนๆ เหมาะกับเนื้อและมันฝรั่ง'
      }
    },
    'Green Curry Paste': {
      name: { en: 'Green Curry Paste', th: 'พริกแกงเขียวหวาน' },
      shortDescription: { 
        en: 'Fiery Thai green curry paste made from fresh green chilies and herbs',
        th: 'พริกแกงเขียวหวานไทยแท้จากพริกเขียวสดและสมุนไพร'
      },
      ingredients: {
        en: ['Green chilies', 'Galangal', 'Lemongrass', 'Kaffir lime zest', 'Thai basil', 'Garlic', 'Shallots', 'Shrimp paste'],
        th: ['พริกขี้หนูเขียว', 'ข่า', 'ตะไคร้', 'ผิวมะกรูด', 'ใบโหระพา', 'กระเทียม', 'หอมแดง', 'กะปิ']
      },
      howToUse: {
        en: ['Fry paste in coconut oil', 'Add coconut milk slowly', 'Perfect for green curry', 'Great with chicken and eggplant'],
        th: ['ผัดพริกแกงในน้ำมันมะพร้าว', 'ใส่กะทิทีละน้อย', 'เหมาะสำหรับแกงเขียวหวาน', 'ดีกับไก่และมะเขือ']
      },
      description: {
        en: 'Fiery Thai green curry paste made from fresh green chilies and herbs. Creates vibrant, spicy curry with intense heat.',
        th: 'พริกแกงเขียวหวานไทยแท้จากพริกเขียวสดและสมุนไพร สร้างแกงสีสวย เผ็ดร้อนจัดจ้าน'
      }
    },
    'Yellow Curry Paste': {
      name: { en: 'Yellow Curry Paste', th: 'พริกแกงเหลือง' },
      shortDescription: { 
        en: 'Mild and aromatic yellow curry paste with turmeric',
        th: 'พริกแกงเหลืองอ่อนโยนหอมขมิ้น'
      },
      ingredients: {
        en: ['Yellow chilies', 'Turmeric', 'Galangal', 'Lemongrass', 'Garlic', 'Shallots', 'Ginger', 'Coriander seeds'],
        th: ['พริกแกงเหลือง', 'ขมิ้น', 'ข่า', 'ตะไคร้', 'กระเทียม', 'หอมแดง', 'ขิง', 'เม็ดผักชี']
      },
      howToUse: {
        en: ['Fry paste with onions', 'Add coconut milk and vegetables', 'Perfect for mild curry', 'Great with potatoes and chicken'],
        th: ['ผัดพริกแกงกับหอมใหญ่', 'ใส่กะทิและผัก', 'เหมาะสำหรับแกงอ่อน', 'ดีกับมันฝรั่งและไก่']
      },
      description: {
        en: 'Mild and aromatic yellow curry paste with turmeric. Creates golden, flavorful curry with gentle heat and earthy flavors.',
        th: 'พริกแกงเหลืองอ่อนโยนหอมขมิ้น สร้างแกงสีทองรสชาติหอมหวาน เผ็ดน้อยและกลิ่นหอมแผ่นดิน'
      }
    }
  };

  return productData[productName] || {
    name: { en: productName, th: productName },
    shortDescription: { 
      en: '', 
      th: '' 
    },
    ingredients: { 
      en: ['Premium quality ingredients'], 
      th: ['ส่วนผสมคุณภาพพรีเมียม'] 
    },
    howToUse: { 
      en: ['Use as directed on package'], 
      th: ['ใช้ตามคำแนะนำบนบรรจุภัณฑ์'] 
    },
    description: {
      en: '',
      th: ''
    }
  };
};

export const getRelatedRecipes = (productName: string) => {
  const productToRecipeMap: { [key: string]: string[] } = {
    'Pad Thai Sauce': ['pad-thai', 'thai-fried-noodles'],
    'Sukiyaki Dipping Sauce': ['thai-sukiyaki', 'hot-pot-vegetables'],
    'Tom Yum Chili Paste': ['tom-yum-goong', 'tom-yum-kai', 'spicy-thai-soup'],
    'Red Curry Paste': ['gaeng-daeng', 'red-curry-chicken', 'thai-red-curry'],
    'Panang Curry Paste': ['panang-curry', 'panang-beef', 'thai-panang'],
    'Massaman Curry Paste': ['massaman-curry', 'massaman-beef', 'thai-massaman'],
    'Green Curry Paste': ['gaeng-keow-wan', 'green-curry-chicken', 'thai-green-curry'],
    'Yellow Curry Paste': ['gaeng-kari', 'yellow-curry-chicken', 'thai-yellow-curry']
  };

  return productToRecipeMap[productName] || [];
};

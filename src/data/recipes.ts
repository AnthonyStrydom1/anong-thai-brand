
import { Recipe } from "@/types";

export const recipes: Recipe[] = [
  {
    id: "red-curry-chicken",
    name: {
      en: "Red Curry Chicken",
      th: "แกงเผ็ดไก่"
    },
    description: {
      en: "A classic Thai red curry with tender chicken pieces in a rich, aromatic coconut sauce. Perfect served with jasmine rice.",
      th: "แกงเผ็ดไก่สูตรดั้งเดิม เนื้อไก่นุ่มในซอสกะทิหอมกรุ่น เสิร์ฟพร้อมข้าวหอมมะลิ"
    },
    servings: 4,
    time: 30,
    image: "/lovable-uploads/photo-1472396961693-142e6e269027",
    ingredients: {
      en: [
        "2 tbsp Anong Red Curry Paste",
        "400ml coconut milk",
        "500g chicken breast, cut into bite-sized pieces",
        "1 cup bamboo shoots, sliced",
        "2 kaffir lime leaves",
        "1 red bell pepper, sliced",
        "1 tbsp fish sauce",
        "1 tbsp palm sugar",
        "1/4 cup Thai basil leaves"
      ],
      th: [
        "พริกแกงเผ็ดอนงค์ 2 ช้อนโต๊ะ",
        "กะทิ 400 มล.",
        "อกไก่ 500 กรัม หั่นเป็นชิ้นพอคำ",
        "หน่อไม้ 1 ถ้วย หั่นเป็นแว่น",
        "ใบมะกรูด 2 ใบ",
        "พริกหวานแดง 1 ลูก หั่นเป็นชิ้น",
        "น้ำปลา 1 ช้อนโต๊ะ",
        "น้ำตาลมะพร้าว 1 ช้อนโต๊ะ",
        "ใบโหระพา 1/4 ถ้วย"
      ]
    },
    steps: {
      en: [
        "Heat a small amount of coconut milk in a large pan until it begins to bubble.",
        "Add the curry paste and stir until fragrant, about 1-2 minutes.",
        "Add the chicken and stir to coat with the paste. Cook for 3-4 minutes.",
        "Pour in the remaining coconut milk, fish sauce, and palm sugar. Stir well.",
        "Add the bamboo shoots, kaffir lime leaves, and red bell pepper. Simmer for 10-15 minutes until chicken is cooked through.",
        "Stir in the Thai basil just before serving.",
        "Serve hot with jasmine rice."
      ],
      th: [
        "ใส่กะทิเล็กน้อยลงในกระทะใหญ่ อุ่นจนเริ่มเดือด",
        "ใส่พริกแกงลงไปผัดจนหอม ประมาณ 1-2 นาที",
        "ใส่เนื้อไก่ลงไปผัดให้เข้ากับพริกแกง ผัดต่อ 3-4 นาที",
        "เทกะทิที่เหลือ น้ำปลา และน้ำตาลมะพร้าวลงไป คนให้เข้ากัน",
        "ใส่หน่อไม้ ใบมะกรูด และพริกหวาน เคี่ยวต่อ 10-15 นาทีจนไก่สุก",
        "ใส่ใบโหระพาก่อนยกออกจากเตา",
        "เสิร์ฟร้อนๆกับข้าวหอมมะลิ"
      ]
    },
    relatedProducts: ["red-curry-paste"],
    category: ["curry", "chicken"]
  },
  {
    id: "classic-pad-thai",
    name: {
      en: "Classic Pad Thai",
      th: "ผัดไทยสูตรต้นตำรับ"
    },
    description: {
      en: "Thailand's famous stir-fried noodle dish with the perfect balance of sweet, sour, and savory flavors.",
      th: "อาหารผัดเส้นชื่อดังของไทย รสชาติสมดุลทั้งหวาน เปรี้ยว และเค็ม"
    },
    servings: 2,
    time: 25,
    image: "/lovable-uploads/photo-1500673922987-e212871fec22",
    ingredients: {
      en: [
        "120g rice noodles",
        "3 tbsp Anong Pad Thai Sauce",
        "200g large shrimp, peeled and deveined (or firm tofu, cubed)",
        "2 eggs, beaten",
        "1 cup bean sprouts",
        "3 spring onions, chopped",
        "2 tbsp crushed peanuts",
        "1 lime, cut into wedges",
        "2 tbsp vegetable oil"
      ],
      th: [
        "เส้นผัดไทย 120 กรัม",
        "ซอสผัดไทยอนงค์ 3 ช้อนโต๊ะ",
        "กุ้งใหญ่ปอกเปลือกและผ่าหลัง 200 กรัม (หรือเต้าหู้แข็ง หั่นเป็นลูกเต๋า)",
        "ไข่ตีแล้ว 2 ฟอง",
        "ถั่วงอก 1 ถ้วย",
        "ต้นหอม 3 ต้น หั่นเป็นท่อน",
        "ถั่วลิสงบด 2 ช้อนโต๊ะ",
        "มะนาว 1 ลูก หั่นเป็นชิ้น",
        "น้ำมันพืช 2 ช้อนโต๊ะ"
      ]
    },
    steps: {
      en: [
        "Soak the rice noodles in warm water for 15-20 minutes until soft, then drain.",
        "Heat oil in a wok or large frying pan over medium-high heat.",
        "Add shrimp (or tofu) and cook until just pink, about 1-2 minutes. Push to one side.",
        "Pour beaten eggs into the other side and scramble until just set.",
        "Add drained noodles and Anong Pad Thai Sauce. Toss well to combine.",
        "Add bean sprouts and most of the spring onions, reserving some for garnish. Stir-fry for 1-2 minutes more.",
        "Serve topped with crushed peanuts, reserved spring onions, and lime wedges."
      ],
      th: [
        "แช่เส้นผัดไทยในน้ำอุ่น 15-20 นาที จนนุ่ม แล้วสะเด็ดน้ำ",
        "ตั้งกระทะใส่น้ำมันบนไฟกลาง-สูง",
        "ใส่กุ้ง (หรือเต้าหู้) ลงไปผัดจนสุก ประมาณ 1-2 นาที แล้วดันไปด้านหนึ่ง",
        "เทไข่ที่ตีแล้วลงอีกด้าน และคนให้สุก",
        "ใส่เส้นที่สะเด็ดน้ำแล้วและซอสผัดไทยอนงค์ คลุกให้เข้ากัน",
        "ใส่ถั่วงอกและต้นหอมส่วนใหญ่ (เก็บไว้บางส่วนสำหรับตกแต่ง) ผัดต่อ 1-2 นาที",
        "เสิร์ฟโรยด้วยถั่วลิสงบด ต้นหอมที่เหลือ และมะนาว"
      ]
    },
    relatedProducts: ["pad-thai-sauce"],
    category: ["noodles", "vegetarian-option"]
  },
  {
    id: "panang-curry-beef",
    name: {
      en: "Panang Curry with Beef",
      th: "แกงแพนงเนื้อ"
    },
    description: {
      en: "Rich and creamy Panang curry with tender beef slices, infused with aromatic spices and a hint of peanut flavor.",
      th: "แกงแพนงเนื้อนุ่มที่มีรสชาติเข้มข้นและครีมมี่ หอมกลิ่นเครื่องเทศและกลิ่นถั่ว"
    },
    servings: 4,
    time: 35,
    image: "/lovable-uploads/photo-1506744038136-46273834b3fb",
    ingredients: {
      en: [
        "3 tbsp Anong Panang Curry Paste",
        "400ml coconut milk",
        "500g beef sirloin, thinly sliced",
        "2 kaffir lime leaves, finely sliced",
        "1 red bell pepper, sliced",
        "1/2 cup Thai basil leaves",
        "2 tbsp fish sauce",
        "1 tbsp palm sugar",
        "1/4 cup crushed roasted peanuts"
      ],
      th: [
        "พริกแกงแพนงอนงค์ 3 ช้อนโต๊ะ",
        "กะทิ 400 มล.",
        "เนื้อสันในวัว 500 กรัม หั่นบางๆ",
        "ใบมะกรูด 2 ใบ ซอยละเอียด",
        "พริกหวานแดง 1 ลูก หั่นเป็นชิ้น",
        "ใบโหระพา 1/2 ถ้วย",
        "น้ำปลา 2 ช้อนโต๊ะ",
        "น้ำตาลมะพร้าว 1 ช้อนโต๊ะ",
        "ถั่วลิสงคั่วบด 1/4 ถ้วย"
      ]
    },
    steps: {
      en: [
        "In a large pot, heat a few tablespoons of coconut milk over medium heat until it begins to bubble and separate.",
        "Add the Panang curry paste and stir-fry for 2 minutes until fragrant.",
        "Add the beef and stir to coat with the curry paste. Cook for about 3 minutes.",
        "Pour in the remaining coconut milk, fish sauce, and palm sugar. Stir well.",
        "Reduce heat and simmer for 15-20 minutes until beef is tender.",
        "Add the red bell pepper and cook for another 5 minutes.",
        "Stir in half of the crushed peanuts, kaffir lime leaves, and Thai basil.",
        "Serve garnished with remaining crushed peanuts and extra Thai basil leaves."
      ],
      th: [
        "ในหม้อใหญ่ ใส่กะทิสองสามช้อนโต๊ะตั้งไฟกลางจนเดือดและแยกตัว",
        "ใส่พริกแกงแพนงและผัดประมาณ 2 นาทีจนมีกลิ่นหอม",
        "ใส่เนื้อวัวและคลุกเคล้ากับพริกแกง ผัดประมาณ 3 นาที",
        "เติมกะทิที่เหลือ น้ำปลา และน้ำตาลมะพร้าว คนให้เข้ากัน",
        "ลดไฟลงและเคี่ยวต่อไปอีก 15-20 นาที จนเนื้อนุ่ม",
        "ใส่พริกหวานแดงและปรุงต่ออีก 5 นาที",
        "ใส่ถั่วลิสงบดครึ่งหนึ่ง ใบมะกรูด และใบโหระพา",
        "เสิร์ฟโดยโรยด้วยถั่วลิสงบดที่เหลือและใบโหระพาเพิ่ม"
      ]
    },
    relatedProducts: ["panang-curry-paste"],
    category: ["curry", "beef"]
  },
  {
    id: "green-curry-vegetables",
    name: {
      en: "Vegetable Green Curry",
      th: "แกงเขียวหวานผัก"
    },
    description: {
      en: "A vibrant Thai green curry loaded with fresh vegetables and aromatic herbs in a smooth coconut sauce.",
      th: "แกงเขียวหวานผักสดหลากหลายชนิดและสมุนไพรหอมในน้ำแกงกะทิเนียนนุ่ม"
    },
    servings: 4,
    time: 25,
    image: "/lovable-uploads/photo-1501854140801-50d01698950b",
    ingredients: {
      en: [
        "3 tbsp Anong Green Curry Paste",
        "400ml coconut milk",
        "1 small eggplant, cut into chunks",
        "1 zucchini, sliced",
        "1 cup sugar snap peas",
        "1 red bell pepper, sliced",
        "1/2 cup baby corn",
        "2 kaffir lime leaves",
        "1 tbsp palm sugar",
        "2 tbsp soy sauce",
        "1/2 cup Thai basil leaves"
      ],
      th: [
        "พริกแกงเขียวหวานอนงค์ 3 ช้อนโต๊ะ",
        "กะทิ 400 มล.",
        "มะเขือเปราะ 1 ลูกเล็ก หั่นเป็นชิ้น",
        "บวบ 1 ลูก หั่นเป็นชิ้น",
        "ถั่วลันเตาหวาน 1 ถ้วย",
        "พริกหวานแดง 1 ลูก หั่นเป็นชิ้น",
        "ข้าวโพดอ่อน 1/2 ถ้วย",
        "ใบมะกรูด 2 ใบ",
        "น้ำตาลมะพร้าว 1 ช้อนโต๊ะ",
        "ซีอิ้ว 2 ช้อนโต๊ะ",
        "ใบโหระพา 1/2 ถ้วย"
      ]
    },
    steps: {
      en: [
        "Heat a few tablespoons of coconut milk in a large pot over medium heat until it begins to bubble.",
        "Add the green curry paste and stir-fry for 2 minutes until fragrant.",
        "Pour in the remaining coconut milk and bring to a gentle simmer.",
        "Add the eggplant and cook for 5 minutes until it begins to soften.",
        "Add the zucchini, sugar snap peas, red bell pepper, and baby corn. Simmer for another 5-7 minutes.",
        "Tear the kaffir lime leaves and add them along with the palm sugar and soy sauce. Stir well.",
        "Turn off the heat and stir in the Thai basil leaves.",
        "Serve hot with steamed jasmine rice."
      ],
      th: [
        "ใส่กะทิสองสามช้อนโต๊ะลงในหม้อใหญ่ตั้งไฟกลางจนเดือด",
        "ใส่พริกแกงเขียวหวานลงไปผัด 2 นาทีจนมีกลิ่นหอม",
        "เทกะทิที่เหลือลงไปและเคี่ยวเบาๆ",
        "ใส่มะเขือเปราะและปรุงประมาณ 5 นาทีจนเริ่มนุ่ม",
        "ใส่บวบ ถั่วลันเตาหวาน พริกหวานแดง และข้าวโพดอ่อน เคี่ยวต่ออีก 5-7 นาที",
        "ฉีกใบมะกรูดแล้วใส่ลงไป ตามด้วยน้ำตาลมะพร้าวและซีอิ้ว คนให้เข้ากัน",
        "ปิดไฟและใส่ใบโหระพา",
        "เสิร์ฟร้อนๆกับข้าวสวยหอมมะลิ"
      ]
    },
    relatedProducts: ["green-curry-paste"],
    category: ["curry", "vegetarian"]
  },
  {
    id: "tom-yum-goong",
    name: {
      en: "Tom Yum Goong",
      th: "ต้มยำกุ้ง"
    },
    description: {
      en: "Classic Thai hot and sour soup with succulent prawns, aromatic herbs and a spicy kick.",
      th: "ต้มยำกุ้งแบบดั้งเดิม รสเผ็ดเปรี้ยว ใส่กุ้งสดและสมุนไพรหอม"
    },
    servings: 4,
    time: 20,
    image: "/placeholder.svg",
    ingredients: {
      en: [
        "2 tbsp Anong Tom Yum Chili Paste",
        "1.5 liters chicken or vegetable stock",
        "300g large prawns, peeled and deveined",
        "200g mushrooms, sliced",
        "4 stalks lemongrass, bruised and cut into 2-inch pieces",
        "5 slices galangal",
        "4 kaffir lime leaves, torn",
        "2-3 Thai chilies, bruised",
        "2 tbsp fish sauce",
        "3 tbsp lime juice",
        "Fresh coriander leaves for garnish"
      ],
      th: [
        "พริกเผาต้มยำอนงค์ 2 ช้อนโต๊ะ",
        "น้ำซุปไก่หรือผัก 1.5 ลิตร",
        "กุ้งขนาดใหญ่ ปอกเปลือกและผ่าหลัง 300 กรัม",
        "เห็ด หั่นเป็นชิ้น 200 กรัม",
        "ตะไคร้ 4 ต้น ทุบและหั่นเป็นท่อนยาว 2 นิ้ว",
        "ข่า 5 แว่น",
        "ใบมะกรูด 4 ใบ ฉีก",
        "พริกขี้หนูสด 2-3 เม็ด ทุบ",
        "น้ำปลา 2 ช้อนโต๊ะ",
        "น้ำมะนาว 3 ช้อนโต๊ะ",
        "ใบผักชีสำหรับตกแต่ง"
      ]
    },
    steps: {
      en: [
        "In a large pot, bring stock to a boil. Add lemongrass, galangal, and kaffir lime leaves.",
        "Lower the heat and simmer for 5 minutes to infuse the flavors.",
        "Add the Tom Yum chili paste and stir until dissolved.",
        "Add mushrooms and simmer for 2 minutes.",
        "Add prawns and Thai chilies, cook until prawns turn pink (about 2-3 minutes).",
        "Turn off heat and add fish sauce and lime juice. Adjust seasoning to taste.",
        "Serve hot, garnished with fresh coriander leaves."
      ],
      th: [
        "ในหม้อใหญ่ ต้มน้ำซุปให้เดือด ใส่ตะไคร้ ข่า และใบมะกรูด",
        "ลดไฟลงและเคี่ยวประมาณ 5 นาทีเพื่อให้มีกลิ่นหอม",
        "ใส่พริกเผาต้มยำและคนจนละลาย",
        "ใส่เห็ดและเคี่ยวต่อไปอีก 2 นาที",
        "ใส่กุ้งและพริกขี้หนู ปรุงจนกุ้งเปลี่ยนเป็นสีชมพู (ประมาณ 2-3 นาที)",
        "ปิดไฟและใส่น้ำปลา น้ำมะนาว ปรุงรสตามชอบ",
        "เสิร์ฟร้อนๆ ตกแต่งด้วยใบผักชี"
      ]
    },
    relatedProducts: ["tom-yum-chili-paste"],
    category: ["soup", "seafood"]
  },
  {
    id: "massaman-curry-chicken",
    name: {
      en: "Massaman Chicken Curry",
      th: "แกงมัสมั่นไก่"
    },
    description: {
      en: "A rich, mild Thai curry with Persian influences featuring tender chicken, potatoes and a complex blend of spices.",
      th: "แกงมัสมั่นไก่รสชาติเข้มข้น ได้รับอิทธิพลจากเปอร์เซีย มีเนื้อไก่นุ่ม มันฝรั่ง และเครื่องเทศหลากหลายชนิด"
    },
    servings: 6,
    time: 50,
    image: "/placeholder.svg",
    ingredients: {
      en: [
        "3 tbsp Anong Massaman Curry Paste",
        "500g chicken thighs, cut into large chunks",
        "400ml coconut milk",
        "200ml chicken stock",
        "3 medium potatoes, cut into chunks",
        "1 large onion, cut into wedges",
        "1/3 cup roasted peanuts",
        "3 bay leaves",
        "1 stick cinnamon",
        "4 cardamom pods",
        "2 tbsp tamarind paste",
        "3 tbsp palm sugar",
        "2 tbsp fish sauce"
      ],
      th: [
        "พริกแกงมัสมั่นอนงค์ 3 ช้อนโต๊ะ",
        "น่องไก่ 500 กรัม หั่นเป็นชิ้นใหญ่",
        "กะทิ 400 มล.",
        "น้ำซุปไก่ 200 มล.",
        "มันฝรั่ง 3 หัวขนาดกลาง หั่นเป็นชิ้น",
        "หัวหอมใหญ่ 1 หัว หั่นเป็นกลีบ",
        "ถั่วลิสงคั่ว 1/3 ถ้วย",
        "ใบกระวาน 3 ใบ",
        "อบเชยแท่ง 1 แท่ง",
        "ลูกกระวาน 4 ลูก",
        "น้ำมะขามเปียก 2 ช้อนโต๊ะ",
        "น้ำตาลมะพร้าว 3 ช้อนโต๊ะ",
        "น้ำปลา 2 ช้อนโต๊ะ"
      ]
    },
    steps: {
      en: [
        "In a large pot, cook a few tablespoons of coconut milk over medium heat until it begins to separate.",
        "Add the Massaman curry paste and cook for 2 minutes, stirring constantly.",
        "Add the chicken and stir to coat with the curry paste. Cook for 3-4 minutes until slightly browned.",
        "Add the remaining coconut milk, chicken stock, bay leaves, cinnamon, and cardamom pods. Bring to a simmer.",
        "Add potatoes and onion. Cover and simmer for about 30 minutes, until chicken and potatoes are tender.",
        "Stir in peanuts, tamarind paste, palm sugar, and fish sauce. Cook for another 10 minutes.",
        "Taste and adjust seasoning if needed. The curry should have a perfect balance of sweet, salty, and tangy flavors.",
        "Serve hot with steamed jasmine rice."
      ],
      th: [
        "ในหม้อใหญ่ ใส่กะทิ 2-3 ช้อนโต๊ะ ตั้งไฟกลางจนกะทิแยกตัว",
        "ใส่พริกแกงมัสมั่นและผัด 2 นาที คนตลอดเวลา",
        "ใส่ไก่ลงไปคลุกเคล้ากับพริกแกง ผัดประมาณ 3-4 นาทีจนเริ่มเป็นสีน้ำตาล",
        "ใส่กะทิที่เหลือ น้ำซุปไก่ ใบกระวาน อบเชยแท่ง และลูกกระวาน นำมาเคี่ยวเบาๆ",
        "ใส่มันฝรั่งและหัวหอมใหญ่ ปิดฝาและเคี่ยวประมาณ 30 นาที จนไก่และมันฝรั่งนุ่ม",
        "ใส่ถั่วลิสง น้ำมะขามเปียก น้ำตาลมะพร้าว และน้ำปลา ปรุงต่ออีก 10 นาที",
        "ชิมรสชาติและปรับรสตามต้องการ แกงควรมีรสชาติสมดุลทั้งหวาน เค็ม และเปรี้ยว",
        "เสิร์ฟร้อนๆกับข้าวหอมมะลิ"
      ]
    },
    relatedProducts: ["massaman-curry-paste"],
    category: ["curry", "chicken"]
  },
  {
    id: "thai-sukiyaki",
    name: {
      en: "Thai Sukiyaki (Suki)",
      th: "สุกี้ยากี้"
    },
    description: {
      en: "A Thai-style hot pot dish with glass noodles, vegetables, and your choice of meat, served with a flavorful sukiyaki sauce.",
      th: "อาหารประเภทหม้อไฟสไตล์ไทย ใส่วุ้นเส้น ผัก และเนื้อสัตว์ตามชอบ เสิร์ฟพร้อมน้ำจิ้มสุกี้รสชาติเข้มข้น"
    },
    servings: 4,
    time: 30,
    image: "/placeholder.svg",
    ingredients: {
      en: [
        "Anong Sukiyaki Sauce (for dipping)",
        "200g glass noodles",
        "300g sliced meat (pork, beef, or chicken)",
        "200g mixed seafood (optional)",
        "1 package firm tofu, cubed",
        "2 eggs",
        "1 head napa cabbage, roughly chopped",
        "2 cups morning glory, cut into 2-inch pieces",
        "1 cup sliced mushrooms",
        "1 bunch coriander",
        "1.5 liters chicken or vegetable broth"
      ],
      th: [
        "น้ำจิ้มสุกี้ยากี้อนงค์ (สำหรับจิ้ม)",
        "วุ้นเส้น 200 กรัม",
        "เนื้อสัตว์หั่นบาง (หมู, เนื้อวัว, หรือไก่) 300 กรัม",
        "อาหารทะเลรวม 200 กรัม (ถ้าต้องการ)",
        "เต้าหู้แข็ง 1 ก้อน หั่นเป็นลูกเต๋า",
        "ไข่ไก่ 2 ฟอง",
        "ผักกาดขาว 1 หัว หั่นเป็นชิ้นใหญ่ๆ",
        "ผักบุ้ง 2 ถ้วย หั่นเป็นท่อนยาว 2 นิ้ว",
        "เห็ดหั่นแว่น 1 ถ้วย",
        "ผักชี 1 กำ",
        "น้ำซุปไก่หรือผัก 1.5 ลิตร"
      ]
    },
    steps: {
      en: [
        "Soak glass noodles in warm water for 10 minutes until softened, then drain.",
        "Bring the broth to a boil in a large pot or hot pot at the center of the table.",
        "Arrange all the ingredients on plates around the hot pot.",
        "Start by adding meat to the boiling broth, followed by tofu and harder vegetables.",
        "Once meat is nearly cooked, add softer vegetables and glass noodles.",
        "When everything is almost done, crack eggs into the broth and stir gently.",
        "Each person can scoop portions into individual bowls and add Anong Sukiyaki Sauce to taste.",
        "Continue cooking and eating in batches, adding more ingredients to the broth as needed."
      ],
      th: [
        "แช่วุ้นเส้นในน้ำอุ่นประมาณ 10 นาทีจนนุ่ม แล้วสะเด็ดน้ำ",
        "ต้มน้ำซุปให้เดือดในหม้อใหญ่หรือหม้อไฟตรงกลางโต๊ะ",
        "จัดเตรียมวัตถุดิบทั้งหมดใส่จานวางรอบๆหม้อไฟ",
        "เริ่มจากใส่เนื้อสัตว์ลงในน้ำซุปเดือด ตามด้วยเต้าหู้และผักที่สุกยาก",
        "เมื่อเนื้อสัตว์ใกล้สุก ใส่ผักที่สุกง่ายและวุ้นเส้น",
        "เมื่อทุกอย่างใกล้สุก ตอกไข่ใส่ในน้ำซุปและคนเบาๆ",
        "แต่ละคนตักอาหารใส่ชามของตัวเองและเติมน้ำจิ้มสุกี้อนงค์ตามชอบ",
        "ทำต่อไปเรื่อยๆ เพิ่มวัตถุดิบลงในน้ำซุปตามต้องการ"
      ]
    },
    relatedProducts: ["sukiyaki-sauce"],
    category: ["hot pot", "versatile"]
  }
];

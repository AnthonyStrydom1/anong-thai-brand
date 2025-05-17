
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
    image: "/placeholder.svg",
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
    image: "/placeholder.svg",
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
      en: "Rich and nutty Panang curry with tender beef slices, aromatic herbs, and creamy coconut milk.",
      th: "แกงแพนงเนื้อนุ่ม รสชาติเข้มข้นจากถั่ว สมุนไพรหอม และกะทิครีมมี่"
    },
    servings: 4,
    time: 45,
    image: "/placeholder.svg",
    ingredients: {
      en: [
        "3 tbsp Anong Panang Curry Paste",
        "500g beef sirloin, thinly sliced",
        "400ml coconut milk",
        "2 tbsp fish sauce",
        "1 tbsp palm sugar",
        "4-5 kaffir lime leaves, torn",
        "1 red bell pepper, sliced",
        "1/4 cup Thai basil leaves",
        "2 tbsp crushed peanuts"
      ],
      th: [
        "พริกแกงแพนงอนงค์ 3 ช้อนโต๊ะ",
        "เนื้อสันในวัว 500 กรัม หั่นบาง",
        "กะทิ 400 มล.",
        "น้ำปลา 2 ช้อนโต๊ะ",
        "น้ำตาลมะพร้าว 1 ช้อนโต๊ะ",
        "ใบมะกรูด 4-5 ใบ ฉีก",
        "พริกหวานแดง 1 ลูก หั่นเป็นชิ้น",
        "ใบโหระพา 1/4 ถ้วย",
        "ถั่วลิสงบด 2 ช้อนโต๊ะ"
      ]
    },
    steps: {
      en: [
        "In a large pan, heat 2 tablespoons of coconut cream until it begins to separate.",
        "Add the Panang curry paste and stir-fry until fragrant, about 2 minutes.",
        "Add the beef slices and cook until they begin to brown.",
        "Pour in the remaining coconut milk, fish sauce, and palm sugar. Stir well.",
        "Add the torn kaffir lime leaves and red bell pepper. Simmer for 15-20 minutes until the beef is tender.",
        "Stir in the Thai basil leaves just before serving.",
        "Garnish with crushed peanuts and serve with steamed jasmine rice."
      ],
      th: [
        "ใส่หัวกะทิ 2 ช้อนโต๊ะในกระทะใหญ่ อุ่นจนแตกมัน",
        "ใส่พริกแกงแพนงลงไปผัดจนหอม ประมาณ 2 นาที",
        "ใส่เนื้อวัวหั่นบางลงไปผัดจนเริ่มสุก",
        "เทกะทิที่เหลือ น้ำปลา และน้ำตาลมะพร้าวลงไป คนให้เข้ากัน",
        "ใส่ใบมะกรูดฉีกและพริกหวาน เคี่ยวต่อ 15-20 นาทีจนเนื้อนุ่ม",
        "ใส่ใบโหระพาก่อนยกออกจากเตา",
        "โรยด้วยถั่วลิสงบดและเสิร์ฟพร้อมข้าวหอมมะลิ"
      ]
    },
    relatedProducts: ["panang-curry-paste"],
    category: ["curry", "beef"]
  },
  {
    id: "green-curry-vegetable",
    name: {
      en: "Vegetable Green Curry",
      th: "แกงเขียวหวานผัก"
    },
    description: {
      en: "A fragrant and spicy green curry loaded with fresh vegetables in a coconut milk base. A delicious vegetarian option.",
      th: "แกงเขียวหวานผักหอมและเผ็ด เต็มไปด้วยผักสดในน้ำกะทิ เป็นตัวเลือกมังสวิรัติที่อร่อย"
    },
    servings: 4,
    time: 30,
    image: "/placeholder.svg",
    ingredients: {
      en: [
        "3 tbsp Anong Green Curry Paste",
        "400ml coconut milk",
        "1 cup eggplant, cubed",
        "1 cup green beans, cut into 2-inch pieces",
        "1 cup bamboo shoots, sliced",
        "1 cup bell peppers, sliced",
        "2 kaffir lime leaves",
        "1 tbsp palm sugar",
        "2 tbsp soy sauce",
        "1/4 cup Thai basil leaves"
      ],
      th: [
        "พริกแกงเขียวหวานอนงค์ 3 ช้อนโต๊ะ",
        "กะทิ 400 มล.",
        "มะเขือม่วง 1 ถ้วย หั่นเป็นลูกเต๋า",
        "ถั่วแขก 1 ถ้วย หั่นยาว 2 นิ้ว",
        "หน่อไม้ 1 ถ้วย หั่นเป็นแว่น",
        "พริกหวาน 1 ถ้วย หั่นเป็นชิ้น",
        "ใบมะกรูด 2 ใบ",
        "น้ำตาลมะพร้าว 1 ช้อนโต๊ะ",
        "ซีอิ๊ว 2 ช้อนโต๊ะ",
        "ใบโหระพา 1/4 ถ้วย"
      ]
    },
    steps: {
      en: [
        "Heat 2 tablespoons of coconut milk in a large pot until it begins to bubble.",
        "Add the green curry paste and stir until fragrant, about 1-2 minutes.",
        "Pour in the remaining coconut milk and bring to a gentle simmer.",
        "Add the eggplant, green beans, and bamboo shoots. Cook for 5 minutes.",
        "Add the bell peppers, kaffir lime leaves, palm sugar, and soy sauce.",
        "Simmer for another 5-10 minutes until all vegetables are tender but still vibrant.",
        "Stir in the Thai basil leaves just before serving.",
        "Serve hot with steamed jasmine rice."
      ],
      th: [
        "ใส่กะทิ 2 ช้อนโต๊ะในหม้อใหญ่ อุ่นจนเริ่มเดือด",
        "ใส่พริกแกงเขียวหวานลงไปผัดจนหอม ประมาณ 1-2 นาที",
        "เทกะทิที่เหลือลงไปและทำให้เดือดเบาๆ",
        "ใส่มะเขือม่วง ถั่วแขก และหน่อไม้ ต้มประมาณ 5 นาที",
        "ใส่พริกหวาน ใบมะกรูด น้ำตาลมะพร้าว และซีอิ๊ว",
        "เคี่ยวต่ออีก 5-10 นาทีจนผักนุ่มแต่ยังดูสดอยู่",
        "ใส่ใบโหระพาก่อนยกออกจากเตา",
        "เสิร์ฟร้อนๆพร้อมข้าวหอมมะลิ"
      ]
    },
    relatedProducts: ["green-curry-paste"],
    category: ["curry", "vegetarian"]
  },
  {
    id: "tom-yum-soup",
    name: {
      en: "Tom Yum Soup with Shrimp",
      th: "ต้มยำกุ้ง"
    },
    description: {
      en: "The famous hot and sour Thai soup with shrimp, mushrooms, and aromatic herbs. A perfect balance of spicy, sour, and savory flavors.",
      th: "ต้มยำกุ้งชื่อดัง รสชาติเผ็ดเปรี้ยว ด้วยกุ้ง เห็ด และสมุนไพรหอม เป็นความสมดุลที่ลงตัวของรสเผ็ด เปรี้ยว และเค็ม"
    },
    servings: 4,
    time: 25,
    image: "/placeholder.svg",
    ingredients: {
      en: [
        "2 tbsp Anong Tom Yum Chili Paste",
        "4 cups chicken stock",
        "300g large shrimp, peeled and deveined",
        "200g mushrooms, sliced",
        "3 stalks lemongrass, bruised and cut into 2-inch pieces",
        "5 slices galangal",
        "5 kaffir lime leaves",
        "2 tbsp lime juice",
        "1 tbsp fish sauce",
        "Fresh cilantro for garnish",
        "Thai chili peppers, optional for extra heat"
      ],
      th: [
        "พริกเผาต้มยำอนงค์ 2 ช้อนโต๊ะ",
        "น้ำซุปไก่ 4 ถ้วย",
        "กุ้งขนาดใหญ่ ปอกเปลือกและผ่าหลัง 300 กรัม",
        "เห็ด หั่นเป็นชิ้น 200 กรัม",
        "ตะไคร้ ทุบและหั่นท่อน 3 ต้น",
        "ข่า หั่นเป็นแว่น 5 แว่น",
        "ใบมะกรูด 5 ใบ",
        "น้ำมะนาว 2 ช้อนโต๊ะ",
        "น้ำปลา 1 ช้อนโต๊ะ",
        "ผักชีสำหรับตกแต่ง",
        "พริกขี้หนูสด สำหรับเพิ่มความเผ็ด (ตามชอบ)"
      ]
    },
    steps: {
      en: [
        "Bring chicken stock to a boil in a large pot over medium-high heat.",
        "Add lemongrass, galangal, and kaffir lime leaves. Simmer for 5 minutes to release flavors.",
        "Stir in the Tom Yum chili paste until well dissolved.",
        "Add mushrooms and cook for 2 minutes.",
        "Add shrimp and cook until they turn pink, about 2-3 minutes.",
        "Remove from heat and stir in lime juice and fish sauce.",
        "Taste and adjust seasonings if needed.",
        "Garnish with fresh cilantro and optional Thai chili peppers before serving."
      ],
      th: [
        "ต้มน้ำซุปไก่ให้เดือดในหม้อใหญ่บนไฟกลาง-สูง",
        "ใส่ตะไคร้ ข่า และใบมะกรูด ต้มเบาๆ 5 นาทีเพื่อให้กลิ่นออกมา",
        "ใส่พริกเผาต้มยำ คนให้ละลายดี",
        "ใส่เห็ด ต้มประมาณ 2 นาที",
        "ใส่กุ้งและต้มจนกุ้งเปลี่ยนเป็นสีชมพู ประมาณ 2-3 นาที",
        "ยกลงจากเตาแล้วใส่น้ำมะนาวและน้ำปลา",
        "ชิมและปรับรสตามต้องการ",
        "ตกแต่งด้วยผักชีและพริกขี้หนูสด (ถ้าชอบ) ก่อนเสิร์ฟ"
      ]
    },
    relatedProducts: ["tom-yum-chili-paste"],
    category: ["soup", "seafood"]
  },
  {
    id: "massaman-curry-lamb",
    name: {
      en: "Massaman Curry with Lamb",
      th: "แกงมัสมั่นเนื้อแกะ"
    },
    description: {
      en: "A rich and aromatic Massaman curry with tender lamb, potatoes, and roasted peanuts. This mild curry has deep flavors from warm spices.",
      th: "แกงมัสมั่นเนื้อแกะเข้มข้นและหอม ด้วยเนื้อนุ่ม มันฝรั่ง และถั่วลิสงคั่ว แกงรสกลมกล่อมนี้มีกลิ่นหอมลึกจากเครื่องเทศอุ่นๆ"
    },
    servings: 6,
    time: 120,
    image: "/placeholder.svg",
    ingredients: {
      en: [
        "4 tbsp Anong Massaman Curry Paste",
        "800g lamb shoulder, cut into 1-inch cubes",
        "500ml coconut milk",
        "500ml water or stock",
        "4 medium potatoes, cut into chunks",
        "1 large onion, cut into wedges",
        "3 bay leaves",
        "1 cinnamon stick",
        "4 cardamom pods",
        "1/4 cup roasted peanuts",
        "2 tbsp tamarind paste",
        "2 tbsp fish sauce",
        "2 tbsp palm sugar"
      ],
      th: [
        "พริกแกงมัสมั่นอนงค์ 4 ช้อนโต๊ะ",
        "เนื้อไหล่แกะ หั่นเป็นชิ้น 1 นิ้ว 800 กรัม",
        "กะทิ 500 มล.",
        "น้ำหรือน้ำซุป 500 มล.",
        "มันฝรั่งขนาดกลาง หั่นเป็นชิ้น 4 หัว",
        "หัวหอมใหญ่ หั่นเป็นกลีบ 1 หัว",
        "ใบกระวาน 3 ใบ",
        "อบเชยแท่ง 1 แท่ง",
        "ลูกกระวาน 4 ลูก",
        "ถั่วลิสงคั่ว 1/4 ถ้วย",
        "มะขามเปียก 2 ช้อนโต๊ะ",
        "น้ำปลา 2 ช้อนโต๊ะ",
        "น้ำตาลมะพร้าว 2 ช้อนโต๊ะ"
      ]
    },
    steps: {
      en: [
        "Heat 2 tablespoons of coconut cream in a large pot until it begins to separate.",
        "Add the Massaman curry paste and stir-fry until fragrant, about 2-3 minutes.",
        "Add the lamb cubes and cook until they are lightly browned on all sides.",
        "Pour in the remaining coconut milk, water or stock, bay leaves, cinnamon stick, and cardamom pods.",
        "Bring to a boil, then reduce heat to low, cover, and simmer for 1 hour or until the meat is becoming tender.",
        "Add the potatoes and onion. Continue to simmer for another 30-40 minutes until both meat and potatoes are tender.",
        "Stir in the roasted peanuts, tamarind paste, fish sauce, and palm sugar.",
        "Simmer uncovered for 10 more minutes, allowing the sauce to thicken slightly.",
        "Taste and adjust seasonings if needed.",
        "Serve hot with steamed jasmine rice."
      ],
      th: [
        "ใส่หัวกะทิ 2 ช้อนโต๊ะในหม้อใหญ่ อุ่นจนแตกมัน",
        "ใส่พริกแกงมัสมั่นลงไปผัดจนหอม ประมาณ 2-3 นาที",
        "ใส่เนื้อแกะลงไปผัดจนเริ่มเป็นสีน้ำตาลรอบด้าน",
        "เทกะทิที่เหลือ น้ำหรือน้ำซุป ใบกระวาน อบเชย และลูกกระวาน",
        "ต้มให้เดือด แล้วลดไฟลง ปิดฝา ต้มต่อประมาณ 1 ชั่วโมงหรือจนเนื้อเริ่มนุ่ม",
        "ใส่มันฝรั่งและหัวหอมใหญ่ ต้มต่ออีก 30-40 นาทีจนทั้งเนื้อและมันฝรั่งนุ่ม",
        "ใส่ถั่วลิสงคั่ว มะขามเปียก น้ำปลา และน้ำตาลมะพร้าว",
        "เคี่ยวโดยไม่ปิดฝาอีก 10 นาที ให้น้ำแกงข้นขึ้นเล็กน้อย",
        "ชิมและปรับรสตามต้องการ",
        "เสิร์ฟร้อนๆพร้อมข้าวหอมมะลิ"
      ]
    },
    relatedProducts: ["massaman-curry-paste"],
    category: ["curry", "meat"]
  },
  {
    id: "sukiyaki-hotpot",
    name: {
      en: "Thai Sukiyaki Hot Pot",
      th: "สุกี้ยากี้น้ำซุป"
    },
    description: {
      en: "A comforting hot pot meal with your choice of meat, seafood, and vegetables in a flavorful broth, served with Anong's rich Sukiyaki sauce.",
      th: "อาหารหม้อไฟที่ให้ความอบอุ่น ด้วยเนื้อสัตว์ อาหารทะเล และผักตามชอบในน้ำซุปรสเข้มข้น เสิร์ฟพร้อมน้ำจิ้มสุกี้ยากี้รสเข้มข้นของอนงค์"
    },
    servings: 4,
    time: 40,
    image: "/placeholder.svg",
    ingredients: {
      en: [
        "4 tbsp Anong Sukiyaki Sauce (plus more for dipping)",
        "1.5 liters chicken or vegetable broth",
        "200g thinly sliced pork or beef",
        "200g mixed seafood (shrimp, squid, fish balls)",
        "1 package glass noodles, soaked until soft",
        "2 cups napa cabbage, chopped",
        "1 cup mushrooms (shiitake or button), sliced",
        "1 cup baby bok choy",
        "1 cup bean sprouts",
        "4 eggs",
        "Spring onions and cilantro for garnish"
      ],
      th: [
        "น้ำจิ้มสุกี้ยากี้อนงค์ 4 ช้อนโต๊ะ (และเพิ่มเติมสำหรับจิ้ม)",
        "น้ำซุปไก่หรือผัก 1.5 ลิตร",
        "เนื้อหมูหรือเนื้อวัวหั่นบาง 200 กรัม",
        "อาหารทะเลรวม (กุ้ง, ปลาหมึก, ลูกชิ้นปลา) 200 กรัม",
        "วุ้นเส้น แช่จนนุ่ม 1 ห่อ",
        "ผักกาดขาว หั่นชิ้น 2 ถ้วย",
        "เห็ด (เห็ดหอมหรือเห็ดกระดุม) หั่นเป็นชิ้น 1 ถ้วย",
        "ผักกวางตุ้ง 1 ถ้วย",
        "ถั่วงอก 1 ถ้วย",
        "ไข่ 4 ฟอง",
        "ต้นหอมและผักชีสำหรับตกแต่ง"
      ]
    },
    steps: {
      en: [
        "In a hot pot or large pot, bring the broth to a simmer over medium-high heat.",
        "Stir in 4 tablespoons of Anong Sukiyaki Sauce to flavor the broth.",
        "Arrange the sliced meat, seafood, noodles, and vegetables on serving plates around the hot pot.",
        "Allow everyone to cook their own ingredients in the simmering broth.",
        "For the meat and seafood, cook until they change color and are fully cooked.",
        "For vegetables, cook until they reach your preferred tenderness.",
        "For a traditional finish, crack an egg into each person's bowl before adding their cooked ingredients.",
        "Serve with extra Anong Sukiyaki Sauce on the side for dipping.",
        "Garnish with spring onions and cilantro."
      ],
      th: [
        "ในหม้อสุกี้หรือหม้อใหญ่ ต้มน้ำซุปให้เดือดเบาๆบนไฟกลาง-สูง",
        "ใส่น้ำจิ้มสุกี้ยากี้อนงค์ 4 ช้อนโต๊ะลงไปในน้ำซุปเพื่อเพิ่มรสชาติ",
        "จัดเนื้อสัตว์หั่นบาง อาหารทะเล วุ้นเส้น และผักใส่จานเสิร์ฟรอบๆหม้อสุกี้",
        "ให้ทุกคนลงมือปรุงวัตถุดิบของตัวเองในน้ำซุปที่เดือดเบาๆ",
        "สำหรับเนื้อสัตว์และอาหารทะเล ต้มจนกว่าสีจะเปลี่ยนและสุกเต็มที่",
        "สำหรับผัก ต้มจนได้ความนุ่มตามที่ชอบ",
        "เพื่อความเป็นสุกี้แบบดั้งเดิม ตอกไข่ลงในชามของแต่ละคนก่อนใส่วัตถุดิบที่ปรุงสุกแล้ว",
        "เสิร์ฟพร้อมน้ำจิ้มสุกี้ยากี้อนงค์เพิ่มเติมสำหรับจิ้ม",
        "ตกแต่งด้วยต้นหอมและผักชี"
      ]
    },
    relatedProducts: ["sukiyaki-sauce"],
    category: ["hot pot", "family meal"]
  }
];

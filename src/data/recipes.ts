
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
  }
];

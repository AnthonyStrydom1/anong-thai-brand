
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
image: "https://i.postimg.cc/CxkK0ZsW/Red-Curry.png",
    category: "curry-pastes",
    ingredients: {
      en: ["Dried red chili", "Garlic", "Lemongrass", "Galangal", "Shallots", "Kaffir lime zest", "Shrimp paste", "Salt"],
      th: ["พริกแห้ง", "กระเทียม", "ตะไคร้", "ข่า", "หอมแดง", "ผิวมะกรูด", "กะปิ", "เกลือ"]
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
    image: "/placeholder.svg",
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
    id: "sweet-chili-sauce",
    name: {
      en: "Thai Sweet Chili Dipping Sauce",
      th: "น้ำจิ้มไก่"
    },
    description: {
      en: "Our Thai Sweet Chili Dipping Sauce offers the perfect balance of sweetness with just the right amount of heat. Made with fresh red chilies, garlic, and a hint of vinegar, it's the ideal companion for spring rolls, fried appetizers and grilled meats.",
      th: "น้ำจิ้มไก่ของเราให้ความสมดุลที่ลงตัวระหว่างความหวานกับความเผ็ดในปริมาณที่พอเหมาะ ทำจากพริกสดแดง กระเทียม และกลิ่นน้ำส้มสายชู เป็นเพื่อนที่เหมาะสำหรับปอเปี๊ยะทอด อาหารทานเล่นทอด และเนื้อย่าง"
    },
    shortDescription: {
      en: "A perfect dip for fried appetizers and grilled meats",
      th: "น้ำจิ้มไก่หวานเผ็ดเล็กน้อย เหมาะสำหรับของทอดและซีฟู้ด"
    },
    price: 75.00,
    image: "/placeholder.svg",
    category: "dipping-sauces",
    ingredients: {
      en: ["Red chili", "Garlic", "Sugar", "Vinegar", "Salt"],
      th: ["พริกแดง", "กระเทียม", "น้ำตาล", "น้ำส้มสายชู", "เกลือ"]
    },
    useIn: {
      en: ["Thai Chicken Wings", "Fried Tofu"],
      th: ["ปีกไก่ทอดไทย", "เต้าหู้ทอด"]
    }
  }
];

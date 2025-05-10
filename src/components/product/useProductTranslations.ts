
export const useProductTranslations = (language: 'en' | 'th') => {
  const translations = {
    en: {
      ingredients: "Ingredients",
      description: "Description",
      howToUse: "How to Use",
      addToCart: "Add to Cart",
      quantity: "Quantity",
      relatedRecipes: "Recipes Using This Product",
      viewRecipe: "View Recipe",
      noRecipes: "No recipes found for this product.",
      addedToCart: "Product added to cart!"
    },
    th: {
      ingredients: "ส่วนผสม",
      description: "รายละเอียด",
      howToUse: "วิธีใช้",
      addToCart: "เพิ่มลงตะกร้า",
      quantity: "จำนวน",
      relatedRecipes: "สูตรอาหารที่ใช้ผลิตภัณฑ์นี้",
      viewRecipe: "ดูสูตรอาหาร",
      noRecipes: "ไม่พบสูตรอาหารสำหรับผลิตภัณฑ์นี้",
      addedToCart: "เพิ่มสินค้าลงตะกร้าแล้ว!"
    }
  };

  return translations[language];
};

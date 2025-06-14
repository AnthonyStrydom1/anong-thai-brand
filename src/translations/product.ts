
interface ProductTranslations {
  // Product page elements
  backToShop: string;
  quantity: string;
  addToCart: string;
  addedToCart: string;
  
  // Product tabs
  description: string;
  ingredients: string;
  howToUse: string;
  
  // Reviews section
  customerReviews: string;
  writeReview: string;
  cancel: string;
  outOf5: string;
  review: string;
  reviews: string;
  noReviews: string;
  
  // Review form
  rating: string;
  reviewTitle: string;
  reviewTitlePlaceholder: string;
  yourReview: string;
  reviewContentPlaceholder: string;
  submitReview: string;
  submitting: string;
  
  // Messages
  reviewSubmitted: string;
  reviewPending: string;
  authRequired: string;
  signInToReview: string;
  missingInfo: string;
  provideTitleAndContent: string;
  customerProfileRequired: string;
  completeProfile: string;
  error: string;
  failedToSubmitReview: string;
  failedToLoadReviews: string;
  
  // Purchase verification
  verifiedPurchase: string;
  anonymous: string;
  
  // Related content
  relatedRecipes: string;
  viewRecipe: string;
  noRelatedRecipes: string;
}

export const productTranslations: Record<'en' | 'th', ProductTranslations> = {
  en: {
    backToShop: 'Back to Shop',
    quantity: 'Quantity',
    addToCart: 'Add to Cart',
    addedToCart: 'Product added to cart!',
    
    description: 'Description',
    ingredients: 'Ingredients',
    howToUse: 'How to Use',
    
    customerReviews: 'Customer Reviews',
    writeReview: 'Write a Review',
    cancel: 'Cancel',
    outOf5: 'out of 5',
    review: 'review',
    reviews: 'reviews',
    noReviews: 'No reviews yet. Be the first to review this product!',
    
    rating: 'Rating',
    reviewTitle: 'Review Title',
    reviewTitlePlaceholder: 'Summarize your review',
    yourReview: 'Your Review',
    reviewContentPlaceholder: 'Share your experience with this product',
    submitReview: 'Submit Review',
    submitting: 'Submitting...',
    
    reviewSubmitted: 'Review Submitted!',
    reviewPending: 'Your review has been submitted and is pending approval.',
    authRequired: 'Authentication Required',
    signInToReview: 'Please sign in to leave a review',
    missingInfo: 'Missing Information',
    provideTitleAndContent: 'Please provide both a title and review content',
    customerProfileRequired: 'Customer Profile Required',
    completeProfile: 'Please complete your profile to leave a review',
    error: 'Error',
    failedToSubmitReview: 'Failed to submit review',
    failedToLoadReviews: 'Failed to load reviews',
    
    verifiedPurchase: 'Verified Purchase',
    anonymous: 'Anonymous',
    
    relatedRecipes: 'Recipes Using This Product',
    viewRecipe: 'View Recipe',
    noRelatedRecipes: 'No recipes found for this product.'
  },
  th: {
    backToShop: 'กลับไปยังร้านค้า',
    quantity: 'จำนวน',
    addToCart: 'เพิ่มลงตะกร้า',
    addedToCart: 'เพิ่มสินค้าลงตะกร้าแล้ว!',
    
    description: 'รายละเอียด',
    ingredients: 'ส่วนผสม',
    howToUse: 'วิธีใช้',
    
    customerReviews: 'รีวิวจากลูกค้า',
    writeReview: 'เขียนรีวิว',
    cancel: 'ยกเลิก',
    outOf5: 'จาก 5',
    review: 'รีวิว',
    reviews: 'รีวิว',
    noReviews: 'ยังไม่มีรีวิว เป็นคนแรกที่รีวิวสินค้านี้!',
    
    rating: 'คะแนน',
    reviewTitle: 'หัวข้อรีวิว',
    reviewTitlePlaceholder: 'สรุปรีวิวของคุณ',
    yourReview: 'รีวิวของคุณ',
    reviewContentPlaceholder: 'แบ่งปันประสบการณ์ของคุณกับสินค้านี้',
    submitReview: 'ส่งรีวิว',
    submitting: 'กำลังส่ง...',
    
    reviewSubmitted: 'ส่งรีวิวแล้ว!',
    reviewPending: 'รีวิวของคุณได้ถูกส่งแล้วและรออนุมัติ',
    authRequired: 'ต้องเข้าสู่ระบบ',
    signInToReview: 'กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น',
    missingInfo: 'ข้อมูลไม่ครบถ้วน',
    provideTitleAndContent: 'กรุณาใส่ทั้งหัวข้อและเนื้อหารีวิว',
    customerProfileRequired: 'ต้องมีโปรไฟล์ลูกค้า',
    completeProfile: 'กรุณาทำโปรไฟล์ให้สมบูรณ์เพื่อแสดงความคิดเห็น',
    error: 'ข้อผิดพลาด',
    failedToSubmitReview: 'ไม่สามารถส่งรีวิวได้',
    failedToLoadReviews: 'ไม่สามารถโหลดรีวิวได้',
    
    verifiedPurchase: 'การซื้อที่ยืนยันแล้ว',
    anonymous: 'ไม่ระบุชื่อ',
    
    relatedRecipes: 'สูตรอาหารที่ใช้ผลิตภัณฑ์นี้',
    viewRecipe: 'ดูสูตรอาหาร',
    noRelatedRecipes: 'ไม่พบสูตรอาหารสำหรับผลิตภัณฑ์นี้'
  }
};

export const useProductTranslations = (language: 'en' | 'th') => {
  return productTranslations[language];
};


interface ChatbotResponse {
  keywords: string[];
  response: string;
}

export const chatbotResponses: ChatbotResponse[] = [
  // Product-related questions
  {
    keywords: ['products', 'what do you sell', 'curry paste', 'sauce', 'thai food'],
    response: "We specialize in authentic Thai curry pastes and sauces made with traditional recipes. Our products include Red Curry Paste, Green Curry Paste, Massaman Curry Paste, Tom Yum Paste, and various Thai sauces. You can browse our full collection in the Shop section."
  },
  {
    keywords: ['ingredients', 'recipe', 'how to use', 'cooking instructions'],
    response: "All our curry pastes come with detailed cooking instructions on the packaging. You can also find recipes and cooking tips in our Recipes section. Generally, mix 1-2 tablespoons of curry paste with coconut milk, add your choice of meat or vegetables, and simmer until cooked."
  },
  {
    keywords: ['spicy', 'heat level', 'mild', 'hot'],
    response: "Our curry pastes have varying heat levels: Green Curry is the spiciest, Red Curry is medium-hot, and Massaman is mild and sweet. Each product page shows the spice level to help you choose what suits your taste."
  },

  // Shipping and delivery
  {
    keywords: ['shipping', 'delivery', 'how long', 'when will it arrive', 'postage'],
    response: "We offer shipping throughout South Africa. Standard delivery takes 3-5 business days, and we also offer express delivery options. Shipping costs are calculated at checkout based on your location and order size. Free shipping is available on orders over R500."
  },
  {
    keywords: ['tracking', 'track my order', 'where is my order'],
    response: "Once your order is dispatched, you'll receive a tracking number via email. You can track your order using this number on our courier partner's website, or check your order status in the 'My Orders' section of your account."
  },
  {
    keywords: ['international shipping', 'overseas', 'abroad'],
    response: "Currently, we only ship within South Africa. We're working on expanding our shipping to other countries. Please check back soon or contact us for updates on international shipping."
  },

  // Orders and payments
  {
    keywords: ['order', 'how to order', 'place an order', 'buy'],
    response: "To place an order, browse our products in the Shop section, add items to your cart, and proceed to checkout. You'll need to create an account or sign in, then provide your shipping details and payment information."
  },
  {
    keywords: ['payment', 'pay', 'credit card', 'eft', 'bank transfer'],
    response: "We accept various payment methods including credit/debit cards, EFT/bank transfers, and PayFast secure payments. All payment information is processed securely. For EFT payments, you'll receive banking details after placing your order."
  },
  {
    keywords: ['cancel order', 'change order', 'modify'],
    response: "If you need to cancel or modify your order, please contact us as soon as possible at info@anongthaibrand.com. Orders can typically be modified or cancelled within 2 hours of placement, before they're prepared for shipping."
  },

  // Account and support
  {
    keywords: ['account', 'sign up', 'register', 'login', 'password'],
    response: "You can create an account by clicking 'Sign In' in the top menu and selecting 'Create Account'. This allows you to track orders, save addresses, and access exclusive offers. If you're having trouble with your password, use the 'Forgot Password' option."
  },
  {
    keywords: ['contact', 'support', 'help', 'customer service'],
    response: "For additional support, you can contact us at info@anongthaibrand.com or visit our Contact page. Our team typically responds within 24 hours during business days."
  },

  // Company and brand
  {
    keywords: ['about', 'anong', 'company', 'story', 'who are you'],
    response: "Anong Thai Brand is dedicated to bringing authentic Thai flavors to South African kitchens. We create traditional curry pastes and sauces using time-honored recipes and quality ingredients. Learn more about our story in the 'About Anong' section."
  },
  {
    keywords: ['authentic', 'traditional', 'real thai', 'genuine'],
    response: "Yes! All our products are made using traditional Thai recipes and authentic ingredients. We're committed to preserving the genuine flavors of Thai cuisine and bringing them to your kitchen with the same quality you'd find in Thailand."
  },

  // Returns and policies
  {
    keywords: ['return', 'refund', 'exchange', 'money back'],
    response: "We offer returns on unopened products within 14 days of delivery. If you're not satisfied with your purchase or received a damaged item, please contact us at info@anongthaibrand.com with your order number and we'll help resolve the issue."
  },
  {
    keywords: ['shelf life', 'expiry', 'best before', 'storage'],
    response: "Our curry pastes have a shelf life of 12-18 months when stored in a cool, dry place. Once opened, refrigerate and use within 6 months. Each product shows the best-before date on the packaging."
  },

  // General greetings and politeness
  {
    keywords: ['hello', 'hi', 'good morning', 'good afternoon', 'good evening'],
    response: "Hello! Welcome to Anong Thai Brand. I'm here to help you with any questions about our authentic Thai curry pastes and sauces. What would you like to know?"
  },
  {
    keywords: ['thank you', 'thanks', 'appreciate'],
    response: "You're very welcome! I'm happy to help. Is there anything else you'd like to know about our products or services?"
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'thanks for your help'],
    response: "Thank you for visiting Anong Thai Brand! Feel free to come back anytime if you have more questions. Enjoy cooking with our authentic Thai flavors!"
  }
];

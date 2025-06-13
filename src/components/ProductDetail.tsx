import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseProduct } from '@/hooks/useSupabaseProducts';
import { ProductInfo } from './product/ProductInfo';
import { ProductDetailTabs } from './product/ProductDetailTabs';
import { ProductBreadcrumb } from './product/ProductBreadcrumb';
import { ProductNotFound } from './product/ProductNotFound';
import { RelatedRecipes } from './product/RelatedRecipes';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { recipes } from '@/data/recipes';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { product, isLoading, error } = useSupabaseProduct(id || '');
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <ProductNotFound language={language} />;
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Enhanced image extraction with exact mapping
  const getProductImage = () => {
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

    return imageMap[product.name] || '/placeholder.svg';
  };

  // Get real product data based on product name
  const getProductData = () => {
    const productData: { [key: string]: { 
      ingredients: { en: string[], th: string[] }, 
      howToUse: { en: string[], th: string[] },
      description: { en: string, th: string }
    }} = {
      'Pad Thai Sauce': {
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
      'Sukiyaki Dipping Sauce': {
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
      'Panang Curry Paste': {
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
      'Massaman Curry Paste': {
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

    return productData[product.name] || {
      ingredients: { 
        en: ['Premium quality ingredients'], 
        th: ['ส่วนผสมคุณภาพพรีเมียม'] 
      },
      howToUse: { 
        en: ['Use as directed on package'], 
        th: ['ใช้ตามคำแนะนำบนบรรจุภัณฑ์'] 
      },
      description: {
        en: product.description || product.short_description || '',
        th: product.description || product.short_description || ''
      }
    };
  };

  const productData = getProductData();

  // Convert Supabase product to the format expected by existing components
  const convertedProduct = {
    id: product.id,
    name: { 
      en: product.name, 
      th: product.name 
    },
    description: productData.description,
    shortDescription: { 
      en: product.short_description || '', 
      th: product.short_description || '' 
    },
    ingredients: productData.ingredients,
    howToUse: { 
      en: productData.howToUse.en.join('. '), 
      th: productData.howToUse.th.join('. ') 
    },
    useIn: productData.howToUse,
    price: product.price,
    image: getProductImage(),
    category: (product.category_id as 'curry-pastes' | 'stir-fry-sauces' | 'dipping-sauces') || 'curry-pastes'
  };

  // Get related recipes based on product name
  const getRelatedRecipes = () => {
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

    const relatedRecipeIds = productToRecipeMap[product.name] || [];
    return recipes.filter(recipe => relatedRecipeIds.includes(recipe.id));
  };

  const relatedRecipes = getRelatedRecipes();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back to Shop Button */}
      <div className="mb-6">
        <Button asChild variant="outline" className="mb-4">
          <Link to="/shop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Back to Shop' : 'กลับไปยังร้านค้า'}
          </Link>
        </Button>
      </div>

      {/* Breadcrumb */}
      <ProductBreadcrumb productName={product.name} language={language} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-anong-cream to-anong-ivory p-12 flex items-center justify-center"
        >
          <img 
            src={convertedProduct.image}
            alt={product.name}
            className="max-w-[280px] max-h-[280px] w-auto h-auto object-contain"
            loading="eager"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </motion.div>
        
        {/* Product Info */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          <ProductInfo 
            product={convertedProduct} 
            language={language} 
            translations={{
              addToCart: language === 'en' ? 'Add to Cart' : 'เพิ่มลงตะกร้า',
              quantity: language === 'en' ? 'Quantity' : 'จำนวน',
              addedToCart: language === 'en' ? 'Added to cart!' : 'เพิ่มลงตะกร้าแล้ว!'
            }} 
          />
          
          {/* Product Details Tabs */}
          <ProductDetailTabs 
            product={convertedProduct} 
            language={language} 
            translations={{
              description: language === 'en' ? 'Description' : 'รายละเอียด',
              ingredients: language === 'en' ? 'Ingredients' : 'ส่วนผสม',
              howToUse: language === 'en' ? 'How to Use' : 'วิธีใช้'
            }} 
          />
        </motion.div>
      </div>

      {/* Related Recipes Section */}
      {relatedRecipes.length > 0 && (
        <RelatedRecipes 
          recipes={relatedRecipes}
          language={language}
          translations={{
            relatedRecipes: language === 'en' ? 'Related Recipes' : 'สูตรอาหารที่เกี่ยวข้อง',
            viewRecipe: language === 'en' ? 'View Recipe' : 'ดูสูตรอาหาร',
            noRecipes: language === 'en' ? 'No related recipes available' : 'ไม่มีสูตรอาหารที่เกี่ยวข้อง'
          }}
        />
      )}
    </div>
  );
};

export default ProductDetail;

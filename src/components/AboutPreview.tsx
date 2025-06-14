
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';

const AboutPreview = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Meet Anong",
      description: "For three generations, my family has crafted authentic Thai curry pastes and sauces using recipes passed down from my grandmother. Each jar contains the flavors, love, and cultural heritage of Thailand, created with carefully selected ingredients and traditional methods.",
      cta: "Read Our Story"
    },
    th: {
      title: "รู้จักกับอนงค์",
      description: "เป็นเวลาสามรุ่น ครอบครัวของเราได้สร้างสรรค์พริกแกงและซอสไทยแท้ด้วยสูตรที่สืบทอดมาจากคุณยายของฉัน แต่ละขวดบรรจุรสชาติ ความรัก และมรดกทางวัฒนธรรมของประเทศไทย สร้างขึ้นด้วยส่วนผสมที่คัดสรรอย่างพิถีพิถันและวิธีการแบบดั้งเดิม",
      cta: "อ่านเรื่องราวของเรา"
    }
  };

  const t = translations[language];

  const handleButtonClick = () => {
    console.log('About button clicked - navigating to /about');
  };

  return (
    <section className="bg-anong-ivory py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <img 
              src="https://i.postimg.cc/MpX5T8h5/upscalemedia-transformed-4.png" 
              alt="Anong" 
              className="rounded-lg shadow-lg w-full h-auto max-h-[500px] object-cover"
            />
          </div>
          <div className="lg:pl-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">{t.title}</h2>
            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              {t.description}
            </p>
            <Link to="/about" onClick={handleButtonClick}>
              <Button 
                variant="default"
                size="lg"
                className="bg-anong-black text-anong-ivory hover:bg-anong-deep-green transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t.cta}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;

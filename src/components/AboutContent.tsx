
import { useLanguage } from '@/contexts/LanguageContext';

const AboutContent = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Our Story",
      subtitle: "Three Generations of Authentic Thai Flavors",
      story1: "My name is Anong, and my journey with Thai cuisine began in my grandmother's kitchen in rural Thailand. For over 60 years, our family has been perfecting the art of creating authentic Thai curry pastes and sauces using traditional methods passed down through generations.",
      story2: "What started as a family tradition has grown into a passion for sharing the true flavors of Thailand with the world. Each jar of our curry paste contains not just ingredients, but memories, love, and the cultural heritage of our homeland.",
      story3: "We source our ingredients directly from local Thai farmers, ensuring that every spice, herb, and chili maintains its authentic flavor profile. Our small-batch production process honors the traditional methods while meeting modern quality standards.",
      mission: "Our Mission",
      missionText: "To preserve and share the authentic taste of Thailand while supporting local communities and maintaining the highest standards of quality and tradition.",
      values: "Our Values",
      valuesList: [
        "Authentic traditional recipes",
        "Premium quality ingredients",
        "Supporting local Thai farmers",
        "Handcrafted in small batches",
        "Preserving cultural heritage"
      ]
    },
    th: {
      title: "เรื่องราวของเรา",
      subtitle: "สามรุ่นแห่งรสชาติไทยแท้",
      story1: "ฉันชื่ออนงค์ และการเดินทางของฉันกับอาหารไทยเริ่มต้นในครัวของคุณยายในชนบทของไทย เป็นเวลากว่า 60 ปีที่ครอบครัวของเราได้พัฒนาศิลปะการสร้างพริกแกงและซอสไทยแท้โดยใช้วิธีการดั้งเดิมที่สืบทอดมาจากรุ่นสู่รุ่น",
      story2: "สิ่งที่เริ่มต้นเป็นประเพณีครอบครัวได้เติบโตเป็นความหลงใหลในการแบ่งปันรสชาติที่แท้จริงของไทยกับโลก แต่ละขวดของพริกแกงของเราประกอบด้วยไม่เพียงแค่ส่วนผสม แต่ยังมีความทรงจำ ความรัก และมรดกทางวัฒนธรรมของบ้านเกิดของเรา",
      story3: "เราจัดหาส่วนผสมโดยตรงจากเกษตรกรไทยในท้องถิ่น เพื่อให้แน่ใจว่าเครื่องเทศ สมุนไพร และพริกทุกชนิดคงรสชาติที่แท้จริง กระบวนการผลิตแบบ small-batch ของเราเป็นเกียรติแก่วิธีการดั้งเดิมในขณะที่ตอบสนองมาตรฐานคุณภาพสมัยใหม่",
      mission: "พันธกิจของเรา",
      missionText: "เพื่อรักษาและแบ่งปันรสชาติที่แท้จริงของไทยในขณะที่สนับสนุนชุมชนท้องถิ่นและรักษามาตรฐานคุณภาพและประเพณีที่สูงที่สุด",
      values: "คุณค่าของเรา",
      valuesList: [
        "สูตรดั้งเดิมที่แท้จริง",
        "ส่วนผสมคุณภาพพรีเมียม",
        "สนับสนุนเกษตรกรไทยในท้องถิ่น",
        "ทำด้วยมือในชุดเล็ก",
        "รักษามรดกทางวัฒนธรรม"
      ]
    }
  };

  const t = translations[language];

  return (
    <div className="bg-anong-cream min-h-screen">
      {/* Hero Section */}
      <section className="bg-anong-black text-anong-ivory py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-heading mb-6">{t.title}</h1>
          <p className="text-xl md:text-2xl text-anong-gold font-light">{t.subtitle}</p>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src="https://i.postimg.cc/MpX5T8h5/upscalemedia-transformed-4.png" 
                alt="Anong" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {t.story1}
              </p>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {t.story2}
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                {t.story3}
              </p>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-heading text-anong-black mb-4">{t.mission}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{t.missionText}</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-heading text-anong-black mb-4">{t.values}</h3>
              <ul className="space-y-3">
                {t.valuesList.map((value, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-anong-gold mr-3">•</span>
                    <span className="text-gray-700">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutContent;

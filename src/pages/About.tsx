
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const { language, toggleLanguage } = useLanguage();
  
  const translations = {
    en: {
      title: "About Anong",
      subtitle: "The story of our authentic Thai brand",
      story: {
        title: "Our Story",
        content: [
          "Anong Thai was founded by Anong Surasiang, a third-generation Thai chef who grew up in the busy kitchens of Bangkok. Anong learned the secrets of Thai cooking from her grandmother, who taught her that the soul of Thai cuisine lies in the harmony of flavors – sweet, sour, salty, and spicy.",
          "After moving to the United States in the 1990s, Anong was disappointed by the Thai ingredients available in local markets. The flavors were never quite right, the aromas never quite authentic. So she began crafting her own pastes and sauces using traditional methods and imported Thai ingredients.",
          "What started as small batches for friends and family grew into Anong Thai Brand. Today, we continue to use Anong's original recipes, handcrafted in small batches to ensure the highest quality and most authentic flavors. Each jar contains a piece of Anong's culinary heritage – a way to bring the true taste of Thailand into homes around the world."
        ]
      },
      mission: {
        title: "Our Mission",
        content: "At Anong Thai, our mission is to share the authentic flavors of Thailand through high-quality, traditionally-crafted products. We believe that good food brings people together, and we're committed to providing the ingredients that make memorable meals possible."
      },
      values: {
        title: "Our Values",
        list: [
          "Authenticity: We never compromise on using traditional methods and quality ingredients.",
          "Sustainability: We source responsibly and minimize our environmental impact.",
          "Community: We support Thai farmers and producers through fair trade practices.",
          "Innovation: While honoring tradition, we continuously explore new ways to bring Thai flavors to modern kitchens."
        ]
      }
    },
    th: {
      title: "เกี่ยวกับอนงค์",
      subtitle: "เรื่องราวของแบรนด์อาหารไทยแท้ของเรา",
      story: {
        title: "เรื่องราวของเรา",
        content: [
          "แบรนด์อนงค์ไทย ก่อตั้งโดย อนงค์ สุระเสียง เชฟไทยรุ่นที่สามที่เติบโตมาในครัวอันพลุกพล่านของกรุงเทพฯ อนงค์ได้เรียนรู้ความลับของการทำอาหารไทยจากคุณยายของเธอ ผู้สอนว่าจิตวิญญาณของอาหารไทยอยู่ที่ความกลมกล่อมของรสชาติ - หวาน เปรี้ยว เค็ม และเผ็ด",
          "หลังจากย้ายไปอยู่ในสหรัฐอเมริกาในช่วงปี 1990 อนงค์รู้สึกผิดหวังกับวัตถุดิบอาหารไทยที่มีในตลาดท้องถิ่น รสชาติไม่เหมือนกับที่คุ้นเคย กลิ่นหอมไม่เหมือนของแท้ เธอจึงเริ่มทำน้ำพริกและซอสของเธอเองโดยใช้วิธีการแบบดั้งเดิมและนำเข้าวัตถุดิบจากประเทศไทย",
          "จากการทำในปริมาณน้อยๆให้เพื่อนและครอบครัว ได้เติบโตเป็นแบรนด์อนงค์ไทย ทุกวันนี้ เรายังคงใช้สูตรดั้งเดิมของอนงค์ ทำด้วยมือในปริมาณเล็กๆเพื่อรับประกันคุณภาพสูงสุดและรสชาติที่แท้จริง แต่ละขวดบรรจุส่วนหนึ่งของมรดกทางอาหารของอนงค์ - วิธีนำรสชาติที่แท้จริงของประเทศไทยสู่บ้านทั่วโลก"
        ]
      },
      mission: {
        title: "พันธกิจของเรา",
        content: "ที่อนงค์ไทย พันธกิจของเราคือการแบ่งปันรสชาติแท้ของอาหารไทยผ่านผลิตภัณฑ์คุณภาพสูงที่ทำด้วยวิธีแบบดั้งเดิม เราเชื่อว่าอาหารดีๆนำผู้คนมารวมกัน และเรามุ่งมั่นที่จะจัดหาวัตถุดิบที่ทำให้มื้ออาหารน่าจดจำเป็นไปได้"
      },
      values: {
        title: "ค่านิยมของเรา",
        list: [
          "ความแท้: เราไม่ประนีประนอมในการใช้วิธีการแบบดั้งเดิมและวัตถุดิบคุณภาพ",
          "ความยั่งยืน: เราจัดหาอย่างมีความรับผิดชอบและลดผลกระทบต่อสิ่งแวดล้อมของเรา",
          "ชุมชน: เราสนับสนุนเกษตรกรและผู้ผลิตไทยผ่านแนวทางการค้าที่เป็นธรรม",
          "นวัตกรรม: ในขณะที่เคารพประเพณี เรายังค้นหาวิธีใหม่ๆเพื่อนำรสชาติไทยสู่ครัวสมัยใหม่อย่างต่อเนื่อง"
        ]
      }
    }
  };

  const t = translations[language];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentLanguage={language} toggleLanguage={toggleLanguage} />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold mb-2 text-gray-800">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
          
          {/* Founder Image and Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-gray-100 rounded-lg flex items-center justify-center min-h-[400px]">
              {/* Placeholder for founder image */}
              <p className="text-gray-500">Anong Surasiang Photo</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-thai-purple">{t.story.title}</h2>
              {t.story.content.map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          {/* Mission and Values */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-thai-purple">{t.mission.title}</h2>
              <p className="text-gray-700">{t.mission.content}</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-thai-purple">{t.values.title}</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {t.values.list.map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer currentLanguage={language} />
    </div>
  );
};

export default About;

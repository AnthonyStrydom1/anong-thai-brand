
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const About = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const translations = {
    en: {
      title: "About ANONG",
      subtitle: "The heritage of authentic Thai flavors, crafted with tradition and delivered with grace",
      story: {
        title: "Our Story",
        content: [
          "ANONG was founded by Anong Surasiang, a third-generation Thai chef who grew up in the vibrant kitchens of Bangkok. From her grandmother, she learned that the soul of Thai cuisine lies in the perfect harmony of flavors – sweet, sour, salty, and spicy – each element balanced with precision and care.",
          "When Anong moved to South Africa in the 1990s, she was disheartened by the quality of Thai ingredients available. The flavors lacked authenticity, the aromas were never quite right. Determined to preserve her culinary heritage, she began handcrafting her own pastes and sauces using traditional methods and carefully sourced Thai ingredients.",
          "What started as small batches for friends and family has grown into ANONG Thai Brand – a testament to authentic Thai flavors. Today, we continue to honor Anong's original recipes, handcrafted in small batches to ensure the highest quality. Each jar contains a piece of our culinary heritage, bringing the true essence of Thailand to kitchens around the world."
        ]
      },
      mission: {
        title: "Our Mission",
        content: "To share the authentic flavors of Thailand through premium, traditionally-crafted products. We believe exceptional food brings people together, and we're committed to providing the finest ingredients that create unforgettable culinary experiences."
      },
      values: {
        title: "Our Values",
        list: [
          "Authenticity: We honor traditional methods and use only the finest quality ingredients.",
          "Heritage: Every recipe carries the wisdom of generations of Thai culinary masters.",
          "Excellence: We maintain uncompromising standards in every aspect of our craft.",
          "Sustainability: We source responsibly and support Thai farming communities through fair practices.",
          "Innovation: While respecting tradition, we continuously refine our methods to bring Thai flavors to modern kitchens."
        ]
      }
    },
    th: {
      title: "เกี่ยวกับ ANONG",
      subtitle: "มรดกของรสชาติไทยแท้ สร้างด้วยประเพณี ส่งมอบด้วยความงดงาม",
      story: {
        title: "เรื่องราวของเรา",
        content: [
          "ANONG ก่อตั้งโดยอนงค์ สุระเสียง เชฟไทยรุ่นที่สามที่เติบโตในครัวอันมีชีวิตชีวาของกรุงเทพฯ จากคุณยาย เธอได้เรียนรู้ว่าจิตวิญญาณของอาหารไทยอยู่ที่ความกลมกล่อมของรสชาติ – หวาน เปรี้ยว เค็ม และเผ็ด – แต่ละองค์ประกอบสมดุลด้วยความแม่นยำและการดูแล",
          "เมื่ออนงค์ย้ายไปแอฟริกาใต้ในช่วงปี 1990 เธอรู้สึกผิดหวังกับคุณภาพของวัตถุดิบไทยที่มีอยู่ รสชาติขาดความแท้จริง กลิ่นหอมไม่เคยถูกต้อง ด้วยความมุ่งมั่นที่จะรักษามรดกทางอาหารของเธอ เธอเริ่มทำพริกแกงและซอสด้วยมือโดยใช้วิธีการแบบดั้งเดิมและวัตถุดิบไทยที่คัดสรรมาอย่างดี",
          "สิ่งที่เริ่มต้นจากการทำในปริมาณเล็กๆ ให้เพื่อนและครอบครัวได้เติบโตเป็นแบรนด์ไทยอนงค์ – เป็นเครื่องยืนยันถึงรสชาติไทยแท้ วันนี้ เรายังคงให้เกียรติสูตรดั้งเดิมของอนงค์ ทำด้วยมือในปริมาณเล็กเพื่อให้มั่นใจในคุณภาพสูงสุด แต่ละขวดบรรจุชิ้นส่วนของมรดกทางอาหารของเรา นำแก่นแท้ของประเทศไทยสู่ครัวทั่วโลก"
        ]
      },
      mission: {
        title: "พันธกิจของเรา",
        content: "แบ่งปันรสชาติแท้ของไทยผ่านผลิตภัณฑ์พรีเมียมที่สร้างด้วยวิธีดั้งเดิม เราเชื่อว่าอาหารที่ยอดเยี่ยมนำผู้คนมารวมกัน และเรามุ่งมั่นที่จะจัดหาวัตถุดิบชั้นเยี่ยมที่สร้างประสบการณ์การทำอาหารที่น่าจดจำ"
      },
      values: {
        title: "ค่านิยมของเรา",
        list: [
          "ความแท้จริง: เราให้เกียรติวิธีการดั้งเดิมและใช้เฉพาะวัตถุดิบคุณภาพสูงสุด",
          "มรดก: ทุกสูตรอาหารถือความภูมิปัญญาของผู้เชี่ยวชาญอาหารไทยหลายชั่วอายุคน",
          "ความเป็นเลิศ: เราคงไว้ซึ่งมาตรฐานที่ไม่ประนีประนอมในทุกด้านของงานฝีมือ",
          "ความยั่งยืน: เราจัดหาอย่างมีความรับผิดชอบและสนับสนุนชุมชนเกษตรกรไทยผ่านแนวทางที่เป็นธรรม",
          "นวัตกรรม: ในขณะที่เคารพประเพณี เรายังปรับปรุงวิธีการอย่างต่อเนื่องเพื่อนำรสชาติไทยสู่ครัวสมัยใหม่"
        ]
      }
    }
  };

  const t = translations[language];
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <Header />
      
      <main className="flex-grow anong-section thai-pattern-bg">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16 md:mb-20"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="w-16 h-16 mx-auto mb-6">
              <img 
                src="/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png" 
                alt="ANONG Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="anong-heading text-4xl md:text-5xl lg:text-6xl mb-6 text-anong-black">{t.title}</h1>
            <p className="anong-body text-lg md:text-xl text-anong-black/80 max-w-3xl mx-auto leading-relaxed">{t.subtitle}</p>
            
            {/* Thai Lotus Divider */}
            <div className="flex items-center justify-center mt-8">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-anong-gold to-transparent"></div>
              <div className="mx-8 thai-lotus-divider w-8 h-8"></div>
              <div className="w-24 h-px bg-gradient-to-l from-transparent via-anong-gold to-transparent"></div>
            </div>
          </motion.div>
          
          {/* Founder Image and Story */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 mb-16 md:mb-20"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <div className="anong-card p-6 md:p-8">
              <img 
                src="https://i.postimg.cc/MpX5T8h5/upscalemedia-transformed-4.png" 
                alt="Anong Surasiang, founder of ANONG Thai"
                className="w-full h-auto rounded-xl object-cover"
              />
              <div className="mt-6 text-center">
                <h3 className="anong-subheading text-xl text-anong-black mb-2">Anong Surasiang</h3>
                <p className="anong-body-light text-anong-gold">Founder & Master Chef</p>
              </div>
            </div>
            
            <div className="anong-card p-8 md:p-12">
              <h2 className="anong-subheading text-2xl md:text-3xl mb-8 text-anong-black">{t.story.title}</h2>
              <div className="space-y-6">
                {t.story.content.map((paragraph, index) => (
                  <p key={index} className="anong-body text-anong-black/80 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Mission and Values */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <div className="anong-card p-8 md:p-12">
              <h2 className="anong-subheading text-2xl md:text-3xl mb-8 text-anong-black">{t.mission.title}</h2>
              <p className="anong-body text-anong-black/80 leading-relaxed">{t.mission.content}</p>
            </div>
            
            <div className="anong-card p-8 md:p-12">
              <h2 className="anong-subheading text-2xl md:text-3xl mb-8 text-anong-black">{t.values.title}</h2>
              <ul className="space-y-4">
                {t.values.list.map((value, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-anong-gold rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <p className="anong-body text-anong-black/80 leading-relaxed">{value}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;

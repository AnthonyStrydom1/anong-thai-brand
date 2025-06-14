
import React from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const BrandStory = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      tagline: "Our Story",
      title: "Meet Anong",
      subtitle: "The Heart Behind Every Recipe",
      story: "For over three decades, Anong has been perfecting the art of Thai cuisine. What started as a passion for preserving her grandmother's recipes has blossomed into a culinary legacy that bridges tradition with modern innovation.",
      mission: "Our mission is to share the authentic flavors of Thailand with the world, one carefully crafted paste at a time.",
      values: [
        {
          title: "Authenticity",
          description: "Every recipe is rooted in traditional Thai cooking methods passed down through generations."
        },
        {
          title: "Quality",
          description: "We source only the finest ingredients to ensure each product meets our exacting standards."
        },
        {
          title: "Heritage",
          description: "Preserving the rich culinary heritage of Thailand is at the heart of everything we do."
        }
      ]
    },
    th: {
      tagline: "เรื่องราวของเรา",
      title: "พบกับอนงค์",
      subtitle: "หัวใจที่อยู่เบื้องหลังทุกสูตรอาหาร",
      story: "เป็นเวลากว่าสามทศวรรษที่อนงค์ได้พัฒนาศิลปะการทำอาหารไทย สิ่งที่เริ่มต้นจากความหลงใหลในการอนุรักษ์สูตรอาหารของยายได้เบ่งบานเป็นมรดกทางการทำอาหารที่เชื่อมโยงประเพณีกับนวัตกรรมสมัยใหม่",
      mission: "ภารกิจของเราคือการแบ่งปันรสชาติไทยแท้กับโลก ทีละครื้นที่สร้างสรรค์อย่างพิถีพิถัน",
      values: [
        {
          title: "ความแท้จริง",
          description: "ทุกสูตรอาหารมีรากฐานมาจากวิธีการทำอาหารไทยดั้งเดิมที่ส่งต่อกันมาหลายชั่วอายุคน"
        },
        {
          title: "คุณภาพ",
          description: "เราคัดสรรเฉพาะวัตถุดิบที่ดีที่สุดเพื่อให้แน่ใจว่าผลิตภัณฑ์แต่ละชิ้นตรงตามมาตรฐานที่เข้มงวดของเรา"
        },
        {
          title: "มรดก",
          description: "การอนุรักษ์มรดกทางการทำอาหารอันยาวนานของไทยคือหัวใจสำคัญของทุกสิ่งที่เราทำ"
        }
      ]
    }
  };
  
  const t = translations[language];
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  return (
    <section className="anong-section py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {/* Section Header */}
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <span className="anong-tagline text-anong-gold mb-4 block">
              {t.tagline}
            </span>
            <h2 className="anong-heading text-3xl md:text-4xl lg:text-5xl text-anong-black mb-6">
              {t.title}
            </h2>
            <p className="anong-subheading text-xl md:text-2xl text-anong-black/80 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Story Content */}
            <motion.div className="space-y-8" variants={fadeInUp}>
              <div className="space-y-6">
                <p className="anong-body text-lg leading-relaxed text-anong-black/90">
                  {t.story}
                </p>
                <p className="anong-body text-lg leading-relaxed text-anong-black/80 font-medium">
                  {t.mission}
                </p>
              </div>

              {/* Values */}
              <div className="space-y-6">
                {t.values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    className="border-l-4 border-anong-gold pl-6"
                    variants={fadeInUp}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h4 className="anong-subheading text-lg font-semibold text-anong-black mb-2">
                      {value.title}
                    </h4>
                    <p className="anong-body text-anong-black/80">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Image Placeholder */}
            <motion.div className="relative" variants={fadeInUp}>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-anong-cream to-anong-ivory flex items-center justify-center">
                  <div className="text-center text-anong-black/40">
                    <div className="w-16 h-16 mx-auto mb-4 bg-anong-black/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📸</span>
                    </div>
                    <p className="text-sm font-medium">Photo Placeholder</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-anong-gold/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-anong-deep-green/20 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;

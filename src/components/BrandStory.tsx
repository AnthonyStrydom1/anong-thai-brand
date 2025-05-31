
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BrandStory = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      tagline: "OUR HERITAGE",
      title: "Generations of Culinary Mastery",
      story: "For over four decades, the ANONG legacy has been built on unwavering dedication to authentic Thai flavors. Each curry paste is meticulously crafted using traditional methods passed down through generations, ensuring every jar captures the soul of Thailand's rich culinary heritage.",
      values: [
        "Traditional recipes refined over generations",
        "Premium ingredients sourced with care",
        "Handcrafted in small batches for quality"
      ],
      cta: "Discover Our Story"
    },
    th: {
      tagline: "มรดกของเรา",
      title: "ฝีมือการทำอาหารข้ามยุค",
      story: "มากกว่าสี่ทศวรรษ มรดกของอนงค์สร้างขึ้นจากความทุ่มเทอย่างแน่วแน่ต่อรสชาติไทยแท้ พริกแกงแต่ละชนิดถูกสร้างสรรค์อย่างพิถีพิถันด้วยวิธีดั้งเดิมที่สืบทอดกันมาหลายชั่วอายุคน",
      values: [
        "สูตรดั้งเดิมที่ปรับปรุงมาหลายชั่วอายุคน",
        "วัตถุดิบพรีเมียมที่คัดสรรมาอย่างดี",
        "ทำด้วยมือในปริมาณน้อยเพื่อคุณภาพ"
      ],
      cta: "ค้นพบเรื่องราวของเรา"
    }
  };

  const t = translations[language];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <section className="section-premium bg-gradient-to-br from-anong-cream via-anong-warm-cream to-anong-cream py-32 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-botanical-pattern opacity-15"></div>
      <div className="absolute inset-0 watercolor-bg opacity-40"></div>
      
      <div className="container mx-auto relative z-10 max-w-6xl">
        <motion.div
          className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Content Side */}
          <motion.div variants={itemVariants}>
            {/* Premium tagline */}
            <div className="mb-8">
              <span className="font-elegant text-anong-gold text-sm md:text-base tracking-[0.4em] uppercase font-light">
                {t.tagline}
              </span>
              <div className="w-20 h-px bg-anong-gold mt-3"></div>
            </div>

            <h2 className="heading-premium text-4xl md:text-5xl lg:text-6xl mb-8 text-anong-deep-black font-light leading-tight">
              {t.title}
            </h2>
            
            <p className="text-luxury text-lg md:text-xl mb-10 text-anong-charcoal/80 leading-relaxed font-light">
              {t.story}
            </p>

            {/* Values List */}
            <div className="space-y-4 mb-12">
              {t.values.map((value, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  variants={itemVariants}
                >
                  <div className="w-2 h-2 bg-anong-gold rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-luxury text-anong-charcoal/75 leading-relaxed">{value}</p>
                </motion.div>
              ))}
            </div>

            <Button 
              asChild
              size="lg"
              className="btn-outline-premium text-lg px-12 py-6 h-auto font-medium tracking-wide hover:bg-anong-dark-green hover:text-anong-cream transition-all duration-500"
            >
              <Link to="/about" className="flex items-center">
                {t.cta}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Visual Side */}
          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            <div className="relative luxury-card p-8 bg-gradient-to-br from-anong-dark-green to-anong-forest rounded-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-botanical-pattern opacity-20"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-anong-gold/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-anong-gold/15 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10 text-center text-anong-cream">
                <div className="text-6xl md:text-7xl font-display font-light mb-4 text-anong-gold">40+</div>
                <p className="text-xl md:text-2xl font-elegant tracking-wide">Years of Excellence</p>
                <div className="w-16 h-px bg-anong-gold mx-auto my-6"></div>
                <p className="text-anong-cream/80 font-serif leading-relaxed">
                  Crafting authentic Thai flavors with traditional methods and premium ingredients
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;

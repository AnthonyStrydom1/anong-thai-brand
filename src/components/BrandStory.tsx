
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
      title: "Four Decades of Culinary Excellence",
      story: "Each curry paste tells a story of tradition, crafted using time-honored methods passed down through generations. ANONG represents the pinnacle of authentic Thai flavors, where premium ingredients meet ancestral wisdom.",
      cta: "Discover Our Story"
    },
    th: {
      tagline: "มรดกของเรา",
      title: "สี่ทศวรรษแห่งความเป็นเลิศทางการทำอาหาร",
      story: "พริกแกงแต่ละชนิดเล่าเรื่องราวของประเพณี สร้างสรรค์ด้วยวิธีการโบราณที่สืบทอดกันมาหลายชั่วอายุคน อนงค์เป็นตัวแทนของยอดฝีมือรสชาติไทยแท้",
      cta: "ค้นพบเรื่องราวของเรา"
    }
  };

  const t = translations[language];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <section className="section-premium bg-gradient-to-br from-anong-warm-cream via-anong-cream to-anong-warm-cream py-28 relative overflow-hidden">
      {/* Refined background elements */}
      <div className="absolute inset-0 bg-botanical-pattern opacity-10"></div>
      <div className="absolute inset-0 watercolor-bg opacity-30"></div>
      
      <div className="container mx-auto relative z-10 max-w-5xl">
        <motion.div
          className="grid lg:grid-cols-2 gap-20 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Content Side */}
          <motion.div variants={itemVariants} className="lg:pr-8">
            {/* Elegant tagline */}
            <div className="mb-8">
              <span className="font-elegant text-anong-gold text-sm md:text-base tracking-[0.4em] uppercase font-light">
                {t.tagline}
              </span>
              <div className="w-16 h-px bg-anong-gold mt-4"></div>
            </div>

            <h2 className="heading-premium text-3xl md:text-4xl lg:text-5xl mb-10 text-anong-deep-black font-light leading-tight">
              {t.title}
            </h2>
            
            <p className="text-luxury text-lg md:text-xl mb-12 text-anong-charcoal/80 leading-relaxed font-light">
              {t.story}
            </p>

            <Button 
              asChild
              size="lg"
              className="btn-outline-premium text-base px-10 py-5 h-auto font-medium tracking-wide hover:bg-anong-dark-green hover:text-anong-cream transition-all duration-500"
            >
              <Link to="/about" className="flex items-center">
                {t.cta}
                <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Visual Side */}
          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            <div className="relative luxury-card p-12 bg-gradient-to-br from-anong-dark-green to-anong-forest rounded-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-botanical-pattern opacity-15"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-anong-gold/10 rounded-full -translate-y-12 translate-x-12"></div>
              
              <div className="relative z-10 text-center text-anong-cream">
                <div className="text-5xl md:text-6xl font-display font-light mb-6 text-anong-gold">40+</div>
                <p className="text-lg md:text-xl font-elegant tracking-wide mb-4">Years of Tradition</p>
                <div className="w-12 h-px bg-anong-gold mx-auto mb-6"></div>
                <p className="text-anong-cream/85 font-serif leading-relaxed text-sm">
                  Authentic recipes refined through generations of culinary mastery
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

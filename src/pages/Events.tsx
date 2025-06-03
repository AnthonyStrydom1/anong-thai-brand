
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

const Events = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const translations = {
    en: {
      title: "Thai Cultural Events",
      subtitle: "Immerse yourself in authentic Thai traditions and celebrations",
      register: "Register Now",
      learnMore: "Learn More",
      upcoming: "Upcoming Events",
      events: [
        {
          id: 1,
          name: "Thai Night Market",
          description: "Experience authentic Thai street food and traditional crafts in our weekly night market.",
          date: "Every Saturday",
          time: "18:00 - 22:00",
          location: "ANONG Restaurant Courtyard",
          participants: "50+ vendors",
          type: "Weekly Market"
        },
        {
          id: 2,
          name: "Songkran Festival Celebration",
          description: "Join us for the traditional Thai New Year celebration with water blessings and festive activities.",
          date: "April 13-15, 2025",
          time: "10:00 - 18:00",
          location: "ANONG Cultural Center",
          participants: "Open to all",
          type: "Cultural Festival"
        },
        {
          id: 3,
          name: "Thai Cooking Masterclass",
          description: "Learn to prepare authentic Thai dishes with our master chefs using traditional techniques.",
          date: "Every Sunday",
          time: "14:00 - 17:00",
          location: "ANONG Teaching Kitchen",
          participants: "Max 12 people",
          type: "Cooking Class"
        },
        {
          id: 4,
          name: "Loy Krathong Lantern Festival",
          description: "Celebrate the festival of lights with traditional krathong making and lantern releases.",
          date: "November 15, 2025",
          time: "19:00 - 22:00",
          location: "ANONG Garden",
          participants: "Family friendly",
          type: "Traditional Festival"
        },
        {
          id: 5,
          name: "Thai Traditional Dance Workshop",
          description: "Learn graceful Thai classical dance movements and their cultural significance.",
          date: "Every Friday",
          time: "16:00 - 18:00",
          location: "ANONG Cultural Hall",
          participants: "All skill levels",
          type: "Cultural Workshop"
        },
        {
          id: 6,
          name: "Royal Thai Cuisine Gala",
          description: "An exclusive dining experience featuring royal Thai recipes passed down through generations.",
          date: "December 5, 2025",
          time: "19:30 - 23:00",
          location: "ANONG Private Dining",
          participants: "Limited seating",
          type: "Exclusive Dinner"
        }
      ]
    },
    th: {
      title: "งานวัฒนธรรมไทย",
      subtitle: "ดื่มด่ำกับประเพณีไทยแท้และการเฉลิมฉลอง",
      register: "ลงทะเบียนเลย",
      learnMore: "เรียนรู้เพิ่มเติม",
      upcoming: "งานที่จะมาถึง",
      events: [
        {
          id: 1,
          name: "ตลาดกลางคืนไทย",
          description: "สัมผัสอาหารริมทางไทยแท้และงานฝีมือดั้งเดิมในตลาดกลางคืนประจำสัปดาห์",
          date: "ทุกวันเสาร์",
          time: "18:00 - 22:00 น.",
          location: "ลานร้านอาหารอนงค์",
          participants: "ผู้ค้า 50+ ราย",
          type: "ตลาดประจำสัปดาห์"
        },
        {
          id: 2,
          name: "งานเฉลิมฉลองเทศกาลสงกรานต์",
          description: "ร่วมฉลองปีใหม่ไทยด้วยพิธีรดน้ำขอพรและกิจกรรมสนุกสนาน",
          date: "13-15 เมษายน 2568",
          time: "10:00 - 18:00 น.",
          location: "ศูนย์วัฒนธรรมอนงค์",
          participants: "เปิดให้ทุกคน",
          type: "เทศกาลวัฒนธรรม"
        },
        {
          id: 3,
          name: "คลาสสอนทำอาหารไทยระดับมาสเตอร์",
          description: "เรียนรู้การทำอาหารไทยแท้กับเชฟมืออาชีพด้วยเทคนิคดั้งเดิม",
          date: "ทุกวันอาทิตย์",
          time: "14:00 - 17:00 น.",
          location: "ห้องเรียนทำอาหารอนงค์",
          participants: "สูงสุด 12 คน",
          type: "คลาสทำอาหาร"
        },
        {
          id: 4,
          name: "เทศกาลลอยกระทงและโคมไฟ",
          description: "ฉลองเทศกาลแห่งแสงสว่างด้วยการทำกระทงและปล่อยโคมลอย",
          date: "15 พฤศจิกายน 2568",
          time: "19:00 - 22:00 น.",
          location: "สวนอนงค์",
          participants: "เหมาะสำหรับครอบครัว",
          type: "เทศกาลดั้งเดิม"
        },
        {
          id: 5,
          name: "เวิร์คช็อปรำไทยดั้งเดิม",
          description: "เรียนรู้ท่ารำไทยคลาสสิกที่งดงามและความหมายทางวัฒนธรรม",
          date: "ทุกวันศุกร์",
          time: "16:00 - 18:00 น.",
          location: "หอวัฒนธรรมอนงค์",
          participants: "ทุกระดับความสามารถ",
          type: "เวิร์คช็อปวัฒนธรรม"
        },
        {
          id: 6,
          name: "งานเลี้ยงอาหารไทยราชสำนัก",
          description: "ประสบการณ์อาหารพิเศษที่นำเสนออาหารไทยราชสำนักที่สืบทอดมาจากรุ่นสู่รุ่น",
          date: "5 ธันวาคม 2568",
          time: "19:30 - 23:00 น.",
          location: "ห้องอาหารส่วนตัวอนงค์",
          participants: "ที่นั่งจำกัด",
          type: "งานเลี้ยงพิเศษ"
        }
      ]
    }
  };

  const t = translations[language];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-anong-cream">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-anong-black via-anong-charcoal to-anong-black py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 thai-pattern-bg opacity-[0.03]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-anong-gold/[0.05] via-transparent to-anong-gold/[0.05]"></div>
          
          <div className="container mx-auto px-6 md:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="inline-block text-anong-gold text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-6">
                Cultural Experiences
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-light text-anong-ivory mb-8 leading-tight">
                {t.title}
              </h1>
              <p className="text-xl md:text-2xl text-anong-ivory/80 leading-relaxed font-light max-w-3xl mx-auto">
                {t.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Events Grid Section */}
        <section className="py-20 md:py-28 bg-anong-cream">
          <div className="container mx-auto px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 md:mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-heading font-light text-anong-black mb-6">
                {t.upcoming}
              </h2>
              <div className="w-24 h-px bg-anong-gold mx-auto"></div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            >
              {t.events.map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-anong-gold/10 group hover:-translate-y-2"
                >
                  <div className="p-8">
                    <div className="mb-6">
                      <span className="inline-block bg-anong-gold/10 text-anong-black text-xs font-medium px-3 py-1 rounded-full mb-4">
                        {event.type}
                      </span>
                      <h3 className="text-2xl font-heading font-medium text-anong-black mb-4 group-hover:text-anong-dark-green transition-colors">
                        {event.name}
                      </h3>
                      <p className="text-anong-charcoal/70 leading-relaxed mb-6">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-anong-charcoal/60">
                        <Calendar className="h-4 w-4 mr-3 text-anong-gold" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center text-anong-charcoal/60">
                        <Clock className="h-4 w-4 mr-3 text-anong-gold" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center text-anong-charcoal/60">
                        <MapPin className="h-4 w-4 mr-3 text-anong-gold" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center text-anong-charcoal/60">
                        <Users className="h-4 w-4 mr-3 text-anong-gold" />
                        <span className="text-sm">{event.participants}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        size="sm"
                        className="flex-1 bg-anong-black hover:bg-anong-gold hover:text-anong-black text-anong-ivory text-sm transition-all duration-300"
                      >
                        {t.register}
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex-1 border-anong-gold/30 text-anong-black hover:bg-anong-gold/10 text-sm"
                      >
                        {t.learnMore}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;

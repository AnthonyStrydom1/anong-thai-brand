
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Mail, Phone, Instagram, Facebook, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const translations = {
    en: {
      title: "Contact ANONG",
      subtitle: "We'd love to hear from you. Reach out for inquiries about our premium Thai products.",
      form: {
        name: "Your Name",
        email: "Email Address",
        subject: "Subject",
        message: "Your Message",
        send: "Send Message"
      },
      info: {
        title: "Get in Touch",
        email: "Email Us",
        phone: "Call Us",
        visit: "Visit Our Restaurant",
        social: "Follow Us"
      },
      success: "Thank you for your message. We'll get back to you within 24 hours.",
      error: "There was a problem sending your message. Please try again."
    },
    th: {
      title: "ติดต่อ ANONG",
      subtitle: "เรายินดีที่จะได้ยินจากคุณ ติดต่อเราเพื่อสอบถามเกี่ยวกับผลิตภัณฑ์ไทยพรีเมียมของเรา",
      form: {
        name: "ชื่อของคุณ",
        email: "อีเมล",
        subject: "หัวข้อ",
        message: "ข้อความของคุณ",
        send: "ส่งข้อความ"
      },
      info: {
        title: "ติดต่อเรา",
        email: "ส่งอีเมลหาเรา",
        phone: "โทรหาเรา",
        visit: "เยี่ยมชมร้านอาหารของเรา",
        social: "ติดตามเรา"
      },
      success: "ขอบคุณสำหรับข้อความของคุณ เราจะติดต่อกลับภายใน 24 ชั่วโมง",
      error: "มีปัญหาในการส่งข้อความของคุณ โปรดลองอีกครั้ง"
    }
  };

  const t = translations[language];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    toast({
      title: t.success,
      duration: 3000
    });
    
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };
  
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
          
          {/* Contact Form Section */}
          <motion.div 
            className="max-w-4xl mx-auto mb-20"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <div className="anong-card p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-3 text-sm font-medium text-anong-black anong-subheading">
                      {t.form.name}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="anong-input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-3 text-sm font-medium text-anong-black anong-subheading">
                      {t.form.email}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="anong-input"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-3 text-sm font-medium text-anong-black anong-subheading">
                    {t.form.subject}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="anong-input"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-3 text-sm font-medium text-anong-black anong-subheading">
                    {t.form.message}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="anong-input resize-none"
                    required
                  />
                </div>
                
                <div className="text-center">
                  <Button 
                    type="submit" 
                    className="anong-btn-primary px-12 py-6 text-lg rounded-full"
                  >
                    {t.form.send}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
          
          {/* Separate Contact Info Section */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            {/* Email */}
            <div className="anong-card p-8 text-center">
              <div className="w-16 h-16 bg-anong-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="text-anong-gold h-8 w-8" />
              </div>
              <h3 className="anong-subheading text-xl mb-4 text-anong-black">{t.info.email}</h3>
              <a 
                href="mailto:info@anongthai.com" 
                className="anong-body text-anong-black/80 hover:text-anong-gold transition-colors text-lg"
              >
                info@anongthai.com
              </a>
            </div>
            
            {/* Phone */}
            <div className="anong-card p-8 text-center">
              <div className="w-16 h-16 bg-anong-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="text-anong-gold h-8 w-8" />
              </div>
              <h3 className="anong-subheading text-xl mb-4 text-anong-black">{t.info.phone}</h3>
              <a 
                href="tel:+27765059941" 
                className="anong-body text-anong-black/80 hover:text-anong-gold transition-colors text-lg"
              >
                076 505 9941
              </a>
            </div>
            
            {/* Location */}
            <div className="anong-card p-8 text-center">
              <div className="w-16 h-16 bg-anong-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="text-anong-gold h-8 w-8" />
              </div>
              <h3 className="anong-subheading text-xl mb-4 text-anong-black">{t.info.visit}</h3>
              <p className="anong-body text-anong-black/80 text-lg">
                20 Hettie Street<br/>
                Cyrildene, Johannesburg
              </p>
            </div>
          </motion.div>
          
          {/* Social Media Section */}
          <motion.div 
            className="text-center mt-16 mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.6 }}
          >
            <h3 className="anong-subheading text-2xl mb-8 text-anong-black">{t.info.social}</h3>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://instagram.com/anongthai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 bg-anong-gold/10 rounded-full flex items-center justify-center text-anong-gold hover:bg-anong-gold hover:text-white transition-all duration-300"
              >
                <Instagram className="h-7 w-7" />
              </a>
              <a 
                href="https://facebook.com/anongthai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 bg-anong-gold/10 rounded-full flex items-center justify-center text-anong-gold hover:bg-anong-gold hover:text-white transition-all duration-300"
              >
                <Facebook className="h-7 w-7" />
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;

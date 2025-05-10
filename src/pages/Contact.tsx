
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Mail, Phone, Instagram, Facebook } from "lucide-react";

const Contact = () => {
  const { language, toggleLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const translations = {
    en: {
      title: "Contact Us",
      subtitle: "We'd love to hear from you",
      form: {
        name: "Your Name",
        email: "Email Address",
        subject: "Subject",
        message: "Your Message",
        send: "Send Message"
      },
      info: {
        title: "Contact Information",
        email: "Email",
        phone: "Phone",
        social: "Social Media"
      },
      success: "Your message has been sent. We'll get back to you soon!",
      error: "There was a problem sending your message. Please try again."
    },
    th: {
      title: "ติดต่อเรา",
      subtitle: "เรายินดีที่จะได้ยินจากคุณ",
      form: {
        name: "ชื่อของคุณ",
        email: "อีเมล",
        subject: "หัวข้อ",
        message: "ข้อความของคุณ",
        send: "ส่งข้อความ"
      },
      info: {
        title: "ข้อมูลการติดต่อ",
        email: "อีเมล",
        phone: "โทรศัพท์",
        social: "โซเชียลมีเดีย"
      },
      success: "ข้อความของคุณถูกส่งแล้ว เราจะติดต่อกลับโดยเร็วที่สุด",
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
    // In a real application, this is where you would send the form data to a server
    console.log("Form submitted:", formData);
    
    // Show success message
    toast({
      title: t.success,
      duration: 3000
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentLanguage={language} toggleLanguage={toggleLanguage} />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold mb-2 text-gray-800">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                      {t.form.name}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                      {t.form.email}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">
                    {t.form.subject}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                    {t.form.message}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-thai-purple hover:bg-thai-purple-dark"
                >
                  {t.form.send}
                </Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6 text-thai-purple">{t.info.title}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="text-thai-purple mr-3 h-5 w-5" />
                  <div>
                    <p className="font-medium text-gray-700">{t.info.email}</p>
                    <a 
                      href="mailto:info@anongthai.com" 
                      className="text-gray-600 hover:text-thai-purple"
                    >
                      info@anongthai.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="text-thai-purple mr-3 h-5 w-5" />
                  <div>
                    <p className="font-medium text-gray-700">{t.info.phone}</p>
                    <a 
                      href="tel:+12345678900" 
                      className="text-gray-600 hover:text-thai-purple"
                    >
                      +1 (234) 567-8900
                    </a>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium text-gray-700 mb-2">{t.info.social}</p>
                  <div className="flex space-x-3">
                    <a 
                      href="https://instagram.com/anongthai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-thai-purple"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                    <a 
                      href="https://facebook.com/anongthai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-thai-purple"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;

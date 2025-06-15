
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import NavigationBanner from "@/components/NavigationBanner";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  image_url: string | null;
  is_featured: boolean;
  max_participants: number | null;
  current_participants: number;
  price: number;
  category: string;
}

const Events = () => {
  const { language } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .gte('start_date', new Date().toISOString())
          .order('start_date', { ascending: true });

        if (error) {
          console.error('Error loading events:', error);
          return;
        }

        setEvents(data || []);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);
  
  const translations = {
    en: {
      title: "Events & Workshops",
      subtitle: "Join us for exclusive Thai cooking experiences and cultural celebrations",
      comingSoon: "Coming Soon",
      description: "We're preparing exciting events and workshops for you. Stay tuned for updates!",
      featuredEvent: "Featured Event",
      bookNow: "Book Now",
      learnMore: "Learn More",
      free: "Free",
      participants: "participants",
      spotsLeft: "spots left",
      loading: "Loading events...",
      allEvents: "All Events",
      upcomingEvents: "Upcoming Events",
      eventDetails: "Event Details",
      date: "Date",
      time: "Time",
      location: "Location",
      capacity: "Capacity",
      price: "Price"
    },
    th: {
      title: "งานและเวิร์คช็อป",
      subtitle: "เข้าร่วมกับเราในประสบการณ์การทำอาหารไทยและการเฉลิมฉลองทางวัฒนธรรม",
      comingSoon: "เร็วๆ นี้",
      description: "เรากำลังเตรียมงานและเวิร์คช็อปที่น่าตื่นเต้นสำหรับคุณ ติดตามข้อมูลอัปเดต!",
      featuredEvent: "งานพิเศษ",
      bookNow: "จองเลย",
      learnMore: "เรียนรู้เพิ่มเติม",
      free: "ฟรี",
      participants: "คน",
      spotsLeft: "ที่เหลือ",
      loading: "กำลังโหลดงาน...",
      allEvents: "งานทั้งหมด",
      upcomingEvents: "งานที่จะมาถึง",
      eventDetails: "รายละเอียดงาน",
      date: "วันที่",
      time: "เวลา",
      location: "สถานที่",
      capacity: "จำนวนที่รับ",
      price: "ราคา"
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

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === 'th') {
      return date.toLocaleDateString('th-TH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    if (language === 'th') {
      return date.toLocaleDateString('th-TH', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleDateString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <NavigationBanner />
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
          
          {/* Events Content */}
          {isLoading ? (
            <motion.div 
              className="anong-card p-12 md:p-16 text-center"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-anong-gold/20 rounded mx-auto w-48"></div>
                <div className="h-4 bg-anong-gold/20 rounded mx-auto w-96"></div>
                <div className="h-4 bg-anong-gold/20 rounded mx-auto w-80"></div>
              </div>
              <p className="text-anong-black/60 mt-4">{t.loading}</p>
            </motion.div>
          ) : events.length === 0 ? (
            <motion.div 
              className="anong-card p-12 md:p-16 text-center"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <h2 className="anong-subheading text-3xl md:text-4xl mb-8 text-anong-black">{t.comingSoon}</h2>
              <p className="anong-body text-lg text-anong-black/80 max-w-2xl mx-auto leading-relaxed">{t.description}</p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Featured Events */}
              {events.filter(event => event.is_featured).length > 0 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="anong-subheading text-2xl md:text-3xl mb-6 text-anong-black">{t.featuredEvent}</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {events.filter(event => event.is_featured).map((event) => (
                      <Card key={event.id} className="anong-card overflow-hidden">
                        {event.image_url && (
                          <div className="aspect-video bg-gradient-to-br from-anong-gold/20 to-anong-gold/5">
                            <img 
                              src={event.image_url} 
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="anong-heading text-xl md:text-2xl">{event.title}</CardTitle>
                          {event.short_description && (
                            <p className="anong-body text-anong-black/70">{event.short_description}</p>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-anong-gold" />
                              <span>{formatEventDate(event.start_date)}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-anong-gold" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.max_participants && (
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-anong-gold" />
                                <span>
                                  {event.current_participants}/{event.max_participants} {t.participants}
                                  {event.max_participants - event.current_participants > 0 && (
                                    <span className="text-anong-gold ml-2">
                                      ({event.max_participants - event.current_participants} {t.spotsLeft})
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold text-anong-gold">
                                {event.price > 0 ? `R ${event.price}` : t.free}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-3 pt-4">
                            <Button className="anong-btn-primary flex-1">
                              {t.bookNow}
                            </Button>
                            <Button variant="outline" className="flex-1">
                              {t.learnMore}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* All Events */}
              {events.filter(event => !event.is_featured).length > 0 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="anong-subheading text-2xl md:text-3xl mb-6 text-anong-black">{events.filter(event => event.is_featured).length > 0 ? t.upcomingEvents : t.allEvents}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.filter(event => !event.is_featured).map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Card className="anong-card h-full">
                          <CardHeader>
                            <CardTitle className="anong-heading text-lg">{event.title}</CardTitle>
                            {event.short_description && (
                              <p className="anong-body text-sm text-anong-black/70 line-clamp-2">
                                {event.short_description}
                              </p>
                            )}
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-anong-gold" />
                                <span>{formatEventDate(event.start_date)}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-anong-gold" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              {event.max_participants && (
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-anong-gold" />
                                  <span>{event.current_participants}/{event.max_participants}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center pt-4">
                              <span className="text-lg font-semibold text-anong-gold">
                                {event.price > 0 ? `R ${event.price}` : t.free}
                              </span>
                              <Button size="sm" className="anong-btn-secondary">
                                {t.bookNow}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;

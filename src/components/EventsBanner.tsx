
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  title: string;
  short_description: string | null;
  start_date: string;
  location: string | null;
  is_featured: boolean;
}

const EventsBanner = () => {
  const { language } = useLanguage();
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const translations = {
    en: {
      events: "Thai Cultural Events",
      title: "Experience Authentic Thai Culture",
      subtitle: "Join us for traditional festivals, cooking classes, and cultural celebrations",
      cta: "View All Events",
      nextEvent: "Next Event",
      noEvents: "Coming Soon",
      noEventsDesc: "New exciting events are being planned"
    },
    th: {
      events: "งานวัฒนธรรมไทย",
      title: "สัมผัสวัฒนธรรมไทยแท้",
      subtitle: "ร่วมงานเทศกาลดั้งเดิม คลาสสอนทำอาหาร และงานฉลองวัฒนธรรม",
      cta: "ดูงานทั้งหมด",
      nextEvent: "งานต่อไป",
      noEvents: "เร็วๆ นี้",
      noEventsDesc: "กำลังวางแผนงานใหม่ที่น่าตื่นเต้น"
    }
  };

  const t = translations[language];

  useEffect(() => {
    const loadNextEvent = async () => {
      try {
        setIsLoading(true);
        
        // Get the next upcoming event
        const { data, error } = await supabase
          .from('events')
          .select('id, title, short_description, start_date, location, is_featured')
          .eq('is_active', true)
          .gte('start_date', new Date().toISOString())
          .order('start_date', { ascending: true })
          .limit(1);

        if (error) {
          console.error('Error loading next event:', error);
          return;
        }

        if (data && data.length > 0) {
          setNextEvent(data[0]);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNextEvent();
  }, []);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-anong-black via-anong-charcoal to-anong-black py-20 md:py-32 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 thai-pattern-bg opacity-[0.03]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-anong-gold/[0.05] via-transparent to-anong-gold/[0.05]"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-anong-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-anong-gold/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-8"
          >
            <div>
              <span className="inline-block text-anong-gold text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-4">
                {t.events}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-anong-ivory mb-6 leading-tight">
                {t.title}
              </h2>
              <p className="text-lg md:text-xl text-anong-ivory/80 leading-relaxed font-light max-w-lg">
                {t.subtitle}
              </p>
            </div>

            {/* Next Event Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-anong-ivory/5 backdrop-blur-sm border border-anong-gold/20 rounded-2xl p-6 md:p-8"
            >
              <h3 className="text-anong-gold text-sm font-medium tracking-wide uppercase mb-3">
                {t.nextEvent}
              </h3>
              
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-anong-ivory/20 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-anong-ivory/20 rounded w-3/4"></div>
                    <div className="h-4 bg-anong-ivory/20 rounded w-1/2"></div>
                  </div>
                </div>
              ) : nextEvent ? (
                <>
                  <h4 className="text-xl md:text-2xl font-heading text-anong-ivory mb-4">
                    {nextEvent.title}
                  </h4>
                  {nextEvent.short_description && (
                    <p className="text-anong-ivory/70 text-sm mb-4">
                      {nextEvent.short_description}
                    </p>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center text-anong-ivory/70">
                      <Calendar className="h-4 w-4 mr-3 text-anong-gold" />
                      <span className="text-sm">{formatEventDate(nextEvent.start_date)}</span>
                    </div>
                    {nextEvent.location && (
                      <div className="flex items-center text-anong-ivory/70">
                        <MapPin className="h-4 w-4 mr-3 text-anong-gold" />
                        <span className="text-sm">{nextEvent.location}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h4 className="text-xl md:text-2xl font-heading text-anong-ivory mb-4">
                    {t.noEvents}
                  </h4>
                  <p className="text-anong-ivory/70 text-sm">
                    {t.noEventsDesc}
                  </p>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button 
                asChild
                size="lg"
                className="bg-anong-gold hover:bg-anong-ivory text-anong-black hover:text-anong-black text-lg px-8 py-4 h-auto font-medium tracking-wide transition-all duration-500 shadow-xl hover:shadow-2xl rounded-xl group"
              >
                <Link to="/events" className="flex items-center">
                  {t.cta}
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Visual Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-anong-gold/20 to-anong-gold/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-anong-gold/30">
              {/* Event image or placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-anong-gold/10 to-transparent rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-botanical-pattern opacity-[0.08]"></div>
                <div className="text-center space-y-4 relative z-10">
                  <Calendar className="h-16 w-16 md:h-20 md:w-20 text-anong-gold mx-auto opacity-60" />
                  <p className="text-anong-ivory/80 text-sm md:text-base font-light">
                    Thai Cultural Events
                  </p>
                </div>
              </div>
              
              {/* Decorative gold accent */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-anong-gold/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-anong-gold/20 rounded-full blur-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EventsBanner;

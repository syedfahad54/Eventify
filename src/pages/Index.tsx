import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { EventFilters } from '@/components/EventFilters';
import { EventCard } from '@/components/EventCard';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mockEvents } from '@/data/mockEvents';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [events] = useState(mockEvents);
  const [loading] = useState(false);
  const { user, userRole, refreshUserRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBecomeOrganizer = () => {
    if (userRole === 'organizer') {
      navigate('/organizer-dashboard');
    } else {
      navigate('/organizers');
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === 'All Cities' || event.city === selectedCity;
      const matchesCategory = selectedCategory === 'All Categories' || event.category === selectedCategory;
      
      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [events, searchQuery, selectedCity, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <Hero />

        <section id="events-section" className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Browse Events
            </h2>
            <p className="text-muted-foreground text-lg">
              Find the perfect event for you
            </p>
          </motion.div>

          <div className="mb-8">
            <EventFilters
              searchQuery={searchQuery}
              selectedCity={selectedCity}
              selectedCategory={selectedCategory}
              onSearchChange={setSearchQuery}
              onCityChange={setSelectedCity}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-xl text-muted-foreground">
                No events found matching your criteria
              </p>
            </motion.div>
          )}
        </section>

        <section className="bg-gradient-primary py-16 mt-16">
          <div className="container mx-auto px-4 text-center text-primary-foreground">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to host your own event?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of organizers using Eventify to create amazing experiences
              </p>
              {userRole === 'organizer' ? (
                <button
                  onClick={handleBecomeOrganizer}
                  className="bg-background text-primary px-8 py-4 rounded-lg font-semibold hover:bg-background/90 transition-colors"
                >
                  View Organizer Dashboard
                </button>
              ) : (
                <button
                  onClick={handleBecomeOrganizer}
                  className="bg-background text-primary px-8 py-4 rounded-lg font-semibold hover:bg-background/90 transition-colors"
                >
                  Become an Organizer
                </button>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Eventify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, TrendingUp, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventStats {
  eventId: string;
  eventTitle: string;
  totalBookings: number;
  totalRevenue: number;
  bookedSeats: number;
  citiesBreakdown: { [key: string]: number };
}

const OrganizerDashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<EventStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole !== 'organizer') {
      toast({
        title: "Access Denied",
        description: "You need to be an organizer to access this page.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    fetchOrganizerData();
  }, [user, userRole]);

  const fetchOrganizerData = async () => {
    if (!user) return;

    // Fetch organizer's events
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', user.id)
      .order('created_at', { ascending: false });

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      setLoading(false);
      return;
    }

    setEvents(eventsData || []);

    // Fetch bookings analytics for each event
    const statsPromises = (eventsData || []).map(async (event) => {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('seats, total_amount')
        .eq('event_id', event.id)
        .eq('status', 'confirmed');

      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;
      const bookedSeats = bookings?.reduce((sum, b) => sum + b.seats, 0) || 0;

      // For demo purposes, we'll simulate city breakdown based on event city
      const citiesBreakdown: { [key: string]: number } = {};
      if (totalBookings > 0) {
        citiesBreakdown[event.city] = totalBookings;
      }

      return {
        eventId: event.id,
        eventTitle: event.title,
        totalBookings,
        totalRevenue,
        bookedSeats,
        citiesBreakdown
      };
    });

    const statsData = await Promise.all(statsPromises);
    setStats(statsData);
    setLoading(false);
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Organizer Dashboard</h1>
              <p className="text-muted-foreground">Manage your events and view analytics</p>
            </div>
            <Button onClick={handleCreateEvent} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>

          {/* Overall Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">
                    {stats.reduce((sum, s) => sum + s.totalBookings, 0)}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    PKR {stats.reduce((sum, s) => sum + s.totalRevenue, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Tickets Sold</p>
                  <p className="text-2xl font-bold">
                    {stats.reduce((sum, s) => sum + s.bookedSeats, 0)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Events List with Analytics */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your Events</h2>
            {events.length === 0 ? (
              <Card className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No events yet</h3>
                <p className="text-muted-foreground mb-6">Create your first event to get started</p>
                <Button onClick={handleCreateEvent} className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Event
                </Button>
              </Card>
            ) : (
              <div className="grid gap-6">
                {events.map((event, index) => {
                  const eventStats = stats.find(s => s.eventId === event.id);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex gap-6">
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(event.date).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {event.city}
                                  </span>
                                </div>
                              </div>
                              <Button variant="outline" onClick={() => navigate(`/event/${event.id}`)}>
                                View Event
                              </Button>
                            </div>

                            {/* Event Stats */}
                            <div className="grid grid-cols-4 gap-4">
                              <div className="bg-secondary/50 p-3 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Bookings</p>
                                <p className="text-lg font-bold">{eventStats?.totalBookings || 0}</p>
                              </div>
                              <div className="bg-secondary/50 p-3 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                                <p className="text-lg font-bold">
                                  PKR {(eventStats?.totalRevenue || 0).toLocaleString()}
                                </p>
                              </div>
                              <div className="bg-secondary/50 p-3 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Tickets Sold</p>
                                <p className="text-lg font-bold">{eventStats?.bookedSeats || 0}</p>
                              </div>
                              <div className="bg-secondary/50 p-3 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Available</p>
                                <p className="text-lg font-bold">
                                  {event.available_seats} / {event.total_seats}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default OrganizerDashboard;

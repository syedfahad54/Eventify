import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2, Heart, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PaymentDialog } from '@/components/PaymentDialog';
import { TicketView } from '@/components/TicketView';
import { mockEvents } from '@/data/mockEvents';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  category: string;
  price: number;
  available_seats: number;
  total_seats: number;
  image_url: string;
}

interface Booking {
  id: string;
  seats: number;
  total_amount: number;
  payment_method: string;
  created_at: string;
}

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [ticketCount, setTicketCount] = useState(1);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    fetchEvent();
    if (user) {
      checkFavorite();
    }
  }, [id, user]);

  const fetchEvent = async () => {
    // First try to get from Supabase
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      // Fallback to mock data if not found in Supabase
      const mockEvent = mockEvents.find((e: any) => e.id === id);
      if (mockEvent) {
        setEvent({
          ...mockEvent,
          image_url: mockEvent.imageUrl,
          available_seats: mockEvent.availableSeats,
          total_seats: mockEvent.totalSeats
        });
      }
    } else {
      setEvent(data);
    }
    setLoading(false);
  };

  const checkFavorite = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('event_id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    setIsFavorited(!!data);
  };

  const handleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to favorite events.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (isFavorited) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('event_id', id)
        .eq('user_id', user.id);

      if (!error) {
        setIsFavorited(false);
        toast({
          title: "Removed from Favorites",
          description: "Event removed from your favorites."
        });
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ event_id: id, user_id: user.id });

      if (!error) {
        setIsFavorited(true);
        toast({
          title: "Added to Favorites",
          description: "Event added to your favorites."
        });
      }
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: `Check out this event: ${event?.title}`,
          url: url
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Event link copied to clipboard!"
      });
    }
  };

  const handleBooking = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (!event || event.available_seats < ticketCount) {
      toast({
        title: "Not Enough Seats",
        description: "The requested number of seats is not available.",
        variant: "destructive"
      });
      return;
    }

    setShowPaymentDialog(true);
  };

  const handlePaymentConfirm = async (paymentMethod: string) => {
    setBookingLoading(true);

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        event_id: id,
        user_id: user.id,
        seats: ticketCount,
        total_amount: event.price * ticketCount,
        status: 'confirmed',
        payment_method: paymentMethod
      })
      .select()
      .single();

    setBookingLoading(false);
    setShowPaymentDialog(false);

    if (error) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Payment Successful!",
        description: `Your booking is confirmed. Ticket generated successfully.`
      });
      setCompletedBooking(data);
      setShowTicket(true);
      fetchEvent();
      setTicketCount(1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p>Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <Button onClick={() => navigate('/')}>Back to Events</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="relative h-[400px] w-full overflow-hidden">
          <img 
            src={event.image_url} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-4 text-primary-foreground hover:bg-primary/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-gradient-primary border-0">
                      {event.category}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={handleShare}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={handleFavorite}
                        className={isFavorited ? "text-red-500" : ""}
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>

                  <h1 className="text-4xl font-bold mb-4">{event?.title}</h1>

                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-semibold">
                          {event?.date && new Date(event.date).toLocaleDateString('en-PK', { 
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-semibold">{event?.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Venue</p>
                        <p className="font-semibold">{event?.venue}</p>
                        <p className="text-sm text-muted-foreground">{event?.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Availability</p>
                        <p className="font-semibold">{event?.available_seats} / {event?.total_seats} seats</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {event?.description}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Booking Card */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-20">
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Price per ticket</p>
                    <p className="text-4xl font-bold text-primary">
                      PKR {event?.price?.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Number of Tickets
                      </label>
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                        >
                          -
                        </Button>
                        <span className="text-xl font-semibold flex-1 text-center">
                          {ticketCount}
                        </span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">
                          PKR {((event?.price || 0) * ticketCount).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Service fee</span>
                        <span>PKR 0</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                          PKR {((event?.price || 0) * ticketCount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90 h-12 text-lg"
                    onClick={handleBooking}
                    disabled={bookingLoading || !event || event.available_seats < ticketCount}
                  >
                    {bookingLoading ? 'Processing...' : 'Book Now'}
                  </Button>

                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      Secure payment with JazzCash & Easypaisa
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      Instant ticket confirmation
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      Easy cancellation policy
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Eventify. All rights reserved.</p>
        </div>
      </footer>

      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onConfirm={handlePaymentConfirm}
        totalAmount={event?.price * ticketCount || 0}
        ticketCount={ticketCount}
        isProcessing={bookingLoading}
      />

      {completedBooking && (
        <TicketView
          open={showTicket}
          onOpenChange={setShowTicket}
          booking={completedBooking}
          event={event}
        />
      )}

      {/* Login Prompt Dialog */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <LogIn className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Login Required</h3>
                <p className="text-muted-foreground">
                  You need to be logged in to book tickets for this event.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-primary"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login to Continue
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowLoginPrompt(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EventDetail;

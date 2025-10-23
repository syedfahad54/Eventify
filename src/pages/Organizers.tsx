import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Users, BarChart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const Organizers = () => {
  const { user, userRole, refreshUserRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    reason: '',
  });

  const handleBecomeOrganizer = async () => {
    if (!user) {
      setShowDialog(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'organizer' });

      if (error) throw error;

      await refreshUserRole();

      toast({
        title: "Success!",
        description: "You are now an event organizer.",
      });

      // Navigate to organizer dashboard after becoming organizer
      navigate('/organizer-dashboard');

      setShowDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitApplication = () => {
    if (!formData.fullName || !formData.email || !formData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Store application intent
    localStorage.setItem('organizerApplication', JSON.stringify(formData));
    
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "Create an account or sign in to become an organizer.",
      });
      navigate('/auth');
    } else {
      handleBecomeOrganizer();
    }
  };

  const benefits = [
    {
      icon: Calendar,
      title: 'Easy Event Management',
      description: 'Create and manage events with our intuitive dashboard.',
    },
    {
      icon: Users,
      title: 'Reach More People',
      description: 'Connect with thousands of potential attendees.',
    },
    {
      icon: BarChart,
      title: 'Track Performance',
      description: 'Get detailed analytics and insights on your events.',
    },
    {
      icon: Zap,
      title: 'Fast Payments',
      description: 'Receive payments quickly and securely.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">For Event Organizers</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Create, manage, and grow your events with Eventify's powerful platform
            </p>
            
            {userRole === 'organizer' ? (
              <Card className="p-6 max-w-md mx-auto bg-gradient-primary/10">
                <p className="text-lg font-semibold">You're already an organizer! 🎉</p>
                <p className="text-muted-foreground mt-2">Start creating amazing events.</p>
              </Card>
            ) : (
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90"
                onClick={handleBecomeOrganizer}
              >
                Become an Organizer
              </Button>
            )}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Become an Event Organizer</DialogTitle>
            <DialogDescription>
              Fill out this application to start creating and managing events on Eventify.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="experience">Previous Event Experience</Label>
              <Textarea
                id="experience"
                placeholder="Tell us about your event organizing experience (optional)"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="reason">Why do you want to become an organizer? *</Label>
              <Textarea
                id="reason"
                placeholder="Share your motivation and event ideas"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmitApplication} className="flex-1">
                Submit Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Organizers;

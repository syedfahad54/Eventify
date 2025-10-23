import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Calendar, Search, Ticket, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const features = [
    {
      icon: Search,
      title: 'Discover Events',
      description: 'Browse through a curated list of amazing events happening in your area.',
    },
    {
      icon: Ticket,
      title: 'Easy Booking',
      description: 'Book your tickets instantly with a seamless checkout experience.',
    },
    {
      icon: Calendar,
      title: 'Stay Updated',
      description: 'Get notifications and reminders for upcoming events you care about.',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data and payments are protected with industry-standard security.',
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Eventify makes discovering and attending events simple and enjoyable
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Card className="p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of users who are discovering and attending amazing events every day.
              </p>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default About;

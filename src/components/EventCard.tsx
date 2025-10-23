import { Event } from '@/types/event';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
  index?: number;
}

export const EventCard = ({ event, index = 0 }: EventCardProps) => {
  const availabilityPercentage = (event.availableSeats / event.totalSeats) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/event/${event.id}`}>
        <Card className="overflow-hidden hover:shadow-card-hover transition-all duration-300 cursor-pointer group h-full flex flex-col">
          <div className="relative h-48 overflow-hidden flex-shrink-0">
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80';
              }}
            />
            <div className="absolute top-3 right-3">
              <Badge className="bg-gradient-primary border-0">
                {event.category}
              </Badge>
            </div>
            {availabilityPercentage < 20 && availabilityPercentage > 0 && (
              <div className="absolute top-3 left-3">
                <Badge variant="destructive">
                  Limited Seats
                </Badge>
              </div>
            )}
          </div>

          <div className="p-5 space-y-3 flex-1 flex flex-col">
            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
              {event.title}
            </h3>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString('en-PK', { 
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })} • {event.time}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.venue}, {event.city}</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{event.availableSeats} seats available</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
              <div>
                <span className="text-xs text-muted-foreground">Starting from</span>
                <p className="text-2xl font-bold text-primary">
                  PKR {event.price.toLocaleString()}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {event.organizerName}
              </Badge>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

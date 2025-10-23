import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Clock, Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

interface TicketViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    id: string;
    seats: number;
    total_amount: number;
    payment_method: string;
    created_at: string;
  };
  event: {
    title: string;
    date: string;
    time: string;
    venue: string;
    city: string;
    category: string;
  };
}

export const TicketView = ({ open, onOpenChange, booking, event }: TicketViewProps) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `ticket-${booking.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading ticket:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>

          <div ref={ticketRef} className="p-8 bg-background">
            <div className="text-center mb-6">
              <div className="inline-block px-4 py-2 bg-gradient-primary text-white rounded-full mb-4">
                🎉 Booking Confirmed!
              </div>
              <h2 className="text-2xl font-bold mb-2">Your E-Ticket</h2>
              <p className="text-muted-foreground">Present this ticket at the venue entrance</p>
            </div>

            <Card className="p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.category}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-semibold">
                          {new Date(event.date).toLocaleDateString('en-PK', { 
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-semibold">{event.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Venue</p>
                        <p className="font-semibold">{event.venue}</p>
                        <p className="text-sm text-muted-foreground">{event.city}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Tickets</p>
                        <p className="font-semibold">{booking.seats}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Paid</p>
                        <p className="font-semibold">PKR {booking.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <p className="font-semibold capitalize">{booking.payment_method}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Booking ID</p>
                        <p className="font-semibold text-xs">{booking.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border-l-0 md:border-l border-border pl-0 md:pl-6">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG 
                      value={`TICKET:${booking.id}`}
                      size={180}
                      level="H"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Scan at venue entrance
                  </p>
                </div>
              </div>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              <p>Booked on {new Date(booking.created_at).toLocaleDateString('en-PK', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>

          <div className="p-6 border-t border-border bg-secondary/50">
            <Button 
              onClick={handleDownload}
              className="w-full bg-gradient-primary"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Ticket
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

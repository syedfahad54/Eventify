export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  price: number;
  category: 'Concert' | 'Workshop' | 'Conference' | 'Sports' | 'Theatre' | 'Festival';
  imageUrl: string;
  organizerId: string;
  organizerName: string;
  availableSeats: number;
  totalSeats: number;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  seats: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentMethod: 'jazzcash' | 'easypaisa' | 'nayapay' | 'sadapay';
  createdAt: string;
}

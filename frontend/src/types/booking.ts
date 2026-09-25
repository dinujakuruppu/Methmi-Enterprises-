export interface BookingEnquiry {
  fullName: string;
  email: string;
  whatsappNumber: string;
  country: string;
  flightNumber?: string;
  arrivalDate: string;
  arrivalTime: string;
  pickupLocation: string;
  dropLocation: string;
  vehicleType: string;
  message?: string;
}

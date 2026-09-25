export type VehicleCategory = "Van" | "Car" | "SUV" | "Bus";

export interface VehicleSamplePrices {
  colombo: string;
  galle: string;
  sigiriya: string;
}

export interface Vehicle {
  slug: string;
  name: string;
  category: VehicleCategory;
  seats: number;
  ac: boolean;
  luggageCapacity: string;
  description: string;
  image: string;
  samplePrices: VehicleSamplePrices;
}

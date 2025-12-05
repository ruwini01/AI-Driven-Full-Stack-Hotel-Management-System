import { z } from "zod";

export const CreateHotelDTO = z.object({
  name: z.string(),
  location: z.string(),
  city: z.string(),
  rating: z.number().min(0).max(5).optional(),
  description: z.string(),
  price: z.number(),
  stars: z.number().min(1).max(5),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).nonempty("At least one image is required"),
});


export const SearchHotelDTO = z.object({
  query: z.string().min(1),
});
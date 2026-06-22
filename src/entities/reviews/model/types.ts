export interface ReviewDTO {
  id: string;
  name: string;
  avatar: string;
  rating: number; // 1..5
  text: string;
  date: string;
  reply?: string;
}

export interface ReviewsDTO {
  avgRating: number;
  count: number;
  reviews: ReviewDTO[];
}

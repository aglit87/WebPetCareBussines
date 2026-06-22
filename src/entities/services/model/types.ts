export interface ServiceDTO {
  id: string;
  name: string;
  icon: string;
  price: string;
  durationMin: number;
}

export interface ServicesDTO {
  services: ServiceDTO[];
}

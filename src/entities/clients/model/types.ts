export interface ClientDTO {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  pets: string;
  visits: number;
  lastVisit: string;
  totalSpent: string;
}

export interface ClientsDTO {
  clients: ClientDTO[];
}

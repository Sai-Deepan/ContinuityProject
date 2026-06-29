export interface Component {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  specifications: Record<string, string>;
  datasheetUrl: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string; // Used to map to a Lucide icon
}

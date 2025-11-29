export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "The Dude Cardigan",
    price: 89.99,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop",
    description: "The classic knit sweater that ties the room together."
  },
  {
    id: "2",
    name: "Abide Bowling Pin Tee",
    price: 29.99,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    description: "Strike! A comfortable tee for league night."
  },
  {
    id: "3",
    name: "White Russian Glass Set",
    price: 45.00,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
    description: "Careful man, there's a beverage here!"
  },
  {
    id: "4",
    name: "Rug Mousepad",
    price: 15.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=800&auto=format&fit=crop",
    description: "It really ties your desk together."
  },
  {
    id: "5",
    name: "Walter's Dog Tags",
    price: 12.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
    description: "I don't roll on Shabbos."
  },
  {
    id: "6",
    name: "Donny's Bowling Ball Sticker",
    price: 4.99,
    category: "Stickers",
    image: "https://images.unsplash.com/photo-1592433070516-a5a9769ec466?q=80&w=800&auto=format&fit=crop",
    description: "You're out of your element!"
  }
];

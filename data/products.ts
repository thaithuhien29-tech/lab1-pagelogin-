export type Product = {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Mouse",
    image: "/products/mouse.jpg",
    description: "Ergonomic wireless mouse with silent click.",
    price: 19.99,
    category: "Accessories",
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    image: "/products/keyboard.jpg",
    description: "RGB backlit keyboard with blue switches.",
    price: 59.9,
    category: "Accessories",
  },
  {
    id: 3,
    name: "USB-C Hub",
    image: "/products/hub.jpg",
    description: "7-in-1 hub with HDMI and card reader.",
    price: 34.5,
    category: "Accessories",
  },
  {
    id: 4,
    name: "Laptop Stand",
    image: "/products/stand.jpg",
    description: "Adjustable aluminum stand for laptops.",
    price: 24.0,
    category: "Accessories",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    image: "/products/speaker.jpg",
    description: "Portable speaker with 12h battery life.",
    price: 39.99,
    category: "Audio",
  },
  {
    id: 6,
    name: "Webcam HD",
    image: "/products/webcam.jpg",
    description: "1080p webcam with built-in microphone.",
    price: 29.95,
    category: "Video",
  },
];
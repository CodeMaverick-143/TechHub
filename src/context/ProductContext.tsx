import { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface ProductContextType {
  products: Product[];
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  filterProducts: (category: string, priceRange?: [number, number]) => Product[];
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Generate 50+ products with rupee pricing
const generateProducts = (): Product[] => {
  const categories = ['laptops', 'phones', 'audio', 'accessories', 'gaming'];
  const laptopNames = ['UltraBook Pro', 'PowerLaptop', 'DevBook', 'GamerLaptop X', 'SlimBook Air', 'WorkStation Pro', 'StudentBook', 'CreatorLaptop', 'TravelBook Lite', 'BusinessBook Elite'];
  const phoneNames = ['Galaxy Ultra', 'iPhoneX Pro', 'Pixel Pro', 'OnePlus Ultra', 'Redmi Note', 'Vivo Pro', 'Oppo Find', 'Realme GT', 'Nothing Phone', 'Moto Edge'];
  const audioNames = ['SoundBuds Pro', 'NoiseCancel X', 'BassBoost Headphones', 'TrueWireless Earbuds', 'StudioSound Pro', 'GamingHeadset X', 'AudiophileX', 'PodsBuds', 'SurroundSound 7.1', 'MusicMaster Pro'];
  const accessoryNames = ['Ultra Monitor', 'MechKeyboard RGB', 'GamingMouse Pro', 'USB-C Hub', 'Wireless Charger', 'Power Bank 20000mAh', 'Laptop Stand', 'Phone Gimbal', 'Camera Tripod', 'External SSD'];
  const gamingNames = ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Gaming PC Ultra', 'VR Headset Pro', 'Gaming Controller', 'Racing Wheel', 'Gaming Chair', 'RGB Light Strip', 'Gaming Router'];
  
  const products: Product[] = [];
  let id = 1;
  
  // Helper to generate random price in rupees
  const randomPrice = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min) * 100;
  
  // Update the generateProducts function to use real images
  const getCategoryImage = (category: string, name: string, variant: string = '') => {
    const baseUrl = 'https://source.unsplash.com/featured/300x200?';
    
    // Create search terms based on product category and name
    let searchTerm = '';
    
    switch(category) {
      case 'laptops':
        searchTerm = 'laptop,computer';
        break;
      case 'phones':
        searchTerm = 'smartphone,mobile';
        break;
      case 'audio':
        searchTerm = name.toLowerCase().includes('headphone') ? 'headphones' : 
                    name.toLowerCase().includes('earbuds') ? 'earbuds' : 'audio';
        break;
      case 'accessories':
        if (name.toLowerCase().includes('monitor')) searchTerm = 'monitor';
        else if (name.toLowerCase().includes('keyboard')) searchTerm = 'keyboard';
        else if (name.toLowerCase().includes('mouse')) searchTerm = 'mouse';
        else if (name.toLowerCase().includes('charger')) searchTerm = 'charger';
        else searchTerm = 'tech,accessory';
        break;
      case 'gaming':
        if (name.toLowerCase().includes('playstation')) searchTerm = 'playstation';
        else if (name.toLowerCase().includes('xbox')) searchTerm = 'xbox';
        else if (name.toLowerCase().includes('nintendo')) searchTerm = 'nintendo';
        else if (name.toLowerCase().includes('chair')) searchTerm = 'gaming,chair';
        else searchTerm = 'gaming';
        break;
      default:
        searchTerm = 'tech';
    }
    
    // Add variant to search term if it's meaningful
    if (variant && !['Pro', 'Lite'].includes(variant)) {
      searchTerm += `,${variant.toLowerCase()}`;
    }
    
    // Add random parameter to prevent image caching
    const randomParam = Math.floor(Math.random() * 1000);
    return `${baseUrl}${searchTerm}&random=${randomParam}`;
  };
  
  // Generate products for each category
  categories.forEach(category => {
    let names: string[] = [];
    let priceRange: [number, number] = [0, 0];
    
    switch(category) {
      case 'laptops':
        names = laptopNames;
        priceRange = [400, 1500]; // ₹40,000 - ₹150,000
        break;
      case 'phones':
        names = phoneNames;
        priceRange = [150, 1200]; // ₹15,000 - ₹120,000
        break;
      case 'audio':
        names = audioNames;
        priceRange = [20, 300]; // ₹2,000 - ₹30,000
        break;
      case 'accessories':
        names = accessoryNames;
        priceRange = [10, 250]; // ₹1,000 - ₹25,000
        break;
      case 'gaming':
        names = gamingNames;
        priceRange = [50, 800]; // ₹5,000 - ₹80,000
        break;
    }
    
    // Create multiple products for each name with variations
    names.forEach(name => {
      // Create base product
      products.push({
        id: id++,
        name,
        description: `High-quality ${category.slice(0, -1)} with premium features`,
        price: randomPrice(priceRange[0], priceRange[1]),
        image: getCategoryImage(category, name),
        category
      });
      
      // Create variant with "Pro" or "Lite" suffix if not already in name
      const variant = name.includes('Pro') ? 'Lite' : 'Pro';
      products.push({
        id: id++,
        name: `${name} ${variant}`,
        description: `${variant === 'Pro' ? 'Advanced' : 'Budget-friendly'} version of the ${name}`,
        price: variant === 'Pro' 
          ? randomPrice(priceRange[0] * 1.2, priceRange[1] * 1.2) 
          : randomPrice(priceRange[0] * 0.7, priceRange[1] * 0.7),
        image: getCategoryImage(category, name, variant),
        category
      });
      
      // Add a third variant for some products
      if (Math.random() > 0.5) {
        const specialVariant = ['Premium', 'Ultra', 'Max', 'Plus', 'Elite'][Math.floor(Math.random() * 5)];
        products.push({
          id: id++,
          name: `${name} ${specialVariant}`,
          description: `Special edition ${name} with exclusive features`,
          price: randomPrice(priceRange[0] * 1.5, priceRange[1] * 1.5),
          image: getCategoryImage(category, name, specialVariant),
          category
        });
      }
    });
  });
  
  return products;
};

const initialProducts = generateProducts();

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);

  const addToCart = (product: Product) => {
    setCart(prevCart => [...prevCart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const index = prevCart.findIndex(item => item.id === productId);
      if (index !== -1) {
        const newCart = [...prevCart];
        newCart.splice(index, 1);
        return newCart;
      }
      return prevCart;
    });
  };

  const filterProducts = (category: string, range?: [number, number]) => {
    const currentRange = range || priceRange;
    let filtered = products;
    
    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    // Filter by price range
    filtered = filtered.filter(
      product => product.price >= currentRange[0] && product.price <= currentRange[1]
    );
    
    return filtered;
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      cart, 
      addToCart, 
      removeFromCart, 
      filterProducts, 
      priceRange, 
      setPriceRange 
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 
import { useState, useEffect, useRef } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { ProductProvider, useProducts, Product } from './context/ProductContext'
import './App.css'

// Icons
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
)

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
)

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
)

// Components
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

const PriceRangeSlider = ({ 
  min, 
  max, 
  value, 
  onChange 
}: { 
  min: number; 
  max: number; 
  value: [number, number]; 
  onChange: (range: [number, number]) => void;
}) => {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const timeoutRef = useRef<number | null>(null);
  
  // Format price in rupees
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };
  
  const handleChange = (index: 0 | 1, newValue: number) => {
    const newRange: [number, number] = [...localValue] as [number, number];
    newRange[index] = newValue;
    
    // Ensure min <= max
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[0] = newRange[1];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[1] = newRange[0];
    }
    
    setLocalValue(newRange);
    
    // Debounce the onChange callback
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      onChange(newRange);
    }, 300);
  };
  
  return (
    <div className="price-range-slider">
      <div className="price-range-labels">
        <span>Price Range:</span>
        <span>{formatPrice(localValue[0])} - {formatPrice(localValue[1])}</span>
      </div>
      <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={(e) => handleChange(0, parseInt(e.target.value))}
          className="slider min-slider"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={(e) => handleChange(1, parseInt(e.target.value))}
          className="slider max-slider"
        />
      </div>
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useProducts()
  const [isAnimating, setIsAnimating] = useState(false)
  
  const handleAddToCart = () => {
    addToCart(product)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1000)
  }
  
  // Format price in rupees
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };
  
  return (
    <div className="product-card fade-in">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-price">{formatPrice(product.price)}</div>
        <button 
          className={`add-to-cart-btn ${isAnimating ? 'pulse' : ''}`}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

const CartItem = ({ item, onRemove }: { item: Product, onRemove: () => void }) => {
  // Format price in rupees
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };
  
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-price">{formatPrice(item.price)}</div>
      </div>
      <button className="remove-item" onClick={onRemove}>×</button>
    </div>
  )
}

const Cart = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { cart, removeFromCart } = useProducts()
  
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)
  
  // Format price in rupees
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };
  
  return (
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button className="close-cart" onClick={onClose}>×</button>
      </div>
      
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item, index) => (
              <CartItem 
                key={`${item.id}-${index}`} 
                item={item} 
                onRemove={() => removeFromCart(item.id)} 
              />
            ))}
          </div>
          
          <div className="cart-total">
            Total: {formatPrice(totalPrice)}
          </div>
          
          <button className="checkout-btn">Proceed to Checkout</button>
        </>
      )}
    </div>
  )
}

const AppContent = () => {
  const { products, cart, filterProducts, priceRange, setPriceRange } = useProducts()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [category, setCategory] = useState('all')
  const [filteredProducts, setFilteredProducts] = useState(products)
  
  // Find min and max prices from all products
  const minPrice = 0;
  const maxPrice = 150000; // ₹1,50,000 as max price
  
  useEffect(() => {
    setFilteredProducts(filterProducts(category, priceRange))
  }, [category, priceRange, products, filterProducts])
  
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'laptops', name: 'Laptops' },
    { id: 'phones', name: 'Smartphones' },
    { id: 'audio', name: 'Audio' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'gaming', name: 'Gaming' }
  ]
  
  return (
    <div className="app-container">
      <header>
        <div className="container header-content">
          <div className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
              <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
              <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
              <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
              <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
              <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
            </svg>
            TechHub
          </div>
          
          <div className="nav-links">
            <a href="#">Home</a>
            <a href="#">Products</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
          
          <div className="header-actions">
            <ThemeToggle />
            <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
              <CartIcon />
              {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <div className="container">
          <section className="hero-section">
            <h1 className="hero-title">Cutting-Edge Tech Products</h1>
            <p className="hero-subtitle">
              Discover the latest innovations in technology with our premium selection of devices and accessories.
            </p>
          </section>
          
          <section className="category-section">
            <div className="filters-container">
              <div className="category-filters">
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    className={`category-button ${category === cat.id ? 'active' : ''}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              
              <PriceRangeSlider
                min={minPrice}
                max={maxPrice}
                value={priceRange}
                onChange={setPriceRange}
              />
            </div>
            
            <div className="product-count">
              Showing {filteredProducts.length} products
            </div>
            
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>TechHub</h3>
              <p>Your one-stop shop for premium tech products and accessories.</p>
            </div>
            
            <div className="footer-section">
              <h3>Quick Links</h3>
              <div className="footer-links">
                <a href="#">Home</a>
                <a href="#">Products</a>
                <a href="#">About Us</a>
                <a href="#">Contact</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h3>Categories</h3>
              <div className="footer-links">
                <a href="#">Laptops</a>
                <a href="#">Smartphones</a>
                <a href="#">Audio</a>
                <a href="#">Accessories</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h3>Contact Us</h3>
              <div className="footer-links">
                <a href="mailto:info@techhub.com">info@techhub.com</a>
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} TechHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ProductProvider>
        <AppContent />
      </ProductProvider>
    </ThemeProvider>
  )
}

export default App

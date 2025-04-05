import React, { useState, useEffect } from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showGiftMessage, setShowGiftMessage] = useState(false);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCartItems(prevItems => {
      const newItems = prevItems.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
      return newItems;
    });
  };

  useEffect(() => {
    const subtotal = calculateSubtotal();
    const hasGift = cartItems.some(item => item.id === FREE_GIFT.id);

    if (subtotal >= THRESHOLD && !hasGift) {
      setCartItems(prev => [...prev, { ...FREE_GIFT, quantity: 1 }]);
      setShowGiftMessage(true);
      setTimeout(() => setShowGiftMessage(false), 3000);
    } else if (subtotal < THRESHOLD && hasGift) {
      setCartItems(prev => prev.filter(item => item.id !== FREE_GIFT.id));
    }
  }, [cartItems]);

  const subtotal = calculateSubtotal();
  const progress = Math.min((subtotal / THRESHOLD) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {PRODUCTS.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-lg mb-2">₹{product.price}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
          <div className="flex justify-between items-center mb-4">
            <span>Subtotal:</span>
            <span className="text-lg font-medium">₹{subtotal}</span>
          </div>

          {subtotal < THRESHOLD && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Add ₹{THRESHOLD - subtotal} more to get a FREE Wireless Mouse!
              </p>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {showGiftMessage && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
              You got a free Wireless Mouse!
            </div>
          )}

          {cartItems.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-medium">Cart Items</h3>
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.id !== FREE_GIFT.id && (
                      <>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <MinusCircle size={24} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <PlusCircle size={24} />
                        </button>
                      </>
                    )}
                    {item.id === FREE_GIFT.id && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                        FREE GIFT
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm">Add some products to see them here!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
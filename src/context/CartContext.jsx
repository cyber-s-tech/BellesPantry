
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

const API_URL =
  "https://soumi.ahaanmedia.com/wp-json/wc/store/v1";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function requestCart(endpoint = "/cart", options = {}) {
    const token = localStorage.getItem("woo_cart_token");

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { "Cart-Token": token } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const newToken = response.headers.get("Cart-Token");

    if (newToken) {
      localStorage.setItem("woo_cart_token", newToken);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update cart.");
    }

    setCart(data);
    setError("");
    return data;
  }

  useEffect(() => {
    requestCart()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function addToCart(productId, quantity = 1) {
    return requestCart("/cart/add-item", {
      method: "POST",
      body: JSON.stringify({
        id: Number(productId),
        quantity: Number(quantity),
      }),
    });
  }

  async function updateQuantity(key, quantity) {
    return requestCart("/cart/update-item", {
      method: "POST",
      body: JSON.stringify({ key, quantity }),
    });
  }

  async function removeFromCart(key) {
    return requestCart("/cart/remove-item", {
      method: "POST",
      body: JSON.stringify({ key }),
    });
  }

  const itemCount =
    cart?.items?.reduce(
      (total, item) => total + item.quantity,
      0
    ) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart: requestCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

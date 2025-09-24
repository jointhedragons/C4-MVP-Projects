import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

function ShopContextProvider({ children }) {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // ✅ Error handler (skip toast if 401)
  const handleError = (error, fallbackMsg) => {
    console.error("🔥 Error:", error?.response?.data || error.message);
    if (error.response?.status !== 401) {
      toast.error(error.message || fallbackMsg);
    }
  };

  // 🔹 Get User Profile
  const fetchUserData = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token },
      });

      if (res.data.success) {
        setUserData(res.data.user);
      } else {
        toast.error("❌ Failed to fetch user");
      }
    } catch (err) {
      handleError(err, "Error fetching user profile");
    }
  };





  // 📌 Load Token + Cart once
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      getCartUser(savedToken);
    }
  }, []);

  const value = {
    products,
    navigate,
    backendUrl,
    token,
    setToken,
    fetchUserData,
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
}

export default ShopContextProvider;
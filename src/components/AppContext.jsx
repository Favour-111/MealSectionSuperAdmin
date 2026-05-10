import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import axios from "axios";
// Create context
const AppContext = createContext();

// Create provider
export const AppProvider = ({ children }) => {
  // Example global states
  const [Universities, setUniversities] = useState([]);
  const [allOrder, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [allUsers, setUsers] = useState([]);
  const [riders, setRiders] = useState([]);
  const [vendors, setVendors] = useState([]);

  const handleFetch = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API}/api/universities`,
      );
      if (data) {
        setUniversities(data.universities);
      } else {
        toast.error("Error fetching universities. Please reload the page");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching universities");
    }
  };
  const fetchOrders = useCallback(async (force = false) => {
    if (!force && allOrder.length > 0) {
      return allOrder;
    }

    setOrdersLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API}/api/users/orders/admin/all`,
      );

      if (response && response.data.orders) {
        setAllOrders(response.data.orders);
        return response.data.orders;
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Something went wrong fetching orders");
    } finally {
      setOrdersLoading(false);
    }
    return [];
  }, [allOrder]);
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API}/api/users/allUser`,
      );

      if (response && response.data.message) {
        setUsers(response.data.message);
      } else {
        toast.error("Error fetching Users");
      }
    } catch (error) {
      console.error("Error fetching Users:", error);
      toast.error("Something went wrong fetching Users");
    } finally {
      // noop here; overall isLoading handled in loadAll
    }
  };
  const fetchVendors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API}/api/vendors/all`,
      );

      if (response && response.data) {
        setVendors(response.data);
      } else {
        toast.error("Error fetching Vendors");
      }
    } catch (error) {
      console.error("Error fetching Vendors:", error);
      toast.error("Something went wrong fetching Vendors");
    } finally {
      // noop here; overall isLoading handled in loadAll
    }
  };
  const fetchRiders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API}/api/riders/allRiders`,
      );

      if (response && response.data) {
        setRiders(response.data);
      } else {
        toast.error("Error fetching Riders");
      }
    } catch (error) {
      console.error("Error fetching Riders:", error);
      toast.error("Something went wrong fetching Riders");
    } finally {
      // noop here; overall isLoading handled in loadAll
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          handleFetch(),
          fetchUsers(),
          fetchVendors(),
          fetchRiders(),
        ]);
      } catch (e) {
        // errors handled in individual fetchers
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, []);

  return (
    <AppContext.Provider
      value={{
        Universities,
        allOrder,
        allUsers,
        vendors,
        riders,
        setUniversities,
        isLoading,
        ordersLoading,
        fetchOrders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context easily
export const useAppContext = () => useContext(AppContext);

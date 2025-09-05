import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchWishlist } from '../services/wishlistService';

// Wishlist context for global state management
const WishlistContext = createContext();

// Action types
const WISHLIST_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_WISHLIST: 'SET_WISHLIST',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  CLEAR_WISHLIST: 'CLEAR_WISHLIST',
  SET_WISHLIST_COUNT: 'SET_WISHLIST_COUNT'
};

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
  count: 0,
  lastUpdated: null
};

// Reducer function
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case WISHLIST_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case WISHLIST_ACTIONS.SET_WISHLIST:
      return { 
        ...state, 
        items: action.payload, 
        count: action.payload.length,
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString()
      };
    
    case WISHLIST_ACTIONS.ADD_ITEM:
      const newItems = [...state.items, action.payload];
      return { 
        ...state, 
        items: newItems, 
        count: newItems.length,
        lastUpdated: new Date().toISOString()
      };
    
    case WISHLIST_ACTIONS.REMOVE_ITEM:
      const filteredItems = state.items.filter(item => item.itineraryId !== action.payload);
      return { 
        ...state, 
        items: filteredItems, 
        count: filteredItems.length,
        lastUpdated: new Date().toISOString()
      };
    
    case WISHLIST_ACTIONS.UPDATE_ITEM:
      const updatedItems = state.items.map(item => 
        item.itineraryId === action.payload.itineraryId 
          ? { ...item, ...action.payload.updates }
          : item
      );
      return { 
        ...state, 
        items: updatedItems,
        lastUpdated: new Date().toISOString()
      };
    
    case WISHLIST_ACTIONS.CLEAR_WISHLIST:
      return { 
        ...state, 
        items: [], 
        count: 0,
        lastUpdated: new Date().toISOString()
      };
    
    case WISHLIST_ACTIONS.SET_WISHLIST_COUNT:
      return { ...state, count: action.payload };
    
    default:
      return state;
  }
};

// Wishlist provider component
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Check if item is in wishlist
  const isInWishlist = (itineraryId) => {
    return state.items.some(item => item.itineraryId === itineraryId);
  };

  // Get wishlist item by ID
  const getWishlistItem = (itineraryId) => {
    return state.items.find(item => item.itineraryId === itineraryId);
  };

  // Fetch wishlist from API
  const fetchWishlistData = async () => {
    try {
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: true });
      const data = await fetchWishlist();
      dispatch({ type: WISHLIST_ACTIONS.SET_WISHLIST, payload: data });
    } catch (error) {
      dispatch({ type: WISHLIST_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Add item to wishlist
  const addToWishlist = (item) => {
    dispatch({ type: WISHLIST_ACTIONS.ADD_ITEM, payload: item });
  };

  // Remove item from wishlist
  const removeFromWishlist = (itineraryId) => {
    dispatch({ type: WISHLIST_ACTIONS.REMOVE_ITEM, payload: itineraryId });
  };

  // Update wishlist item
  const updateWishlistItem = (itineraryId, updates) => {
    dispatch({ 
      type: WISHLIST_ACTIONS.UPDATE_ITEM, 
      payload: { itineraryId, updates } 
    });
  };

  // Clear wishlist
  const clearWishlist = () => {
    dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
  };

  // Filter wishlist items
  const filterWishlist = (filters) => {
    let filtered = [...state.items];

    if (filters.airline) {
      filtered = filtered.filter(item => 
        item.itineraryData?.airline?.toLowerCase().includes(filters.airline.toLowerCase())
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(item => {
        const price = item.itineraryData?.price || 0;
        return price >= min && (max ? price <= max : true);
      });
    }

    if (filters.route) {
      filtered = filtered.filter(item => {
        const route = `${item.itineraryData?.from}${item.itineraryData?.to}`.toLowerCase();
        return route.includes(filters.route.toLowerCase());
      });
    }

    if (filters.priority) {
      filtered = filtered.filter(item => item.priority === filters.priority);
    }

    return filtered;
  };

  // Sort wishlist items
  const sortWishlist = (items, sortBy, sortOrder) => {
    const sorted = [...items];
    
    sorted.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'price':
          aValue = a.itineraryData?.price || 0;
          bValue = b.itineraryData?.price || 0;
          break;
        case 'duration':
          aValue = a.itineraryData?.durationInMinutes || 0;
          bValue = b.itineraryData?.durationInMinutes || 0;
          break;
        case 'airline':
          aValue = a.itineraryData?.airline || '';
          bValue = b.itineraryData?.airline || '';
          break;
        case 'addedAt':
        default:
          aValue = new Date(a.addedAt || 0);
          bValue = new Date(b.addedAt || 0);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  };

  // Context value
  const value = {
    ...state,
    isInWishlist,
    getWishlistItem,
    fetchWishlistData,
    addToWishlist,
    removeFromWishlist,
    updateWishlistItem,
    clearWishlist,
    filterWishlist,
    sortWishlist
  };

  // Fetch wishlist on mount if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchWishlistData();
    }
  }, []);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;


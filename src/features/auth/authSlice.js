import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiUrl } from '../../config/hosting';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Attempting login with:', credentials);
      
      const response = await fetch(getApiUrl('auth') + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Include cookies if needed
        body: JSON.stringify(credentials),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }

      // Handle different response structures
      let userData, token;
      
      if (data.token && data.user) {
        // Expected structure: { token, user }
        userData = data.user;
        token = data.token;
      } else if (data.token && data.message) {
        // Structure from curl test: { message, token, ... }
        // We need to extract user info from the token or create a user object
        token = data.token;
        // Try to decode JWT token to get user info, or create a basic user object
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userData = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
            name: payload.name || payload.email.split('@')[0], // Fallback name
            promotions_opt_in: payload.promotions_opt_in || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        } catch (error) {
          console.error('Error decoding token:', error);
          return rejectWithValue('Invalid token format');
        }
      } else {
        console.error('Unexpected response structure:', data);
        return rejectWithValue('Invalid response from server');
      }

      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      return { token, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return rejectWithValue('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Attempting registration with:', userData);
      
      const response = await fetch(getApiUrl('auth') + '/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      console.log('Registration response status:', response.status);
      const data = await response.json();
      console.log('Registration response data:', data);

      if (!response.ok) {
        return rejectWithValue(data.message || 'Registration failed');
      }

      // Handle different response structures
      let userInfo, token;
      
      if (data.token && data.user) {
        // Expected structure: { token, user }
        userInfo = data.user;
        token = data.token;
      } else if (data.user && data.message) {
        // Structure from our test: { message, user }
        // Registration successful but no token - user needs to login
        userInfo = data.user;
        // Don't set token since registration doesn't automatically log in
        return { user: userInfo, registrationSuccess: true };
      } else if (data.token && data.message) {
        // Structure from curl test: { message, token, ... }
        token = data.token;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userInfo = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
            name: payload.name || payload.email.split('@')[0],
            promotions_opt_in: payload.promotions_opt_in || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        } catch (error) {
          console.error('Error decoding token:', error);
          return rejectWithValue('Invalid token format');
        }
      } else {
        console.error('Unexpected registration response structure:', data);
        return rejectWithValue('Invalid response from server');
      }

      // Store token in localStorage if available
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
      }

      return { token, user: userInfo };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return rejectWithValue('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Registration
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // Check if this was a successful registration without automatic login
        if (action.payload.registrationSuccess) {
          // Don't set authentication state, just clear loading
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        } else {
          // Normal registration with automatic login
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer; 
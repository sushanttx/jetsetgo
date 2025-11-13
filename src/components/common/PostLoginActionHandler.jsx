// src/components/common/PostLoginActionHandler.jsx
// Handles post-login actions like wishlist and booking

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPostLoginAction } from '../../utils/authUtils';
import { addToWishlist, removeFromWishlist } from '../../services/wishlistService';

const PostLoginActionHandler = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only execute if user is authenticated
    if (!isAuthenticated) return;

    const executePostLoginAction = async () => {
      const actionData = getPostLoginAction();
      if (!actionData) return;

      console.log('Executing post-login action:', actionData);

      try {
        switch (actionData.action) {
          case 'wishlist':
            // Add to wishlist
            if (actionData.flightData) {
              const result = await addToWishlist(actionData.flightId, actionData.flightData);
              if (result.success) {
                console.log('Successfully added to wishlist after login');
                // Show success message or update UI
              }
            } else {
              // This was a remove action, but we don't have the flight data
              // Just show a message that they can now manage their wishlist
              console.log('User can now manage wishlist');
            }
            break;

          case 'booking':
            // Navigate to booking page
            navigate(`/flight/booking/${actionData.flightId}`);
            break;

          default:
            console.warn('Unknown post-login action:', actionData.action);
        }
      } catch (error) {
        console.error('Error executing post-login action:', error);
        // Show error message to user
      }
    };

    // Execute action after a short delay to ensure auth state is fully updated
    const timer = setTimeout(executePostLoginAction, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  // This component doesn't render anything
  return null;
};

export default PostLoginActionHandler;

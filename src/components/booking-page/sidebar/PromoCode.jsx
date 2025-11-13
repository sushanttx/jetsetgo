import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getPromotionsStatus, updatePromotionsStatus } from '../../../services/promotionsService';

const PromoCode = () => {
  const [promoCode, setPromoCode] = useState('');
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promotionsLoading, setPromotionsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Fetch promotions status when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchPromotionsStatus();
    } else {
      setPromotionsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchPromotionsStatus = async () => {
    try {
      setPromotionsLoading(true);
      const response = await getPromotionsStatus();
      setIsOptedIn(response.data?.isOptedIn || false);
    } catch (error) {
      console.error('Error fetching promotions status:', error);
      setIsOptedIn(false);
    } finally {
      setPromotionsLoading(false);
    }
  };

  const handlePromotionsToggle = async () => {
    if (!isAuthenticated) {
      alert('Please log in to manage your promotions preferences');
      return;
    }

    try {
      setLoading(true);
      const newStatus = !isOptedIn;
      await updatePromotionsStatus(newStatus);
      setIsOptedIn(newStatus);
    } catch (error) {
      console.error('Error updating promotions status:', error);
      alert('Failed to update promotions preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromoCodeSubmit = () => {
    // Handle promo code submission
    console.log('Promo code submitted:', promoCode);
  };

  return (
    <div className="px-30 py-30 border-light rounded-4 mt-30">
      <div className="text-20 fw-500 mb-15">Do you have a promo code?</div>
      <div className="form-input ">
        <input 
          type="text" 
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter promo code"
        />
        <label className="lh-1 text-16 text-light-1">Enter promo code</label>
      </div>
      <button 
        className="button -outline-blue-1 text-blue-1 px-30 py-15 mt-20"
        onClick={handlePromoCodeSubmit}
      >
        Apply
      </button>

      {/* Promotions Opt-in Section */}
      <div className="mt-30 pt-20 border-top">
        <div className="d-flex items-center justify-between">
          <div className="flex-1">
            <div className="text-16 fw-500 mb-5">Get access to members-only deals</div>
            <div className="text-14 text-light-1">
              Just like the millions of other email subscribers
            </div>
          </div>
          <div className="ml-20">
            {promotionsLoading ? (
              <div className="spinner-border spinner-border-sm text-blue-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <button
                className={`button ${isOptedIn ? '-blue-1' : '-outline-blue-1'} text-${isOptedIn ? 'white' : 'blue-1'} px-20 py-10`}
                onClick={handlePromotionsToggle}
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : isOptedIn ? (
                  <>
                    <i className="icon-check mr-5"></i>
                    Opted In
                  </>
                ) : (
                  'Opt In'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCode;

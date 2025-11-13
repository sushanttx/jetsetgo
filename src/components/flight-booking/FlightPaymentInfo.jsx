import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PricingSummary from "../booking-page/sidebar/PricingSummary";
import { getPromotionsStatus, updatePromotionsStatus } from '../../services/promotionsService';

const FlightPaymentInfo = ({ 
  personalDetails, 
  paymentDetails, 
  setPaymentDetails, 
  bookingStatus, 
  onBookingSubmit,
  onTestValidation,
  flight,
  searchData,
  onNextStep,
  onPreviousStep,
  currentStep,
  totalSteps
}) => {
  const [itemsTabs, setItemsTabs] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promotionsLoading, setPromotionsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const cardTabs = [
    { id: "HOLD", title: "Hold Booking" },
    { id: "CC", title: "Credit Card" },
    // { id: "CK", title: "Check" }
  ];

  const handleFieldChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentTypeChange = (paymentType) => {
    setPaymentDetails(prev => ({
      ...prev,
      paymentType: paymentType
    }));
  };

  const fetchPromotionsStatus = async () => {
    if (!isAuthenticated) {
      setPromotionsLoading(false);
      return;
    }

    try {
      setPromotionsLoading(true);
      const response = await getPromotionsStatus();
      if (response && response.success) {
        setIsOptedIn(response.data.isOptedIn);
      }
    } catch (error) {
      console.error('Error fetching promotions status:', error);
    } finally {
      setPromotionsLoading(false);
    }
  };

  const handlePromotionsToggle = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await updatePromotionsStatus(!isOptedIn);
      if (response && response.success) {
        setIsOptedIn(!isOptedIn);
      }
    } catch (error) {
      console.error('Error updating promotions status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotionsStatus();
  }, [isAuthenticated]);

  const handlePromoCodeSubmit = () => {
    console.log('Promo code submitted:', promoCode);
  };

  return (
    <>
      <div className="col-xl-7 col-lg-8">
        <div className="mt-40">
          <h3 className="text-22 fw-500 mb-20">How do you want to pay?</h3>
          <Tabs>
            <TabList className="row y-gap-20 x-gap-20">
              {cardTabs.map((item) => (
                <Tab
                  className="col-auto"
                  onClick={() => handlePaymentTypeChange(item.id)}
                  key={item.id}
                >
                  <button className={`button py-15 px-24 rounded-8 text-15 fw-500 ${
                    paymentDetails.paymentType === item.id 
                      ? 'bg-blue-1 text-white' 
                      : 'bg-light-2 text-dark-1'
                  }`}>
                    {item.title}
                  </button>
                </Tab>
              ))}
            </TabList>

            <TabPanel>
              <div className="row x-gap-20 y-gap-20 pt-20">
                <div className="col-12">
                  <div className="bg-gradient-to-r from-blue-1 to-blue-2 rounded-4 p-40 h-full d-flex flex-column justify-center text-center text-white">
                    <div className="mb-20">
                      <i className="icon-calendar text-50 mb-20"></i>
                    </div>
                    <h4 className="text-20 fw-600 mb-20">Hold Payment</h4>
                    <p className="text-15 mb-20">
                      Your booking will be held for the specified period. Payment will be processed at a later date.
                    </p>
                    {/* <div className="d-flex items-center justify-center">
                      <i className="icon-clock text-20 mr-10"></i>
                      <span className="text-14 fw-500">Flexible & Convenient</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="credit-card-form-section">
                <div className="row x-gap-20 y-gap-20 pt-20">
                  <div className="col-12">
                    <div className="form-input credit-card-form">
                      <select 
                        required 
                        value={paymentDetails.cardType || ''}
                        onChange={(e) => handleFieldChange('cardType', e.target.value)}
                        placeholder=" "
                      >
                        <option value="Visa">Visa</option>
                        <option value="MasterCard">MasterCard</option>
                        <option value="American Express">American Express</option>
                        <option value="Discover">Discover</option>
                      </select>
                    <label className="lh-1 text-16 text-light-1">
                        Select card type <span style={{ color: 'red' }}>*</span>
                    </label>
                  </div>
                </div>

                  <div className="row x-gap-20 y-gap-20 pt-20">
                <div className="col-md-6">
                      <div className="form-input credit-card-form">
                        <input 
                          type="text" 
                          required 
                          value={paymentDetails.billingName || ''}
                          onChange={(e) => handleFieldChange('billingName', e.target.value)}
                          placeholder=" "
                        />
                    <label className="lh-1 text-16 text-light-1">
                      Card holder name <span style={{ color: 'red' }}>*</span>
                    </label>
                      </div>
                  </div>

                    <div className="col-md-6">
                      <div className="form-input credit-card-form card-number">
                        <input 
                          type="text" 
                          required 
                          value={paymentDetails.cardNumber || ''}
                          onChange={(e) => handleFieldChange('cardNumber', e.target.value)}
                          placeholder=" "
                        />
                    <label className="lh-1 text-16 text-light-1">
                          Credit card number <span style={{ color: 'red' }}>*</span>
                    </label>
                      </div>
                    </div>
                  </div>

                  <div className="row x-gap-20 y-gap-20 pt-20">
                    <div className="col-md-6">
                      <div className="form-input credit-card-form card-number">
                        <input 
                          type="text" 
                          required 
                          value={paymentDetails.expiryDate || ''}
                          onChange={(e) => handleFieldChange('expiryDate', e.target.value)}
                          placeholder=" "
                        />
                        <label className="lh-1 text-16 text-light-1">
                          Expiry date <span style={{ color: 'red' }}>*</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-input credit-card-form card-number">
                        <input 
                          type="text" 
                          required 
                          value={paymentDetails.cvv || ''}
                          onChange={(e) => handleFieldChange('cvv', e.target.value)}
                          placeholder=" "
                        />
                        <label className="lh-1 text-16 text-light-1">
                          CVC/CVV <span style={{ color: 'red' }}>*</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mt-40">
                    <div className="d-flex items-center mb-20">
                      <i className="icon-location text-20 text-blue-1 mr-10"></i>
                      <h4 className="text-18 fw-500">Billing Address</h4>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-input credit-card-form">
                      <input 
                        type="text" 
                        required 
                        value={paymentDetails.billingName || ''}
                        onChange={(e) => handleFieldChange('billingName', e.target.value)}
                        placeholder=" "
                      />
                      <label className="lh-1 text-16 text-light-1">
                        Full Name <span style={{ color: 'red' }}>*</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-input credit-card-form">
                      <input 
                        type="text" 
                        required 
                        value={paymentDetails.billingAddress1 || ''}
                        onChange={(e) => handleFieldChange('billingAddress1', e.target.value)}
                        placeholder=" "
                      />
                      <label className="lh-1 text-16 text-light-1">
                        Address Line 1 <span style={{ color: 'red' }}>*</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-input credit-card-form">
                      <input 
                        type="text" 
                        value={paymentDetails.billingAddress2 || ''}
                        onChange={(e) => handleFieldChange('billingAddress2', e.target.value)}
                        placeholder=" "
                      />
                      <label className="lh-1 text-16 text-light-1">
                        Address Line 2
                      </label>
                    </div>
                </div>
                  
                <div className="col-md-6">
                    <div className="form-input credit-card-form">
                      <input 
                        type="text" 
                        required 
                        value={paymentDetails.billingCountry || ''}
                        onChange={(e) => handleFieldChange('billingCountry', e.target.value)}
                        placeholder=" "
                      />
                      <label className="lh-1 text-16 text-light-1">
                        Country <span style={{ color: 'red' }}>*</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-input credit-card-form">
                      <input 
                        type="text" 
                        required 
                        value={paymentDetails.billingCity || ''}
                        onChange={(e) => handleFieldChange('billingCity', e.target.value)}
                        placeholder=" "
                      />
                      <label className="lh-1 text-16 text-light-1">
                        City <span style={{ color: 'red' }}>*</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-input credit-card-form">
                      <input 
                        type="text" 
                        required 
                        value={paymentDetails.billingState || ''}
                        onChange={(e) => handleFieldChange('billingState', e.target.value)}
                        placeholder=" "
                      />
                      <label className="lh-1 text-16 text-light-1">
                        State/Province <span style={{ color: 'red' }}>*</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-input credit-card-form">
                      <input 
                        type="text" 
                        required 
                        value={paymentDetails.billingZipCode || ''}
                        onChange={(e) => handleFieldChange('billingZipCode', e.target.value)}
                        placeholder=" "
                      />
                      <label className="lh-1 text-16 text-light-1">
                        ZIP/Postal Code <span style={{ color: 'red' }}>*</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="row x-gap-20 y-gap-20 pt-20">
                <div className="d-flex items-center mb-20">
                  <i className="icon-location text-20 text-blue-1 mr-10"></i>
                  <h4 className="text-18 fw-500">Billing Address</h4>
                </div>
                
                <div className="col-md-6">
                  <div className="form-input ">
                    <input 
                      type="text" 
                      required 
                      value={paymentDetails.billingName || ''}
                      onChange={(e) => handleFieldChange('billingName', e.target.value)}
                      placeholder=" "
                    />
                    <label className="lh-1 text-16 text-light-1">
                      Name <span style={{ color: 'red' }}>*</span>
                    </label>
                  </div>
                </div>
                
                    <div className="col-md-6">
                      <div className="form-input ">
                    <input 
                      type="text" 
                      required 
                      value={paymentDetails.billingAddress1 || ''}
                      onChange={(e) => handleFieldChange('billingAddress1', e.target.value)}
                      placeholder=" "
                    />
                        <label className="lh-1 text-16 text-light-1">
                      Address1 <span style={{ color: 'red' }}>*</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-input ">
                    <input 
                      type="text" 
                      required 
                      value={paymentDetails.billingCity || ''}
                      onChange={(e) => handleFieldChange('billingCity', e.target.value)}
                      placeholder=" "
                    />
                        <label className="lh-1 text-16 text-light-1">
                      City <span style={{ color: 'red' }}>*</span>
                        </label>
                      </div>
                    </div>
                
                <div className="col-md-6">
                  <div className="form-input ">
                    <input 
                      type="text" 
                      required 
                      value={paymentDetails.billingCountry || ''}
                      onChange={(e) => handleFieldChange('billingCountry', e.target.value)}
                      placeholder=" "
                    />
                    <label className="lh-1 text-16 text-light-1">
                      Country <span style={{ color: 'red' }}>*</span>
                    </label>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-input ">
                    <input 
                      type="text" 
                      required 
                      value={paymentDetails.billingState || ''}
                      onChange={(e) => handleFieldChange('billingState', e.target.value)}
                      placeholder=" "
                    />
                    <label className="lh-1 text-16 text-light-1">
                      State <span style={{ color: 'red' }}>*</span>
                    </label>
                </div>
              </div>

                <div className="col-md-6">
                  <div className="form-input ">
                    <input 
                      type="text" 
                      required 
                      value={paymentDetails.billingZipCode || ''}
                      onChange={(e) => handleFieldChange('billingZipCode', e.target.value)}
                      placeholder=" "
                    />
                    <label className="lh-1 text-16 text-light-1">
                      ZipCode <span style={{ color: 'red' }}>*</span>
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-4 p-40 h-full d-flex flex-column justify-center text-center text-white">
                    <div className="mb-20">
                      <i className="icon-document text-50 mb-20"></i>
                    </div>
                    <h4 className="text-20 fw-600 mb-20">Check Payment</h4>
                    <p className="text-15 mb-20">
                      Payment will be processed via check. Please ensure all banking information is accurate.
                    </p>
                    <div className="d-flex items-center justify-center">
                      <i className="icon-document text-20 mr-10"></i>
                      <span className="text-14 fw-500">Traditional & Reliable</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>

        <div className="row x-gap-20 y-gap-20 pt-20">
          <div className="col-auto">
            <button
              className="button h-60 px-24 -dark-1 bg-blue-1 text-white"
              onClick={onBookingSubmit}
              disabled={bookingStatus.isValidating || bookingStatus.isLoading}
              type="button"
            >
              {bookingStatus.isValidating || bookingStatus.isLoading ? (
                <>
                  <div className="spinner-border spinner-border-sm mr-10" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  Processing...
                </>
              ) : (
                <>
                  Confirm Payment <div className="icon-arrow-top-right ml-15" />
                </>
              )}
            </button>
          </div>

          <div className="col-auto">
            {/* Test Validation Button - Commented Out */}
            {/* <button
              className="button h-60 px-24 -blue-1 bg-light-2"
              onClick={onTestValidation}
              disabled={bookingStatus.isValidating || bookingStatus.isLoading}
              type="button"
            >
              {bookingStatus.isValidating || bookingStatus.isLoading ? (
                <>
                  <div className="spinner-border spinner-border-sm mr-10" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  {bookingStatus.isValidating ? 'Validating...' : 'Processing...'}
                </>
              ) : (
                'Test Validation'
              )}
            </button> */}
          </div>
        </div>

        <div className="w-full h-1 bg-border mt-40 mb-40" />

        {bookingStatus.error && (
          <div className="alert alert-danger mb-20" style={{ 
            backgroundColor: '#f8d7da', 
            borderColor: '#f5c6cb', 
            color: '#721c24',
            padding: '12px 20px',
            borderRadius: '4px',
            border: '1px solid'
          }}>
            <strong>Booking Error:</strong> {bookingStatus.error}
              </div>
        )}

        {bookingStatus.success && bookingStatus.bookingResult && (
          <div className="alert alert-success mb-20" style={{ 
            backgroundColor: '#d4edda', 
            borderColor: '#c3e6cb', 
            color: '#155724',
            padding: '12px 20px',
            borderRadius: '4px',
            border: '1px solid'
          }}>
            <strong>Success!</strong> {bookingStatus.bookingResult.message}
            {bookingStatus.bookingResult.testMode && (
              <div className="mt-10">
                <small><em>This was a test validation - no actual booking was placed.</em></small>
              </div>
            )}
            </div>
        )}

      </div>

      <div className="col-xl-5 col-lg-4">
        <div className="booking-sidebar">
          <PricingSummary paymentType={paymentDetails.paymentType} flight={flight} searchData={searchData} />
        </div>
      </div>
    </>
  );
};

export default FlightPaymentInfo; 

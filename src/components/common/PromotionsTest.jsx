import { useState } from 'react';
import { useSelector } from 'react-redux';
import { updatePromotionsOptIn, getPromotionsStatus, togglePromotionsStatus } from '../../services/promotionsService';

const PromotionsTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const testUpdatePromotions = async () => {
    setLoading(true);
    setTestResult('Testing promotions update...');
    
    try {
      const result = await updatePromotionsOptIn(true);
      setTestResult(`
        ✅ Promotions update successful!
        
        Result: ${JSON.stringify(result, null, 2)}
      `);
    } catch (error) {
      setTestResult(`
        ❌ Promotions update failed!
        
        Error: ${error.message}
      `);
    } finally {
      setLoading(false);
    }
  };

  const testGetPromotionsStatus = async () => {
    setLoading(true);
    setTestResult('Testing get promotions status...');
    
    try {
      const result = await getPromotionsStatus();
      setTestResult(`
        ✅ Get promotions status successful!
        
        Result: ${JSON.stringify(result, null, 2)}
      `);
    } catch (error) {
      setTestResult(`
        ❌ Get promotions status failed!
        
        Error: ${error.message}
      `);
    } finally {
      setLoading(false);
    }
  };

  const testTogglePromotions = async () => {
    setLoading(true);
    setTestResult('Testing toggle promotions...');
    
    try {
      const result = await togglePromotionsStatus();
      setTestResult(`
        ✅ Toggle promotions successful!
        
        Result: ${JSON.stringify(result, null, 2)}
      `);
    } catch (error) {
      setTestResult(`
        ❌ Toggle promotions failed!
        
        Error: ${error.message}
      `);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="py-30 px-30 rounded-4 bg-white shadow-3">
        <h3 className="text-18 lh-1 fw-500 mb-20">Promotions API Test</h3>
        <p className="text-14 text-light-1">Please log in to test promotions API</p>
      </div>
    );
  }

  return (
    <div className="py-30 px-30 rounded-4 bg-white shadow-3">
      <h3 className="text-18 lh-1 fw-500 mb-20">Promotions API Test</h3>
      
      <div className="mb-20">
        <p className="text-14 text-light-1 mb-10">
          <strong>Current User:</strong> {user.name} ({user.email})
        </p>
        <p className="text-14 text-light-1 mb-10">
          <strong>Promotions Opt-in:</strong> {user.promotions_opt_in ? 'Yes' : 'No'}
        </p>
      </div>
      
      <div className="row y-gap-10">
        <div className="col-12">
          <button 
            onClick={testUpdatePromotions}
            disabled={loading}
            className="button py-15 px-30 -blue-1 bg-blue-1 text-white mr-10"
          >
            {loading ? 'Testing...' : 'Test Update Promotions'}
          </button>
        </div>
        
        <div className="col-12">
          <button 
            onClick={testGetPromotionsStatus}
            disabled={loading}
            className="button py-15 px-30 -green-1 bg-green-1 text-white mr-10"
          >
            {loading ? 'Testing...' : 'Test Get Status'}
          </button>
        </div>
        
        <div className="col-12">
          <button 
            onClick={testTogglePromotions}
            disabled={loading}
            className="button py-15 px-30 -orange-1 bg-orange-1 text-white mr-10"
          >
            {loading ? 'Testing...' : 'Test Toggle'}
          </button>
        </div>
      </div>
      
      {testResult && (
        <div className="mt-20">
          <h4 className="text-16 fw-500 mb-10">Test Result:</h4>
          <pre className="bg-light-2 p-15 rounded-4 text-12" style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PromotionsTest;

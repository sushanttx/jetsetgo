import { useState } from 'react';
import { getApiUrl } from '../../config/hosting';

const TestConnection = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');
    
    try {
      const response = await fetch(getApiUrl('auth') + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'admin'
        }),
      });

      const data = await response.json();
      
      setTestResult(`
        ✅ Connection successful!
        
        Status: ${response.status}
        Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}
        Data: ${JSON.stringify(data, null, 2)}
      `);
    } catch (error) {
      setTestResult(`
        ❌ Connection failed!
        
        Error: ${error.message}
        Type: ${error.name}
        Stack: ${error.stack}
      `);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-30 px-30 rounded-4 bg-white shadow-3">
      <h3 className="text-18 lh-1 fw-500 mb-20">Backend Connection Test</h3>
      
      <button 
        onClick={testBackendConnection}
        disabled={loading}
        className="button py-15 px-30 -blue-1 bg-blue-1 text-white"
      >
        {loading ? 'Testing...' : 'Test Backend Connection'}
      </button>
      
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

export default TestConnection; 
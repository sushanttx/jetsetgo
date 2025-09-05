import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { loginUser, clearError } from "../../features/auth/authSlice";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname || "/";
      
      // Redirect based on user role
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  // Clear error when component unmounts or error changes
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
      // Navigation will be handled by useEffect
    } catch (error) {
      // Error is already handled by Redux
      console.error('Login failed:', error);
    }
  };

  return (
    <form className="row y-gap-20" onSubmit={handleSubmit}>
      <div className="col-12">
        <h1 className="text-22 fw-500">Welcome back</h1>
        <p className="mt-10">
          Don&apos;t have an account yet?{" "}
          <Link to="/signup" className="text-blue-1">
            Sign up for free
          </Link>
        </p>
      </div>
      {/* End .col */}

      {error && (
        <div className="col-12">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      )}

      <div className="col-12">
        <div className="form-input">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={errors.email ? "error" : ""}
          />
          <label className="lh-1 text-14 text-light-1">Email</label>
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="form-input">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={errors.password ? "error" : ""}
          />
          <label className="lh-1 text-14 text-light-1">Password</label>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <a href="#" className="text-14 fw-500 text-blue-1 underline">
          Forgot your password?
        </a>
      </div>
      {/* End .col */}

      <div className="col-12">
        <button
          type="submit"
          className="button py-20 -dark-1 bg-blue-1 text-white w-100"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"} 
          <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
      {/* End .col */}
    </form>
  );
};

export default LoginForm;

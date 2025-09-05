import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { registerUser, clearError } from "../../features/auth/authSlice";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptEmails: false,
    promotions_opt_in: false,
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/dashboard/db-dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Clear error when component unmounts or error changes
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    console.log('Form data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed, dispatching registerUser');

    try {
      // Prepare data for backend
      const registrationData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: "user", // Default role for new registrations
        promotions_opt_in: formData.promotions_opt_in
      };

      console.log('Registration data being sent:', registrationData);

      const result = await dispatch(registerUser(registrationData)).unwrap();
      console.log('Registration successful:', result);
      
      // Check if registration succeeded but no automatic login
      if (result.registrationSuccess) {
        // Registration successful but user needs to login
        alert('Registration successful! Please login with your new account.');
        navigate('/login');
      } else {
        // Registration successful and user is automatically logged in
        // Navigation will be handled by useEffect
      }
    } catch (error) {
      // Error is already handled by Redux
      console.error('Registration failed:', error);
    }
  };

  return (
    <form className="row y-gap-20" onSubmit={handleSubmit}>
      <div className="col-12">
        <h1 className="text-22 fw-500">Create Account</h1>
        <p className="mt-10">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-1">
            Log in
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
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className={errors.firstName ? "error" : ""}
          />
          <label className="lh-1 text-14 text-light-1">First Name</label>
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="form-input">
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className={errors.lastName ? "error" : ""}
          />
          <label className="lh-1 text-14 text-light-1">Last Name</label>
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>
      </div>
      {/* End .col */}

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
        <div className="form-input">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={errors.confirmPassword ? "error" : ""}
          />
          <label className="lh-1 text-14 text-light-1">Confirm Password</label>
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="d-flex">
          <div className="form-checkbox mt-5">
            <input
              type="checkbox"
              name="promotions_opt_in"
              checked={formData.promotions_opt_in}
              onChange={handleChange}
              className={errors.promotions_opt_in ? "error" : ""}
            />
            <div className="form-checkbox__mark">
              <div className="form-checkbox__icon icon-check" />
            </div>
          </div>
          <div className="text-15 lh-15 text-light-1 ml-10">
            Email me exclusive promotions. I can opt out later as stated
            in the Privacy Policy.
            {errors.promotions_opt_in && <span className="error-text d-block mt-5">{errors.promotions_opt_in}</span>}
          </div>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <button
          type="submit"
          className="button py-20 -dark-1 bg-blue-1 text-white w-100"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"} 
          <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
      {/* End .col */}
    </form>
  );
};

export default SignUpForm;

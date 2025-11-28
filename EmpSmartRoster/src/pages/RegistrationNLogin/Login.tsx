import { useAuth } from "../../AuthContext.js";
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton.js";
import SecondaryButton from "../../components/SecondaryButton/SecondaryButton.js";
import LoginController from '../../controller/User/LoginController.js';
import "./style.css";
import "../../../public/styles/common.css";

// Access the function from the default export within ValidationController
const { ValidateLoginValues, SubmitLogin } = LoginController;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate(); 
  const [values, setValues] = useState({
    email: '',
    password:''
  })
  const [ errors, setErrors ] = useState<{ email?: string; password?: string }>({})

  // Set inputs values
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = ValidateLoginValues(values);
    setErrors(validationErrors);
    // console.log("Login values: ", values);
    
    //if(Object.values(validationErrors).every(error => error === "")) {
    if(true) {
      try{
          const data = await SubmitLogin(values);
          // console.log("Response: \n", data);
          if (data.responseCode === 200) {
            // console.log('Login successful:', data);
            login(data);
            if (data.role === "System Admin") {
              
              navigate('/admin-dashboard');
            }
            else if (data.role === "Business Owner") {
              if(data.isSubsExp === 1) // Subscription plan is expired
                navigate('/subscription-management')
              else
                navigate('/business-dashboard');
            }
            else if (data.role === "Employee") {
              navigate('/my-schedule');
            } 
        } else {
            throw new Error('Login failed');
        }
      } catch (err) {
        console.error("Error during login:", err); 
      // Handle non-Axios errors
      alert("Invalid Login. Please try again.");
      }
    }
  }

  function triggerRegister () {
    navigate('/register');
  }

  function triggerForgotPassword () {
    navigate('/reset-pw');
  }

  return (
    <div className="App-form-content">
      <Header />

      <form action='' onSubmit={handleLogin}>
        {/* Email */}
        <div className="forms-input">
          <strong>
            Email <span style={{ color: 'red' }}>*</span>
          </strong>
          <div className="fields">
            <input type='email' 
              name='email'
              value={values.email}
              placeholder='Enter Email' 
              onChange={handleInput}
            />
            {errors.email && <span className='error-message'>
              {errors.email}
            </span>}
          </div>
        </div>

        {/* Password */}
        <div className="forms-input">
          <strong>
            Password <span style={{ color: 'red' }}>*</span>
          </strong>
          <div className="fields">
            <input type='password' 
                name='password'
                placeholder='Enter Password' 
                onChange={handleInput}
            />
            {/* {errors.password && <span className='error-message'>
              {errors.password}
            </span>} */}
          </div>
          <div className="login-reset-pw">
            <span>Forgot password?</span>
            <SecondaryButton 
              text="Reset Password"
              onClick={triggerForgotPassword}
              type='button'
            />
          </div>
        </div>
        
        <div className="login-button-group">
            <PrimaryButton 
              text="Sign In"
              type='submit'
            />
            <div className="login-create-acc">
              <span>Do not have an account? </span>
              <SecondaryButton 
                text="Sign Up"
                onClick={triggerRegister}
                type='button'
              />
          </div>
        </div>
      </form>
    </div>
  );
}

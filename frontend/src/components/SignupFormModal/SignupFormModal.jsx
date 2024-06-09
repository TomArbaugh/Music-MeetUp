import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
            
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
    <h4 className='signup-margins-h4'>Please fill out all fields</h4>
    <h4 className='signup-margins-h4'>username must be 4 characters or more</h4>
    <h4 className='signup-margins-h4'>password must be 6 characters or more</h4>
      <h1 id="sign-up-title">Sign Up</h1>
      <form 
      id="signup-form"
      onSubmit={handleSubmit}>
        <label className='signup-margins'>
          Email
          </label>
          <input
           className='signup-margins'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        
        {errors.email && <p className='error-message'>{errors.email}</p>}
        <label className='signup-margins'>
          Username
          </label>
          <input
 className='signup-margins'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        
        {errors.username && <p className='error-message'>{errors.username}</p>}
        <label className='signup-margins'>
          First Name
          </label>
          <input
 className='signup-margins'
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
       
        {errors.firstName && <p className='error-message'>{errors.firstName}</p>}
        <label className='signup-margins'>
          Last Name
          </label>
          <input
 className='signup-margins'
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
       
        {errors.lastName && <p className='error-message'>{errors.lastName}</p>}
        <label className='signup-margins'>
          Password
          </label>
          <input
 className='signup-margins'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
       
        {errors.password && <p className='error-message'>{errors.password}</p>}
        <label className='signup-margins'>
          Confirm Password
          </label>
          <input
 className='signup-margins'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
       
        {errors.confirmPassword && <p className='error-message'>{errors.confirmPassword}</p>}
        <button 
                disabled={
                  !password || !confirmPassword || !lastName || !firstName || !username
                  || username.length < 4 || password.length < 6
                }
        type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;

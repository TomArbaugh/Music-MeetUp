import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();


  const demoLogIn = () => {
    setCredential('LittleWing');
    setPassword('34&sldkfKJ');
    return null;
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };


  return (
    <>
      <h4 className='login-add-padding'>user name must be 4 characters or more</h4>
      <h4 className='login-add-padding'>password must be 6 characters or more</h4>
      <h1 id="login-title">Log In</h1>
      <form 
      id="login-form"
      onSubmit={handleSubmit}>
        <label className='login-add-padding'>
          Username or Email
          </label>
          <input
 className='login-add-padding'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        
        <label className='login-add-padding'>
          Password
          </label>
          <input
 className='login-add-padding'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
       
        {errors.credential && <p className='error-message'>{errors.credential}</p>}
        <button 
         className='login-add-padding'
         id="log-in-button-one"
        type="submit"
        disabled={password.length < 6 || credential.length < 4}
        >
          Log In
          
        </button>

        <button
        id="log-in-button-two"
        className='login-add-padding'
        onClick={() => demoLogIn()}
        >
          Log in as Demo User
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;

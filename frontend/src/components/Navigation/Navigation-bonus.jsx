import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import { FaMeetup } from "react-icons/fa";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div id="navigation">
      <div id="logo-container">
        <NavLink id="logo" to="/"><FaMeetup id="M"/><h2 id="logo-text">usic MeetUp</h2></NavLink>
      </div>
      {isLoaded && (
        <div id="profile-button-container">
          {/* <Link 
          className='time-to-start-a-group'
          id={!sessionUser ? "hide" : "center-text"}
          onClick={((e) => !sessionUser ? e.preventDefault() : null)}
          to='/create-group'
          >Start a new Group</Link> */}
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Navigation;

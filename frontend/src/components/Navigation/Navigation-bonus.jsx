import { NavLink, Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import { FaMeetup } from "react-icons/fa";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
        <NavLink id="logo" to="/"><FaMeetup id="M"/>usic MeetUp</NavLink>
      </li>
      {isLoaded && (
        <li>
          <Link 
          className='time-to-start-a-group'
          id={!sessionUser ? "hide" : null}
          onClick={((e) => !sessionUser ? e.preventDefault() : null)}
          to='/create-group'
          >Start a new Group</Link>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { DemoUser } from './DemoUser';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu}>
      
        <i className="fas fa-user-circle" />
       
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello: {user.firstName}</li>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
            <li>
              <Link to='/group-list' >View Groups</Link>
            </li>
            <li>
            <Link to="/events-list">View Events</Link>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
               <OpenModalMenuItem
              itemText="Sign In As Demo User"
              onItemClick={closeMenu}
              modalComponent={<DemoUser />}
            />
            <li>
            <Link 
            onClick={closeMenu}
            to='/group-list' 
            >
              View Groups
              </Link>
            </li>
            <li>
              <Link
              onClick={closeMenu}
              to="/events-list"
              >
              View Events
              </Link>
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;

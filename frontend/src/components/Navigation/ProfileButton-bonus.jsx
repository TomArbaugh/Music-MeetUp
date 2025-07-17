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
      <button id="user-menu-button" onClick={toggleMenu}>
       User Menu
      
        
       
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <div className='user-info'>
            <div>Hello: {user.firstName}</div>
            <div>{user.username}</div>
            <div>{user.firstName} {user.lastName}</div>
            <div>{user.email}</div>
            <div>
              <button className='log-out-button' onClick={logout}>Log Out</button>
            </div>
            <div>
              {/* <Link 
              onClick={closeMenu}
              to='/group-list' >View Groups</Link>
            </div>
            <div>
            <Link 
            onClick={closeMenu}
            to="/events-list">View Events</Link> */}
            </div>
          </div>
        ) : (
          <div className='new-user-tools'>
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
            <div>
            <Link 
            className='new-user-links'
            onClick={closeMenu}
            to='/group-list' 
            >
              View Groups
              </Link>
            </div>
            <div>
              <Link
              className='new-user-links'
              onClick={closeMenu}
              to="/events-list"
              >
              View Events
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileButton;

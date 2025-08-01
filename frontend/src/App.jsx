import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation/Navigation-bonus';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';
import { LandingPage } from './components/LandingPage/LandingPage';
import { GroupList } from './components/GroupList/GroupList';
import { GroupDetails } from './components/GroupDetails/GroupDetails';
import { EventsList } from './components/EventsList/EventsList';
import { EventDetails } from './components/EventDetails/EventDetails';
import { CreateGroup } from './components/CreateGroup/CreateGroup';
import { CreateEvent } from './components/CreateEvent/CreateEvent';
import { UpdateGroup } from './components/UpdateGroup/UpdateGroup';
import '/App.css'


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Modal/>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/test',
        element: <h1>Test</h1>
      },
      {
        path: '/group-list',
        element: <GroupList />
      },
      {
        path: '/group/:groupId',
        element: <GroupDetails />
      },
      {
        path: '/events-list',
        element: <EventsList />
      },
      {
        path: '/events/:eventId',
        element: <EventDetails />
      },
      {
        path: '/create-group',
        element: <CreateGroup />
      },
      {
        path: '/create-event',
        element: <CreateEvent />
      },
      {
        path: '/update-group',
        element: <UpdateGroup />
      }
      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

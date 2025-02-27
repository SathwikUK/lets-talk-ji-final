import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Main from './pages/main/main';
import { Room } from './pages/room/room';
import Signin from './pages/sign-in/signin';
import { StreamCall } from '@stream-io/video-react-sdk';
import { useUser } from './user-context';
import Cookies from "universal-cookie";
import Logo from './Logo';
import { FiLogOut } from 'react-icons/fi';

const App = () => {
  const { user, call, setUser, setCall } = useUser();
  const cookies = new Cookies();

  // Check for authentication on component mount
  useEffect(() => {
    const token = cookies.get("token");
    const username = cookies.get("username");
    const name = cookies.get("name");
    
    // If no token, ensure user is set to null
    if (!token || !username || !name) {
      setUser(null);
      setCall(undefined);
    }
  }, [setUser, setCall]);

  const handleLogout = () => {
    cookies.remove("token");
    cookies.remove("name");
    cookies.remove("username");
    setUser(null);
    setCall(undefined);
  };

  return (
    <Router>
      <div className="app-container">
        <header>
          <Logo />
        </header>
        <main>
          <Routes>
            <Route path='/' element={user ? <Navigate to="/main" /> : <Signin />} />
            <Route path='/main' element={user ? <Main /> : <Navigate to="/" />} />
            <Route
              path="/room/:roomId"
              element={
                user && call ? (
                  <StreamCall call={call}>
                    <Room />
                  </StreamCall>
                ) : (
                  <Navigate to={user ? "/main" : "/"} />
                )
              }
            />
            {/* Add a catch-all route */}
            <Route path="*" element={<Navigate to={user ? "/main" : "/"} />} />
          </Routes>
        </main>
        
        {user && (
          <footer>
            <button className="logout-button" onClick={handleLogout}>
              <FiLogOut size={32} />
            </button>
          </footer>
        )}
      </div>
    </Router>
  );
};

export default App;
import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from 'react-router-dom';
import AnimalFeed from './AnimalFeed';
import Profile from './Profile';
import Login from './Login'
import FosterList from './FosterList';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [profileId, setProfileId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isTop, setIsTop] = useState(true);

  console.log(profileId)

    const handleLogin = async (username, password) => {
      const response = await fetch('http://127.0.0.1:5555/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              },
          body: JSON.stringify({ 
              'username': username,
              'password': password
          }),
    });


    if (response.ok) {
        const data = await response.json();
        setLoggedIn(true);
        console.log(data.id)
        setProfileId(data.id)
    } else {
        const errorData = await response.json().catch(() => null); 
        console.log('Error:', errorData);
    }
    };

    const handleLogout = async () => {
      const response = await fetch('http://127.0.0.1:5555/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        console.log('Logout failed');
      }
      setLoggedIn(false);
      setProfileId(null);
      setProfile(null);
    };

    console.log(profileId)
    console.log(profile)

    useEffect(() => {
      if (profileId) { 
        console.log('I am running')
        fetch(`http://127.0.0.1:5555/profiles/${profileId}`)
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          console.log(data)
        })
        .catch(error => console.error('Error:', error));
      }
    }, [profileId]);

    useEffect(() => {
      const checkScroll = () => {
        setIsTop(window.pageYOffset === 0);
      };
    
      window.addEventListener('scroll', checkScroll);
      return () => {
        window.removeEventListener('scroll', checkScroll);
      };
    }, []);



  return (
    <Router>
      {loggedIn && profile ?
      <div className="App" style={{ paddingTop:'150px' }}>
        <nav className='top-bar' style={{opacity: isTop ? 1 : 0.1}}>
          <div>
            <div className='links'>
              <Link className='link' style={{opacity: isTop ? 1 : 0.1, marginLeft: '10px'}} to="/">Adoptable Animals</Link>
              <Link className='link' style={{opacity: isTop ? 1 : 0.1}} to="/profile">My Profile</Link>
              <Link className='link' style={{opacity: isTop ? 1 : 0.1}} to="/foster">Foster</Link>
            </div>
          </div>
          <h1>Leash of Life</h1>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '10px' }}>
            <div className='logout'>
              <h4>Welcome, {profile.name}
                <button onClick={handleLogout}>Logout</button>
              </h4>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<AnimalFeed profile={profile}/>} />
          <Route path="/profile" element={<Profile profile={profile}/>} />
          <Route path="/foster" element={<FosterList profile={profile}/>} />
        </Routes>
      </div>
      :
      <Routes>
        <Route path='/' element={<Login handleLogin={handleLogin}/>}></Route>
      </Routes>
      }
    </Router>
  )
}

export default App;
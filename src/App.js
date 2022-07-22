import React, { useEffect, useState } from 'react';
import {signOut } from 'firebase/auth';
import { auth } from './config/Firebase';
import Home from './components/Home';
import { AuthContext } from './context/Auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) setUser(user);
      else setUser(null);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {loading && <h1>Loading</h1>}
      {!user && !loading && <Home />}
      {user && !loading && (
        <button onClick={() => signOut(auth).then(() => setUser(null))}>
          Logout
        </button>
      )}
    </AuthContext.Provider>
  );
}

export default App;

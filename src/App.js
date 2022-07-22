import React, { useEffect, useState } from 'react';
import { auth } from './config/Firebase';
import { AuthContext } from './context/Auth';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Loading from './animations/Loading';

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
      {loading && <Loading />}
      {!user && !loading && <Home />}
      {user && !loading && (
        <Navbar />
      )}
    </AuthContext.Provider>
  );
}

export default App;

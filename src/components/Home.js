import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Introduction from '../animations/Introduction';
import { auth } from '../config/Firebase';
import { useAuth } from '../context/Auth';
import {Container} from '@chakra-ui/react';

function Home() {
  const provider = new GoogleAuthProvider();
  const { user, setUser } = useAuth;

  function signIn() {
    signInWithPopup(auth, provider)
      .then(result => {
        setUser(result.user);
      })
      .catch(console.info);
  }

  return (
    <>
      <Introduction />
    </>
  );
}

export default Home;

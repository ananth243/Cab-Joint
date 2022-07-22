import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { motion } from 'framer-motion';
import { auth } from '../config/Firebase';
import { useAuth } from '../context/Auth';
import { Button, Container, Text } from '@chakra-ui/react';

function Home() {
  const provider = new GoogleAuthProvider();
  const { setUser } = useAuth;

  function signIn() {
    signInWithPopup(auth, provider)
      .then(result => {
        setUser(result.user);
      })
      .catch(console.info);
  }

  return (
    <motion.div
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        height: '100vh',
        backgroundColor: 'purple',
        color: 'white',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Container>
        <Text fontSize={'4xl'}>Welcome to Cab Joint.</Text>
        <Text fontSize={'xl'} marginTop={'4rem'}>
          <del>&#2352;</del>400. It takes minimum <del>&#2352;</del>400 (
          <del>&#2352;</del>300 if you're lucky) to hitch a ride from the
          AIrport in Goa to BITS and vice versa. You wanna save up? Just login
          enter your trip details and see whether you can cram yourself with
          10 other people in a car and break the world record.
        </Text>
        <Button
        marginTop={'2rem'}
          as={motion.button}
          initial={{ opacity: 0.7 }}
          whileHover={{
            scale: 1.1,
            opacity: 1,
            boxShadow: '0px 0px 8px rgb(255,255,255)',
          }}
          color={'black'}
          onClick={signIn}
        >
          Log in with BITS Email
        </Button>
      </Container>
    </motion.div>
  );
}

export default Home;

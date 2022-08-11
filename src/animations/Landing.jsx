import React from 'react';
import { Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';

function Landing() {
  return (
    <>
      <Image
        as={motion.img}
        initial={{ right: 0 }}
        animate={{ right: '50%' }}
        src={'/logo192.png'}
        position="absolute"
        top={0}
        width="15rem"
        height="15rem"
      />
    </>
  );
}

export default Landing;

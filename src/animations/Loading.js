import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Introduction() {
  const [rotate, setRotate] = useState(0);
  const [weird, setWeird] = useState('Loading . . .');
  useEffect(() => {
    setInterval(() => {
      setRotate(rotate => rotate + 1);
    }, 100);
    setTimeout(() => {
      setWeird("Weird that you're still watching this");
    }, 5000);
  }, []);

  return (
    <motion.div
      style={{
        backgroundColor: '#bf00ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/*<motion.div
        style={{
          width: '20rem',
          height: '20rem',
          display: 'flex',
          color: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0093E9',
          backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
          borderRadius: '50%',
        }}
        animate={{ rotate }}
      >
        {weird}
      </motion.div>*/}
    </motion.div>
  );
}

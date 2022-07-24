import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';

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
      <Spinner size="xl" color="white" />
    </motion.div>
  );
}

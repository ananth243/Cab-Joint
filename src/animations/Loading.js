import { motion } from 'framer-motion';
import { Spinner } from '@chakra-ui/react';

export default function Introduction() {
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

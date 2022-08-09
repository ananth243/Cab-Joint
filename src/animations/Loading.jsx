import { motion } from 'framer-motion';
import { Box, Spinner } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box
      as={motion.div}
      backgroundColor="light"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Spinner size="xl" color="white" />
    </Box>
  );
}

import { useToast } from '@chakra-ui/react';
import React from 'react';

function Alert(toast, title, description, status) {
  toast({
    title,
    description,
    status,
    duration: 5000,
    isClosable: true,
    position: 'bottom-left',
  });
}

export default Alert;

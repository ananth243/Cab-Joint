import React, { useState, useEffect } from 'react';
import { Avatar, Box, Center, Flex, Stack, Tag, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

function User({ station, mobile, date, name }) {
  return (
    <Flex
      as={motion.div}
      whileHover={{
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1),0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        zIndex: '-10',
      }}
      color="black"
      backgroundColor={'whitesmoke'}
      maxWidth="md"
      padding="2rem"
      borderRadius="xl"
      border="2rem"
      wrap="wrap"
    >
      <Box alignItems="center" width="30%">
        <Avatar name={name} />
        <Text>{name}</Text>
      </Box>
      <Box width="70%">
        <Text>{mobile}</Text>
        <Tag size="md" colorScheme="teal">
          {station}
        </Tag>
        <Text>{date.toDate().toDateString()}</Text>
        <Text>{date.toDate().toLocaleTimeString()}</Text>
      </Box>
    </Flex>
  );
}

export default User;

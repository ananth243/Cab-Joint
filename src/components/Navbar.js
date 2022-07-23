import React from 'react';
import { useAuth } from '../context/Auth';
import { signOut } from 'firebase/auth';
import Arrivals from './Arrivals';
import Departure from './Departure';
import { auth } from '../config/Firebase';
import {
  TabPanel,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Container,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

function Navbar() {
  const { user, setUser } = useAuth();
  console.log(user);
  return (
    <div
      style={{ backgroundColor: '#bf00ff', color: 'white', minHeight: '100vh' }}
    >
      <motion.div
        transition={{ type: 'spring' }}
        initial={{ opacity: 0 }}
        position={'relative'}
        animate={{ opacity: 1 }}
      >
        <Button
          as={motion.button}
          color="black"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: '1.2' }}
          position="absolute"
          right="5"
          top="1rem"
          onClick={() =>
            signOut(auth)
              .then(() => setUser(null))
              .catch(console.info)
          }
        >
          Logout
        </Button>
        <Container minWidth='80%' paddingTop={'1rem'}>
          <Tabs
            align="center"
            border={'white'}
            variant="soft-rounded"
            colorScheme={'telegram'}
          >
            <TabList>
              <Tab>Arrivals</Tab>
              <Tab>Departure</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Arrivals />
              </TabPanel>
              <TabPanel>
                <Departure />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </motion.div>
    </div>
  );
}

export default Navbar;

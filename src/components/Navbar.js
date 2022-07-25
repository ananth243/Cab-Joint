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
  Text,
  Container,
  Button,
  Avatar,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Help from './Help';

function Navbar() {
  const { user, setUser } = useAuth();
  return (
    <div
      style={{ backgroundColor: '#bf00ff', color: 'white', minHeight: '100vh' }}
    >
      <motion.div
        transition={{ type: 'spring' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Flex justifyContent="space-between" paddingTop="1rem">
          <Flex
            justifyContent="flex-start"
            marginLeft="2rem"
            width="15%"
            alignItems="center"
          >
            <Avatar src={user.photoURL} name={user.displayName} />
            <Text marginLeft="1rem" fontSize="2xl">
              {user.displayName}
            </Text>
          </Flex>
          <Button
            as={motion.button}
            color="black"
            marginRight="2rem"
            initial={{ opacity: 0.6 }}
            whileHover={{ opacity: 1, scale: '1.2' }}
            onClick={() =>
              signOut(auth)
                .then(() => setUser(null))
                .catch(console.info)
            }
          >
            Logout
          </Button>
        </Flex>
        <Container minWidth="80%" paddingTop={'1rem'}>
          <Tabs
            align="center"
            border={'white'}
            variant="soft-rounded"
            colorScheme={'telegram'}
          >
            <TabList>
              <Tab>Arrivals</Tab>
              <Tab>Departure</Tab>
              <Tab>Help</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Arrivals />
              </TabPanel>
              <TabPanel>
                <Departure />
              </TabPanel>
              <TabPanel>
              <Help />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </motion.div>
    </div>
  );
}

export default Navbar;

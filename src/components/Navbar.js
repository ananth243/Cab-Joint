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
  Button,
  Avatar,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Help from './Help';
// import { ColorModeSwitcher } from './ColorModeSwitcher';

function Navbar() {
  const { user, setUser } = useAuth();
  const stations = [
    'Airport',
    'Madgoan Bus Stop',
    'Madgoan Train Station',
    'Panjim Bus Stop',
    'Vasco Bus Stop',
    'Vasco Train Station',
  ];
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
          {/* <ColorModeSwitcher />*/}
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
        {/*<Container minWidth="80%" paddingTop={'1rem'}>*/}
        <Tabs
          align="center"
          border={'white'}
          marginTop="1rem"
          width="100%"
          variant="soft-rounded"
          colorScheme={'telegram'}
        >
          <TabList>
            <Tab color="white">Arrivals</Tab>
            <Tab color="white">Departure</Tab>
            <Tab color="white">Help</Tab>
          </TabList>
          <TabPanels width="100%">
            <TabPanel marginTop="2rem">
              <Arrivals stations={stations} />
            </TabPanel>
            <TabPanel marginTop="2rem">
              <Departure stations={stations} />
            </TabPanel>
            <TabPanel marginTop="2rem">
              <Help />
            </TabPanel>
          </TabPanels>
        </Tabs>
        {/*</Container>*/}
      </motion.div>
    </div>
  );
}

export default Navbar;

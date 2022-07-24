import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Checkbox,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  FormHelperText,
  Input,
  useToast,
} from '@chakra-ui/react';
import { collection, getDocs, query, addDoc, where } from 'firebase/firestore';
import { db } from '../config/Firebase';
import { useAuth } from '../context/Auth';
import { motion } from 'framer-motion';
import Alert from './Alert';

function Depature() {
  const [departure, setDeparture] = useState([]);
  const [station, setStation] = useState('');
  const [date, setDate] = useState('');
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  async function addDeparture() {
    try {
      const d = new Date(date);
      if (station === '')
        Alert(toast, 'Error', 'Please select a station', 'error');
      else if (date === '')
        Alert(toast, 'Error', 'Please select a date', 'error');
      else if (d.getTime() < new Date().getTime())
        Alert(toast, 'Error', 'Your ticket should be in the future', 'error');
      else {
        await addDoc(collection(db, 'departures'), {
          station,
          date: d.toISOString(),
          uid: user.uid,
          taken: false,
        });
        setDeparture([
          ...departure,
          { station, date, uid: user.uid, taken: false },
        ]);
        onClose();
        Alert(toast, 'Departure Added', 'Your departure has been added', 'success');
      }
    } catch (error) {
      Alert(toast, 'Error', error.message, 'error');
    }
  }

  useEffect(() => {
    const q = query(collection(db, 'departures'), where('uid', '==', user.uid));
    getDocs(q).then(docs => {
      const arr = docs.docs.map(doc => doc.data());
      setDeparture(arr);
    });
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="scale">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Departure</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Station</FormLabel>
              <Select
                placeholder="Select station"
                onChange={e => setStation(e.target.value)}
              >
                <option value="Airport">Airport</option>
                <option value="Train">Train</option>
                <option value="Bus">Bus</option>
              </Select>
              <FormHelperText>Place where you'll be departing fro,</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Date</FormLabel>
              <Input
                onChange={e => setDate(e.target.value)}
                type="datetime-local"
              />
              <FormHelperText>Date and Time of Departure</FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button variant="ghost" onClick={addDeparture}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          as={motion.button}
          color="black"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: '1.2' }}
          onClick={onOpen}
        >
          Add Departure
        </Button>
      </div>
      <TableContainer>
        <Table size="lg" variant="striped" colorScheme="teal">
          <TableCaption color={'white'}>Your Goa Departures</TableCaption>
          <Thead>
            <Tr>
              <Th color={'white'}>Station</Th>
              <Th color={'white'}>Date</Th>
              <Th color={'white'}>Taken</Th>
            </Tr>
          </Thead>
          <Tbody>
            {departure &&
              departure.map((dep, index) => (
                <Tr
                  as={motion.tr}
                  color={index % 2 === 0 ? 'black' : 'white'}
                  transition={{ type: 'spring' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={index}
                >
                  <Td>{dep.station}</Td>
                  <Td>{new Date(dep.date).toLocaleString()}</Td>
                  <Td>
                    {dep.taken ? (
                      <Checkbox
                        border={index % 2 === 0 ? 'black' : 'white'}
                        defaultChecked
                      />
                    ) : (
                      <Checkbox border={index % 2 === 0 ? 'black' : 'white'} />
                    )}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Depature;

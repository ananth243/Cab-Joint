import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
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
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  FormHelperText,
  Input,
  useToast,
} from '@chakra-ui/react';
import {
  collection,
  getDocs,
  query,
  addDoc,
  where,
  deleteDoc,
  doc,
  limit,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { phone } from 'phone';
import { db } from '../config/Firebase';
import { useAuth } from '../context/Auth';
import { motion } from 'framer-motion';
import Alert from './Alert';

function Departures() {
  const [departures, setDepartures] = useState(null);
  const [station, setStation] = useState('');
  const [date, setDate] = useState('');
  const [mobile, setMobile] = useState('');
  const [id, setId] = useState(null);
  const [cabs, setCabs] = useState(null);
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const toast = useToast();

  async function addDeparture() {
    try {
      const copy = new Date(date);
      const d = Timestamp.fromDate(copy);
      if (station === '')
        Alert(toast, 'Error', 'Please select a station', 'error');
      else if (date === '')
        Alert(toast, 'Error', 'Please select a date', 'error');
      else if (copy.getTime() < new Date().getTime())
        Alert(
          toast,
          'Error',
          'Your departure should be in the future',
          'error'
        );
      else if (!phone(mobile).isValid)
        Alert(toast, 'Error', 'Please enter a valid mobile number', 'error');
      else {
        const res = await addDoc(collection(db, 'departures'), {
          station,
          date: d,
          uid: user.uid,
          name: user.displayName,
          mobile,
          taken: false,
        });
        setDepartures([
          ...departures,
          { station, date: d, uid: user.uid, taken: false, id: res.id, mobile },
        ]);
        onClose();
        Alert(
          toast,
          'Departure Added',
          'Your departure has been added',
          'success'
        );
      }
    } catch (error) {
      Alert(toast, 'Error', error.message, 'error');
    }
  }

  async function deleteDeparture() {
    try {
      await deleteDoc(doc(db, 'departures', id));
      setId(null);
      onDeleteClose();
      setDepartures(departures.filter(a => a.id !== id));
      setCabs(null);
      Alert(
        toast,
        'Departure Deleted',
        'Your departure has been deleted',
        'success'
      );
    } catch (error) {
      Alert(toast, 'Error', error.message, 'error');
    }
  }

  useEffect(() => {
    async function fetchCabs() {
      try {
        if (departures && departures.length !== 0) {
          const start = departures[0].date.toDate();
          start.setTime(start.getTime() - 2 * 60 * 60 * 1000);
          const end = departures[0].date.toDate();
          end.setTime(end.getTime() + 2 * 60 * 60 * 1000);
          console.log(start.toString(), end.toString());
          let cabpool = await getDocs(
            query(
              collection(db, 'departures'),
              where('station', '==', departures[0].station),
              where('date', '>=', start),
              where('date', '<=', end),
              orderBy('date', 'asc'),
              limit(6)
            )
          );
          let c = cabpool.docs.map(doc => doc.data());
          c = c.filter(cab => cab.uid !== user.uid);
          setCabs(c);
        }
      } catch (error) {
        Alert(toast, 'Error', error.message, 'error');
      }
    }
    fetchCabs();
  }, [departures, toast, user]);

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(
          collection(db, 'departures'),
          where('uid', '==', user.uid)
        );
        const docs = await getDocs(q);
        const arr = docs.docs.map(doc => {
          const obj = doc.data();
          obj.id = doc.id;
          return obj;
        });
        setDepartures(arr);
      } catch (error) {
        Alert(toast, 'Error', error.message, 'error');
      }
    }

    fetchData();
  }, [user, toast]);

  return (
    <>
      {departures && (
        <>
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            motionPreset="scale"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New Departurel</ModalHeader>
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
                  <FormHelperText>
                    Place where you'll be departing from
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    onChange={e => setMobile(e.target.value)}
                    placeholder="Enter your phone number"
                    value={mobile}
                    type="tel"
                  />
                  <FormHelperText>
                    Preferable your Whatsapp number
                  </FormHelperText>
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
          <Modal
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            isCentered
            motionPreset="scale"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete Departure</ModalHeader>
              <ModalBody>
                If you are taken in a cabpool, this entry will be deleted. Are
                you sure?
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button variant="ghost" onClick={deleteDeparture}>
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {departures && departures.length === 0 && (
            <motion.div
              style={{ display: 'flex', justifyContent: 'flex-end' }}
              transition={{ type: 'spring' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Button
                as={motion.button}
                color="black"
                initial={{ opacity: 0.6 }}
                whileHover={{ opacity: 1, scale: '1.2' }}
                onClick={onOpen}
              >
                Add Departure
              </Button>
            </motion.div>
          )}
          {departures && departures.length !== 0 ? (
            <TableContainer>
              <Table size="lg" variant="striped" colorScheme="teal">
                <TableCaption color={'white'}>Your Goa departures</TableCaption>
                <Thead>
                  <Tr>
                    <Th color={'white'}>Station</Th>
                    <Th color={'white'}>Date</Th>
                    <Th color={'white'}>Mobile</Th>
                    <Th color={'white'}>Taken</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {departures.map((departure, index) => (
                    <Tr
                      as={motion.tr}
                      color={index % 2 === 0 ? 'black' : 'white'}
                      transition={{ type: 'spring' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={index}
                    >
                      <Td>{departure.station}</Td>
                      <Td>{departure.date.toDate().toLocaleString()}</Td>
                      <Td>{departure.mobile}</Td>
                      <Td>
                        {departure.taken ? (
                          <Checkbox
                            onClick={() => {
                              setId(departure.id);
                              onDeleteOpen();
                            }}
                            border={index % 2 === 0 ? 'black' : 'white'}
                            defaultChecked
                          />
                        ) : (
                          <Checkbox
                            onChange={() => {
                              setId(departure.id);
                              onDeleteOpen();
                            }}
                            border={index % 2 === 0 ? 'black' : 'white'}
                          />
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Text fontSize="2xl">You have not added an departure yet</Text>
          )}
        </>
      )}
      {cabs && cabs.length > 0 && (
        <>
          <Text align="center" marginTop="2rem" fontSize="2xl">
            Available people in your cabpool
          </Text>
          <TableContainer>
            <Table size="lg" variant="striped" colorScheme="teal">
              <TableCaption color={'white'}>Contact Info</TableCaption>
              <Thead>
                <Tr>
                  <Th color={'white'}>Station</Th>
                  <Th color={'white'}>Name</Th>
                  <Th color={'white'}>Mobile</Th>
                  <Th color={'white'}>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cabs.map((cab, index) => (
                  <Tr
                    as={motion.tr}
                    color={index % 2 === 0 ? 'black' : 'white'}
                    transition={{ type: 'spring' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={index}
                  >
                    <Td>{cab.station}</Td>
                    <Td>{cab.name}</Td>
                    <Td>{cab.mobile}</Td>
                    <Td>{cab.date.toDate().toLocaleString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
      {cabs && cabs.length === 0 && (
        <Text fontSize="2xl">Couldn't find any people yet</Text>
      )}
    </>
  );
}

export default Departures;

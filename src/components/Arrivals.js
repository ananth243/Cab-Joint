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
  IconButton,
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
import { FaCheck } from 'react-icons/fa';
import { db } from '../config/Firebase';
import { useAuth } from '../context/Auth';
import { motion } from 'framer-motion';
import Alert from './Alert';

function Arrivals({ stations }) {
  const [arrivals, setArrivals] = useState(null);
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

  async function addArrival() {
    try {
      const copy = new Date(date);
      const d = Timestamp.fromDate(copy);
      if (station === '')
        Alert(toast, 'Error', 'Please select a station', 'error');
      else if (date === '')
        Alert(toast, 'Error', 'Please select a date', 'error');
      else if (copy.getTime() < new Date().getTime())
        Alert(toast, 'Error', 'Your arrival should be in the future', 'error');
      else if (!phone(mobile).isValid)
        Alert(toast, 'Error', 'Please enter a valid mobile number', 'error');
      else {
        const res = await addDoc(collection(db, 'arrivals'), {
          station,
          date: d,
          uid: user.uid,
          name: user.displayName,
          mobile,
          taken: false,
        });
        setArrivals([
          ...arrivals,
          { station, date: d, uid: user.uid, taken: false, id: res.id, mobile },
        ]);
        onClose();
        Alert(toast, 'Arrival Added', 'Your arrival has been added', 'success');
      }
    } catch (error) {
      Alert(toast, 'Error', error.message, 'error');
    }
  }

  async function deleteArrival() {
    try {
      await deleteDoc(doc(db, 'arrivals', id));
      setId(null);
      onDeleteClose();
      setArrivals(arrivals.filter(a => a.id !== id));
      setCabs(null);
      Alert(
        toast,
        'Arrival Deleted',
        'Your arrival has been deleted',
        'success'
      );
    } catch (error) {
      Alert(toast, 'Error', error.message, 'error');
    }
  }

  useEffect(() => {
    async function fetchCabs() {
      try {
        if (arrivals && arrivals.length !== 0) {
          const start = arrivals[0].date.toDate();
          start.setTime(start.getTime() - 2 * 60 * 60 * 1000);
          const end = arrivals[0].date.toDate();
          end.setTime(end.getTime() + 2 * 60 * 60 * 1000);
          let cabpool = await getDocs(
            query(
              collection(db, 'arrivals'),
              where('station', '==', arrivals[0].station),
              where('date', '>=', start),
              where('date', '<=', end),
              orderBy('date', 'asc'),
              limit(10)
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
  }, [arrivals, toast, user]);

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(
          collection(db, 'arrivals'),
          where('uid', '==', user.uid)
        );
        const docs = await getDocs(q);
        const arr = docs.docs.map(doc => {
          const obj = doc.data();
          obj.id = doc.id;
          return obj;
        });
        setArrivals(arr);
      } catch (error) {
        Alert(toast, 'Error', error.message, 'error');
      }
    }

    fetchData();
  }, [user, toast]);

  return (
    <>
      {arrivals && (
        <>
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={false}
            isCentered
            motionPreset="scale"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New Arrival</ModalHeader>
              <ModalBody>
                <FormControl>
                  <FormLabel>Station</FormLabel>
                  <Select
                    placeholder="Select station"
                    onChange={e => setStation(e.target.value)}
                  >
                    {stations.map((place, id) => (
                      <option value={place} key={id}>
                        {place}
                      </option>
                    ))}
                  </Select>
                  <FormHelperText>
                    Place where you'll be arriving in
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
                  <FormHelperText>Date and Time of Arrival</FormHelperText>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="ghost" onClick={addArrival}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal
            closeOnOverlayClick={false}
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            isCentered
            motionPreset="scale"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete Arrival</ModalHeader>
              <ModalBody>
                If you are taken in a cabpool, this entry will be deleted. Are
                you sure?
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button variant="ghost" onClick={deleteArrival}>
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {arrivals && arrivals.length === 0 && (
            <motion.div
              style={{
                width: '80%',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
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
                Add Arrival
              </Button>
            </motion.div>
          )}
          {arrivals && arrivals.length !== 0 ? (
            <TableContainer>
              <Table size="lg" variant="striped" colorScheme="teal">
                <TableCaption color={'white'}>Your Goa Arrivals</TableCaption>
                <Thead>
                  <Tr>
                    <Th color={'white'}>Station</Th>
                    <Th color={'white'}>Date</Th>
                    <Th color={'white'}>Mobile</Th>
                    <Th color={'white'}>Taken</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {arrivals.map((arrival, index) => (
                    <Tr
                      as={motion.tr}
                      color={index % 2 === 0 ? 'black' : 'white'}
                      transition={{ type: 'spring' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={index}
                    >
                      <Td>{arrival.station}</Td>
                      <Td>{arrival.date.toDate().toLocaleString()}</Td>
                      <Td>{arrival.mobile}</Td>
                      <Td>
                        {arrival.taken ? (
                          <Text>Taken</Text>
                        ) : (
                          <IconButton
                            onClick={() => {
                              setId(arrival.id);
                              onDeleteOpen();
                            }}
                            icon={<FaCheck />}
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
            <Text fontSize="2xl" marginTop="2rem">
              You have not added an arrival yet
            </Text>
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
        <Text fontSize="2xl" marginTop="1rem">
          Couldn't find any people yet
        </Text>
      )}
    </>
  );
}

export default Arrivals;

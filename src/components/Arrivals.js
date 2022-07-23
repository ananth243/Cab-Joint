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
} from '@chakra-ui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/Firebase';
import { useAuth } from '../context/Auth';
import { motion } from 'framer-motion';

function Arrivals() {
  const [arrivals, setArrivals] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    console.log(new Date(2022, 0, 1).toISOString());
    const q = query(collection(db, 'arrivals'), where('uid', '==', user.uid));
    getDocs(q).then(docs => {
      const arr = docs.docs.map(doc => doc.data());
      setArrivals(arr);
    });
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
        as={motion.button}
          color="black"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: '1.2' }}
        >
          Add Arrival
        </Button>
      </div>
      <TableContainer>
        <Table size="lg" variant="striped" colorScheme="teal">
          <TableCaption>Your Goa Arrivals</TableCaption>
          <Thead>
            <Tr>
              <Th>Station</Th>
              <Th>Date</Th>
              <Th>Taken</Th>
            </Tr>
          </Thead>
          <Tbody>
            {arrivals &&
              arrivals.map((arrival, index) => (
                <Tr
                  as={motion.tr}
                  color="black"
                  transition={{ type: 'spring' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={index}
                >
                  <Td>{arrival.station}</Td>
                  <Td>{new Date(arrival.date).toLocaleString()}</Td>
                  <Td>
                    {arrival.taken ? (
                      <Checkbox border="black" defaultChecked />
                    ) : (
                      <Checkbox border="black" />
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

export default Arrivals;

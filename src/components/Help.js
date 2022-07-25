import { Container, Highlight, Text } from '@chakra-ui/react';

function Help() {
  return (
    <Container fontSize="2xl">
      <Text>
        Welcome to the application. The <code>Arrivals</code> tab indicates that
        you are arriving in Goa and <code>Departure</code> leaving from Goa. You
        can add only one entry in your arrival and departure.
      </Text>
      <Text marginTop="2rem">
        Once you have finished entering the details of your arrival or
        departure, there will be a list dispayed of all the arrivals of people
        in the application that are closest to your time.
      </Text>
      <Text marginTop="2rem">
        If you are already part of a cabpool, then you can delete your entry by
        clicking the <code>Taken</code> column in your arrival so that people do
        not unecessarily contact you. So be sure to check the box if you are a
        part of a cabpool.
      </Text>
      <Highlight styles={{ marginTop: '2rem' }} query={['Note:', '2 hours']}>
        Note: The application finds users that have departure or arrival dates
        within 2 hours of yours
      </Highlight>
    </Container>
  );
}

export default Help;

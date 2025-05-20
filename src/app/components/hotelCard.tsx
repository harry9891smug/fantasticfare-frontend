// src/components/HotelCard.jsx
import React, { useState } from 'react';
import { Card, CardContent, Button, Modal, Box } from '@mui/material';
import HotelRoomDetails from './HotelRoomDetails';

const HotelCard = ({ hotel, rooms }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardContent>
        <h2>{hotel.name}</h2>
        <p>{hotel.address}</p>
        <p>Rating: {hotel.rating}</p>
        
        {/* View Deal button */}
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setOpen(true)}
        >
          View Deal
        </Button>
      </CardContent>

      {/* Modal for showing room details */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <HotelRoomDetails 
            hotelId={hotel.id} 
            hotelInfo={hotel} 
            rooms={rooms} 
            onClose={() => setOpen(false)} 
          />
        </Box>
      </Modal>
    </Card>
  );
};

export default HotelCard;
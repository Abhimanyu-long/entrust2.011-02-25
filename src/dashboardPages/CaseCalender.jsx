import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Divider, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Tooltip } from '@mui/material';
import { format, addDays } from 'date-fns';

function EventCard({ caseNumber, demandLetter, assignedTo, note }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        my: 1,
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '3px solid #0098ca',
      }}
    >
      {caseNumber && (
        <Typography variant="body2" fontWeight="bold" sx={{ color: '#000', mb: 0.5 }}>
          Case# {caseNumber}
        </Typography>
      )}
      {demandLetter && (
        <Typography variant="body2" sx={{ color: '#757575', mb: 0.5 }}>
          Demand Letter: {demandLetter}
        </Typography>
      )}
      {assignedTo && (
        <Typography variant="body2" sx={{ color: '#0098ca', fontWeight: 'bold' }}>
          Assigned to {assignedTo}
        </Typography>
      )}
      {note && (
        <Typography variant="body2" sx={{ color: '#757575', fontStyle: 'italic' }}>
          {note}
        </Typography>
      )}
    </Paper>
  );
}

function EventTabs() {
  const [value, setValue] = useState(0);
  const [dates, setDates] = useState([]);
  const [eventData, setEventData] = useState({
    "2024-11-23": { caseNumber: "992346", demandLetter: "Jamie Morgan", assignedTo: "Kenneth J. Hilliard" },
    "2024-11-24": { caseNumber: "991324", demandLetter: "Medical Record Review: Chris Patton", assignedTo: "Patrick S. Lombardi" },
    "2024-11-25": { note: "Memorial Day - Neural IT Team may not be available today", link: "Visit Holiday Calendar" },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: '', caseNumber: '', demandLetter: '', assignedTo: '', note: '' });

  useEffect(() => {
    const initialDates = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));
    setDates(initialDates);
  }, []);

  const loadMoreDates = () => {
    const lastDate = dates[dates.length - 1];
    const newDates = Array.from({ length: 5 }, (_, i) => addDays(lastDate, i + 1));
    setDates((prevDates) => [...prevDates, ...newDates]);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === dates.length - 1) {
      loadMoreDates();
    }
  };

  const handleAddEvent = () => {
    const formattedDate = format(new Date(newEvent.date), 'yyyy-MM-dd');
    setEventData((prevEventData) => ({
      ...prevEventData,
      [formattedDate]: {
        caseNumber: newEvent.caseNumber,
        demandLetter: newEvent.demandLetter,
        assignedTo: newEvent.assignedTo,
        note: newEvent.note,
      },
    }));
    setIsDialogOpen(false);
    setNewEvent({ date: '', caseNumber: '', demandLetter: '', assignedTo: '', note: '' });
  };

  const selectedDate = dates[value] ? format(dates[value], 'yyyy-MM-dd') : null;

  return (
    // <Box sx={{ width: '100%', maxWidth: 340, mx: 'auto', my: 2, borderRadius: 2, backgroundColor: "transparent" }}>
    //   <Tabs
    //     value={value}
    //     onChange={handleChange}
    //     variant="scrollable"
    //     scrollButtons="auto"
    //     textColor="primary"
    //     indicatorColor="primary"
    //     sx={{
    //       overflow: 'auto',
    //       backgroundColor: '#ffffff',
    //       boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    //       borderRadius: 2,
    //       fontSize: '0.75rem',
    //     }}
    //   >
    //     {dates.map((date, index) => (
    //       <Tooltip key={index} title={format(date, 'MMMM dd, yyyy')} arrow>
    //         {/* <Tab label={format(date, 'EEE dd')} sx={{ minWidth: 60, fontSize: '0.8rem' }} /> */}
    //         <Tab
    //           label={format(date, 'EEE dd')}
    //           sx={{
    //             minWidth: 60,
    //             fontSize: '0.8rem',
    //             '&:hover': {
    //               color: '#0098ca', // Change to the desired hover color
    //             },
    //           }}
    //         />

    //       </Tooltip>
    //     ))}
    //   </Tabs>
    //   <Divider sx={{ my: 1, width: '100%' }} />
    //   <Box sx={{ minHeight: 50 }}>
    //     {selectedDate && eventData[selectedDate] ? (
    //       <EventCard {...eventData[selectedDate]} />
    //     ) : (
    //       <Typography variant="body2" fontSize="0.75rem" color="textSecondary">No events for this date.</Typography>
    //     )}
    //   </Box>
    //   <Button
    //     variant="contained"
    //     size="medium"
    //     sx={{
    //       mt: 2,
    //       px: 3, // Padding for better size
    //       py: 1,
    //       background: 'linear-gradient(45deg, #125bad,#125bad)',
    //       color: '#fff',
    //       fontWeight: 'bold',
    //       borderRadius: '30px', // Rounded edges
    //       textTransform: 'none', // Disable uppercase text
    //       boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    //       // transition: 'all 0.3s ease-in-out',
    //       '&:hover': {
    //         background: 'linear-gradient(45deg, #005f8d, #0098ca)', // Reverse gradient

    //         boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)',
    //       },
    //     }}
    //   >
    //     <b>Upcoming Event</b>
    //   </Button>

    //   <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="xs" fullWidth>
    //     <DialogTitle sx={{ fontSize: '1rem' }}>Add Event</DialogTitle>
    //     <DialogContent>
    //       <TextField
    //         label="Date"
    //         type="date"
    //         value={newEvent.date}
    //         onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
    //         fullWidth
    //         InputLabelProps={{ shrink: true }}
    //         sx={{ mb: 1 }}
    //       />
    //       <TextField
    //         label="Case Number"
    //         value={newEvent.caseNumber}
    //         onChange={(e) => setNewEvent({ ...newEvent, caseNumber: e.target.value })}
    //         fullWidth
    //         sx={{ mb: 1 }}
    //       />
    //       <TextField
    //         label="Demand Letter"
    //         value={newEvent.demandLetter}
    //         onChange={(e) => setNewEvent({ ...newEvent, demandLetter: e.target.value })}
    //         fullWidth
    //         sx={{ mb: 1 }}
    //       />
    //       <TextField
    //         label="Assigned To"
    //         value={newEvent.assignedTo}
    //         onChange={(e) => setNewEvent({ ...newEvent, assignedTo: e.target.value })}
    //         fullWidth
    //         sx={{ mb: 1 }}
    //       />
    //       <TextField
    //         label="Note"
    //         value={newEvent.note}
    //         onChange={(e) => setNewEvent({ ...newEvent, note: e.target.value })}
    //         fullWidth
    //         sx={{ mb: 1 }}
    //       />
    //     </DialogContent>
    //     <DialogActions>
    //       <Button onClick={() => setIsDialogOpen(false)} size="small">Cancel</Button>
    //       <Button onClick={handleAddEvent} size="small" variant="contained">Add</Button>
    //     </DialogActions>
    //   </Dialog>
    // </Box>

    // <Box
    //   sx={{
    //     width: '100%',
    //     maxWidth: 340,
    //     mx: 'auto',
    //     my: 3,
    //     p: 2,
    //     borderRadius: 3,
    //     backgroundColor: 'white',
    //     boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    //     transition: 'transform 0.3s ease-in-out',
    //     '&:hover': {
    //       transform: 'translateY(-5px)',
    //       boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
    //     },
    //   }}
    // >
    //   <Tabs
    //     value={value}
    //     onChange={handleChange}
    //     variant="scrollable"
    //     scrollButtons="auto"
    //     textColor="primary"
    //     indicatorColor="primary"
    //     sx={{
    //       backgroundColor: '#f9f9f9',
    //       boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    //       borderRadius: 2,
    //       fontSize: '0.8rem',
    //       mb: 2,
    //       '& .MuiTab-root': {
    //         color: '#6b6b6b',
    //         '&.Mui-selected': {
    //           color: '#005f8d',
    //         },
    //       },
    //     }}
    //   >
    //     {dates.map((date, index) => (
    //       <Tooltip key={index} title={format(date, 'MMMM dd, yyyy')} arrow>
    //         <Tab
    //           label={format(date, 'EEE dd')}
    //           sx={{
    //             minWidth: 60,
    //             fontSize: '0.8rem',
    //             '&:hover': {
    //               color: '#005f8d',
    //             },
    //           }}
    //         />
    //       </Tooltip>
    //     ))}
    //   </Tabs>

    //   <Divider sx={{ my: 1, width: '100%' }} />

    //   <Box
    //     sx={{
    //       minHeight: 50,
    //       p: 2,
    //       backgroundColor: '#f3f4f6',
    //       borderRadius: 2,
    //       display: 'flex',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //       color: 'text.secondary',
    //     }}
    //   >
    //     {selectedDate && eventData[selectedDate] ? (
    //       <EventCard {...eventData[selectedDate]} />
    //     ) : (
    //       <Typography variant="body2" fontSize="0.9rem">
    //         No events for this date.
    //       </Typography>
    //     )}
    //   </Box>

    //   <Button
    //     variant="contained"
    //     size="large"
    //     sx={{
    //       mt: 3,
    //       width: '100%',
    //       background: 'linear-gradient(90deg, #005f8d, #0098ca)',
    //       color: '#fff',
    //       fontWeight: 'bold',
    //       borderRadius: '30px',
    //       textTransform: 'none',
    //       boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    //       // transition: 'all 0.3s ease-in-out',
    //       // '&:hover': {
    //       //   background: 'linear-gradient(90deg, #0098ca, #005f8d)',
    //       //   boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
    //       // },
    //     }}
    //   >
    //     Upcoming Event
    //   </Button>

    //   <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="xs" fullWidth>
    //     <DialogTitle
    //       sx={{
    //         fontSize: '1.2rem',
    //         fontWeight: 'bold',
    //         color: '#005f8d',
    //         textAlign: 'center',
    //       }}
    //     >
    //       Add Event
    //     </DialogTitle>
    //     <DialogContent
    //       sx={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         gap: 2,
    //       }}
    //     >
    //       <TextField
    //         label="Date"
    //         type="date"
    //         value={newEvent.date}
    //         onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
    //         fullWidth
    //         InputLabelProps={{ shrink: true }}
    //       />
    //       <TextField
    //         label="Case Number"
    //         value={newEvent.caseNumber}
    //         onChange={(e) => setNewEvent({ ...newEvent, caseNumber: e.target.value })}
    //         fullWidth
    //       />
    //       <TextField
    //         label="Demand Letter"
    //         value={newEvent.demandLetter}
    //         onChange={(e) => setNewEvent({ ...newEvent, demandLetter: e.target.value })}
    //         fullWidth
    //       />
    //       <TextField
    //         label="Assigned To"
    //         value={newEvent.assignedTo}
    //         onChange={(e) => setNewEvent({ ...newEvent, assignedTo: e.target.value })}
    //         fullWidth
    //       />
    //       <TextField
    //         label="Note"
    //         value={newEvent.note}
    //         onChange={(e) => setNewEvent({ ...newEvent, note: e.target.value })}
    //         fullWidth
    //       />
    //     </DialogContent>
    //     <DialogActions
    //       sx={{
    //         p: 2,
    //         justifyContent: 'space-between',
    //       }}
    //     >
    //       <Button onClick={() => setIsDialogOpen(false)} size="small" variant="outlined" sx={{ color: '#005f8d' }}>
    //         Cancel
    //       </Button>
    //       <Button onClick={handleAddEvent} size="small" variant="contained" sx={{ background: '#005f8d', color: '#fff' }}>
    //         Add
    //       </Button>
    //     </DialogActions>
    //   </Dialog>
    // </Box>


    <Box
    sx={{
      width: '100%',
      maxWidth: 340,
      mx: 'auto',
      my: 3,
      p: 2,
      borderRadius: 3,
      backgroundColor: 'white',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      // transition: 'transform 0.3s ease-in-out',
     
    }}
  >
    <Tabs
      value={dates.indexOf(selectedDate)}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      textColor="primary"
      indicatorColor="primary"
      sx={{
        // backgroundColor: '#87ccff',
        background: "linear-gradient(145deg, #003f73 0%, #66c2ff 100%)",
        color:"white",
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        fontSize: '0.8rem',
        mb: 2,
        '& .MuiTab-root': {
          // color: '#6b6b6b',
          border:"black",
          '&.Mui-selected': {
            color: '#005f8d',
          },
        },
      }}
    >
      {dates.map((date, index) => (
        <Tooltip key={index} title={format(date, 'MMMM dd, yyyy')} arrow>
          <Tab
            label={format(date, 'EEE dd')}
            sx={{
              minWidth: 60,
              fontSize: '0.8rem',
              color:"#041835",
              '&:hover': {
                color: '#041835',
              },
            }}
          />
        </Tooltip>
      ))}
    </Tabs>

    <Divider sx={{ my: 1, width: '100%' }} />

    <Box
      sx={{
        // minHeight: 50,
        // p: 2,
        backgroundColor: '#f3f4f6',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#041835',
      }}
    >
      {selectedDate && eventData[selectedDate] ? (
        <EventCard {...eventData[selectedDate]} />
      ) : (
        <Typography variant="body2" fontSize="0.9rem">
          No events for this date.
        </Typography>
      )}
    </Box>

    <Button
      variant="contained"
      size="large"
      sx={{
        mt: 3,
        width: '100%',
        background: 'linear-gradient(90deg, #005f8d, #0098ca)',
        color: '#fff',
        fontWeight: 'bold',
        borderRadius: '30px',
        textTransform: 'none',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      Upcoming Event
    </Button>

    <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#005f8d',
          textAlign: 'center',
        }}
      >
        Add Event
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          label="Date"
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Case Number"
          value={newEvent.caseNumber}
          onChange={(e) => setNewEvent({ ...newEvent, caseNumber: e.target.value })}
          fullWidth
        />
        <TextField
          label="Demand Letter"
          value={newEvent.demandLetter}
          onChange={(e) => setNewEvent({ ...newEvent, demandLetter: e.target.value })}
          fullWidth
        />
        <TextField
          label="Assigned To"
          value={newEvent.assignedTo}
          onChange={(e) => setNewEvent({ ...newEvent, assignedTo: e.target.value })}
          fullWidth
        />
        <TextField
          label="Note"
          value={newEvent.note}
          onChange={(e) => setNewEvent({ ...newEvent, note: e.target.value })}
          fullWidth
        />
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
          justifyContent: 'space-between',
        }}
      >
        <Button onClick={() => setIsDialogOpen(false)} size="small" variant="outlined" sx={{ color: '#005f8d' }}>
          Cancel
        </Button>
        <Button onClick={handleAddEvent} size="small" variant="contained" sx={{ background: '#005f8d', color: '#fff' }}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  </Box>

  );
}

export default EventTabs;

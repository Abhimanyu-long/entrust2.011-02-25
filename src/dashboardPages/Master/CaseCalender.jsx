
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  TextField,
} from '@mui/material';
import { format, addDays, subDays, startOfMonth, endOfMonth, endOfYear } from 'date-fns';
import axios from 'axios';
import { ArrowBack, ArrowForward, Close } from '@mui/icons-material';
import toast from 'react-hot-toast';
import "../../assets/css/calender.css"

const API_URL =
  import.meta.env.VITE_BASE_URL + ':' + import.meta.env.VITE_BASE_PORT;

function EventTabs() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [eventData, setEventData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  // useEffect(() => {
  //   const generateDates = () => {
  //     const start = startOfMonth(currentDate);
  //     const end = endOfMonth(currentDate);
  //     const monthDates = [];

  //     for (let date = start; date <= end; date = addDays(date, 1)) {
  //       monthDates.push(date);
  //     }

  //     // Ensure the selected date is included
  //     const selectedDateObj = new Date(selectedDate);
  //     if (!monthDates.some((date) => format(date, 'yyyy-MM-dd') === format(selectedDateObj, 'yyyy-MM-dd'))) {
  //       monthDates.push(selectedDateObj);
  //     }

  //     setDates(monthDates.sort((a, b) => a - b)); // Sort dates to maintain order
  //   };

  //   generateDates();
  // }, [currentDate, selectedDate]);

  useEffect(() => {
    const generateDates = () => {
      const today = new Date();
      const start = currentDate;
      const end = endOfYear(currentDate);

      const monthDates = [];
      for (let date = start; date <= end; date = addDays(date, 1)) {
        monthDates.push(date);
      }

      const sortedDates = monthDates.sort((a, b) => {
        if (format(a, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) return -1;
        if (a > today) return 1;
        return a - b;
      });

      setDates(sortedDates);
    };

    generateDates();
  }, [currentDate]);


  useEffect(() => {
    fetchEventData(selectedDate); // Fetch events for the selected date on load
  }, [selectedDate]);

  const fetchEventData = async (date) => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const clientData = JSON.parse(sessionStorage.getItem('client_data')) || {};
      const response = await axios.get(
        `${API_URL}/events/clients/${clientData.client_id}?filters=start_date:${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const events = response.data.data || [];
      setEventData((prev) => ({
        ...prev,
        [date]: events, // Always store events as an array
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  // const handleNextMonth = () => {
  //   setCurrentDate((prev) => addDays(prev, 30));
  // };
  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const handleDateClick = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    setSelectedDate(formattedDate);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  // const handleDialogClose = () => {
  //   setIsDialogOpen(false);
  //   setNewAddEvent({
  //     title: '',
  //     description: '',
  //     startDate: format(new Date(), 'yyyy-MM-dd'),
  //     endDate: format(new Date(), 'yyyy-MM-dd'),
  //   });
  // };
  

  // const handleAddEvent = async () => {
  //   // Validate required fields
  //   if (!newaddEvent.title || !newaddEvent.startDate || !newaddEvent.endDate) {
  //     toast.error('Event title, start date, and end date are required!');
  //     return;
  //   }

  //   const token = sessionStorage.getItem('token');
  //   const clientData = JSON.parse(sessionStorage.getItem('client_data')) || {};
  //   const UserID = JSON.parse(sessionStorage.getItem('user_id')) || {};

  //   try {
  //     // Prepare the payload
  //     const payload = {
  //       client_id: clientData.client_id,
  //       event_name: newaddEvent.title,
  //       event_details: newaddEvent.description,
  //       start_date: newaddEvent.startDate,
  //       end_date: newaddEvent.endDate,
  //       created_by: UserID.custom_id,
  //     };

  //     // Make the API call to add the event
  //     const response = await axios.post(`${API_URL}/events/`, payload, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     // Handle success
  //     toast.success('Event added successfully!');

  //     // Update state to include the new event
  //     setEventData((prev) => ({
  //       ...prev,
  //       [newaddEvent.startDate]: [
  //         ...(Array.isArray(prev[newaddEvent.startDate]) ? prev[newaddEvent.startDate] : []),
  //         response.data, // Append the new event
  //       ],
  //     }));


  //     // Reset the form and close the dialog
  //   setNewAddEvent({
  //     title: '',
  //     description: '',
  //     startDate: format(new Date(), 'yyyy-MM-dd'),
  //     endDate: format(new Date(), 'yyyy-MM-dd'),
  //   });
  //   setIsDialogOpen(false);


  //     handleDialogClose(); // Close the dialog
  //   } catch (error) {
  //     console.error('Error adding event:', error);
  //     toast.error(
  //       error.response?.data?.message || 'Failed to add the event. Please try again.'
  //     );
  //   }
  // };

  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setNewAddEvent({
      title: '',
      description: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
    });
  };
  
  const handleAddEvent = async () => {
    if (!newaddEvent.title || !newaddEvent.startDate || !newaddEvent.endDate) {
      toast.error('Event title, start date, and end date are required!');
      return;
    }
  
    const token = sessionStorage.getItem('token');
    const clientData = JSON.parse(sessionStorage.getItem('client_data')) || {};
    const UserID = JSON.parse(sessionStorage.getItem('user_id')) || {};
  
    try {
      const payload = {
        client_id: clientData.client_id,
        event_name: newaddEvent.title,
        event_details: newaddEvent.description,
        start_date: newaddEvent.startDate,
        end_date: newaddEvent.endDate,
        created_by: UserID.custom_id,
      };
  
      const response = await axios.post(`${API_URL}/events/`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success('Event added successfully!');
  
      setEventData((prev) => ({
        ...prev,
        [newaddEvent.startDate]: [
          ...(Array.isArray(prev[newaddEvent.startDate]) ? prev[newaddEvent.startDate] : []),
          response.data,
        ],
      }));
  
      // Reset the form and close the dialog
      setNewAddEvent({
        title: '',
        description: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error(
        error.response?.data?.message || 'Failed to add the event. Please try again.'
      );
    }
  };
  
  const handleNewAddEvent = (field, value) => {
    setNewAddEvent((prev) => ({ ...prev, [field]: value }));
  };
  
  
  
  


  const [newaddEvent, setNewAddEvent] = useState({
    title: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'), // Default to today's date
    endDate: format(new Date(), 'yyyy-MM-dd'),   // Default to today's date
  });
  return (
    <Box sx={{
      p: 2,
      backgroundColor: "#ffffff",
      borderRadius: 2,
      height: "100%",
      paddingTop:"22px"
    }}>
      <Box  sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 1,
    }}>
        <IconButton onClick={handlePreviousMonth} sx={{ color: '#4fc9da' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ color: '#4fc9da', fontWeight: 'bold' }}>
          {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth} sx={{ color: '#4fc9da' }}>
          <ArrowForward />
        </IconButton>
      </Box>

      
      <Tabs
        value={dates.findIndex((date) => format(date, 'yyyy-MM-dd') === selectedDate)}
        onChange={(_, newValue) => handleDateClick(dates[newValue])}
        variant="scrollable"
        scrollButtons="auto"
        textColor="primary"
        indicatorColor="primary"
        allowScrollButtonsMobile
        sx={{
          backgroundColor: '#4fc9da',
          borderRadius: 2,
          color: '#000000',
          mb: 1,
          '& .MuiTab-root': {
            fontSize: '0.9rem',
            color: '#000000',
            fontWeight: 'bold',
            '&.Mui-selected': {
              color: '#ffffff',
            },
          },
          '& .MuiTabs-scrollButtons': {
            width: 40,
            height: 40,
            visibility: 'visible !important', // Always show scroll buttons
          },
          '& .MuiTabs-scrollButtons.Mui-disabled': {
            opacity: 0.3, // Dim the buttons when disabled
          },
        }}
      >
        {dates.map((date, index) => (
          <Tab
            key={index}
            label={format(date, 'EEE dd')}
            sx={{
              fontSize: '0.875rem',
              fontWeight: 'bold',
              textTransform: 'none',
              minWidth: '80px',
            }}
          />
        ))}
      </Tabs>
      <Divider sx={{ mb: 1 }} />

     
      {/* Event Cards */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          overflowY: 'auto', // Add vertical scrolling
          maxHeight: '90px', // Limit the height of the event container
          padding: 1,
        }}
      >
        {isLoading ? (
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'gray',
              fontSize: '14px',
            }}
          >
            Loading events...
          </Typography>
        ) : eventData[selectedDate]?.length > 0 ? (
          eventData[selectedDate].map((event, index) => (
            <Paper
              key={index}
              sx={{
                mb: 1,
                p: 1,
                backgroundColor: '#eaf4fc',
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid #d3e3f0',
                display: 'flex',
                alignItems: 'center', 
                justifyContent: 'space-between', 
              }}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#3a8fcf',
                    fontWeight: 'bold',
                    fontSize: '12px', 
                  }}
                >
                  Case#: {event.event_id}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  Event Name: {event.event_name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#3a8fcf',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                >
                  Event Details: {event.event_details}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: '#007bff',
                  color: '#ffffff',
                  textTransform: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  px: 2, // Padding for button text
                  py: 0.5,
                  '&:hover': {
                    backgroundColor: '#0056b3',
                  },
                }}
              >
                View
              </Button>
            </Paper>
          ))
        ) : (
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              fontSize: '12px',
              paddingTop: '12px',
            }}
          >
            No events for {format(new Date(selectedDate), 'EEE dd, MMM yyyy')}
          </Typography>
        )}
      </Box>


      <Button variant="contained" fullWidth onClick={handleDialogOpen} sx={{ mt: 1, backgroundColor: '#4fc9da', color: '#000000', fontWeight: 'bold', borderRadius: '30px',  textTransform: 'none' }}>
        Add Upcoming Event
      </Button>

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            maxWidth: '420px',
            width: '100%',
            borderRadius: '16px',
            padding: '20px',
            background: 'linear-gradient(135deg, #ffffff, #e0f7fa)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            border: `3px solid #4fc9da`,
          },
        }}
      >
        {/* Close Icon */}
        <IconButton
          onClick={handleDialogClose}
          sx={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            color: '#4fc9da',
            backgroundColor: '#eef7ff',
            boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#e0f4fa',
              transform: 'scale(1.1)',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        >
          <Close />
        </IconButton>

        {/* Dialog Content */}
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            textAlign: 'center',
          }}
        >
          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
            }}
            className="text-black"
          >
            Add New Event
          </Typography>

          {/* Input Fields */}
          <TextField
            label={
              <span>
                Event Title <span style={{ color: 'red' }}>*</span>
              </span>
            }
            variant="outlined"
            size="small"
            value={newaddEvent.title}
            onChange={(e) => handleNewAddEvent('title', e.target.value)}
            fullWidth
          />
          <TextField
            label={
              <span>
                Description <span style={{ color: 'red' }}>*</span>
              </span>
            }
            variant="outlined"
            size="small"
            value={newaddEvent.description}
            onChange={(e) => handleNewAddEvent('description', e.target.value)}
            multiline
            rows={3}
            fullWidth
          />

          {/* Start and End Date Fields */}
          <Box
            sx={{
              display: 'flex',
              gap: 2, // Space between fields
            }}
          >
            <TextField
             label={
              <span>
                Start Date <span style={{ color: 'red' }}>*</span>
              </span>
            }
              type="date"
              value={newaddEvent.startDate}
              onChange={(e) => handleNewAddEvent('startDate', e.target.value)}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
            label={
              <span>
                End Date <span style={{ color: 'red' }}>*</span>
              </span>
            }
              type="date"
              value={newaddEvent.endDate}
              onChange={(e) => handleNewAddEvent('endDate', e.target.value)}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>

        {/* Footer Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 3,
          }}
        >
          {/* Close Button */}
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            size="small"
            sx={{
              color: '#000000',
              borderColor: '#4fc9da',
              textTransform: 'none',
              padding: '8px 8px',
              borderRadius: '10px',
              fontWeight: 'bold',
              backgroundColor: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#e0f4fa',
                borderColor: '#3a8fcf',
              },
            }}
          >
            Close
          </Button>

          {/* Add Button */}
          <Button
            onClick={handleAddEvent}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#4fc9da',
              color: '#000000',
              textTransform: 'none',
              padding: '8px 8px',
              borderRadius: '10px',
              fontWeight: 'bold',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #3a8fcf, #4fc9da)',
                border: '2px solid #3a8fcf',
              },
            }}
          >
            Add Event
          </Button>
        </Box>
      </Dialog>

    </Box>
  );
}

export default EventTabs;

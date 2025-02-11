// import React from "react";

// const SuccessModal = ({ show, onClose }) => {
//   if (!show) return null; // Do not render if `show` is false

//   return (
//     <div
//       className="modal-overlay d-flex justify-content-center align-items-center vh-100"
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//         zIndex: 1050,
//       }}
//     >
//       <div
//         className="modal-content card text-center shadow-lg"
//         style={{
//           width: "20rem",
//           borderRadius: "12px",
//           border: "none",
//           backgroundColor: "#ffffff",
//         }}
//       >
//         <div className="card-body">
//           {/* Icon */}
//           <div className="text-success">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="80"
//               height="80"
//               fill="currentColor"
//               className="bi bi-check-circle-fill mb-3 text-success"
//               viewBox="0 0 16 16"
//             >
//               <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.905 11.803L13.44 5.267l-1.06-1.06-5.475 5.475-2.475-2.475-1.06 1.06 3.535 3.535z" />
//             </svg>
//           </div>
//           <h4 className="card-title text-success fw-bold">Success!</h4>
//           <p className="card-text text-muted">
//             Your payment has been processed successfully.
//           </p>
//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="btn btn-success btn-lg"
//             style={{ borderRadius: "8px" }}
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuccessModal;



// import React, { useState } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// // Localizer setup
// const localizer = momentLocalizer(moment);

// const SuccessModal = () => {
//   const [timezone, setTimezone] = useState('UTC');
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedDateEvents, setSelectedDateEvents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [data, setData] = useState([
//     {
//       id: 1,
//       title: 'Task: Complete Report [001]',
//       start: new Date('2024-12-30T10:00:00Z'),
//       end: new Date('2024-12-30T11:00:00Z'),
//       type: 'task',
//       description: 'Prepare the financial report for Q4 and submit it to the manager.',
//       file: 'report.pdf',
//     },
//     {
//       id: 2,
//       title: 'Event: Team Meeting [002]',
//       start: new Date('2024-12-31T13:00:00Z'),
//       end: new Date('2024-12-31T14:00:00Z'),
//       type: 'event',
//       description: 'Discuss project progress and assign new tasks.',
//     },
//     {
//       id: 3,
//       title: 'Follow-up: Client Call [003]',
//       start: new Date('2024-12-31T15:00:00Z'),
//       end: new Date('2024-12-31T15:30:00Z'),
//       type: 'follow-up',
//       description: 'Follow up with the client regarding the contract renewal.',
//     },
//     {
//       id: 4,
//       title: 'Call Recording: Discussion [004]',
//       start: new Date('2024-12-30T16:00:00Z'),
//       end: new Date('2024-12-30T16:30:00Z'),
//       type: 'call',
//       description: 'Recorded discussion about the upcoming merger.',
//       file: 'discussion-recording.mp3',
//     },
//   ]);

//   const [newEvent, setNewEvent] = useState({
//     title: '',
//     start: '',
//     end: '',
//     type: 'task',
//     description: '',
//     file: null,
//   });

//   const filteredEvents = data.filter((event) =>
//     event.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const eventStyleGetter = (event) => {
//     let backgroundColor;
//     switch (event.type) {
//       case 'task':
//         backgroundColor = '#007bff'; // Blue
//         break;
//       case 'event':
//         backgroundColor = '#28a745'; // Green
//         break;
//       case 'follow-up':
//         backgroundColor = '#ffc107'; // Yellow
//         break;
//       case 'call':
//         backgroundColor = '#dc3545'; // Red
//         break;
//       default:
//         backgroundColor = '#6c757d'; // Gray
//     }
//     return {
//       style: {
//         backgroundColor,
//         color: '#fff',
//         borderRadius: '5px',
//         padding: '5px',
//       },
//     };
//   };

//   const handleEventClick = (event) => {
//     setSelectedEvent(event);
//     setIsModalOpen(true);
//   };

//   const handleShowMore = (events) => {
//     setSelectedDateEvents(events);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedEvent(null);
//     setSelectedDateEvents([]);
//     setIsModalOpen(false);
//   };

//   const handleDateClick = (slotInfo) => {
//     setNewEvent({
//       ...newEvent,
//       start: moment(slotInfo.start).format('YYYY-MM-DDTHH:mm'),
//       end: moment(slotInfo.start).add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
//     });
//     setIsModalOpen(true);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewEvent({ ...newEvent, [name]: value });
//   };

//   const handleAddEvent = (e) => {
//     e.preventDefault();
//     if (!newEvent.title || !newEvent.start || !newEvent.end) {
//       alert('Please fill out all required fields.');
//       return;
//     }

//     const newEventData = {
//       id: data.length + 1,
//       title: newEvent.title,
//       start: new Date(newEvent.start),
//       end: new Date(newEvent.end),
//       type: newEvent.type,
//       description: newEvent.description,
//       file: newEvent.file,
//     };

//     setData([...data, newEventData]);
//     setIsModalOpen(false);
//     setNewEvent({
//       title: '',
//       start: '',
//       end: '',
//       type: 'task',
//       description: '',
//       file: null,
//     });
//   };

//   return (
//     <div className="container py-4">
//       {/* Header Section */}
//       <header className="text-center mb-4">
//         <h1 className="text-primary">Event Calendar</h1>
//         <p className="text-secondary">Track and manage your events effortlessly</p>
//       </header>

//       {/* Search Bar */}
//       <div className="mb-4 d-flex justify-content-center">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search events by title..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             maxWidth: '500px',
//             borderRadius: '10px',
//             boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
//           }}
//         />
//       </div>

//       {/* Timezone Selector */}
//       <div className="mb-3 mx-auto" style={{ maxWidth: '300px' }}>
//         <label
//           htmlFor="timezone-select"
//           className="form-label fw-bold"
//           style={{ fontSize: '16px', color: '#333' }}
//         >
//           Timezone:
//         </label>
//         <select
//           id="timezone-select"
//           className="form-select"
//           value={timezone}
//           onChange={(e) => setTimezone(e.target.value)}
//           style={{
//             padding: '10px',
//             borderRadius: '10px',
//             boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
//           }}
//         >
//           <option value="UTC">UTC</option>
//           <option value="America/New_York">America/New_York</option>
//           <option value="Asia/Kolkata">Asia/Kolkata</option>
//           <option value="Europe/London">Europe/London</option>
//         </select>
//       </div>

//       {/* Calendar */}
//       <div style={{ height: '600px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
//         <Calendar
//           localizer={localizer}
//           events={filteredEvents}
//           startAccessor="start"
//           endAccessor="end"
//           selectable
//           onSelectSlot={handleDateClick}
//           onSelectEvent={handleEventClick}
//           onShowMore={handleShowMore}
//           style={{ height: '100%' }}
//           eventPropGetter={eventStyleGetter}
//           defaultView="month"
//           popup
//         />
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             background: 'rgba(0, 0, 0, 0.5)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               background: '#fff',
//               padding: '20px',
//               borderRadius: '8px',
//               width: '400px',
//               maxWidth: '90%',
//               boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
//             }}
//           >
//             <h4>{selectedEvent ? 'Event Details' : 'Add New Event'}</h4>
//             {selectedEvent ? (
//               <>
//                 <p><strong>Title:</strong> {selectedEvent.title}</p>
//                 <p><strong>Type:</strong> {selectedEvent.type}</p>
//                 <p><strong>Description:</strong> {selectedEvent.description}</p>
//                 <p><strong>Start:</strong> {moment(selectedEvent.start).format('LLL')}</p>
//                 <p><strong>End:</strong> {moment(selectedEvent.end).format('LLL')}</p>
//                 <button
//                   className="btn btn-primary mt-3"
//                   onClick={handleCloseModal}
//                 >
//                   Close
//                 </button>
//               </>
//             ) : (
//               <form onSubmit={handleAddEvent}>
//                 <div className="mb-3">
//                   <label>Title</label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={newEvent.title}
//                     onChange={handleInputChange}
//                     className="form-control"
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label>Start Time</label>
//                   <input
//                     type="datetime-local"
//                     name="start"
//                     value={newEvent.start}
//                     onChange={handleInputChange}
//                     className="form-control"
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label>End Time</label>
//                   <input
//                     type="datetime-local"
//                     name="end"
//                     value={newEvent.end}
//                     onChange={handleInputChange}
//                     className="form-control"
//                     required
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-success">
//                   Add Event
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-secondary ms-2"
//                   onClick={handleCloseModal}
//                 >
//                   Cancel
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SuccessModal;



// import React, { useState } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { FaSearch } from 'react-icons/fa'; // Search Icon

// // Localizer setup
// const localizer = momentLocalizer(moment);

// const SuccessModal = () => {
//   const [timezone, setTimezone] = useState('UTC');
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [data, setData] = useState([
//     {
//       id: 1,
//       title: 'Task: Complete Report [001]',
//       start: new Date('2024-12-30T10:00:00Z'),
//       end: new Date('2024-12-30T11:00:00Z'),
//       type: 'task',
//       description: 'Prepare the financial report for Q4 and submit it to the manager.',
//       file: 'report.pdf',
//     },
//     {
//       id: 2,
//       title: 'Event: Team Meeting [002]',
//       start: new Date('2024-12-31T13:00:00Z'),
//       end: new Date('2024-12-31T14:00:00Z'),
//       type: 'event',
//       description: 'Discuss project progress and assign new tasks.',
//     },
//     {
//       id: 3,
//       title: 'Follow-up: Client Call [003]',
//       start: new Date('2024-12-31T15:00:00Z'),
//       end: new Date('2024-12-31T15:30:00Z'),
//       type: 'follow-up',
//       description: 'Follow up with the client regarding the contract renewal.',
//     },
//     {
//       id: 4,
//       title: 'Call Recording: Discussion [004]',
//       start: new Date('2024-12-30T16:00:00Z'),
//       end: new Date('2024-12-30T16:30:00Z'),
//       type: 'call',
//       description: 'Recorded discussion about the upcoming merger.',
//       file: 'discussion-recording.mp3',
//     },
//   ]);

//   const filteredEvents = data.filter((event) =>
//     event.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const eventStyleGetter = (event) => {
//     const colors = {
//       task: '#007bff', // Blue
//       event: '#28a745', // Green
//       'follow-up': '#ffc107', // Yellow
//       call: '#dc3545', // Red
//     };
//     return {
//       style: {
//         backgroundColor: colors[event.type] || '#6c757d', // Default to gray
//         color: '#fff',
//         borderRadius: '5px',
//         padding: '5px',
//       },
//     };
//   };

//   const handleEventClick = (event) => {
//     setSelectedEvent(event);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedEvent(null);
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="container py-4">
//       {/* Header Section */}
//       <header className="text-center mb-4">
//         <h1 style={{ fontSize: '2.5rem', color: '#007bff', fontWeight: 'bold' }}>Event Calendar</h1>
//         <p style={{ color: '#555', fontSize: '1.1rem' }}>Organize and manage your events seamlessly.</p>
//       </header>

//       {/* Search Bar */}
//       <div className="d-flex justify-content-center mb-4">
//         <div style={{ position: 'relative', maxWidth: '600px', width: '100%' }}>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search events by title..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               padding: '10px 20px 10px 45px',
//               borderRadius: '25px',
//               border: '1px solid #ddd',
//               boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//               outline: 'none',
//               transition: 'box-shadow 0.3s ease-in-out',
//             }}
//             onFocus={(e) => (e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 255, 0.3)')}
//             onBlur={(e) => (e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)')}
//           />
//           <FaSearch
//             style={{
//               position: 'absolute',
//               top: '50%',
//               left: '15px',
//               transform: 'translateY(-50%)',
//               color: '#007bff',
//               fontSize: '1.2rem',
//             }}
//           />
//         </div>
//       </div>

//       {/* Timezone Selector */}
//       <div className="d-flex justify-content-center mb-4">
//         <div
//           className="btn-group"
//           role="group"
//           style={{
//             display: 'flex',
//             gap: '10px',
//             maxWidth: '600px',
//             width: '100%',
//             justifyContent: 'center',
//           }}
//         >
//           {['UTC', 'America/New_York', 'Asia/Kolkata', 'Europe/London'].map((zone) => (
//             <button
//               key={zone}
//               className={`btn ${timezone === zone ? 'btn-primary' : 'btn-light'}`}
//               onClick={() => setTimezone(zone)}
//               style={{
//                 flex: 1,
//                 borderRadius: '10px',
//                 transition: 'background-color 0.3s ease-in-out',
//               }}
//             >
//               {zone}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Calendar */}
//       <div style={{ height: '600px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
//         <Calendar
//           localizer={localizer}
//           events={filteredEvents}
//           startAccessor="start"
//           endAccessor="end"
//           onSelectEvent={handleEventClick}
//           style={{ height: '100%' }}
//           eventPropGetter={eventStyleGetter}
//           defaultView="month"
//           popup
//         />
//       </div>

//       {/* Modal */}
//       {isModalOpen && selectedEvent && (
//         <div
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             background: 'rgba(0, 0, 0, 0.5)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               background: '#fff',
//               padding: '20px',
//               borderRadius: '8px',
//               width: '400px',
//               maxWidth: '90%',
//               boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
//             }}
//           >
//             <h4 style={{ color: '#007bff', marginBottom: '1rem' }}>{selectedEvent.title}</h4>
//             <p><strong>Type:</strong> {selectedEvent.type}</p>
//             <p><strong>Description:</strong> {selectedEvent.description}</p>
//             <p><strong>Start:</strong> {moment(selectedEvent.start).format('LLL')}</p>
//             <p><strong>End:</strong> {moment(selectedEvent.end).format('LLL')}</p>
//             <button
//               className="btn btn-primary mt-3"
//               onClick={handleCloseModal}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SuccessModal;



import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const ErrorCard = () => {
  const [timezone, setTimezone] = useState('UTC');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      title: 'Task: Complete Report [001]',
      start: new Date('2024-12-30T10:00:00Z'),
      end: new Date('2024-12-30T11:00:00Z'),
      type: 'task',
      description: 'Prepare the financial report for Q4 and submit it to the manager.',
      file: 'report.pdf',
    },
    {
      id: 2,
      title: 'Event: Team Meeting [002]',
      start: new Date('2024-12-31T13:00:00Z'),
      end: new Date('2024-12-31T14:00:00Z'),
      type: 'event',
      description: 'Discuss project progress and assign new tasks.',
      file: null,
    },
    {
      id: 3,
      title: 'Follow-up: Client Call [003]',
      start: new Date('2024-12-31T15:00:00Z'),
      end: new Date('2024-12-31T15:30:00Z'),
      type: 'follow-up',
      description: 'Follow up with the client regarding the contract renewal.',
      file: null,
    },
    {
      id: 4,
      title: 'Call Recording: Discussion [004]',
      start: new Date('2024-12-30T16:00:00Z'),
      end: new Date('2024-12-30T16:30:00Z'),
      type: 'call',
      description: 'Recorded discussion about the upcoming merger.',
      file: 'discussion-recording.mp3',
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    type: 'task',
    description: '',
    file: null,
  });

  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.type) {
      case 'task':
        backgroundColor = 'blue';
        break;
      case 'event':
        backgroundColor = 'green';
        break;
      case 'follow-up':
        backgroundColor = 'orange';
        break;
      case 'call':
        backgroundColor = 'red';
        break;
      default:
        backgroundColor = 'gray';
    }
    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '5px',
        padding: '5px',
      },
    };
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleDateClick = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setNewEvent({
      ...newEvent,
      start: moment(slotInfo.start).format('YYYY-MM-DDTHH:mm'),
      end: moment(slotInfo.start).add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert('Please fill out all required fields.');
      return;
    }

    const newEventData = {
      id: data.length + 1,
      title: newEvent.title,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
      type: newEvent.type,
      description: newEvent.description,
      file: newEvent.file,
    };

    setData([...data, newEventData]);
    setIsModalOpen(false);
    setNewEvent({
      title: '',
      start: '',
      end: '',
      type: 'task',
      description: '',
      file: null,
    });
  };
  // const [data, setData] = useState([
  //   { id: 1, title: 'Aabid Farukhi [O24-00285]', start: new Date('2024-12-30T09:00:00Z'), end: new Date('2024-12-30T10:00:00Z') },
  //   { id: 2, title: 'ACTS Law, LLP [O24-00225]', start: new Date('2024-12-30T10:00:00Z'), end: new Date('2024-12-30T11:00:00Z') },
  //   { id: 3, title: 'Alliance Medical Group [O24-001]', start: new Date('2024-12-30T11:00:00Z'), end: new Date('2024-12-30T12:00:00Z') },
  //   { id: 4, title: 'Colony Law [O24-00221]', start: new Date('2024-12-30T12:00:00Z'), end: new Date('2024-12-30T13:00:00Z') },
  //   { id: 5, title: 'Additional Event [O24-00231]', start: new Date('2024-12-30T13:00:00Z'), end: new Date('2024-12-30T14:00:00Z') },
  //   // Add more events for testing
  // ]);

  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const handleShowMore = (events) => {
    setSelectedDayEvents(events);
    setIsModalOpen(true);
  };
  return (
    <div>
   
      {/* Timezone Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label>Timezone: </label>
        <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York</option>
          <option value="Asia/Kolkata">Asia/Kolkata</option>
          <option value="Europe/London">Europe/London</option>
        </select>
      </div>

      {/* Calendar Component */}
      <div style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={data}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleDateClick}
          onSelectEvent={handleEventClick}
          onShowMore={(events) => handleShowMore(events)}
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          defaultView="week"
        />
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
              maxWidth: '90%',
              textAlign: 'left',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2>Add New Event</h2>
            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input
                type="datetime-local"
                name="start"
                value={newEvent.start}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input
                type="datetime-local"
                name="end"
                value={newEvent.end}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <select
                name="type"
                value={newEvent.type}
                onChange={handleInputChange}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="task">Task</option>
                <option value="event">Event</option>
                <option value="follow-up">Follow-Up</option>
                <option value="call">Call</option>
              </select>
              <textarea
                name="description"
                placeholder="Description (Optional)"
                value={newEvent.description}
                onChange={handleInputChange}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#ccc',
                    color: '#000',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
              maxWidth: '90%',
              textAlign: 'left',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 style={{ marginTop: 0 }}>{selectedEvent.title}</h2>
            <p>
              <strong>Type:</strong> {selectedEvent.type}
            </p>
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            <p>
              <strong>Start:</strong> {selectedEvent.start.toString()}
            </p>
            <p>
              <strong>End:</strong> {selectedEvent.end.toString()}
            </p>
            {selectedEvent.file && (
              <p>
                <strong>Attachment:</strong>{' '}
                <a href={selectedEvent.file} download>
                  {selectedEvent.file}
                </a>
              </p>
            )}
            <button
              onClick={handleCloseModal}
              style={{
                background: '#007bff',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorCard;

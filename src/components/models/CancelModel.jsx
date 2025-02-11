// import React, { useState } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import "../../assets/css/calender.css"


// const localizer = momentLocalizer(moment);

// const ErrorCard = () => {
//   const [timezone, setTimezone] = useState('UTC');
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [ShowMoreModalOpen, setShowMoreModalOpen] = useState(false);

//   const [selectedDateEvents, setSelectedDateEvents] = useState([]);
//   const [filter, setFilter] = useState('ALL'); // New state for filtering
//   const [data, setData] = useState([
//     {
//       id: 1,
//       title: 'Task: Complete Report [001]',
//       start: new Date('2024-12-30T10:00:00Z'),
//       end: new Date('2024-12-30T11:00:00Z'),
//       type: 'Deliverable',
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
//       id: 2,
//       title: 'Event: Team Meeting [002]',
//       start: new Date('2024-12-31T13:00:00Z'),
//       end: new Date('2024-12-31T14:00:00Z'),
//       type: 'event',
//       description: 'Discuss project progress and assign new tasks.',
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
//       id: 2,
//       title: 'Event: Team Meeting [002]',
//       start: new Date('2024-12-31T13:00:00Z'),
//       end: new Date('2024-12-31T14:00:00Z'),
//       type: 'event',
//       description: 'Discuss project progress and assign new tasks.',

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
//   const [fileName, setFileName] = useState(null);
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewEvent({ ...newEvent, file: file });
//       setFileName(file.name); // Set file name for display
//     }
//   };
//   const eventStyleGetter = (event) => {
//     const colors = {
//       Deliverable: '#9b9fe1',
//       SCHEDULE: '#8fca8f',
//       FOLLOWUP: 'orange',
//       TRIAL: '#a3f5f0',
//       MOTION: '#ffff70',
//       HEARING: '#8df58c',
//       OPPOSITION: '#f585f8',
//     };
//     let backgroundColor;
//     switch (event.type) {
//       case 'Deliverable':
//         backgroundColor = '#9b9fe1';
//         break;
//       case 'event':
//         backgroundColor = '#8fca8f';
//         break;
//       case 'follow-up':
//         backgroundColor = 'orange';
//         break;
//       case 'call':
//         backgroundColor = '#f27070';
//         break;
//       default:
//         backgroundColor = 'gray';
//     }
//     return {
//       style: {
//         backgroundColor,
//         color: 'white',
//         borderRadius: '5px',
//         padding: '5px',
//       },
//     };
//   };

//   const handleEventClick = (event) => {
//     setSelectedEvent(event);
//   };

//   const handleShowMore = (events) => {
//     console.log("onShowMore triggered:", events);
//     setSelectedDateEvents(events);
//     setShowMoreModalOpen(true);
//   };


//   const handleCloseModal = () => {
//     setSelectedEvent(null);
//     setSelectedDateEvents([]);
//     setIsModalOpen(false);
//     console.log("1111.Ismodalopen", isModalOpen);
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
//   const filteredEvents =
//     filter === 'ALL' ? data : data.filter((event) => event.type === filter);
//   return (
//     <div className='py-2 p-2 pt-3'>

//       <div className="mb-3">
//         {['ALL', 'Deliverable', 'Meeting', 'Milestone', "Other"].map((type) => (
//           <button
//             key={type}
//             onClick={() => setFilter(type)}
//             style={{
//               margin: '5px',
//               padding: '10px 15px',
//               backgroundColor: filter === type ? '#4fc9da' : '#e0f7fa',
//               color: filter === type ? '#fff' : '#333',
//               border: '1px solid #4fc9da',
//               borderRadius: '5px',
//               cursor: 'pointer',
//             }}
//           >
//             {type}
//           </button>
//         ))}
//       </div>

//       <div className="legend-bar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
//         {[
//           { type: 'Deliverable', color: '#9b9fe1', label: 'Deliverable' },
//           { type: 'Meeting', color: '#8fca8f', label: 'Meeting' },
//           { type: 'Milestone', color: 'orange', label: 'Milestone' },
//           { type: 'Other', color: '#a3f5f0', label: 'Other' },
//           // { type: 'MOTION', color: '#ffff70', label: 'Motion' },
//           // { type: 'HEARING', color: '#8df58c', label: 'AAA Hearing Date Time' },
//           // { type: 'OPPOSITION', color: '#f585f8', label: 'Motion Opposition Due Date' },
//         ].map((item) => (
//           <div
//             key={item.type}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               margin: '0 10px',
//             }}
//           >
//             <div
//               style={{
//                 width: '15px',
//                 height: '10px',
//                 backgroundColor: item.color,
//                 borderRadius: '3px',
//                 marginRight: '5px',
//               }}
//               className='btn btn-sm'
//             ></div>
//             <span style={{ fontSize: '14px', color: '#333' }}>{item.label}</span>
//           </div>
//         ))}
//       </div>

//       {/* Calendar Component */}
//       <div className='pt-5' style={{ height: '600px' }}>
//         <Calendar
//           localizer={localizer}
//           events={data}
//           startAccessor="start"
//           endAccessor="end"
//           selectable
//           onSelectSlot={handleDateClick}
//           onSelectEvent={handleEventClick}
//           onShowMore={handleShowMore}
//           style={{ minWidth: '0px', height: '100%', width: "100%" }}
//           eventPropGetter={eventStyleGetter}
//           defaultView="month"
//           views={['month', 'week', 'day']} // Specify the views you want
//           popup
//         />
//       </div>

//       {/* Modal for Adding Events */}
//       {console.log("isModalOpen", isModalOpen)}
//       {console.log("isModalOpen", selectedDateEvents)}
//       {isModalOpen && selectedDateEvents && selectedDateEvents.length === 0 && (
//         <div
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             background: 'rgba(0, 0, 0, 0.7)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               position: 'relative', // Ensures close button is positioned relative to this div
//               background: '#fff',
//               padding: '30px',
//               borderRadius: '12px',
//               width: '450px',
//               maxWidth: '90%',
//               textAlign: 'center',
//               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
//               border: `3px solid #4fc9da`,
//             }}
//           >
//             <button
//               onClick={handleCloseModal}
//               style={{
//                 position: 'absolute', // Positioned relative to parent div
//                 top: '10px',
//                 right: '10px',
//                 background: 'none',
//                 border: 'none',
//                 color: '#4fc9da',
//                 fontSize: '20px',
//                 fontWeight: 'bold',
//                 cursor: 'pointer',
//                 transition: 'color 0.3s ease',
//                 zIndex: 1100, // Ensure it's on top of other elements
//               }}
//               onMouseOver={(e) => (e.target.style.color = '#39b0c1')}
//               onMouseOut={(e) => (e.target.style.color = '#4fc9da')}
//             >
//               &times;
//             </button>
//             <h3
//               style={{
//                 marginBottom: '20px',
//                 color: '#4fc9da',
//                 fontWeight: 'bold',
//               }}
//             >
//               Add New Event
//             </h3>

//             <form
//               onSubmit={handleAddEvent}
//               style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: '15px',
//                 textAlign: 'left',
//               }}
//             >
//               <input
//                 type="text"
//                 name="clientName"
//                 className='p-2 fs-7 '
//                 placeholder="Client Name"
//                 value={newEvent.clientName}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   padding: '12px',
//                   borderRadius: '8px',
//                   border: `1px solid #4fc9da`,
//                 }}
//               />
//               <input
//                 type="text"
//                 name="title"
//                 className='p-2 fs-7 '
//                 placeholder="Event Title"
//                 value={newEvent.title}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   padding: '12px',
//                   borderRadius: '8px',
//                   border: `1px solid #4fc9da`,
//                 }}
//               />
//               <input
//                 type="datetime-local"
//                 name="start"
//                 className='p-2 fs-7 '
//                 value={newEvent.start}
//                 onChange={handleInputChange}
//                 required
//                 style={{

//                   borderRadius: '8px',
//                   border: `1px solid #4fc9da`,
//                 }}
//               />
//               <input
//                 type="datetime-local"
//                 name="end"
//                 className='p-2 fs-7 '
//                 value={newEvent.end}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   padding: '12px',
//                   borderRadius: '8px',
//                   border: `1px solid #4fc9da`,
//                 }}
//               />
//               <select
//                 name="type"
//                 className='p-2 fs-7 '
//                 value={newEvent.type}
//                 onChange={handleInputChange}
//                 style={{
//                   padding: '12px',
//                   borderRadius: '8px',
//                   border: `1px solid #4fc9da`,
//                 }}
//               >
//                 <option value="Deliverable">Deliverable</option>
//                 <option value="Meeting">Meeting</option>
//                 <option value="Milestone">Milestone</option>
//                 <option value="Other">Other</option>
//               </select>
//               <textarea
//                 name="description"
//                 placeholder="Description (Optional)"
//                 value={newEvent.description}
//                 onChange={handleInputChange}
//                 style={{
//                   padding: '12px',
//                   borderRadius: '8px',
//                   border: `1px solid #4fc9da`,
//                 }}
//               />
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xls,.xlsx"
//                 onChange={handleFileChange}
//                 style={{
//                   padding: '5px',
//                   borderRadius: '8px',
//                   border: `1px solid #4fc9da`,
//                 }}
//               />
//               {fileName && (
//                 <p style={{ fontSize: '14px', color: '#555' }}>
//                   Attached File: <strong>{fileName}</strong>
//                 </p>
//               )}
//               <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   style={{
//                     flex: 1,
//                     padding: '10px',
//                     backgroundColor: '#e0f7fa',
//                     color: '#4fc9da',
//                     border: 'none',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   style={{
//                     flex: 1,
//                     padding: '10px',
//                     backgroundColor: '#4fc9da',
//                     color: '#fff',
//                     border: 'none',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                   }}
//                 >
//                   Add Event
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//       )}

//       {/* Modal for Viewing More Events */}
//       {console.log("2.isModalOpen", isModalOpen)}
//       {console.log("2.isModalOpen", selectedDateEvents)}
//       {/* {isModalOpen && selectedDateEvents.length > 0 && (
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
//               textAlign: 'left',
//               boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//             }}
//           >
//             <h2>Events on {selectedDateEvents[0]?.start.toLocaleDateString()}</h2>
//             <ul>
//               {selectedDateEvents.map((event) => (
//                 <li key={event.id}>
//                   <strong>{event.title}</strong> <br />
//                   {moment(event.start).format('hh:mm A')} - {moment(event.end).format('hh:mm A')}
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={() => setIsModalOpen(false)}
//               style={{
//                 background: '#007bff',
//                 color: '#fff',
//                 border: 'none',
//                 padding: '10px 20px',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )} */}

//       {/* Event Details Modal */}
//       {selectedEvent && (

//         <div
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             background: 'rgba(0, 0, 0, 0.6)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               background: '#fff',
//               borderRadius: '12px',
//               padding: '20px',
//               width: '500px',
//               maxWidth: '90%',
//               textAlign: 'left',
//               boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
//               transform: 'scale(1)',
//               transition: 'transform 0.3s ease-in-out',
//             }}
//           >
//             <div
//               style={{
//                 borderBottom: `2px solid #4fc9da`,
//                 marginBottom: '20px',
//                 paddingBottom: '10px',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//               }}
//             >
//               <h3
//                 style={{
//                   margin: 0,
//                   fontSize: '19px',
//                   color: '#333',
//                   fontWeight: 'bold',
//                 }}
//               >
//                 {selectedEvent.title}
//               </h3>
//               <button
//                 onClick={handleCloseModal}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   color: '#4fc9da',
//                   fontSize: '20px',
//                   cursor: 'pointer',
//                   transition: 'color 0.3s ease',
//                 }}
//                 onMouseOver={(e) => (e.target.style.color = '#39b0c1')}
//                 onMouseOut={(e) => (e.target.style.color = '#4fc9da')}
//               >
//                 &times;
//               </button>
//             </div>
//             <p style={{ margin: '10px 0', color: '#555', fontSize: '16px' }}>
//               <strong style={{ color: '#4fc9da' }}>Type:</strong> {selectedEvent.type}
//             </p>
//             <p style={{ margin: '10px 0', color: '#555', fontSize: '16px' }}>
//               <strong style={{ color: '#4fc9da' }}>Description:</strong>{' '}
//               {selectedEvent.description}
//             </p>
//             <p style={{ margin: '10px 0', color: '#555', fontSize: '16px' }}>
//               <strong style={{ color: '#4fc9da' }}>Start:</strong>{' '}
//               {selectedEvent.start.toString()}
//             </p>
//             <p style={{ margin: '10px 0', color: '#555', fontSize: '16px' }}>
//               <strong style={{ color: '#4fc9da' }}>End:</strong>{' '}
//               {selectedEvent.end.toString()}
//             </p>
//             {selectedEvent.file && (
//               <p style={{ margin: '15px 0', fontSize: '16px' }}>
//                 <strong style={{ color: '#4fc9da' }}>Attachment:</strong>{' '}
//                 <a
//                   href={selectedEvent.file}
//                   download
//                   style={{
//                     color: '#4fc9da',
//                     textDecoration: 'none',
//                     fontWeight: 'bold',
//                   }}
//                   onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
//                   onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
//                 >
//                   Download File
//                 </a>
//               </p>
//             )}
//             <button
//               className='btn btn-sm'
//               onClick={handleCloseModal}
//               style={{
//                 background: '#4fc9da',
//                 color: '#ffffff',
//                 border: 'none',
//                 borderRadius: '6px',

//                 fontWeight: 'bold',
//                 cursor: 'pointer',

//                 marginTop: '20px',

//               }}

//             >
//               Close
//             </button>
//           </div>
//         </div>

//       )}
//     </div>
//   );
// };

// export default ErrorCard;




// import React, { useState } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// // import "../../assets/css/calender.css"
// import MiniCalendar from 'react-calendar';
// import "../../assets/css/calender.css"
// // import Notification from "../components/casetracker/Notification";

// const localizer = momentLocalizer(moment);

// const ErrorCard = () => {
//   const [timezone, setTimezone] = useState('UTC');
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentDate, setCurrentDate] = useState(new Date());

//   const [selectedDateEvents, setSelectedDateEvents] = useState([]);
//   const [filter, setFilter] = useState('ALL');
//   const [data, setData] = useState([
//     {
//       id: 1,
//       title: 'Task: Complete Report [001]',
//       start: new Date('2024-12-30T10:00:00Z'),
//       end: new Date('2024-12-30T11:00:00Z'),
//       type: 'Deliverable',
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
//       id: 2,
//       title: 'Event: Team Meeting [002]',
//       start: new Date('2024-12-31T13:00:00Z'),
//       end: new Date('2024-12-31T14:00:00Z'),
//       type: 'event',
//       description: 'Discuss project progress and assign new tasks.',
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
//       id: 2,
//       title: 'Event: Team Meeting [002]',
//       start: new Date('2024-12-31T13:00:00Z'),
//       end: new Date('2024-12-31T14:00:00Z'),
//       type: 'event',
//       description: 'Discuss project progress and assign new tasks.',

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
//     file: [],
//   });
//   const [fileName, setFileName] = useState([]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files); // Convert FileList to an array
//     setFileName((prevFileNames) => {
//       const uniqueFiles = selectedFiles.filter(
//         (newFile) => !prevFileNames.some((prevFile) => prevFile.name === newFile.name)
//       );
//       return [...prevFileNames, ...uniqueFiles]; // Combine new and previous files
//     });
//   };

//   const removeFile = (index) => {
//     setFileName((prevFileNames) =>
//       prevFileNames.filter((_, i) => i !== index) // Remove file at the specified index
//     );
//   };


//   const eventStyleGetter = (event) => {
//     const colors = {
//       Deliverable: '#9b9fe1',
//       SCHEDULE: '#8fca8f',
//       FOLLOWUP: 'orange',
//       TRIAL: '#a3f5f0',
//       MOTION: '#ffff70',
//       HEARING: '#8df58c',
//       OPPOSITION: '#f585f8',
//     };
//     let backgroundColor;
//     switch (event.type) {
//       case 'Deliverable':
//         backgroundColor = '#9b9fe1';
//         break;
//       case 'event':
//         backgroundColor = '#8fca8f';
//         break;
//       case 'follow-up':
//         backgroundColor = 'orange';
//         break;
//       case 'call':
//         backgroundColor = '#f27070';
//         break;
//       default:
//         backgroundColor = 'gray';
//     }
//     return {
//       style: {
//         backgroundColor,
//         color: 'white',
//         borderRadius: '5px',
//         padding: '5px',
//       },
//     };
//   };

//   const handleEventClick = (event) => {
//     setSelectedEvent(event);
//   };

//   const handleShowMore = (events) => {
//     console.log("onShowMore triggered:", events);
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

//   const handleMiniCalendarChange = (date) => {
//     setCurrentDate(date);
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
//   const filteredEvents =
//     filter === 'ALL' ? data : data.filter((event) => event.type === filter);


//   const [selectedNotifications, setSelectedNotifications] = useState([]);
//   const notificationOptions = ['Abhimanyu', 'Sandesh', 'chinmay.n', 'csoundy', 'testmember23', 'Bob.P', 'pragati.kop'];

//   const toggleNotification = (name) => {
//     setSelectedNotifications((prev) =>
//       prev.includes(name)
//         ? prev.filter((n) => n !== name) // Remove if already selected
//         : [...prev, name] // Add if not selected
//     );
//   };




//   return (
//     <div className='py-2 p-2 pt-3'>

//       <div className="mb-3">
//         {['ALL', 'Deliverable', 'Meeting', 'Milestone', "Other"].map((type) => (
//           <button
//             key={type}
//             onClick={() => setFilter(type)}
//             style={{
//               margin: '5px',
//               padding: '10px 15px',
//               backgroundColor: filter === type ? '#4fc9da' : '#e0f7fa',
//               color: filter === type ? '#fff' : '#333',
//               border: '1px solid #4fc9da',
//               borderRadius: '5px',
//               cursor: 'pointer',
//             }}
//           >
//             {type}
//           </button>
//         ))}
//       </div>

//       <div className="legend-bar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
//         {[
//           { type: 'Deliverable', color: '#9b9fe1', label: 'Deliverable' },
//           { type: 'Meeting', color: '#8fca8f', label: 'Meeting' },
//           { type: 'Milestone', color: 'orange', label: 'Milestone' },
//           { type: 'Other', color: '#a3f5f0', label: 'Other' },
//           // { type: 'MOTION', color: '#ffff70', label: 'Motion' },
//           // { type: 'HEARING', color: '#8df58c', label: 'AAA Hearing Date Time' },
//           // { type: 'OPPOSITION', color: '#f585f8', label: 'Motion Opposition Due Date' },
//         ].map((item) => (
//           <div
//             key={item.type}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               margin: '0 10px',
//             }}
//           >
//             <div
//               style={{
//                 width: '15px',
//                 height: '10px',
//                 backgroundColor: item.color,
//                 borderRadius: '3px',
//                 marginRight: '5px',
//               }}
//               className='btn btn-sm'
//             ></div>
//             <span style={{ fontSize: '14px', color: '#333' }}>{item.label}</span>
//           </div>
//         ))}
//       </div>

//       {/* Calendar Component */}
//       <div style={{ width: '295px' }}>
//         <MiniCalendar
//           onChange={handleMiniCalendarChange}
//           value={currentDate}
//         />
//       </div>
//       <div className='pt-5' style={{ height: '600px' }}>
//         <Calendar
//           localizer={localizer}
//           events={data}
//           startAccessor="start"
//           endAccessor="end"
//           selectable
//           onSelectSlot={handleDateClick}
//           onSelectEvent={handleEventClick}
//           onShowMore={handleShowMore}
//           style={{ minWidth: '0px', height: '100%', width: "100%" }}
//           eventPropGetter={eventStyleGetter}
//           date={currentDate}
//           onNavigate={(date) => setCurrentDate(date)}
//           defaultView="month"
//           views={['month', 'week', 'day']} // Specify the views you want
//           popup
//         />
//       </div>

//       {/* Modal for Adding Events */}
//       {isModalOpen && selectedDateEvents && selectedDateEvents.length === 0 && (
//         //   <div
//         //   style={{
//         //     position: 'fixed',
//         //     top: 0,
//         //     left: 0,
//         //     width: '100%',
//         //     height: '100%',
//         //     background: 'rgba(0, 0, 0, 0.75)',
//         //     display: 'flex',
//         //     justifyContent: 'center',
//         //     alignItems: 'center',
//         //     zIndex: 1000,
//         //     animation: 'fadeIn 0.3s ease-out',
//         //     overflowY: 'auto', // Allow scrolling for the modal background
//         //   }}
//         // >
//         //   <div
//         //     style={{
//         //       position: 'relative',
//         //       background: 'linear-gradient(135deg, #ffffff, #e0f7fa)',
//         //       padding: '40px',
//         //       borderRadius: '16px',
//         //       width: '600px',
//         //       maxWidth: '95%',
//         //       maxHeight: '90%', // Limit the modal height
//         //       overflowY: 'auto', // Make content scrollable if it exceeds the height
//         //       textAlign: 'center',
//         //       boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)',
//         //       border: `3px solid #4fc9da`,
//         //     }}
//         //   >
//         //     <button
//         //       onClick={handleCloseModal}
//         //       style={{
//         //         position: 'absolute',
//         //         top: '15px',
//         //         right: '15px',
//         //         background: 'none',
//         //         border: 'none',
//         //         color: '#4fc9da',
//         //         fontSize: '24px',
//         //         cursor: 'pointer',
//         //         zIndex: 1100,
//         //         transition: 'color 0.3s ease',
//         //       }}
//         //     >
//         //       <i className="fa fa-times"></i>
//         //     </button>
//         //     <h3
//         //       style={{
//         //         marginBottom: '20px',
//         //         color: '#00796b',
//         //         fontWeight: 'bold',
//         //         fontSize: '26px',
//         //       }}
//         //     >
//         //       Add New Event
//         //     </h3>

//         //     <form
//         //       onSubmit={handleAddEvent}
//         //       style={{
//         //         display: 'grid',
//         //         gridTemplateColumns: 'repeat(2, 1fr)',
//         //         gap: '20px',
//         //         textAlign: 'left',
//         //       }}
//         //     >
//         //       <div className='row'>
//         //         <div className='col-md-6'></div>
//         //       </div>
//         //       <input
//         //         type="text"
//         //         name="clientName"
//         //         placeholder="Client Name"
//         //         value={newEvent.clientName}
//         //         onChange={handleInputChange}
//         //         required
//         //         style={{
//         //           padding: '14px',
//         //           borderRadius: '8px',
//         //           border: `1px solid #4fc9da`,
//         //           gridColumn: 'span 2',
//         //           boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//         //         }}
//         //       />
//         //       <input
//         //         type="text"
//         //         name="title"
//         //         placeholder="Event Title"
//         //         value={newEvent.title}
//         //         onChange={handleInputChange}
//         //         required
//         //         style={{
//         //           padding: '14px',
//         //           borderRadius: '8px',
//         //           border: `1px solid #4fc9da`,
//         //           gridColumn: 'span 2',
//         //           boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//         //         }}
//         //       />
//         //       <input
//         //         type="datetime-local"
//         //         name="start"
//         //         value={newEvent.start}
//         //         onChange={handleInputChange}
//         //         required
//         //         style={{
//         //           padding: '14px',
//         //           borderRadius: '8px',
//         //           border: `1px solid #4fc9da`,
//         //           boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//         //         }}
//         //       />
//         //       <input
//         //         type="datetime-local"
//         //         name="end"
//         //         value={newEvent.end}
//         //         onChange={handleInputChange}
//         //         required
//         //         style={{
//         //           padding: '14px',
//         //           borderRadius: '8px',
//         //           border: `1px solid #4fc9da`,
//         //           boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//         //         }}
//         //       />
//         //       <select
//         //         name="type"
//         //         value={newEvent.type}
//         //         onChange={handleInputChange}
//         //         style={{
//         //           padding: '14px',
//         //           borderRadius: '8px',
//         //           border: `1px solid #4fc9da`,
//         //           gridColumn: 'span 2',
//         //           boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//         //         }}
//         //       >
//         //         <option value="Deliverable">Deliverable</option>
//         //         <option value="Meeting">Meeting</option>
//         //         <option value="Milestone">Milestone</option>
//         //         <option value="Other">Other</option>
//         //       </select>
//         //       <textarea
//         //         name="description"
//         //         placeholder="Description (Optional)"
//         //         value={newEvent.description}
//         //         onChange={handleInputChange}
//         //         style={{
//         //           padding: '14px',
//         //           borderRadius: '8px',
//         //           border: `1px solid #4fc9da`,
//         //           gridColumn: 'span 2',
//         //           boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//         //         }}
//         //       />
//         //       <div
//         //         style={{
//         //           gridColumn: 'span 2',
//         //           border: '2px dashed #4fc9da',
//         //           padding: '20px',
//         //           textAlign: 'center',
//         //           borderRadius: '8px',
//         //           position: 'relative',
//         //         }}
//         //       >
//         //         <label
//         //           style={{
//         //             display: 'block',
//         //             marginBottom: '10px',
//         //             fontSize: '14px',
//         //             fontWeight: 'bold',
//         //             color: '#4fc9da',
//         //           }}
//         //         >
//         //           Upload Files
//         //         </label>
//         //         <input
//         //           type="file"
//         //           multiple
//         //           accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xls,.xlsx"
//         //           onChange={handleFileChange}
//         //           style={{
//         //             display: 'block',
//         //             margin: '0 auto',
//         //             padding: '10px',
//         //             border: '1px solid #4fc9da',
//         //             borderRadius: '5px',
//         //           }}
//         //         />
//         //         {fileName.length > 0 && (
//         //           <div
//         //             style={{
//         //               maxHeight: '150px',
//         //               overflowY: 'auto',
//         //               border: '1px solid #e0e0e0',
//         //               borderRadius: '5px',
//         //               padding: '10px',
//         //               marginTop: '10px',
//         //               textAlign: 'left',
//         //               backgroundColor: '#f9f9f9',
//         //             }}
//         //           >
//         //             <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
//         //               {fileName.map((file, index) => (
//         //                 <li
//         //                   key={index}
//         //                   style={{
//         //                     display: 'flex',
//         //                     justifyContent: 'space-between',
//         //                     alignItems: 'center',
//         //                     padding: '5px 0',
//         //                     borderBottom: index !== fileName.length - 1 ? '1px solid #ddd' : 'none',
//         //                   }}
//         //                 >
//         //                   <span
//         //                     style={{
//         //                       fontSize: '14px',
//         //                       color: '#555',
//         //                       overflow: 'hidden',
//         //                       textOverflow: 'ellipsis',
//         //                       whiteSpace: 'nowrap',
//         //                     }}
//         //                   >
//         //                     {file.name}
//         //                   </span>
//         //                   <button
//         //                     onClick={() => removeFile(index)}
//         //                     style={{
//         //                       background: 'none',
//         //                       border: 'none',
//         //                       color: 'red',
//         //                       fontSize: '12px',
//         //                       cursor: 'pointer',
//         //                     }}
//         //                   >
//         //                     Remove
//         //                   </button>
//         //                 </li>
//         //               ))}
//         //             </ul>
//         //           </div>
//         //         )}
//         //       </div>
//         //       <div
//         //         style={{
//         //           display: 'flex',
//         //           justifyContent: 'space-between',
//         //           gap: '10px',
//         //           gridColumn: 'span 2',
//         //         }}
//         //       >
//         //         <button
//         //           type="button"
//         //           onClick={() => setIsModalOpen(false)}
//         //           style={{
//         //             flex: 1,
//         //             padding: '12px',
//         //             backgroundColor: '#e0f7fa',
//         //             color: '#00796b',
//         //             border: 'none',
//         //             borderRadius: '5px',
//         //             cursor: 'pointer',
//         //             transition: 'background-color 0.3s ease',
//         //           }}
//         //         >
//         //           Cancel
//         //         </button>
//         //         <button
//         //           type="submit"
//         //           style={{
//         //             flex: 1,
//         //             padding: '12px',
//         //             backgroundColor: '#4fc9da',
//         //             color: '#fff',
//         //             border: 'none',
//         //             borderRadius: '5px',
//         //             cursor: 'pointer',
//         //             transition: 'background-color 0.3s ease',
//         //           }}
//         //         >
//         //           Add Event
//         //         </button>
//         //       </div>
//         //     </form>
//         //   </div>
//         // </div>

//         <div
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             background: 'rgba(0, 0, 0, 0.75)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000,
//             animation: 'fadeIn 0.3s ease-out',
//             overflowY: 'auto',
//           }}
//         >
//           <div
//             style={{
//               position: 'relative',
//               background: 'linear-gradient(135deg, #ffffff, #e0f7fa)',
//               padding: '40px',
//               borderRadius: '16px',
//               width: '600px',
//               maxWidth: '95%',
//               maxHeight: '90%',
//               overflowY: 'auto',
//               textAlign: 'center',
//               boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)',
//               border: `3px solid #4fc9da`,
//             }}
//           >
//             <button
//               onClick={handleCloseModal}
//               style={{
//                 position: 'absolute',
//                 top: '15px',
//                 right: '15px',
//                 background: 'none',
//                 border: 'none',
//                 color: '#4fc9da',
//                 fontSize: '24px',
//                 cursor: 'pointer',
//                 zIndex: 1100,
//                 transition: 'color 0.3s ease',
//               }}
//             >
//               <i className="fa fa-times"></i>
//             </button>
//             <h3
//               className='text-black'
//               style={{
//                 marginBottom: '20px',
//                 // color: '#00796b',
//                 fontWeight: 'bold',
//                 // fontSize: '26px',
//               }}
//             >
//               Add New Event
//             </h3>

//             {/* Form */}
//             <form
//               onSubmit={handleAddEvent}
//               style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: '15px',
//               }}
//             >
//               {/* Basic Input Fields */}
//               <input
//                 type="text"
//                 name="clientName"
//                 placeholder="Client Name"
//                 value={newEvent.clientName}
//                 onChange={handleInputChange}
//                 className='p-2'
//                 required
//                 style={{
//                   borderRadius: '8px',
//                   border: `1px solid #4fc9da`,
//                   outline: 'none',
//                 }}
//               />

//               <input
//                 type="text"
//                 name="title"
//                 className='p-2'
//                 placeholder="Event Title"
//                 value={newEvent.title}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   borderRadius: '8px',
//                   border: `1px solid #4fc9da`,
//                   outline: 'none',
//                 }}
//               />
//               <div
//                 style={{
//                   display: 'flex',
//                   gap: '10px',
//                 }}
//               >
//                 <input
//                   type="datetime-local"
//                   name="start"
//                   className='p-2'
//                   value={newEvent.start}
//                   onChange={handleInputChange}
//                   required
//                   style={{
//                     borderRadius: '8px',
//                     border: `1px solid #4fc9da`,
//                     outline: 'none',
//                     flex: 1,
//                   }}
//                 />
//                 <input
//                   type="datetime-local"
//                   name="end"
//                   className='p-2'
//                   value={newEvent.end}
//                   onChange={handleInputChange}
//                   required
//                   style={{
//                     borderRadius: '8px',
//                     border: `1px solid #4fc9da`,
//                     outline: 'none',
//                     flex: 1,
//                   }}
//                 />
//               </div>
//               <select
//                 name="type"
//                 className='p-2'
//                 value={newEvent.type}
//                 onChange={handleInputChange}
//                 style={{
//                   borderRadius: '8px',
//                   border: `1px solid #4fc9da`,
//                   outline: 'none',
//                   background: "#fff"
//                 }}
//               >
//                 <option value="Deliverable">Deliverable</option>
//                 <option value="Meeting">Meeting</option>
//                 <option value="Milestone">Milestone</option>
//                 <option value="Other">Other</option>
//               </select>

//               <textarea
//                 name="description"
//                 className='p-2'
//                 placeholder="Description (Optional)"
//                 value={newEvent.description}
//                 onChange={handleInputChange}
//                 style={{
//                   borderRadius: '8px',
//                   border: `1px solid #4fc9da`,
//                   outline: 'none',
//                   width: '100%',
//                 }}
//               />

//               {/* Notifications Section */}
//               <div
//                 style={{
//                   background: '#eaf7fa',
//                   padding: '15px',
//                   borderRadius: '8px',
//                   border: `1px solid #4fc9da`,
//                   outline: 'none',
//                   textAlign: 'left',
//                 }}
//               >
//                 <h5
//                   style={{
//                     marginBottom: '10px',
//                     fontSize: '16px',
//                     fontWeight: '600',

//                   }}
//                 >
//                   Notifications
//                 </h5>
//                 <div
//                   style={{
//                     maxHeight: '150px',
//                     overflowY: 'auto',
//                     border: '1px solid #ddd',
//                     padding: '10px',
//                     borderRadius: '8px',
//                     background: '#fff',
//                   }}
//                 >
//                   {notificationOptions.map((name, index) => (
//                     <label
//                       key={index}
//                       style={{
//                         display: 'inline-block',
//                         margin: '5px',
//                         padding: '5px 10px',
//                         borderRadius: '5px',
//                         border: '1px solid #ddd',
//                         background: '#f9f9f9',
//                         cursor: 'pointer',
//                         userSelect: 'none',
//                       }}
//                     >
//                       <input
//                         type="checkbox"
//                         name="notifications"
//                         className='p-2'
//                         value={name}
//                         checked={selectedNotifications.includes(name)}
//                         onChange={() => toggleNotification(name)}
//                         style={{
//                           marginRight: '8px',
//                           cursor: 'pointer',
//                         }}
//                       />
//                       {name}
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* File Upload */}
//               <div
//                 style={{
//                   padding: '15px',
//                   borderRadius: '8px',
//                   border: '1px dashed #4fc9da',
//                   // border: `1px solid #4fc9da`,
//                   outline: 'none',
//                   background: '#eaf7fa',
//                   textAlign: 'center',
//                 }}
//               >
//                 {/* <label
//           style={{
//             fontSize: '14px',
//             fontWeight: '600',
//             color: '#777',
//             marginBottom: '10px',
//             display: 'block',
//           }}
//         >
//           Upload Files
//         </label> */}
//                 <input
//                   type="file"
//                   multiple
//                   className='p-2'
//                   accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xls,.xlsx"
//                   onChange={handleFileChange}
//                   style={{
//                     padding: '10px',
//                     border: '1px solid #ddd',
//                     borderRadius: '5px',
//                     width: '100%',
//                     background: '#fff',
//                   }}
//                 />
//                 {fileName.length > 0 && (
//                   <div
//                     style={{
//                       marginTop: '10px',
//                       maxHeight: '100px',
//                       overflowY: 'auto',
//                       border: '1px solid #eee',
//                       borderRadius: '5px',
//                       padding: '10px',
//                       background: '#f9f9f9',
//                     }}
//                   >
//                     <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
//                       {fileName.map((file, index) => (
//                         <li
//                           key={index}
//                           style={{
//                             display: 'flex',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                             marginBottom: '5px',
//                           }}
//                         >
//                           <span
//                             style={{
//                               fontSize: '14px',
//                               color: '#555',
//                               overflow: 'hidden',
//                               textOverflow: 'ellipsis',
//                               whiteSpace: 'nowrap',
//                               flex: 1,
//                             }}
//                           >
//                             {file.name}
//                           </span>
//                           <button
//                             onClick={() => removeFile(index)}
//                             style={{
//                               background: 'none',
//                               border: 'none',
//                               color: 'red',
//                               fontSize: '12px',
//                               cursor: 'pointer',
//                               marginLeft: '10px',
//                             }}
//                           >
//                             Remove
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>

//               {/* Buttons */}
//               <div
//                 style={{
//                   display: 'flex',
//                   gap: '10px',
//                 }}
//               >
//                 <button
//                   type="button"
//                   className="button-cancel p-2"
//                   aria-label="Cancel the action"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="p-2 btn btn-sm p-3"
//                   style={{
//                     flex: 1,
//                     backgroundColor: '#4fc9da',
//                     color: '#fff',
//                     border: 'none',
//                     borderRadius: '8px',
//                     cursor: 'pointer',
//                   }}
//                 >
//                   Add Event
//                 </button>

//               </div>
//             </form>
//           </div>
//         </div>

//       )}

//       {/* Modal for Viewing More Events */}
//       {/* {isModalOpen && selectedDateEvents.length > 0 && (
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
//               textAlign: 'left',
//               boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//             }}
//           >
//             <h2>Events on {selectedDateEvents[0]?.start.toLocaleDateString()}</h2>
//             <ul>
//               {selectedDateEvents.map((event) => (
//                 <li key={event.id}>
//                   <strong>{event.title}</strong> <br />
//                   {moment(event.start).format('hh:mm A')} - {moment(event.end).format('hh:mm A')}
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={() => setIsModalOpen(false)}
//               style={{
//                 background: '#007bff',
//                 color: '#fff',
//                 border: 'none',
//                 padding: '10px 20px',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )} */}

//       {/* Event Details Modal */}
//       {selectedEvent && (

//         <div
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             background: 'rgba(0, 0, 0, 0.6)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               background: '#fff',
//               borderRadius: '12px',
//               padding: '20px',
//               width: '500px',
//               maxWidth: '90%',
//               textAlign: 'left',
//               boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
//               transform: 'scale(1)',
//               transition: 'transform 0.3s ease-in-out',
//             }}
//           >
//             <div
//               style={{
//                 borderBottom: `2px solid #4fc9da`,
//                 marginBottom: '20px',
//                 paddingBottom: '10px',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//               }}
//             >
//               <h3
//                 style={{
//                   margin: 0,
//                   fontSize: '19px',
//                   color: '#333',
//                   fontWeight: 'bold',
//                 }}
//               >
//                 {selectedEvent.title}
//               </h3>
//               <button
//                 onClick={handleCloseModal}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   color: '#4fc9da',
//                   fontSize: '20px',
//                   cursor: 'pointer',
//                   transition: 'color 0.3s ease',
//                 }}
//                 onMouseOver={(e) => (e.target.style.color = '#39b0c1')}
//                 onMouseOut={(e) => (e.target.style.color = '#4fc9da')}
//               >
//                 &times;
//               </button>
//             </div>
//             <p style={{ margin: '10px 0', color: '#555', fontSize: '16px' }}>
//               <strong style={{ color: '#4fc9da' }}>Type:</strong> {selectedEvent.type}
//             </p>
//             <p style={{ margin: '10px 0', color: '#555', fontSize: '16px' }}>
//               <strong style={{ color: '#4fc9da' }}>Description:</strong>{' '}
//               {selectedEvent.description}
//             </p>
//             <p style={{ margin: '10px 0', color: '#555', fontSize: '16px' }}>
//               <strong style={{ color: '#4fc9da' }}>Start:</strong>{' '}
//               {selectedEvent.start.toString()}
//             </p>
//             <p style={{ margin: '10px 0', color: '#555', fontSize: '16px' }}>
//               <strong style={{ color: '#4fc9da' }}>End:</strong>{' '}
//               {selectedEvent.end.toString()}
//             </p>
//             {selectedEvent.file && (
//               <p style={{ margin: '15px 0', fontSize: '16px' }}>
//                 <strong style={{ color: '#4fc9da' }}>Attachment:</strong>{' '}
//                 <a
//                   href={selectedEvent.file}
//                   download
//                   style={{
//                     color: '#4fc9da',
//                     textDecoration: 'none',
//                     fontWeight: 'bold',
//                   }}
//                   onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
//                   onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
//                 >
//                   Download File
//                 </a>
//               </p>
//             )}
//             <button
//               className='btn btn-sm'
//               onClick={handleCloseModal}
//               style={{
//                 background: '#4fc9da',
//                 color: '#ffffff',
//                 border: 'none',
//                 borderRadius: '6px',

//                 fontWeight: 'bold',
//                 cursor: 'pointer',

//                 marginTop: '20px',

//               }}

//             >
//               Close
//             </button>
//           </div>
//         </div>

//       )}
//     </div>
//   );
// };

// export default ErrorCard;



import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Custom Toolbar Component
const CustomToolbar = (props) => {
  const goToBack = () => {
    const view = props.view;
    const date = props.date;
    const newDate =
      view === 'month'
        ? moment(date).subtract(1, 'month')
        : view === 'week'
        ? moment(date).subtract(1, 'week')
        : moment(date).subtract(1, 'day');
    props.onNavigate('PREV', newDate.toDate());
  };

  const goToNext = () => {
    const view = props.view;
    const date = props.date;
    const newDate =
      view === 'month'
        ? moment(date).add(1, 'month')
        : view === 'week'
        ? moment(date).add(1, 'week')
        : moment(date).add(1, 'day');
    props.onNavigate('NEXT', newDate.toDate());
  };

  const goToToday = () => {
    props.onNavigate('TODAY', new Date());
  };

  const changeView = (view) => {
    props.onView(view);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        backgroundColor: '#4fc9da',
        color: '#fff',
        borderRadius: '8px',
      }}
    >
      <div>
        <button onClick={goToBack} style={buttonStyle}>
          &#8249;
        </button>
        <button onClick={goToToday} style={buttonStyle}>
          Today
        </button>
        <button onClick={goToNext} style={buttonStyle}>
          &#8250;
        </button>
      </div>
      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
        {moment(props.date).format('MMMM YYYY')}
      </span>
      <div>
        <button
          onClick={() => changeView('month')}
          style={viewButtonStyle(props.view === 'month')}
        >
          Month
        </button>
        <button
          onClick={() => changeView('week')}
          style={viewButtonStyle(props.view === 'week')}
        >
          Week
        </button>
        <button
          onClick={() => changeView('day')}
          style={viewButtonStyle(props.view === 'day')}
        >
          Day
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  background: 'none',
  border: '1px solid #fff',
  borderRadius: '4px',
  color: '#fff',
  padding: '5px 10px',
  cursor: 'pointer',
  margin: '0 5px',
  fontSize: '14px',
};

const viewButtonStyle = (isActive) => ({
  ...buttonStyle,
  backgroundColor: isActive ? '#00796b' : 'transparent',
});

// Main Component
const ErrorCard = () => {
  const localizer = momentLocalizer(moment);
  const events = [
    {
      id: 1,
      title: 'Task: Complete Report',
      start: new Date('2025-01-03T10:00:00'),
      end: new Date('2025-01-03T12:00:00'),
    },
    // Other events
  ];

  return (
    <Calendar
      localizer={localizer}
      events={events}
      defaultView="month"
      style={{ height: '600px', margin: '20px' }}
      components={{
        toolbar: CustomToolbar,
      }}
    />
  );
};

export default ErrorCard;

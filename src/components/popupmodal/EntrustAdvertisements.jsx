import React from 'react';

export const EntrustAdvertisements = ({ closed }) => {
  return (
    <>
      <div style={styles.modalBackdrop}>
        <div style={styles.modalContent}>
          <button onClick={closed} style={styles.closeButton}>
            &times;
          </button>
          <h2 style={styles.header}>Helpful Resources to Get You Started</h2>
          <p>We’ve prepared training materials to help you familiarize yourself with Entrust 2.0:</p>

          <h3 style={styles.subHeader}>Training Video</h3>
          <iframe
            width="100%"
            height="250"
            src="https://www.youtube.com/embed/c6P90VsTlDs?start=1"
            title="Entrust 2.0 Training Video"
            style={{ border: 'none', borderRadius: '8px' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          <a
            href="https://images.neuralit.com/sites/default/files/entrust_user_guide_0.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            Download Entrust User Guide
          </a>
        </div>
      </div>
    </>
  );
};

// Styles for the modal and content
const styles = {
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContent: {
    position: 'relative',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '2rem',
    // color: '#333',
    color: 'red',
    cursor: 'pointer',
  },
  header: {
    margin: '0 0 10px',
    fontSize: '1.5rem',
    color: '#333',
    lineHeight: '1.2',
  },
  subHeader: {
    margin: '15px 0 10px',
    fontSize: '1.2rem',
    color: '#555',
    lineHeight: '1.4',
  },
  iframe: {
    border: 'none',
    borderRadius: '8px',
    width: '100%', // Ensures iframe adapts to the modal width
    maxWidth: '480px',
    height: '250px',
  },
  link: {
    display: 'inline-block',
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  '@media (max-width: 768px)': {
    modalContent: {
      width: '95%',
      maxWidth: '400px',
      padding: '15px',
    },
    iframe: {
      height: '200px',
    },
  },
  '@media (max-width: 480px)': {
    modalContent: {
      width: '100%',
      maxWidth: '100%',
      padding: '10px',
    },
    iframe: {
      height: '150px',
    },
    header: {
      fontSize: '1.2rem',
    },
    subHeader: {
      fontSize: '1rem',
    },
  },
};

export default EntrustAdvertisements;










// import React from 'react';

// export const EntrustAdvertisements = ({ closed }) => {
//   return (
//     <>
//       <div style={styles.modalBackdrop}>
//         <div style={styles.modalContent}>
//           <button onClick={closed} style={styles.closeButton}>
//             &times;
//           </button>
//           <h2 style={styles.header}>Helpful Resources to Get You Started</h2>
//           <p>We’ve prepared training materials to help you familiarize yourself with Entrust 2.0:</p>

//           <h3 style={styles.subHeader}>Training Video</h3>
//           <iframe
//             width="100%"
//             height="250"
//             src="https://www.youtube.com/embed/c6P90VsTlDs?start=1"
//             title="Entrust 2.0 Training Video"
//             style={{ border: 'none', borderRadius: '8px' }}
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           ></iframe>

//           <a
//             href="https://images.neuralit.com/sites/default/files/entrust_user_guide_0.pdf"
//             target="_blank"
//             rel="noopener noreferrer"
//             style={styles.link}
//           >
//             Download Entrust User Guide
//           </a>
//         </div>
//       </div>
//     </>
//   );
// };

// // Styles for the modal and content
// const styles = {
//   modalBackdrop: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 9999,
//   },
//   modalContent: {
//     position: 'relative',
//     backgroundColor: 'white',
//     padding: '20px',
//     borderRadius: '8px',
//     textAlign: 'center',
//     width: '90%',
//     maxWidth: '500px',
//     boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: '0px',
//     right: '0px',
//     backgroundColor: 'transparent',
//     border: 'none',
//     fontSize: '2rem',
//     color: '#333',
//     cursor: 'pointer',
//     // color: "red",
//   },
//   header: {
//     margin: '0 0 10px',
//     fontSize: '1.5rem',
//     color: '#333',
//   },
//   subHeader: {
//     margin: '15px 0 10px',
//     fontSize: '1.2rem',
//     color: '#555',
//   },
//   iframe: {
//     border: 'none',
//     borderRadius: '8px',
//   },
//   link: {
//     display: 'inline-block',
//     marginTop: '10px',
//     padding: '10px 20px',
//     backgroundColor: '#007BFF',
//     color: 'white',
//     textDecoration: 'none',
//     borderRadius: '4px',
//     transition: 'background-color 0.3s',
//   },
// };

// export default EntrustAdvertisements;
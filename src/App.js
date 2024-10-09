import React, { useState, useEffect } from 'react';
import './App.css';

function AddTraveller({ travellers, setTravellers }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handles the submission of the "Add Traveller" form
  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingTime = new Date().toLocaleString();

    // Check if the max number of seats is reached
    if (travellers.length >= 10) {
      alert('No more seats available.');
      return;
    }

    // Validate if all fields are filled
    if (!id || !name || !phone) {
      alert('Please fill in all fields.');
      return;
    }

    // Check for duplicate ID
    const isDuplicateId = travellers.some((traveller) => traveller.id === id);
    if (isDuplicateId) {
      alert('Traveller ID already exists. Please use a unique ID.');
      return;
    }

    // Add the new traveller and update local storage
    const newTraveller = { id, name, phone, bookingTime };
    const updatedTravellers = [...travellers, newTraveller];
    setTravellers(updatedTravellers);
    localStorage.setItem('travellerData', JSON.stringify(updatedTravellers));

    // Show success message and reset all fields
    setSuccessMessage('Traveller added.');
    setTimeout(() => setSuccessMessage(''), 3000);

    setId('');
    setName('');
    setPhone('');
  };

  return (
    <div>
      <h2>Add New Traveller</h2>
      {/* Display success message */}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        {/* Input fields for adding a traveller */}
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
        <button type="submit">Add Traveller</button>
      </form>
    </div>
  );
}

function DisplayTraveller({ travellers, setTravellers, setActiveView }) {
  // success message when traveller is deleted
  const [successMessage, setSuccessMessage] = useState('');

  // Handle deletion of a traveller
  const handleDelete = (id) => {
    // Remove the selected traveller from the list
    const updatedTravellers = travellers.filter((traveller) => traveller.id !== id);
    setTravellers(updatedTravellers);
    localStorage.setItem('travellerData', JSON.stringify(updatedTravellers));

    // Show success message
    setSuccessMessage('Traveller deleted.');
    setTimeout(() => setSuccessMessage(''), 3000);

    // Navigate to home if all travellers are deleted
    if (updatedTravellers.length === 0) {
      setActiveView('home');
    }
  };

  return (
    <div>
      <h2>Traveller Details</h2>
      {/* Display success message */}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Booking Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Render traveller details */}
          {travellers.length > 0 ? (
            travellers.map((traveller) => (
              <tr key={traveller.id}>
                <td>{traveller.id}</td>
                <td>{traveller.name}</td>
                <td>{traveller.phone}</td>
                <td>{traveller.bookingTime}</td>
                <td>
                  <button onClick={() => handleDelete(traveller.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No Travellers Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function DeleteTraveller({ travellers, setTravellers, setActiveView }) {
  // traveller deletion and success message
  const [deleteId, setDeleteId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDelete = (e) => {
    e.preventDefault();
    const index = travellers.findIndex((traveller) => traveller.id === deleteId);

    // If traveller is not found
    if (index === -1) {
      alert('Traveller not found.');
      return;
    }

    // Delete traveller and update the list
    const updatedTravellers = travellers.filter((traveller) => traveller.id !== deleteId);
    setTravellers(updatedTravellers);
    localStorage.setItem('travellerData', JSON.stringify(updatedTravellers));

    setSuccessMessage('Traveller deleted.');
    setTimeout(() => setSuccessMessage(''), 3000);

    // Navigate to home if all travellers are deleted
    if (updatedTravellers.length === 0) {
      setActiveView('home');
    }

    setDeleteId('');
  };

  return (
    <div>
      <h2>Delete Traveller</h2>
      {/* Display success message */}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleDelete}>
        {/* Input field for entering the traveller ID to delete */}
        <input
          type="text"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
          placeholder="Enter Traveller ID"
        />
        <button type="submit">Delete Traveller</button>
      </form>
    </div>
  );
}

// Component to display the seat availability
function SeatAvailability({ travellers, totalSeats }) {
  //seat availability
  const seatStatus = Array(totalSeats).fill(false);

  // Set seats as reserved based on the number of travellers
  travellers.forEach((traveller, index) => {
    if (index < totalSeats) seatStatus[index] = true;
  });

  return (
    <div>
      <h2>Seat Availability</h2>
      {/* Display seat availability */}
      <div className="seat-container">
        {seatStatus.map((isOccupied, index) => (
          <div key={index} className={`seat ${isOccupied ? 'occupied' : 'unoccupied'}`}>
            {isOccupied ? 'Reserved' : 'Available'}
          </div>
        ))}
      </div>
    </div>
  );
}

// to display the number of free seats
function DisplayFreeSeats({ totalSeats, travellers }) {
  const availableSeats = totalSeats - travellers.length;
  return (
    <div>
      <h3>Available Free Seats: {availableSeats}</h3>
    </div>
  );
}

// Navigation bar component for different views
function NavBar({ setActiveView, travellers }) {
  return (
    <nav>
      <ul className="nav-menu">
        <li onClick={() => setActiveView('home')}>Home</li>
        <li onClick={() => setActiveView('addTraveller')}>Add Traveller</li>

        {/* Show "View Travellers" and "Delete Traveller" only if there is atleast 1 travellers */}
        {travellers.length > 0 && (
          <>
            <li onClick={() => setActiveView('viewTravellers')}>View Travellers</li>
            <li onClick={() => setActiveView('deleteTraveller')}>Delete Traveller</li>
          </>
        )}
      </ul>
    </nav>
  );
}

function WebApp() {
  const [travellers, setTravellers] = useState(() => {
    const savedData = localStorage.getItem('travellerData');
    return savedData ? JSON.parse(savedData) : [];
  });
  // Default view to Home page
  const [activeView, setActiveView] = useState('home'); 
  const totalSeats = 10;

  // Update local storage when the travellers list change
  useEffect(() => {
    localStorage.setItem('travellerData', JSON.stringify(travellers));
  }, [travellers]);

  return (
    <div>
      <h1>Railway Traveller Reservation System</h1>

      {/* Navigation Bar */}
      <NavBar setActiveView={setActiveView} travellers={travellers} />

      <DisplayFreeSeats totalSeats={totalSeats} travellers={travellers} />

      {activeView === 'home' && <SeatAvailability travellers={travellers} totalSeats={totalSeats} />}
      {activeView === 'addTraveller' && (
        <AddTraveller
          travellers={travellers}
          setTravellers={setTravellers}
        />
      )}
      {activeView === 'viewTravellers' && (
        <DisplayTraveller
          travellers={travellers}
          setTravellers={setTravellers}
          setActiveView={setActiveView}
        />
      )}
      {activeView === 'deleteTraveller' && (
        <DeleteTraveller
          travellers={travellers}
          setTravellers={setTravellers}
          setActiveView={setActiveView}
        />
      )}

      {travellers.length >= 10 && <p>All seats are reserved. No more travellers can be added.</p>}
      {travellers.length === 0 && activeView === 'viewTravellers' && <p>No travellers to display.</p>}
    </div>
  );
}

export default WebApp;

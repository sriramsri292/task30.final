import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function Home() {
  const API = "https://jsonplaceholder.typicode.com/users";
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createMode, setCreateMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(API)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setCreateMode(false);
  };

  const handleCreate = () => {
    setSelectedUser({
      id: null,
      name: "",
      username: "",
      email: "",
      address: {
        street: "",
        suite: "",
        city: "",
        zipcode: ""
      },
      phone: "",
      website: "",
      company: {
        name: "",
        catchPhrase: "",
        bs: ""
      }
    });
    setShowModal(true);
    setCreateMode(true);
  };

  const handleDelete = (userId) => {
    axios.delete(`${API}/${userId}`)
      .then(response => {
        const updatedData = data.filter(user => user.id !== userId);
        setData(updatedData);
      })
      .catch(error => {
        console.error("Error deleting user:", error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setCreateMode(false);
  };

  const handleSaveEdit = () => {
    if (createMode) {
      // Creating a new user
      axios.post(API, selectedUser)
        .then(response => {
          setData([...data, response.data]);
          setShowModal(false);
        })
        .catch(error => {
          console.error("Error creating user:", error);
        });
    } else {
      // Editing an existing user
      axios.put(`${API}/${selectedUser.id}`, selectedUser)
        .then(response => {
          const updatedData = data.map(user =>
            user.id === selectedUser.id ? response.data : user
          );
          setData(updatedData);
          setShowModal(false);
        })
        .catch(error => {
          console.error("Error updating user:", error);
        });
    }
  };

  return (
    <div className="a">
      
      <Navbar className="bg-body-tertiary">
        <Container className="b">
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLNCqi7YVg1BZszYlV_OFsV6Vshxsz9V_j1e0s7gwUjw&s"
              width="70"
              height="60"
              className="d-inline-block align-top"
            />{' '}
            API USING AXIOS
          </Navbar.Brand>
        </Container>
      </Navbar>
      <h2>User Data</h2>
      <div>
        <Button variant="primary" onClick={handleCreate}>
          Create User
        </Button>
      </div>
      {data && data.length > 0 && (
        <Row>
          {data.map(user => (
            <Col xs={6} className="my-3" key={user.id}>
              <ul>
                <li>
                  <strong>ID:</strong> {user.id}<br />
                  <strong>Name:</strong> {user.name}<br />
                  <strong>Username:</strong> {user.username}<br />
                  <strong>Email:</strong> {user.email}<br />
                  <strong>Address:</strong> {user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}<br />
                  <strong>Phone:</strong> {user.phone}<br />
                  <strong>Website:</strong> {user.website}<br />
                  <strong>Company:</strong> {user.company.name}<br />
                  <strong>Catch Phrase:</strong> {user.company.catchPhrase}<br />
                  <strong>Business:</strong> {user.company.bs}
                </li>
              </ul>
              <div>
                <button className="c" onClick={() => handleEdit(user)}>Edit</button>
                <button className="c" onClick={() => handleDelete(user.id)}>Delete</button>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for Editing */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{createMode ? "Create User" : "Edit User Data"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add form elements for editing user data */}
          {selectedUser && (
            <div>
            <label>ID:</label>
            <strong>{selectedUser.id}</strong><br />
            <label>Name:</label>
            <input
              type="text"
              value={selectedUser.name}
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
            />
            <label>Username:</label>
            <input
              type="text"
              value={selectedUser.username}
              onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
            />
            <label>Email:</label>
            <input
              type="text"
              value={selectedUser.email}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            />
            <label>Address:</label>
            {selectedUser.address && (
              <>
                <span>{selectedUser.address.street},</span>
                <span>{selectedUser.address.suite},</span>
                <span>{selectedUser.address.city},</span>
                <span>{selectedUser.address.zipcode}</span>
              </>
            )}
            <br />
            <label>Phone:</label>
            <input
              type="text"
              value={selectedUser.phone}
              onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
            />
            <label>Website:</label>
            <input
              type="text"
              value={selectedUser.website}
              onChange={(e) => setSelectedUser({ ...selectedUser, website: e.target.value })}
            />
            <label>Company:</label>
            {selectedUser.company && (
              <>
                <span>{selectedUser.company.name},</span>
                <span>{selectedUser.company.catchPhrase},</span>
                <span>{selectedUser.company.bs}</span>
              </>
            )}
          </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {createMode ? (
            <Button variant="primary" onClick={handleSaveEdit}>
              Create User
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Create User Button */}
     
    </div>
  );
}

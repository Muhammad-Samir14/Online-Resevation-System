import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const initialPersonnel = [
  {
    id: 1,
    name: "Roberto Cruz",
    email: "roberto.cruz@gasdelivery.com",
    phone: "+63 917 123 4567",
    vehicleType: "Motorcycle",
    vehiclePlate: "ABC 1234",
    status: "Available",
    completedDeliveries: 156,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    email: "carlos.mendoza@gasdelivery.com",
    phone: "+63 928 234 5678",
    vehicleType: "Truck",
    vehiclePlate: "XYZ 5678",
    status: "On Delivery",
    completedDeliveries: 203,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Miguel Ramos",
    email: "miguel.ramos@gasdelivery.com",
    phone: "+63 939 345 6789",
    vehicleType: "Van",
    vehiclePlate: "DEF 9012",
    status: "Available",
    completedDeliveries: 128,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Luis Torres",
    email: "luis.torres@gasdelivery.com",
    phone: "+63 940 456 7890",
    vehicleType: "Motorcycle",
    vehiclePlate: "GHI 3456",
    status: "Offline",
    completedDeliveries: 89,
    rating: 4.6,
  },
];

export default function DeliveryPersonnelManagement() {
  const [personnel, setPersonnel] = useState(initialPersonnel);
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleType: "",
    vehiclePlate: "",
    status: "Available",
  });

  const openModal = (person = null) => {
    if (person) {
      setEditingPerson(person);
      setFormData({ ...person });
    } else {
      setEditingPerson(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        vehicleType: "",
        vehiclePlate: "",
        status: "Available",
      });
    }
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this delivery personnel?")) {
      setPersonnel(personnel.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPerson) {
      setPersonnel(
        personnel.map((p) =>
          p.id === editingPerson.id
            ? { ...formData, id: editingPerson.id, completedDeliveries: editingPerson.completedDeliveries, rating: editingPerson.rating }
            : p
        )
      );
    } else {
      const newPerson = { ...formData, id: Math.max(...personnel.map((p) => p.id), 0) + 1, completedDeliveries: 0, rating: 5.0 };
      setPersonnel([...personnel, newPerson]);
    }
    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return "bg-success";
      case "On Delivery":
        return "bg-primary";
      case "Offline":
        return "bg-secondary";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Manage Delivery Personnel</h3>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Add Personnel
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Vehicle</th>
            <th>Plate</th>
            <th>Status</th>
            <th>Deliveries</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {personnel.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.phone}</td>
              <td>{p.vehicleType}</td>
              <td>{p.vehiclePlate}</td>
              <td>
                <span className={`badge ${getStatusBadge(p.status)}`}>{p.status}</span>
              </td>
              <td>{p.completedDeliveries}</td>
              <td>⭐ {p.rating}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => openModal(p)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">{editingPerson ? "Edit Personnel" : "Add New Personnel"}</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input type="text" className="form-control" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Vehicle Type</label>
                      <input type="text" className="form-control" value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Vehicle Plate</label>
                      <input type="text" className="form-control" value={formData.vehiclePlate} onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label me-3">Status</label>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="status" value="Available" checked={formData.status === "Available"} onChange={() => setFormData({ ...formData, status: "Available" })} />
                        <label className="form-check-label">Available</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="status" value="On Delivery" checked={formData.status === "On Delivery"} onChange={() => setFormData({ ...formData, status: "On Delivery" })} />
                        <label className="form-check-label">On Delivery</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="status" value="Offline" checked={formData.status === "Offline"} onChange={() => setFormData({ ...formData, status: "Offline" })} />
                        <label className="form-check-label">Offline</label>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">{editingPerson ? "Update" : "Create"}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  );
}

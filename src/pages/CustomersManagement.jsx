import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const initialCustomers = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan.delacruz@email.com",
    phone: "+63 912 345 6789",
    address: "123 Main St, Manila",
    registrationDate: "2025-01-15",
    status: "Active",
    totalOrders: 12,
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+63 923 456 7890",
    address: "456 Business Ave, Quezon City",
    registrationDate: "2025-02-20",
    status: "Active",
    totalOrders: 8,
  },
  {
    id: 3,
    name: "Pedro Garcia",
    email: "pedro.garcia@email.com",
    phone: "+63 934 567 8901",
    address: "789 Residential St, Makati",
    registrationDate: "2025-03-10",
    status: "Active",
    totalOrders: 5,
  },
  {
    id: 4,
    name: "Ana Reyes",
    email: "ana.reyes@email.com",
    phone: "+63 945 678 9012",
    address: "321 Sunset Blvd, Pasig",
    registrationDate: "2024-12-05",
    status: "Inactive",
    totalOrders: 3,
  },
];

export default function CustomersManagement() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    registrationDate: new Date().toISOString().split("T")[0],
    status: "Active",
  });

  const openModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({ ...customer });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        registrationDate: new Date().toISOString().split("T")[0],
        status: "Active",
      });
    }
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id ? { ...formData, id: editingCustomer.id, totalOrders: c.totalOrders } : c
        )
      );
    } else {
      const newCustomer = { ...formData, id: Math.max(...customers.map((c) => c.id), 0) + 1, totalOrders: 0 };
      setCustomers([...customers, newCustomer]);
    }
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Manage Customers</h3>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Add Customer
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            <th>Total Orders</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.address}</td>
              <td>
                <span className={`badge ${c.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                  {c.status}
                </span>
              </td>
              <td>{c.totalOrders}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => openModal(c)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editingCustomer ? "Edit Customer" : "Add Customer"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Registration Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.registrationDate}
                      onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label me-3">Status</label>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="status"
                        value="Active"
                        checked={formData.status === "Active"}
                        onChange={(e) => setFormData({ ...formData, status: "Active" })}
                      />
                      <label className="form-check-label">Active</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="status"
                        value="Inactive"
                        checked={formData.status === "Inactive"}
                        onChange={(e) => setFormData({ ...formData, status: "Inactive" })}
                      />
                      <label className="form-check-label">Inactive</label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCustomer ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Modal backdrop */}
      {showModal && <div className="modal-backdrop show"></div>}
    </div>
  );
}

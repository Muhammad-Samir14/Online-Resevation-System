import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number too short"),
  address: z.string().min(3, "Address too short"),
  status: z.enum(["Active", "Inactive"]),
});

export default function CustomersManagement() {
  const [customers, setCustomers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "", email: "", phone: "", address: "",
      status: "Active",
    },
  });

  // 1️⃣ Fetch data directly from MongoDB instead of LocalStorage
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/customers");
      setCustomers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching database customers:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        status: customer.status || "Active"
      });
    } else {
      setEditingCustomer(null);
      reset({ name: "", email: "", phone: "", address: "", status: "Active" });
    }
    setShowModal(true);
  };

  // 2️⃣ Handle Database Deletion via Axios directly
  const handleDelete = async (id) => {
    if (window.confirm("Confirm deletion of this user profile?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/customers/${id}`);
        setCustomers(customers.filter((c) => c._id !== id)); 
      } catch (err) {
        alert("Failed to delete user registration profile from server.");
      }
    }
  };

  // 3️⃣ Form Submission Handler hitting dynamic endpoints
  const onSubmit = async (data) => {
    try {
      if (editingCustomer) {
        // Update Action
        const res = await axios.put(`http://localhost:5000/api/admin/customers/${editingCustomer._id}`, data);
        setCustomers(customers.map((c) => (c._id === editingCustomer._id ? res.data : c)));
      } else {
        // Create Action
        const res = await axios.post("http://localhost:5000/api/admin/customers", data);
        setCustomers([...customers, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error processing user database operation");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="animate__animated animate__fadeIn text-white">
      {/* Table Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-dark p-4 rounded-4 shadow-lg border border-secondary">
        <div>
          <h3 className="fw-bold text-primary mb-1">Customer Database</h3>
          <p className="text-secondary small mb-0">Manage agency clients and profile data</p>
        </div>
        <button className="btn btn-primary px-4 py-2 fw-bold" onClick={() => openModal()} style={{ borderRadius: "10px" }}>
          + New Client
        </button>
      </div>

      {/* Modern Dark Table */}
      <div className="card bg-dark border-secondary shadow-lg overflow-hidden" style={{ borderRadius: "20px" }}>
        <table className="table table-dark table-hover mb-0 align-middle">
          <thead className="bg-secondary text-secondary">
            <tr className="border-bottom border-secondary">
              <th className="ps-4 py-3">CLIENT</th>
              <th className="py-3">CONTACT</th>
              <th className="py-3 text-center">STATUS</th>
              <th className="pe-4 py-3 text-end">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-secondary">
                  No clients currently registered in the database.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} className="border-bottom border-secondary transition-all">
                  <td className="ps-4">
                    <div className="fw-bold text-white">{c.name}</div>
                    <small className="text-secondary">{c.address}</small>
                  </td>
                  <td>
                    <div className="small text-white">{c.email}</div>
                    <div className="small text-secondary">{c.phone}</div>
                  </td>
                  <td className="text-center">
                    <span className={`badge rounded-pill px-3 py-2 ${c.status === "Active" ? "bg-success-soft text-success border border-success" : "bg-danger-soft text-danger border border-danger"}`} 
                      style={{ backgroundColor: c.status === "Active" ? "rgba(40, 167, 69, 0.1)" : "rgba(220, 53, 69, 0.1)" }}>
                      {c.status || "Active"}
                    </span>
                  </td>
                  <td className="pe-4 text-end">
                    <button className="btn btn-outline-warning btn-sm border-0 me-1 p-2" onClick={() => openModal(c)} title="Edit Profile">
                      ✏️
                    </button>
                    <button className="btn btn-outline-danger btn-sm border-0 p-2" onClick={() => handleDelete(c._id)} title="Remove Profile">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Design */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark text-white border-secondary shadow-lg" style={{ borderRadius: "20px" }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="modal-header border-secondary">
                    <h5 className="modal-title fw-bold text-primary">{editingCustomer ? "Update Client" : "Register New Client"}</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
                  </div>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small text-secondary">Full Name</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("name")} placeholder="Enter full name" />
                        {errors.name && <small className="text-danger">{errors.name.message}</small>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">Email Address</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("email")} />
                        {errors.email && <small className="text-danger">{errors.email.message}</small>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">Phone Number</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("phone")} />
                        {errors.phone && <small className="text-danger">{errors.phone.message}</small>}
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-secondary">Address</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("address")} />
                        {errors.address && <small className="text-danger">{errors.address.message}</small>}
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-secondary">Account Status</label>
                        <select className="form-select bg-dark text-white border-secondary" {...register("status")}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-secondary">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary px-4">{editingCustomer ? "Save Changes" : "Register Client"}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
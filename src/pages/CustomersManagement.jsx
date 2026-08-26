import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "../supabaseClient";

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

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCustomers(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching customers:", err);
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

  const handleDelete = async (id) => {
    if (window.confirm("Confirm deletion of this user profile?")) {
      try {
        const { error } = await supabase.from("customers").delete().eq("id", id);
        if (error) throw error;
        setCustomers(customers.filter((c) => c.id !== id));
      } catch (err) {
        alert("Failed to delete user profile from server.");
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingCustomer) {
        const { data: updated, error } = await supabase
          .from("customers")
          .update(data)
          .eq("id", editingCustomer.id)
          .select();
        if (error) throw error;
        setCustomers(customers.map((c) => (c.id === editingCustomer.id ? updated[0] : c)));
      } else {
        const { data: created, error } = await supabase
          .from("customers")
          .insert([data])
          .select();
        if (error) throw error;
        setCustomers([...customers, created[0]]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.message || "Error processing customer operation");
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
    <div>
      <div
        className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 shadow-sm"
        style={{ background: "#fff", border: "1px solid #dce5f0" }}
      >
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#10233f" }}>
            <i className="bi bi-people-fill text-primary me-2"></i>
            Customer Database
          </h3>
          <p className="text-muted small mb-0">Manage agency clients and profile data</p>
        </div>
        <button
          className="btn btn-primary px-4 py-2 fw-bold"
          onClick={() => openModal()}
          style={{ borderRadius: "10px" }}
        >
          <i className="bi bi-plus-lg me-1"></i>
          New Client
        </button>
      </div>

      <div
        className="card shadow-sm overflow-hidden"
        style={{ borderRadius: "16px", border: "1px solid #dce5f0" }}
      >
        <table className="table table-hover mb-0 align-middle">
          <thead style={{ background: "#eef5ff" }}>
            <tr style={{ borderBottom: "2px solid #d9e6f8" }}>
              <th className="ps-4 py-3 text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Client</th>
              <th className="py-3 text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Contact</th>
              <th className="py-3 text-center text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Status</th>
              <th className="pe-4 py-3 text-end text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  No clients currently registered in the database.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-top" style={{ borderColor: "#eef3f8" }}>
                  <td className="ps-4">
                    <div className="fw-bold" style={{ color: "#10233f" }}>{c.name}</div>
                    <small className="text-muted">{c.address}</small>
                  </td>
                  <td>
                    <div className="small" style={{ color: "#172033" }}>{c.email}</div>
                    <div className="small text-muted">{c.phone}</div>
                  </td>
                  <td className="text-center">
                    <span
                      className="badge rounded-pill px-3 py-2 border"
                      style={{
                        backgroundColor: c.status === "Active" ? "rgba(25, 135, 84, 0.1)" : "rgba(220, 53, 69, 0.1)",
                        color: c.status === "Active" ? "#198754" : "#dc3545",
                        borderColor: c.status === "Active" ? "#198754" : "#dc3545",
                      }}
                    >
                      {c.status || "Active"}
                    </span>
                  </td>
                  <td className="pe-4 text-end">
                    <button
                      className="btn btn-sm me-1"
                      style={{ background: "#fff8dd", color: "#e5aa00", border: "1px solid #ffe38c" }}
                      onClick={() => openModal(c)}
                      title="Edit Profile"
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ background: "#fde8e8", color: "#dc3545", border: "1px solid #f5c2c7" }}
                      onClick={() => handleDelete(c.id)}
                      title="Remove Profile"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg" style={{ borderRadius: "20px", border: "1px solid #dce5f0" }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-header" style={{ borderBottom: "1px solid #eef3f8" }}>
                  <h5 className="modal-title fw-bold" style={{ color: "#10233f" }}>
                    {editingCustomer ? "Update Client" : "Register New Client"}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Full Name</label>
                      <input className="form-control marwat-input" {...register("name")} placeholder="Enter full name" />
                      {errors.name && <small className="text-danger">{errors.name.message}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Email Address</label>
                      <input className="form-control marwat-input" {...register("email")} />
                      {errors.email && <small className="text-danger">{errors.email.message}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Phone Number</label>
                      <input className="form-control marwat-input" {...register("phone")} />
                      {errors.phone && <small className="text-danger">{errors.phone.message}</small>}
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Address</label>
                      <input className="form-control marwat-input" {...register("address")} />
                      {errors.address && <small className="text-danger">{errors.address.message}</small>}
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Account Status</label>
                      <select className="form-select marwat-input" {...register("status")}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: "1px solid #eef3f8" }}>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">{editingCustomer ? "Save Changes" : "Register Client"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

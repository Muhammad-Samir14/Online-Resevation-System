import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "../supabaseClient";

const personSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone too short"),
  vehicleType: z.string().min(2, "Vehicle type required"),
  vehiclePlate: z.string().min(1, "Plate required"),
  status: z.enum(["Available", "On Delivery", "Offline"]),
});

export default function DeliveryPersonnelManagement() {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(personSchema),
    defaultValues: { name: "", email: "", phone: "", vehicleType: "", vehiclePlate: "", status: "Available" },
  });

  const fetchPersonnel = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("delivery_personnel")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPersonnel(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error retrieving fleet records:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const openModal = (person = null) => {
    if (person) {
      setEditingPerson(person);
      reset({
        name: person.name,
        email: person.email,
        phone: person.phone,
        vehicleType: person.vehicleType,
        vehiclePlate: person.vehiclePlate,
        status: person.status,
      });
    } else {
      setEditingPerson(null);
      reset({ name: "", email: "", phone: "", vehicleType: "", vehiclePlate: "", status: "Available" });
    }
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingPerson) {
        const { data: updated, error } = await supabase
          .from("delivery_personnel")
          .update(data)
          .eq("id", editingPerson.id)
          .select();
        if (error) throw error;
        setPersonnel(personnel.map((p) => (p.id === editingPerson.id ? updated[0] : p)));
      } else {
        const { data: created, error } = await supabase
          .from("delivery_personnel")
          .insert([data])
          .select();
        if (error) throw error;
        setPersonnel([...personnel, created[0]]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.message || "Error submitting fleet profile change");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirm removal of this delivery personnel?")) {
      try {
        const { error } = await supabase.from("delivery_personnel").delete().eq("id", id);
        if (error) throw error;
        setPersonnel(personnel.filter((p) => p.id !== id));
      } catch (err) {
        alert("Could not complete delivery personnel deletion.");
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Available": return { color: "#198754", bg: "rgba(25, 135, 84, 0.1)" };
      case "On Delivery": return { color: "#0d6efd", bg: "rgba(13, 110, 253, 0.1)" };
      case "Offline": return { color: "#6c757d", bg: "rgba(108, 117, 125, 0.1)" };
      default: return { color: "#6c757d", bg: "rgba(108, 117, 125, 0.1)" };
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
            <i className="bi bi-truck text-primary me-2"></i>
            Fleet Management
          </h3>
          <p className="text-muted small mb-0">Track delivery personnel, vehicles, and performance</p>
        </div>
        <button
          className="btn btn-primary px-4 fw-bold"
          onClick={() => openModal()}
          style={{ borderRadius: "10px" }}
        >
          <i className="bi bi-plus-lg me-1"></i>
          Add Personnel
        </button>
      </div>

      <div
        className="card shadow-sm overflow-hidden"
        style={{ borderRadius: "16px", border: "1px solid #dce5f0" }}
      >
        <table className="table table-hover mb-0 align-middle">
          <thead style={{ background: "#eef5ff" }}>
            <tr style={{ borderBottom: "2px solid #d9e6f8" }}>
              <th className="ps-4 py-3 text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Personnel</th>
              <th className="py-3 text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Vehicle</th>
              <th className="py-3 text-center text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Status</th>
              <th className="py-3 text-center text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Metrics</th>
              <th className="pe-4 py-3 text-end text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {personnel.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  No delivery fleet profiles found in database.
                </td>
              </tr>
            ) : (
              personnel.map((p) => {
                const style = getStatusStyle(p.status);
                return (
                  <tr key={p.id} className="border-top" style={{ borderColor: "#eef3f8" }}>
                    <td className="ps-4 py-3">
                      <div className="fw-bold" style={{ color: "#10233f" }}>{p.name}</div>
                      <small className="text-muted">{p.phone}</small>
                    </td>
                    <td>
                      <div className="small fw-bold" style={{ color: "#172033" }}>{p.vehicleType}</div>
                      <small className="text-muted" style={{ letterSpacing: "1px" }}>{p.vehiclePlate}</small>
                    </td>
                    <td className="text-center">
                      <span
                        className="badge rounded-pill px-3 py-2 border"
                        style={{ backgroundColor: style.bg, color: style.color, borderColor: style.color }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="fw-bold" style={{ color: "#10233f" }}>{p.completedDeliveries || 0} Trips</div>
                      <div className="small" style={{ color: "#e5aa00" }}>
                        <i className="bi bi-star-fill me-1"></i>
                        {p.rating || "5.0"} Rating
                      </div>
                    </td>
                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-sm me-1"
                        style={{ background: "#fff8dd", color: "#e5aa00", border: "1px solid #ffe38c" }}
                        onClick={() => openModal(p)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: "#fde8e8", color: "#dc3545", border: "1px solid #f5c2c7" }}
                        onClick={() => handleDelete(p.id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
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
                    {editingPerson ? "Edit Profile" : "New Fleet Member"}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Full Name</label>
                      <input className="form-control marwat-input" {...register("name")} placeholder="Full Name" />
                      {errors.name && <small className="text-danger">{errors.name.message}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Email</label>
                      <input className="form-control marwat-input" {...register("email")} />
                      {errors.email && <small className="text-danger">{errors.email.message}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Phone</label>
                      <input className="form-control marwat-input" {...register("phone")} />
                      {errors.phone && <small className="text-danger">{errors.phone.message}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Vehicle Type</label>
                      <input className="form-control marwat-input" {...register("vehicleType")} placeholder="Truck, Van, etc." />
                      {errors.vehicleType && <small className="text-danger">{errors.vehicleType.message}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">License Plate</label>
                      <input className="form-control marwat-input" {...register("vehiclePlate")} />
                      {errors.vehiclePlate && <small className="text-danger">{errors.vehiclePlate.message}</small>}
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Duty Status</label>
                      <select className="form-select marwat-input" {...register("status")}>
                        <option value="Available">Available</option>
                        <option value="On Delivery">On Delivery</option>
                        <option value="Offline">Offline</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: "1px solid #eef3f8" }}>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">{editingPerson ? "Update Member" : "Add to Fleet"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

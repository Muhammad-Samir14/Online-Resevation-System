import React, { useState, useEffect } from "react";
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
      const { data, error } = await supabase.from("delivery_personnel").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setPersonnel(data || []);
    } catch (err) {
      console.error("Error fetching personnel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPersonnel(); }, []);

  const openModal = (person = null) => {
    if (person) {
      setEditingPerson(person);
      reset({ name: person.name, email: person.email, phone: person.phone, vehicleType: person.vehicleType, vehiclePlate: person.vehiclePlate, status: person.status });
    } else {
      setEditingPerson(null);
      reset({ name: "", email: "", phone: "", vehicleType: "", vehiclePlate: "", status: "Available" });
    }
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingPerson) {
        const { data: updated, error } = await supabase.from("delivery_personnel").update(data).eq("id", editingPerson.id).select();
        if (error) throw error;
        setPersonnel(personnel.map((p) => (p.id === editingPerson.id ? updated[0] : p)));
      } else {
        const { data: created, error } = await supabase.from("delivery_personnel").insert([data]).select();
        if (error) throw error;
        setPersonnel([...personnel, created[0]]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.message || "Error saving personnel");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this delivery personnel?")) {
      try {
        const { error } = await supabase.from("delivery_personnel").delete().eq("id", id);
        if (error) throw error;
        setPersonnel(personnel.filter((p) => p.id !== id));
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Available": return { color: "#198754", bg: "rgba(25,135,84,.12)" };
      case "On Delivery": return { color: "#0d6efd", bg: "rgba(13,110,253,.12)" };
      case "Offline": return { color: "#6c757d", bg: "rgba(108,117,125,.12)" };
      default: return { color: "#6c757d", bg: "rgba(108,117,125,.12)" };
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div>
          <small className="text-warning fw-bold text-uppercase" style={{ letterSpacing: "1.5px", fontSize: ".75rem" }}>Fleet</small>
          <h2 className="fw-bold text-white mb-1">Deliveries</h2>
          <p className="text-white-50 mb-0">Manage delivery personnel and vehicles</p>
        </div>
        <button className="btn btn-warning fw-bold px-4" onClick={() => openModal()} style={{ borderRadius: "10px" }}>
          <i className="bi bi-plus-lg me-1"></i>Add Personnel
        </button>
      </div>

      <div className="stat-card p-0">
        <div className="table-responsive">
          <table className="table admin-table mb-0">
            <thead>
              <tr>
                <th>Personnel</th>
                <th>Vehicle</th>
                <th className="text-center">Status</th>
                <th className="text-center">Deliveries</th>
                <th className="text-center">Rating</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {personnel.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-5 text-white-50"><i className="bi bi-truck fs-1 d-block mb-2"></i>No delivery personnel yet.</td></tr>
              ) : (
                personnel.map((p) => {
                  const style = getStatusStyle(p.status);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="fw-semibold text-white">{p.name}</div>
                        <small className="text-white-50">{p.phone}</small>
                      </td>
                      <td>
                        <div className="small text-white">{p.vehicleType}</div>
                        <small className="text-white-50" style={{ letterSpacing: "1px" }}>{p.vehiclePlate}</small>
                      </td>
                      <td className="text-center">
                        <span className="badge px-3 py-2" style={{ backgroundColor: style.bg, color: style.color, borderRadius: "8px" }}>{p.status}</span>
                      </td>
                      <td className="text-center text-white fw-semibold">{p.completedDeliveries || 0}</td>
                      <td className="text-center text-warning">
                        <i className="bi bi-star-fill me-1"></i>{p.rating || "5.0"}
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm me-1" style={{ background: "rgba(255,193,7,.12)", color: "#ffc107", border: "1px solid rgba(255,193,7,.25)", borderRadius: "8px" }} onClick={() => openModal(p)}><i className="bi bi-pencil-fill"></i></button>
                        <button className="btn btn-sm" style={{ background: "rgba(220,53,69,.12)", color: "#dc3545", border: "1px solid rgba(220,53,69,.25)", borderRadius: "8px" }} onClick={() => handleDelete(p.id)}><i className="bi bi-trash-fill"></i></button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ background: "#10233f", border: "1px solid rgba(255,255,255,.1)", borderRadius: "18px" }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-header border-bottom border-secondary border-opacity-25">
                  <h5 className="modal-title fw-bold text-white">{editingPerson ? "Edit Personnel" : "Add Personnel"}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-white-50 small fw-semibold">Full Name</label>
                      <input className="form-control" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" }} {...register("name")} />
                      {errors.name && <small className="text-danger">{errors.name.message}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white-50 small fw-semibold">Email</label>
                      <input className="form-control" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" }} {...register("email")} />
                      {errors.email && <small className="text-danger">{errors.email.message}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white-50 small fw-semibold">Phone</label>
                      <input className="form-control" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" }} {...register("phone")} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white-50 small fw-semibold">Vehicle Type</label>
                      <input className="form-control" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" }} {...register("vehicleType")} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white-50 small fw-semibold">License Plate</label>
                      <input className="form-control" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" }} {...register("vehiclePlate")} />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-white-50 small fw-semibold">Duty Status</label>
                      <select className="form-select" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" }} {...register("status")}>
                        <option value="Available">Available</option>
                        <option value="On Delivery">On Delivery</option>
                        <option value="Offline">Offline</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top border-secondary border-opacity-25">
                  <button type="button" className="btn btn-outline-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-warning fw-bold">{editingPerson ? "Save Changes" : "Add Personnel"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

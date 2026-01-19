import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const initialPersonnel = [
  { id: 1, name: "Roberto Cruz", email: "roberto.cruz@gasdelivery.com", phone: "+92 300 1234567", vehicleType: "Motorcycle", vehiclePlate: "ABC 1234", status: "Available", completedDeliveries: 156, rating: 4.8 },
  { id: 2, name: "Carlos Mendoza", email: "carlos.mendoza@gasdelivery.com", phone: "+92 301 2345678", vehicleType: "Truck", vehiclePlate: "XYZ 5678", status: "On Delivery", completedDeliveries: 203, rating: 4.9 },
  { id: 3, name: "Miguel Ramos", email: "miguel.ramos@gasdelivery.com", phone: "+92 302 3456789", vehicleType: "Van", vehiclePlate: "DEF 9012", status: "Available", completedDeliveries: 128, rating: 4.7 },
  { id: 4, name: "Luis Torres", email: "luis.torres@gasdelivery.com", phone: "+92 303 4567890", vehicleType: "Motorcycle", vehiclePlate: "GHI 3456", status: "Offline", completedDeliveries: 89, rating: 4.6 },
];

const personSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone too short"),
  vehicleType: z.string().min(2, "Vehicle type required"),
  vehiclePlate: z.string().min(1, "Plate required"),
  status: z.enum(["Available", "On Delivery", "Offline"]),
});

export default function DeliveryPersonnelManagement() {
  const [personnel, setPersonnel] = useState(() => {
    const raw = localStorage.getItem("personnel");
    return raw ? JSON.parse(raw) : initialPersonnel;
  });
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(personSchema),
    defaultValues: { name: "", email: "", phone: "", vehicleType: "", vehiclePlate: "", status: "Available" },
  });

  useEffect(() => { localStorage.setItem("personnel", JSON.stringify(personnel)); }, [personnel]);

  const openModal = (person = null) => {
    if (person) {
      setEditingPerson(person);
      reset(person);
    } else {
      setEditingPerson(null);
      reset({ name: "", email: "", phone: "", vehicleType: "", vehiclePlate: "", status: "Available" });
    }
    setShowModal(true);
  };

  const onSubmit = (data) => {
    if (editingPerson) {
      setPersonnel(personnel.map((p) => (p.id === editingPerson.id ? { ...p, ...data } : p)));
    } else {
      const newPerson = { ...data, id: Date.now(), completedDeliveries: 0, rating: 5.0 };
      setPersonnel([...personnel, newPerson]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Confirm removal of this delivery personnel?")) {
      setPersonnel(personnel.filter((p) => p.id !== id));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Available": return { color: "text-success", bg: "rgba(40, 167, 69, 0.1)", border: "border-success" };
      case "On Delivery": return { color: "text-primary", bg: "rgba(13, 110, 253, 0.1)", border: "border-primary" };
      case "Offline": return { color: "text-secondary", bg: "rgba(108, 117, 125, 0.1)", border: "border-secondary" };
      default: return { color: "text-secondary", bg: "rgba(108, 117, 125, 0.1)", border: "border-secondary" };
    }
  };

  return (
    <div className="animate__animated animate__fadeIn text-white">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-dark p-4 rounded-4 shadow-lg border border-secondary">
        <div>
          <h3 className="fw-bold text-primary mb-1">Fleet Management</h3>
          <p className="text-secondary small mb-0">Track delivery personnel, vehicles, and performance</p>
        </div>
        <button className="btn btn-primary px-4 fw-bold" onClick={() => openModal()} style={{ borderRadius: "10px" }}>
          + Add Personnel
        </button>
      </div>

      {/* Table Container */}
      <div className="card bg-dark border-secondary shadow-lg overflow-hidden" style={{ borderRadius: "20px" }}>
        <table className="table table-dark table-hover mb-0 align-middle">
          <thead className="text-secondary small text-uppercase">
            <tr className="border-bottom border-secondary">
              <th className="ps-4 py-3">Personnel</th>
              <th className="py-3">Vehicle Details</th>
              <th className="py-3 text-center">Status</th>
              <th className="py-3 text-center">Success Rate</th>
              <th className="pe-4 py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {personnel.map((p) => {
              const style = getStatusStyle(p.status);
              return (
                <tr key={p.id} className="border-bottom border-secondary transition-all">
                  <td className="ps-4 py-3">
                    <div className="fw-bold text-white">{p.name}</div>
                    <div className="small text-secondary">{p.phone}</div>
                  </td>
                  <td>
                    <div className="text-white small fw-bold">{p.vehicleType}</div>
                    <div className="text-secondary small tracking-widest">{p.vehiclePlate}</div>
                  </td>
                  <td className="text-center">
                    <span className={`badge rounded-pill px-3 py-2 ${style.color} ${style.border} border`} style={{ backgroundColor: style.bg }}>
                      {p.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="fw-bold text-white">{p.completedDeliveries} Trips</div>
                    <div className="small text-warning">⭐ {p.rating} Rating</div>
                  </td>
                  <td className="pe-4 text-end">
                    <button className="btn btn-outline-warning btn-sm border-0 me-1 p-2" onClick={() => openModal(p)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn btn-outline-danger btn-sm border-0 p-2" onClick={() => handleDelete(p.id)} title="Delete">
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Section */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark text-white border-secondary shadow-lg" style={{ borderRadius: "20px" }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="modal-header border-secondary">
                    <h5 className="modal-title fw-bold text-primary">{editingPerson ? "Edit Profile" : "New Fleet Member"}</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
                  </div>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small text-secondary">Full Name</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("name")} placeholder="Full Name" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">Email</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("email")} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">Phone</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("phone")} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">Vehicle Type</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("vehicleType")} placeholder="Truck, Van, etc." />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">License Plate</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("vehiclePlate")} />
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-secondary">Duty Status</label>
                        <select className="form-select bg-dark text-white border-secondary" {...register("status")}>
                          <option value="Available">Available</option>
                          <option value="On Delivery">On Delivery</option>
                          <option value="Offline">Offline</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-secondary">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary px-4">{editingPerson ? "Update Member" : "Add to Fleet"}</button>
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
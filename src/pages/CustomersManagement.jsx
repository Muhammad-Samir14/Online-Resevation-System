import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const initialCustomers = [
  { id: 1, name: "Asad Khan", email: "asadasad@email.com", phone: "+92 912 345 6789", address: "J block, Street no 12", registrationDate: "2025-01-15", status: "Active", totalOrders: 12 },
  { id: 2, name: "Fahad Ali", email: "fahaalid@email.com", phone: "+92 923 456 7890", address: "B Block, Street no 5", registrationDate: "2025-02-20", status: "Active", totalOrders: 8 },
  { id: 3, name: "Haroon Baloch", email: "HaroonBaloch@email.com", phone: "+92 934 567 8901", address: "A Block, Street no 8", registrationDate: "2025-03-10", status: "Active", totalOrders: 5 },
  { id: 4, name: "Amar Khan", email: "amarkhan@email.com", phone: "+92 945 678 9012", address: "C Block, Street no 9", registrationDate: "2024-12-05", status: "Inactive", totalOrders: 3 },
];

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number too short"),
  address: z.string().min(3, "Address too short"),
  registrationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  status: z.enum(["Active", "Inactive"]),
});

export default function CustomersManagement() {
  const [customers, setCustomers] = useState(() => {
    const raw = localStorage.getItem("customers");
    return raw ? JSON.parse(raw) : initialCustomers;
  });
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "", email: "", phone: "", address: "",
      registrationDate: new Date().toISOString().split("T")[0],
      status: "Active",
    },
  });

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  const openModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      reset(customer);
    } else {
      setEditingCustomer(null);
      reset({
        name: "", email: "", phone: "", address: "",
        registrationDate: new Date().toISOString().split("T")[0],
        status: "Active",
      });
    }
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Confirm deletion of this user profile?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  const onSubmit = (data) => {
    if (editingCustomer) {
      setCustomers(customers.map((c) => (c.id === editingCustomer.id ? { ...c, ...data } : c)));
    } else {
      const newCustomer = { ...data, id: Date.now(), totalOrders: 0 };
      setCustomers([...customers, newCustomer]);
    }
    setShowModal(false);
  };

  return (
    <div className="animate__animated animate__fadeIn text-white">
      {/* Table Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-dark p-4 rounded-4 shadow-lg border border-secondary">
        <div>
          <h3 className="fw-bold text-primary mb-1">Customer Database</h3>
          <p className="text-secondary small mb-0">Manage agency clients and order history</p>
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
              <th className="py-3 text-center">ORDERS</th>
              <th className="pe-4 py-3 text-end">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-bottom border-secondary transition-all">
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
                    {c.status}
                  </span>
                </td>
                <td className="text-center fw-bold text-info">{c.totalOrders}</td>
                <td className="pe-4 text-end">
                  {/* Clean Icon-Style Actions */}
                  <button className="btn btn-outline-warning btn-sm border-0 me-1 p-2" onClick={() => openModal(c)} title="Edit Profile">
                    ✏️
                  </button>
                  <button className="btn btn-outline-danger btn-sm border-0 p-2" onClick={() => handleDelete(c.id)} title="Remove Profile">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modern Modal Design */}
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
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">Email Address</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("email")} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">Phone Number</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("phone")} />
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-secondary">Office/Home Address</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("address")} />
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
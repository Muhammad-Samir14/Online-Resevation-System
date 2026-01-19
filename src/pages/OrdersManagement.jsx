import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const initialOrders = [
  { id: 1001, customerName: "Akhter Ali", product: "Domestic Cylinder", quantity: 2, totalAmount: 3300, status: "Delivered", orderDate: "2025-10-18", deliveryAddress: "i block, Street 7" },
  { id: 1002, customerName: "Usman Khan", product: "Commercial Cylinder", quantity: 1, totalAmount: 4500, status: "Processing", orderDate: "2025-10-19", deliveryAddress: "J block, Street 12" },
  { id: 1003, customerName: "Sara Ahmed", product: "Industrial Cylinder", quantity: 1, totalAmount: 9200, status: "Pending", orderDate: "2025-10-20", deliveryAddress: "D Block, Street 3" },
];

const orderSchema = z.object({
  customerName: z.string().min(2, "Customer name required"),
  product: z.string().min(2, "Product required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  totalAmount: z.number().min(0, "Total must be >= 0"),
  status: z.enum(["Pending", "Processing", "Delivered", "Cancelled"]),
  orderDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  deliveryAddress: z.string().min(3, "Address required"),
});

export default function OrdersManagement() {
  const [orders, setOrders] = useState(() => {
    const raw = localStorage.getItem("orders");
    return raw ? JSON.parse(raw) : initialOrders;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: { customerName: "", product: "", quantity: 1, totalAmount: 0, status: "Pending", orderDate: new Date().toISOString().split("T")[0], deliveryAddress: "" },
  });

  useEffect(() => { localStorage.setItem("orders", JSON.stringify(orders)); }, [orders]);

  const handleCreate = () => {
    setEditingOrder(null);
    reset({ customerName: "", product: "", quantity: 1, totalAmount: 0, status: "Pending", orderDate: new Date().toISOString().split("T")[0], deliveryAddress: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    reset(order);
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    const orderData = { ...data, quantity: Number(data.quantity), totalAmount: Number(data.totalAmount) };
    if (editingOrder) {
      setOrders(orders.map((o) => (o.id === editingOrder.id ? { ...o, ...orderData } : o)));
    } else {
      setOrders([...orders, { ...orderData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Move this order to archives?")) setOrders(orders.filter((o) => o.id !== id));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return "text-warning border-warning bg-warning-soft";
      case "Processing": return "text-info border-info bg-info-soft";
      case "Delivered": return "text-success border-success bg-success-soft";
      case "Cancelled": return "text-danger border-danger bg-danger-soft";
      default: return "text-secondary border-secondary bg-secondary-soft";
    }
  };

  const formatCurrency = (val) => `Rs. ${Number(val).toLocaleString()}`;

  return (
    <div className="animate__animated animate__fadeIn text-white">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-dark p-4 rounded-4 shadow-lg border border-secondary">
        <div>
          <h3 className="fw-bold text-primary mb-1">Order Pipeline</h3>
          <p className="text-secondary small mb-0">Track cylinder bookings and fulfillment status</p>
        </div>
        <button className="btn btn-primary px-4 fw-bold" onClick={handleCreate} style={{ borderRadius: "10px" }}>
          + Create Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="card bg-dark border-secondary shadow-lg overflow-hidden" style={{ borderRadius: "20px" }}>
        <table className="table table-dark table-hover mb-0 align-middle">
          <thead className="text-secondary small text-uppercase bg-black bg-opacity-25">
            <tr className="border-bottom border-secondary">
              <th className="ps-4 py-3">Order ID</th>
              <th className="py-3">Customer & Destination</th>
              <th className="py-3">Product Info</th>
              <th className="py-3 text-center">Total Amount</th>
              <th className="py-3 text-center">Status</th>
              <th className="pe-4 py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-bottom border-secondary transition-all">
                <td className="ps-4">
                  <span className="text-primary fw-bold small">#{String(order.id).slice(-4)}</span>
                  <div className="small text-muted">{order.orderDate}</div>
                </td>
                <td>
                  <div className="fw-bold text-white">{order.customerName}</div>
                  <div className="small text-secondary" style={{ maxWidth: "200px" }}>📍 {order.deliveryAddress}</div>
                </td>
                <td>
                  <div className="text-white small fw-bold">{order.product}</div>
                  <div className="small text-secondary">Qty: {order.quantity} Units</div>
                </td>
                <td className="text-center">
                  <span className="fw-bold text-info">{formatCurrency(order.totalAmount)}</span>
                </td>
                <td className="text-center">
                  <span className={`badge rounded-pill px-3 py-2 border ${getStatusStyle(order.status)}`}
                    style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                    {order.status}
                  </span>
                </td>
                <td className="pe-4 text-end">
                  <button className="btn btn-outline-warning btn-sm border-0 me-1 p-2" onClick={() => handleEdit(order)} title="Update Order">
                    ✏️
                  </button>
                  <button className="btn btn-outline-danger btn-sm border-0 p-2" onClick={() => handleDelete(order.id)} title="Archive Order">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Professional Dark Modal */}
      {isModalOpen && (
        <>
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content bg-dark text-white border-secondary shadow-lg" style={{ borderRadius: "20px" }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="modal-header border-secondary">
                    <h5 className="modal-title fw-bold text-primary">{editingOrder ? "Update Manifest" : "New Booking"}</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)} />
                  </div>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">Customer Name</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("customerName")} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">Product Type</label>
                        <select className="form-select bg-dark text-white border-secondary" {...register("product")}>
                            <option value="Domestic Cylinder">Domestic Cylinder</option>
                            <option value="Commercial Cylinder">Commercial Cylinder</option>
                            <option value="Industrial Cylinder">Industrial Cylinder</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-secondary">Quantity</label>
                        <input type="number" className="form-control bg-dark text-white border-secondary" {...register("quantity", { valueAsNumber: true })} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-secondary">Total (Rs.)</label>
                        <input type="number" className="form-control bg-dark text-white border-secondary" {...register("totalAmount", { valueAsNumber: true })} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-secondary">Status</label>
                        <select className="form-select bg-dark text-white border-secondary" {...register("status")}>
                          <option>Pending</option><option>Processing</option><option>Delivered</option><option>Cancelled</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-secondary">Delivery Address</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("deliveryAddress")} placeholder="Street, Block, City" />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-secondary">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setIsModalOpen(false)}>Discard</button>
                    <button type="submit" className="btn btn-primary px-5">{editingOrder ? "Save Changes" : "Confirm Order"}</button>
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
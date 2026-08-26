import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "../supabaseClient";

const orderSchema = z.object({
  customerName: z.string().min(2, "Name required"),
  product: z.string().min(2, "Product required"),
  quantity: z.preprocess((val) => Number(val), z.number().min(1)),
  totalAmount: z.preprocess((val) => Number(val), z.number().min(0)),
  status: z.enum(["Pending", "Processing", "Delivered", "Cancelled"]),
  orderDate: z.string(),
  deliveryAddress: z.string().min(3, "Address required"),
});

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "", product: "Domestic Cylinder", quantity: 1,
      totalAmount: 0, status: "Pending",
      orderDate: new Date().toISOString().split("T")[0], deliveryAddress: ""
    },
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  const handleCreate = () => {
    setEditingOrder(null);
    reset();
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const { data: created, error } = await supabase
        .from("orders")
        .insert([data])
        .select();
      if (error) throw error;
      setOrders([...orders, created[0]]);
      setIsModalOpen(false);
      alert("Order successfully saved!");
    } catch (err) {
      console.error("Error saving order:", err);
      alert(err.message || "Error saving order");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return { color: "#e5aa00", bg: "rgba(255, 193, 7, 0.1)" };
      case "Processing": return { color: "#0d6efd", bg: "rgba(13, 110, 253, 0.1)" };
      case "Delivered": return { color: "#198754", bg: "rgba(25, 135, 84, 0.1)" };
      case "Cancelled": return { color: "#dc3545", bg: "rgba(220, 53, 69, 0.1)" };
      default: return { color: "#6c757d", bg: "rgba(108, 117, 125, 0.1)" };
    }
  };

  const formatCurrency = (val) => `Rs. ${Number(val).toLocaleString()}`;

  return (
    <div>
      <div
        className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 shadow-sm"
        style={{ background: "#fff", border: "1px solid #dce5f0" }}
      >
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#10233f" }}>
            <i className="bi bi-clipboard-data text-primary me-2"></i>
            Order Pipeline
          </h3>
          <p className="text-muted small mb-0">Track cylinder bookings and fulfillment status</p>
        </div>
        <button
          className="btn btn-primary px-4 fw-bold"
          onClick={handleCreate}
          style={{ borderRadius: "10px" }}
        >
          <i className="bi bi-plus-lg me-1"></i>
          Create Order
        </button>
      </div>

      <div
        className="card shadow-sm overflow-hidden"
        style={{ borderRadius: "16px", border: "1px solid #dce5f0" }}
      >
        <table className="table table-hover mb-0 align-middle">
          <thead style={{ background: "#eef5ff" }}>
            <tr style={{ borderBottom: "2px solid #d9e6f8" }}>
              <th className="ps-4 py-3 text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Customer</th>
              <th className="py-3 text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Product</th>
              <th className="py-3 text-center text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Amount</th>
              <th className="py-3 text-center text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const style = getStatusStyle(order.status);
                return (
                  <tr key={order.id} className="border-top" style={{ borderColor: "#eef3f8" }}>
                    <td className="ps-4">
                      <div className="fw-bold" style={{ color: "#10233f" }}>{order.customerName}</div>
                      <small className="text-muted">{order.deliveryAddress}</small>
                    </td>
                    <td style={{ color: "#172033" }}>{order.product}</td>
                    <td className="text-center fw-bold" style={{ color: "#0d6efd" }}>{formatCurrency(order.totalAmount)}</td>
                    <td className="text-center">
                      <span
                        className="badge border px-3 py-2"
                        style={{ backgroundColor: style.bg, color: style.color, borderColor: style.color }}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg" style={{ borderRadius: "20px", border: "1px solid #dce5f0" }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-header" style={{ borderBottom: "1px solid #eef3f8" }}>
                  <h5 className="modal-title fw-bold" style={{ color: "#10233f" }}>Create Order</h5>
                  <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)} />
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Customer Name</label>
                      <input className="form-control marwat-input" {...register("customerName")} placeholder="Customer name" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Product</label>
                      <input className="form-control marwat-input" {...register("product")} placeholder="Product" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-muted">Quantity</label>
                      <input type="number" className="form-control marwat-input" {...register("quantity")} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-muted">Total Amount</label>
                      <input type="number" className="form-control marwat-input" {...register("totalAmount")} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-muted">Status</label>
                      <select className="form-select marwat-input" {...register("status")}>
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Order Date</label>
                      <input type="date" className="form-control marwat-input" {...register("orderDate")} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Delivery Address</label>
                      <input className="form-control marwat-input" {...register("deliveryAddress")} placeholder="Address" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: "1px solid #eef3f8" }}>
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Save Order</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

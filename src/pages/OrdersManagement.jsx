import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios"; // 1. Added Axios

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
  const [orders, setOrders] = useState([]); // Default to empty array
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

  // 2. Fetch orders from MongoDB on load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders');
        setOrders(res.data);
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
      // 3. Send to MongoDB
      await axios.post('http://localhost:5000/api/orders', data);
      
      // Refresh list after adding
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
      
      setIsModalOpen(false);
      alert("Order successfully saved to Marwat Gas Database!");
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Backend connection error. Ensure your server is running!");
    }
  };

  // ... (Keep your getStatusStyle and formatCurrency here) ...
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return "text-warning border-warning";
      case "Processing": return "text-info border-info";
      case "Delivered": return "text-success border-success";
      case "Cancelled": return "text-danger border-danger";
      default: return "text-secondary border-secondary";
    }
  };

  const formatCurrency = (val) => `Rs. ${Number(val).toLocaleString()}`;

  return (
    <div className="animate__animated animate__fadeIn text-white">
      {/* ... Keep your existing JSX Header and Table ... */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-dark p-4 rounded-4 shadow-lg border border-secondary">
        <div>
          <h3 className="fw-bold text-primary mb-1">Order Pipeline</h3>
          <p className="text-secondary small mb-0">Track cylinder bookings and fulfillment status</p>
        </div>
        <button className="btn btn-primary px-4 fw-bold" onClick={handleCreate} style={{ borderRadius: "10px" }}>
          + Create Order
        </button>
      </div>

      <div className="card bg-dark border-secondary shadow-lg overflow-hidden" style={{ borderRadius: "20px" }}>
        <table className="table table-dark table-hover mb-0 align-middle">
          <thead className="text-secondary small text-uppercase bg-black bg-opacity-25">
            <tr><th className="ps-4 py-3">Customer</th><th className="py-3">Product</th><th className="py-3 text-center">Amount</th><th className="py-3 text-center">Status</th></tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="ps-4">{order.customerName}<div className="small text-muted">{order.deliveryAddress}</div></td>
                <td>{order.product}</td>
                <td className="text-center text-info fw-bold">{formatCurrency(order.totalAmount)}</td>
                <td className="text-center"><span className={`badge border ${getStatusStyle(order.status)}`}>{order.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal remains the same as before */}
      {isModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
            {/* ... Your modal content ... */}
        </div>
      )}
    </div>
  );
}
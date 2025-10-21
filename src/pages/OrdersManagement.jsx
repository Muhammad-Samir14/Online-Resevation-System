import React, { useState } from "react";

const initialOrders = [
  {
    id: 1001,
    customerName: "Akhter Ali",
    product: "Domestic Cylinder",
    quantity: 2,
    totalAmount: 3300,
    status: "Delivered",
    orderDate: "2025-10-18",
    deliveryAddress: "i block, Street 7",
  },
  {
    id: 1002,
    customerName: "Usman Khan",
    product: "Commercial Cylinder",
    quantity: 1,
    totalAmount: 4500,
    status: "Processing",
    orderDate: "2025-10-19",
    deliveryAddress: "J block, Street 12",
  },
  {
    id: 1003,
    customerName: "Sara Ahmed",
    product: "Industrial Cylinder",
    quantity: 1,
    totalAmount: 9200,
    status: "Pending",
    orderDate: "2025-10-20",
    deliveryAddress: "D Block, Street 3",
  },
];

export default function OrdersManagement() {
  const [orders, setOrders] = useState(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    product: "",
    quantity: 1,
    totalAmount: 0,
    status: "Pending",
    orderDate: new Date().toISOString().split("T")[0],
    deliveryAddress: "",
  });

  const handleCreate = () => {
    setEditingOrder(null);
    setFormData({
      customerName: "",
      product: "",
      quantity: 1,
      totalAmount: 0,
      status: "Pending",
      orderDate: new Date().toISOString().split("T")[0],
      deliveryAddress: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({ ...order });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter((o) => o.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingOrder) {
      setOrders(
        orders.map((o) => (o.id === editingOrder.id ? { ...formData, id: editingOrder.id } : o))
      );
    } else {
      const newOrder = { ...formData, id: Math.max(...orders.map((o) => o.id)) + 1 };
      setOrders([...orders, newOrder]);
    }
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning text-dark";
      case "Processing":
        return "bg-primary text-white";
      case "Delivered":
        return "bg-success text-white";
      case "Cancelled":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Manage customer orders and reservations</p>
        <button className="btn btn-primary" onClick={handleCreate}>
          <span className="me-2">+</span> Add Order
        </button>
      </div>

      <div className="table-responsive shadow-sm rounded bg-white">
        <table className="table table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customerName}</td>
                <td>{order.product}</td>
                <td>{order.quantity}</td>
                <td>₱{order.totalAmount}</td>
                <td>
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.orderDate}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(order)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(order.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingOrder ? "Edit Order" : "Add New Order"}</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Customer Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Product</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.quantity}
                      min="1"
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total Amount (₱)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.totalAmount}
                      onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Order Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.orderDate}
                      onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Delivery Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingOrder ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Out for Delivery", "Delivered", "Cancelled"];
const FILTER_OPTIONS = ["All", ...STATUS_OPTIONS];

export default function OrdersManagement({ onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [viewOrder, setViewOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", orderId)
        .select();
      if (error) throw error;
      setOrders(orders.map((o) => (o.id === orderId ? data[0] : o)));
      if (viewOrder?.id === orderId) setViewOrder(data[0]);
    } catch (err) {
      alert(err.message || "Error updating order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return { color: "#ffc107", bg: "rgba(255,193,7,.12)" };
      case "Confirmed": return { color: "#0d6efd", bg: "rgba(13,110,253,.12)" };
      case "Out for Delivery": return { color: "#0dcaf0", bg: "rgba(13,202,240,.12)" };
      case "Delivered": return { color: "#198754", bg: "rgba(25,135,84,.12)" };
      case "Cancelled": return { color: "#dc3545", bg: "rgba(220,53,69,.12)" };
      default: return { color: "#6c757d", bg: "rgba(108,117,125,.12)" };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const filteredOrders = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const filterCounts = FILTER_OPTIONS.reduce((acc, f) => {
    acc[f] = f === "All" ? orders.length : orders.filter((o) => o.status === f).length;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <small className="text-warning fw-bold text-uppercase" style={{ letterSpacing: "1.5px", fontSize: ".75rem" }}>
          Order Management
        </small>
        <h2 className="fw-bold text-white mb-1">Orders</h2>
        <p className="text-white-50 mb-0">View and manage all customer bookings</p>
      </div>

      {/* Filter tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            className="btn btn-sm"
            onClick={() => setFilter(f)}
            style={{
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: ".85rem",
              padding: ".5rem 1rem",
              background: filter === f ? "rgba(13,110,253,.2)" : "rgba(255,255,255,.05)",
              color: filter === f ? "#0d6efd" : "rgba(255,255,255,.6)",
              border: filter === f ? "1px solid rgba(13,110,253,.4)" : "1px solid rgba(255,255,255,.08)",
            }}
          >
            {f}
            <span className="badge bg-secondary ms-2" style={{ fontSize: ".65rem" }}>
              {filterCounts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="stat-card p-0">
        <div className="table-responsive">
          <table className="table admin-table mb-0">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Cylinder</th>
                <th className="text-center">Qty</th>
                <th className="text-center">Total</th>
                <th className="text-center">Payment</th>
                <th className="text-center">Status</th>
                <th className="text-center">Date</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-white-50">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const style = getStatusStyle(order.status);
                  return (
                    <tr key={order.id}>
                      <td className="text-white-50 small" style={{ fontFamily: "monospace" }}>
                        #{order.id?.slice(0, 8)}
                      </td>
                      <td>
                        <div className="fw-semibold text-white">{order.full_name}</div>
                        <small className="text-white-50">{order.phone_number}</small>
                      </td>
                      <td>{order.cylinder_size}</td>
                      <td className="text-center">{order.quantity}</td>
                      <td className="text-center fw-bold text-warning">
                        Rs {Number(order.total_price || 0).toLocaleString()}
                      </td>
                      <td className="text-center text-white-50 small">{order.payment_method}</td>
                      <td className="text-center">
                        <span
                          className="badge px-3 py-2"
                          style={{ backgroundColor: style.bg, color: style.color, borderRadius: "8px" }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="text-center text-white-50 small">{formatDate(order.created_at)}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm"
                          style={{ background: "rgba(13,110,253,.15)", color: "#0d6efd", border: "1px solid rgba(13,110,253,.3)", borderRadius: "8px" }}
                          onClick={() => setViewOrder(order)}
                        >
                          <i className="bi bi-eye me-1"></i>
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View / Process order modal */}
      {viewOrder && (
        <>
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,.6)" }}
            onClick={() => setViewOrder(null)}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
              <div
                className="modal-content"
                style={{
                  background: "#10233f",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: "18px",
                }}
              >
                <div className="modal-header border-bottom border-secondary border-opacity-25">
                  <h5 className="modal-title fw-bold text-white">
                    <i className="bi bi-clipboard-data text-warning me-2"></i>
                    Order #{viewOrder.id?.slice(0, 8)}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setViewOrder(null)}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row g-4">
                    {/* Customer info */}
                    <div className="col-md-6">
                      <div className="text-white-50 text-uppercase fw-bold mb-2" style={{ fontSize: ".7rem", letterSpacing: ".5px" }}>
                        Customer Information
                      </div>
                      <div className="text-white mb-1"><strong>Name:</strong> {viewOrder.full_name}</div>
                      <div className="text-white-50 mb-1"><strong>Email:</strong> {viewOrder.email || "—"}</div>
                      <div className="text-white-50 mb-1"><strong>Phone:</strong> {viewOrder.phone_number || "—"}</div>
                      <div className="text-white-50"><strong>Order Type:</strong> {viewOrder.order_type}</div>
                    </div>

                    {/* Order details */}
                    <div className="col-md-6">
                      <div className="text-white-50 text-uppercase fw-bold mb-2" style={{ fontSize: ".7rem", letterSpacing: ".5px" }}>
                        Order Details
                      </div>
                      <div className="text-white mb-1"><strong>Cylinder:</strong> {viewOrder.cylinder_type} {viewOrder.cylinder_size}</div>
                      <div className="text-white-50 mb-1"><strong>Quantity:</strong> {viewOrder.quantity}</div>
                      <div className="text-white-50 mb-1"><strong>Unit Price:</strong> Rs {Number(viewOrder.unit_price || 0).toLocaleString()}</div>
                      <div className="text-warning fw-bold"><strong>Total:</strong> Rs {Number(viewOrder.total_price || 0).toLocaleString()}</div>
                    </div>

                    {/* Delivery info */}
                    <div className="col-12">
                      <div className="text-white-50 text-uppercase fw-bold mb-2" style={{ fontSize: ".7rem", letterSpacing: ".5px" }}>
                        Delivery Information
                      </div>
                      <div className="text-white mb-1"><strong>Address:</strong> {viewOrder.street_address || "—"}</div>
                      <div className="text-white-50 mb-1"><strong>Landmark:</strong> {viewOrder.landmark || "—"}</div>
                      <div className="text-white-50"><strong>Time Slot:</strong> {viewOrder.delivery_time_slot || "—"}</div>
                    </div>

                    {/* Payment info */}
                    <div className="col-12">
                      <div className="text-white-50 text-uppercase fw-bold mb-2" style={{ fontSize: ".7rem", letterSpacing: ".5px" }}>
                        Payment
                      </div>
                      <div className="text-white mb-1"><strong>Method:</strong> {viewOrder.payment_method}</div>
                      {viewOrder.sender_name && (
                        <div className="text-white-50 mb-1"><strong>Sender:</strong> {viewOrder.sender_name} ({viewOrder.sender_number})</div>
                      )}
                      {viewOrder.transaction_id && (
                        <div className="text-white-50 mb-1"><strong>Transaction ID:</strong> {viewOrder.transaction_id}</div>
                      )}
                      {viewOrder.amount_sent && (
                        <div className="text-white-50"><strong>Amount Sent:</strong> Rs {Number(viewOrder.amount_sent).toLocaleString()}</div>
                      )}
                    </div>

                    {viewOrder.additional_notes && (
                      <div className="col-12">
                        <div className="text-white-50 text-uppercase fw-bold mb-2" style={{ fontSize: ".7rem", letterSpacing: ".5px" }}>
                          Additional Notes
                        </div>
                        <div className="text-white-50">{viewOrder.additional_notes}</div>
                      </div>
                    )}

                    {/* Status management */}
                    <div className="col-12">
                      <div
                        className="p-3 rounded-3"
                        style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}
                      >
                        <label className="form-label text-white-50 fw-bold mb-3" style={{ fontSize: ".8rem" }}>
                          Update Order Status
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map((s) => {
                            const style = getStatusStyle(s);
                            const isActive = viewOrder.status === s;
                            return (
                              <button
                                key={s}
                                disabled={updatingStatus}
                                className="btn btn-sm"
                                style={{
                                  borderRadius: "8px",
                                  fontWeight: 600,
                                  fontSize: ".8rem",
                                  padding: ".5rem 1rem",
                                  background: isActive ? style.bg : "rgba(255,255,255,.04)",
                                  color: isActive ? style.color : "rgba(255,255,255,.5)",
                                  border: isActive ? `1px solid ${style.color}` : "1px solid rgba(255,255,255,.08)",
                                }}
                                onClick={() => updateStatus(viewOrder.id, s)}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top border-secondary border-opacity-25">
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={() => setViewOrder(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

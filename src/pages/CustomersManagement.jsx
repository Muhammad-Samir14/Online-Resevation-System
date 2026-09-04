import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

export default function CustomersManagement() {
  const [customers, setCustomers] = useState([]);
  const [orderCounts, setOrderCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const customerList = data || [];

      // Get order counts per customer by matching email or name in bookings
      const { data: bookings } = await supabase
        .from("bookings")
        .select("full_name, email");

      const counts = {};
      if (bookings) {
        for (const c of customerList) {
          const matches = bookings.filter(
            (b) =>
              (c.email && b.email === c.email) ||
              (c.name && b.full_name === c.name)
          );
          counts[c.id] = matches.length;
        }
      }
      setOrderCounts(counts);
      setCustomers(customerList);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
      <div className="mb-5">
        <small
          className="text-warning fw-bold text-uppercase"
          style={{ letterSpacing: "1.5px", fontSize: ".75rem" }}
        >
          Customer Management
        </small>
        <h2 className="fw-bold text-white mb-1">Customers</h2>
        <p className="text-white-50 mb-0">
          Registered customer accounts and order history
        </p>
      </div>

      <div className="stat-card p-0">
        <div className="table-responsive">
          <table className="table admin-table mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th className="text-center">Orders</th>
                <th className="text-center">Status</th>
                <th className="text-end">Registered</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-white-50">
                    <i className="bi bi-people fs-1 d-block mb-2"></i>
                    No customers registered yet.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id}>
                    <td className="fw-semibold text-white">{c.name}</td>
                    <td className="text-white-50">{c.email || "—"}</td>
                    <td className="text-white-50">{c.phone || "—"}</td>
                    <td className="text-white-50 small">
                      {c.address || "—"}
                    </td>
                    <td className="text-center">
                      <span
                        className="badge"
                        style={{
                          background: "rgba(13,110,253,.15)",
                          color: "#0d6efd",
                          borderRadius: "8px",
                        }}
                      >
                        {orderCounts[c.id] || 0}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className="badge px-3 py-2"
                        style={{
                          background:
                            c.status === "Active"
                              ? "rgba(25,135,84,.12)"
                              : "rgba(220,53,69,.12)",
                          color:
                            c.status === "Active" ? "#198754" : "#dc3545",
                          borderRadius: "8px",
                        }}
                      >
                        {c.status || "Active"}
                      </span>
                    </td>
                    <td className="text-end text-white-50 small">
                      {formatDate(c.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

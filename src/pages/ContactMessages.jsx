import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

const STATUS_OPTIONS = ["New", "Read", "Responded"];

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [viewMessage, setViewMessage] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching contact messages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateStatus = async (messageId, newStatus) => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .update({ status: newStatus })
        .eq("id", messageId)
        .select();
      if (error) throw error;
      setMessages(messages.map((m) => (m.id === messageId ? data[0] : m)));
      if (viewMessage?.id === messageId) setViewMessage(data[0]);
    } catch (err) {
      alert(err.message || "Error updating message status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this message permanently?")) {
      try {
        const { error } = await supabase.from("contact_messages").delete().eq("id", id);
        if (error) throw error;
        setMessages(messages.filter((m) => m.id !== id));
        setViewMessage(null);
      } catch (err) {
        alert("Failed to delete message.");
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "New": return { color: "#ffc107", bg: "rgba(255,193,7,.12)" };
      case "Read": return { color: "#0d6efd", bg: "rgba(13,110,253,.12)" };
      case "Responded": return { color: "#198754", bg: "rgba(25,135,84,.12)" };
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

  const filteredMessages = filter === "All" ? messages : messages.filter((m) => m.status === filter);
  const newCount = messages.filter((m) => m.status === "New").length;

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
          Customer Inbox
        </small>
        <h2 className="fw-bold text-white mb-1">Contact Messages</h2>
        <p className="text-white-50 mb-0">
          Messages submitted through the contact form
          {newCount > 0 && (
            <span className="badge bg-warning ms-2" style={{ fontSize: ".7rem" }}>{newCount} New</span>
          )}
        </p>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {["All", ...STATUS_OPTIONS].map((f) => (
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
          </button>
        ))}
      </div>

      <div className="stat-card p-0">
        <div className="table-responsive">
          <table className="table admin-table mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Message</th>
                <th className="text-center">Status</th>
                <th className="text-center">Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-white-50">
                    <i className="bi bi-envelope fs-1 d-block mb-2"></i>
                    No messages yet.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => {
                  const style = getStatusStyle(msg.status);
                  return (
                    <tr key={msg.id}>
                      <td className="fw-semibold text-white">{msg.name}</td>
                      <td>
                        <div className="small text-white-50">{msg.email || "—"}</div>
                        <div className="small text-white-50">{msg.phone || "—"}</div>
                      </td>
                      <td className="text-white-50 small" style={{ maxWidth: "300px" }}>
                        {msg.message?.length > 80 ? msg.message.slice(0, 80) + "..." : msg.message}
                      </td>
                      <td className="text-center">
                        <span
                          className="badge px-3 py-2"
                          style={{ backgroundColor: style.bg, color: style.color, borderRadius: "8px" }}
                        >
                          {msg.status}
                        </span>
                      </td>
                      <td className="text-center text-white-50 small">{formatDate(msg.created_at)}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm"
                          style={{ background: "rgba(13,110,253,.15)", color: "#0d6efd", border: "1px solid rgba(13,110,253,.3)", borderRadius: "8px" }}
                          onClick={() => {
                            setViewMessage(msg);
                            if (msg.status === "New") updateStatus(msg.id, "Read");
                          }}
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

      {viewMessage && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,.6)" }}
          onClick={() => setViewMessage(null)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
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
                  <i className="bi bi-envelope-open text-warning me-2"></i>
                  Message from {viewMessage.name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setViewMessage(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="mb-3">
                  <div className="text-white-50 text-uppercase fw-bold mb-1" style={{ fontSize: ".7rem", letterSpacing: ".5px" }}>
                    Contact Information
                  </div>
                  <div className="text-white mb-1"><strong>Email:</strong> {viewMessage.email || "—"}</div>
                  <div className="text-white-50"><strong>Phone:</strong> {viewMessage.phone || "—"}</div>
                </div>

                <div className="mb-3">
                  <div className="text-white-50 text-uppercase fw-bold mb-1" style={{ fontSize: ".7rem", letterSpacing: ".5px" }}>
                    Message
                  </div>
                  <div className="text-white p-3 rounded-3" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}>
                    {viewMessage.message}
                  </div>
                </div>

                <div className="text-white-50 small">
                  <i className="bi bi-clock me-1"></i>
                  Received: {formatDate(viewMessage.created_at)}
                </div>

                <div className="mt-4">
                  <label className="form-label text-white-50 fw-bold mb-2" style={{ fontSize: ".8rem" }}>
                    Update Status
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((s) => {
                      const style = getStatusStyle(s);
                      const isActive = viewMessage.status === s;
                      return (
                        <button
                          key={s}
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
                          onClick={() => updateStatus(viewMessage.id, s)}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top border-secondary border-opacity-25">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(viewMessage.id)}
                >
                  <i className="bi bi-trash-fill me-1"></i>Delete
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => setViewMessage(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

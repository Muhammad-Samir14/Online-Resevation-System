import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Dashboard from "./Dashboard";
import CustomersManagement from "./CustomersManagement";
import DeliveryPersonnelManagement from "./DeliveryPersonnelManagement";
import ProductManagement from "./ProductManagement";
import OrdersManagement from "./OrdersManagement";

function AdminLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const toastTimerRef = useRef(null);

  const checkAuth = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/admin-login");
        return;
      }
      const role = user.app_metadata?.role;
      if (role !== "admin") {
        await supabase.auth.signOut();
        navigate("/admin-login");
        return;
      }
      setIsAdmin(true);
      setAdminEmail(user.email || "");
    } catch {
      navigate("/admin-login");
    } finally {
      setAuthChecked(true);
    }
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Load initial unread notifications (pending bookings created in last 24h)
  const loadInitialNotifications = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("bookings")
        .select("id, full_name, cylinder_size, quantity, total_price, status, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) {
        const unread = data.map((b) => ({ ...b, read: false }));
        setNotifications(unread);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) loadInitialNotifications();
  }, [isAdmin, loadInitialNotifications]);

  // Realtime subscription for new bookings
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel("admin-new-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          const newOrder = payload.new;
          // Add to notifications
          setNotifications((prev) => [
            { ...newOrder, read: false },
            ...prev,
          ]);

          // Show toast
          if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
          setToast({
            id: newOrder.id,
            full_name: newOrder.full_name,
            cylinder_size: newOrder.cylinder_size,
            quantity: newOrder.quantity,
            total_price: newOrder.total_price,
          });
          toastTimerRef.current = setTimeout(() => setToast(null), 8000);

          // Browser push notification
          if ("Notification" in window && Notification.permission === "granted") {
            try {
              const n = new Notification("New Order Received", {
                body: `${newOrder.full_name} — ${newOrder.cylinder_size} x${newOrder.quantity} — Rs ${Number(newOrder.total_price).toLocaleString()}`,
                icon: "/logo.png",
                tag: newOrder.id,
              });
              n.onclick = () => {
                window.focus();
                setActivePage("orders");
                n.close();
              };
            } catch (e) {
              console.error("Push notification error:", e);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  // Request notification permission on mount
  useEffect(() => {
    if (isAdmin && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [isAdmin]);

  // Register service worker for push notifications
  useEffect(() => {
    if (isAdmin && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, [isAdmin]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { id: "customers", label: "Customers", icon: "bi-people-fill" },
    { id: "products", label: "Products / Stock", icon: "bi-box-seam" },
    { id: "orders", label: "Orders", icon: "bi-clipboard-data" },
    { id: "deliveries", label: "Deliveries", icon: "bi-truck" },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "customers": return <CustomersManagement />;
      case "products": return <ProductManagement />;
      case "orders": return <OrdersManagement onNavigate={setActivePage} />;
      case "deliveries": return <DeliveryPersonnelManagement />;
      default: return <Dashboard onNavigate={setActivePage} />;
    }
  };

  if (!authChecked) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100" style={{ background: "#10233f" }}>
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="admin-wrapper">
      <style>{`
        * { box-sizing: border-box; }
        .admin-wrapper { display: flex; height: 100vh; width: 100vw; background-color: #0a1929; overflow: hidden; }
        .sidebar {
          width: 260px;
          background: linear-gradient(180deg, #0a1929 0%, #10233f 100%);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1rem;
          border-right: 1px solid rgba(255,255,255,.06);
          flex-shrink: 0;
          z-index: 1050;
        }
        .content-area { flex-grow: 1; overflow-y: auto; padding: 2rem; background-color: #0a1929; }
        .nav-item-admin {
          display: flex; align-items: center; gap: .75rem;
          padding: .75rem 1rem; border-radius: 10px; border: none;
          background: transparent; color: rgba(255,255,255,.5);
          font-weight: 500; width: 100%; text-align: left;
          transition: all .2s ease; cursor: pointer; font-size: .95rem;
        }
        .nav-item-admin:hover { background: rgba(255,255,255,.06); color: rgba(255,255,255,.85); }
        .nav-item-admin.active {
          background: rgba(13,110,253,.15);
          color: #fff;
          border-left: 3px solid #0d6efd;
        }
        .nav-item-admin.active i { color: #ffc107; }
        .stat-card {
          background: linear-gradient(135deg, #10233f 0%, #0a1929 100%);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px; padding: 1.5rem;
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,.3); }
        .admin-table-wrap {
          background: #10233f; border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px; overflow: hidden;
        }
        .admin-table thead th {
          background: rgba(255,255,255,.04); color: rgba(255,255,255,.5);
          font-size: .75rem; text-transform: uppercase; letter-spacing: .5px;
          font-weight: 700; padding: 1rem; border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .admin-table tbody td {
          color: rgba(255,255,255,.85); padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,.04); vertical-align: middle;
        }
        .admin-table tbody tr:hover { background: rgba(255,255,255,.03); }
        .notif-dropdown {
          position: absolute; top: 100%; right: 0; margin-top: .5rem;
          width: 360px; max-height: 480px; overflow-y: auto;
          background: #10233f; border: 1px solid rgba(255,255,255,.1);
          border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,.5);
          z-index: 1100;
        }
        .notif-item {
          padding: 1rem; border-bottom: 1px solid rgba(255,255,255,.05);
          cursor: pointer; transition: background .15s;
        }
        .notif-item:hover { background: rgba(255,255,255,.04); }
        .notif-item.unread { border-left: 3px solid #ffc107; }
        .toast-popup {
          position: fixed; bottom: 24px; right: 24px;
          background: #10233f; border: 1px solid rgba(255,255,255,.1);
          border-left: 4px solid #ffc107; border-radius: 14px;
          padding: 1rem 1.25rem; box-shadow: 0 20px 60px rgba(0,0,0,.5);
          z-index: 1200; max-width: 380px; animation: slideIn .3s ease;
        }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @media (max-width: 991px) {
          .sidebar { position: fixed; left: 0; top: 0; height: 100%; transform: translateX(-100%); transition: transform .3s; }
          .sidebar.open { transform: translateX(0); }
          .content-area { padding: 1rem; }
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="mb-5 px-2 d-flex align-items-center justify-content-between">
          <div>
            <h4 className="fw-bold text-white mb-0" style={{ letterSpacing: "1px", fontSize: "1.1rem" }}>
              MARWAT GAS
            </h4>
            <small className="text-warning fw-bold">Admin Suite</small>
          </div>
          <button className="btn btn-sm text-white-50 d-lg-none" onClick={() => setSidebarOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="d-flex flex-column gap-1 mb-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item-admin ${activePage === item.id ? "active" : ""}`}
              onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
            >
              <i className={`bi ${item.icon}`} style={{ fontSize: "1.1rem" }}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-top border-secondary border-opacity-25">
          <div className="px-2 mb-3">
            <small className="text-white-50 d-block text-truncate" style={{ fontSize: ".75rem" }}>
              <i className="bi bi-person-circle me-1"></i>{adminEmail}
            </small>
          </div>
          <button
            onClick={handleLogout}
            className="nav-item-admin"
            style={{ color: "#dc3545" }}
          >
            <i className="bi bi-box-arrow-left" style={{ fontSize: "1.1rem" }}></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="content-area">
        {/* Mobile header */}
        <div className="d-flex align-items-center justify-content-between mb-4 d-lg-none">
          <button className="btn btn-outline-light btn-sm" onClick={() => setSidebarOpen(true)}>
            <i className="bi bi-list fs-5"></i>
          </button>
          <span className="text-white-50 small">Marwat Gas Admin</span>
          <div style={{ width: "40px" }}></div>
        </div>

        {/* Desktop notification bell */}
        <div className="d-flex justify-content-end mb-3 position-relative d-none d-lg-flex">
          <div className="position-relative">
            <button
              className="btn btn-outline-light btn-sm position-relative"
              onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllRead(); }}
              style={{ borderRadius: "10px" }}
            >
              <i className="bi bi-bell-fill"></i>
              {unreadCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning"
                  style={{ fontSize: ".65rem", minWidth: "18px" }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notif-dropdown">
                <div className="p-3 border-bottom border-secondary border-opacity-25">
                  <strong className="text-white">Notifications</strong>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-white-50 small">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.read ? "unread" : ""}`}
                      onClick={() => { setActivePage("orders"); setShowNotifications(false); }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="text-white fw-semibold small">{n.full_name}</div>
                          <div className="text-white-50" style={{ fontSize: ".8rem" }}>
                            {n.cylinder_size} × {n.quantity} — Rs {Number(n.total_price || 0).toLocaleString()}
                          </div>
                        </div>
                        {!n.read && <span className="badge bg-warning" style={{ fontSize: ".6rem" }}>New</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {renderContent()}
      </main>

      {/* Toast notification */}
      {toast && (
        <div className="toast-popup" onClick={() => { setActivePage("orders"); setToast(null); }}>
          <div className="d-flex align-items-start gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style={{ width: "40px", height: "40px", background: "rgba(255,193,7,.15)" }}
            >
              <i className="bi bi-bell-fill text-warning"></i>
            </div>
            <div>
              <div className="text-white fw-bold small">New Order Received</div>
              <div className="text-white-50" style={{ fontSize: ".85rem" }}>
                {toast.full_name} — {toast.cylinder_size} × {toast.quantity}
              </div>
              <div className="text-warning fw-bold" style={{ fontSize: ".85rem" }}>
                Rs {Number(toast.total_price || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLayout;

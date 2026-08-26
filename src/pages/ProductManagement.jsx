import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "../supabaseClient";

const productSchema = z.object({
  name: z.string().min(2, "Name required"),
  type: z.string().min(1, "Type required"),
  weight: z.string().min(1, "Weight required"),
  price: z.number().min(0, "Price must be >= 0"),
  stock: z.number().min(0, "Stock must be >= 0"),
  description: z.string().optional(),
});

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", type: "LPG", weight: "", price: 0, stock: 0, description: "" },
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProducts(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = () => {
    setEditingProduct(null);
    reset({ name: "", type: "LPG", weight: "", price: 0, stock: 0, description: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      type: product.type,
      weight: product.weight,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    const productData = { ...data, price: Number(data.price), stock: Number(data.stock) };
    try {
      if (editingProduct) {
        const { data: updated, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id)
          .select();
        if (error) throw error;
        setProducts(products.map((p) => (p.id === editingProduct.id ? updated[0] : p)));
      } else {
        const { data: created, error } = await supabase
          .from("products")
          .insert([productData])
          .select();
        if (error) throw error;
        setProducts([...products, created[0]]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || "Error processing inventory modification data");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this product from inventory?")) {
      try {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        alert("Failed to delete product from backend server.");
      }
    }
  };

  const formatPrice = (v) => `Rs. ${Number(v).toLocaleString()}`;

  const getStockBadge = (stock) => {
    if (stock <= 5) return { color: "#dc3545", bg: "rgba(220, 53, 69, 0.1)" };
    if (stock <= 15) return { color: "#e5aa00", bg: "rgba(255, 193, 7, 0.1)" };
    return { color: "#198754", bg: "rgba(25, 135, 84, 0.1)" };
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 shadow-sm"
        style={{ background: "#fff", border: "1px solid #dce5f0" }}
      >
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#10233f" }}>
            <i className="bi bi-box-seam text-primary me-2"></i>
            Cylinder Catalog
          </h3>
          <p className="text-muted small mb-0">Manage LPG sizes, weights, prices, and stock units</p>
        </div>
        <button
          className="btn btn-primary px-4 fw-bold"
          onClick={handleCreate}
          style={{ borderRadius: "10px" }}
        >
          <i className="bi bi-plus-lg me-1"></i>
          Add New Product
        </button>
      </div>

      <div
        className="card shadow-sm overflow-hidden"
        style={{ borderRadius: "16px", border: "1px solid #dce5f0" }}
      >
        <table className="table table-hover mb-0 align-middle">
          <thead style={{ background: "#eef5ff" }}>
            <tr style={{ borderBottom: "2px solid #d9e6f8" }}>
              <th className="ps-4 py-3 text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Product</th>
              <th className="py-3 text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Specifications</th>
              <th className="py-3 text-center text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Unit Price</th>
              <th className="py-3 text-center text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Stock</th>
              <th className="pe-4 py-3 text-end text-uppercase fw-bold small" style={{ color: "#6c757d" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  No products in the catalog yet.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const badge = getStockBadge(p.stock);
                return (
                  <tr key={p.id} className="border-top" style={{ borderColor: "#eef3f8" }}>
                    <td className="ps-4">
                      <div className="fw-bold" style={{ color: "#10233f" }}>{p.name}</div>
                      <small className="text-muted">{p.description || "No description added."}</small>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary me-2">{p.type}</span>
                      <span className="small fw-bold" style={{ color: "#0d6efd" }}>{p.weight}</span>
                    </td>
                    <td className="text-center fw-bold" style={{ color: "#10233f" }}>
                      {formatPrice(p.price)}
                    </td>
                    <td className="text-center">
                      <span
                        className="badge rounded-pill px-3 py-2 border"
                        style={{ backgroundColor: badge.bg, color: badge.color, borderColor: badge.color }}
                      >
                        {p.stock} Units
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-sm me-1"
                        style={{ background: "#fff8dd", color: "#e5aa00", border: "1px solid #ffe38c" }}
                        onClick={() => handleEdit(p)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: "#fde8e8", color: "#dc3545", border: "1px solid #f5c2c7" }}
                        onClick={() => handleDelete(p.id)}
                        title="Remove"
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
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
                  <h5 className="modal-title fw-bold" style={{ color: "#10233f" }}>
                    {editingProduct ? "Modify Product" : "Register Catalog Item"}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)} />
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Product Name</label>
                      <input className="form-control marwat-input" {...register("name")} placeholder="e.g. Domestic Cylinder" />
                      {errors.name && <small className="text-danger">{errors.name.message}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Type</label>
                      <input className="form-control marwat-input" {...register("type")} />
                      {errors.type && <small className="text-danger">{errors.type.message}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Weight (e.g. 11.8 kg)</label>
                      <input className="form-control marwat-input" {...register("weight")} />
                      {errors.weight && <small className="text-danger">{errors.weight.message}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Price (Rs.)</label>
                      <input type="number" className="form-control marwat-input" {...register("price", { valueAsNumber: true })} />
                      {errors.price && <small className="text-danger">{errors.price.message}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Stock Units</label>
                      <input type="number" className="form-control marwat-input" {...register("stock", { valueAsNumber: true })} />
                      {errors.stock && <small className="text-danger">{errors.stock.message}</small>}
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Description</label>
                      <textarea rows="2" className="form-control marwat-input" {...register("description")} placeholder="Add product description..." />
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: "1px solid #eef3f8" }}>
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">{editingProduct ? "Save Changes" : "Register Product"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

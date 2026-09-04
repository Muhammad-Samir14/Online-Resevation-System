import React, { useState, useEffect } from "react";
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
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleCreate = () => {
    setEditingProduct(null);
    reset({ name: "", type: "LPG", weight: "", price: 0, stock: 0, description: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    reset({ name: product.name, type: product.type, weight: product.weight, price: product.price, stock: product.stock, description: product.description || "" });
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    const productData = { ...data, price: Number(data.price), stock: Number(data.stock) };
    try {
      if (editingProduct) {
        const { data: updated, error } = await supabase.from("products").update(productData).eq("id", editingProduct.id).select();
        if (error) throw error;
        setProducts(products.map((p) => (p.id === editingProduct.id ? updated[0] : p)));
      } else {
        const { data: created, error } = await supabase.from("products").insert([productData]).select();
        if (error) throw error;
        setProducts([...products, created[0]]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || "Error saving product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this product from inventory?")) {
      try {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  const formatPrice = (v) => `Rs. ${Number(v).toLocaleString()}`;

  const getStockBadge = (stock) => {
    if (stock <= 5) return { color: "#dc3545", bg: "rgba(220,53,69,.12)" };
    if (stock <= 15) return { color: "#ffc107", bg: "rgba(255,193,7,.12)" };
    return { color: "#198754", bg: "rgba(25,135,84,.12)" };
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
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div>
          <small className="text-warning fw-bold text-uppercase" style={{ letterSpacing: "1.5px", fontSize: ".75rem" }}>Inventory</small>
          <h2 className="fw-bold text-white mb-1">Products / Stock</h2>
          <p className="text-white-50 mb-0">Manage cylinder catalog, pricing, and stock levels</p>
        </div>
        <button className="btn btn-warning fw-bold px-4" onClick={handleCreate} style={{ borderRadius: "10px" }}>
          <i className="bi bi-plus-lg me-1"></i>Add Product
        </button>
      </div>

      <div className="stat-card p-0">
        <div className="table-responsive">
          <table className="table admin-table mb-0">
            <thead>
              <tr>
                <th>Product</th>
                <th>Specifications</th>
                <th className="text-center">Unit Price</th>
                <th className="text-center">Stock</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-5 text-white-50"><i className="bi bi-box-seam fs-1 d-block mb-2"></i>No products yet.</td></tr>
              ) : (
                products.map((p) => {
                  const badge = getStockBadge(p.stock);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="fw-semibold text-white">{p.name}</div>
                        <small className="text-white-50">{p.description || "—"}</small>
                      </td>
                      <td>
                        <span className="badge me-2" style={{ background: "rgba(13,110,253,.12)", color: "#0d6efd", borderRadius: "8px" }}>{p.type}</span>
                        <span className="small text-white-50">{p.weight}</span>
                      </td>
                      <td className="text-center fw-bold text-white">{formatPrice(p.price)}</td>
                      <td className="text-center">
                        <span className="badge px-3 py-2" style={{ backgroundColor: badge.bg, color: badge.color, borderRadius: "8px" }}>{p.stock} Units</span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm me-1" style={{ background: "rgba(255,193,7,.12)", color: "#ffc107", border: "1px solid rgba(255,193,7,.25)", borderRadius: "8px" }} onClick={() => handleEdit(p)}><i className="bi bi-pencil-fill"></i></button>
                        <button className="btn btn-sm" style={{ background: "rgba(220,53,69,.12)", color: "#dc3545", border: "1px solid rgba(220,53,69,.25)", borderRadius: "8px" }} onClick={() => handleDelete(p.id)}><i className="bi bi-trash-fill"></i></button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ background: "#10233f", border: "1px solid rgba(255,255,255,.1)", borderRadius: "18px" }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-header border-bottom border-secondary border-opacity-25">
                  <h5 className="modal-title fw-bold text-white">{editingProduct ? "Edit Product" : "Add Product"}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-white-50 small fw-semibold">Product Name</label>
                      <input className="form-control" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" }} {...register("name")} placeholder="e.g. Domestic Cylinder" />
                      {errors.name && <small className="text-danger">{errors.name.message}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white-50 small fw-semibold">Type</label>
                      <input className="form-control" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" }} {...register("type")} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white-50 small fw-semibold">Weight</label>
                      <input className="form-control" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" }} {...register("weight")} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white-50 small fw-semibold">Price (Rs.)</label>
                      <input type="number" className="form-control" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" }} {...register("price", { valueAsNumber: true })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white-50 small fw-semibold">Stock Units</label>
                      <input type="number" className="form-control" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" }} {...register("stock", { valueAsNumber: true })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-white-50 small fw-semibold">Description</label>
                      <textarea rows="2" className="form-control" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" }} {...register("description")} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top border-secondary border-opacity-25">
                  <button type="button" className="btn btn-outline-light" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-warning fw-bold">{editingProduct ? "Save Changes" : "Add Product"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

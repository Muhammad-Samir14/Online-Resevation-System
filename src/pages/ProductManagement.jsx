import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

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

  // 1️⃣ Fetch raw inventory list items from database directly
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching live cylinder items:", err);
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

  // 2️⃣ Handle API Submit (POST/PUT directly to MongoDB)
  const onSubmit = async (data) => {
    const productData = { ...data, price: Number(data.price), stock: Number(data.stock) };
    try {
      if (editingProduct) {
        // Update Action
        const res = await axios.put(`http://localhost:5000/api/admin/products/${editingProduct._id}`, productData);
        setProducts(products.map((p) => (p._id === editingProduct._id ? res.data : p)));
      } else {
        // Create Action
        const res = await axios.post("http://localhost:5000/api/admin/products", productData);
        setProducts([...products, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error processing inventory modification data");
    }
  };

  // 3️⃣ Delete Item Entry from Inventory Database
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this product from inventory?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert("Failed to delete stock registration profile from backend server.");
      }
    }
  };

  const formatPrice = (v) => `Rs. ${Number(v).toLocaleString()}`;

  const getStockBadge = (stock) => {
    if (stock <= 5) return "text-danger border-danger";
    if (stock <= 15) return "text-warning border-warning";
    return "text-success border-success";
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="animate__animated animate__fadeIn text-white">
      {/* Header Card */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-dark p-4 rounded-4 shadow-lg border border-secondary">
        <div>
          <h3 className="fw-bold text-primary mb-1">Cylinder Catalog</h3>
          <p className="text-secondary small mb-0">Manage LPG sizes, weights, structural prices, and stock units</p>
        </div>
        <button className="btn btn-primary px-4 fw-bold" onClick={handleCreate} style={{ borderRadius: "10px" }}>
          + Add New Product
        </button>
      </div>

      {/* Modern Catalog Table */}
      <div className="card bg-dark border-secondary shadow-lg overflow-hidden" style={{ borderRadius: "20px" }}>
        <table className="table table-dark table-hover mb-0 align-middle">
          <thead className="text-secondary small text-uppercase bg-black bg-opacity-25">
            <tr className="border-bottom border-secondary">
              <th className="ps-4 py-3">Product Profile</th>
              <th className="py-3">Specifications</th>
              <th className="py-3 text-center">Unit Price</th>
              <th className="py-3 text-center">Stock Level</th>
              <th className="pe-4 py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-bottom border-secondary transition-all">
                <td className="ps-4">
                  <div className="fw-bold text-white">{p.name}</div>
                  <small className="text-secondary opacity-75">{p.description || "No description item added."}</small>
                </td>
                <td>
                  <span className="badge bg-secondary bg-opacity-25 border border-secondary text-light px-2 py-1 me-2">{p.type}</span>
                  <span className="text-info small fw-bold">{p.weight}</span>
                </td>
                <td className="text-center fw-bold text-white">
                  {formatPrice(p.price)}
                </td>
                <td className="text-center">
                  <span className={`badge border rounded-pill px-3 py-2 ${getStockBadge(p.stock)}`} style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                    {p.stock} Units Available
                  </span>
                </td>
                <td className="pe-4 text-end">
                  <button className="btn btn-outline-warning btn-sm border-0 me-1 p-2" onClick={() => handleEdit(p)} title="Edit Configuration">
                    ✏️
                  </button>
                  <button className="btn btn-outline-danger btn-sm border-0 p-2" onClick={() => handleDelete(p._id)} title="Remove Product">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal View */}
      {isModalOpen && (
        <>
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark text-white border-secondary shadow-lg" style={{ borderRadius: "20px" }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="modal-header border-secondary">
                    <h5 className="modal-title fw-bold text-primary">{editingProduct ? "Modify Product Rules" : "Register Catalog Item"}</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)} />
                  </div>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small text-white">Product Name</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("name")} placeholder="e.g. Domestic Cylinder" />
                        {errors.name && <small className="text-danger">{errors.name.message}</small>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-white">Fuel Classification Type</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("type")} />
                        {errors.type && <small className="text-danger">{errors.type.message}</small>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-white">Weight Spec (e.g. 11.8 kg)</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("weight")} />
                        {errors.weight && <small className="text-danger">{errors.weight.message}</small>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-white">Price (Rs.)</label>
                        <input type="number" className="form-control bg-dark text-white border-secondary" {...register("price", { valueAsNumber: true })} />
                        {errors.price && <small className="text-danger">{errors.price.message}</small>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-white">Initial Stock Units</label>
                        <input type="number" className="form-control bg-dark text-white border-secondary" {...register("stock", { valueAsNumber: true })} />
                        {errors.stock && <small className="text-danger">{errors.stock.message}</small>}
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-white">Catalog Description</label>
                        <textarea rows="2" className="form-control bg-dark text-white border-secondary" {...register("description")} placeholder="Add detailed product description items..." />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-secondary">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary px-4">{editingProduct ? "Save Changes" : "Register Product"}</button>
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
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const initialProducts = [
  { id: 1, name: "Domestic Cylinder", type: "LPG", weight: "6 kg", price: 1650, stock: 45, description: "Standard residential LPG cylinder" },
  { id: 2, name: "Commercial Cylinder", type: "LPG", weight: "15 kg", price: 4500, stock: 12, description: "Commercial LPG cylinder for businesses" },
  { id: 3, name: "Industrial Cylinder", type: "LPG", weight: "45 kg", price: 9200, stock: 5, description: "Industrial LPG cylinder for large-scale use" },
];

const productSchema = z.object({
  name: z.string().min(2, "Name required"),
  type: z.string().min(1, "Type required"),
  weight: z.string().min(1, "Weight required"),
  price: z.number().min(0, "Price must be >= 0"),
  stock: z.number().min(0, "Stock must be >= 0"),
  description: z.string().optional(),
});

export default function ProductManagement() {
  const [products, setProducts] = useState(() => {
    const raw = localStorage.getItem("products");
    return raw ? JSON.parse(raw) : initialProducts;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", type: "LPG", weight: "", price: 0, stock: 0, description: "" },
  });

  useEffect(() => { localStorage.setItem("products", JSON.stringify(products)); }, [products]);

  const handleCreate = () => {
    setEditingProduct(null);
    reset({ name: "", type: "LPG", weight: "", price: 0, stock: 0, description: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    reset(product);
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    const productData = { ...data, price: Number(data.price), stock: Number(data.stock) };
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p)));
    } else {
      setProducts([...products, { ...productData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this product from inventory?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const formatPrice = (v) => `Rs. ${Number(v).toLocaleString()}`;

  // Helper to show stock color
  const getStockBadge = (stock) => {
    if (stock <= 5) return "text-danger border-danger";
    if (stock <= 15) return "text-warning border-warning";
    return "text-success border-success";
  };

  return (
    <div className="animate__animated animate__fadeIn text-white">
      {/* Header Card */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-dark p-4 rounded-4 shadow-lg border border-secondary">
        <div>
          <h3 className="fw-bold text-primary mb-1">Cylinder Inventory</h3>
          <p className="text-secondary small mb-0">Manage gas types, pricing, and stock levels</p>
        </div>
        <button className="btn btn-primary px-4 fw-bold" onClick={handleCreate} style={{ borderRadius: "10px" }}>
          + Add Product
        </button>
      </div>

      {/* Product Grid Table */}
      <div className="card bg-dark border-secondary shadow-lg overflow-hidden" style={{ borderRadius: "20px" }}>
        <table className="table table-dark table-hover mb-0 align-middle">
          <thead className="text-secondary small text-uppercase bg-black bg-opacity-25">
            <tr className="border-bottom border-secondary">
              <th className="ps-4 py-3">Product Detail</th>
              <th className="py-3">Category</th>
              <th className="py-3 text-center">Weight</th>
              <th className="py-3 text-center">Unit Price</th>
              <th className="py-3 text-center">Stock Level</th>
              <th className="pe-4 py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-bottom border-secondary transition-all">
                <td className="ps-4 py-3">
                  <div className="fw-bold text-white">{p.name}</div>
                  <div className="small text-secondary">{p.description}</div>
                </td>
                <td>
                  <span className="badge bg-secondary-soft text-secondary border border-secondary px-2 py-1">
                    {p.type}
                  </span>
                </td>
                <td className="text-center fw-medium">{p.weight}</td>
                <td className="text-center fw-bold text-info">{formatPrice(p.price)}</td>
                <td className="text-center">
                  <div className={`fw-bold ${getStockBadge(p.stock)}`}>
                    {p.stock} <small className="text-secondary ms-1">units</small>
                  </div>
                  {p.stock <= 10 && <small className="text-danger" style={{fontSize: '10px'}}>LOW STOCK</small>}
                </td>
                <td className="pe-4 text-end">
                  <button className="btn btn-outline-warning btn-sm border-0 me-1 p-2" onClick={() => handleEdit(p)}>
                    ✏️
                  </button>
                  <button className="btn btn-outline-danger btn-sm border-0 p-2" onClick={() => handleDelete(p.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dark Styled Modal */}
      {isModalOpen && (
        <>
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark text-white border-secondary shadow-lg" style={{ borderRadius: "20px" }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="modal-header border-secondary">
                    <h5 className="modal-title fw-bold text-primary">{editingProduct ? "Update Product" : "New Inventory Item"}</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)} />
                  </div>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small text-secondary">Product Name</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("name")} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">Gas Type</label>
                        <select className="form-select bg-dark text-white border-secondary" {...register("type")}>
                          <option value="LPG">LPG</option>
                          <option value="Natural Gas">Natural Gas</option>
                          <option value="Propane">Propane</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">Weight (e.g. 15 kg)</label>
                        <input className="form-control bg-dark text-white border-secondary" {...register("weight")} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">Price (PKR)</label>
                        <input type="number" className="form-control bg-dark text-white border-secondary" {...register("price", { valueAsNumber: true })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">Current Stock</label>
                        <input type="number" className="form-control bg-dark text-white border-secondary" {...register("stock", { valueAsNumber: true })} />
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-secondary">Brief Description</label>
                        <textarea className="form-control bg-dark text-white border-secondary" rows="2" {...register("description")} />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-secondary">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary px-4">{editingProduct ? "Save Changes" : "Add to Stock"}</button>
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
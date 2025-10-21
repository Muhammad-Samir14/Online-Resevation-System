import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import sixKgImg from './assets/6KG.jpg';
import fifteenKgImg from './assets/15KG.jpg';
import fortyFiveKgImg from './assets/45KG.jpg';
import BookGasPage from './BookGasPage';

function ShopPage() {
  const [showBookGas, setShowBookGas] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  // ✅ Products stored in an array
  const products = [
    {
      name: 'Domestic Cylinder',
      img: sixKgImg,
      desc: 'Ideal for home use, safe and efficient.',
      price: '1650 PKR (6Kg)',
    },
    {
      name: 'Commercial Cylinder',
      img: fifteenKgImg,
      desc: 'For hotels and restaurants.',
      price: '4500 PKR (15Kg)',
    },
    {
      name: 'Industrial Cylinder',
      img: fortyFiveKgImg,
      desc: 'For factories and large-scale usage.',
      price: '9200 PKR (45Kg)',
    },
  ];

  // ✅ When user clicks Add to Cart
  const handleAddToCart = (itemName) => {
    setSelectedItem(itemName);
    setShowBookGas(true);
  };

  // ✅ If user clicked Add to Cart → show BookGasPage
  if (showBookGas) {
    return (
      <div className="container mt-5">
        <h3 className="text-center text-primary mb-4">
          You selected: <span className="text-danger">{selectedItem}</span>
        </h3>
        <BookGasPage selectedItem={selectedItem} />
      </div>
    );
  }

  // ✅ Show all products using .map()
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">
            <i className="bi bi-shop me-2 text-warning"></i>
            MARWAT LPG Shop
          </h2>
          <p className="text-muted mb-1">
            Timings: <strong>Mon - Sat, 10:30 AM - 8:30 PM</strong>
          </p>
          <p className="text-muted">
            Prices are inclusive of Cylinders and LPG
          </p>
        </div>

        <div className="row g-4">
          {/* ✅ Using map() to generate each card */}
          {products.map((item, index) => (
            <div key={index} className="col-md-4">
              <div className="p-4 bg-white rounded shadow-sm h-100 text-center">
                <img
                  src={item.img}
                  alt={item.name}
                  className="img-fluid mb-3 rounded"
                  style={{ height: '180px' }}
                />
                <h5 className="fw-semibold">{item.name}</h5>
                <p className="text-muted">{item.desc}</p>
                <p className="fw-bold mb-2">Price: {item.price}</p>
                <button
                  className="btn btn-primary px-4"
                  onClick={() => handleAddToCart(item.name)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShopPage;

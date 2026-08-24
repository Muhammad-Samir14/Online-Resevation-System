export const products = [
  {
    id: "domestic",
    name: "Domestic Cylinder",
    type: "Domestic",
    size: "6 Kg",
    unitPrice: 1650,
    desc: "Ideal for home use, safe and efficient.",
  },
  {
    id: "commercial",
    name: "Commercial Cylinder",
    type: "Commercial",
    size: "15 Kg",
    unitPrice: 4500,
    desc: "For hotels and restaurants.",
  },
  {
    id: "industrial",
    name: "Industrial Cylinder",
    type: "Industrial",
    size: "45 Kg",
    unitPrice: 9200,
    desc: "For factories and large-scale usage.",
  },
];

export function findProductByName(name) {
  return products.find((p) => p.name === name);
}

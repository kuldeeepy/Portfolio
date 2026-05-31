import { useState, useEffect } from "react";
import { getUserLocation } from "../services/service";

const templates = [
  (city) => `Someone in ${city} stopped by.`,
  (city) => `A stranger from ${city} was here.`,
  (city) => `Someone from ${city} found their way here.`,
  (city) => `Internet brought someone from ${city}.`,
  (city) => `Visiting from ${city}? Cool.`,
];

export default function VisitorLocation() {
  const [loc, setLoc] = useState(null);
  const [template] = useState(() => Math.floor(Math.random() * templates.length));

  useEffect(() => {
    getUserLocation().then((r) => {
      if (r?.success && r.location?.city) setLoc(r.location);
    });
  }, []);

  if (!loc) return null;

  return (
    <p style={{ fontSize: "0.78rem", color: "var(--body-color-highlighted)", fontWeight: 400, margin: 0 }}>
      {templates[template](loc.city)}
    </p>
  );
}

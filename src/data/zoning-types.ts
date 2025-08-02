import type { ZoningType } from "@/components/zoning/zoning-types";

export const defaultZoningTypes: ZoningType[] = [
  { 
    id: "r1", 
    name: "Single Family Residential", 
    code: "R-1", 
    color: "#ffeb3b", 
    description: "Low density single family homes" 
  },
  { 
    id: "r2", 
    name: "Single Family Residential", 
    code: "R-2", 
    color: "#fff176", 
    description: "Medium density single family homes" 
  },
  { 
    id: "r3", 
    name: "Two-Family Residential", 
    code: "R-3", 
    color: "#ff9800", 
    description: "Duplex and two-family structures" 
  },
  { 
    id: "r4", 
    name: "Multiple-Family Residential", 
    code: "R-4", 
    color: "#ff5722", 
    description: "Apartments and multi-family buildings" 
  },
  { 
    id: "rm", 
    name: "Manufactured Home Court Residential", 
    code: "R-M", 
    color: "#795548", 
    description: "Mobile home parks and manufactured housing" 
  },
  { 
    id: "c1", 
    name: "General Commercial", 
    code: "C-1", 
    color: "#f44336", 
    description: "Retail and general commercial uses" 
  },
  { 
    id: "c2", 
    name: "Central Business District", 
    code: "C-2", 
    color: "#e91e63", 
    description: "Downtown core commercial area" 
  },
  { 
    id: "c3", 
    name: "Commercial / Light Manufacturing", 
    code: "C-3", 
    color: "#9c27b0", 
    description: "Mixed commercial and light industrial" 
  },
  { 
    id: "c4", 
    name: "Office / Business District", 
    code: "C-4", 
    color: "#673ab7", 
    description: "Professional offices and business services" 
  },
  { 
    id: "c5", 
    name: "Mixed Residential-Commercial", 
    code: "C-5", 
    color: "#3f51b5", 
    description: "Mixed use residential and commercial" 
  },
  { 
    id: "i1", 
    name: "Light Industrial", 
    code: "I-1", 
    color: "#2196f3", 
    description: "Light manufacturing and industrial" 
  },
  { 
    id: "i1a", 
    name: "Light Industrial (Industrial Park)", 
    code: "I-1A", 
    color: "#03a9f4", 
    description: "Planned industrial park development" 
  },
  { 
    id: "i2", 
    name: "Heavy Industrial", 
    code: "I-2", 
    color: "#00bcd4", 
    description: "Heavy manufacturing and industrial" 
  },
  { 
    id: "i2a", 
    name: "Heavy Industrial (Industrial Park)", 
    code: "I-2A", 
    color: "#009688", 
    description: "Heavy industrial park development" 
  },
  { 
    id: "a", 
    name: "Agricultural", 
    code: "A", 
    color: "#4caf50", 
    description: "Farming and agricultural uses" 
  },
  { 
    id: "con", 
    name: "Conservancy", 
    code: "CON", 
    color: "#8bc34a", 
    description: "Environmental conservation areas" 
  },
  { 
    id: "pud", 
    name: "Planned Unit Development", 
    code: "PUD", 
    color: "#cddc39", 
    description: "Special planned development projects" 
  }
];
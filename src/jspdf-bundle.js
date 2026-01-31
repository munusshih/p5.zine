import { jsPDF } from "jspdf";

if (typeof window !== "undefined") {
  if (!window.jspdf) {
    window.jspdf = {};
  }
  window.jspdf.jsPDF = jsPDF;
  window.jsPDF = jsPDF;
}

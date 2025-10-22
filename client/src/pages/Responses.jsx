import React, { useEffect, useState } from 'react';
import ResponseCard from '../components/ResponseCard';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Responses() {
  const url = "https://ai-form-builder-backend-ytpx.onrender.com"
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFormsAndCounts() {
      try {
        const formsRes = await fetch(`${url}/api/form/`, { credentials: 'include' });
        const forms = await formsRes.json();
        console.log(forms)

        const formsWithCounts = await Promise.all(
          forms.map(async (form) => {
            const subsRes = await fetch(`${url}/api/submission/count/${form._id}`, { credentials: 'include' });
            const { count } = await subsRes.json();
            return { ...form, submissionCount: count || 0 };
          })
        );

        setForms(formsWithCounts);
      } catch (err) {
        console.error('Failed fetching forms/submission counts', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFormsAndCounts();
  }, []);

  const exportToExcel = async (formId, formTitle) => {
    try {
      const response = await fetch(`${url}/api/submission/${formId}`, {
        method: "GET",
        credentials: "include"
      });
      const json = await response.json();

      if (!Array.isArray(json) || json.length === 0) {
        alert("No responses available for this form.");
        return;
      }

      // Extract only the form response data
      const data = json.map((item) => item.data);

      // Convert to Excel worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

      // Create Excel file buffer
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      // Save file
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, `${formTitle || "Form"}_Responses.xlsx`);

      console.log("✅ Excel exported successfully");
    } catch (error) {
      console.error("❌ Error exporting Excel:", error);
      alert("Failed to export Excel file.");
    }
  };

  if (loading) return <p>Loading responses...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {forms.map((form) => (
        <ResponseCard
          key={form._id}
          form={form}
          responsesCount={form.submissionCount}
          onExport={() => exportToExcel(form._id, form.title)}
        />
      ))}
    </div>
  );
}

export default Responses;

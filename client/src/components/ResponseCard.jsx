import React, { useState } from 'react';

export default function ResponseCard({ form, responsesCount, onExport }) {
    
    console.log("form",form)
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-xl w-full">
      <h3 className="text-xl font-semibold text-gray-800">{form.schema.form_title}</h3>
      <p className="text-gray-600 mt-1 mb-4">{form.schema.form_subheading}</p>

      <div className="flex items-center justify-between">
        <p className="text-gray-700 font-medium">
          Responses: <span className="text-blue-600">{responsesCount}</span>
        </p>

        <button
          onClick={onExport}
          
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          Export
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

function CreateForm() {
  const url = "https://ai-form-builder-backend-ytpx.onrender.com"
  const navigate = useNavigate();
  const { id: formId } = useParams();
  const [formData, setFormData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false); // <-- Success message flag

  useEffect(() => {
    const getForm = async () => {
      try {
        const res = await fetch(`${url}/api/form/${formId}`);
        const data = await res.json();
        setFormData(data.schema);
      } catch (error) {
        console.error('Error fetching form:', error);
      }
    };
    getForm();
  }, [formId]);

  const handleChange = (e, name) => {
    setFormValues({ ...formValues, [name]: e.target.value });
  };

  const handleImageUpload = async (e, name) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);
    formDataToSend.append('upload_preset', CLOUDINARY_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formDataToSend
      );
      const imageUrl = res.data.secure_url;
      setFormValues(prev => ({ ...prev, [name]: imageUrl }));
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${url}/api/submission/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, data: formValues })
      });
      const data = await res.json();
      console.log('Submission successful:', data);

      setFormValues({}); // clear form
      setSubmitted(true); // show success message
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!formData)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading form...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <NavBar />

      {/* Buttons Container */}
      <div className="mt-20 sm:mt-24 flex justify-end mb-4 px-4 sm:px-8 lg:px-16">
        <button onClick={()=>navigate(`/aiform/${formId}`)} className="mr-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
          Live
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Share
        </button>
      </div>

      {/* Form Container */}
      <div className="flex-grow flex items-center justify-center pb-8 px-4 sm:px-8 lg:px-16">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{formData.form_title}</h2>
            <p className="text-gray-500 mt-2">{formData.form_subheading}</p>
          </div>

          {/* Success message */}
          {submitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
              Response has been successfully recorded!
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {formData.fields.map((field, index) => {
              const baseClasses =
                'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200';

              if (field.type === 'cloudinary_upload') {
                return (
                  <div key={index} className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">{field.label}</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="cursor-pointer border border-gray-300 p-2 rounded-lg hover:border-blue-400"
                      onChange={(e) => handleImageUpload(e, field.name)}
                    />
                    {formValues[field.name] && (
                      <img
                        src={formValues[field.name]}
                        alt="Uploaded preview"
                        className="mt-3 w-28 h-28 object-cover rounded-lg border"
                      />
                    )}
                  </div>
                );
              }

              if (field.type === 'textarea') {
                return (
                  <div key={index} className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={(e) => handleChange(e, field.name)}
                      className={`${baseClasses} resize-none h-28`}
                    />
                  </div>
                );
              }

              if (field.type === 'checkbox') {
                return (
                  <div key={index} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={field.name}
                      required={field.required}
                      onChange={(e) =>
                        setFormValues({ ...formValues, [field.name]: e.target.checked })
                      }
                      className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor={field.name} className="text-gray-700 text-sm leading-snug">
                      {field.label}
                    </label>
                  </div>
                );
              }

              return (
                <div key={index} className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={(e) => handleChange(e, field.name)}
                    className={baseClasses}
                  />
                </div>
              );
            })}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateForm;

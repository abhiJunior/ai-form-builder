import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Share2, Copy, X } from 'lucide-react'; // Added icons

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

function LiveForm() {
  const url = "https://ai-form-builder-backend-ytpx.onrender.com"
  const { id: formId } = useParams();
  const [formData, setFormData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [shareModal, setShareModal] = useState({ open: false, link: '' });

  // Fetch form schema
  useEffect(() => {
    const getForm = async () => {
      try {
        const res = await fetch(`${url}/api/form/${formId}`);
        const data = await res.json();
        setFormData(data.schema);
      } catch (error) {
        console.error('Error fetching form:', error);
        setError('Unable to load form. Please try again later.');
      }
    };
    getForm();
  }, [formId]);

  // Handle text & checkbox changes
  const handleChange = (e, name) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Cloudinary image upload
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
      setFormValues((prev) => ({ ...prev, [name]: imageUrl }));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed. Please try again.');
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${url}/api/submission/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId, data: formValues }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Share functionality
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/aiform/${formId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this form',
          text: 'Fill out this form!',
          url: shareUrl,
        });
      } catch (err) {
        console.warn('Share cancelled:', err);
      }
    } else {
      setShareModal({ open: true, link: shareUrl });
    }
  };

  const copyToClipboard = async (link) => {
    await navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  // Loading state
  if (!formData)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading form...</p>
      </div>
    );

  // Success message
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 text-center px-6">
        <CheckCircle className="text-green-500 w-20 h-20 mb-4 animate-bounce" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Response Recorded!</h2>
        <p className="text-gray-600 max-w-md">
          Thank you for submitting the form. Your response has been recorded successfully.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
          >
            Submit Another Response
          </button>
          <button
            onClick={handleShare}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
          >
            <Share2 size={18} /> Share Form
          </button>
        </div>
      </div>
    );
  }

  // Main form UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h2 className="text-3xl font-bold text-gray-800">{formData.form_title}</h2>
              <p className="text-gray-500 mt-2">{formData.form_subheading}</p>
            </div>
            <button
              onClick={handleShare}
              className="ml-4 p-2 text-gray-600 hover:text-blue-600 transition-all"
              title="Share this form"
            >
              <Share2 size={22} />
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
              {error}
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
                      disabled={submitting}
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
                      disabled={submitting}
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
                      onChange={(e) => handleChange(e, field.name)}
                      disabled={submitting}
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
                    disabled={submitting}
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

      {/* Share Modal */}
      {shareModal.open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setShareModal({ open: false, link: '' })}
        >
          <div className="bg-white w-80 sm:w-96 rounded-2xl p-6 shadow-xl relative">
            <button
              onClick={() => setShareModal({ open: false, link: '' })}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Share this Form
            </h3>

            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out this form: ${shareModal.link}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-center hover:bg-green-600 transition-all"
              >
                Share on WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareModal.link
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-all"
              >
                Share on Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareModal.link
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-sky-500 text-white rounded-lg text-center hover:bg-sky-600 transition-all"
              >
                Share on X (Twitter)
              </a>
              <button
                onClick={() => copyToClipboard(shareModal.link)}
                className="flex items-center justify-center gap-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all"
              >
                <Copy size={16} />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveForm;

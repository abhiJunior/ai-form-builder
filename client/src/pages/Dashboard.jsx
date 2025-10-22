import React, { useEffect, useState } from 'react';
import CreateFormModel from '../components/CreateFormModel';
import { Share, Copy, X } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const url = "https://ai-form-builder-backend-juu7.onrender.com"
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareModal, setShareModal] = useState({ open: false, link: '' });

  // Fetch user forms
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch(`${url}/api/form/`, {
          credentials: 'include',
        });
        const data = await res.json();
        setForms(data);
        
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  // Handle share
  const handleShare = async (formId) => {
    const shareUrl = `${window.location.origin}/aiform/${formId}`;

    if (navigator.share) {
      // For mobile / PWA environments
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
      // For desktop fallback
      setShareModal({ open: true, link: shareUrl });
    }
  };

  const copyToClipboard = async (link) => {
    await navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };
  console.log(forms)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Manage and share your created forms easily.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <CreateFormModel />
          </div>
        </div>

        {/* Loading or No Forms */}
        {loading ? (
          <p className="text-gray-500 animate-pulse text-lg text-center mt-10">
            Loading your forms...
          </p>
        ) : forms.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-gray-600 text-lg mb-3">
              You haven’t created any forms yet.
            </p>
            <p className="text-gray-400">
              Click <span className="font-medium text-blue-600">"Create Form"</span> to start building one.
            </p>
          </div>
        ) : (
          /* Form List */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form._id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <h2 className="text-xl font-semibold text-gray-800 truncate">
                  {form.schema.form_title}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Created on {new Date(form.createdAt).toLocaleDateString()}
                </p>

                <div className="flex justify-between items-center mt-6">
                  <Link
                    to={`/create-form/${form._id}`}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleShare(form._id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 border bg-white hover:bg-green-100 cursor-pointer rounded-lg transition-colors duration-200"
                  >
                    <Share size={16} />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default Dashboard;

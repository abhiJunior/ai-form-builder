import React, { useState } from 'react';
import { Button, Modal, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
const { TextArea } = Input;

const CreateFormModel = () => {
  const url = "https://ai-form-builder-backend-juu7.onrender.com"
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [generatedSchema, setGeneratedSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setUserInput('');
    setGeneratedSchema(null);
  };

  // Step 1: Generate schema from Gemini
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${url}/api/form/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ prompt: userInput }),
      });
      const data = await res.json();
      setGeneratedSchema(data);
      // Optionally, extract form title, subheading from data
    } catch (error) {
      message.error('Error generating form schema',error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Save the generated form schema to backend/MongoDB
  const handleSave = async () => {
    if (!generatedSchema) return;
    setSaving(true);
    try {
      const res = await fetch(`${url}/api/form/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for Clerk auth!
        body: JSON.stringify({
          title: generatedSchema.form_title || 'Untitled Form', // Adjust according to your schema
          schema: generatedSchema,
        }),
      });

      if (res.ok) {
        message.success('Form saved successfully!');
        const savedForm = await res.json();
        const formId = savedForm._id;
        console.log("form id",formId)
        setIsModalOpen(false);
        setUserInput('');
        setGeneratedSchema(null);
        navigate(`/create-form/${formId}`)
      } else {
        const err = await res.json();
        message.error('Failed to save form: ' + (err.message || 'Unknown error'));
      }
    } catch (e) {
      message.error('Failed to save form',e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        + Create Form
      </Button>

      <Modal
        title="Create New Form"
        open={isModalOpen}
        onOk={generatedSchema ? handleSave : handleGenerate}
        okText={generatedSchema ? (saving ? "Saving..." : "Save Form") : (loading ? "Generating..." : "Generate")}
        onCancel={handleCancel}
        confirmLoading={loading || saving}
      >
        {!generatedSchema && (
          <TextArea
            placeholder="Write description of your form"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        )}
        {generatedSchema && (
          <pre style={{ marginTop: 20, maxHeight: 200, overflow: 'auto', background: '#eee', padding: 10 }}>
            {JSON.stringify(generatedSchema, null, 2)}
          </pre>
        )}
      </Modal>
    </>
  );
};

export default CreateFormModel;

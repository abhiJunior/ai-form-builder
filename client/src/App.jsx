import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import Responses from "./pages/Responses";
import CreateForm from "./pages/CreateForm";
import LiveForm from "./pages/LiveForm";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Home />} />

      {/* Protected Routes */}
      <Route
        path="create-form/:id"
        element={
          <ProtectedRoute>
            <CreateForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="aiform/:id"
        element={
            <LiveForm /> 
        }
      />

      {/* Dashboard Layout (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="responses" element={<Responses />} />
      </Route>
    </Routes>
  );
};

export default App;

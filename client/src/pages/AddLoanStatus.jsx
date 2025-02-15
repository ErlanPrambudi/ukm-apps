import { Alert, Button, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddLoanStatus = () => {
  const [formData, setFormData] = useState({
    statusPeminjaman: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoanStatusSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setErrorMessage("Anda harus login terlebih dahulu!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/status-pengembalian`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken.trim()}`,
        },
        body: JSON.stringify({
          status: formData.statusPeminjaman,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menambahkan status peminjaman.");

      setSuccessMessage("Status peminjaman berhasil ditambahkan!");
      setFormData({ statusPeminjaman: "" });
      setTimeout(() => {
        navigate("/dashboard?tab=dash-loan-status");
      }, 1500);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="max-w-full w-96 mx-auto p-5">
      <h2 className="text-xl font-semibold text-center mb-4">Tambah Status Peminjaman</h2>
      <form onSubmit={handleLoanStatusSubmit} className="flex flex-col gap-2 border p-4 rounded-md shadow-md">
        <TextInput type="text" name="statusPeminjaman" placeholder="Status Peminjaman" value={formData.statusPeminjaman} onChange={handleChange} required />
        <Button type="submit" gradientDuoTone="tealToLime">
          Tambah Status
        </Button>
      </form>

      {errorMessage && (
        <Alert className="mt-4" color="failure">
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert className="mt-4" color="success">
          {successMessage}
        </Alert>
      )}
    </div>
  );
};

export default AddLoanStatus;

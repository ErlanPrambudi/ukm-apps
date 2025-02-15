import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdateLoanStatus = () => {
  const [status, setStatus] = useState(""); // Menyimpan status peminjaman
  const [updateError, setUpdateError] = useState(null);
  const { statusId } = useParams(); // Ambil ID status dari URL
  const { currentUser } = useSelector((state) => state.user);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const navigate = useNavigate();

  // Fungsi untuk mengambil data status peminjaman
  const fetchLoanStatus = async () => {
    if (!statusId) {
      setUpdateError("Status ID is missing");
      return;
    }

    try {
      const token = currentUser?.token || localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      console.log("Fetching loan status with ID:", statusId); // Debugging

      const res = await fetch(`${API_BASE_URL}/status-pengembalian/${statusId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch loan status data");
      }

      const data = await res.json();
      console.log("Fetched data:", data); // Debugging
      setStatus(data.status || "");
    } catch (error) {
      console.error("Error fetching loan status:", error);
      setUpdateError(error.message || "Failed to fetch loan status data");
    }
  };

  // Load data pertama kali
  useEffect(() => {
    fetchLoanStatus();
  }, [statusId, currentUser, navigate]);

  // Handle submit untuk update status peminjaman
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!statusId) {
      setUpdateError("Status ID is missing");
      return;
    }

    if (!status.trim()) {
      setUpdateError("Status cannot be empty");
      return;
    }

    try {
      const token = currentUser?.token || localStorage.getItem("token");
      if (!token) {
        setUpdateError("Unauthorized: Token is missing");
        return;
      }

      console.log("Updating loan status with ID:", statusId); // Debugging
      console.log("Payload:", JSON.stringify({ status })); // Debugging

      const res = await fetch(`${API_BASE_URL}/status-pengembalian/${statusId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update loan status");
      }

      console.log("Update success:", data); // Debugging
      setUpdateError(null);

      // Setelah update berhasil, ambil ulang data terbaru
      fetchLoanStatus();

      // Redirect ke halaman dashboard
      navigate("/dashboard?tab=add-loan-status");
    } catch (error) {
      console.error("Error updating loan status:", error);
      setUpdateError(error.message || "Something went wrong");
    }
  };

  return (
    <div className="p-3 mx-auto max-w-3xl min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Loan Status</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput type="text" placeholder="Status Peminjaman" required value={status} onChange={(e) => setStatus(e.target.value)} />

        <Button type="submit" gradientDuoTone="tealToLime" className="mt-2" outline>
          Update
        </Button>

        {updateError && (
          <Alert className="mt-5" color="failure">
            {updateError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdateLoanStatus;

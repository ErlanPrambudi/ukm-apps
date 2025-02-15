import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdateCategory = () => {
  const [formData, setFormData] = useState({
    namaKategori: "",
  });
  const [updateError, setUpdateError] = useState(null);
  const { categoryId } = useParams(); // Ambil ID dari URL
  const { currentUser } = useSelector((state) => state.user);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const navigate = useNavigate();

  // console.log("Category ID from URL:", categoryId); // Debugging

  useEffect(() => {
    if (!categoryId) {
      setUpdateError("Category ID is missing");
      return;
    }

    const fetchCategory = async () => {
      try {
        const token = currentUser?.token || localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/kategori/${categoryId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        // console.log("Fetched category data:", data);

        if (!res.ok || !data.data) {
          setUpdateError(data.message || "Failed to fetch category data");
          return;
        }

        setFormData({
          namaKategori: data.data.namaKategori || "",
        });
      } catch (error) {
        console.error("Error fetching category:", error);
        setUpdateError("Failed to fetch category data");
      }
    };

    fetchCategory();
  }, [categoryId, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      setUpdateError("Category ID is missing");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/kategori/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token || localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          namaKategori: formData.namaKategori,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setUpdateError(data.message || "Failed to update category");
        return;
      }

      setUpdateError(null);
      navigate("/dashboard?tab=dash-book");
    } catch (error) {
      console.error("Error updating category:", error);
      setUpdateError("Something went wrong");
    }
  };

  return (
    <div className="p-3 mx-auto max-w-3xl min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Category</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Pastikan value berasal dari state */}
        <TextInput type="text" placeholder="Nama Kategori" required value={formData.namaKategori} onChange={(e) => setFormData({ ...formData, namaKategori: e.target.value })} />

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

export default UpdateCategory;

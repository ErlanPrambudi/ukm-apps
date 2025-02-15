import { Alert, Button, TextInput, Select } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdateBook = () => {
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [updateError, setUpdateError] = useState(null);
  const { bookId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookId) {
      setUpdateError("Book ID is missing");
      return;
    }

    const fetchBook = async () => {
      try {
        const token = currentUser?.token || localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/buku/${bookId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Fetched book data:", data);

        if (!res.ok || !data.data) {
          setUpdateError(data.message || "Failed to fetch book data");
          return;
        }

        setUpdateError(null);
        setFormData({
          ...data.data,
          _id: data.data._id || bookId, // Pastikan ID buku ada
          kategoriId: data.data.kategori?.id || "",
        });
      } catch (error) {
        console.error("Error fetching book:", error);
        setUpdateError("Failed to fetch book data");
      }
    };

    fetchBook();
  }, [bookId, currentUser]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = currentUser?.token || localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/kategori`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Kategori Data:", data);

        if (!res.ok || !data.data || !Array.isArray(data.data.content)) {
          throw new Error(data.message || "Invalid categories response");
        }

        setCategories(data.data.content);
      } catch (error) {
        console.log("Error fetching categories:", error.message);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookIdToUpdate = bookId; // Pastikan ID diambil dari useParams
    if (!bookIdToUpdate) {
      setUpdateError("Book ID is missing");
      return;
    }

    console.log("Updating book with ID:", bookIdToUpdate);
    console.log("Data yang dikirim:", JSON.stringify(formData, null, 2));

    try {
      const res = await fetch(`${API_BASE_URL}/buku/${bookIdToUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token || localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          judul: formData.judul,
          penulis: formData.penulis,
          penerbit: formData.penerbit,
          tahunTerbit: Number(formData.tahunTerbit), // Pastikan angka
          kategoriId: Number(formData.kategoriId), // Backend mungkin butuh angka
          stok: Number(formData.stok), // Pastikan angka
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setUpdateError(data.message || "Failed to update book");
        return;
      }

      setUpdateError(null);
      navigate("/dashboard?tab=dash-book"); // Arahkan ke detail buku setelah update
    } catch (error) {
      console.error("Error updating book:", error);
      setUpdateError("Something went wrong");
    }
  };

  return (
    <div className="p-3 mx-auto max-w-3xl min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Book</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput type="text" placeholder="Judul" required value={formData?.judul || ""} onChange={(e) => setFormData({ ...formData, judul: e.target.value })} />
        <TextInput type="text" placeholder="Penulis" required value={formData?.penulis || ""} onChange={(e) => setFormData({ ...formData, penulis: e.target.value })} />
        <TextInput type="text" placeholder="Penerbit" required value={formData?.penerbit || ""} onChange={(e) => setFormData({ ...formData, penerbit: e.target.value })} />
        <TextInput type="number" placeholder="Tahun Terbit" required value={formData?.tahunTerbit || ""} onChange={(e) => setFormData({ ...formData, tahunTerbit: e.target.value })} />

        {/* Select untuk kategori */}
        <Select required value={formData?.kategoriId || ""} onChange={(e) => setFormData({ ...formData, kategoriId: e.target.value })}>
          <option value="">Pilih Kategori</option>
          {categories.map((kategori) => (
            <option key={kategori.id} value={kategori.id}>
              {kategori.namaKategori}
            </option>
          ))}
        </Select>

        <TextInput type="number" placeholder="Stok" required value={formData?.stok || ""} onChange={(e) => setFormData({ ...formData, stok: e.target.value })} />

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

export default UpdateBook;

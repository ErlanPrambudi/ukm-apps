import { Alert, Button, Select, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    password: "",
    noHp: "",
    alamat: "",
    email: "",
    tanggalLahir: "",
    akses: { id: "" },
  });

  const [aksesOptions, setAksesOptions] = useState([]);
  const [publishError, setPublishError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // Ambil token di awal (agar tidak sering dipanggil)
  const token = localStorage.getItem("token")?.trim(); // Pakai trim() biar tidak ada spasi tambahan

  // Fetch daftar akses dari API
  useEffect(() => {
    const fetchAksesOptions = async () => {
      if (!token) {
        console.error("Token tidak ditemukan. Pengguna belum login.");
        setPublishError("Akses ditolak, silakan login terlebih dahulu.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/akses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Gagal mengambil data akses:", result);
          setPublishError(result.message || "Gagal mengambil daftar akses.");
          return;
        }

        // Pastikan `content` ada dan berbentuk array sebelum mapping
        if (result.data?.content && Array.isArray(result.data.content)) {
          setAksesOptions(
            result.data.content.map((akses) => ({
              id: akses.id,
              name: akses.nama, // Pakai `nama`, bukan `namaAkses`
            }))
          );
        } else {
          console.error("Format data akses tidak sesuai", result);
          setAksesOptions([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data akses:", error);
        setPublishError("Gagal mengambil daftar akses.");
      }
    };

    fetchAksesOptions();
  }, [token]); // Jalankan hanya jika token tersedia

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token")?.trim();
    // console.log("Token sebelum request:", token);

    if (!token) {
      setPublishError("Anda harus login terlebih dahulu.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          akses: { id: Number(formData.akses.id) },
        }),
      });

      const data = await res.json();
      // console.log("Response dari server:", res.status, data); // Debug response status & data

      if (!res.ok) {
        console.log("Response API Error:", data); // Debugging
        setPublishError(data?.message || `Gagal membuat user (Status ${res.status})`);
        return;
      }

      // console.log("Response API Berhasil:", data); // Debugging
      setSuccessMessage(data?.message || "User berhasil dibuat!");
    } catch (error) {
      console.error("Error saat mengirim data user:", error);
      setPublishError("Terjadi kesalahan saat membuat user.");
    }
  };

  return (
    <div className="  mx-auto p-5">
      <h1 className="text-center text-3xl my-7 font-semibold">Create User</h1>
      <form className="flex  flex-wrap  gap-6 justify-center" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 w-64">
          <TextInput type="text" placeholder="Nama Lengkap" required value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} />
          <TextInput type="text" placeholder="Username" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          <TextInput type="password" placeholder="Password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <TextInput type="text" placeholder="Nomor HP" required value={formData.noHp} onChange={(e) => setFormData({ ...formData, noHp: e.target.value })} />
        </div>

        <div className="flex flex-col gap-4 w-64">
          <TextInput type="text" placeholder="Alamat" required value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} />
          <TextInput type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <TextInput type="date" required value={formData.tanggalLahir} onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })} />

          <Select
            value={formData.akses.id}
            onChange={(e) => {
              const selectedId = Number(e.target.value); // Convert ke number
              setFormData((prev) => ({
                ...prev,
                akses: { id: selectedId || null }, // Pastikan tidak mengirim 0
              }));
            }}
          >
            <option value="">Pilih Akses</option>
            {aksesOptions.map((akses) => (
              <option key={akses.id} value={akses.id}>
                {akses.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Tombol Submit */}
        <div className="w-full flex justify-center mt-2 mb-2">
          <Button type="submit" gradientDuoTone="tealToLime" outline className="w-64">
            Create User
          </Button>
        </div>
      </form>

      {publishError && <Alert color="failure">{publishError}</Alert>}
      {successMessage && <Alert color="success">{successMessage}</Alert>}
    </div>
  );
};

export default CreateUser;

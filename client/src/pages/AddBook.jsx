import { Alert, Button, TextInput, Select } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const [formData, setFormData] = useState({
    judul: "",
    penulis: "",
    penerbit: "",
    tahunTerbit: "",
    kategoriId: "",
    stok: "",
  });

  const [namaKategori, setNamaKategori] = useState("");
  const [kategoriList, setKategoriList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setErrorMessage("Anda harus login terlebih dahulu!");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/kategori`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken.trim()}`,
        },
      });

      if (res.status === 401) {
        setErrorMessage("Token tidak valid atau sudah expired. Silakan login kembali.");
        localStorage.removeItem("token");
        setToken(null);
        return;
      }

      const data = await res.json();
      setKategoriList(data.data?.content || []);
    } catch (error) {
      setErrorMessage("Gagal mengambil kategori.");
    }
  };

  // ✅ **Tambahkan handleChange untuk menangani perubahan input**
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setErrorMessage("Anda harus login terlebih dahulu!");
      return;
    }

    try {
      const trimmedToken = storedToken.trim();
      const requestHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${trimmedToken}`,
      };

      const res = await fetch(`${API_BASE_URL}/buku`, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(formData),
      });

      // console.log("Response Status:", res.status); // 🔍 Debug response status
      // console.log("Headers:", res.headers); // 🔍 Debug headers response

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = { message: await res.text() };
      }

      // console.log("Response Data:", data); // 🔍 Debug isi response API

      if (!res.ok) {
        throw new Error(data.message || "Gagal menambahkan buku.");
      }

      setSuccessMessage(data.message || "Buku berhasil ditambahkan!"); // 🔥 Ambil message dari API
      setTimeout(() => {
        navigate("/dashboard?tab=dash-book");
      }, 2000);

      setFormData({ judul: "", penulis: "", penerbit: "", tahunTerbit: "", kategoriId: "", stok: "" });
    } catch (error) {
      console.error("Error saat menambahkan buku:", error);
      setErrorMessage(error.message || "Terjadi kesalahan.");
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setErrorMessage("Anda harus login terlebih dahulu!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/kategori`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken.trim()}`,
        },
        body: JSON.stringify({ namaKategori }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menambahkan kategori.");

      setSuccessMessage("Kategori berhasil ditambahkan!");
      setTimeout(() => {
        navigate("/dashboard?tab=dash-book");
      }, 2000);
      setNamaKategori("");
      fetchKategori(); // 🔥 Langsung update kategori setelah menambahkan
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className=" mx-auto p-5">
      <h2 className="text-xl font-semibold text-center mb-4">Tambah Buku</h2>
      <form onSubmit={handleBookSubmit} className="flex  flex-wrap  gap-6 ">
        <div className="flex flex-col gap-4 w-64">
          <TextInput type="text" name="judul" placeholder="Judul Buku" value={formData.judul} onChange={handleChange} required />
          <TextInput type="text" name="penulis" placeholder="Penulis" value={formData.penulis} onChange={handleChange} required />
          <TextInput type="text" name="penerbit" placeholder="Penerbit" value={formData.penerbit} onChange={handleChange} required />
          <TextInput type="number" name="tahunTerbit" placeholder="Tahun Terbit" value={formData.tahunTerbit} onChange={handleChange} required />

          {/* Dropdown untuk memilih kategori */}
          <Select name="kategoriId" value={formData.kategoriId} onChange={handleChange} required>
            <option value="">Pilih Kategori</option>
            {kategoriList.map((kategori) => (
              <option key={kategori.id} value={kategori.id}>
                {kategori.namaKategori}
              </option>
            ))}
          </Select>

          <TextInput type="number" name="stok" placeholder="Stok" value={formData.stok} onChange={handleChange} required />
          <Button type="submit" gradientDuoTone="tealToLime" outline className="mt-1">
            Tambah Buku
          </Button>
        </div>
      </form>

      <h2 className="text-xl font-semibold text-center mt-6 mb-4">Tambah Kategori</h2>
      <form onSubmit={handleCategorySubmit} className="flex  flex-wrap  gap-6 ">
        <div className="flex flex-col gap-4 w-64">
          <TextInput type="text" placeholder="Masukkan Nama Kategori" value={namaKategori} onChange={(e) => setNamaKategori(e.target.value)} required />
          <Button type="submit" gradientDuoTone="tealToLime" outline className="mt-1">
            Tambah Kategori
          </Button>
        </div>
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

export default AddBook;

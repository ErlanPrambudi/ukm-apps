import { Alert, Button, TextInput, Select } from "flowbite-react";
import React, { useState, useEffect } from "react";

const AddAccess = () => {
  const [formData, setFormData] = useState({
    namaAkses: "",
    ltMenu: "",
  });

  const [menuList, setMenuList] = useState([
    { id: 1, nama: "Dashboard" },
    { id: 2, nama: "Pengaturan" },
    { id: 3, nama: "Laporan" },
  ]);

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [token, setToken] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAccessSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setErrorMessage("Anda harus login terlebih dahulu!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/akses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken.trim()}`,
        },
        body: JSON.stringify({
          nama: formData.namaAkses,
          ltMenu: [{ id: parseInt(formData.ltMenu), nama: menuList.find((menu) => menu.id === parseInt(formData.ltMenu))?.nama }],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menambahkan akses.");

      setSuccessMessage("Akses berhasil ditambahkan!");
      setFormData({ namaAkses: "", ltMenu: "" });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="max-w-full w-96 mx-auto p-5">
      <h2 className="text-xl font-semibold text-center mb-4">Tambah Akses</h2>
      <form onSubmit={handleAccessSubmit} className="flex flex-col gap-2 border p-4 rounded-md shadow-md">
        <TextInput type="text" name="namaAkses" placeholder="Nama Akses" value={formData.namaAkses} onChange={handleChange} required />
        <Select name="ltMenu" value={formData.ltMenu} onChange={handleChange} required>
          <option value="">Pilih Menu</option>
          {menuList.map((menu) => (
            <option key={menu.id} value={menu.id}>
              {menu.nama}
            </option>
          ))}
        </Select>
        <Button type="submit" gradientDuoTone="tealToLime">
          Tambah Akses
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

export default AddAccess;

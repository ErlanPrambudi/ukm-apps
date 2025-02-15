import { Alert, Button, TextInput, Select } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdateUser = () => {
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
  const [updateError, setUpdateError] = useState(null);
  const { userId } = useParams(); // Ambil ID dari URL
  const { currentUser } = useSelector((state) => state.user);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setUpdateError("User ID is missing");
      return;
    }

    const fetchUser = async () => {
      try {
        const token = currentUser?.token || localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Fetched user data:", data);

        if (!res.ok || !data.data) {
          setUpdateError(data.message || "Failed to fetch user data");
          return;
        }

        setUpdateError(null);
        setFormData({
          nama: data.data.nama || "",
          username: data.data.username || "",
          password: "", // Tidak menampilkan password yang telah di-hash
          noHp: data.data.noHp || "",
          alamat: data.data.alamat || "",
          email: data.data.email || "",
          tanggalLahir: data.data.tanggalLahir || "",
          akses: { id: data.data.akses?.id || "" },
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setUpdateError("Failed to fetch user data");
      }
    };

    fetchUser();
  }, [userId, currentUser]);

  useEffect(() => {
    const fetchAksesOptions = async () => {
      try {
        const token = currentUser?.token || localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/akses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Akses Data:", data);

        if (!res.ok || !data.data || !Array.isArray(data.data.content)) {
          throw new Error(data.message || "Invalid access response");
        }

        setAksesOptions(data.data.content);
      } catch (error) {
        console.log("Error fetching access options:", error.message);
        setAksesOptions([]);
      }
    };

    fetchAksesOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setUpdateError("User ID is missing");
      return;
    }

    console.log("Updating user with ID:", userId);
    console.log("Data yang dikirim:", JSON.stringify(formData, null, 2));

    // Buat objek update data tanpa password jika kosong
    const updateData = {
      nama: formData.nama,
      username: formData.username,
      noHp: formData.noHp,
      alamat: formData.alamat,
      email: formData.email,
      tanggalLahir: formData.tanggalLahir,
      akses: { id: Number(formData.akses.id) },
    };

    // Hanya tambahkan password jika user mengisinya
    if (formData.password.trim() !== "") {
      updateData.password = formData.password;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token || localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok) {
        setUpdateError(data.message || "Failed to update user");
        return;
      }

      setUpdateError(null);
      navigate("/dashboard?tab=dash-users");
    } catch (error) {
      console.error("Error updating user:", error);
      setUpdateError("Something went wrong");
    }
  };

  return (
    <div className="mx-auto p-5">
      <h1 className="text-center text-3xl my-7 font-semibold">Update User</h1>
      <form className="flex flex-wrap gap-6 justify-center" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 w-64">
          <TextInput type="text" placeholder="Nama" required value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} />
          <TextInput type="text" placeholder="Username" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          <TextInput type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <TextInput type="text" placeholder="Nomor HP" required value={formData.noHp} onChange={(e) => setFormData({ ...formData, noHp: e.target.value })} />
        </div>

        <div className="flex flex-col gap-4 w-64">
          <TextInput type="text" placeholder="Alamat" required value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} />
          <TextInput type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <TextInput type="date" required value={formData.tanggalLahir} onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })} />

          <Select
            value={formData.akses.id}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              setFormData((prev) => ({
                ...prev,
                akses: { id: selectedId || null },
              }));
            }}
          >
            <option value="">Pilih Akses</option>
            {aksesOptions.map((akses) => (
              <option key={akses.id} value={akses.id}>
                {akses.nama}
              </option>
            ))}
          </Select>
        </div>

        {/* Tombol Submit */}
        <div className="w-full flex justify-center mt-2 mb-2">
          <Button type="submit" gradientDuoTone="tealToLime" outline className="w-64">
            Update User
          </Button>
        </div>
      </form>

      {updateError && <Alert color="failure">{updateError}</Alert>}
    </div>
  );
};

export default UpdateUser;

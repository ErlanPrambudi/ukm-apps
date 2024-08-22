import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CreateUser = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [role, setRole] = useState("user");
  const [lembagaOptions, setLembagaOptions] = useState([]);
  const [selectedLembaga, setSelectedLembaga] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchLembagaOptions = async () => {
      try {
        const response = await fetch("/api/organization/getorganizations");
        const data = await response.json();

        if (Array.isArray(data.organizations)) {
          setLembagaOptions(
            data.organizations.map((lembaga) => ({
              id: lembaga._id,
              name: lembaga.namaLembaga,
            }))
          );
        } else {
          console.error("Data returned is not an array", data);
          setLembagaOptions([]);
        }
      } catch (error) {
        console.error("Failed to fetch lembaga data", error);
      }
    };
    fetchLembagaOptions();
  }, []);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData((prev) => ({ ...prev, profilePicture: downloadUrl }));
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image Upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, role, lembaga: selectedLembaga }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        setSuccessMessage("User successfully created!");

        // Mengosongkan input form setelah berhasil
        setFormData({});
        setFile(null);
        setSelectedLembaga("");
        setRole("user");

        // Memuat ulang halaman setelah user berhasil dibuat
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Menunggu 2 detik untuk memberikan waktu menampilkan pesan sukses
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 mx-auto mb-4">
      <h1 className="text-center text-3xl my-7 font-semibold">Create User</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Input Username */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
            <label className="font-bold w-full sm:w-1/4 text-left">Username</label>
            <label className="font-bold hidden sm:block">: </label>
            <TextInput type="text" placeholder="Username" required className="flex-1 w-full" value={formData.username || ""} onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))} />
          </div>

          {/* Input Email */}
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
            <label className="font-bold w-full sm:w-1/4 text-left">Email</label>
            <label className="font-bold hidden sm:block">: </label>
            <TextInput type="email" placeholder="Email" required className="flex-1 w-full" value={formData.email || ""} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
          </div>

          {/* Input Password */}
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
            <label className="font-bold w-full sm:w-1/4 text-left">Password</label>
            <label className="font-bold hidden sm:block">: </label>
            <TextInput type="text" placeholder="********" required className="flex-1 w-full" value={formData.password || ""} onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))} />
          </div>

          {/* Select Role */}
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
            <label className="font-bold w-full sm:w-1/4 text-left">Role</label>
            <label className="font-bold hidden sm:block">: </label>
            <Select
              value={role}
              onChange={(e) => {
                const newRole = e.target.value;
                setRole(newRole);
                setFormData((prev) => ({ ...prev, role: newRole }));
                if (newRole !== "pengurus") {
                  setSelectedLembaga(""); // Clear lembaga if not pengurus
                }
              }}
              className="flex-1 w-full"
            >
              <option value="user">User</option>
              <option value="pengurus">Pengurus</option>
            </Select>
          </div>

          {/* Input Lembaga */}
          {role === "pengurus" && (
            <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
              <label className="font-bold w-full sm:w-1/4 text-left">Lembaga</label>
              <label className="font-bold hidden sm:block">: </label>
              <Select value={selectedLembaga} onChange={(e) => setSelectedLembaga(e.target.value)} className="flex-1 w-full">
                <option value="">Select Lembaga</option>
                {lembagaOptions.map((lembaga) => (
                  <option key={lembaga.id} value={lembaga.id}>
                    {lembaga.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-4 sm:flex-row items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" className="w-full sm:w-auto" onChange={(e) => setFile(e.target.files[0])} />
          <Button type="button" gradientDuoTone="tealToLime" size="sm" outline onClick={handleUploadImage} disabled={imageUploadProgress}>
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
              </div>
            ) : (
              "Upload Profile Picture"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.profilePicture && <img src={formData.profilePicture} className="w-28 h-28 mx-auto" alt="Uploaded" />}

        {/* Submit Button */}
        <div className="flex justify-center my-6">
          <Button type="submit" gradientDuoTone="tealToLime" outline>
            Create User
          </Button>
        </div>

        {publishError && <Alert color="failure">{publishError}</Alert>}
        {successMessage && <Alert color="success">{successMessage}</Alert>}
      </form>
    </div>
  );
};

export default CreateUser;

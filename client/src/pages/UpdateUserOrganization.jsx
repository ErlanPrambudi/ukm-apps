import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DashOrganization from "../components/DashOrganization";
import { useSelector } from "react-redux";

const UpdateUserOrganization = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { organizationId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/organization/getorganizations-by-id?userId=${currentUser._id}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data);
          return;
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("please select an image");
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
            setFormData({ ...formData, image: downloadUrl });
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
      const res = await fetch(`/api/organization/updateorganization/${formData._id}/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/organization/${data.slug}`);
      }
    } catch (error) {
      setPublishError("something went wrong");
    }
  };

  return (
    <div className="p-3 mx-auto min-h-screen   ">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a organization</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
            <label className="font-bold w-full sm:w-1/4 text-left">Nama Lembaga</label>
            <label className="font-bold hidden sm:block">: </label>
            <TextInput type="text" placeholder="Name of institution" required id="namaLembaga" className="flex-1 w-full" onChange={(e) => setFormData({ ...formData, namaLembaga: e.target.value })} value={formData.namaLembaga} />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
            <label className="font-bold w-full sm:w-1/4 text-left">Ketua</label>
            <label className="font-bold hidden sm:block">: </label>
            <TextInput type="text" placeholder="Name of chairman" required id="ketua" className="flex-1 w-full" onChange={(e) => setFormData({ ...formData, ketua: e.target.value })} value={formData.ketua} />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
            <label className="font-bold w-full sm:w-1/4 text-left">Wakil</label>
            <label className="font-bold hidden sm:block">: </label>
            <TextInput type="text" placeholder="Name of vice-chairman" required id="wakil" className="flex-1 w-full" onChange={(e) => setFormData({ ...formData, wakil: e.target.value })} value={formData.wakil} />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
            <label className="font-bold w-full sm:w-1/4 text-left">Sekretaris</label>
            <label className="font-bold hidden sm:block">: </label>
            <TextInput type="text" placeholder="Name of secretary" required id="sekretaris" className="flex-1 w-full" onChange={(e) => setFormData({ ...formData, sekretaris: e.target.value })} value={formData.sekretaris} />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
            <label className="font-bold w-full sm:w-1/4 text-left">Bendahara</label>
            <label className="font-bold hidden sm:block">: </label>
            <TextInput type="text" placeholder="Name of treasurer" required id="bendahara" className="flex-1 w-full" onChange={(e) => setFormData({ ...formData, bendahara: e.target.value })} value={formData.bendahara} />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
            <label className="font-bold w-full sm:w-1/4 text-left">DPO</label>
            <label className="font-bold hidden sm:block">: </label>
            <TextInput type="text" placeholder="Name of DPO" required id="dpo" className="flex-1 w-full" onChange={(e) => setFormData({ ...formData, dpo: e.target.value })} value={formData.dpo} />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" className="w-full sm:w-auto" onChange={(e) => setFile(e.target.files[0])} />
          <Button type="button" gradientDuoTone="tealToLime" size="sm" outline onClick={handleUploadImage} disabled={imageUploadProgress}>
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
              </div>
            ) : (
              "Upload Logo"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && <img src={formData.image} alt="upload" className="w-full h-72 object-cover" />}

        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Visi Misi.... "
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="tealToLime" className="mt-2 sm:mt-2">
          Update
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdateUserOrganization;

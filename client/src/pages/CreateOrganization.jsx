import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DashOrganization from "../components/DashOrganization";

const CreateOrganization = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

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
      const res = await fetch("/api/organization/create", {
        method: "POST",
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
    <div>
      <div className="table-auto overflow-x-auto md:mx-auto p-3">
        <div className="p-3 mx-auto min-h-screen   ">
          <h1 className="text-center text-3xl my-7 font-semibold">Create a organization</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
                <label className="font-bold w-full sm:w-1/4 text-left">Nama Lembaga</label>
                <label className="font-bold hidden sm:block">: </label>
                <TextInput type="text" placeholder="Name of institution" required id="namaLembaga" className="flex-1 w-full" onChange={(e) => setFormData({ ...formData, namaLembaga: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
                <label className="font-bold w-full sm:w-1/4 text-left">Ketua</label>
                <label className="font-bold hidden sm:block">: </label>
                <TextInput type="text" placeholder="Name of chairman" id="ketua" className="flex-1 w-full" onChange={(e) => setFormData({ ...formData, ketua: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
                <label className="font-bold w-full sm:w-1/4 text-left">Wakil</label>
                <label className="font-bold hidden sm:block">: </label>
                <TextInput type="text" placeholder="Name of vice-chairman" id="wakil" className="flex-1 w-full" onChange={(e) => setFormData({ ...formData, wakil: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
                <label className="font-bold w-full sm:w-1/4 text-left">Sekretaris</label>
                <label className="font-bold hidden sm:block">: </label>
                <TextInput type="text" placeholder="Name of secretary" id="sekretaris" className="flex-1 w-full" onChange={(e) => setFormData({ ...formData, sekretaris: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
                <label className="font-bold w-full sm:w-1/4 text-left">Bendahara</label>
                <label className="font-bold hidden sm:block">: </label>
                <TextInput type="text" placeholder="Name of treasurer" id="bendahara" className="flex-1 w-full" onChange={(e) => setFormData({ ...formData, bendahara: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row justify-between items-center">
                <label className="font-bold w-full sm:w-1/4 text-left">DPO</label>
                <label className="font-bold hidden sm:block">: </label>
                <TextInput type="text" placeholder="Name of DPO" id="dpo" className="flex-1 w-full" onChange={(e) => setFormData({ ...formData, dpo: e.target.value })} />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row items-center justify-between border-4 border-teal-500 border-dotted p-3">
              <FileInput type="file" required accept="image/*" className="w-full sm:w-auto" onChange={(e) => setFile(e.target.files[0])} />
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
              placeholder="Visi Misi.... "
              className="h-72 mb-12"
              required
              onChange={(value) => {
                setFormData({ ...formData, content: value });
              }}
            />
            <Button type="submit" gradientDuoTone="tealToLime" className="mt-2 sm:mt-2">
              Publish
            </Button>
            {publishError && (
              <Alert className="mt-5" color="failure">
                {publishError}
              </Alert>
            )}
          </form>
        </div>
      </div>
      <div className="mt-4">
        <DashOrganization />
      </div>
    </div>
  );
};

export default CreateOrganization;

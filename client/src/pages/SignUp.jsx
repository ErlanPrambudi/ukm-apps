import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  // ✅ Pastikan `useState` memiliki default value untuk mencegah error
  const [formData, setFormData] = useState({
    "no-hp": "",
    username: "",
    nama: "",
    email: "",
    password: "",
    alamat: "",
    "tanggal-lahir": "",
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // ✅ Perbaikan `handleChange` untuk menangani input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData["no-hp"] || !formData.nama || !formData.alamat || !formData["tanggal-lahir"]) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch(`${API_BASE_URL}/auth/regis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data;
      const contentType = res.headers.get("content-type");

      // ✅ Cek apakah response adalah JSON sebelum parsing
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const textData = await res.text();
        console.error("❌ Response bukan JSON:", textData);
        throw new Error("Invalid response format from server");
      }

      setLoading(false);
      // console.log("✅ Response Status:", res.status);
      // console.log("✅ Response Data:", JSON.stringify(data, null, 2));

      if (!res.ok) {
        // ✅ Kalau ada `sub_errors`, tampilkan semua error
        if (data.sub_errors && Array.isArray(data.sub_errors)) {
          const errorMessages = data.sub_errors.map((err) => `${err.field}: ${err.message}`).join("\n");
          return setErrorMessage(errorMessages);
        }

        // ✅ Kalau tidak ada `sub_errors`, tampilkan pesan umum
        return setErrorMessage(data.message || "Registration failed. Please try again.");
      }

      console.log("🎉 Registration successful, redirecting to OTP page...");

      // ✅ Kalau OTP tidak ada dalam response, tetap lanjut ke halaman OTP
      if (!data.otp) {
        console.warn("Warning: OTP not found in response, but proceeding to OTP page...");
      }
      localStorage.setItem("email", formData.email);
      navigate("/otp");
    } catch (error) {
      setLoading(false);
      console.error("❌ Error in registration:", error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 pt-2 py-1 bg-gradient-to-r from-teal-600 via-lime-500 to-lime-400 rounded-lg text-white">Biliosphere</span>
          </Link>
          <p className="text-sm mt-5">You can sign up with your username and password </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Phone Number" />
              <TextInput type="text" placeholder="0812xxxxxx" id="no-hp" value={formData["no-hp"]} onChange={handleChange} required />
            </div>
            <div>
              <Label value="Your Username" />
              <TextInput type="text" placeholder="Username" id="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div>
              <Label value="Full Name" />
              <TextInput type="text" placeholder="Full Name" id="nama" value={formData.nama} onChange={handleChange} required />
            </div>
            <div>
              <Label value="Your Email" />
              <TextInput type="email" placeholder="name@company.com" id="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <Label value="Password" />
              <TextInput type="password" placeholder="Password" id="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div>
              <Label value="Your Address" />
              <TextInput type="text" placeholder="Address" id="alamat" value={formData.alamat} onChange={handleChange} required />
            </div>
            <div>
              <Label value="Date of Birth" />
              <TextInput type="date" id="tanggal-lahir" value={formData["tanggal-lahir"]} onChange={handleChange} required />
            </div>
            <Button gradientDuoTone="tealToLime" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account? </span>
            <Link to="/sign-in" className="text-teal-700">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;

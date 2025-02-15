import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // ✅ Ambil email dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setErrorMessage("Email tidak ditemukan. Silakan daftar ulang.");
    }
  }, []);

  // ✅ Fungsi untuk menangani input OTP
  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  // ✅ Fungsi untuk menangani submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || !email) {
      return setErrorMessage("Masukkan email dan kode OTP.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      // ✅ Pastikan format body sesuai dengan model User di backend
      const requestBody = { email, otp };

      // console.log("📤 Mengirim request OTP Verification:", requestBody);

      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      let data;
      try {
        data = await res.json();
      } catch (error) {
        throw new Error("Response dari server tidak valid.");
      }

      setLoading(false);

      // console.log("✅ Response Status:", res.status);
      // console.log("✅ Response Data:", data);

      if (!res.ok) {
        return setErrorMessage(data.message || "Verifikasi OTP gagal.");
      }

      console.log("🎉 OTP Verified! Redirecting to Sign In...");
      localStorage.removeItem("email"); // Hapus email setelah verifikasi berhasil
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      console.error("❌ Error verifying OTP:", error);
      setErrorMessage(error.message || "Terjadi kesalahan. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 border-inherit shadow-lg rounded-lg max-w-md w-full">
        <Link to="/" className="font-bold dark:text-white text-4xl text-center block mb-4">
          <span className="px-2 pt-2 py-1 bg-gradient-to-r from-teal-600 via-lime-500 to-lime-400 rounded-lg text-white">Biliosphere</span>
        </Link>

        <h2 className="text-2xl font-semibold text-center mb-4">Verifikasi OTP</h2>
        <p className="text-sm text-gray-600 text-center mb-6">Masukkan kode OTP yang telah dikirim ke email Anda {email ? `(${email})` : ""}</p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label value="Kode OTP" className="mb-4" />
            <TextInput type="text" placeholder="Masukkan OTP" value={otp} onChange={handleChange} required />
          </div>

          <Button gradientDuoTone="tealToLime" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Memverifikasi...</span>
              </>
            ) : (
              "Verifikasi OTP"
            )}
          </Button>
        </form>

        {errorMessage && (
          <Alert className="mt-4" color="failure">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;

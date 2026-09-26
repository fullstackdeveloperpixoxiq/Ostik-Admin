import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE ADMIN LOGIN
  // =========================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter admin email");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Please enter admin password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }
      );

      console.log("Admin login response:", response.data);

      // Save admin token
      localStorage.setItem("adminToken", response.data.token);

      // Save admin details
      localStorage.setItem(
        "admin",
        JSON.stringify(response.data.admin)
      );

      toast.success(
        response.data.message || "Admin login successful"
      );

      // Navigate to admin dashboard
      navigate("/ostik-admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Login failed. Please try again."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F6] flex items-center justify-center px-4 py-10 font-['Helvetica',_Arial,_sans-serif]">

      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.07)] px-6 py-8 sm:px-9 sm:py-10">

        {/* LOGO */}
        <div className="flex justify-center items-center mb-7">
          <Link to="/">
            <img
              src="/OstikLogo/OSTIK_PNG.png"
              alt="OSTIK"
              className="w-[120px] h-auto object-contain"
            />
          </Link>
        </div>

        {/* HEADING */}
        <div className="text-center mb-7">
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#222]">
            Admin Login
          </h1>

          <p className="mt-2 text-[14px] text-gray-500">
            Sign in to access your Ostik admin dashboard
          </p>
        </div>

        {/* FORM */}
        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-[14px] font-semibold text-gray-700"
            >
              Admin email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              autoComplete="email"
              disabled={loading}
              required
              className="w-full h-[48px] px-4 rounded-lg border border-gray-200 bg-white text-[15px] text-gray-800 outline-none transition-all duration-300 focus:border-[#00ff03] focus:ring-2 focus:ring-[#76B900]/10 placeholder:text-gray-400 disabled:bg-gray-50"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-[14px] font-semibold text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                autoComplete="current-password"
                disabled={loading}
                required
                className="w-full h-[48px] px-4 pr-12 rounded-lg border border-gray-200 bg-white text-[15px] text-gray-800 outline-none transition-all duration-300 focus:border-[#00ff03] focus:ring-2 focus:ring-[#76B900]/10 placeholder:text-gray-400 disabled:bg-gray-50"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#76B900] transition-colors disabled:opacity-50"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full h-[48px] mt-2 rounded-lg bg-[#00ff03] text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#00e603] hover:shadow-[0_6px_18px_rgba(118,185,0,0.25)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign In
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>

        {/* BACK TO STORE */}
        <div className="mt-7 pt-6 border-t border-gray-100 text-center">
          <p className="text-[14px] text-gray-500">
            <Link
              to="/"
              className="font-semibold text-[#00ff03] hover:text-[#00e603] transition-colors"
            >
              Back to Ostik Store
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default AdminLogin;
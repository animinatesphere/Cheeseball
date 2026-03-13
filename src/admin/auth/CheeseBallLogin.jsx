import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import logo from "../../assets/CHEESEBALL 1.png";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function CheeseBallLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (authError) throw authError;

      // Check if user has admin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'admin') {
        sessionStorage.setItem("cheeseball_admin", "true");
        navigate("/admin-dashboard");
      } else {
        await supabase.auth.signOut();
        setError("Access denied. You do not have admin permissions.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 p-8 sm:p-12">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <img
            src={logo}
            alt="CheeseBall Logo"
            className="w-full max-w-[240px]"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center op">
          Admin Access
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block op text-gray-700 text-sm font-bold mb-2 ml-1">
              Email/Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl focus:outline-none transition-all text-gray-700 op"
              placeholder="admin@cheeseball.com"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block op text-gray-700 text-sm font-bold mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl focus:outline-none transition-all text-gray-700 op"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
              {error}
            </div>
          )}

          <div className="block pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] op flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </div>
        </form>

        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Protected by industrial grade encryption</p>
        </div>
      </div>
    </div>
  );
}

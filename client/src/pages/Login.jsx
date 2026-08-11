import { Lock, Mail, User2Icon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");

  const [state, setState] = React.useState(urlState || "login");
  const [loading, setLoading] = React.useState(false);
  const [pendingMessage, setPendingMessage] = React.useState("");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setPendingMessage("");
    try {
      const { data } = await api.post(`/api/users/${state}`, formData);

      if (state === "register") {
        toast.success(data.message);
        setPendingMessage(data.message);
        setState("login");
      } else {
        dispatch(login(data));
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        navigate("/app");
      }
    } catch (error) {
      const responseData = error?.response?.data;

      if (responseData?.needsVerification) {
        setPendingMessage(responseData.message);
        toast(responseData.message);
        return;
      }

      toast(responseData?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Connexion" : "Inscription"}
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Veuillez {state === "login" ? "vous connecter" : "vous inscrire"} pour
          continuer
        </p>

        {pendingMessage && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs text-left">
            {pendingMessage}
          </div>
        )}

        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={16} color="#6B7280" />
            <input
              type="text"
              name="name"
              placeholder="Nom"
              className="border-none outline-none ring-0"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        )}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={13} color="#6B7280" />
          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            className="border-none outline-none ring-0"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={13} color="#6B7280" />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            className="border-none outline-none ring-0"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="mt-4 text-left text-green-500">
          <button className="text-sm" type="reset" disabled={loading}>
            Mot de passe oublié ?
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              {state === "login" ? "Connexion..." : "Inscription..."}
            </>
          ) : state === "login" ? (
            "Connexion"
          ) : (
            "S'inscrire"
          )}
        </button>
        <p
          onClick={() => {
            if (!loading) {
              setPendingMessage("");
              setState((prev) => (prev === "login" ? "register" : "login"));
            }
          }}
          className={`text-gray-500 text-sm mt-3 mb-11 ${
            loading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {state === "login"
            ? "Vous n'avez pas de compte ?"
            : "Vous avez déjà un compte ?"}{" "}
          <a href="#" className="text-green-500 hover:underline">
            cliquez ici
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;

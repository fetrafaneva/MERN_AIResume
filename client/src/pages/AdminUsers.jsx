import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api";
import { CheckIcon, XIcon, LoaderCircleIcon, ClockIcon } from "lucide-react";

const AdminUsers = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const loadPendingUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/users/admin/pending", {
        headers: { Authorization: token },
      });
      setUsers(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const handleVerify = async (id) => {
    setProcessingId(id);
    try {
      await api.post(
        `/api/users/admin/${id}/verify`,
        {},
        { headers: { Authorization: token } }
      );
      toast.success("Compte validé");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Erreur");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const confirmDelete = window.confirm(
      "Rejeter et supprimer définitivement ce compte ?"
    );
    if (!confirmDelete) return;

    setProcessingId(id);
    try {
      await api.delete(`/api/users/admin/${id}/reject`, {
        headers: { Authorization: token },
      });
      toast.success("Compte rejeté");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Erreur");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-800 mb-2">
        Comptes en attente de validation
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Valide ou rejette les nouvelles inscriptions.
      </p>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-16">
          Aucun compte en attente
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 rounded-xl p-4 bg-white shadow-sm"
            >
              <div>
                <p className="font-medium text-slate-800">{u.name}</p>
                <p className="text-xs text-slate-500">{u.email}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <ClockIcon className="size-3" />
                  Inscrit le {new Date(u.createdAt).toLocaleString("fr-FR")}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={processingId === u._id}
                  onClick={() => handleVerify(u._id)}
                  className="flex items-center gap-1 text-xs px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-50"
                >
                  {processingId === u._id ? (
                    <LoaderCircleIcon className="size-3.5 animate-spin" />
                  ) : (
                    <CheckIcon className="size-3.5" />
                  )}
                  Valider
                </button>
                <button
                  disabled={processingId === u._id}
                  onClick={() => handleReject(u._id)}
                  className="flex items-center gap-1 text-xs px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <XIcon className="size-3.5" />
                  Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

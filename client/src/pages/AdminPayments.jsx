import React, { useEffect, useState } from "react";
import { useSelector, useNavigate as _unused } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../configs/api";
import {
  CheckIcon,
  XIcon,
  LoaderCircleIcon,
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABELS = {
  pending: "En attente",
  approved: "Approuvée",
  rejected: "Rejetée",
};

const PROVIDER_LABELS = {
  mvola: "MVola",
  orange: "Orange Money",
  airtel: "Airtel Money",
};

const AdminPayments = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [tab, setTab] = useState("pending"); // "pending" | "all"
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const loadRequests = async (activeTab) => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "pending"
          ? "/api/payment/admin/pending"
          : "/api/payment/admin/all";
      const { data } = await api.get(endpoint, {
        headers: { Authorization: token },
      });
      setRequests(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sécurité frontend (le vrai contrôle est côté backend via isAdmin)
    if (user && user.role !== "admin") {
      navigate("/app");
      return;
    }
    loadRequests(tab);
  }, [tab]);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await api.post(
        `/api/payment/admin/${id}/approve`,
        {},
        { headers: { Authorization: token } }
      );
      toast.success("Demande approuvée, compte mis à jour");
      loadRequests(tab);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Erreur");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await api.post(
        `/api/payment/admin/${id}/reject`,
        { reason: rejectReason },
        { headers: { Authorization: token } }
      );
      toast.success("Demande rejetée");
      setRejectingId(null);
      setRejectReason("");
      loadRequests(tab);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Erreur");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-800 mb-2">
        Demandes de paiement
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Valide ou rejette les demandes de passage Premium.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {[
          { key: "pending", label: "En attente" },
          { key: "all", label: "Historique complet" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? "border-green-500 text-green-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-16">
          {tab === "pending"
            ? "Aucune demande en attente 🎉"
            : "Aucune demande pour le moment."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((req) => (
            <div
              key={req._id}
              className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-slate-800">
                      {req.user?.name || "Utilisateur inconnu"}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        STATUS_STYLES[req.status]
                      }`}
                    >
                      {STATUS_LABELS[req.status]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {req.user?.email}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                    <span>
                      Plan : <span className="font-medium">{req.plan}</span>
                    </span>
                    <span>
                      Montant :{" "}
                      <span className="font-medium">
                        {req.amount.toLocaleString("fr-FR")} Ar
                      </span>
                    </span>
                    <span>
                      Moyen :{" "}
                      <span className="font-medium">
                        {PROVIDER_LABELS[req.provider]}
                      </span>
                    </span>
                    <span>
                      Numéro expéditeur :{" "}
                      <span className="font-medium">{req.senderPhone}</span>
                    </span>
                    {req.transactionRef && (
                      <span>
                        Référence :{" "}
                        <span className="font-medium">
                          {req.transactionRef}
                        </span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <ClockIcon className="size-3" />
                    Soumise le {new Date(req.createdAt).toLocaleString("fr-FR")}
                  </p>

                  {req.status !== "pending" && (
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      {req.status === "approved" ? (
                        <CheckCircle2Icon className="size-3 text-green-500" />
                      ) : (
                        <XCircleIcon className="size-3 text-red-500" />
                      )}
                      Traitée par {req.processedBy?.name || "—"} le{" "}
                      {req.processedAt &&
                        new Date(req.processedAt).toLocaleString("fr-FR")}
                      {req.adminNote && ` — Raison : ${req.adminNote}`}
                    </p>
                  )}
                </div>

                {req.status === "pending" && (
                  <div className="flex flex-col gap-2 shrink-0">
                    {rejectingId === req._id ? (
                      <div className="flex flex-col gap-2 w-56">
                        <input
                          autoFocus
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Raison (optionnel)"
                          className="text-xs px-2 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-red-400"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setRejectingId(null);
                              setRejectReason("");
                            }}
                            className="flex-1 text-xs py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
                          >
                            Annuler
                          </button>
                          <button
                            disabled={processingId === req._id}
                            onClick={() => handleReject(req._id)}
                            className="flex-1 text-xs py-1.5 rounded bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 flex items-center justify-center gap-1"
                          >
                            {processingId === req._id ? (
                              <LoaderCircleIcon className="size-3 animate-spin" />
                            ) : (
                              "Confirmer"
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          disabled={processingId === req._id}
                          onClick={() => handleApprove(req._id)}
                          className="flex items-center justify-center gap-1 text-xs px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-50"
                        >
                          {processingId === req._id ? (
                            <LoaderCircleIcon className="size-3.5 animate-spin" />
                          ) : (
                            <CheckIcon className="size-3.5" />
                          )}
                          Approuver
                        </button>
                        <button
                          disabled={processingId === req._id}
                          onClick={() => setRejectingId(req._id)}
                          className="flex items-center justify-center gap-1 text-xs px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <XIcon className="size-3.5" />
                          Rejeter
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPayments;

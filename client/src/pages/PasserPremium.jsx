import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../configs/api.js"; // ajuste le chemin si besoin

const PROVIDER_LABELS = {
  mvola: "MVola",
  orange: "Orange Money",
  airtel: "Airtel Money",
};

const PasserPremium = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const [config, setConfig] = useState(null);
  const [myRequest, setMyRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const selectedPlan = location.state?.plan || "";
  const [selectedProvider, setSelectedProvider] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [transactionRef, setTransactionRef] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [configRes, myRequestRes] = await Promise.all([
          api.get("/api/payment/config"),
          api.get("/api/payment/my-request", {
            headers: { Authorization: token },
          }),
        ]);
        setConfig(configRes.data);
        setMyRequest(myRequestRes.data);
      } catch (error) {
        toast.error("Impossible de charger les informations de paiement");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlan || !selectedProvider || !senderPhone) {
      toast.error("Merci de remplir tous les champs obligatoires");
      return;
    }

    const token = localStorage.getItem("token");
    setSubmitting(true);
    try {
      const { data } = await api.post(
        "/api/payment/request",
        {
          plan: selectedPlan,
          provider: selectedProvider,
          senderPhone,
          transactionRef,
        },
        { headers: { Authorization: token } }
      );
      toast.success("Demande envoyée, en attente de validation");
      setMyRequest(data.request);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }

  // Si déjà premium et actif
  if (user?.plan === "premium") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-semibold text-green-600 mb-2">
          Vous êtes déjà Premium 🎉
        </h1>
        <p className="text-slate-600">
          Profitez de toutes les fonctionnalités sans limite.
        </p>
      </div>
    );
  }

  // Si une demande est en attente
  if (myRequest && myRequest.status === "pending") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Demande en attente de validation
        </h1>
        <p className="text-slate-600 max-w-md">
          Votre demande pour le plan{" "}
          <span className="font-medium">{myRequest.plan}</span> a bien été
          reçue. Elle sera validée dès que le paiement sera confirmé par
          l'administrateur.
        </p>
      </div>
    );
  }

  const numbers = config?.numbers || {};
  const plans = config?.plans || {};
  const planData = plans[selectedPlan];

  // Aucun plan reçu depuis /pricing → on renvoie l'utilisateur choisir une offre
  if (!planData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Aucune offre sélectionnée
        </h1>
        <p className="text-slate-600 max-w-md mb-6">
          Merci de choisir une offre depuis la page des tarifs avant de
          continuer.
        </p>
        <button
          onClick={() => navigate("/pricing")}
          className="px-8 py-3 bg-green-500 hover:bg-green-600 active:scale-95 transition-all rounded-full text-white"
        >
          Voir les offres
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-2">
        Passer <span className="text-green-600">Premium</span>
      </h1>
      <p className="text-slate-600 text-center max-w-md mb-8">
        Effectuez le transfert, puis soumettez votre demande ci-dessous.
      </p>

      {/* Rejeté précédemment */}
      {myRequest && myRequest.status === "rejected" && (
        <div className="w-full max-w-md mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          Votre précédente demande a été rejetée
          {myRequest.adminNote ? ` : ${myRequest.adminNote}` : ""}. Vous pouvez
          soumettre une nouvelle demande ci-dessous.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
      >
        {/* Récap de l'offre choisie */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Votre offre
          </label>
          <div className="flex justify-between items-center px-4 py-3 rounded-lg border border-green-500 bg-green-50">
            <span className="font-medium text-slate-800">{planData.label}</span>
            <span className="text-green-600 font-semibold">
              {planData.amount.toLocaleString("fr-FR")} Ar
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate("/pricing")}
            className="text-xs text-slate-500 hover:text-green-600 underline underline-offset-2 mt-2"
          >
            Changer d'offre
          </button>
        </div>

        {/* Choix du provider */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Moyen de paiement
          </label>
          <div className="flex gap-2">
            {Object.entries(PROVIDER_LABELS).map(([key, label]) => (
              <button
                type="button"
                key={key}
                onClick={() => setSelectedProvider(key)}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm transition ${
                  selectedProvider === key
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-200 text-slate-600 hover:border-green-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Numéro à qui envoyer */}
        {selectedProvider && (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-sm text-slate-700">
            Envoyez le montant exact au numéro{" "}
            <span className="font-semibold text-green-700">
              {numbers[selectedProvider]}
            </span>{" "}
            via {PROVIDER_LABELS[selectedProvider]}, puis remplissez le
            formulaire ci-dessous.
          </div>
        )}

        {/* Numéro d'envoi */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Votre numéro (celui utilisé pour payer)
          </label>
          <input
            type="tel"
            value={senderPhone}
            onChange={(e) => setSenderPhone(e.target.value)}
            placeholder="034 XX XXX XX"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Référence transaction (optionnel) */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Référence de transaction (optionnel)
          </label>
          <input
            type="text"
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            placeholder="Ex: MP240707.1234.A56789"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full bg-green-500 hover:bg-green-600 active:scale-95 transition-all text-white rounded-full py-3 font-medium disabled:opacity-50"
        >
          {submitting ? "Envoi en cours..." : "Soumettre ma demande"}
        </button>
      </form>
    </div>
  );
};

export default PasserPremium;

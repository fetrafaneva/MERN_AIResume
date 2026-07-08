import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [config, setConfig] = useState(null);
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await api.get("/api/payment/config");
        setConfig(data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const goToPayment = (plan) => {
    if (!user) {
      navigate("/app?state=login");
      return;
    }
    navigate("/app/premium", { state: { plan } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-neutral-500">Chargement des tarifs...</p>
      </div>
    );
  }

  const { plans = {} } = config || {};
  const monthly = plans.monthly;
  const yearly = plans.yearly;
  const pack5 = plans.pack5;

  const selectedPremium = isYearly ? yearly : monthly;
  const monthlyEquivalent = yearly ? Math.round(yearly.amount / 12) : 0;
  const savingsPercent =
    monthly && yearly
      ? Math.round(100 - (monthlyEquivalent / monthly.amount) * 100)
      : 0;

  const formatAr = (n) => `${n.toLocaleString("fr-FR")} Ar`;

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          * { font-family: 'Poppins', sans-serif; }
        `}
      </style>

      <div className="flex flex-col items-center py-16 px-4">
        <h1 className="text-3xl md:text-4xl text-center mb-3 text-neutral-800">
          Créez votre CV gratuitement. Passez Premium quand vous voulez.
        </h1>
        <p className="text-neutral-600 text-center mb-8 text-sm max-w-md">
          Aucune carte bancaire requise. Paiement simple via Mobile Money.
        </p>

        {/* Toggle Monthly / Yearly */}
        <div className="relative p-1 bg-white border border-gray-200 rounded-full inline-flex items-center mb-10 w-60">
          <div
            className={`absolute -z-10 w-[calc(50%-4px)] h-[calc(100%-8px)] rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-transform duration-300 ease-in-out pointer-events-none ${
              isYearly ? "translate-x-full" : "translate-x-0"
            }`}
          ></div>

          <button
            onClick={() => setIsYearly(false)}
            className={`relative z-10 flex-1 py-2.5 rounded-full text-sm font-medium text-center transition-colors duration-300 cursor-pointer ${
              !isYearly
                ? " text-green-500"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Mensuel
          </button>

          <button
            onClick={() => setIsYearly(true)}
            className={`relative z-10 flex-1 py-2.5 rounded-full text-sm font-medium text-center flex items-center justify-center gap-1 transition-colors duration-300 cursor-pointer ${
              isYearly ? "text-green-500" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Annuel <span className="text-xs">-{savingsPercent}%</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full items-end">
          {/* Free */}
          <div className="rounded-3xl p-6 bg-white border border-neutral-200 hover:shadow-lg transition-shadow">
            <h3 className="text-neutral-700 text-sm mb-6">Gratuit</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-[28px] text-neutral-900">0 Ar</span>
              <span className="text-neutral-600 text-xs">/ mois</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "3 générations IA par mois",
                "1 CV actif",
                "Templates de base",
                "Export PDF standard",
                "Support communautaire",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm text-neutral-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate(user ? "/app" : "/app?state=register")}
              className="w-full py-3 rounded-full cursor-pointer border border-neutral-300 text-neutral-700 text-sm hover:bg-neutral-50 transition-colors"
            >
              Commencer gratuitement
            </button>
          </div>

          {/* Premium */}
          <div className="bg-gradient-to-r from-green-600 to-green-300 rounded-3xl p-2 shadow-xl hover:shadow-lg transition-shadow">
            <p className="text-center text-green-800 text-sm py-1.5">
              Recommandé
            </p>
            <div className="rounded-3xl p-6 bg-white">
              <h3 className="text-neutral-700 text-sm mb-6">Premium</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[28px] text-neutral-900">
                  {selectedPremium ? formatAr(selectedPremium.amount) : "--"}
                </span>
                <span className="text-neutral-600 text-xs">
                  / {isYearly ? "an" : "mois"}
                </span>
              </div>
              {isYearly && (
                <p className="text-xs text-neutral-500 mb-6">
                  soit {formatAr(monthlyEquivalent)} / mois
                </p>
              )}
              {!isYearly && <div className="mb-6" />}
              <ul className="space-y-4 mb-8">
                {[
                  "Générations IA illimitées",
                  "CV illimités",
                  "Tous les templates",
                  "Export PDF haute qualité",
                  "Support prioritaire",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-neutral-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => goToPayment(isYearly ? "yearly" : "monthly")}
                className="w-full py-3 rounded-full cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white text-sm hover:opacity-95 transition-opacity"
              >
                Passer Premium
              </button>
            </div>
          </div>

          {/* Pack ponctuel */}
          {pack5 && (
            <div className="rounded-3xl p-6 bg-white border border-neutral-200 hover:shadow-lg transition-shadow">
              <h3 className="text-neutral-700 text-sm mb-6">{pack5.label}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-[28px] text-neutral-900">
                  {formatAr(pack5.amount)}
                </span>
                <span className="text-neutral-600 text-xs">
                  / {pack5.generations} générations
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  `${pack5.generations} générations IA`,
                  "Aucun engagement",
                  "Valable sans limite de temps",
                  "Idéal pour un usage ponctuel",
                  "Support communautaire",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-neutral-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => goToPayment("pack5")}
                className="w-full py-3 rounded-full cursor-pointer border border-neutral-300 text-neutral-700 text-sm hover:bg-neutral-50 transition-colors"
              >
                Acheter le pack
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Pricing;

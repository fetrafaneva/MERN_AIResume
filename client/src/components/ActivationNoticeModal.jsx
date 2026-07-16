import React from "react";
import { PartyPopperIcon, XIcon, CheckIcon } from "lucide-react";

const ActivationNoticeModal = ({ notice, onClose }) => {
  if (!notice) return null;

  const isPack = notice.type === "pack";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center overflow-hidden"
      >
        <div className="absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 opacity-30 blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 size-40 rounded-full bg-gradient-to-br from-green-300 to-emerald-400 opacity-20 blur-2xl"></div>

        <div className="relative">
          <div className="mx-auto mb-4 size-14 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
            <PartyPopperIcon className="size-7 text-white" />
          </div>

          <h2 className="text-lg font-semibold text-slate-800 mb-1">
            {isPack ? "Pack activé ! " : "Bienvenue Premium ! "}
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            {isPack
              ? "Votre pack de générations a été ajouté à votre compte."
              : "Votre abonnement Premium est maintenant actif."}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6">
            <p className="font-medium text-slate-800 mb-3">{notice.label}</p>

            {isPack ? (
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckIcon className="size-4 text-green-500 shrink-0" />+
                  {notice.generations} générations IA
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckIcon className="size-4 text-green-500 shrink-0" />+
                  {notice.downloads} téléchargements PDF
                </li>
              </ul>
            ) : (
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckIcon className="size-4 text-green-500 shrink-0" />
                  Générations IA illimitées
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckIcon className="size-4 text-green-500 shrink-0" />
                  Téléchargements PDF illimités
                </li>
                {notice.expiresAt && (
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckIcon className="size-4 text-green-500 shrink-0" />
                    Valable jusqu'au{" "}
                    {new Date(notice.expiresAt).toLocaleDateString("fr-FR")}
                  </li>
                )}
              </ul>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-medium transition-colors"
          >
            Confirmer
          </button>
        </div>

        <XIcon
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default ActivationNoticeModal;

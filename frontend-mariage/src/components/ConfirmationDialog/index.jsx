import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import CustomBottom from "../Bottom";

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  confirmLoading = false,
  confirmDisabled = false,
  icon,
  stripeColorClass = "bg-red-500",
  iconBgColorClass = "bg-red-500/10",
  iconTextColorClass = "text-red-500",
  iconRingColorClass = "ring-red-500/5",
}) => {
  const confirmButtonClass = "bg-red-500 hover:bg-red-600 shadow-red-500/20 hover:shadow-red-500/40 text-white";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="theme-overlay absolute inset-0 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="theme-modal-surface relative w-full max-w-md overflow-hidden rounded-3xl border p-8 text-center shadow-2xl"
          >
            <div className={`absolute left-0 top-0 h-1 w-full ${stripeColorClass}`}></div>

            <div className={`w-16 h-16 ${iconBgColorClass} rounded-full flex items-center justify-center mx-auto mb-4 ${iconTextColorClass} ring-4 ${iconRingColorClass}`}>
              {icon || <FiLogOut size={32} />}
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white">{title || "Confirm Logout"}</h2>
            <p className="mb-8 text-sm text-gray-400">{message || "Are you sure you want to logout?"}</p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={confirmLoading}
                className="theme-outline-button flex-1 rounded-xl py-3.5 font-semibold transition-all duration-200"
              >
                {cancelText || "Cancel"}
              </button>
              <CustomBottom
                text={confirmText || "Logout"}
                title={confirmText || "Logout"}
                onClick={onConfirm}
                loading={confirmLoading}
                disabled={confirmDisabled}
                rigthIcon={icon || <FiLogOut size={18} />}
                styles="flex-1"
                buttonStyles={`${confirmButtonClass} py-3.5 font-bold shadow-lg`}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import { useTheme } from "../../theme/ThemeProvider";
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
}) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const confirmButtonClass = isLight
    ? "bg-red-500 hover:bg-red-600 shadow-red-500/15 hover:shadow-red-500/30 text-white"
    : "bg-red-500 hover:bg-red-600 shadow-red-500/20 hover:shadow-red-500/40 text-white";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
          <motion.button type="button" aria-label={cancelText || "Cancel"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.94, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 18 }} className="relative w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white p-4 text-center text-slate-950 shadow-2xl dark:border-[#344458] dark:bg-[#09121b] dark:text-white sm:p-8">
            <div className="absolute left-0 top-0 h-1 w-full bg-red-500" />
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 ring-4 ring-red-500/5"><FiAlertTriangle size={30} /></div>
            <h2 className="mb-2 text-2xl font-bold">{title || "Confirm delete"}</h2>
            <p className="mb-8 text-sm text-slate-500 dark:text-slate-300">{message || "Are you sure?"}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onClose} disabled={confirmLoading} className="flex-1 rounded-lg border border-slate-200 py-3.5 font-semibold text-slate-700 transition hover:border-gold dark:border-[#344458] dark:text-white dark:hover:border-gold">{cancelText || "Cancel"}</button>
              <CustomBottom text={confirmText || "Delete"} title={confirmText || "Delete"} onClick={onConfirm} loading={confirmLoading} disabled={confirmDisabled} rigthIcon={<FiTrash2 size={18} />} styles="flex-1" buttonStyles={`${confirmButtonClass} py-3.5 font-bold shadow-lg`} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;

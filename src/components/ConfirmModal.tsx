interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmModal = ({ open, title, description, onConfirm, onCancel, loading }: ConfirmModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
        <h3 className="text-base font-semibold text-[#202223] mb-2">{title}</h3>
        <p className="text-sm text-[#6d7175] mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="border border-[#e0e0e0] text-sm font-medium px-4 py-2 rounded-lg text-[#6d7175] hover:bg-[#f1f1f1] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="bg-[#d72c0d] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#b8200a] transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

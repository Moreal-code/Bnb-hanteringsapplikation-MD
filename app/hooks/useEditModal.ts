import { create } from "zustand";
import { SafeListing } from "@/app/types";

interface EditModalStore {
  isOpen: boolean;
  listing: SafeListing | null;
  onOpen: (listing: SafeListing) => void;
  onClose: () => void;
}

const useEditModal = create<EditModalStore>((set) => ({
  isOpen: false,
  listing: null,
  onOpen: (listing: SafeListing) => set({ isOpen: true, listing }),
  onClose: () => set({ isOpen: false, listing: null }),
}));

export default useEditModal;


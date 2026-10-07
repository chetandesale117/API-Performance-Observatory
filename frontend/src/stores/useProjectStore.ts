import { create } from 'zustand';

interface ProjectState {
  activeProjectId: string | null;
  activeCollectionId: string | null;
  setActiveProject: (id: string | null) => void;
  setActiveCollection: (id: string | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  activeProjectId: localStorage.getItem('activeProjectId'),
  activeCollectionId: null,
  setActiveProject: (id) => {
    if (id) {
      localStorage.setItem('activeProjectId', id);
    } else {
      localStorage.removeItem('activeProjectId');
    }
    set({ activeProjectId: id, activeCollectionId: null });
  },
  setActiveCollection: (id) => set({ activeCollectionId: id }),
}));

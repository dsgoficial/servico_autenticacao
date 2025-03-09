// Path: stores\userStore.ts
import { create } from 'zustand';
import { User } from '@/types/user';

// Define types for selections/filtered sets of users
interface UserSelectionState {
  // Selected users (e.g., for bulk operations)
  selectedUsers: User[];

  // Current user being edited (for forms/modals)
  currentUser: User | null;

  // Actions
  selectUser: (user: User) => void;
  selectUsers: (users: User[]) => void;
  clearSelection: () => void;
  setCurrentUser: (user: User | null) => void;
}

/**
 * Store for managing UI state related to users
 * This complements the useUsers hook that handles data fetching
 */
export const useUserStore = create<UserSelectionState>(set => ({
  selectedUsers: [],
  currentUser: null,

  selectUser: user =>
    set(state => ({
      selectedUsers: state.selectedUsers.some(u => u.uuid === user.uuid)
        ? state.selectedUsers.filter(u => u.uuid !== user.uuid)
        : [...state.selectedUsers, user],
    })),

  selectUsers: users => set({ selectedUsers: users }),

  clearSelection: () => set({ selectedUsers: [] }),

  setCurrentUser: user => set({ currentUser: user }),
}));

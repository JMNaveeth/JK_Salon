// Mock Authentication and API Service
// Since Firebase was declined, we use a local state/API approach

export const auth = {
  currentUser: null as any,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Simulate auth check
    const savedUser = localStorage.getItem('jk_salon_user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    auth.currentUser = user;
    setTimeout(() => callback(user), 500);
    return () => {};
  },
  signInWithPopup: async () => {
    // Mock Google Login
    const mockUser = {
      uid: 'admin_123',
      email: 'asamathu587@gmail.com',
      displayName: 'Admin User',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    };
    localStorage.setItem('jk_salon_user', JSON.stringify(mockUser));
    auth.currentUser = mockUser;
    window.location.reload();
    return { user: mockUser };
  },
  signOut: async () => {
    localStorage.removeItem('jk_salon_user');
    auth.currentUser = null;
    window.location.reload();
  }
};

export const db = {}; // Placeholder for components that might still import it

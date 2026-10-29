
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }

  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verify the authenticated user against the admin_users table.
  const loadAdmin = async (user) => {
    if (!supabase || !user) {
      setAdmin(null);
      return null;
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id, role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      setAdmin(null);
      await supabase.auth.signOut();

      throw new Error(
        'This account is not authorized to access the admin dashboard.'
      );
    }

    const allowedRoles = ['super_admin', 'admin', 'editor'];

    if (!allowedRoles.includes(data.role)) {
      setAdmin(null);
      await supabase.auth.signOut();

      throw new Error('Your account has an invalid admin role.');
    }

    const normalizedAdmin = {
      id: data.user_id,
      admin_id: data.user_id,
      user_id: data.user_id,
      email: user.email,
      admin_name: user.email?.split('@')[0] || 'Admin',
      admin_type: data.role,
      role: data.role,
      is_active: true,
    };

    setAdmin(normalizedAdmin);
    return normalizedAdmin;
  };

  // Restore an existing session and listen for authentication changes.
  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return undefined;
    }

    let mounted = true;

    const initialize = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session?.user) {
          await loadAdmin(session.user);
        }
      } catch (err) {
        console.error('Admin session error:', err);

        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setAdmin(null);
        setError(null);
        return;
      }

      if (event === 'SIGNED_IN' && session?.user) {
        // Defer database access until the auth callback finishes.
        Promise.resolve().then(async () => {
          try {
            await loadAdmin(session.user);
          } catch (err) {
            console.error('Admin authorization error:', err);

            if (mounted) {
              setAdmin(null);
              setError(err.message);
            }
          }
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Authenticate using Supabase Auth.
  // Team name and position remain in the signature for compatibility
  // with the existing Admin.jsx login form.
  const login = async (email, teamName, adminPosition, password) => {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase is not configured.',
      };
    }

    try {
      setError(null);
      setIsLoading(true);

      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      const authorizedAdmin = await loadAdmin(data.user);

      if (!authorizedAdmin) {
        throw new Error('Unable to verify admin access.');
      }

      return {
        success: true,
        admin: authorizedAdmin,
      };
    } catch (err) {
      setAdmin(null);
      setError(err.message);

      return {
        success: false,
        error: err.message || 'Login failed.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!supabase) {
      setAdmin(null);
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    setAdmin(null);
    setError(null);
  };

  // Role helpers.
  const isSuperAdmin = () => admin?.admin_type === 'super_admin';

  const isAdminOrAbove = () =>
    ['super_admin', 'admin'].includes(admin?.admin_type);

  // Dashboard permissions.
  const hasAccess = (feature) => {
    if (!admin) {
      return false;
    }

    const role = admin.admin_type;

    switch (feature) {
      case 'admins':
      case 'members':
        return role === 'super_admin';

      case 'events':
      case 'gallery':
        return ['super_admin', 'admin'].includes(role);

      case 'blogs':
      case 'resources':
        return ['super_admin', 'admin', 'editor'].includes(role);

      default:
        return false;
    }
  };

  const value = {
    admin,
    isLoading,
    error,
    login,
    logout,
    isSuperAdmin,
    isAdminOrAbove,
    hasAccess,
    isAuthenticated: Boolean(admin),
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  loading: boolean; // For backward compatibility
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  // Add the missing methods
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Handle login with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          avatar_url: data.user.user_metadata?.avatar_url,
        });
      }
      
      toast({
        title: 'Inicio de sesión exitoso',
        description: '¡Bienvenido de nuevo!',
      });
      
      navigate('/chat');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al iniciar sesión',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user registration
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;
      
      // Optionally save to a separate registration table if needed
      if (data?.user) {
        try {
          await supabase.from('registration').upsert({
            id: data.user.id,
            user_id: data.user.id,
            email: data.user.email,
            created_at: new Date().toISOString(),
          });
        } catch (dbError) {
          console.error('Error saving to registration table:', dbError);
          // Don't block registration if this fails
        }
        
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: name || data.user.email?.split('@')[0],
        });
      }
      
      toast({
        title: '¡Registro exitoso!',
        description: 'Por favor revisa tu correo para confirmar tu cuenta.',
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al registrarse',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      localStorage.removeItem('user');
      navigate('/login');
      
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Error al cerrar sesión',
        variant: 'destructive',
      });
    }
  };

  // Handle password reset
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      toast({
        title: 'Correo enviado',
        description: 'Revisa tu correo para restablecer tu contraseña',
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el correo de recuperación',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Check for active session on mount
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session);
        
        if (session?.user) {
          try {
            // First try to get user data from the session
            const userData = {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              avatar_url: session.user.user_metadata?.avatar_url,
            };
            
            setUser(userData);
            
            // Try to get additional data from profiles table if it exists
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
                
              if (profileData && !error) {
                setUser({
                  ...userData,
                  name: profileData.full_name || userData.name,
                  avatar_url: profileData.avatar_url || userData.avatar_url,
                });
              }
            } catch (profileError) {
              // Ignore errors related to missing profiles table
              if (!(profileError as any).message?.includes('relation "public.profiles" does not exist')) {
                console.error('Error fetching user profile:', profileError);
              }
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          // Set basic user data from session first
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url,
          };
          
          setUser(userData);
          
          // Try to get additional data from profiles table if it exists
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (profileData && !error) {
              setUser({
                ...userData,
                name: profileData.full_name || userData.name,
                avatar_url: profileData.avatar_url || userData.avatar_url,
              });
            }
          } catch (profileError) {
            // Ignore errors related to missing profiles table
            if (!(profileError as any).message?.includes('relation "public.profiles" does not exist')) {
              console.error('Error fetching user profile:', profileError);
            }
          }
        }
      } catch (error) {
        console.error('Error in session check:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Store user in localStorage when it changes

  const value = {
    user,
    session,
    isLoading,
    loading: isLoading, // For backward compatibility
    login,
    register,
    logout,
    resetPassword,
    signIn: login, // Alias for login
    signOut: logout, // Alias for logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

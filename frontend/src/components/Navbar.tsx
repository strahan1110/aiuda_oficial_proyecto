import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = (): JSX.Element | null => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Don't render navbar on auth pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm transition-all duration-200 ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-aiuda-coral">AIuda</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-aiuda-coral ${
                location.pathname === '/' ? 'text-aiuda-coral' : 'text-gray-700'
              }`}
            >
              Inicio
            </Link>
            <Link 
              to="/#features" 
              className={`text-sm font-medium transition-colors hover:text-aiuda-coral ${
                location.pathname === '/#features' ? 'text-aiuda-coral' : 'text-gray-700'
              }`}
            >
              Características
            </Link>
            <Link 
              to="/#how-it-works" 
              className={`text-sm font-medium transition-colors hover:text-aiuda-coral ${
                location.pathname === '/#how-it-works' ? 'text-aiuda-coral' : 'text-gray-700'
              }`}
            >
              Cómo funciona
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <User className="h-4 w-4" />
                </Button>
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                  <div className="py-1">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                    <div className="border-t my-1"></div>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Perfil
                    </Link>
                    <div className="border-t my-1"></div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Iniciar sesión</Link>
                </Button>
                <Button asChild>
                  <Link to="/register" className="bg-aiuda-coral hover:bg-aiuda-coral/90">
                    Registrarse
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-1 pb-3 pt-2">
          <Link
            to="/"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-aiuda-coral"
            onClick={() => setMobileMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/#features"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-aiuda-coral"
            onClick={() => setMobileMenuOpen(false)}
          >
            Características
          </Link>
          <Link
            to="/#how-it-works"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-aiuda-coral"
            onClick={() => setMobileMenuOpen(false)}
          >
            Cómo funciona
          </Link>
          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-aiuda-coral"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mi perfil
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-aiuda-coral"
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-base font-medium text-aiuda-coral hover:bg-aiuda-coral/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

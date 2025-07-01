
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = (): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir a la página de inicio
    navigate('/home');
  }, [navigate]);

  return null; // No renderiza nada mientras redirige
};

export default Index;

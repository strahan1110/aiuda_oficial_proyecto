import React from 'react';
import styles from './LogoLoader.module.css';

interface LogoLoaderProps {
  isLoading?: boolean;
  size?: number;
}

const LogoLoader: React.FC<LogoLoaderProps> = ({ 
  isLoading = true, 
  size = 120 
}) => {
  return (
    <div className={`${styles.logoContainer} ${isLoading ? styles.animate : ''}`}>
      <div className={styles.logoWrapper} style={{ width: size, height: size }}>
        <img
          src="/img/logo.png"
          alt="Logo"
          width={size}
          height={size}
          className={styles.logo}
        />
      </div>
    </div>
  );
};

export default LogoLoader;

import React from 'react';
import styles from './GradientButton.module.scss';

export const GradientButton = ({
  children,
  onClick,
  type = 'button',
  isLoading = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || props.disabled}
      className={`${styles.button} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className={styles.spinner} />
      ) : (
        children
      )}
    </button>
  );
};

export default GradientButton;

import React from 'react';
import styles from './GlassCard.module.scss';

export const GlassCard = ({
  children,
  className = '',
  onClick,
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`${styles.card} ${hoverEffect ? styles.hoverable : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;

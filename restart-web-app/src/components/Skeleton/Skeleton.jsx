import React from 'react';
import styles from './Skeleton.module.scss';

export const Skeleton = ({ width, height = '16px', radius, className = '', style = {} }) => {
  return (
    <span
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
};

export const SkeletonCard = ({ lines = 3, className = '' }) => {
  return (
    <div className={`${styles.skeletonCard} ${className}`}>
      <Skeleton width="48px" height="48px" radius="50%" />
      <div className={styles.skeletonLines}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} width={i === lines - 1 ? '60%' : '90%'} height="12px" />
        ))}
      </div>
    </div>
  );
};

export default Skeleton;

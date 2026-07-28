import React from 'react';
import { MARKETPLACE_CATEGORIES } from '../constants';
import styles from './CategoryStrip.module.scss';

export const CategoryStrip = ({ activeCategory, onCategoryChange }) => {
  const categories = MARKETPLACE_CATEGORIES.filter((cat) => cat.id !== 'all');

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Trend Kategoriler</h2>
      <div className={styles.strip}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
            >
              <div className={styles.iconBox} style={{ color: cat.color, backgroundColor: `${cat.color}1A` }}>
                <Icon size={28} />
              </div>
              <span className={styles.label}>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryStrip;

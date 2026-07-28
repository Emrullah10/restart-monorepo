import React from 'react';
import { Search } from 'lucide-react';
import { MARKETPLACE_CATEGORIES } from '../constants';
import styles from './MarketplaceSearchBar.module.scss';

export const MarketplaceSearchBar = ({ searchValue, onSearchChange, activeCategory, onCategoryChange }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBox}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="İlan, marka veya model ara..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.categoryNav}>
        {MARKETPLACE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`${styles.categoryBtn} ${isActive ? styles.categoryBtnActive : ''}`}
              style={isActive ? { backgroundColor: cat.color, borderColor: cat.color } : undefined}
            >
              <Icon size={16} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MarketplaceSearchBar;

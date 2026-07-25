import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './AuthTextField.module.scss';

export const AuthTextField = ({
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  isPassword = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={styles.container}>
      <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
        {Icon && <Icon className={styles.icon} size={20} />}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={styles.input}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default AuthTextField;

// spinner.js
import React from 'react';
import { AiOutlineLoading } from 'react-icons/ai';

const sizeClasses = {
  small: 'text-sm',
  base: 'text-xl',
  large: 'text-2xl',
  xl: 'text-[48px]',
};

const Spinner = ({ size = 'base', className = '' }) => {
  return (
    <AiOutlineLoading
      className={`animate-spin text-white ${sizeClasses[size]} ${className}`}
      aria-label="Loading spinner"
    />
  );
};

export default Spinner;
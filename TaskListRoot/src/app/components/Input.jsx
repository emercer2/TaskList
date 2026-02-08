'use client';

import { forwardRef } from 'react';

const base = `border-2 border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
  disabled:bg-gray-100 disabled:cursor-not-allowed`;

const Input = forwardRef(function Input({ as = 'input', className = '', ...props }, ref) {
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`${base} ${className}`}
      {...props}
    />
  );
});

export default Input;

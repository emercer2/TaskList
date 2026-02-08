'use client';

const variants = {
  primary: `bg-accent-600 text-white rounded-lg hover:bg-accent-700
    disabled:opacity-50 disabled:cursor-not-allowed transition-colors`,
  ghost: `text-sm text-gray-500 rounded-lg transition-all
    disabled:cursor-not-allowed`,
};

export default function Button({ as: Tag = 'button', variant = 'primary', className = '', children, ...props }) {
  return (
    <Tag
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

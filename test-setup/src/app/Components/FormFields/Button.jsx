function Button({ style = 'primary', size = 'md', type = 'button', text, onClick, disabled }) {
    const styleClasses = {
        primary: 'bg-blue-900 text-white',
        secondary: 'bg-gray-200 text-black',
        danger: 'bg-red-600 text-white'
    };

    const sizeClasses = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const basicClasses = 'rounded disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <div>
            <button type={type} disabled={disabled} className={`${styleClasses[style]} ${sizeClasses[size]} ${basicClasses}`} onClick={onClick}>{text}</button>
        </div>
    );
}

export default Button;
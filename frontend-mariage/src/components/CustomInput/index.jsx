import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const CustomInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
  inputClassName = '',
  labelClassName = '',
  as = 'input',
  rows = 3,
  Icon,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const Field = as === 'textarea' ? 'textarea' : 'input';

  const fieldType = isPassword && showPassword ? 'text' : type;
  const hasLeftIcon = Boolean(Icon);
  const hasRightIcon = isPassword;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`mb-2 block font-medium ${
            labelClassName.includes('text-') ? '' : 'text-[#F7EBD2]'
          } ${labelClassName}`}
        >
          {label
        }</label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/80" size={18} />
        )}

        <Field
          id={name}
          name={name}
          type={Field === 'input' ? fieldType : undefined}
          rows={Field === 'textarea' ? rows : undefined}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border outline-none transition-colors focus:ring-2 ${
            inputClassName.includes('border-') ? '' : 'border-champagne'
          } ${
            inputClassName.includes('bg-') ? '' : 'bg-[#100E16]'
          } ${
            inputClassName.includes('text-') ? '' : 'text-[#F7EBD2]'
          } ${
            inputClassName.includes('placeholder:') ? '' : 'placeholder:text-[#F7EBD2]/40'
          } ${
            inputClassName.includes('focus:border-') ? '' : 'focus:border-gold'
          } ${
            inputClassName.includes('focus:ring-') ? '' : 'focus:ring-gold/25'
          } py-3 ${
            hasLeftIcon ? 'pl-11' : 'pl-4'
          } ${hasRightIcon ? 'pr-11' : 'pr-4'} ${Field === 'textarea' ? 'resize-none' : ''} ${
            error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
          } ${inputClassName}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F7EBD2]/60 transition-colors hover:text-gold"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-sm font-medium text-red-300">{error}</p>}
    </div>
  );
};

export default CustomInput;

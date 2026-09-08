import React from 'react';
import CustomInput from '../../../components/CustomInput';

const Field = ({ label, value, onChange, textarea = false, type = 'text', name }) => (
  <CustomInput
    label={label}
    name={name || label}
    type={type}
    value={value || ''}
    onChange={(event) => onChange(event.target.value)}
    as={textarea ? 'textarea' : 'input'}
    rows={textarea ? 5 : undefined}
    labelClassName="text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"
    inputClassName={`${textarea ? 'min-h-[8.75rem] resize-y' : 'h-12'} border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white dark:border-[#344458] dark:bg-[#101923] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-gold dark:focus:bg-[#142131]`}
  />
);

export default Field;

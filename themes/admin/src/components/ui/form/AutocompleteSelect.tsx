import React, { useId } from 'react';
import ReactSelect, { type Props as ReactSelectProps } from 'react-select';
import { FieldWrapper } from './FieldWrapper';

export interface AutocompleteSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface AutocompleteSelectProps extends Omit<ReactSelectProps<AutocompleteSelectOption, false>, 'options'> {
  label?: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
  options: AutocompleteSelectOption[];
}

export const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
  label,
  description,
  error,
  required,
  wrapperClassName = '',
  id,
  options,
  ...props
}) => {
  const uniqueId = useId();
  const selectId = id || props.name || uniqueId;

  return (
    <FieldWrapper
      label={label}
      description={description}
      error={error}
      required={required}
      htmlFor={selectId}
      className={wrapperClassName}
    >
      <ReactSelect
        id={selectId}
        options={options}
        isOptionDisabled={(option) => !!option.disabled}
        classNamePrefix="react-select"
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: 'transparent',
            borderColor: error ? '#ef4444' : (state.isFocused ? '#3b82f6' : 'var(--border-color)'),
            borderRadius: '0.5rem',
            padding: '2px',
            boxShadow: state.isFocused ? (error ? '0 0 0 1px #ef4444' : '0 0 0 1px #3b82f6') : 'none',
            '&:hover': {
              borderColor: error ? '#ef4444' : (state.isFocused ? '#3b82f6' : '#9ca3af'),
            },
            minHeight: '42px',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            borderRadius: '0.5rem',
            zIndex: 50,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? '#3b82f6'
              : state.isFocused
                ? 'var(--bg-hover)'
                : 'transparent',
            color: state.isSelected ? '#ffffff' : 'var(--text-main)',
            cursor: state.isDisabled ? 'not-allowed' : 'default',
            '&:active': {
              backgroundColor: state.isSelected ? '#3b82f6' : 'var(--bg-hover)',
            },
          }),
          singleValue: (base) => ({
            ...base,
            color: 'var(--text-main)',
          }),
          input: (base) => ({
            ...base,
            color: 'var(--text-main)',
          }),
        }}
        {...props}
      />
    </FieldWrapper>
  );
};

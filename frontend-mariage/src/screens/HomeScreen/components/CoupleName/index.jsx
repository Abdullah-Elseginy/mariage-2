import React from 'react';

const CoupleName = ({ value = '', ampersandClassName = '', className = '', as: Tag = 'span' }) => {
  const parts = String(value).split(/(&)/g);

  return (
    <Tag className={`break-words whitespace-pre-wrap ${className}`.trim()}>
      {parts.map((part, index) => {
        if (part === '&') {
          return (
            <span key={`amp-${index}`} className={ampersandClassName}>
              {part}
            </span>
          );
        }

        return <React.Fragment key={`part-${index}`}>{part}</React.Fragment>;
      })}
    </Tag>
  );
};

export default CoupleName;

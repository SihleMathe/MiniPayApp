import React, { useMemo, useCallback } from 'react';

type Props = {
  title: string;
  onClick: () => void;
  widthFull?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

const PrimaryButton: React.FC<Props> = ({
  title,
  onClick,
  widthFull = false,
  disabled,
  loading,
  className = "",
}) => {

  const isDisabled = useMemo(() => {
    return disabled ?? loading;
  }, [disabled, loading]);

  const buttonClasses = useMemo(() => {
    let classes = `${className} font-bold bg-indigo-500 rounded-2xl text-white py-3 flex justify-center items-center`;
    classes += widthFull ? ' w-full' : ' px-4';
    return classes;
  }, [className, widthFull]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled) {
      onClick();
    }
  }, [isDisabled, onClick]);

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={buttonClasses}
    >
      {loading ? <>Loading...</> : title}
    </button>
  );
}

export default PrimaryButton;


import React from 'react';
import styled from 'styled-components';

interface GlowPillButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'dark' | 'orange';
}

export const GlowPillButton: React.FC<GlowPillButtonProps> = ({
  children = 'Button',
  onClick,
  className,
  variant = 'orange',
}) => {
  return (
    <StyledWrapper $variant={variant} className={className}>
      <button type="button" onClick={onClick} className="btn">
        {children}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $variant: string }>`
  display: inline-block;

  .btn {
    position: relative;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    padding: 0.75em 1.8em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    cursor: pointer;
    border-radius: 9999px;
    transition: all 0.25s ease;
    border: none;
    font-family: inherit;
    color: ${(props) => (props.$variant === 'dark' ? '#ffffff' : '#ffffff')};
    background-color: ${(props) =>
      props.$variant === 'orange' ? '#F97316' : props.$variant === 'dark' ? '#123C69' : '#0284C7'};
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px
      ${(props) =>
        props.$variant === 'orange'
          ? 'rgba(249, 115, 22, 0.4)'
          : props.$variant === 'dark'
          ? 'rgba(18, 60, 105, 0.35)'
          : 'rgba(2, 132, 199, 0.35)'};
  }

  .btn:active {
    transform: translateY(0px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .btn::after {
    content: '';
    display: inline-block;
    height: 100%;
    width: 100%;
    border-radius: 9999px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    transition: all 0.4s ease;
    background-color: ${(props) =>
      props.$variant === 'orange' ? '#F97316' : props.$variant === 'dark' ? '#123C69' : '#0284C7'};
  }

  .btn:hover::after {
    transform: scaleX(1.3) scaleY(1.5);
    opacity: 0;
  }
`;

export default GlowPillButton;

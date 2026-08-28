import React from 'react';
import styled from 'styled-components';

interface FlipThanksButtonProps {
  initialText?: string;
  hoverText?: string;
  onClick?: () => void;
  className?: string;
  primaryColor?: string;
}

export const FlipThanksButton: React.FC<FlipThanksButtonProps> = ({
  initialText = 'Confirm Issue',
  hoverText = '✓ Thanks!',
  onClick,
  className,
  primaryColor = '#F97316',
}) => {
  return (
    <StyledWrapper $primaryColor={primaryColor} className={className}>
      <button
        type="button"
        onClick={onClick}
        className="button type1"
        data-initial={initialText}
        data-hover={hoverText}
      />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $primaryColor: string }>`
  display: inline-block;

  .button {
    height: 44px;
    width: 140px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease-in-out;
    background: transparent;
  }

  .button:hover {
    box-shadow: 0 8px 24px rgba(249, 115, 22, 0.25);
  }

  .type1::after {
    content: attr(data-hover);
    height: 44px;
    width: 140px;
    background-color: #15803d;
    color: #ffffff;
    position: absolute;
    top: 0%;
    left: 0%;
    transform: translateY(44px);
    font-size: 0.85rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s ease-in-out;
    border-radius: 12px;
  }

  .type1::before {
    content: attr(data-initial);
    height: 44px;
    width: 140px;
    background-color: ${(props) => props.$primaryColor};
    color: #ffffff;
    position: absolute;
    top: 0%;
    left: 0%;
    transform: translateY(0px) scale(1);
    font-size: 0.85rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s ease-in-out;
    border-radius: 12px;
  }

  .type1:hover::after {
    transform: translateY(0) scale(1);
  }

  .type1:hover::before {
    transform: translateY(-44px) scale(0.8) rotate(15deg);
  }
`;

export default FlipThanksButton;

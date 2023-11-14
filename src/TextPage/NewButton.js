import React from 'react';
import './Button.css';

const NavigationButtons = ({ buttonName, position, onHomeClick, onBackClick }) => {
    const adjustedTopPosition = position.y - 360;
    const adjustedLeftPosition = position.x - 25;

    return (
        <div className="NewButton" style={{ position: 'absolute', left: adjustedLeftPosition, top: adjustedTopPosition }}>
            <button onClick={onHomeClick} style={{ marginRight: '15px' }}>메인</button>
            {/*<button onClick={onBackClick}>뒤로가기</button>*/}
            <button onClick={onBackClick}>뒤로가기</button>
        </div>
    );
};

export default NavigationButtons;
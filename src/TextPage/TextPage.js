import React, { useState, useEffect, useRef } from 'react';
import NavigationButtons from './NewButton';
const App = () => {
    const [canvasPosition, setCanvasPosition] = useState({ left: 0, top: 0 });
    const [clickedButtonName, setClickedButtonName] = useState(null);
    const canvasScale = 1;
    const cSize = 100;
    const buttonNames = ['a', 'b', 'c', 'd', 'e'];
    const list1 = buttonNames.map((name, index) => ({
        name,
        x: (index + 1) * 300,
        y: (index + 1) * 100,
        level: 0
    }));

    const [history, setHistory] = useState([]);
  const [showNavigation, setShowNavigation] = useState(false);
  const [navigationPosition, setNavigationPosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        console.log("이동이 완료되었습니다.");
    }, [canvasPosition]);
    const generateRandomList = (length, min, max) => {
        return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    };
    const list2 = generateRandomList(6, 1, 100);
    const [buttons, setButtons] = useState(list1);
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);
    const handleButtonClick = (name, x, y) => {
        // Save current state to history before making changes
        setHistory(prevHistory => [
            ...prevHistory, 
            { 
                buttons: buttons.map(button => ({ ...button })),
                canvasPosition, 
                clickedButtonName, 
                showNavigation,
                navigationPosition  // 이 부분을 추가합니다.
            }
        ]);
        
        document.body.style.overflow = 'hidden';
        const clickedButton = buttons.find(button => button.name === name);
        
        setClickedButtonName(name);
        
        const centerX = x + cSize / 2;
        const centerY = y + cSize / 2;
      
        // 클릭된 버튼의 중심 좌표를 로그합니다.
        console.log(`클릭된 버튼의 중심 좌표: (${centerX}, ${centerY})`);
      
        // 클릭된 버튼만 남기고 모든 다른 버튼을 제거합니다.
        // setButtons([clickedButton]); // 이전 코드를 주석처리하거나 삭제합니다.
        
        // Add only the clicked button and the random buttons.
        const initialNewButtons = list2.map((item, index) => ({
          name: item,
          x: centerX - cSize / 2,
          y: centerY - cSize / 2,
          transitioning: true,
        }));
      
        // 새로운 버튼들을 상태에 추가합니다.
        setButtons([clickedButton, ...initialNewButtons]);
      
        // 캔버스의 위치를 조정합니다.
        setCanvasPosition({
          left: (window.innerWidth / 2 - centerX) * canvasScale,
          top: (window.innerHeight / 2 - centerY) * canvasScale
        });

        // 네비게이션 위치 설정
        setNavigationPosition({ x, y });

      // 3초 후에 새로운 버튼 목록으로 업데이트
      setTimeout(() => {
        const newButtons = list2.map((item, index) => {
          const position = calcButtonPosition(x, y, index);
          return { name: item, x: position.x, y: position.y };
        });
        setButtons([clickedButton, ...newButtons]);
      
        
        setShowNavigation(true);
      }, 1000); 
  };
    const calcButtonPosition = (x, y, index) => {
        const size = cSize;
        switch (index) {
            case 0: return { x: x + size * 8, y: y - size * 3 };
            case 1: return { x: x + size * 8, y };
            case 2: return { x: x + size * 8, y: y + size * 3 };
            case 3: return { x: x - size * 8, y: y - size * 3 };
            case 4: return { x: x - size * 8, y };
            case 5: return { x: x - size * 8, y: y + size * 3 };
            default: return { x, y };
        }
    };

    //HOME버튼
    const handleHomeClick = () => {
    setButtons(list1); // 초기 버튼 리스트로 설정
    setCanvasPosition({ left: 0, top: 0 }); // 캔버스 위치 초기화
    setShowNavigation(false); // 네비게이션 숨김
    setClickedButtonName(null); // 클릭된 버튼 상태를 초기화

    };

    const handleBackClick = () => {
        console.log('뒤로 가기 버튼 클릭됨', history);
        if (history.length > 0) {
            const lastHistoryState = history[history.length - 1];
    
            // 히스토리에서 상태 복원
            setButtons(lastHistoryState.buttons);
            setCanvasPosition(lastHistoryState.canvasPosition);
            setClickedButtonName(lastHistoryState.clickedButtonName);
            setShowNavigation(lastHistoryState.showNavigation);
            setNavigationPosition(lastHistoryState.navigationPosition); // 이 부분을 추가합니다.
    
            // 히스토리 업데이트 (비동기적으로 할 필요가 없으므로 setTimeout을 제거했습니다)
            setHistory(prevHistory => prevHistory.slice(0, prevHistory.length - 1));
        } else {
            console.log("더 이상 뒤로 갈 수 없습니다.");
            setShowNavigation(true); // 더 이상 뒤로 갈 수 없다면 네비게이션을 표시합니다.
        }
    };
      
    
    
    return (
        <div style={{
            position: 'relative',
            transform: `translate(${canvasPosition.left}px, ${canvasPosition.top}px) scale(${canvasScale})`,
            transition: 'transform 0.5s ease-in-out'
        }}>
            <canvas ref={canvasRef} style={{ position: 'absolute', zIndex: -1 }} />
            {
    buttons.map((item, index) => (
        <button
            key={index}
            onClick={() => handleButtonClick(item.name, item.x, item.y)}
            style={{
                position: 'absolute',
                borderRadius: item.name === clickedButtonName ? '25%' :'50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: item.name === clickedButtonName ? 'skyblue' : 'gray',
                
                transition: 'background-color 0.5s ease-in-out, width 1s ease-in-out, height 1s ease-in-out, left 1s ease-in-out, top 1s ease-in-out',
                width: item.name === clickedButtonName ? `${cSize * 13}px` : `${cSize}px`,
                height: item.name === clickedButtonName ? `${cSize * 8}px` : `${cSize}px`,
                
                left: item.name === clickedButtonName ? `${item.x - cSize * 6}px` : `${item.x}px`,
                top: item.name === clickedButtonName ? `${item.y - cSize * 3.5}px` : `${item.y}px`,
            }}
        >
            {item.name}
        </button>
    ))
}
 {showNavigation && (
        <NavigationButtons
          buttonName={clickedButtonName}
          position={navigationPosition}
          onHomeClick={handleHomeClick}
          onBackClick={handleBackClick}
        />
      )}
    </div>
        
    );
};
export default App;
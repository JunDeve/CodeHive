import React, { useState, useEffect, useRef } from 'react';

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
        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 10;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);
    const handleButtonClick = (name, x, y, level) => {
        const newButtons = list2.map((item, index) => {
            const position = calcButtonPosition(x, y, index, level);
            return { name: item, x: position.x, y: position.y, level: level + 1 };
        });
        const clickedButton = buttons.find(button => button.name === name);
        setClickedButtonName(name);
        const centerX = x + cSize / 2;
        const centerY = y + cSize / 2;
        console.log(`클릭된 버튼의 중심 좌표: (${centerX}, ${centerY})`);
        setButtons([clickedButton, ...newButtons]); // 새로운버튼
        setCanvasPosition({
            left: (window.innerWidth / 2 - centerX) * canvasScale,
            top: (window.innerHeight / 2 - centerY) * canvasScale
        }); 
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
    return (

        
        <div style={{
            position: 'relative',
            transform: `translate(${canvasPosition.left}px, ${canvasPosition.top}px) scale(${canvasScale})`,
            transition: 'transform 0.5s ease-in-out'
        }}>
            <canvas ref={canvasRef} style={{ position: 'absolute', zIndex: -1 }} />
            {buttons.map((item, index) => (
                <button
                    key={index}
                    onClick={() => handleButtonClick(item.name, item.x, item.y, item.level)}
                    style={{
                        position: 'absolute',
                        left: item.name === clickedButtonName ? `${item.x-cSize*3.5}px`:`${item.x}px`,
                        top: item.name === clickedButtonName ? `${item.y-cSize*3.5}px`:`${item.y}px`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: item.name === clickedButtonName ? 'skyblue' : 'gray',
                        transition: 'background-color 0.5s ease-in-out, transform 0.5s ease-in-out ',
                        width: item.name === clickedButtonName ? `${cSize*8}px`:`${cSize}px`,
                        height: item.name === clickedButtonName ? `${cSize*8}px`:`${cSize}px`,
                    }}
                >
                    {item.name}
                </button>
            ))}


            
        </div>
        
        
    );
};
export default App;








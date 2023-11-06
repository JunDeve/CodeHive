import React, { useRef, useEffect, useState } from 'react';
import './Searchmain.css';

const INITIAL_POSITION = { x: 0, y: 0 };
const ZOOM_SPEED = 2;
const ZOOM_SPEED2 = 32;

function Searchmain({ items, sevaitemList }) {
  const zoomCanvasRef = useRef(null);
  const scaleRef = useRef(1);
  const viewPosRef = useRef(INITIAL_POSITION);
  const circlesRef = useRef([]);
  const zoomedCircleIdRef = useRef(null);
  const colorList = ["red", "green", "blue", "yellow", "pink", "orange", "purple"];
  const [searchValue, setSearchValue] = useState()
  const [color, setColor] = useState()
  useEffect(() => {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    circlesRef.current = [
      { id: 1, x: canvasWidth / 3, y: canvasHeight / 2 - 60, text: items[0], color: colorList[0], isSquare: false },
      { id: 2, x: canvasWidth / 2, y: canvasHeight / 2, text: items[1], color: colorList[1], isSquare: false },
      { id: 3, x: canvasWidth / 1.5, y: canvasHeight / 2 + 60, text: items[2], color: colorList[2], isSquare: false },
      { id: 4, x: canvasWidth / 4, y: canvasHeight / 2, text: items[3], color: colorList[3], isSquare: false },
      { id: 5, x: canvasWidth / 5, y: canvasHeight / 2 + 60, text: items[4], color: colorList[4], isSquare: false },
      { id: 6, x: canvasWidth / 6, y: canvasHeight / 3, text: items[5], color: colorList[5], isSquare: false },
      { id: 7, x: canvasWidth / 7, y: canvasHeight / 2 - 30, text: items[6], color: colorList[6], isSquare: false }
    ];
    drawCircles();
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  const setTransform = () => {
    const zoomCanvas = zoomCanvasRef.current;
    const context = zoomCanvas.getContext('2d');
    context.setTransform(
      scaleRef.current,
      0,
      0,
      scaleRef.current,
      viewPosRef.current.x,
      viewPosRef.current.y
    );
  };
  const drawCircles = () => {
    const zoomCanvas = zoomCanvasRef.current;
    const context = zoomCanvas.getContext('2d');
    zoomCanvas.width = window.innerWidth;
    zoomCanvas.height = window.innerHeight;
    setTransform();
    context.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);

    circlesRef.current.forEach((circle) => {
      if (zoomedCircleIdRef.current === circle.id) {
        const containerWidth = 230;
        const containerHeight = 100;
        const containerX = circle.x - containerWidth / 2;
        const containerY = circle.y + 100;
        context.fillStyle = 'black';
        context.fillRect(containerX, containerY, containerWidth, containerHeight);
      }
      sevaitemList.forEach((text, index) => {
        if (zoomedCircleIdRef.current === circle.id) {
          const containerWidth = 30;
          const containerHeight = 20;
          let containerX;
          let containerY;

          if (index < 4) {
            containerX = circle.x - 110;
            containerY = circle.y - 55 + (index * 25);
          } else {
            containerX = circle.x + 80;
            containerY = circle.y - 55 + ((index - 4) * 25);
          }
          context.fillStyle = 'rgba(158, 151, 140, 0.425)';
          context.fillRect(containerX, containerY, containerWidth, containerHeight);
          context.font = '12px Arial';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(text, containerX + containerWidth / 2, containerY + containerHeight / 2);
        }
      });

      context.fillStyle = circle.color;
      if (circle.isSquare) {
        const cornerRadius = 20;
        const width = 130;
        const height = 100;
        context.beginPath();
        context.moveTo(circle.x - width / 2 + cornerRadius, circle.y - height / 2);
        context.lineTo(circle.x + width / 2 - cornerRadius, circle.y - height / 2);
        context.quadraticCurveTo(circle.x + width / 2, circle.y - height / 2, circle.x + width / 2, circle.y - height / 2 + cornerRadius);
        context.lineTo(circle.x + width / 2, circle.y + height / 2 - cornerRadius);
        context.quadraticCurveTo(circle.x + width / 2, circle.y + height / 2, circle.x + width / 2 - cornerRadius, circle.y + height / 2);
        context.lineTo(circle.x - width / 2 + cornerRadius, circle.y + height / 2);
        context.quadraticCurveTo(circle.x - width / 2, circle.y + height / 2, circle.x - width / 2, circle.y + height / 2 - cornerRadius);
        context.lineTo(circle.x - width / 2, circle.y - height / 2 + cornerRadius);
        context.quadraticCurveTo(circle.x - width / 2, circle.y - height / 2, circle.x - width / 2 + cornerRadius, circle.y - height / 2);
        context.closePath();
        context.fill();
      } else {
        context.beginPath();
        context.arc(circle.x, circle.y, 50, 0, Math.PI * 2);
        context.fill();
      }
      context.font = "16px Arial";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(circle.text, circle.x, circle.y);
    });
  };
  const createButtons = (circle) => {
    if (!circle) return;
    console.log('Creating buttons for:', circle.text);
    const leftItems = sevaitemList.slice(0, 4);
    const rightItems = sevaitemList.slice(4);
    leftItems.forEach((text, index) => {
      const button = document.createElement('button');
      button.innerText = text;
      button.id = `leftButton${index}`;
      button.style.position = 'absolute';
      button.style.left = '10%';
      button.style.top = `${200 + (index * 200)}px`;
      button.style.transform = 'translate(-50%, -50%)';
      button.style.background = "rgba(134, 160, 202, 0.568)";
      button.style.width = "300px";
      button.style.height = "15vh";
      button.addEventListener('click', function () {
        const buttonId = button.id;
        console.log(`${buttonId} 버튼이 클릭되었습니다.`);
        const zoomedCircle = circlesRef.current.find(circle => circle.id === zoomedCircleIdRef.current);
        if (zoomedCircle) {
          let offsetX, offsetY;
          switch (buttonId) {
            case 'leftButton0':
              offsetX = -95;
              offsetY = -45;
              break;
            case 'leftButton1':
              offsetX = -95;
              offsetY = -20;
              break;
            case 'leftButton2':
              offsetX = -95;
              offsetY =  15;
              break;
            case 'leftButton3':
              offsetX = -95;
              offsetY =  40;
              break;
          }
          const centerX = zoomedCircle.x + offsetX;
          const centerY = zoomedCircle.y + offsetY;
          moveToCenterAnimation(centerX, centerY)
          removeButtons();
          const newScale = scaleRef.current * 5;
          handleZoom(newScale ,centerX, centerY);
          createButtons()
        }
      });
      document.body.appendChild(button);
    });

    rightItems.forEach((text, index) => {
      const button = document.createElement('button');
      button.innerText = text;
      button.id = `rightButton${index}`; 
      button.style.position = 'absolute';
      button.style.right = '10%';
      button.style.top = `${200 + (index * 200)}px`;
      button.style.transform = 'translate(50%, -50%)';
      button.style.background = "rgba(134, 160, 202, 0.568)";
      button.style.width = "300px";
      button.style.height = "15vh";
      button.addEventListener('click', function () {
        const buttonId = button.id;
        console.log(`${buttonId} 버튼이 클릭되었습니다.`);
        const zoomedCircle = circlesRef.current.find(circle => circle.id === zoomedCircleIdRef.current);
        if (zoomedCircle)  {
          let offsetX, offsetY;
          switch (buttonId) {
            case 'rightButton0':
              offsetX = 95; 
              offsetY = -45; 
              break;
            case 'rightButton1':
              offsetX = 95; 
              offsetY = -20; 
              break;
            case 'rightButton2':
              offsetX = 95; 
              offsetY = 15; 
              break;
            case 'rightButton3':
              offsetX = 95; 
              offsetY = 40; 
              break;
          }
          const centerX = zoomedCircle.x + offsetX;
          const centerY = zoomedCircle.y + offsetY;
          moveToCenterAnimation(centerX, centerY).then(() => {
            removeButtons();
          });
        }
      });
      document.body.appendChild(button);
    });
  };
  const handleZoom = async (newScale, centerX, centerY) => {
    return new Promise((resolve) => {
      const zoom = () => {
        if (Math.abs(scaleRef.current - newScale) < ZOOM_SPEED) {
          scaleRef.current = newScale;
          viewPosRef.current = {
            x: window.innerWidth / 2 - centerX * newScale,
            y: window.innerHeight / 2 - centerY * newScale,
          };
          drawCircles();
  
          // 확대가 완료되면 HOME 버튼을 표시합니다.
          if (newScale > 1 && !document.querySelector('.home-button')) {
            createHomeButton();
          }
  
          resolve();
        } else {
          const scaleDiff = newScale - scaleRef.current;
          scaleRef.current += scaleDiff > 0 ? ZOOM_SPEED : -ZOOM_SPEED;
          viewPosRef.current = {
            x: window.innerWidth / 2 - centerX * scaleRef.current,
            y: window.innerHeight / 2 - centerY * scaleRef.current,
          };
  
          drawCircles();
          requestAnimationFrame(zoom);
        }
      };
      requestAnimationFrame(zoom);
    });
  };

  const moveToCenterAnimation = async (centerX, centerY) => {
    return new Promise((resolve) => {
      const move = () => {
        const targetX = window.innerWidth / 2 - centerX * scaleRef.current;
        const targetY = window.innerHeight / 2 - centerY * scaleRef.current;
        const deltaX = targetX - viewPosRef.current.x;
        const deltaY = targetY - viewPosRef.current.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance < ZOOM_SPEED2) {
          viewPosRef.current.x = targetX;
          viewPosRef.current.y = targetY;
          drawCircles();
          resolve();
        } else {
          const angle = Math.atan2(deltaY, deltaX);
          const moveX = Math.cos(angle) * ZOOM_SPEED2;
          const moveY = Math.sin(angle) * ZOOM_SPEED2;
          viewPosRef.current.x += moveX;
          viewPosRef.current.y += moveY;
          drawCircles();
          requestAnimationFrame(move);
        }
      };
      requestAnimationFrame(move);
    });
  };
  const handleClick = async (e) => {
    const zoomCanvas = zoomCanvasRef.current;
    const rect = zoomCanvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - viewPosRef.current.x) / scaleRef.current;
    const clickY = (e.clientY - rect.top - viewPosRef.current.y) / scaleRef.current;

    const clickedCircle = circlesRef.current.find((circle) => {
      const dx = clickX - circle.x;
      const dy = clickY - circle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= 50;
    });


    if (clickedCircle && zoomedCircleIdRef.current !== clickedCircle.id) {
      zoomedCircleIdRef.current = clickedCircle.id;
      const centerX = clickedCircle.x;
      const centerY = clickedCircle.y;
      scaleRef.current = 1;
      await moveToCenterAnimation(centerX, centerY);

      if (clickedCircle) {
        clickedCircle.isSquare = true;
        drawCircles();
        await handleZoom(scaleRef.current * 8, centerX, centerY);
        console.log('Zoom In:', clickedCircle);
        setColor(clickedCircle.color);
        createButtons(clickedCircle);
      }
    }
  };
  
  const removeButtons = () => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (button.parentNode) {
        button.parentNode.removeChild(button);
      }
    });
  };

  const handleScroll = (event) => {
    if (scaleRef.current > 1) {
      const zoomedCircle = circlesRef.current.find(circle => circle.id === zoomedCircleIdRef.current);
      if (zoomedCircle) {
        if (event.deltaY > 0) {
          const centerX = zoomedCircle.x;
          const centerY = zoomedCircle.y + 150;
          moveToCenterAnimation(centerX, centerY);
          console.log('휠을 아래로 내리셨습니다.');
          removeButtons();
        } else {
          const centerX = zoomedCircle.x;
          const centerY = zoomedCircle.y;
          moveToCenterAnimation(centerX, centerY).then(() => {
            createButtons(zoomedCircle);
          });
          console.log('휠을 위로 올리셨습니다.');
        }
      }
    }
  };

   // HOME 버튼을 생성하고 해당 버튼이 클릭되면 zoom을 리셋하는 함수를 만듭니다.
   const createHomeButton = () => {
    let button = document.querySelector('.home-button');
    if (!button) {
      button = document.createElement('button');
      button.classList.add('home-button'); // Add a class for easy selection
      button.innerText = 'HOME';

      button.addEventListener('click', resetZoom);
      document.body.appendChild(button);
    } else {
      button.style.display = 'block'; // Make the button visible if it was hidden
    }
  };

  
const removeHomeButton = () => {
  const button = document.querySelector('.home-button');
  if (button) {
    button.style.display = 'none'; // Hide the button
  }
};

// zoom을 리셋하는 함수입니다.
const resetZoom = async () => {
  if (zoomedCircleIdRef.current) {
    const zoomedCircle = circlesRef.current.find((circle) => circle.id === zoomedCircleIdRef.current);
    if (zoomedCircle) {
      // 기존에 확대된 상태를 초기화합니다.
      await handleZoom(1, zoomedCircle.x, zoomedCircle.y);
      zoomedCircle.isSquare = false;
      drawCircles();
      zoomedCircleIdRef.current = null;
      await moveToCenterAnimation(window.innerWidth / 2, window.innerHeight / 2);
      removeButtons();
    }
  }

}; 
  return (
    <div className="SearchMainHome">
      <div className="SearchLogo">Logo</div>
      <canvas
        ref={zoomCanvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ border: 'none' }}
        onClick={handleClick}
        onWheel={handleScroll}
      />
    </div>
  );
}

export default Searchmain;

import React from 'react';

function ZoomButtons({ createButtons, removeButtons }) {
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
      const removeButtons = () => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
          if (button.parentNode) {
            button.parentNode.removeChild(button);
          }
        });
      };
    
  return (
    <div>
     {leftItems.map((text, index) => (
  <button
    key={`leftButton${index}`}
    id={`leftButton${index}`}
    style={{
      position: 'absolute',
      left: '10%',
      top: `${200 + index * 200}px`,
      transform: 'translate(-50%, -50%)',
      background: 'rgba(134, 160, 202, 0.568)',
      width: '300px',
      height: '15vh',
    }}
    onClick={() => handleLeftButtonClick(index)}
  >
    {text}
  </button>
))}

{rightItems.map((text, index) => (
  <button
    key={`rightButton${index}`}
    id={`rightButton${index}`}
    style={{
      position: 'absolute',
      right: '10%',
      top: `${200 + index * 200}px`,
      transform: 'translate(50%, -50%)',
      background: 'rgba(134, 160, 202, 0.568)',
      width: '300px',
      height: '15vh',
    }}
    onClick={() => handleRightButtonClick(index)}
  >
    {text}
  </button>
))}    </div>
  );
}

export default ZoomButtons;
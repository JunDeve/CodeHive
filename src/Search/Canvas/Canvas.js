
function CanvasComponent({ items, sevaitemList, handleClick, handleScroll }) {
  const zoomCanvasRef = useRef(null);
  const scaleRef = useRef(1);
  const viewPosRef = useRef(INITIAL_POSITION);
  const circlesRef = useRef([]);
  const zoomedCircleIdRef = useRef(null);
  const colorList = ["red", "green", "blue", "yellow", "pink", "orange", "purple"];
  const [searchValue, setSearchValue] = useState();
  const [color, setColor] = useState();

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
  return (
    <canvas
      ref={zoomCanvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ border: 'none' }}
      onClick={handleClick}
      onWheel={handleScroll}
    />
  );
}
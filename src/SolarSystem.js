import React, { useState, useEffect } from 'react';
import './SolarSystem.css';
const SolarSystem = () => {
  const planets = [
    { name: 'Sun', diameter: 100, color: 'yellow', rotationSpeed: 0 },
    { name: 'Mercury', diameter: 20, color: '#BFBFBF', rotationSpeed: 1.1 },
    { name: 'Venus', diameter: 30, color: '#FCD12A', rotationSpeed: 1.08 },
    { name: 'Earth', diameter: 40, color: '#0074CC', rotationSpeed: 1.05 },
    { name: 'Mars', diameter: 36, color: '#FF5733', rotationSpeed: 1.03 },
    { name: 'Jupiter', diameter: 50, color: '#D2B48C', rotationSpeed: 1.01 },
    { name: 'Saturn', diameter: 45, color: '#DEB887', rotationSpeed: 1.008 },
    { name: 'Uranus', diameter: 30, color: '#00A2E8', rotationSpeed: 1.007 },
    { name: 'Neptune', diameter: 28, color: '#00138E', rotationSpeed: 1.006 },
  ];
  const [rotation, setRotation] = useState(0);
  useEffect(() => {
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [rotation]);
  const animate = () => {
    setRotation(rotation + 0.1);
  };
  return (
    <div className="solar-system">
      {planets.map((planet, index) => {
        const orbitRadius = index * 50*2 + 100;
        const initialAngle = (index * 2 * Math.PI) / planets.length;
        const orbitX =
          Math.cos(rotation * planet.rotationSpeed + initialAngle) *
          orbitRadius;
        const orbitY =
          Math.sin(rotation * planet.rotationSpeed + initialAngle) *
          orbitRadius;
        return (
          <div
            key={index}
            className="planet"
            style={{
              width: `${planet.diameter *2}px`,
              height: `${planet.diameter *2}px`,
              backgroundColor: planet.color,
              transform: `translate(-50%, -50%) translate(${orbitX}px, ${orbitY}px) rotate(${
                rotation * planet.rotationSpeed
              }deg)`,
            }}
          >
            <div className="planet-name">{planet.name}</div>
          </div>
        );
      })}
    </div>
  );
};
export default SolarSystem;
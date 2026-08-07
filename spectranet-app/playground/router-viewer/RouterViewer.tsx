"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
const textColorMap: Record<string, string> = {
  "#e85d24": "#ffffff", // orange body -> white text
  "#1f2937": "#f97316", // dark body -> Spectranet orange text
  "#f3f4f6": "#1f2937", // light body -> dark text
  "#0ea5e9": "#ffffff", // blue body -> white text
};

function Router({
  color,
  ledOn,
}: {
  color: string;
  ledOn: boolean;
}) {
  const antennaRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (antennaRef.current) {
      antennaRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime) * 0.04;
    }
  });

  return (
    <group>
      {/* Main body — rounded for a premium product feel */}
      <RoundedBox args={[2, 0.45, 1.3]} radius={0.08} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.15} />
      </RoundedBox>
{/* Spectranet wordmark, printed on top of the device */}
      <Text
        position={[0, 0.24, 0.15]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.11}
        color={textColorMap[color] ?? "#ffffff"}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
        outlineWidth={0.008}
        outlineColor="#000000"
      >
        SPECTRANET
      </Text>
      
     
      {/* Antennas */}
      <group ref={antennaRef}>
        {[-0.6, 0.6].map((x) => (
          <mesh key={x} position={[x, 0.65, -0.4]} castShadow>
            <cylinderGeometry args={[0.025, 0.035, 0.7, 12]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.2} />
          </mesh>
        ))}
      </group>

      {/* LED indicator */}
      <mesh position={[-0.85, 0.24, 0.5]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={ledOn ? "#22c55e" : "#555"}
          emissive={ledOn ? "#22c55e" : "#000"}
          emissiveIntensity={ledOn ? 3 : 0}
        />
      </mesh>

      {/* Ports on the back */}
      {[-0.5, -0.2, 0.1, 0.4].map((x) => (
        <mesh key={x} position={[x, -0.05, -0.66]}>
          <boxGeometry args={[0.15, 0.09, 0.02]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function RouterViewer() {
  const [color, setColor] = useState("#e85d24");
  const [ledOn, setLedOn] = useState(true);

  const colors = ["#e85d24", "#1f2937", "#f3f4f6", "#0ea5e9"];

  return (
    <div className="max-w-xl mx-auto">
      <div
        className="w-full h-96 rounded-lg overflow-hidden border"
        style={{
          background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        <Canvas shadows camera={{ position: [3, 1.8, 3.2], fov: 38 }}>
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[3, 5, 2]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-3, 2, -2]} intensity={0.4} />
          <Router color={color} ledOn={ledOn} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <shadowMaterial opacity={0.25} />
          </mesh>
          <Environment preset="city" />
          <OrbitControls
            enablePan={false}
            minDistance={2.2}
            maxDistance={6}
            maxPolarAngle={Math.PI / 2.1}
            autoRotate
            autoRotateSpeed={1.5}
          />
        </Canvas>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Set color ${c}`}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                color === c ? "border-accent scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <button
          onClick={() => setLedOn(!ledOn)}
          className="text-sm border rounded-lg px-3 py-1.5 hover:bg-gray-50"
        >
          LED: {ledOn ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
}
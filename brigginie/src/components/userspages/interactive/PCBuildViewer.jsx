import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import { useMemo, useRef } from 'react';

function getGpuColor(gpu) {
    return gpu.name.toLowerCase().includes('radeon') ? '#ef4444' : '#22c55e';
}

function getCpuColor(cpu) {
    if (cpu.score >= 90) return '#fb923c';
    if (cpu.score >= 70) return '#facc15';
    return '#60a5fa';
}

function Fan({ position, rotation = [0, 0, 0], speed, color }) {
    const blades = useRef();
    useFrame((_, dt) => {
        if (blades.current) blades.current.rotation.z += dt * speed;
    });
    return (
        <group position={position} rotation={rotation}>
            <mesh>
                <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
                <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.4} />
            </mesh>
            <group ref={blades}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]} position={[0.1, 0, 0]}>
                        <boxGeometry args={[0.16, 0.02, 0.06]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
                    </mesh>
                ))}
            </group>
            <mesh position={[0, 0.025, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
                <meshStandardMaterial color="#e5e7eb" metalness={0.8} roughness={0.2} />
            </mesh>
        </group>
    );
}

function BuildScene({ gpu, cpu, fps, tier }) {
    const gpuColor = getGpuColor(gpu);
    const cpuColor = getCpuColor(cpu);
    const gpuLen = 1.15 + (gpu.score / 100) * 0.55;
    const gpuGlow = 0.25 + (gpu.score / 100) * 1.1;
    const fanSpeed = 1.2 + Math.min(fps, 300) / 70;
    const coolerH = 0.28 + (cpu.score / 100) * 0.28;

    const fpsColor = useMemo(() => tier?.color || '#f97316', [tier]);

    return (
        <group position={[0, -0.15, 0]} rotation={[0.08, -0.55, 0]}>
            {/* Case shell */}
            <mesh position={[0, 0, -0.72]}>
                <boxGeometry args={[2.05, 2.85, 0.08]} />
                <meshStandardMaterial color="#0b1220" metalness={0.7} roughness={0.35} />
            </mesh>
            <mesh position={[-1.02, 0, 0.05]}>
                <boxGeometry args={[0.08, 2.85, 1.5]} />
                <meshStandardMaterial color="#111827" metalness={0.65} roughness={0.4} />
            </mesh>
            <mesh position={[1.02, 0, 0.05]}>
                <boxGeometry args={[0.08, 2.85, 1.5]} />
                <meshStandardMaterial color="#111827" metalness={0.65} roughness={0.4} />
            </mesh>
            <mesh position={[0, 1.42, 0.05]}>
                <boxGeometry args={[2.12, 0.08, 1.5]} />
                <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, -1.42, 0.05]}>
                <boxGeometry args={[2.12, 0.08, 1.5]} />
                <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Glass side */}
            <mesh position={[0, 0, 0.78]}>
                <boxGeometry args={[1.95, 2.7, 0.03]} />
                <meshPhysicalMaterial
                    color="#94a3b8"
                    transparent
                    opacity={0.08}
                    roughness={0.05}
                    metalness={0.1}
                    transmission={0.6}
                    thickness={0.2}
                />
            </mesh>

            {/* Motherboard */}
            <mesh position={[-0.12, 0.05, -0.52]}>
                <boxGeometry args={[1.45, 2.05, 0.05]} />
                <meshStandardMaterial color="#14532d" metalness={0.35} roughness={0.55} />
            </mesh>

            {/* CPU + cooler */}
            <mesh position={[-0.2, 0.35, -0.42]}>
                <boxGeometry args={[0.28, 0.28, 0.06]} />
                <meshStandardMaterial color={cpuColor} emissive={cpuColor} emissiveIntensity={0.55} metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[-0.2, 0.35, -0.42 + coolerH / 2 + 0.04]}>
                <boxGeometry args={[0.42, 0.42, coolerH]} />
                <meshStandardMaterial color="#334155" metalness={0.75} roughness={0.25} />
            </mesh>

            {/* RAM */}
            {[0, 1, 2, 3].map((i) => (
                <mesh key={i} position={[0.22 + i * 0.09, 0.45, -0.35]}>
                    <boxGeometry args={[0.05, 0.55, 0.28]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.35} />
                </mesh>
            ))}
            {[0, 1, 2, 3].map((i) => (
                <mesh key={`rgb-${i}`} position={[0.22 + i * 0.09, 0.7, -0.35]}>
                    <boxGeometry args={[0.052, 0.04, 0.28]} />
                    <meshStandardMaterial color={fpsColor} emissive={fpsColor} emissiveIntensity={0.8} />
                </mesh>
            ))}

            {/* GPU */}
            <group position={[-0.05, -0.55, -0.05]}>
                <mesh>
                    <boxGeometry args={[gpuLen, 0.22, 0.72]} />
                    <meshStandardMaterial color="#18181b" metalness={0.7} roughness={0.3} />
                </mesh>
                <mesh position={[0, 0.13, 0]}>
                    <boxGeometry args={[gpuLen * 0.92, 0.03, 0.62]} />
                    <meshStandardMaterial color={gpuColor} emissive={gpuColor} emissiveIntensity={gpuGlow} />
                </mesh>
                <mesh position={[-gpuLen / 2 + 0.08, 0, 0.4]}>
                    <boxGeometry args={[0.08, 0.28, 0.18]} />
                    <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.15} />
                </mesh>
            </group>

            {/* PSU */}
            <mesh position={[0.15, -1.18, 0.05]}>
                <boxGeometry args={[1.55, 0.32, 1.05]} />
                <meshStandardMaterial color="#1f2937" metalness={0.55} roughness={0.4} />
            </mesh>

            <Fan position={[0.72, 0.85, -0.55]} speed={fanSpeed} color={fpsColor} />
            <Fan position={[0.72, 0.25, -0.55]} speed={fanSpeed * 0.92} color={fpsColor} />
            <Fan position={[0.72, -0.35, -0.55]} speed={fanSpeed * 1.08} color={fpsColor} />
            <Fan position={[0, 1.22, 0.1]} rotation={[Math.PI / 2, 0, 0]} speed={fanSpeed * 0.8} color={gpuColor} />

            <pointLight position={[0.2, 0.2, 1.1]} color={gpuColor} intensity={gpuGlow * 1.4} distance={4} />
            <pointLight position={[-0.2, 0.4, 0.4]} color={cpuColor} intensity={0.9} distance={2.4} />
            <pointLight position={[0.6, 0.4, 0.2]} color={fpsColor} intensity={0.7} distance={2.8} />

            <Html position={[0, 1.7, 0]} center distanceFactor={8} zIndexRange={[10, 0]}>
                <div className="pointer-events-none whitespace-nowrap rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                    {Math.round(fps)} AVG FPS · {tier?.label || ''}
                </div>
            </Html>
        </group>
    );
}

export default function PCBuildViewer({ gpu, cpu, fps = 60, tier }) {
    const safeGpu = gpu || { name: 'GeForce RTX', score: 70 };
    const safeCpu = cpu || { name: 'Ryzen 7', score: 80 };
    const safeTier = tier || { label: 'Good', color: '#f97316' };

    return (
        <div className="relative w-full h-[340px] sm:h-[420px] bg-gradient-to-b from-slate-950 to-black rounded-2xl overflow-hidden ring-1 ring-white/10">
            <Canvas camera={{ position: [3.2, 1.35, 3.4], fov: 40 }} dpr={[1, 1.75]}>
                <color attach="background" args={['#030712']} />
                <ambientLight intensity={0.35} />
                <spotLight position={[4, 6, 3]} intensity={1.2} angle={0.45} penumbra={0.6} />
                <Environment preset="city" />
                <BuildScene gpu={safeGpu} cpu={safeCpu} fps={fps} tier={safeTier} />
                <OrbitControls
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.7}
                    minDistance={2.8}
                    maxDistance={6.5}
                    minPolarAngle={0.6}
                    maxPolarAngle={1.45}
                />
            </Canvas>
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
                <div className="rounded-xl bg-black/55 backdrop-blur-sm px-3 py-2 text-white">
                    <p className="text-[10px] uppercase tracking-widest text-orange-400 font-bold">3D Build</p>
                    <p className="text-xs font-semibold truncate max-w-[180px] sm:max-w-xs">{safeGpu.name}</p>
                    <p className="text-[11px] text-gray-300 truncate max-w-[180px] sm:max-w-xs">{safeCpu.name}</p>
                </div>
                <p className="text-[10px] text-gray-400">Drag to rotate</p>
            </div>
        </div>
    );
}

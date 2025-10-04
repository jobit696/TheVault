import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as THREE from 'three';
import styles from '../../css/ConsoleScene.module.css';

function XboxModel({ onClick, isHovered }) {
    const { scene } = useGLTF('/3dmodels/xbox_series_x_console.glb');
    const groupRef = useRef();
    const targetVec = useRef(new THREE.Vector3());
    
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.scale.set(0.02, 0.02, 0.02);
        }
    }, []);
    
    useFrame((state, delta) => {
        if (!groupRef.current) return;
        
        const group = groupRef.current;
        const targetScale = isHovered ? 0.03 : 0.02;
        targetVec.current.set(targetScale, targetScale, targetScale);
        
        if (!isHovered) {
            group.rotation.y = (group.rotation.y + 0.01) % (Math.PI * 2);
        } else {
            group.rotation.y += (0.5 - group.rotation.y) * delta * 3;
        }
        
        group.scale.lerp(targetVec.current, delta * 5);
    });
    
    return (
        <group ref={groupRef} position={[0, 0, 0]} onClick={onClick}>
            <Center>
                <primitive 
                    object={scene} 
                    scale={0.8}
                    position={[0, -100, 0]}
                />
            </Center>
        </group>
    );
}

function PS5Model({ onClick, isHovered }) {
    const { scene } = useGLTF('/3dmodels/classic_ps5.glb');
    const groupRef = useRef();
    const targetVec = useRef(new THREE.Vector3());
    
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.scale.set(3, 3, 3);
        }
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        
        const group = groupRef.current;
        const targetScale = isHovered ? 5 : 3;
        targetVec.current.set(targetScale, targetScale, targetScale);
        
        if (!isHovered) {
            group.rotation.y = (group.rotation.y + 0.01) % (Math.PI * 2);
        } else {
            group.rotation.y += (0.7 - group.rotation.y) * delta * 3;
        }
        
        group.scale.lerp(targetVec.current, delta * 5);
    });
    
    return (
        <group ref={groupRef} position={[0, 0, 0]} onClick={onClick}>
            <Center>
                <primitive 
                    object={scene} 
                    scale={1}
                    position={[0, 24, 0]}
                />
            </Center>
        </group>
    );
}

function SwitchModel({ onClick, isHovered }) {
    const { scene } = useGLTF('/3dmodels/nintendo_switch.glb');
    const groupRef = useRef();
    const targetVec = useRef(new THREE.Vector3());
    
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.scale.set(1.5, 1.5, 1.5);
        }
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        
        const group = groupRef.current;
        const targetScale = isHovered ? 2.2 : 1.5;
        targetVec.current.set(targetScale, targetScale, targetScale);
        
        if (!isHovered) {
            group.rotation.y = (group.rotation.y + 0.01) % (Math.PI * 2);
        } else {
            group.rotation.y += (0.5 - group.rotation.y) * delta * 3;
        }
        
        group.scale.lerp(targetVec.current, delta * 5);
    });
    
    return (
        <group ref={groupRef} position={[0, 0, 0]} onClick={onClick}>
            <Center>
                <primitive 
                    object={scene} 
                    scale={1}
                    position={[0, 22, 0]}
                />
            </Center>
        </group>
    );
}

function GamingPCModel({ onClick, isHovered }) {
    const { scene } = useGLTF('/3dmodels/gaming_pc.glb');
    const groupRef = useRef();
    const targetVec = useRef(new THREE.Vector3());
    
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.scale.set(1, 1, 1);
        }
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        
        const group = groupRef.current;
        const targetScale = isHovered ? 1.5 : 1;
        targetVec.current.set(targetScale, targetScale, targetScale);
        
        if (!isHovered) {
            group.rotation.y = (group.rotation.y + 0.01) % (Math.PI * 2);
        } else {
            group.rotation.y += (4 - group.rotation.y) * delta * 3;
        }
        
        group.scale.lerp(targetVec.current, delta * 5);
    });
    
    return (
        <group ref={groupRef} position={[0, 0, 0]} onClick={onClick}>
            <Center>
                <primitive 
                    object={scene} 
                    scale={1}
                    position={[0, 22, 0]}
                />
            </Center>
        </group>
    );
}

function ResizeHandler() {
    const { gl, camera } = useThree();
    
    useEffect(() => {
        const handleResize = () => {
            const canvas = gl.domElement;
            const parent = canvas.parentElement;
            
            if (parent) {
                const width = parent.clientWidth;
                const height = parent.clientHeight;
                
                gl.setSize(width, height, false);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
        };

        let timeoutId;
        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, 50);
        };

        window.addEventListener('resize', debouncedResize);
        handleResize();
        
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(timeoutId);
        };
    }, [gl, camera]);
    
    return null;
}

function ModelLoader() {
    return (
        <div className={styles.modelLoaderContainer}>
            <div className={styles.skeletonLoader3d}></div>
            <p className={styles.loadingText}>Loading 3D Model...</p>
        </div>
    );
}

export default function ConsoleScene({ type = 'xbox' }) {
    const [isHovered, setIsHovered] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    
    const consoleNames = {
        'xbox': 'Xbox Series X',
        'ps5': 'PlayStation 5',
        'switch': 'Nintendo Switch',
        'pc': 'Gaming PC'
    };

    const platformIds = {
        'xbox': 1,
        'ps5': 187,
        'switch': 7,
        'pc': 4
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (shouldLoad) {
            const modelPaths = {
                'xbox': '/3dmodels/xbox_series_x_console.glb',
                'ps5': '/3dmodels/classic_ps5.glb',
                'switch': '/3dmodels/nintendo_switch.glb',
                'pc': '/3dmodels/gaming_pc.glb'
            };
            
            useGLTF.preload(modelPaths[type]);
        }
    }, [shouldLoad, type]);

    const handleConsoleClick = () => {
        const platformId = platformIds[type];
        navigate(`/platform/${platformId}`);
    };

    return (
        <div ref={containerRef} className={styles.sceneContainer}>
            <div className={styles.consoleNameContainer}>
                <h2 className={styles[`${type}NameText`]}>
                    {consoleNames[type]}
                </h2>
                
                <div 
                    className={`${styles.canvasWrapper} ${shouldLoad ? styles.canvasWrapperLoaded : styles.canvasWrapperLoading}`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {shouldLoad ? (
                        <Canvas 
                            performance={{ min: 0.5 }}
                            dpr={[1, 2]}
                            camera={{ 
                                position: [2, 2, 14],
                                fov: 50
                            }}
                            resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
                        >
                            <ResizeHandler />
                            <ambientLight intensity={2.5} />
                            <directionalLight position={[5, 5, 5]} intensity={8} />
                            <directionalLight position={[-5, 5, 5]} intensity={6} />
                            <pointLight position={[0, 8, 5]} intensity={4} />
                            
                            <Suspense fallback={null}>
                                {type === 'xbox' && <XboxModel onClick={handleConsoleClick} isHovered={isHovered} />}
                                {type === 'ps5' && <PS5Model onClick={handleConsoleClick} isHovered={isHovered} />}
                                {type === 'switch' && <SwitchModel onClick={handleConsoleClick} isHovered={isHovered} />}
                                {type === 'pc' && <GamingPCModel onClick={handleConsoleClick} isHovered={isHovered} />}
                            </Suspense>
                        </Canvas>
                    ) : (
                        <ModelLoader />
                    )}
                </div>
            </div>
        </div>
    );
}
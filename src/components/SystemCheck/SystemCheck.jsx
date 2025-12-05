// SystemCheck.jsx - Pre-Preloader System Requirements Check
// Sprawdza akcelerację sprzętową, rozdzielczość ORAZ wydajność (FPS benchmark)

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SystemCheck.css';

function SystemCheck({ onComplete }) {
  const [issues, setIssues] = useState([]);
  const [isChecking, setIsChecking] = useState(true);
  const [checkingPhase, setCheckingPhase] = useState('init'); // 'init', 'benchmark', 'done'
  const [screenInfo, setScreenInfo] = useState({ width: 0, height: 0 });
  const [performanceInfo, setPerformanceInfo] = useState({ fps: 0, gpuName: '' });
  const canvasRef = useRef(null);

  useEffect(() => {
    const runChecks = async () => {
      const detectedIssues = [];

      // 1. SPRAWDZENIE AKCELERACJI SPRZĘTOWEJ (GPU)
      const checkHardwareAcceleration = () => {
        try {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
          
          if (!gl) {
            return { hasGPU: false, gpuName: 'Brak' };
          }

          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          let gpuName = 'Nieznane GPU';
          
          if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            gpuName = renderer;
            
            // Sprawdzamy czy to software renderer
            if (
              renderer.includes('SwiftShader') || 
              renderer.includes('llvmpipe') || 
              renderer.includes('Software') ||
              renderer.includes('Microsoft Basic Render')
            ) {
              return { hasGPU: false, gpuName: renderer };
            }
          }
          return { hasGPU: true, gpuName };
        } catch (e) {
          return { hasGPU: false, gpuName: 'Błąd wykrywania' };
        }
      };

      // 2. SPRAWDZENIE CZY TO URZĄDZENIE MOBILNE
      const checkIsMobile = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileUA = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini|webos/i.test(userAgent);
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.screen.width <= 1024;
        
        // Uznajemy za mobile jeśli: user agent mówi mobile LUB (mały ekran + touch)
        return isMobileUA || (isSmallScreen && isTouchDevice);
      };

      // 3. SPRAWDZENIE ROZDZIELCZOŚCI MONITORA (tylko dla desktopów!)
      const checkResolution = (isMobile) => {
        const width = window.screen.width;
        const height = window.screen.height;
        setScreenInfo({ width, height });
        
        // Na mobile nie sprawdzamy rozdzielczości - strona jest zresponsywnowana
        if (isMobile) {
          return true; // OK dla mobile
        }
        
        // Na desktopie wymagamy minimum 1920x1080
        return width >= 1920 && height >= 1080;
      };

      // 4. BENCHMARK WYDAJNOŚCI - Mierzymy rzeczywiste FPS
      const runPerformanceBenchmark = () => {
        return new Promise((resolve) => {
          setCheckingPhase('benchmark');
          
          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 400;
          canvas.style.position = 'fixed';
          canvas.style.top = '50%';
          canvas.style.left = '50%';
          canvas.style.transform = 'translate(-50%, -50%)';
          canvas.style.opacity = '0'; // Niewidoczny
          canvas.style.pointerEvents = 'none';
          document.body.appendChild(canvas);

          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          
          if (!gl) {
            document.body.removeChild(canvas);
            resolve({ avgFps: 0, isLowPerformance: true });
            return;
          }

          // Prosty shader do stress testu
          const vertexShaderSource = `
            attribute vec4 a_position;
            void main() {
              gl_Position = a_position;
            }
          `;

          const fragmentShaderSource = `
            precision mediump float;
            uniform float u_time;
            void main() {
              vec2 resolution = vec2(400.0, 400.0);
              vec2 uv = gl_FragCoord.xy / resolution;
              
              // Kilka operacji matematycznych żeby obciążyć GPU
              float t = u_time;
              float r = sin(uv.x * 20.0 + t) * 0.5 + 0.5;
              float g = sin(uv.y * 20.0 + t * 1.3) * 0.5 + 0.5;
              float b = sin((uv.x + uv.y) * 15.0 + t * 0.7) * 0.5 + 0.5;
              
              // Dodatkowe obliczenia
              for (int i = 0; i < 10; i++) {
                r = sin(r * 3.14159 + float(i) * 0.1);
                g = cos(g * 3.14159 + float(i) * 0.1);
              }
              
              gl_FragColor = vec4(r, g, b, 1.0);
            }
          `;

          const createShader = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
          };

          const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
          const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

          const program = gl.createProgram();
          gl.attachShader(program, vertexShader);
          gl.attachShader(program, fragmentShader);
          gl.linkProgram(program);
          gl.useProgram(program);

          // Quad na cały ekran
          const positions = new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1,
          ]);

          const positionBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

          const positionLocation = gl.getAttribLocation(program, 'a_position');
          gl.enableVertexAttribArray(positionLocation);
          gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

          const timeLocation = gl.getUniformLocation(program, 'u_time');

          // Mierzenie FPS przez 1.5 sekundy
          const frameTimes = [];
          let lastTime = performance.now();
          const benchmarkDuration = 1500; // 1.5 sekundy
          const startTime = performance.now();

          const render = () => {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;

            if (elapsed >= benchmarkDuration) {
              // Koniec benchmarku
              document.body.removeChild(canvas);

              // Oblicz średnie FPS
              if (frameTimes.length > 1) {
                let totalDelta = 0;
                for (let i = 1; i < frameTimes.length; i++) {
                  totalDelta += frameTimes[i] - frameTimes[i - 1];
                }
                const avgFrameTime = totalDelta / (frameTimes.length - 1);
                const avgFps = Math.round(1000 / avgFrameTime);

                // Uznajemy za słabą wydajność jeśli FPS < 20
                const isLowPerformance = avgFps < 20;
                
                resolve({ avgFps, isLowPerformance });
              } else {
                resolve({ avgFps: 0, isLowPerformance: true });
              }
              return;
            }

            frameTimes.push(currentTime);

            // Renderuj
            gl.uniform1f(timeLocation, elapsed * 0.001);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            requestAnimationFrame(render);
          };

          requestAnimationFrame(render);
        });
      };

      // Wykonaj sprawdzenia
      const gpuCheck = checkHardwareAcceleration();
      const isMobile = checkIsMobile();
      const hasResolution = checkResolution(isMobile);

      // Zbierz problem GPU
      if (!gpuCheck.hasGPU) {
        detectedIssues.push({
          type: 'gpu',
          icon: '🎮',
          title: 'Akceleracja Sprzętowa Wyłączona',
          description: 'Przeglądarka renderuje grafikę programowo (CPU)'
        });
      }

      // Zbierz problem rozdzielczości
      if (!hasResolution) {
        detectedIssues.push({
          type: 'resolution',
          icon: '🖥️',
          title: 'Niestandardowa Rozdzielczość',
          description: `Wykryto ${window.screen.width}×${window.screen.height}px`
        });
      }

      // Uruchom benchmark wydajności (tylko jeśli GPU jest włączone)
      if (gpuCheck.hasGPU) {
        const perfResult = await runPerformanceBenchmark();
        setPerformanceInfo({ fps: perfResult.avgFps, gpuName: gpuCheck.gpuName });

        if (perfResult.isLowPerformance) {
          detectedIssues.push({
            type: 'performance',
            icon: '🐢',
            title: 'Słaba Wydajność Graficzna',
            description: `Wykryto ${perfResult.avgFps} FPS (zalecane: 20+)`
          });
        }
      } else {
        setPerformanceInfo({ fps: 0, gpuName: gpuCheck.gpuName });
      }

      setCheckingPhase('done');
      setIssues(detectedIssues);
      setIsChecking(false);

      // Jeśli brak problemów, od razu kontynuuj
      if (detectedIssues.length === 0) {
        onComplete();
      }
    };

    // Start po małym opóźnieniu
    const timer = setTimeout(runChecks, 200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleContinue = () => {
    onComplete();
  };

  const openHelpGuide = () => {
    window.open('https://www.google.com/search?q=jak+włączyć+akcelerację+sprzętową+w+przeglądarce', '_blank');
  };

  // Pokazuj ekran ładowania podczas benchmarku
  if (isChecking) {
    return (
      <motion.div
        className="system-check-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="benchmark-loading">
          <div className="benchmark-spinner"></div>
          <p className="benchmark-text">
            {checkingPhase === 'benchmark' 
              ? 'Testowanie wydajności...' 
              : 'Sprawdzanie systemu...'}
          </p>
        </div>
      </motion.div>
    );
  }

  // Jeśli brak problemów, nie pokazuj nic
  if (issues.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="system-check-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        <motion.div
          className="system-warning-modal"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="system-warning-content">
            <div className="warning-icon-large">⚠️</div>
            
            <h2>Wykryto Problemy</h2>
            
            <p>
              Ta strona wykorzystuje zaawansowane efekty graficzne.<br />
              Wykryliśmy następujące problemy z Twoim systemem:
            </p>

            <ul className="warning-list">
              {issues.map((issue, index) => (
                <li key={index}>
                  <span className="issue-icon">{issue.icon}</span>
                  <div className="issue-text">
                    <strong>{issue.title}</strong>
                    <span>{issue.description}</span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Informacje o systemie */}
            <div className="system-info-box">
              {issues.some(i => i.type === 'resolution') && (
                <div className="info-row">
                  <span className="info-label">Rozdzielczość:</span>
                  <span className="info-value error">{screenInfo.width} × {screenInfo.height}px</span>
                  <span className="info-required">(wymagane: 1920×1080)</span>
                </div>
              )}
              {performanceInfo.fps > 0 && (
                <div className="info-row">
                  <span className="info-label">Wydajność:</span>
                  <span className={`info-value ${performanceInfo.fps < 20 ? 'error' : 'ok'}`}>
                    {performanceInfo.fps} FPS
                  </span>
                  <span className="info-required">(zalecane: 20+)</span>
                </div>
              )}
              {performanceInfo.gpuName && (
                <div className="info-row gpu-info">
                  <span className="info-label">GPU:</span>
                  <span className="info-value">{performanceInfo.gpuName}</span>
                </div>
              )}
            </div>

            <p className="system-suggestion">
              {issues.some(i => i.type === 'gpu') && (
                <>Włącz „Akcelerację sprzętową" w ustawieniach przeglądarki. </>
              )}
              {issues.some(i => i.type === 'performance') && (
                <>Twój komputer może mieć problemy z płynnym wyświetlaniem animacji. </>
              )}
              {issues.some(i => i.type === 'resolution') && (
                <>Strona może wyglądać inaczej na Twojej rozdzielczości. </>
              )}
              <br />
              <strong>Niektóre elementy mogą lagować lub się rozjeżdżać.</strong>
            </p>

            <div className="system-warning-buttons">
              <button className="system-btn-primary" onClick={handleContinue}>
                Rozumiem, kontynuuj
              </button>
              
              {issues.some(i => i.type === 'gpu') && (
                <button className="system-btn-secondary" onClick={openHelpGuide}>
                  Jak włączyć GPU?
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default SystemCheck;

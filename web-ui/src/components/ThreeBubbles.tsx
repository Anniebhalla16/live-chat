// ThreeBubbles.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBubbles({
  trigger,
  count = 10,
  bottomInset = 64,
}: {
  trigger: number;
  count?: number;
  bottomInset?: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const camRef = useRef<THREE.OrthographicCamera>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const texRef = useRef<THREE.Texture>(null);
  const rafRef = useRef<number>(null);
  const bubblesRef = useRef<
    { s: THREE.Sprite; vx: number; vy: number; t: number; life: number }[]
  >([]);
  const hideTimer = useRef<number | null>(null);

  // init once
  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    Object.assign(renderer.domElement.style, {
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      opacity: '0',
      visibility: 'hidden',
      transition: 'opacity 140ms ease-out',
    });
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const cam = new THREE.OrthographicCamera(
      0,
      mount.clientWidth,
      mount.clientHeight,
      0,
      -10,
      10
    );
    camRef.current = cam;

    const K = 64,
      c = document.createElement('canvas');
    c.width = c.height = K;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(
      K / 2,
      K / 2,
      K * 0.1,
      K / 2,
      K / 2,
      K * 0.5
    );
    g.addColorStop(0, 'rgba(80,140,255,0.95)');
    g.addColorStop(0.6, 'rgba(80,140,255,0.45)');
    g.addColorStop(1, 'rgba(80,140,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, K, K);
    texRef.current = new THREE.CanvasTexture(c);

    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;
      const arr = bubblesRef.current;
      for (let i = arr.length - 1; i >= 0; i--) {
        const b = arr[i];
        b.t += dt;
        const k = b.t / b.life; // 0..1
        b.s.position.x += b.vx * dt;
        b.s.position.y += b.vy * dt;
        (b.s.material as THREE.SpriteMaterial).opacity = 1 - k;
        b.s.scale.setScalar(THREE.MathUtils.lerp(12, 22, k));
        if (k >= 1) {
          scene.remove(b.s);
          (b.s.material as THREE.SpriteMaterial).dispose();
          arr.splice(i, 1);
        }
      }
      renderer.render(scene, cam);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onResize = () => {
      const w = mount.clientWidth,
        h = mount.clientHeight;
      cam.left = 0;
      cam.right = w;
      cam.top = h;
      cam.bottom = 0;
      cam.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      cancelAnimationFrame(rafRef.current!);
      ro.disconnect();
      renderer.dispose();
      texRef.current?.dispose();
      mount.removeChild(renderer.domElement);
      bubblesRef.current.forEach((b) =>
        (b.s.material as THREE.SpriteMaterial).dispose()
      );
      bubblesRef.current = [];
    };
  }, []);

  useEffect(() => {
    const renderer = rendererRef.current,
      scene = sceneRef.current,
      tex = texRef.current;
    if (!renderer || !scene || !tex) return;

    const el = renderer.domElement;
    el.style.visibility = 'visible';
    el.style.opacity = '1';
    if (hideTimer.current) clearTimeout(hideTimer.current);

    const w = el.clientWidth,
      h = el.clientHeight;
    const spawnBaseY = Math.max(0, h - bottomInset);
    const startY = Math.max(4, spawnBaseY - 12);

    for (let i = 0; i < count; i++) {
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        opacity: 0.9,
      });
      const spr = new THREE.Sprite(mat);
      const startX = Math.random() * w;
      spr.position.set(startX, startY, 0);
      spr.scale.setScalar(12);
      scene.add(spr);
      bubblesRef.current.push({
        s: spr,
        vx: (Math.random() - 0.5) * 30,
        vy: 70 + Math.random() * 60,
        t: 0,
        life: 1.2 + Math.random() * 0.5,
      });
    }

    hideTimer.current = window.setTimeout(() => {
      if (bubblesRef.current.length === 0) {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
      }
    }, 2000);
  }, [trigger, count, bottomInset]);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  );
}

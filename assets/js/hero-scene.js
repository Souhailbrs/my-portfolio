// Hero background: a faint, slowly drifting 3D starfield that parallaxes with the pointer.
// Purely decorative and kept quiet so the portrait stays the focus. The page works without it.
import * as THREE from 'three';

const canvas = document.querySelector('.hero-canvas');
const hero = canvas?.closest('.hero');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

function supportsWebGL() {
    try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch { return false; }
}

if (canvas && supportsWebGL()) init();

function init() {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const COUNT = innerWidth < 700 ? 600 : 1400;
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
        const r = 3 + Math.random() * 9;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        positions.set([r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t) * .6, r * Math.cos(p) - 2], i * 3);
        sizes[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    const mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPR: { value: renderer.getPixelRatio() } },
        vertexShader: /* glsl */`
            attribute float aSize; uniform float uTime; uniform float uPR; varying float vA;
            void main(){
                vec3 p = position;
                p.y += sin(uTime * .3 + position.x) * .15;
                vec4 mv = modelViewMatrix * vec4(p, 1.);
                gl_PointSize = (1. + aSize * 2.2) * uPR * (8. / -mv.z);
                vA = .18 + aSize * .45;
                gl_Position = projectionMatrix * mv;
            }`,
        fragmentShader: /* glsl */`
            varying float vA;
            void main(){
                float d = length(gl_PointCoord - .5);
                gl_FragColor = vec4(vec3(.8,.72,1.), smoothstep(.5, 0., d) * vA);
            }`,
    });
    const stars = new THREE.Points(geo, mat);
    scene.add(stars);

    const resize = () => {
        const w = hero.clientWidth, h = hero.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        if (!running) renderer.render(scene, camera);
    };

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    hero.addEventListener('pointermove', e => {
        pointer.tx = (e.clientX / innerWidth) * 2 - 1;
        pointer.ty = (e.clientY / innerHeight) * 2 - 1;
    });
    hero.addEventListener('pointerleave', () => { pointer.tx = pointer.ty = 0; });

    let running = false, visible = true, raf = 0, last = performance.now(), time = 0;
    function frame(now) {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        time += dt;
        pointer.x += (pointer.tx - pointer.x) * 0.04;
        pointer.y += (pointer.ty - pointer.y) * 0.04;
        mat.uniforms.uTime.value = time;
        stars.rotation.y = time * 0.02 + pointer.x * 0.12;
        stars.rotation.x = pointer.y * 0.06;
        renderer.render(scene, camera);
        if (running) raf = requestAnimationFrame(frame);
    }
    function start() {
        if (running || reduced.matches || !visible || document.hidden) return;
        running = true; last = performance.now(); raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }

    new ResizeObserver(resize).observe(hero);
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); }).observe(hero);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    reduced.addEventListener('change', () => { if (reduced.matches) { stop(); renderer.render(scene, camera); } else start(); });

    resize();
    renderer.render(scene, camera);
    canvas.classList.add('is-ready');
    start();
}

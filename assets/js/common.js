import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// ---- Dev mode ----
const DEV_STORAGE_KEY = "4ltrophy_dev_mode";

export function isDevMode() {
  return localStorage.getItem(DEV_STORAGE_KEY) === "1";
}

// Legacy alias
export function isLocalhost() {
  return isDevMode();
}

// Toggle dev mode from console: toggle_dev()
window.toggle_dev = function() {
  if (isDevMode()) {
    localStorage.removeItem(DEV_STORAGE_KEY);
    console.log("%cMode développeur désactivé", "color:red;font-weight:bold");
  } else {
    localStorage.setItem(DEV_STORAGE_KEY, "1");
    console.log("%cMode développeur activé", "color:green;font-weight:bold");
  }
  location.reload();
};

// Show dev banner if active
if (isDevMode()) {
  document.addEventListener("DOMContentLoaded", () => {
    const banner = document.createElement("div");
    banner.textContent = "Mode développeur";
    Object.assign(banner.style, {
      position: "fixed", top: "0", left: "0", right: "0", zIndex: "9999",
      background: "#e85d3a", color: "white", textAlign: "center",
      padding: "4px 0", fontSize: "12px", fontFamily: "sans-serif",
      fontWeight: "600", letterSpacing: "1px", pointerEvents: "none",
    });
    document.body.appendChild(banner);
    document.body.style.paddingTop = "24px";
  });
}

// ---- Constants ----
export const MODEL_PATH = "assets/models/4l.glb";

export const CAR_COLORS = {
  peinture: "#a8c7c1", peinture1: "#a8c7c1", peinture2: "#a8c7c1", peinture3: "#a8c7c1",
  caouchou: "#222222", metal_noir: "#1a1a1a", metal_noir1: "#1a1a1a",
  chrome: "#cccccc", cuir: "#3b2a1a",
};

// ---- Three.js scene setup ----
export function createScene(canvasId) {
  const canvas = document.getElementById(canvasId);
  const container = canvas.parentElement;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0ebe0);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(-3, 2, 4);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 1.5;
  controls.maxDistance = 8;
  controls.maxPolarAngle = Math.PI / 2 + 0.2;
  controls.target.set(0, 0.5, 0);

  // Lighting
  const dirLight = new THREE.DirectionalLight(0xffeedd, 3);
  dirLight.position.set(5, 8, 3);
  scene.add(dirLight);
  scene.add(new THREE.HemisphereLight(0x87ceeb, 0xe8c96d, 1.2));
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  // Ground
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(6, 48),
    new THREE.MeshStandardMaterial({ color: 0xe0d8c8 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  scene.add(ground);

  // Resize observer
  new ResizeObserver(() => {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }).observe(container);

  // Animate loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  return { canvas, container, scene, camera, renderer, controls };
}

// ---- Load car model ----
export function loadCarModel(scene) {
  const carMeshes = [];
  const promise = new Promise((resolve) => {
    new GLTFLoader().load(MODEL_PATH, (gltf) => {
      const model = gltf.scene;

      model.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(model);
      const sz = box.getSize(new THREE.Vector3());
      const scale = 2.5 / Math.max(sz.x, sz.y, sz.z);
      model.scale.setScalar(scale);

      model.updateMatrixWorld(true);
      const box2 = new THREE.Box3().setFromObject(model);
      const center2 = box2.getCenter(new THREE.Vector3());
      model.position.x -= center2.x;
      model.position.z -= center2.z;
      model.position.y -= box2.min.y;

      model.traverse((child) => {
        if (child.isMesh) {
          child.geometry.computeVertexNormals();
          const applyColor = (mat) => {
            if (CAR_COLORS[mat.name]) mat.color.set(CAR_COLORS[mat.name]);
            mat.side = THREE.DoubleSide;
          };
          if (Array.isArray(child.material)) child.material.forEach(applyColor);
          else applyColor(child.material);
          carMeshes.push(child);
        }
      });
      scene.add(model);
      resolve(carMeshes);
    });
  });
  return promise;
}

// ---- Polygon mesh helper ----
export function createPolygonMesh(points, material) {
  if (points.length < 3) return null;
  const vecs = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
  const vertices = [];
  for (let i = 1; i < vecs.length - 1; i++) {
    vertices.push(vecs[0].x, vecs[0].y, vecs[0].z);
    vertices.push(vecs[i].x, vecs[i].y, vecs[i].z);
    vertices.push(vecs[i + 1].x, vecs[i + 1].y, vecs[i + 1].z);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

// ---- Material helpers ----
export function makeLineMat(color) {
  return new THREE.LineBasicMaterial({ color });
}

export function makeFillMat(color) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

// ---- Toast ----
export function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// ---- Zone hash (for cache invalidation — based on points only) ----
export function zoneHash(z) {
  const str = JSON.stringify(z.points);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

// ---- Camera animation ----
export function animateCameraToZone(zone, camera, controls) {
  const center = new THREE.Vector3();
  zone.points.forEach(p => center.add(new THREE.Vector3(p.x, p.y, p.z)));
  center.divideScalar(zone.points.length);

  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();

  let camDir;
  if (zone.projection) {
    const proj = new THREE.Vector3(...zone.projection);
    if (Math.abs(proj.y) > 0.9) {
      // Capot (top-down): view from front-left at an angle
      camDir = new THREE.Vector3(-0.5, 0.8, 0.5).normalize();
    } else {
      // Side zones: face the zone from the opposite direction
      camDir = proj.clone().negate();
      camDir.y += 0.4;
      camDir.normalize();
    }
  } else {
    camDir = camera.position.clone().sub(controls.target).normalize();
  }
  const newCamPos = center.clone().add(camDir.multiplyScalar(2.5));

  const duration = 600, startTime = performance.now();
  function anim(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    camera.position.lerpVectors(startPos, newCamPos, ease);
    controls.target.lerpVectors(startTarget, center, ease);
    controls.update();
    if (t < 1) requestAnimationFrame(anim);
  }
  requestAnimationFrame(anim);
}

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";
import { siteConfig, modelPath, sponsors, socialLinks, carColors } from "./config.js";

// ---- DOM refs ----
const canvas = document.getElementById("car-viewer");
const loaderEl = document.getElementById("loader");
const popup = document.getElementById("sponsor-popup");
const heroTitle = document.querySelector(".hero-title");
const heroTagline = document.querySelector(".hero-tagline");

// ---- Populate site content from config ----
heroTitle.textContent = siteConfig.teamName;
heroTagline.textContent = siteConfig.tagline;
document.querySelector(".about-text").textContent = siteConfig.aboutText;

// Set social links from config
document.querySelectorAll(".social-link").forEach((link) => {
  const platform = link.dataset.platform;
  const social = socialLinks.find((s) => s.platform === platform);
  if (social) link.href = social.url;
});

// Clone social icons to footer
const footerSocial = document.querySelector(".footer-social");
document.querySelectorAll(".social-link").forEach((link) => {
  const clone = link.cloneNode(true);
  footerSocial.appendChild(clone);
});

// Build sponsors fallback grid
const sponsorsGrid = document.querySelector(".sponsors-grid");
sponsors.forEach((sp) => {
  const card = document.createElement("a");
  card.href = sp.url;
  card.target = "_blank";
  card.rel = "noopener";
  card.className = "sponsor-card fade-in";

  const logoDiv = document.createElement("div");
  logoDiv.className = "sponsor-card-logo";
  logoDiv.style.background = sp.color;
  logoDiv.textContent = sp.name.charAt(0);
  if (sp.logo) {
    logoDiv.innerHTML = `<img src="${sp.logo}" alt="${sp.name}" style="max-width:100%;max-height:100%;border-radius:50%">`;
  }

  const nameEl = document.createElement("div");
  nameEl.className = "sponsor-card-name";
  nameEl.textContent = sp.name;

  card.appendChild(logoDiv);
  card.appendChild(nameEl);
  sponsorsGrid.appendChild(card);
});

// ---- Three.js Setup ----
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(3, 2, 5);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ---- Lighting ----
const dirLight = new THREE.DirectionalLight(0xffeedd, 3);
dirLight.position.set(5, 8, 3);
scene.add(dirLight);

const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0xc2956b, 1.2);
scene.add(hemiLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// ---- Ground ----
const groundGeo = new THREE.CircleGeometry(8, 64);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.8,
  metalness: 0.1,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
scene.add(ground);

// ---- Controls ----
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI / 2 + 0.2;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.target.set(0, 0.5, 0);

let autoRotateTimeout;
controls.addEventListener("start", () => {
  controls.autoRotate = false;
  clearTimeout(autoRotateTimeout);
});
controls.addEventListener("end", () => {
  autoRotateTimeout = setTimeout(() => {
    controls.autoRotate = true;
  }, 5000);
});

// ---- Car meshes (for raycasting decals) ----
const carMeshes = [];
const decalMeshes = []; // clickable decal meshes for sponsor interaction

// ---- Decal creation ----
const textureLoader = new THREE.TextureLoader();

function createSponsorDecals() {
  sponsors.forEach((sp) => {
    if (!sp.decal || !sp.logo) return;

    const d = sp.decal;
    const position = new THREE.Vector3(d.position.x, d.position.y, d.position.z);
    const orientation = new THREE.Euler(d.orientation.x, d.orientation.y, d.orientation.z);
    const size = new THREE.Vector3(d.size.width, d.size.height, d.size.depth);

    // Load logo texture
    const texture = textureLoader.load(sp.logo, () => {
      // Try to create decal on each car mesh
      for (const mesh of carMeshes) {
        try {
          const decalGeo = new DecalGeometry(mesh, position, orientation, size);
          if (decalGeo.attributes.position.count === 0) continue;

          const decalMat = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            depthTest: true,
            polygonOffset: true,
            polygonOffsetFactor: -4,
            roughness: 0.5,
            metalness: 0.1,
          });

          const decalMesh = new THREE.Mesh(decalGeo, decalMat);
          decalMesh.userData.sponsor = sp;
          decalMesh.renderOrder = 1;
          scene.add(decalMesh);
          decalMeshes.push(decalMesh);
        } catch (e) {
          // DecalGeometry can fail if position doesn't intersect mesh
        }
      }
    });
  });
}

// ---- Placeholder car ----
function createPlaceholderCar() {
  const carGroup = new THREE.Group();
  const bodyGeo = new THREE.BoxGeometry(2, 0.6, 0.9);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xc2956b, roughness: 0.5 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.45;
  carGroup.add(body);

  const cabinGeo = new THREE.BoxGeometry(0.9, 0.45, 0.8);
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0xa07850, roughness: 0.4 });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(-0.15, 0.95, 0);
  carGroup.add(cabin);

  const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
  [[0.65, 0.18, 0.5], [0.65, 0.18, -0.5], [-0.65, 0.18, 0.5], [-0.65, 0.18, -0.5]].forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(x, y, z);
    carGroup.add(wheel);
  });

  scene.add(carGroup);
  carGroup.traverse((child) => {
    if (child.isMesh) carMeshes.push(child);
  });
}

// ---- Model Loading ----
const gltfLoader = new GLTFLoader();

gltfLoader.load(
  modelPath,
  (gltf) => {
    const model = gltf.scene;

    // Fix orientation: model has Z-up, Three.js uses Y-up
    model.rotation.x = -Math.PI / 2;

    // Center and scale
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.5 / maxDim;
    model.scale.setScalar(scale);

    model.updateMatrixWorld(true);
    const box2 = new THREE.Box3().setFromObject(model);
    const center2 = box2.getCenter(new THREE.Vector3());
    model.position.x -= center2.x;
    model.position.z -= center2.z;
    model.position.y -= box2.min.y;

    // Apply colors and collect meshes
    model.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeVertexNormals();
        const applyColor = (mat) => {
          if (carColors[mat.name]) {
            mat.color.set(carColors[mat.name]);
          }
          mat.side = THREE.DoubleSide;
        };
        if (Array.isArray(child.material)) {
          child.material.forEach(applyColor);
        } else {
          applyColor(child.material);
        }
        carMeshes.push(child);
      }
    });

    scene.add(model);

    // Update world matrices before creating decals
    model.updateMatrixWorld(true);
    createSponsorDecals();
    hideLoader();

    if (siteConfig.devMode) {
      addDevHelpers();
    }
  },
  (progress) => {
    if (progress.total > 0) {
      const pct = Math.round((progress.loaded / progress.total) * 100);
      loaderEl.querySelector("p").textContent = `Chargement... ${pct}%`;
    }
  },
  () => {
    console.warn("GLB model not found, using placeholder car");
    createPlaceholderCar();
    createSponsorDecals();
    hideLoader();
    if (siteConfig.devMode) addDevHelpers();
  }
);

function hideLoader() {
  loaderEl.classList.add("hidden");
}

// ---- Dev Mode: click on car to get position + normal ----
function addDevHelpers() {
  const axes = new THREE.AxesHelper(3);
  scene.add(axes);

  // Visual marker for clicked points
  const markerGeo = new THREE.SphereGeometry(0.02, 8, 8);
  const markerMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });

  renderer.domElement.addEventListener("dblclick", (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, camera);

    const intersects = ray.intersectObjects(carMeshes, true);
    if (intersects.length > 0) {
      const hit = intersects[0];
      const p = hit.point;
      const n = hit.face.normal.clone();

      // Transform normal to world space
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld);
      n.applyMatrix3(normalMatrix).normalize();

      // Place a marker
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(p);
      scene.add(marker);

      // Draw normal arrow
      const arrow = new THREE.ArrowHelper(n, p, 0.2, 0xff00ff);
      scene.add(arrow);

      console.log(
        `%c DECAL POSITION `,
        "background: #E94D1A; color: white; font-weight: bold;",
        `\nposition: { x: ${p.x.toFixed(3)}, y: ${p.y.toFixed(3)}, z: ${p.z.toFixed(3)} }`,
        `\nnormal: { x: ${n.x.toFixed(3)}, y: ${n.y.toFixed(3)}, z: ${n.z.toFixed(3)} }`,
        `\norientation (from normal): { x: ${Math.atan2(n.y, n.z).toFixed(3)}, y: ${Math.atan2(n.x, n.z).toFixed(3)}, z: 0 }`,
        `\nmesh: ${hit.object.name || "(unnamed)"}`
      );
    }
  });

  console.log(
    "%c DEV MODE ACTIF ",
    "background: #2ECC71; color: white; font-weight: bold;",
    "\nDouble-clic sur la voiture = affiche position + normale dans la console.",
    "\nUtilise ces valeurs pour positionner les décals dans config.js."
  );
}

// ---- Raycasting (sponsor interaction on decals) ----
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredDecal = null;

function onPointerMove(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(decalMeshes);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    if (hoveredDecal !== obj) {
      resetHover();
      hoveredDecal = obj;
      obj.material.emissive = new THREE.Color(0x444444);
      renderer.domElement.style.cursor = "pointer";
    }
  } else {
    resetHover();
    renderer.domElement.style.cursor = "grab";
  }
}

function resetHover() {
  if (hoveredDecal) {
    hoveredDecal.material.emissive = new THREE.Color(0x000000);
  }
  hoveredDecal = null;
}

// Distinguish click from drag
let pointerDownPos = null;
renderer.domElement.addEventListener("pointerdown", (e) => {
  pointerDownPos = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener("pointerup", (e) => {
  if (!pointerDownPos) return;
  const dx = e.clientX - pointerDownPos.x;
  const dy = e.clientY - pointerDownPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  pointerDownPos = null;

  if (dist > 5) return;

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(decalMeshes);

  if (intersects.length > 0) {
    const sponsor = intersects[0].object.userData.sponsor;
    if (sponsor) showSponsorPopup(sponsor);
  }
});

renderer.domElement.addEventListener("pointermove", onPointerMove);

// ---- Sponsor Popup ----
let backdropEl = null;

function showSponsorPopup(sp) {
  popup.querySelector(".popup-name").textContent = sp.name;
  popup.querySelector(".popup-description").textContent = sp.description;
  popup.querySelector(".popup-link").href = sp.url;

  const logoContainer = popup.querySelector(".popup-logo");
  if (sp.logo) {
    logoContainer.innerHTML = `<img src="${sp.logo}" alt="${sp.name}">`;
    logoContainer.style.background = "transparent";
  } else {
    logoContainer.innerHTML = sp.name.charAt(0);
    logoContainer.style.background = sp.color;
    logoContainer.style.color = "white";
    logoContainer.style.fontSize = "2rem";
    logoContainer.style.fontFamily = "var(--font-heading)";
    logoContainer.style.fontWeight = "700";
  }

  if (!backdropEl) {
    backdropEl = document.createElement("div");
    backdropEl.className = "popup-backdrop";
    document.body.appendChild(backdropEl);
    backdropEl.addEventListener("click", closeSponsorPopup);
  }
  backdropEl.classList.add("visible");

  popup.classList.remove("hidden");
  popup.classList.add("visible");
}

function closeSponsorPopup() {
  popup.classList.remove("visible");
  popup.classList.add("hidden");
  if (backdropEl) backdropEl.classList.remove("visible");
}

popup.querySelector(".popup-close").addEventListener("click", closeSponsorPopup);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSponsorPopup();
});

// ---- Animation Loop ----
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// ---- Resize ----
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ---- Scroll fade-in observer ----
const fadeEls = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);
fadeEls.forEach((el) => observer.observe(el));

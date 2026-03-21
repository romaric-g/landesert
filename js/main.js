import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { siteConfig, modelPath, socialLinks, carColors } from "./config.js";
import { loadAndPlaceSponsors, animateCameraToSponsor } from "../assets/js/common.js";

// ---- DOM refs ----
const canvas = document.getElementById("car-viewer");
const viewerContainer = canvas.parentElement;
const loaderEl = document.getElementById("loader");
const popup = document.getElementById("sponsor-popup");
const heroTitle = document.querySelector(".hero-title");
const heroTagline = document.querySelector(".hero-tagline");

// ---- Populate site content from config ----
if (heroTitle) heroTitle.textContent = siteConfig.teamName;
if (heroTagline) heroTagline.textContent = siteConfig.tagline;
const heroSubtitle = document.querySelector(".hero-subtitle");
if (heroSubtitle) heroSubtitle.textContent = siteConfig.subtitle || "";

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

// ---- Team Section ----
const teamIntro = document.querySelector(".team-intro");
const teamGrid = document.querySelector(".team-grid");
if (siteConfig.team && teamGrid) {
  if (teamIntro) teamIntro.textContent = siteConfig.team.intro;
  siteConfig.team.members.forEach((member) => {
    const card = document.createElement("div");
    card.className = "team-card fade-in";
    card.innerHTML = `
      <div class="team-card-photo">
        <img src="${member.photo}" alt="${member.name}">
      </div>
      <h3 class="team-card-name">${member.name}</h3>
      <span class="team-card-role">${member.role}</span>
      <p class="team-card-desc">${member.description}</p>
    `;
    teamGrid.appendChild(card);
  });
}

// ---- Event Section ----
const eventTitle = document.querySelector(".event-title");
const eventDesc = document.querySelector(".event-description");
const statsContainer = document.querySelector(".event-stats");
if (siteConfig.event) {
  if (eventTitle) eventTitle.textContent = siteConfig.event.title;
  if (eventDesc) eventDesc.textContent = siteConfig.event.description;
  if (statsContainer) {
    siteConfig.event.stats.forEach((stat) => {
      const el = document.createElement("div");
      el.className = "stat-item";
      el.innerHTML = `<span class="stat-value">${stat.value}</span><span class="stat-label">${stat.label}</span>`;
      statsContainer.appendChild(el);
    });
  }
}

// ---- Humanitarian Section ----
const humanTitle = document.querySelector(".humanitarian-title");
const humanDesc = document.querySelector(".humanitarian-description");
const actionsList = document.querySelector(".humanitarian-actions");
if (siteConfig.humanitarian) {
  if (humanTitle) humanTitle.textContent = siteConfig.humanitarian.title;
  if (humanDesc) humanDesc.textContent = siteConfig.humanitarian.description;
  if (actionsList) {
    siteConfig.humanitarian.actions.forEach((action) => {
      const li = document.createElement("li");
      li.textContent = action;
      actionsList.appendChild(li);
    });
  }
}

// ---- Association Section ----
const assocTitle = document.querySelector(".association-title");
const assocDesc = document.querySelector(".association-description");
if (siteConfig.association) {
  if (assocTitle) assocTitle.textContent = siteConfig.association.title;
  if (assocDesc) assocDesc.textContent = siteConfig.association.description;
}
const emailBtn = document.querySelector(".contact-email");
if (siteConfig.contact && emailBtn) {
  emailBtn.href = `mailto:${siteConfig.contact.email}`;
  emailBtn.textContent = siteConfig.contact.email;
}

// ---- Build sponsors list (left panel) ----
const sponsorsList = document.querySelector(".sponsors-list");
const sponsorCardEls = [];
let sponsors = [];

// Load sponsors from JSON (cards only for real sponsors — all logos placed on car)
const sponsorsReady = fetch("assets/sponsors.json")
  .then(r => r.json())
  .then(data => {
    sponsors = data;
    // Only show sponsor: true (or undefined) in the list
    sponsors.filter(sp => sp.sponsor !== false).forEach((sp, index) => {
      const card = document.createElement("div");
      card.className = "sponsor-card fade-in visible";
      card.dataset.sponsorIndex = index;

      const logoDiv = document.createElement("div");
      logoDiv.className = "sponsor-card-logo";
      if (sp.image) {
        logoDiv.innerHTML = `<img src="${sp.image}" alt="${sp.name}">`;
      } else {
        logoDiv.textContent = sp.name.charAt(0);
      }

      const info = document.createElement("div");
      info.className = "sponsor-card-info";
      info.innerHTML = `
        <div class="sponsor-card-name">${sp.name}</div>
        <div class="sponsor-card-desc">${sp.description || ""}</div>
      `;

      card.appendChild(logoDiv);
      card.appendChild(info);
      sponsorsList.appendChild(card);
      sponsorCardEls.push(card);

      card.addEventListener("click", () => {
        focusOnSponsor(sp, index);
      });
    });
  });

// ---- Mobile menu toggle ----
const menuToggle = document.querySelector(".menu-toggle");
const headerNav = document.querySelector(".header-nav");
if (menuToggle && headerNav) {
  menuToggle.addEventListener("click", () => {
    headerNav.classList.toggle("open");
    menuToggle.classList.toggle("open");
  });
  headerNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      headerNav.classList.remove("open");
      menuToggle.classList.remove("open");
    });
  });
}

// ---- Three.js Setup ----
// Size from container, not window
function getViewerSize() {
  return {
    width: viewerContainer.clientWidth,
    height: viewerContainer.clientHeight,
  };
}

const { width: initW, height: initH } = getViewerSize();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x39B2F8);

const camera = new THREE.PerspectiveCamera(45, initW / initH, 0.1, 100);
camera.position.set(-2, 1.2, 2.5);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(initW, initH);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;

// ---- Lighting ----
const dirLight = new THREE.DirectionalLight(0xffeedd, 3);
dirLight.position.set(5, 8, 3);
scene.add(dirLight);

const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0xe8c96d, 1.2);
scene.add(hemiLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// ---- Ground ----
const groundGeo = new THREE.CircleGeometry(6, 64);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0xFB9E00,
  roughness: 0.9,
  metalness: 0.0,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
scene.add(ground);

// ---- Controls ----
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 1.5;
controls.maxDistance = 8;
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
let decalMeshes = [];

// ---- Camera animation to focus on a sponsor's decal ----
let cameraAnimating = false;

function focusOnSponsor(sp, index) {
  sponsorCardEls.forEach((el) => el.classList.remove("active"));
  sponsorCardEls[index].classList.add("active");

  if (!sp.position || !sp.projection) return;

  controls.autoRotate = false;
  clearTimeout(autoRotateTimeout);
  cameraAnimating = true;

  animateCameraToSponsor(sp, camera, controls);

  // Re-enable auto-rotate after animation
  setTimeout(() => {
    cameraAnimating = false;
    autoRotateTimeout = setTimeout(() => {
      controls.autoRotate = true;
    }, 5000);
  }, 700);
}

// ---- Placeholder car ----
function createPlaceholderCar() {
  const carGroup = new THREE.Group();
  const bodyGeo = new THREE.BoxGeometry(2, 0.6, 0.9);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xa8c7c1, roughness: 0.5 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.45;
  carGroup.add(body);

  const cabinGeo = new THREE.BoxGeometry(0.9, 0.45, 0.8);
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0x8aaca6, roughness: 0.4 });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(-0.15, 0.95, 0);
  carGroup.add(cabin);

  const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
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

    model.updateMatrixWorld(true);
    // Wait for sponsors data, then place logos on car using position/projection
    sponsorsReady.then(() => {
      loadAndPlaceSponsors(carMeshes, scene).then(({ decalMeshes: meshes }) => {
        decalMeshes = meshes;
      });
    });
    hideLoader();

    if (siteConfig.devMode) {
      addDevHelpers();
    }
  },
  (progress) => {
    if (progress.total > 0) {
      const pct = Math.min(100, Math.round((progress.loaded / progress.total) * 100));
      loaderEl.querySelector("p").textContent = `Chargement... ${pct}%`;
    }
  },
  () => {
    console.warn("GLB model not found, using placeholder car");
    createPlaceholderCar();
    sponsorsReady.then(() => {
      loadAndPlaceSponsors(carMeshes, scene).then(({ decalMeshes: meshes }) => {
        decalMeshes = meshes;
      });
    });
    hideLoader();
    if (siteConfig.devMode) addDevHelpers();
  }
);

function hideLoader() {
  loaderEl.classList.add("hidden");
}

// ---- Dev Mode ----
function addDevHelpers() {
  const axes = new THREE.AxesHelper(3);
  scene.add(axes);

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

      const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld);
      n.applyMatrix3(normalMatrix).normalize();

      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(p);
      scene.add(marker);

      const arrow = new THREE.ArrowHelper(n, p, 0.2, 0xff00ff);
      scene.add(arrow);

      console.log(
        `%c DECAL POSITION `,
        "background: #E85D3A; color: white; font-weight: bold;",
        `\nposition: { x: ${p.x.toFixed(3)}, y: ${p.y.toFixed(3)}, z: ${p.z.toFixed(3)} }`,
        `\nnormal: { x: ${n.x.toFixed(3)}, y: ${n.y.toFixed(3)}, z: ${n.z.toFixed(3)} }`,
        `\norientation (from normal): { x: ${Math.atan2(n.y, n.z).toFixed(3)}, y: ${Math.atan2(n.x, n.z).toFixed(3)}, z: 0 }`,
        `\nmesh: ${hit.object.name || "(unnamed)"}`
      );
    }
  });

  console.log(
    "%c DEV MODE ACTIF ",
    "background: #3A7D44; color: white; font-weight: bold;",
    "\nDouble-clic sur la voiture = affiche position + normale dans la console."
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
  const popupLink = popup.querySelector(".popup-link");
  if (popupLink) popupLink.href = sp.url || "#";

  const logoContainer = popup.querySelector(".popup-logo");
  if (sp.image) {
    logoContainer.innerHTML = `<img src="${sp.image}" alt="${sp.name}">`;
    logoContainer.style.background = "transparent";
  } else {
    logoContainer.innerHTML = sp.name.charAt(0);
    logoContainer.style.background = "#6B4226";
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
  if (!cameraAnimating) {
    controls.update();
  }
  renderer.render(scene, camera);
}
animate();

// ---- Resize (container-based) ----
const resizeObserver = new ResizeObserver(() => {
  const { width, height } = getViewerSize();
  if (width === 0 || height === 0) return;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
resizeObserver.observe(viewerContainer);

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

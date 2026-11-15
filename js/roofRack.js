import * as THREE from "three";

// Roof rack + load, built in the raw 4L model's coordinates (X = length, rear at high X,
// Y = up, Z = width; ~1.43 mm per unit) and added as a child of the model so it follows its scale.
// Tire and jerrycan: Quaternius models from poly.pizza, CC0.
const ROOF_Y = 837;   // top of the roof
const CENTER_X = 2625;
const CENTER_Z = 2590;
// Roof measured by raycasting the model: x 2100-3150, z 2290-2890, ~785 high at the rack's corners,
// so the rack stays inside it and its legs land on the body.
const RACK = { length: 1000, width: 560, legHeight: 25, tube: 14, crossBars: 5 };
const CRATE_HEIGHT = 105; // upper rail ~15 cm above the base, like a crate
const LEG_FOOT_Y = 780;
const WHEEL_DIAMETER = 370;
const JERRYCAN_HEIGHT = 300;

const rackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.6 });
const rimMat = new THREE.MeshStandardMaterial({ color: 0x9a9a9a, roughness: 0.35, metalness: 0.8 });
// Flat hubcap faces: sponsor logos are projected on them like on the body (assets/sponsors.json)
const hubcapMat = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.5 });

function tube(from, to) {
  const dir = new THREE.Vector3().subVectors(to, from);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(RACK.tube, RACK.tube, dir.length(), 10), rackMat);
  mesh.position.copy(from).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
}

const X0 = CENTER_X - RACK.length / 2, X1 = CENTER_X + RACK.length / 2;
const Z0 = CENTER_Z - RACK.width / 2, Z1 = CENTER_Z + RACK.width / 2;
const BASE_Y = ROOF_Y + RACK.legHeight;
const barX = (i) => X0 + (RACK.length * i) / RACK.crossBars;

function buildFrame() {
  const g = new THREE.Group();
  const v = (x, y, z) => new THREE.Vector3(x, y, z);
  const top = BASE_Y + CRATE_HEIGHT;
  for (const y of [BASE_Y, top]) {
    // side rails + front/back rails, on both levels
    g.add(tube(v(X0, y, Z0), v(X1, y, Z0)), tube(v(X0, y, Z1), v(X1, y, Z1)));
    g.add(tube(v(X0, y, Z0), v(X0, y, Z1)), tube(v(X1, y, Z0), v(X1, y, Z1)));
  }
  for (let i = 0; i <= RACK.crossBars; i++) {
    const x = barX(i);
    if (i > 0 && i < RACK.crossBars) g.add(tube(v(x, BASE_Y, Z0), v(x, BASE_Y, Z1))); // floor bars
    for (const z of [Z0, Z1]) g.add(tube(v(x, BASE_Y, z), v(x, top, z))); // crate posts
  }
  // legs go down to the curved roof at the corners
  for (const x of [X0 + 40, X1 - 40]) for (const z of [Z0, Z1]) g.add(tube(v(x, LEG_FOOT_Y, z), v(x, BASE_Y, z)));
  return g;
}

// Scale `obj` to `height` and put its bottom-center at (x, y, z).
function place(obj, height, x, y, z) {
  const box = new THREE.Box3().setFromObject(obj);
  obj.scale.multiplyScalar(height / box.getSize(new THREE.Vector3()).y);
  box.setFromObject(obj);
  const c = box.getCenter(new THREE.Vector3());
  obj.position.add(new THREE.Vector3(x - c.x, y - box.min.y, z - c.z));
  return obj;
}

// Tire + rim with a flat hubcap on both faces, axis along Z like the car's wheels.
function wheel(tireScene, x, bottomY, z) {
  const g = new THREE.Group();
  const tire = tireScene.clone();
  tire.rotation.x = Math.PI / 2; // model lies flat
  place(tire, WHEEL_DIAMETER, x, bottomY, z);
  const width = new THREE.Box3().setFromObject(tire).getSize(new THREE.Vector3()).z;
  // shortcut: hole radius estimated at ~0.32 × diameter from the tire model, adjust if the rim shows a gap
  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(WHEEL_DIAMETER * 0.33, WHEEL_DIAMETER * 0.33, width * 0.85, 40),
    [rimMat, hubcapMat, hubcapMat], // side, top face, bottom face
  );
  rim.name = "hubcap";
  rim.rotation.x = Math.PI / 2;
  rim.position.set(x, bottomY + WHEEL_DIAMETER / 2, z);
  g.add(tire, rim);
  return { group: g, width, rim };
}

// Returns the wheel meshes, so the page can add them to the surfaces sponsor logos are projected on.
export async function addRoofRack(model, loader) {
  const rack = buildFrame();
  model.add(rack);

  const [tireGltf, canGltf] = await Promise.all([
    loader.loadAsync("assets/models/roof/tire.glb"),
    loader.loadAsync("assets/models/roof/jerrycan.glb"),
  ]);

  // Two wheels side by side at the back, centered between two floor bars and sunk so they
  // rest on those bars (circle drops ~29 units 100 units from its center).
  const wheelX = (barX(3) + barX(4)) / 2;
  const wheelBottom = BASE_Y + RACK.tube - 29;
  const wheelMeshes = [];
  for (const side of [-1, 1]) {
    const { group, width } = wheel(tireGltf.scene, wheelX, wheelBottom, CENTER_Z);
    group.position.z = side * (width / 2 + 10);
    rack.add(group);
    group.traverse((o) => o.isMesh && wheelMeshes.push(o));
  }

  // Jerrycans in front of the wheels, side by side
  const canX = (X0 + wheelX - WHEEL_DIAMETER / 2) / 2;
  const floor = BASE_Y + RACK.tube;
  for (const dz of [-90, 0, 90]) {
    rack.add(place(canGltf.scene.clone(), JERRYCAN_HEIGHT, canX, floor, CENTER_Z + dz));
  }
  model.updateMatrixWorld(true);
  return wheelMeshes;
}

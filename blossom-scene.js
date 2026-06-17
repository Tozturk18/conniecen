import * as THREE from "three";

const canvas = document.getElementById("blossom-scene");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const saveData = navigator.connection?.saveData;
const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

if (canvas && supportsWebGL() && !reduceMotion && !saveData) {
  startScene(canvas);
}

function supportsWebGL() {
  try {
    const testCanvas = document.createElement("canvas");
    return Boolean(testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function startScene(target) {
  const renderer = new THREE.WebGLRenderer({
    canvas: target,
    alpha: true,
    antialias: true,
    powerPreference: "low-power"
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
  const tree = new THREE.Group();
  const pointer = new THREE.Vector2(0, 0);
  const clock = new THREE.Clock();
  const blossomAnchors = [];

  camera.position.set(0, 0.2, 8.8);
  scene.add(tree);

  const branchMaterial = new THREE.MeshStandardMaterial({
    color: 0x4b342d,
    roughness: 0.92,
    metalness: 0.02
  });
  const twigMaterial = new THREE.MeshStandardMaterial({
    color: 0x6b5145,
    roughness: 0.95,
    metalness: 0.02
  });
  const petalMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2b9c6,
    roughness: 0.88,
    transparent: true,
    opacity: 0.84,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const centerMaterial = new THREE.MeshStandardMaterial({
    color: 0xc68d80,
    roughness: 0.9,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const fallingMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8cdd5,
    roughness: 0.9,
    transparent: true,
    opacity: 0.62,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  buildTree(tree, blossomAnchors, branchMaterial, twigMaterial);
  addBlossomClusters(tree, blossomAnchors, petalMaterial, centerMaterial);
  const falling = addFallingPetals(scene, fallingMaterial);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xf3c6d0, 2.4);
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(-2.4, 3.8, 4.8);
  scene.add(hemi, key);

  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", (event) => {
    if (coarsePointer) return;
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  renderer.setAnimationLoop(() => {
    const elapsed = clock.getElapsedTime();
    tree.rotation.y = -0.28 + Math.sin(elapsed * 0.18) * 0.03 + pointer.x * 0.045;
    tree.rotation.x = -0.04 + pointer.y * 0.025;
    falling.rotation.y = elapsed * 0.028;
    animateFallingPetals(falling, elapsed);
    renderer.render(scene, camera);
  });

  function resize() {
    const width = target.clientWidth || window.innerWidth;
    const height = target.clientHeight || window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.45);

    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();

    const isSmall = width < 760;
    tree.position.set(isSmall ? 1.35 : 2.28, isSmall ? -1.14 : -0.78, 0);
    tree.scale.setScalar(isSmall ? 0.82 : 1);
  }
}

function buildTree(group, blossomAnchors, branchMaterial, twigMaterial) {
  const branches = [
    {
      radius: [0.15, 0.048],
      material: branchMaterial,
      points: [[0, -2.35, 0], [0.06, -1.55, 0.03], [0.12, -0.72, -0.02], [0.02, 0.16, 0.02], [-0.12, 0.86, 0.06]]
    },
    {
      radius: [0.072, 0.017],
      material: branchMaterial,
      points: [[0.08, -1.25, 0.02], [-0.36, -0.86, -0.05], [-0.84, -0.26, -0.15], [-1.28, 0.54, -0.05]]
    },
    {
      radius: [0.066, 0.016],
      material: branchMaterial,
      points: [[0.09, -1.02, 0], [0.48, -0.62, 0.08], [0.87, 0.05, 0.13], [1.26, 0.7, 0.02]]
    },
    {
      radius: [0.052, 0.014],
      material: branchMaterial,
      points: [[0.04, -0.42, 0], [-0.44, 0.04, 0.1], [-0.92, 0.72, 0.16], [-1.22, 1.36, 0.08]]
    },
    {
      radius: [0.048, 0.014],
      material: branchMaterial,
      points: [[0.04, -0.2, 0.02], [0.48, 0.16, -0.05], [0.92, 0.78, -0.12], [1.42, 1.24, -0.02]]
    },
    {
      radius: [0.038, 0.012],
      material: twigMaterial,
      points: [[-0.06, 0.32, 0.03], [-0.42, 0.92, -0.06], [-0.6, 1.52, 0.06]]
    },
    {
      radius: [0.034, 0.011],
      material: twigMaterial,
      points: [[-0.03, 0.48, 0.03], [0.24, 0.98, 0.1], [0.28, 1.62, -0.03]]
    }
  ];

  const twigs = [
    [[-0.52, -0.45, -0.1], [-1.1, -0.1, -0.18], [-1.55, 0.28, -0.1]],
    [[-0.86, 0.22, -0.1], [-1.48, 0.7, -0.04], [-1.82, 1.14, 0.02]],
    [[-0.76, 0.62, 0.12], [-1.12, 1.08, 0.18], [-1.5, 1.44, 0.12]],
    [[0.6, -0.2, 0.1], [1.02, 0.26, 0.12], [1.56, 0.58, 0.06]],
    [[0.84, 0.34, 0.02], [1.28, 0.88, -0.08], [1.76, 1.08, -0.04]],
    [[0.72, 0.84, -0.1], [1.02, 1.32, -0.16], [1.48, 1.62, -0.08]],
    [[-0.24, 0.88, 0.04], [-0.36, 1.34, 0.02], [-0.28, 1.78, -0.05]],
    [[0.02, 0.92, 0.03], [0.4, 1.32, 0.12], [0.78, 1.74, 0.04]],
    [[-0.18, 0.08, 0.02], [-0.78, 0.44, 0.18], [-1.18, 0.88, 0.16]],
    [[0.14, 0.16, 0], [0.72, 0.48, -0.18], [1.14, 0.94, -0.12]]
  ].map((points) => ({ radius: [0.022, 0.007], material: twigMaterial, points }));

  [...branches, ...twigs].forEach((spec, specIndex) => {
    const samples = addCurvedBranch(group, spec.points, spec.radius[0], spec.radius[1], spec.material);
    samples.slice(Math.floor(samples.length * 0.45)).forEach((sample, index) => {
      if ((index + specIndex) % 2 === 0) {
        blossomAnchors.push(sample.clone());
      }
    });
  });

  addBarkDetails(group, branchMaterial);
}

function addCurvedBranch(group, rawPoints, startRadius, endRadius, material) {
  const points = rawPoints.map((point) => new THREE.Vector3(...point));
  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.4);
  const samples = curve.getPoints(Math.max(5, Math.ceil(points.length * 4)));

  for (let i = 0; i < samples.length - 1; i += 1) {
    const t = i / (samples.length - 2);
    const radius = THREE.MathUtils.lerp(startRadius, endRadius, t);
    group.add(cylinderBetween(samples[i], samples[i + 1], radius, material));
  }

  return samples;
}

function addBarkDetails(group, material) {
  const markMaterial = material.clone();
  markMaterial.color = new THREE.Color(0x2e211e);
  markMaterial.transparent = true;
  markMaterial.opacity = 0.26;

  for (let i = 0; i < 34; i += 1) {
    const y = -2.06 + seeded(i, 31) * 2.52;
    const x = 0.03 + Math.sin(y * 2.1) * 0.07 + (seeded(i, 32) - 0.5) * 0.04;
    const z = 0.04 + (seeded(i, 33) - 0.5) * 0.08;
    const mark = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.08 + seeded(i, 34) * 0.08, 0.006), markMaterial);
    mark.position.set(x, y, z);
    mark.rotation.set(0.2, seeded(i, 35) * Math.PI, -0.25 + seeded(i, 36) * 0.5);
    group.add(mark);
  }
}

function cylinderBetween(start, end, radius, material) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(radius * 0.72, radius, length, 9, 1);
  const mesh = new THREE.Mesh(geometry, material);
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

  mesh.position.copy(midpoint);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function addBlossomClusters(group, anchors, petalMaterial, centerMaterial) {
  const isSmall = window.innerWidth < 760;
  const blossomCount = isSmall ? 90 : 170;
  const petalGeometry = createPetalGeometry();
  const centerGeometry = new THREE.CircleGeometry(0.012, 8);
  const petalMesh = new THREE.InstancedMesh(petalGeometry, petalMaterial, blossomCount * 5);
  const centerMesh = new THREE.InstancedMesh(centerGeometry, centerMaterial, blossomCount);
  const matrix = new THREE.Matrix4();
  const centerMatrix = new THREE.Matrix4();
  const color = new THREE.Color();
  const position = new THREE.Vector3();
  const offset = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const baseRotation = new THREE.Euler();
  const baseQuaternion = new THREE.Quaternion();
  const petalQuaternion = new THREE.Quaternion();
  const spinQuaternion = new THREE.Quaternion();

  for (let i = 0; i < blossomCount; i += 1) {
    const anchor = anchors[i % anchors.length] || new THREE.Vector3();
    const spread = 0.13 + seeded(i, 51) * 0.22;
    position.set(
      anchor.x + (seeded(i, 52) - 0.5) * spread,
      anchor.y + (seeded(i, 53) - 0.5) * spread * 0.75,
      anchor.z + (seeded(i, 54) - 0.5) * 0.34
    );

    baseRotation.set(
      -0.18 + seeded(i, 55) * 0.36,
      -0.45 + seeded(i, 56) * 0.9,
      seeded(i, 57) * Math.PI * 2
    );
    baseQuaternion.setFromEuler(baseRotation);

    for (let petal = 0; petal < 5; petal += 1) {
      const angle = (petal / 5) * Math.PI * 2 + seeded(i, 58) * 0.14;
      offset.set(Math.cos(angle) * 0.038, Math.sin(angle) * 0.038, 0).applyQuaternion(baseQuaternion);
      spinQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle - Math.PI * 0.5);
      petalQuaternion.copy(baseQuaternion).multiply(spinQuaternion);
      const size = 0.78 + seeded(i + petal, 59) * 0.54;
      scale.set(size, size * (0.88 + seeded(i + petal, 60) * 0.2), size);

      matrix.compose(position.clone().add(offset), petalQuaternion, scale);
      const index = i * 5 + petal;
      petalMesh.setMatrixAt(index, matrix);
      color.set(petal % 2 ? 0xf7c8d0 : 0xf2b0bf);
      petalMesh.setColorAt(index, color);
    }

    centerMatrix.compose(position, baseQuaternion, new THREE.Vector3(0.8, 0.8, 0.8));
    centerMesh.setMatrixAt(i, centerMatrix);
  }

  petalMesh.instanceMatrix.needsUpdate = true;
  centerMesh.instanceMatrix.needsUpdate = true;
  if (petalMesh.instanceColor) petalMesh.instanceColor.needsUpdate = true;
  group.add(petalMesh, centerMesh);
}

function createPetalGeometry() {
  const geometry = new THREE.CircleGeometry(0.034, 9);
  geometry.scale(0.68, 1.34, 1);
  geometry.translate(0, 0.024, 0);
  return geometry;
}

function addFallingPetals(scene, material) {
  const isSmall = window.innerWidth < 760;
  const count = isSmall ? 54 : 96;
  const geometry = createPetalGeometry();
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  const matrix = new THREE.Matrix4();

  for (let i = 0; i < count; i += 1) {
    matrix.compose(
      new THREE.Vector3((seeded(i, 71) - 0.5) * 7, (seeded(i, 72) - 0.5) * 4.4, -1.8 + seeded(i, 73) * 1.3),
      new THREE.Quaternion(),
      new THREE.Vector3(1, 1, 1)
    );
    mesh.setMatrixAt(i, matrix);
  }

  scene.add(mesh);
  return mesh;
}

function animateFallingPetals(mesh, elapsed) {
  const matrix = new THREE.Matrix4();
  const rotation = new THREE.Euler();
  const quaternion = new THREE.Quaternion();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();

  for (let i = 0; i < mesh.count; i += 1) {
    const drift = elapsed * (0.075 + seeded(i, 81) * 0.12);
    position.set(
      (seeded(i, 71) - 0.5) * 7 + Math.sin(elapsed * 0.22 + i) * 0.16,
      wrap((seeded(i, 72) - 0.5) * 4.4 - drift, -2.6, 2.2),
      -1.8 + seeded(i, 73) * 1.3
    );
    rotation.set(elapsed * 0.3 + i, elapsed * 0.16 + i * 0.2, elapsed * 0.36 + i);
    quaternion.setFromEuler(rotation);
    const size = 0.72 + seeded(i, 82) * 0.55;
    scale.set(size, size, size);
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(i, matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
}

function wrap(value, min, max) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

function seeded(index, salt) {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

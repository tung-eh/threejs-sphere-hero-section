import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);

// Textures
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load("/textures/normalmap.png");

// Materials
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = normalTexture;
material.color = new THREE.Color(0x292929);

// Mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Lights

const whiteLight = new THREE.PointLight(0xffffff, 0.1);
whiteLight.position.set(2, 3, 4);
scene.add(whiteLight);

const redLight = new THREE.PointLight(0xff0000, 2);
redLight.position.set(-1.86, 1, -1.65);
redLight.intensity = 10;
scene.add(redLight);

const rlFolder = gui.addFolder("Red light");
rlFolder.add(redLight.position, "x").min(-3).max(3).step(0.01);
rlFolder.add(redLight.position, "y").min(-3).max(3).step(0.01);
rlFolder.add(redLight.position, "z").min(-3).max(3).step(0.01);
rlFolder.add(redLight, "intensity").min(0).max(10).step(0.01);

const pointLightAttrs = {
  color: 0xe1ff,
};
const pointLight = new THREE.PointLight(pointLightAttrs.color, 2);
pointLight.position.set(2.13, -3, -1.98);
pointLight.intensity = 6.8;
scene.add(pointLight);

const plFolder = gui.addFolder("Point light");
plFolder.add(pointLight.position, "x").min(-3).max(3).step(0.01);
plFolder.add(pointLight.position, "y").min(-3).max(3).step(0.01);
plFolder.add(pointLight.position, "z").min(-3).max(3).step(0.01);
plFolder.add(pointLight, "intensity").min(0).max(10).step(0.01);
plFolder
  .addColor(pointLightAttrs, "color")
  .onChange(() => pointLight.color.set(pointLightAttrs.color));

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX - window.innerWidth / 2;
  mouseY = event.clientY - window.innerHeight / 2;
});

document.addEventListener("scroll", (event) => {
  sphere.position.y = window.scrollY * 0.001;
});

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.5 * (elapsedTime + 0.001 * mouseX);
  sphere.rotation.x = 0.5 * (0.001 * mouseY);
  sphere.position.z = -0.5 * (0.001 * mouseY);

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

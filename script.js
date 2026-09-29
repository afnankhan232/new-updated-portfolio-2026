import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("threeCanvas");
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0,0,5);

  const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1;

  scene.add(new THREE.AmbientLight(0xffffff,0.6));

  const light = new THREE.DirectionalLight(0x38bdf8,1);
  light.position.set(5,5,5);
  scene.add(light);

  const geometry = new THREE.SphereGeometry(1.5,64,64);
  const material = new THREE.MeshStandardMaterial({
    color:0x0ea5e9,
    wireframe:true,
    emissive:0x1e40af,
    emissiveIntensity:0.4
  });

  const globe = new THREE.Mesh(geometry,material);
  scene.add(globe);

  function animate(){
    requestAnimationFrame(animate);
    globe.rotation.y += 0.002;
    controls.update();
    renderer.render(scene,camera);
  }

  animate();

  window.addEventListener("resize",()=>{
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

});
/*
 * UBC CPSC 314, 2021WT1
 * Assignment 2 Template
 */

// Setup and return the scene and related objects.
// You should look into js/setup.js to see what exactly is done here.
const {
  renderer,
  scene,
  camera,
  worldFrame,
} = setup();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Initialize uniforms

const lightOffset = { type: 'v3', value: new THREE.Vector3(0.0, 5.0, 5.0) };

//HINT: Use this is uniform to pass a rotation matrix to a vertex shader to animate the armadillo's pelvis
const rotationMatrix = {type: 'mat4', value: new THREE.Matrix4()};

//HINT: Q1(b) Change this to a uniform, to pass time to a vertex shader to animate the icecream.
// Make corresponding changes in the update function
time = 0

// Materials: specifying uniforms and shaders

const sphereMaterial = new THREE.ShaderMaterial();

const coneMaterial = new THREE.ShaderMaterial();

const eyeMaterial = new THREE.ShaderMaterial();

const armadilloFrame = new THREE.Object3D();
armadilloFrame.position.set(0, 0, -8);

scene.add(armadilloFrame);

const armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightOffset: lightOffset,
    rotationMatrix: rotationMatrix,
  }
});

// Load shaders.t
const shaderFiles = [
  'glsl/armadillo.vs.glsl',
  'glsl/armadillo.fs.glsl',
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl',
  'glsl/eye.vs.glsl',
  'glsl/eye.fs.glsl',
  'glsl/cone.vs.glsl',
  'glsl/cone.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];

  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];

  eyeMaterial.vertexShader = shaders['glsl/eye.vs.glsl'];
  eyeMaterial.fragmentShader = shaders['glsl/eye.fs.glsl'];

  coneMaterial.vertexShader = shaders['glsl/cone.vs.glsl'];
  coneMaterial.fragmentShader = shaders['glsl/cone.fs.glsl'];

});

// Load and place the Armadillo geometry.
loadAndPlaceOBJ('obj/armadillo.obj', armadilloMaterial, armadilloFrame, function (armadillo) {
  armadillo.rotation.y = Math.PI;
  armadillo.position.y = 5.3
  armadillo.scale.set(0.1, 0.1, 0.1);
});

// Create the icecream scoop geometry
// https://threejs.org/docs/#api/en/geometries/SphereGeometry
const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const coneGeometry = new THREE.ConeGeometry(1, 3, 32);
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
scene.add(cone);

//HINT: Add the sphere as a child to the cone

cone.position.set(7, 1, 10);
sphere.position.set(4, 1, 10);

// Eyes (Q1c)
// Create the eye ball geometry
const eyeGeometry = new THREE.SphereGeometry(1.0, 32, 32);

// HINT: Replace the following with two eye ball meshes from the same geometry.
const templateEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
templateEye.position.set(10.0, 1.0, 10.0);
scene.add(templateEye);

// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {

  //HINT: Use keyboard.pressed to check for keyboard input. 
  //Example: keyboard.pressed("A") to check if the A key is pressed.

  // The following tells three.js that some uniforms might have changed.
  armadilloMaterial.needsUpdate = true;
  sphereMaterial.needsUpdate = true;
  eyeMaterial.needsUpdate = true;
  coneMaterial.needsUpdate = true;

}

// HINT: Use one of the lookAt funcitons available in three.js to make the eyes look at the ice cream.

// Setup update callback
function update() {
  checkKeyboard();

  //HINT: Q1(b) Use time to animate the ice cream cone.
  // When you define time as a uniform, remember to replace this with its value
  time += 1/60; //Assumes 60 frames per second

  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

// Start the animation loop.
update();

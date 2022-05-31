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

const matrixYp = new THREE.Matrix4().makeRotationY(0.3);
const matrixYn = new THREE.Matrix4().makeRotationY(-0.3);
const matrixXp = new THREE.Matrix4().makeRotationX(0.3);
const matrixXn = new THREE.Matrix4().makeRotationX(-0.3);

const conePosition = { type: 'v3', value: new THREE.Vector3(0.0, 10.0, 0.0) };
const lightOffset = { type: 'v3', value: new THREE.Vector3(0.0, 5.0, 5.0) };
const armadilloPosition = { type: 'v3', value: new THREE.Vector3(0.0, 0.0, -8.0) };

//HINT: Use this is uniform to pass a rotation matrix to a vertex shader to animate the armadillo's pelvis
const rotationMatrix = {type: 'mat4', value: new THREE.Matrix4()};

//HINT: Q1(b) Change this to a uniform, to pass time to a vertex shader to animate the icecream.
// Make corresponding changes in the update function
//time = 0
const time = { type: 'v3', value: new THREE.Vector3(0.0, 0.0, 0.0) };


// Materials: specifying uniforms and shaders

const sphereMaterial = new THREE.ShaderMaterial();

const coneMaterial = new THREE.ShaderMaterial({
	uniforms: {
		conePosition: conePosition,
		time: time
  }
});

const eyeMaterial = new THREE.ShaderMaterial({
	uniforms: {
		conePosition: conePosition,
		rotationMatrix: rotationMatrix
	}
});

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

cone.position.set(7, 10, 10);
cone.rotation.x = Math.PI;
cone.add(sphere);
sphere.position.set(0, -2, 0);


// Eyes (Q1c)
// Create the eye ball geometry
const eyeGeometry = new THREE.SphereGeometry(1.0, 32, 32);

// HINT: Replace the following with two eye ball meshes from the same geometry.
const templateEye1 = new THREE.Mesh(eyeGeometry, eyeMaterial);
const templateEye2 = new THREE.Mesh(eyeGeometry, eyeMaterial);
scene.add(templateEye1);
scene.add(templateEye2);

armadilloFrame.add(templateEye1);
armadilloFrame.add(templateEye2);

templateEye1.position.set(-1.0, 12.5, 3.25);

templateEye2.position.set(1.0, 12.5, 3.25);


// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {

  //HINT: Use keyboard.pressed to check for keyboard input. 
  //Example: keyboard.pressed("A") to check if the A key is pressed.
  
/*     if (keyboard.pressed("W"))
    conePosition.value.z -= 0.3;

  else if (keyboard.pressed("S"))
    conePosition.value.z += 0.3;

  if (keyboard.pressed("A"))
    conePosition.value.x -= 0.3;
  else if (keyboard.pressed("D"))
    conePosition.value.x += 0.3;

  if (keyboard.pressed("E"))
    conePosition.value.y -= 0.3;
  else if (keyboard.pressed("Q"))
    conePosition.value.y += 0.3; */


    if (keyboard.pressed("W"))
    armadilloFrame.translateZ(0.3);

  else if (keyboard.pressed("S"))
    armadilloFrame.translateZ(-0.3);

  if (keyboard.pressed("A"))
	rotationMatrix.value.multiply(matrixYp);
	
  else if (keyboard.pressed("D"))
    rotationMatrix.value.multiply(matrixYn);

  if (keyboard.pressed("E"))
    rotationMatrix.value.multiply(matrixXp);
  else if (keyboard.pressed("Q"))
    rotationMatrix.value.multiply(matrixXn);


  // The following tells three.js that some uniforms might have changed.
  armadilloMaterial.needsUpdate = true;
  sphereMaterial.needsUpdate = true;
  eyeMaterial.needsUpdate = true;
  coneMaterial.needsUpdate = true;


  // I DID THIS
  cone.position.set(conePosition.value.x, conePosition.value.y, conePosition.value.z);
  
  //armadilloFrame.position.set(armadilloPosition.value.x, armadilloPosition.value.y, armadilloPosition.value.z);
}



// HINT: Use one of the lookAt funcitons available in three.js to make the eyes look at the ice cream.

// Setup update callback
function update() {
  checkKeyboard();

  //HINT: Q1(b) Use time to animate the ice cream cone.
  // When you define time as a uniform, remember to replace this with its value
  time.value.x += 1/60; //Assumes 60 frames per second
  time.value.y += 1/60;
  time.value.z += 1/60;
  
  cone.position.set(conePosition.value.x + 2*Math.cos(time.value.x), conePosition.value.y + 2*Math.sin(2*time.value.y), conePosition.value.z);
  templateEye1.lookAt(cone.position.x, cone.position.y, cone.position.z);
  templateEye2.lookAt(cone.position.x, cone.position.y, cone.position.z);

  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

// Start the animation loop.
update();

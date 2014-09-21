var camera, scene, renderer;
var effect, controls;
var element, container;
var cube;
var clock = new THREE.Clock();

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer();
  element = renderer.domElement;
  container = document.getElementById('example');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
  camera.position.set(0, 10, -10);
  scene.add(camera);

  controls = new THREE.DeviceOrientationControls(camera, true);
  controls.connect();
  controls.update();


  var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
  scene.add(light);

  var texture = THREE.ImageUtils.loadTexture(
    'textures/patterns/checker.png'
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat = new THREE.Vector2(50, 50);
  texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 20,
    shading: THREE.FlatShading,
    map: texture
  });

  var geometry = new THREE.PlaneGeometry(1000, 1000);

  var mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  cube = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5), new THREE.MeshNormalMaterial());
  cube.position.set(0, 15, 10);

  scene.add(cube);

  element.addEventListener('click', fullscreen, false);
  window.addEventListener('resize', resize, false);
  setTimeout(resize, 1);
}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // renderer.setSize(width, height);
  effect.setSize(width, height);
}

function update(dt) {
  resize();

  camera.updateProjectionMatrix();

  controls.update(dt);
}

function render(dt) {
  effect.render(scene, camera);
}

function animate(t) {
  requestAnimationFrame(animate);

  update(clock.getDelta());
  render(clock.getDelta());
  TWEEN.update();
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}


var socket = io();

socket.on('keydown', function(key) {
  var ARROW_LEFT = 37;
  var ARROW_RIGHT = 39;
  var ARROW_UP = 38;
  var ARROW_DOWN = 40;

  switch (key.code) {
    case ARROW_UP:
      tweenY(5);
      break;
    case ARROW_DOWN:
      tweenY(-5);
      break;
    case ARROW_LEFT:
      tweenX(5);
      break;
    case ARROW_RIGHT:
      tweenX(-5);
      break;
    default:
  }

  function tweenY(n) {
    var position = {
      x: cube.position.x,
      y: cube.position.y
    };
    var target = {
      x: cube.position.x,
      y: cube.position.y + n
    };
    var tween = new TWEEN.Tween(position).to(target, 400);
    // tween.easing(TWEEN.Easing.Elastic.InOut);
    tween.onUpdate(function() {
      cube.position.y = position.y;
    });
    tween.start();
  }

  function tweenX(n) {
    var position = {
      x: cube.position.x,
      y: cube.position.y
    };
    var target = {
      x: cube.position.x + n,
      y: cube.position.y
    };
    var tween = new TWEEN.Tween(position).to(target, 400);
    // tween.easing(TWEEN.Easing.Elastic.InOut);
    tween.onUpdate(function() {
      cube.position.x = position.x;
    });
    tween.start();
  }

});

var cameraIsMoving = false;

socket.on('keyup', function(key) {

  var W = 87;
  var A = 65;
  var S = 83;
  var D = 68;

  if ([W, A, S, D].indexOf(key.code) !== -1) {
    cameraIsMoving = false;
  }

});

socket.on('keydown', function(key) {

  var W = 87;
  var A = 65;
  var S = 83;
  var D = 68;

  if (!cameraIsMoving && [W, A, S, D].indexOf(key.code) !== -1) {

    var pLocal = new THREE.Vector3(0, 0, -1);
    var pWorld = pLocal.applyMatrix4(camera.matrixWorld);
    var dir = pWorld.sub(camera.position).normalize();
    var vecToAdd;

    switch (key.code) {
      case W:
        vecToAdd = dir;
        break;
      case A:
        vecToAdd = new THREE.Vector3().crossVectors(dir, camera.up).normalize().negate();
        break;
      case S:
        vecToAdd = dir.clone().negate();
        break;
      case D:
        vecToAdd = new THREE.Vector3().crossVectors(dir, camera.up).normalize();
        break;
      default:
    }

    cameraIsMoving = true;

    var shiftCamera = function() {
      camera.position.add(vecToAdd);
      if (cameraIsMoving) {
        requestAnimationFrame(shiftCamera);
      }
    };

    shiftCamera();

  }

});

socket.on('keydown', function(key) {

  var SPACE = 32;
  var R = 82;

  switch (key.code) {
    case SPACE:
      camera.position.set(0, 10, -10);
      cube.position.set(0, 15, 10);
      break;
    case R:
      location.reload();
      break;
    default:
  }

});

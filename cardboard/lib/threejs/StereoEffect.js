/**
 * @author alteredq / http://alteredqualia.com/
 * @authod mrdoob / http://mrdoob.com/
 * @authod arodic / http://aleksandarrodic.com/
 */

THREE.StereoEffect = function(scene, camera) {


  this.scene = scene;
  this.camera = camera;

  this.separation = 3;

  // internals

  this._position = new THREE.Vector3();
  this._quaternion = new THREE.Quaternion();
  this._scale = new THREE.Vector3();

  this._cameraL = new THREE.PerspectiveCamera();
  this._cameraR = new THREE.PerspectiveCamera();

  this.enabled = true;
  this.needsSwap = true;
  this.clear = false;

};

THREE.StereoEffect.prototype = {

  render: function(renderer, writeBuffer, readBuffer) {

    var width = window.innerWidth / 2;
    var height = window.innerHeight;

    scene.updateMatrixWorld();

    if (camera.parent === undefined) camera.updateMatrixWorld();

    camera.matrixWorld.decompose(this._position, this._quaternion, this._scale);

    // left

    this._cameraL.fov = this.camera.fov;
    this._cameraL.aspect = 0.5 * this.camera.aspect;
    this._cameraL.near = this.camera.near;
    this._cameraL.far = this.camera.far;
    this._cameraL.updateProjectionMatrix();

    this._cameraL.position.copy(this._position);
    this._cameraL.quaternion.copy(this._quaternion);
    this._cameraL.translateX(-this.separation);

    // right

    this._cameraR.near = this.camera.near;
    this._cameraR.far = this.camera.far;
    this._cameraR.projectionMatrix = this._cameraL.projectionMatrix;

    this._cameraR.position.copy(this._position);
    this._cameraR.quaternion.copy(this._quaternion);
    this._cameraR.translateX(this.separation);


    //renderer.setViewport(0, 0, this._width * 2, this._height);
    //renderer.clear();

    renderer.setViewport(0, 0, width, height);
    //renderer.render(this.scene, this._cameraL);
    renderer.render(this.scene, this._cameraL, writeBuffer, true);

    //renderer.setViewport(width, 0, width, height);
    //renderer.render(this.scene, this._cameraR);
    //renderer.render(this.scene, this._cameraR, writeBuffer, true);

    renderer.setViewport(0, 0, width * 2, height);
    //renderer.clear();
  }

};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.EffectComposer = function(renderer, renderTarget) {

  this.renderer = renderer;

  if (renderTarget === undefined) {

    var width = window.innerWidth || 1;
    var height = window.innerHeight || 1;
    var parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: false
    };

    renderTarget = new THREE.WebGLRenderTarget(width, height, parameters);

  }

  this.renderTarget1 = renderTarget;
  this.renderTarget2 = renderTarget.clone();

  this.writeBuffer = this.renderTarget1;
  this.readBuffer = this.renderTarget2;

  this.passes = [];

};

THREE.EffectComposer.prototype = {

  swapBuffers: function() {

    var tmp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    this.writeBuffer = tmp;

  },

  addPass: function(pass) {

    this.passes.push(pass);

  },

  render: function(delta) {

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

    var pass, i, il = this.passes.length;

    for (i = 0; i < il; i++) {

      pass = this.passes[i];

      if (!pass.enabled) continue;

      if (i === il - 1) {
        pass.renderToScreen = true;
      }

      pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);

      if (pass.needsSwap) {

        this.swapBuffers();

      }

    }

  },

  reset: function(renderTarget) {

    if (renderTarget === undefined) {

      renderTarget = this.renderTarget1.clone();

      renderTarget.width = window.innerWidth;
      renderTarget.height = window.innerHeight;

    }

    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

  },

  setSize: function(width, height) {

    var renderTarget = this.renderTarget1.clone();

    renderTarget.width = width;
    renderTarget.height = height;

    this.reset(renderTarget);

  }

};

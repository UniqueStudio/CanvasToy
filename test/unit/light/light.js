function start() {
  var canvas = document.getElementById('canvas');
  CanvasToy.setCanvas(canvas);

  var scene = new CanvasToy.Scene();
  var camera = new CanvasToy.PerspectiveCamera();

  var logo = new CanvasToy.Texture('../../images/chrome.png');
  var cube = new CanvasToy.CubeGeometry();
  var material = new CanvasToy.BRDFPerFragMaterial(
      {color : vec3.fromValues(1, 1, 1), texture : logo});
  var mesh = new CanvasToy.Mesh(cube, material);

  var light = new CanvasToy.PointLight();
  light.diffuse = vec3.fromValues(0.5, 0.5, 0.5);
  light.specular = vec3.fromValues(0.1, 0.1, 0.1);
  light.idensity = 4;

  scene.addLight(light);

  var angle = 0.01;
  mesh.translate(0, 0, -6.0);

  var time = 0;

  mesh.registerUpdate(() => {
    mesh.rotateX(1 / 60);
    mesh.rotateY(1 / 60);
  });

  // mesh.translate(100, 0, 0);

  // mesh.translate(100, 0, 0);

  scene.addObject(mesh);
  CanvasToy.engine.startRender(scene, camera, 1000 / 60);
}

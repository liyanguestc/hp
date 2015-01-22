var camera, renderer, scene;
var meshArray = [];
var omega1 =  1.032;
var omega2 = -3.729;
var radius1 = 3;
var radius2x = 12;
var radius2z = 10;
head.ready(function() {
    Init();
    animate();
});

function Init() {
    scene = new THREE.Scene();

    //setup camera
    camera = new LeiaCamera({
        cameraPosition: new THREE.Vector3(_camPosition.x, _camPosition.y, _camPosition.z),
        targetPosition: new THREE.Vector3(_tarPosition.x, _tarPosition.y, _tarPosition.z)
    });
    scene.add(camera);

    //setup rendering parameter
    renderer = new LeiaWebGLRenderer({
        antialias: true,
        renderMode: _renderMode,
        shaderMode: _nShaderMode,
        colorMode: _colorMode,
        compFac: _depthCompressionFactor,
        devicePixelRatio: 1
    });
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    Leia_addRender(renderer);

    //add object to Scene
    addObjectsToScene();

    //add Light
    addLights();

    //add Gyro Monitor
    //addGyroMonitor();
}

function animate() {
    requestAnimationFrame(animate);

    //set mesh animation
    for (var i = 0; i < meshArray.length; i++) {
        var curMeshGroup = meshArray[i].meshGroup;
        switch (meshArray[i].name) {
            case "HPLogoBig":
               curMeshGroup.position.set(-radius1*Math.cos(LEIA.time)-1, -1, 1.0-radius1*Math.sin(LEIA.time)); 
		curMeshGroup.rotation.y = omega1*LEIA.time;
                break;
             case "HPLogoSmall":
            curMeshGroup.position.set(radius2x*Math.cos(LEIA.time)-1, -1, 1.0+radius2z*Math.sin(LEIA.time)); 
		curMeshGroup.rotation.y = omega2*LEIA.time;
            break;
            default:
                break;
        }
    }
    renderer.Leia_render({
        scene: scene,
        camera: camera,
        holoScreenSize: _holoScreenSize,
        holoCamFov: _camFov,
        upclip: _up,
        downclip: _down,
        filterA: _filterA,
        filterB: _filterB,
        filterC: _filterC,
        messageFlag: _messageFlag
    });
}

function addObjectsToScene() {
    //Add your objects here
    //API to add STL Object
      Leia_LoadSTLModel({
        path: 'resource/HPLogoBin.stl'
    },function(mesh){
      mesh.material.side = THREE.DoubleSide;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.material.metal = true;
      mesh.scale.set(20, 20, 20);
      mesh.position.set(0, 0, 0);
      var group = new THREE.Object3D();
      group.add(mesh);
      scene.add(group);
      meshArray.push({
        meshGroup: group,
        name: 'HPLogoBig'
      });
    });
  
  Leia_LoadSTLModel({
        path: 'resource/HPLogoBin.stl'
    },function(mesh){
      mesh.material.side = THREE.DoubleSide;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.material.metal = true;
      mesh.scale.set(8, 8, 8);
      mesh.position.set(0, 0, 0);
      var group = new THREE.Object3D();
      group.add(mesh);
      scene.add(group);
      meshArray.push({
        meshGroup: group,
        name: 'HPLogoSmall'
      });
    });

    //Add Text
  /*  var helloText = createText({
        text: "Hello",
        size: 15
    });
    helloText.position.set(-20, -5, 3);
    helloText.rotation.set(0, 0, 0);
    helloText.castShadow = true;
    helloText.receiveShadow = true;
    var helloGroup = new THREE.Object3D();
    helloGroup.add(helloText);
    scene.add(helloGroup);
    meshArray.push({
        meshGroup: helloGroup,
        name: "helloworld"
    });*/

    //add background texture
    var backgroundPlane = Leia_createTexturePlane({
        filename: 'resource/checkerboard.jpg',
        width: 40,
        height: 30
    });
    backgroundPlane.position.z = -8;
    backgroundPlane.castShadow = false;
    backgroundPlane.receiveShadow = true;
    scene.add(backgroundPlane);
  
  //add center plane
 /*  var centerPlane = Leia_createTexturePlane({
        filename: 'resource/crack001.png',
        width: 100,
        height: 75,
        transparent:true
     
    });
    centerPlane.position.z = 0;
    scene.add(centerPlane);*/
}

function createText(parameters) {
    parameters = parameters || {};
    var strText = parameters.text;
    var size = parameters.size;
    var menuGeometry = new THREE.TextGeometry(
        strText, {
            size: size,
            height: 2,
            curveSegments: 4,
            font: "helvetiker",
            weight: "normal",
            style: "normal",
            bevelThickness: 0.6,
            bevelSize: 0.25,
            bevelEnabled: true,
            material: 0,
            extrudeMaterial: 1
        }
    );
    var menuMaterial = new THREE.MeshFaceMaterial(
        [
            new THREE.MeshPhongMaterial({
                color: 0xffffff,
                shading: THREE.FlatShading
            }), // front
            new THREE.MeshPhongMaterial({
                color: 0xffffff,
                shading: THREE.SmoothShading
            }) // side
        ]
    );
    var menuMesh = new THREE.Mesh(menuGeometry, menuMaterial);
    return menuMesh;
}

function addLights() {
    //Add Lights Here
    var light = new THREE.SpotLight(0xffffff);
    light.position.set(0, 60, 60);
    light.shadowCameraVisible = false;
    light.castShadow = true;
    light.shadowMapWidth = light.shadowMapHeight = 256;
    light.shadowDarkness = 0.7;
    scene.add(light);

    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
}
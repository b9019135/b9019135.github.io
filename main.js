import './style.css'


import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

var script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);


const scene = new THREE.Scene();


//Camera

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(2); //sets the distance of the camera, 
camera.position.setX(-20);
camera.position.setY(15);

//Renderer

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#background'),
});

renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0xffffff, 0 ); //Sets the background colour (Stage colour is currently white)

renderer.render(scene,camera);

//Loading GLTF format 3D objects

const loader = new GLTFLoader();

loader.load(
    'Assets/SSD/scene.gltf',

function ( gltf ) {

    console.log(gltf) //checking if the model has loaded.


    scene.add(gltf.scene)

});




//Scene Lighting

const ambientlight = new THREE.AmbientLight(0xffffff); //Ambientlighting acts as a "Spotlight" over the whole stage.
scene.add(ambientlight);



//Introducing user controls *Allows the user to rotate around the object.
const controls = new OrbitControls(camera,renderer.domElement);

//spheres

const geometry = new THREE.SphereGeometry( 0.3, 16, 8 );
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const sphere = new THREE.Mesh( geometry, material );
const sphere1 = new THREE.Mesh( geometry, material );

sphere.position.set(-5,0.1,1.2); //Position within the scene
sphere.name = "Sata Power Cable";
sphere.objectdata = "This handles power delivery to the SSD"
sphere.userData.clickable = true;

sphere1.position.set(-5,0.1,-0.7); //Position within the scene
sphere1.name = "Sata Data Cable";
sphere1.objectdata = "This handles data delivery to and from the SSD."
sphere1.userData.clickable = true;


scene.add( sphere, sphere1);

//raycaster

const clickmouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
function ClickObject( event ) {


	clickmouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	clickmouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(clickmouse, camera);
    const intersects = raycaster.intersectObjects( scene.children );

    if (intersects.length > 0) {
        var objectname = intersects[0].object.name;
        var objectdata = intersects[0].object.objectdata;

        if(objectname == 'Object_4')
        {
            objectname = 'SSD';
            objectdata = 'A solid-state drive is a solid-state storage device that uses integrated circuit assemblies to store data.';
        }

        $(".text").empty();
        $(".popup").append("<div class='text'><h1>" + objectname + "</h1>" + "<p3>" + objectdata + "</p3></div>");
        $(".popup").show();
    }
    else{
        console.log('Nothing');
    }

}

window.addEventListener( 'click', ClickObject );

//Allow the text box to be moved. src = https://www.w3schools.com/howto/howto_js_draggable.asp

dragElement(document.getElementById("popupID"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "Data")) {
    document.getElementById(elmnt.id + "Data").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


//Loading the Scene.

function animate(){
    requestAnimationFrame(animate);


    controls.update();

    renderer.render(scene,camera);
}

animate();
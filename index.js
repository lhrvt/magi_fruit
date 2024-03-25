import * as THREE from './build/three.module.js'
import {GLTFLoader} from './build/GLTFLoader.js'



let actual_color;
var color_change = false;
let mixer  ;     




const raycaster = new THREE.Raycaster();
document.addEventListener('mousedown', onMouseDown);

function onMouseDown(event) {
    const coords = new THREE.Vector2(
      (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
    );


raycaster.setFromCamera(coords, camera);

  const intersections = raycaster.intersectObjects(scene.children, true);
  if (intersections.length > 0) {
    console.log(color_change)
    const selectedObject = intersections[0].object;
    if(color_change == true){
    selectedObject.material.color.set(actual_color )
    }
    //console.log(selectedObject.name + "was clicked!");
    
    console.log(selectedObject)
  }

}

const canvas  = document.querySelector('.webgl')
const scene = new THREE.Scene()


 const loader = new GLTFLoader()

 let magi;
 
 let balade;

 let fruit;
 loader.load('asset/magi.glb', function(gltf ){
    console.log(gltf )
    
    
    mixer = new THREE.AnimationMixer( gltf.scene );
    balade = gltf.animations[0] ; 
    
    mixer.clipAction(balade).play()
    magi = gltf .scene;
    
    magi.rotation.y = -Math.PI 
    magi.scale.set(0.3,0.3,0.3)
   

    scene.add(magi);
  
    
    
 }, function(xhr){
    console.log(xhr.loaded/xhr.total * 100 + "% loaded")
  }, function(error){
     console.log('An error')
 } 
 );


 loader.load('asset/fruit.glb', function(gltf ){
  
  fruit = gltf .scene;
  fruit.scale.set(0.1,0.1,0.1)
  fruit.position.set(10,100,10)
  scene.add(fruit);


}, function(xhr){
  console.log(xhr.loaded/xhr.total * 100 + "% loaded")
}, function(error){
   console.log('An error')
} 
);

 let fond_;

 loader.load('asset/fond_.glb', function(gltf ){
  console.log(gltf )
  
  fond_= gltf .scene;
  
  fond_.position.set(-5,3,0)
  
 

  scene.add(fond_);

  
  
}, function(xhr){
  console.log(xhr.loaded/xhr.total * 100 + "% loaded")
}, function(error){
   console.log('An error')
} 
);

let fruitinstance

function createfruit(x, y) {
  

 if(!fruitinstance){
    fruitinstance = fruit.clone();
    fruitinstance.position.set(x, y, 0);
    scene.add(fruitinstance);
 }

  
  

}

 


const light = new THREE.DirectionalLight(0xffffff, 1)

light.intensity = 1;

const ambientLight = new THREE.AmbientLight(0xfffffff);
scene.add(ambientLight);   
scene.add(light) 


const sizes = {
    width : window.innerWidth,
    height : window.innerHeight 
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100);
camera.position.set(0,0.7,4);
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas : canvas 
})


renderer.setSize(sizes.width , sizes.height )


renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 
renderer.gammaOutput= true






function deplacerCube(x, y) {
  gsap.to(magi.position, {
    x: x, y: y, // Rotation vers l'angle cible
    duration: 2, // Durée de l'animation en secondes
    ease: "linear" // Fonction d'interpolation pour une transition douce
  });
  gsap.to(magi.rotation, {
     y: y, // Rotation vers l'angle cible
    duration: 2, // Durée de l'animation en secondes
    ease: "linear" // Fonction d'interpolation pour une transition douce
  });
  
}




function onDocumentMouseDown(event) {
  // Coordonnées du clic de la souris
  var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  // Conversion des coordonnées de l'écran en coordonnées 3D de la scène
  var vector = new THREE.Vector3(mouseX, mouseY, 0.5);
  vector.unproject(camera);

  var direction = vector.sub(camera.position).normalize();
  var distance = -camera.position.z / direction.z;
  var pos = camera.position.clone().add(direction.multiplyScalar(distance));

  // Déplacer le cube à la nouvelle position
  deplacerCube(pos.x, pos.y);
  //createCube(pos.x, pos.y);
  createfruit(pos.x, pos.y);
}


document.addEventListener('mousedown', onDocumentMouseDown, false);

// Ajout d'un écouteur d'événement pour détecter le mouvement de la souris



function detectCollision(object1, object2) {
    // Récupérer les positions des objets
    const position1 = new THREE.Vector3();
    const position2 = new THREE.Vector3();
    object1.getWorldPosition(position1);
    object2.getWorldPosition(position2);

    // Comparer les coordonnées
    if (position1.distanceTo(position2) < 0.5) { // ajustez cette valeur selon vos besoins
        // Les objets sont suffisamment proches, collision détectée
        return true;
    } else {
        // Pas de collision détectée
        return false;
    }
}


function animate(){

   
    requestAnimationFrame(animate)
    
    if (magi){
    const time = Date.now() * 0.001;
    //magi.rotation.y = time;
    light.position.set(Math.sin(time),1,1)
    light.rotation.y = time;
    //root.position.set(Math.sin(time ) *0.1 - 0.2, -0.4, 2)
    //console.log(time_light)
    

    renderer.render(scene,camera)
    if (fruitinstance){
      
    if (detectCollision(magi, fruitinstance)) {
      console.log("Collision détectée !");
      scene.remove(fruitinstance)
      fruitinstance = null;
      magi.scale.x += 0.005;
      magi.scale.y += 0.005;
      magi.scale.z += 0.005;
      
      }
    }
    mixer.update(0.06 );
    }
}




animate()



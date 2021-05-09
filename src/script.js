import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import gsap from 'gsap'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})



// Canvas
// const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const scene2 = new THREE.Scene();

//Init Elements
let element, object, mesh, button, breadMesh;

//Init Setting
const scale = 30;
const contentWidth = 320;
//Location Hash
// Removes any hash, and triggers event listener

window.onhashchange = function() {
    if (location.hash === '#thankyou') {
      // animate camera to about section
        console.log("Thank You from onHashChange")
        moveBread(0.4, 1, 0.6)
        // gsap.to(breadMesh.position, { duration: 0.4, delay: 1, y: 0.6 })
    } else if (location.hash === '#work') {
      // animate camera to work section
    } else if (location.hash === '') {
      // animate camera to home section
    }
}



/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
     mouse.x = event.clientX / sizes.width * 2 - 1
     mouse.y = - (event.clientY / sizes.height) * 2 + 1 
    // console.log(mouse)
})


/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked Material
const bakedMaterial = new THREE.MeshBasicMaterial({map:bakedTexture})
const material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.FrontSide, transparent: true, opacity:0 } );


/**
 * Models
 */
gltfLoader.load(
    'toaster.glb',
    (gltf)=>{
        gltf.scene.traverse((child)=>{
            // console.log(child)
            // child.geometry.scale =(10,10,10)
            child.material = bakedMaterial
        })

        scene.add(gltf.scene)
        gltf.scene.scale.set(1*scale,1*scale,1*scale); 
        breadMesh = gltf.scene.children.find((child) => child.name === 'bread')
        
        if (location.hash === '#thankyou') {
            // animate camera to about section
            console.log("Thank You from IF")
            moveBread(0.4, 1, 0.6)
        }
        
    }
)



/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
let currentIntersect = null
const rayOrigin = new THREE.Vector3(- 3, 0, 0)
const rayDirection = new THREE.Vector3(10, 0, 0)
rayDirection.normalize()


function moveBread(duration, delay, y){
    gsap.to(breadMesh.position, { duration: 0.4, delay: 1, y: 0.6 })
}

/**
 * Input
 */
function createDescription(width, height, pos, rot){
    element = document.createElement( 'p' );
    const textNode = document.createTextNode('『Lobsterr Letter』は、 世界中のメディアから「変化の種」となるようなストーリーをキュレートするウィークリーニュースレターです。コンパクトな文量で、 ロングスパンの視座を。 皮肉や批判よりも、 分析と考察を。 ファストフードのようなニュースではなく、 心と頭の栄養となるようなインサイトを。目まぐるしく進む社会のなかで、 立ち止まり、 深呼吸をして、 考えるためのきっかけをお届けします。');
    element.setAttribute("id", "description");
    element.style.width = width + 'px';
    element.style.height = height + 'px';
    element.appendChild(textNode);
    
    object = new CSS3DObject( element);
    object.position.copy( pos );
    object.rotation.copy( rot );
    element.parent = object;
    scene2.add( object );
}

function createInput( width, height, cssColor, pos, rot ) {
    element = document.createElement( 'form' );
    element.setAttribute("name", "mc-embedded-subscribe-form");
    element.setAttribute("method", "post");
    element.setAttribute("action", "https://yahoo.us1.list-manage.com/subscribe/post?u=6b2a86440b03a37f8c380cbcf&amp;id=69316c01bd");
    element.setAttribute("id", "mc-embedded-subscribe-form");
    element.setAttribute("class", "validate");
    // element.setAttribute("target", "_blank");
    element.setAttribute("novalidate", "true");
    element.style.width = width + 'px';
    element.style.height = height + 'px';
    element.style.opacity = 0.75;
    // element.style.background = cssColor;
    // element.style.borderStyle = 'solid';
    // element.style.borderWidth = 1+'px';


    const input = document.createElement( 'input' );
    input.setAttribute("type", "email");
    input.setAttribute("value", "init");
    input.setAttribute("name", "EMAIL");
    input.setAttribute("class", "email");
    input.setAttribute("id", "mce-EMAIL");
    input.setAttribute("placeholder", "email-address");
    input.setAttribute("required", "true");
    input.style.width = width*3.8/5 + 'px';
    input.style.height = height + 'px';
	input.className = 'input';
	input.textContent = 'インプット';
	element.appendChild( input );


    button = document.createElement( 'input' );
    button.setAttribute("type", "submit");
    button.setAttribute("value", "Subscribe");
    button.setAttribute("name", "subscribe");
    button.setAttribute("id", "mc-embedded-subscribe");
    button.setAttribute("class", "button");
    button.style.width = width/5 + 'px';
    button.style.height = height + 'px';
    button.style.opacity = 0.75;
    // button.style.background = cssColor;
    button.style.borderStyle = 'solid';
    button.style.borderWidth = 1+'px';
    element.appendChild( button );

    object = new CSS3DObject( element);
    object.position.copy( pos );
    object.rotation.copy( rot );
    element.parent = object;
    object.element.onclick = function() { 
        console.log('Input Clicked!') 
        input.focus()
    };
    scene2.add( object );

    // scene1追加用
    const geometry = new THREE.PlaneGeometry( width, height );
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.copy( object.position );
    mesh.rotation.copy( object.rotation );
    scene.add( mesh );
}


// bottom
createInput(
    contentWidth, 32,
    'seagreen',
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Euler( - 90 * THREE.MathUtils.DEG2RAD, 0, - 180 * THREE.MathUtils.DEG2RAD )
)
createDescription(
    contentWidth, 200,
    new THREE.Vector3( 0, 0, -120 ),
    new THREE.Euler( - 90 * THREE.MathUtils.DEG2RAD, 0, - 180 * THREE.MathUtils.DEG2RAD )
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100*scale)
camera.position.x = 0*scale
camera.position.y = 5*scale
camera.position.z = -10*scale
scene.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    // canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
document.body.appendChild( renderer.domElement );

// Rendererその２
const renderer2 = new CSS3DRenderer()
renderer2.setSize( window.innerWidth, window.innerHeight );
renderer2.domElement.style.position = 'absolute';
renderer2.domElement.style.top = 0;
document.body.appendChild( renderer2.domElement );


// Controls

const controls = new OrbitControls( camera, renderer2.domElement );
controls.minZoom = 0.5;
controls.maxZoom = 2;
controls.enableDamping = true

/**
 * Animate
 */
const clock = new THREE.Clock()

function updateCamera(ev) {
    let body = document.getElementById("body");
	camera.position.z = -1.5 + window.scrollY / 250.0;
}

window.addEventListener("scroll", updateCamera);

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Raycaster
    raycaster.setFromCamera(mouse, camera)
    const objectsToTest = [mesh]
    const intersects = raycaster.intersectObjects(objectsToTest)
    if(intersects.length)
    {
        if(!currentIntersect)
        {
            console.log('mouse enter')
        }
        currentIntersect = intersects[0]
    }
    else
    {
        if(currentIntersect)
        {
            console.log('mouse leave')
        }
        currentIntersect = null
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    renderer2.render( scene2, camera );


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
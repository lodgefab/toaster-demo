import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';


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

/**
 * Models
 */
gltfLoader.load(
    'toaster.glb',
    (gltf)=>{
        gltf.scene.traverse((child)=>{
            console.log(child)
            child.material = bakedMaterial
        })



        scene.add(gltf.scene)
    }
)



/**
 * Input
 */

function createInput( width, height, cssColor, pos, rot ) {

    const element = document.createElement( 'input' );
    element.style.width = width + 'px';
    element.style.height = height/10 + 'px';
    element.style.opacity = 0.75;
    element.style.background = cssColor;

    const object = new CSS3DObject( element );
    object.position.copy( pos );
    object.rotation.copy( rot );
    scene2.add( object );

    // scene1追加用
    // const geometry = new THREE.PlaneGeometry( width, height );
    // const mesh = new THREE.Mesh( geometry, material );
    // mesh.position.copy( object.position );
    // mesh.rotation.copy( object.rotation );
    // scene.add( mesh );
}

// bottom
createInput(
    30, 30,
    'seagreen',
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Euler( - 90 * THREE.MathUtils.DEG2RAD, 0, 0 )
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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 5
camera.position.z = -10
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

// 
// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

const controls = new OrbitControls( camera, renderer2.domElement );
controls.minZoom = 0.5;
controls.maxZoom = 2;
controls.enableDamping = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    renderer2.render( scene2, camera );


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
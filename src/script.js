import * as THREE from 'three'
import GUI from 'lil-gui'



//agrega los controles del mouse
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

//importar modelo custom
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { modelDirection } from 'three/examples/jsm/nodes/Nodes'

//debug
const gui = new GUI()
const debugObject ={}


const canvas = document.querySelector('canvas.webgl')
//escena
const scene = new THREE.Scene()





/**
 * Objects
 */
const grupo = new THREE.Group()
grupo.scale.x = 1
scene.add(grupo)

const material = new THREE.MeshToonMaterial({ color:0xff0000})

const cube1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4 ,5,30),
    material
)
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0x00ff00}),
)
cube2.position.x = 1

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0x3d4aff})
)
cube3.position.x = -1

grupo.add(cube1,cube2,cube3)


/**
 * Raycaster - eventos del mouse
 */

const raycaster = new THREE.Raycaster();

const rayOrigin =  new THREE.Vector3(- 3,0,0);
const rayDirection = new THREE.Vector3(10,0,0)
rayDirection.normalize()

raycaster.set(rayOrigin, rayDirection);

//witness varialbe

let currentIntersect = null

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)


//tamaño del canvas
const sizes ={
    width:window.innerWidth,
    height:window.innerHeight
}

//se agrego un listener (funcion) para escuchar cuando la pagina cambie de tamaño
window.addEventListener('resize',() =>{
    //actualizar el tamaño
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //actualizar camara
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //actualizar renderer
    renderer.setSize(sizes.width,sizes.height)
    //pixelratio, poner un limite de 2 para resoluciones
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

})

// MOUSE move EVENT

const mouse = new THREE.Vector2()

//primer parametro es el nombre del evento 'mousemove'
//segundo parametro es la funcion, se llama callback function, es la funcion que pasa cuando el evento ocurre
window.addEventListener('mousemove', (event) =>{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

    //console.log(mouse.y)
})

//click event
window.addEventListener('click',() => {
    if(currentIntersect)
    {
        console.log('clickeo en el cubo')
    }
})

//camara
const camera = new THREE.PerspectiveCamera(75,sizes.width /sizes.height)
camera.position.z= 3
scene.add(camera)

//orbit controls, necestias dos variable, camara y el canvas
const controls = new OrbitControls(camera,canvas)
controls.enableDamping = true
controls.enableZoom = true

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas:canvas,
    antialias: true
})

renderer.setSize(sizes.width,sizes.height)

//bg color
renderer.setClearColor( 0xffffff, 0);

//MODELOS
const gltfLoader = new GLTFLoader()

let model = null

gltfLoader.load(
    'static/models/Duck/cuarto2.gltf',
    (gltf)=>{
        model = gltf.scene
        scene.add(model)
    }
)

// Animate
const clock = new THREE.Clock()



const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    //grupo.rotation.y += 0.01

    //cast a ray
    raycaster.setFromCamera(mouse,camera)
    const objectsToTest = [cube1,cube2,cube3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    for (const object of objectsToTest)
    {
        object.material.color.set('#ff0000')
    }

    for (const intersect of intersects)
    {
        intersect.object.material.color.set('#0000ff')
    }

    if(intersects.length)
    {
        if (currentIntersect === null)
        {
            console.log('mouse enter')
        }
        //console.log('hovereado')
        currentIntersect = intersects[0]
    }
    else
    {
        if (currentIntersect)
        {
            console.log('mouse leave')
        }
        //console.log('no hovereado')
        currentIntersect = null
    }

    //para el modelo de blender
    if (model){
        const modelIntersects = raycaster.intersectObject(model)
        if (modelIntersects.length)
        {
            //model.scale.set(2,2,2)
            //model.rotation.y += 0.01
            model.position.y += 0.01
        }
        else
        {
            model.scale.set(1,1,1)
            model.position.y = 0
        }
    }
    
}

tick()

/* global THREE, requestAnimationFrame */

import React from 'react'
import throttle from 'lodash/throttle'
import values from 'lodash/values'
import Layout from '../components/Layout'
import TWEEN from 'tween.js'
import word from '../lib/word'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.three = {}
    this.renderThree = this.renderThree.bind(this)
    this.renderLoop = this.renderLoop.bind(this)
    this.handleResize = throttle(this.handleResize.bind(this), 100, false)
  }

  async componentDidMount () {
    global.results = []
    window.addEventListener('resize', this.handleResize)
    // window.addEventListener( "mousemove", this.onDocumentMouseMove, true );
    window.addEventListener("keydown", this.handleKeyDown, true);
    this.initThree(window.innerWidth, window.innerHeight)
    this.initScene()
    this.initEffects()
    this.initModel()
    this.renderLoop()
  }

  // onDocumentMouseMove = (event) => {
  //   event.preventDefault();
  //   if (this.stopMouseMove) return
  //   var intersects = this.getIntersects( event.layerX, event.layerY );
  //   if ( intersects.length > 0 ) {
  //     var res = intersects.filter( function ( res ) {
  //       return res && res.object;
  //     } )[ 0 ];
  //     if ( res && res.object && res.object.material.color.r !== 1 ) {
  //       global.results.push({x: res.object.position.x, y: res.object.position.y, z: res.object.position.z})
  //       res.object.material.color.set( '#f00' );
  //     }
  //   }
  // }

  // getIntersects = ( x, y ) => {
  //   x = ( x / window.innerWidth ) * 2 - 1;
  //   y = - ( y / window.innerHeight ) * 2 + 1;
  //   var mouseVector = new THREE.Vector3();
  //   mouseVector.set( x, y, 0.5 );
  //   this.three.raycaster.setFromCamera( mouseVector, camera );
  //   return this.three.raycaster.intersectObjects( this.three.scene.children, true );
  // }

  handleKeyDown = (e) => {
    console.log('handleKeyDown', e.code)
    if (e.code === 'KeyZ') {
      if (!this.stopMouseMove) {
        this.stopMouseMove = true
      } else {
        this.stopMouseMove = !this.stopMouseMove
      }
    }
    if (e.code === 'ArrowLeft') {
      this.prev()
    }
    if (e.code === 'ArrowRight') {
      this.next()
    }
  }

  componentWillUnmount () {
    this.renderLoop = () => {}
    window.removeEventListener('resize', this.handleResize)
    // window.removeEventListener('mousemove', this.onDocumentMouseMove, true)
    window.removeEventListener("keydown", this.handleKeyDown, true);
  }

  handleResize () {
    const { renderer, camera, composer } = this.three

    let width = window.innerWidth
    let height = window.innerHeight
    console.log('width', width, 'height', height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    composer.setSize(width, height)
  }

  initThree (width, height) {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    })
    renderer.setClearColor(0xffffff)
    renderer.setPixelRatio(1)
    renderer.setSize(width, height)

    renderer.gammaInput = true
    renderer.gammaOutput = true

    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000)
    camera.lookAt(new THREE.Vector3())

    let controls

    controls = new THREE.OrbitControls(camera, this.canvas)
    controls.enableZoom = true
    controls.enablePan = true
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    controls.rotateSpeed = 0.12

    const raycaster = new THREE.Raycaster()

    this.three.renderer = renderer
    this.three.camera = camera
    this.three.controls = controls
    this.three.raycaster = raycaster

    global.renderer = renderer
    global.camera = camera
    global.controls = controls
    global.raycaster = raycaster
  }

  initScene () {
    const { renderer } = this.three
    const scene = new THREE.Scene()

    scene.background = new THREE.Color(0xffffff)

    const groundGrid = new THREE.GridHelper(100, 100, 0xcccccc, 0x444444)
    groundGrid.rotateX(0.1)
    groundGrid.translateZ(-0.1)
    scene.add(groundGrid)

    const light = new THREE.DirectionalLight(0xbbbbbb)
    light.position.set(50, 50, 10)
    light.castShadow = true
    scene.add(light)
    scene.add(new THREE.AmbientLight(0x555555))

    let hemiLight = new THREE.HemisphereLight(0xcccccc, 0xffffff, 0.5)
    hemiLight.groundColor.setHSL(1, 0, 0.5)
    hemiLight.position.set(0, 500, 100)
    scene.add(hemiLight)

    scene.fog = new THREE.FogExp2(0xffffff, 0.03)
    renderer.setClearColor(scene.fog.color)

    this.three.scene = scene
  }

  initModel = () => {
    console.log('initModelScene!!!!!')

    // 
    this.dummies = [
      {
        target: {"x":0.04168890159031652,"y":1.6075223740189952,"z":-4.204610862005459},
        rotation: {"x":0.05563813933552465,"y":-0.0034378877876218316,"z":0.0001914749181576407},
        position: {"x":0.009585824698234734,"y":1.0882421802046065,"z":5.118926212246799}
      },
      {
        target: {"x":4.847309178657104,"y":-2.0080406238234656,"z":0.423365677613197},
        rotation: {"x":0.19622031285294989,"y":-0.04313935507952845,"z":0.008572286541377382},
        position: {"x":4.499066923215277,"y":-3.580906804929982,"z":8.336041856243057}
      },
      {
        target: {"x":8.583454624039621,"y":-0.037916843924227665,"z":-1.0279975820024243},
        rotation: {"x":-0.23034743779720207,"y":0.09771101699021172,"z":0.02287376394769237},
        position: {"x":10.118028881902896,"y":3.5364170341838985,"z":14.21372236030821}
      },
      {
        target: {"x":5.637820222747756,"y":-0.9641979725475844,"z":-3.0374486671224177},
        rotation: {"x":0.24372315325259145,"y":-0.45016995636091345,"z":0.10778009122319625},
        position: {"x":-5.793785111717499,"y":-6.6725507980280465,"z":19.918414845729707}
      },
      {
        target: {"x":-7.223609390751975,"y":-4.449748100648112,"z":-3.235287933710765},
        rotation: {"x":-0.01660228248487827,"y":0.025689089763583615,"z":0.00042648977702289595},
        position: {"x":-6.548769793907435,"y":-4.013730380817171,"z":23.024815687376865}
      },
      {
        target: {"x":-8.728695939259575,"y":8.349658492821545,"z":21.924984541757567},
        rotation: {"x":0.08803319201219459,"y":-0.03667399190646657,"z":0.0032361578608104537},
        position: {"x":-8.957793985156139,"y":7.800681953822031,"z":28.14488447492582}
      },
      {
        target: {"x":0.1622957997569125,"y":-3.9902934543089152,"z":13.502638532043227},
        rotation: {"x":0.1289369515397907,"y":-0.016478068964636182,"z":0.002136384686519976},
        position: {"x":-0.1559245167093155,"y":-6.473173104084799,"z":32.65234908892612}
      },
      {
        target: {"x":0.1622957997569125,"y":-3.9902934543089152,"z":13.502638532043227},
        rotation: {"x":0.10097982515264096,"y":-0.08951486794775967,"z":0.009057689778807852},
        position: {"x":-2.068902863703856,"y":-6.496271082713816,"z":38.234846904263634},
        duration: 3000
      },
      {
        target: {"x":0.1622957997569125,"y":-3.9902934543089152,"z":13.502638532043227},
        rotation: {"x":0.19506284443157462,"y":-0.006899326748472167,"z":0.0013631235335524118},
        position: {"x":-0.018964576555341256,"y":-9.082502319224787,"z":39.27617371206135},
        duration: 3000
      },
      {
        target: {"x":0.16229579975691166,"y":-3.9902934543089152,"z":13.502638532043227},
        rotation: {"x":0.12893695153979065,"y":-0.016478068964635943,"z":0.002136384686519943},
        position: {"x":-0.3173703387246788,"y":-7.732836693369933,"z":42.36775882939902},
        duration: 3000
      },

  
      {
        target: {"x":6.144756127792985,"y":9.660596712788424,"z":2.1980333853298513},
        rotation: {"x":0.05431055266183851,"y":-0.006519820639620049,"z":0.00035444109802562667},
        position: {"x":5.911737548938378,"y":7.720517571205255,"z":37.8848596504053},
      },
      {
        target: {"x":3.9997739777328456,"y":9.051179964850755,"z":1.9850453347173265},
        rotation:{"x":0.1299511730713895,"y":-0.028903275118999188,"z":0.0037767574389957945},
        position: {"x":2.7316837862261014,"y":3.3673732873188005,"z":45.47657938896243},
      },
      {
        target: {"x":3.9900705237040666,"y":9.394735665067731,"z":2.047535183857832},
        rotation: {"x":0.1841664525065421,"y":-0.15148509031885782,"z":0.028103022871118658},
        position: {"x":-3.527705781198779,"y":0.376277246785623,"z":50.461708711383594},
      },
      {
        target: {"x":0.17200928951473501,"y":8.27842384947047,"z":1.036964516290052},
        rotation: {"x":0.2305919534415037,"y":-0.10595295746287677,"z":0.02482273507610776},
        position: {"x":-5.972839351013657,"y":-4.927148855255352,"z":57.28645700376735},
      },
      {
        target: {"x":-0.32311849179209784,"y":1.6075223740189948,"z":-4.203116381275647},
        rotation: {"x":0.15025105270145714,"y":0.041325367200801606,"z":-0.0062544684621666236},
        position: {"x":2.528742228140031,"y":-8.716441971339679,"z":63.99046928527416},
      },
      {
        target:  {"x":-0.32053755357901514,"y":2.0595184597706933,"z":-4.221543055098817},
        rotation: {"x":-0.041543200699153744,"y":-0.13904149403837568,"z":-0.005760885953106631},
        position: {"x":-10.391147908215755,"y":5.048168256457985,"z":67.67783495576461},
      },
      {
        target:  {"x":-0.32053755357901514,"y":2.0595184597706933,"z":-4.221543055098817},
        rotation: {"x":-0.0008836974097287115,"y":0.13227353580307136,"z":0.00011654925262010647},
        position: {"x":10.298134173685312,"y":2.1300458021531856,"z":75.58781617497884},
      },
      {
        target:  {"x":-0.32311849179209784,"y":1.6075223740189952,"z":-4.203116381275647},
        rotation: {"x":0.017226239328065517,"y":0.00409599878540551,"z":-0.00007056543803063446},
        position: {"x":0.024017300210810166,"y":0.1476793995718957,"z":80.5338098996226}
      }, 
      {
        target: {"x":-0.32311849179209784,"y":1.6075223740189952,"z":-4.203116381275647},
        rotation: {"x":0.0172262393280664,"y":0.004095998785406283,"z":-0.00007056543803065142},
        position: {"x":0.042287605053138166,"y":0.07084555881144006,"z":84.9936481249332},
      },
      {
        target: {"x":-0.32311849179209784,"y":1.6075223740189952,"z":-4.203116381275647},
        rotation: {"x":0.017226239328066405,"y":0.004095998785406282,"z":-0.0000705654380306514},
        position: {"x":0.06151950488709679,"y":-0.01003216830474285,"z":89.68821467789131}
      },





      {
        target: {"x":0.49064905365178746,"y":7.449549439769696,"z":-3.8776896597857} ,
        rotation:{"x":0.05563813933552464,"y":-0.0034378877876218438,"z":0.00019147491815764132},
        position: {"x":-0.17134478435291756,"y":-3.2584674166395198,"z":188.3818907010532},
        duration: 8000
      }
    ]
    this.currentIndex = 0

    // set an initial scale for camera/controls
    const { camera, scene } = this.three

    const data = this.dummies[0]
    camera.position.set(...values(data.position))
    camera.rotation.set(...values(data.rotation))
    // camera.lookAt(new THREE.Vector3(0, 4.65267575189557, 0))
    camera.zoom = 0.8
    camera.updateProjectionMatrix()

    // compute the rotation center from camera's target
    let { controls } = this.three
    controls.target.set(...values(data.target))
    controls.update()

    // photo1
    let k = 2.2
    var geometryPhoto1 = new THREE.PlaneGeometry(k, k * 3 / 4)
    var loaderPhoto1 = new THREE.TextureLoader()
    var materialPhoto1 = new THREE.MeshBasicMaterial({
      map: loaderPhoto1.setCrossOrigin(true).load('/static/photo1.jpg')
    })
    var photo1 = new THREE.Mesh(geometryPhoto1, materialPhoto1)
    photo1.position.set(0, 1.5, 0.01)
    scene.add(photo1)

    // photo2
    // const video1 = document.getElementById( 'video1' );
    // const texture1 = new THREE.VideoTexture( video1 );
    // const material1 = new THREE.MeshBasicMaterial( { map: texture1 } );
    // var geometryPhoto2 = new THREE.PlaneBufferGeometry(k, k * 3 / 4)
    // texture1.minFilter = THREE.LinearFilter
    var geometryPhoto2 = new THREE.PlaneGeometry(k, k * 3 / 4)
    var loaderPhoto2 = new THREE.TextureLoader()
    var materialPhoto2 = new THREE.MeshBasicMaterial({
      map: loaderPhoto2.setCrossOrigin(true).load('/static/photo2.jpg')
    })
    var photo2 = new THREE.Mesh(geometryPhoto2, materialPhoto2)
    photo2.position.set(5, -3, 6.01)
    scene.add(photo2)

    // photo3
    var geometryPhoto3 = new THREE.PlaneGeometry(2, 1.5)
    var loaderPhoto3 = new THREE.TextureLoader()
    var materialPhoto3 = new THREE.MeshBasicMaterial({
      map: loaderPhoto3.setCrossOrigin(true).load('/static/photo3.jpg')
    })
    var photo3 = new THREE.Mesh(geometryPhoto3, materialPhoto3)
    photo3.position.set(10, 3, 12.01)
    scene.add(photo3)

    // photo4
    var geometryPhoto4 = new THREE.PlaneGeometry(2, 1.5)
    var loaderPhoto4 = new THREE.TextureLoader()
    var materialPhoto4 = new THREE.MeshBasicMaterial({
      map: loaderPhoto4.setCrossOrigin(true).load('/static/photo4.jpg')
    })
    var photo4 = new THREE.Mesh(geometryPhoto4, materialPhoto4)
    photo4.position.set(-5, -6, 18.01)
    scene.add(photo4)

    // video1
    const video1 = document.getElementById( 'video1' );
    const texture1 = new THREE.VideoTexture( video1 );
    const material1 = new THREE.MeshBasicMaterial( { map: texture1 } );
    var geometryVideo1 = new THREE.PlaneBufferGeometry(k, k * 3 / 4)
    texture1.minFilter = THREE.LinearFilter
    var photo4_1 = new THREE.Mesh(geometryVideo1, material1)
    photo4_1.position.set(-7.2, -3, 19.51)
    scene.add(photo4_1)

    // photo5
    const video2 = document.getElementById( 'video2' );
    const texture2 = new THREE.VideoTexture( video2 );
    const material2 = new THREE.MeshBasicMaterial( { map: texture2 } );
    var geometryVideo2 = new THREE.PlaneBufferGeometry(k, k * 3 / 4)
    texture2.minFilter = THREE.LinearFilter
    var photo5 = new THREE.Mesh(geometryVideo2, material2)
    photo5.position.set(-10, 10, 24.01)
    scene.add(photo5)

    var geometryPhoto5 = new THREE.PlaneGeometry(k, k * 3 / 4)
    var loaderPhoto5 = new THREE.TextureLoader()
    var materialPhoto5 = new THREE.MeshBasicMaterial({
      map: loaderPhoto5.setCrossOrigin(true).load('/static/photo5.jpg')
    })
    var photo5_1 = new THREE.Mesh(geometryPhoto5, materialPhoto5)
    photo5_1.position.set(-8.7, 7.5, 25.31)
    scene.add(photo5_1)

    // photo6
    const video3 = document.getElementById( 'video3' );
    const texture3 = new THREE.VideoTexture( video3 );
    const material3 = new THREE.MeshBasicMaterial( { map: texture3 } );
    var geometryVideo3 = new THREE.PlaneBufferGeometry(k, k * 3 / 4)
    texture3.minFilter = THREE.LinearFilter
    var photo6 = new THREE.Mesh(geometryVideo3, material3)
    photo6.position.set(0, -6, 30.01)
    scene.add(photo6)

    var geometryPhoto6_1 = new THREE.PlaneGeometry(k, k * 3 / 4)
    var loaderPhoto6_1 = new THREE.TextureLoader()
    var materialPhoto6_1 = new THREE.MeshBasicMaterial({
      map: loaderPhoto6_1.setCrossOrigin(true).load('/static/photo5.jpg')
    })
    var photo6 = new THREE.Mesh(geometryPhoto6_1, materialPhoto6_1)
    photo6.position.set(-8.7, 7.5, 25.31)
    scene.add(photo6)

    var geometryPhoto6_1 = new THREE.PlaneGeometry(k, k * 3 / 4)
    var loaderPhoto6_1 = new THREE.TextureLoader()
    var materialPhoto6_1 = new THREE.MeshBasicMaterial({
      map: loaderPhoto6_1.setCrossOrigin(true).load('/static/photo6_1.jpg')
    })
    var photo6_1 = new THREE.Mesh(geometryPhoto6_1, materialPhoto6_1)
    photo6_1.position.set(-3, -6, 35.01)
    scene.add(photo6_1)

    var geometryPhoto6_2 = new THREE.PlaneGeometry(k, k * 3 / 4)
    var loaderPhoto6_2 = new THREE.TextureLoader()
    var materialPhoto6_2 = new THREE.MeshBasicMaterial({
      map: loaderPhoto6_2.setCrossOrigin(true).load('/static/photo6_2.jpg')
    })
    var photo6_2 = new THREE.Mesh(geometryPhoto6_2, materialPhoto6_2)
    photo6_2.position.set(0, -9, 37.01)
    scene.add(photo6_2)

    var geometryPhoto6_3 = new THREE.PlaneGeometry(k, k * 3 / 4)
    var loaderPhoto6_3 = new THREE.TextureLoader()
    var materialPhoto6_3 = new THREE.MeshBasicMaterial({
      map: loaderPhoto6_3.setCrossOrigin(true).load('/static/photo6_3.jpg')
    })
    var photo6_3 = new THREE.Mesh(geometryPhoto6_3, materialPhoto6_3)
    photo6_3.position.set(1, -6, 39.01)
    scene.add(photo6_3)

    // photo7
    const video4 = document.getElementById( 'video4' );
    const texture4 = new THREE.VideoTexture( video4 );
    const material4 = new THREE.MeshBasicMaterial( { map: texture4 } );
    var geometryVideo4 = new THREE.PlaneBufferGeometry(k, k * 3 / 4)
    texture4.minFilter = THREE.LinearFilter
    var photo7 = new THREE.Mesh(geometryVideo4, material4)
    photo7.position.set(6, 8, 36.01)
    scene.add(photo7)

    // photo8
    const video5 = document.getElementById( 'video5' );
    const texture5 = new THREE.VideoTexture( video5 );
    const material5 = new THREE.MeshBasicMaterial( { map: texture5 } );
    var geometryVideo5 = new THREE.PlaneBufferGeometry(k, k * 3 / 4)
    texture5.minFilter = THREE.LinearFilter
    var photo8 = new THREE.Mesh(geometryVideo5, material5)
    photo8.position.set(3, 4, 42.01)
    scene.add(photo8)

    // photo9
    const video6 = document.getElementById( 'video6' );
    const texture6 = new THREE.VideoTexture( video6 );
    const material6 = new THREE.MeshBasicMaterial( { map: texture6 } );
    var geometryVideo6 = new THREE.PlaneBufferGeometry(k, k * 3 / 4)
    texture6.minFilter = THREE.NearestFilter
    var photo9 = new THREE.Mesh(geometryVideo6, material6)
    photo9.position.set(-3, 1, 48.01)
    scene.add(photo9)

    // photo10
    const video7 = document.getElementById( 'video7' );
    const texture7 = new THREE.VideoTexture( video7 );
    const material7 = new THREE.MeshBasicMaterial( { map: texture7 } );
    var geometryVideo7 = new THREE.PlaneBufferGeometry(k, k * 3 / 4)
    texture7.minFilter = THREE.NearestFilter
    var photo10 = new THREE.Mesh(geometryVideo7, material7)
    photo10.position.set(-6, -4, 54.01)
    scene.add(photo10)

    // photo11
    const video8 = document.getElementById( 'video8' );
    const texture8 = new THREE.VideoTexture( video8 );
    const material8 = new THREE.MeshBasicMaterial( { map: texture8 } );
    var geometryVideo8 = new THREE.PlaneBufferGeometry(k, k * 3 / 4)
    texture8.minFilter = THREE.NearestFilter
    var photo11 = new THREE.Mesh(geometryVideo8, material8)
    photo11.position.set(3, -8, 60.01)
    scene.add(photo11)

    // photo12
    var geometryPhoto12 = new THREE.PlaneGeometry(k, k * 3 / 4)
    var loaderPhoto12 = new THREE.TextureLoader()
    var materialPhoto12 = new THREE.MeshBasicMaterial({
      map: loaderPhoto12.setCrossOrigin(true).load('/static/photo12.jpg')
    })
    var photo12 = new THREE.Mesh(geometryPhoto12, materialPhoto12)
    photo12.position.set(-10, 5, 66.01)
    scene.add(photo12)

    // photo13
    const video9 = document.getElementById( 'video9' );
    const texture9 = new THREE.VideoTexture( video9 );
    const material9 = new THREE.MeshBasicMaterial( { map: texture9 } );
    var geometryVideo9 = new THREE.PlaneBufferGeometry(k, k * 3 / 4)
    texture9.minFilter = THREE.NearestFilter
    var photo13 = new THREE.Mesh(geometryVideo9, material9)
    photo13.position.set(10, 2, 72.01)
    scene.add(photo13)

    // photo14
    var geometryPhoto14 = new THREE.PlaneGeometry(2, 1.5)
    var loaderPhoto14 = new THREE.TextureLoader()
    var materialPhoto14 = new THREE.MeshBasicMaterial({
      map: loaderPhoto14.setCrossOrigin(true).load('/static/photo14.jpg')
    })
    var photo14 = new THREE.Mesh(geometryPhoto14, materialPhoto14)
    photo14.position.set(0, 0, 78.01)
    scene.add(photo14)

    // photo14
    var geometryPhoto14 = new THREE.PlaneGeometry(2, 1.5)
    var loaderPhoto14 = new THREE.TextureLoader()
    var materialPhoto14 = new THREE.MeshBasicMaterial({
      map: loaderPhoto14.setCrossOrigin(true).load('/static/photo14.jpg')
    })
    var photo14 = new THREE.Mesh(geometryPhoto14, materialPhoto14)
    photo14.position.set(0, 0, 78.01)
    scene.add(photo14)
    
    // photo15
    var geometryPhoto15 = new THREE.PlaneGeometry(2, 1.5)
    var loaderPhoto15 = new THREE.TextureLoader()
    var materialPhoto15 = new THREE.MeshBasicMaterial({
      map: loaderPhoto15.setCrossOrigin(true).load('/static/photo15.jpg')
    })
    var photo15 = new THREE.Mesh(geometryPhoto15, materialPhoto15)
    photo15.position.set(0, 0, 81.01)
    scene.add(photo15)

    // photo16
    var geometryPhoto16 = new THREE.PlaneGeometry(2, 1.5)
    var loaderPhoto16 = new THREE.TextureLoader()
    var materialPhoto16 = new THREE.MeshBasicMaterial({
      map: loaderPhoto16.setCrossOrigin(true).load('/static/photo16.jpg')
    })
    var photo16 = new THREE.Mesh(geometryPhoto16, materialPhoto16)
    photo16.position.set(0, 0, 87.01)
    scene.add(photo16)




    const geometryCircle1 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle1 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle1 = new THREE.Mesh(geometryCircle1, materialCircle1)
    // x, y, z
    circle1.position.set(0, 1.5, 0)
    scene.add(circle1)

    // circle2
    const geometryCircle2 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle2 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle2 = new THREE.Mesh(geometryCircle2, materialCircle2)
    // x, y, z
    circle2.position.set(5, -3, 6)
    scene.add(circle2)

    // circle3
    const geometryCircle3 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle3 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle3 = new THREE.Mesh(geometryCircle3, materialCircle3)
    // x, y, z
    circle3.position.set(10, 3, 12)
    scene.add(circle3)

    // circle4
    const geometryCircle4 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle4 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle4 = new THREE.Mesh(geometryCircle4, materialCircle4)
    // x, y, z
    circle4.position.set(-5, -6, 18)
    scene.add(circle4)

    // circle4_1
    const geometryCircle4_1 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle4_1 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle4_1 = new THREE.Mesh(geometryCircle4_1, materialCircle4_1)
    // x, y, z
    circle4_1.position.set(-7.2, -3, 19.5)
    scene.add(circle4_1)

    // circle5
    const geometryCircle5 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle5 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle5 = new THREE.Mesh(geometryCircle5, materialCircle5)
    // x, y, z
    circle5.position.set(-10, 10, 24)
    scene.add(circle5)

    // circle5_1
    const geometryCircle5_1 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle5_1 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle5_1 = new THREE.Mesh(geometryCircle5, materialCircle5_1)
    // x, y, z
    circle5_1.position.set(-8.7, 7.5, 25.3)
    scene.add(circle5_1)

    // circle6
    const geometryCircle6 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle6 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle6 = new THREE.Mesh(geometryCircle6, materialCircle6)
    // x, y, z
    circle6.position.set(0, -6, 30)
    scene.add(circle6)

    const geometryCircle6_1 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle6_1 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle6_1 = new THREE.Mesh(geometryCircle6_1, materialCircle6_1)
    // x, y, z
    circle6_1.position.set(-3, -6, 35)
    scene.add(circle6_1)

    const geometryCircle6_2 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle6_2 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle6_2 = new THREE.Mesh(geometryCircle6_2, materialCircle6_2)
    // x, y, z
    circle6_2.position.set(0, -9, 37)
    scene.add(circle6_2)

    const geometryCircle6_3 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle6_3 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle6_3 = new THREE.Mesh(geometryCircle6_3, materialCircle6_3)
    // x, y, z
    circle6_3.position.set(1, -6, 39)
    scene.add(circle6_3)

    // circle7
    const geometryCircle7 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle7 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle7 = new THREE.Mesh(geometryCircle7, materialCircle7)
    // x, y, z
    circle7.position.set(6, 8, 36)
    scene.add(circle7)

    // circle8
    const geometryCircle8 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle8 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle8 = new THREE.Mesh(geometryCircle8, materialCircle8)
    // x, y, z
    circle8.position.set(3, 4, 42)
    scene.add(circle8)

    // circle9
    const geometryCircle9 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle9 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle9 = new THREE.Mesh(geometryCircle9, materialCircle9)
    // x, y, z
    circle9.position.set(-3, 1, 48)
    scene.add(circle9)

    // circle10
    const geometryCircle10 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle10 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle10 = new THREE.Mesh(geometryCircle10, materialCircle10)
    // x, y, z
    circle10.position.set(-6, -4, 54)
    scene.add(circle10)

    // circle11
    const geometryCircle11 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle11 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle11 = new THREE.Mesh(geometryCircle11, materialCircle11)
    // x, y, z
    circle11.position.set(3, -8, 60)
    scene.add(circle11)

    // circle12
    const geometryCircle12 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle12 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle12 = new THREE.Mesh(geometryCircle12, materialCircle12)
    // x, y, z
    circle12.position.set(-10, 5, 66)
    scene.add(circle12)

    // circle13
    const geometryCircle13 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle13 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle13 = new THREE.Mesh(geometryCircle13, materialCircle13)
    // x, y, z
    circle13.position.set(10, 2, 72)
    scene.add(circle13)

    // circle14
    const geometryCircle14 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle14 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle14 = new THREE.Mesh(geometryCircle14, materialCircle14)
    // x, y, z
    circle14.position.set(0, 0, 78)
    scene.add(circle14)

    // circle15
    const geometryCircle15 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle15 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle15 = new THREE.Mesh(geometryCircle15, materialCircle15)
    // x, y, z
    circle15.position.set(0, 0, 81)
    scene.add(circle15)

    // circle16
    const geometryCircle16 = new THREE.CircleGeometry(1.5, 64)
    const materialCircle16 = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const circle16 = new THREE.Mesh(geometryCircle16, materialCircle16)
    // x, y, z
    circle16.position.set(0, 0, 87)
    scene.add(circle16)

    const geometryCircle = new THREE.CircleGeometry(0.3, 32)
    for(let i = 0; i < word.length; i++) {
      const point = word[i]
      // circle14
      const materialCircle = new THREE.MeshBasicMaterial({ color: 0x000000 })
      const circle = new THREE.Mesh(geometryCircle, materialCircle)
      // x, y, z
      // var xmin = -20
      // var xmax = 20
      // var ymin = -20
      // var ymax = 20
      // var zmin = 78
      // var zmax = 88
      // circle.position.set(Math.random() * (xmax - xmin) + xmin, Math.random() * (ymax - ymin) + ymin, 78 + Math.random() * (zmax - zmin) + zmin)
      circle.position.set(point.x, point.y, point.z)
      scene.add( circle );
    }

    var closedSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.2, 77.9),
      new THREE.Vector3(11.5, 3.7, 70),
      new THREE.Vector3(-10.3, 6.3, 66),
      new THREE.Vector3(3.5, -7.2, 60),
      new THREE.Vector3(-6, -2.8, 54),
      new THREE.Vector3(-3, 2.2, 48),
      new THREE.Vector3(3, 5.2, 42),
      new THREE.Vector3(6, 9.3, 36),
      new THREE.Vector3(0, -5.2, 30),
      new THREE.Vector3(-10, 11.2, 24),
      new THREE.Vector3(-5, -5, 18),
      new THREE.Vector3(10, 4.2, 12),
      new THREE.Vector3(5, -1.95, 6),
      new THREE.Vector3(0, 2.7, 0)
    ])

    var tubeGeometry = new THREE.TubeBufferGeometry(closedSpline, 400, 0.05, 8, false)

    var material = new THREE.MeshLambertMaterial({
      color: 0x666666,
      wireframe: false,
      opacity: 0.5,
      transparent: true
    })
    var mesh = new THREE.Mesh(tubeGeometry, material)
    mesh.material.opacity = 0
    scene.add(mesh)
    this.tube = mesh
  }
  initEffects () {
    const { scene, camera, renderer } = this.three

    renderer.setScissor(0, 0, window.innerWidth, window.innerHeight)
    const composer = new THREE.EffectComposer(renderer)

    let effect

    const renderPass = new THREE.RenderPass(scene, camera)
    composer.addPass(renderPass)

    effect = new THREE.ShaderPass(THREE.VignetteShader)
    effect.uniforms['offset'].value = 0.5
    effect.uniforms['darkness'].value = 4
    effect.renderToScreen = true
    composer.addPass(effect)

    this.three.composer = composer
  }

  renderThree () {
    const { scene, renderer, composer, controls } = this.three

    scene.updateMatrixWorld()

    TWEEN.update()
    controls.update()
    // console.log('control.target', JSON.stringify(controls.target), JSON.stringify(camera.rotation), JSON.stringify(camera.position))

    renderer.clear()
    composer.render(0.01)
  }

  renderLoop () {
    requestAnimationFrame(this.renderLoop)
    this.renderThree()
  }

  prev = () => {
    const { camera, controls } = this.three

    const data = this.dummies[this.currentIndex - 1]
    if (!data) {
      return
    }

    new TWEEN.Tween(camera.position)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .to(
        data.position,
        800
      )
      .start()
    new TWEEN.Tween(camera.rotation)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .to(
        data.rotation,
        800
      )
      .start()
    new TWEEN.Tween(controls.target)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .to(
        data.target,
        800
      )
      .start()

    this.currentIndex = this.currentIndex - 1
    this.handleVideos()
  }

  next = () => {
    const { camera, controls } = this.three

    const data = this.dummies[this.currentIndex + 1]
    if (!data) {
      return
    }

    new TWEEN.Tween(camera.position)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .to(
        data.position,
        data.duration || 800
      )
      .start()
    new TWEEN.Tween(camera.rotation)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .to(
        data.rotation,
        data.duration || 800
      )
      .start()
    new TWEEN.Tween(controls.target)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .to(
        data.target,
        data.duration || 800
      )
      .start()
    new TWEEN.Tween(this.tube.material)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .to(
        { opacity: 0.5 },
        800
      )
      .start()

    this.currentIndex = this.currentIndex + 1
    this.handleVideos()
  }

  handleVideos = () => {
    if (this.currentIndex === 4) {
      const video1 = document.getElementById( 'video1' );
      video1.play();
    } else {
      // console.log('pause')
      const video1 = document.getElementById( 'video1' );
      video1.pause();
      video1.currentTime = 0;
    }
    if (this.currentIndex === 5) {
      const video2 = document.getElementById( 'video2' );
      video2.play();
    } else {
      // console.log('pause')
      const video2 = document.getElementById( 'video2' );
      video2.pause();
      video2.currentTime = 0;
    }
    if (this.currentIndex === 6 || this.currentIndex === 7 || this.currentIndex === 8 || this.currentIndex === 9) {
      const video3 = document.getElementById( 'video3' );
      video3.play();
    } else {
      // console.log('pause')
      const video3 = document.getElementById( 'video3' );
      video3.pause();
      video3.currentTime = 0;
    }
    if (this.currentIndex === 10) {
      const video4 = document.getElementById( 'video4' );
      video4.play();
    } else {
      // console.log('pause')
      const video4 = document.getElementById( 'video4' );
      video4.pause();
      video4.currentTime = 0;
    }
    if (this.currentIndex === 11) {
      const video5 = document.getElementById( 'video5' );
      video5.play();
    } else {
      // console.log('pause')
      const video5 = document.getElementById( 'video5' );
      video5.pause();
      video5.currentTime = 0;
    }
    if (this.currentIndex === 12) {
      const video6 = document.getElementById( 'video6' );
      video6.play();
    } else {
      // console.log('pause')
      const video6 = document.getElementById( 'video6' );
      video6.pause();
      video6.currentTime = 0;
    }
    if (this.currentIndex === 13) {
      const video7 = document.getElementById( 'video7' );
      video7.play();
    } else {
      // console.log('pause')
      const video7 = document.getElementById( 'video7' );
      video7.pause();
      video7.currentTime = 0;
    }
    if (this.currentIndex === 14) {
      const video8 = document.getElementById( 'video8' );
      video8.play();
    } else {
      // console.log('pause')
      const video8 = document.getElementById( 'video8' );
      video8.pause();
      video8.currentTime = 0;
    }
    if (this.currentIndex === 16) {
      const video9 = document.getElementById( 'video9' );
      video9.play();
    } else {
      // console.log('pause')
      const video9 = document.getElementById( 'video9' );
      video9.pause();
      video9.currentTime = 0;
    }
  }

  render () {
    return (
      <Layout>
        <div style={{ display: 'flex' }}>
          <canvas
            className='view-canvas'
            ref={canvas => (this.canvas = canvas)}
          />
          <div className='control-bar fixed top-0 left-0 white w-100 z-999 mb3 ph4 flex items-end content-end justify-between flex-wrap'>
            <div className='pointer'>
              <a className='pa1' onClick={this.prev}>
                <span className='v-mid'>Prev</span>
              </a>
            </div>
            <div className='pointer'>
              <a className='pa1' onClick={this.next}>
                <span className='v-mid'>Next</span>
              </a>
            </div>
          </div>
        </div>
        <video id="video1" loop crossOrigin="anonymous" style={{display:'none'}}>
          <source src="/static/video1.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        </video>
        <video id="video2" loop crossOrigin="anonymous" style={{display:'none'}}>
          <source src="/static/video2.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        </video>
        <video id="video3" loop crossOrigin="anonymous" style={{display:'none'}}>
          <source src="/static/video3.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        </video>
        <video id="video4" loop crossOrigin="anonymous" style={{display:'none'}}>
          <source src="/static/video4.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        </video>
        <video id="video5" loop crossOrigin="anonymous" style={{display:'none'}}>
          <source src="/static/video5.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        </video>
        <video id="video6" loop crossOrigin="anonymous" style={{display:'none'}}>
          <source src="/static/video6.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        </video>
        <video id="video7" loop crossOrigin="anonymous" style={{display:'none'}}>
          <source src="/static/video7.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        </video>
        <video id="video8" loop crossOrigin="anonymous" style={{display:'none'}}>
          <source src="/static/video8.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        </video>
        <video id="video9" loop crossOrigin="anonymous" style={{display:'none'}}>
          <source src="/static/video9.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        </video>
      </Layout>
    )
  }
}

export default Home

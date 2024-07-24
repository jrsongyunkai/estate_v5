<template>
  <div class="three-container" v-if="modalStatus">
    <div class="loading" v-show="loading">
      <Icon type="ios-loading" :size="30" class="demo-spin-icon-load" :style="{ width: `${30}px`, height: `${30}px` }"></Icon>
    </div>
    <div class="three-content" ref="threeContent"></div>
    <div class="close" @click="close"><Icon type="md-close" size="40" /></div>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls.js'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
  import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
  import { on, off } from 'view-design/src/utils/dom'
  import { meshMap } from './meshConf'

  export default {
    name: 'ThreeDeviceModal',
    props: {
      deviceGroup: { type: Array, default: () => [] },
    },
    components: {},
    data() {
      return {
        modalStatus: false,
        camera: null,
        renderer: null,
        loading: false,
        modelUrl: `${window.location.origin.includes('localhost') ? 'https://test-minio.snd00.com/dunwu-res' : window.location.origin}/web-nas/3d-device/`,
      }
    },
    mounted() {
      // this.init()
    },
    beforeDestroy() {
      off(window, 'resize', this.windowResize)
    },
    methods: {
      open() {
        this.modalStatus = true
        this.$nextTick(() => {
          this.init()
        })
      },
      close() {
        this.modalStatus = false
      },
      windowResize() {
        this.camera.aspect = (window.innerWidth - 100) / (window.innerHeight - 100)
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth - 100, window.innerHeight - 100)
      },
      init() {
        const scene = new THREE.Scene()
        // const helper = new THREE.AxesHelper(10)
        // scene.add(helper)
        const camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 100) / (window.innerHeight - 100), 1, 10000)
        this.camera = camera
        camera.position.set(25, 25, 25)
        // // 更新摄像头的宽高比
        camera.aspect = (window.innerWidth - 100) / (window.innerHeight - 100)
        // // 更新摄像头投影矩阵
        camera.updateProjectionMatrix()

        scene.add(camera)

        // 初始化渲染器
        const renderer = new THREE.WebGLRenderer({
          // alpha: true,
          // 抗锯齿效果
          antialias: true,
          // 对数深度缓冲区解决闪烁问题
          logarithmicDepthBuffer: true,
        })

        this.renderer = renderer
        // 编码格式
        renderer.outputEncoding = THREE.sRGBEncoding
        renderer.setClearColor('#000')
        scene.background = new THREE.Color('#ccc')
        scene.environment = new THREE.Color('#ccc')
        renderer.setSize(window.innerWidth - 100, window.innerHeight - 100)

        on(window, 'resize', this.windowResize)
        renderer.shadowMap.enabled = true
        this.$refs.threeContent.appendChild(renderer.domElement)

        const controls = new ArcballControls(camera, renderer.domElement, scene)
        controls.adjustNearFar = true
        controls.setGizmosVisible(false)
        function render() {
          renderer.render(scene, camera)
          controls && controls.update()
          requestAnimationFrame(render)
        }
        render()
        const hdrLoader = new RGBELoader()
        hdrLoader.loadAsync(`${this.modelUrl}light.hdr`).then(texture => {
          texture.mapping = THREE.EquirectangularRefractionMapping
          scene.environment = texture
        })
        this.loading = true
        const gltfLoader = new GLTFLoader().setPath(this.modelUrl)
        const group = new THREE.Group()
        let sumWidth = 0
        const meshs = this.deviceGroup.map((v, index) => {
          const offset = -1 * sumWidth
          sumWidth += meshMap[v].width
          return {
            ...meshMap[v],
            offset: index !== 0 ? offset : 0,
          }
        })

        meshs.forEach((item, index) => {
          gltfLoader.load(item.url, gltf => {
            const device = gltf.scene
            device.position.y = -5
            if (index !== 0) {
              device.position.z = item.offset
            }
            group.add(device)
          })
        })
        const that = this
        THREE.DefaultLoadingManager.onLoad = function () {
          that.loading = false
          group.position.z = sumWidth / 2
          scene.add(group)
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .three-container {
    position: fixed;
    width: calc(~'100% - 100px');
    height: calc(~'100% - 100px');
    margin: 0;
    z-index: 999999;
    top: 50%;
    left: 50%;
    border-radius: 4px;
    overflow: hidden;
    transform: translate(-50%, -50%);
    .demo-spin-icon-load {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      animation: fadenum 1s linear infinite;
      color: var(--focusColor);
    }

    @keyframes fadenum {
      100% {
        transform: rotate(360deg);
      }
    }
    .three-content {
      width: 100%;
      height: 100%;
    }
    .close {
      position: absolute;
      right: 0;
      top: 0;
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .ivu-icon {
        color: rgba(0, 0, 0, 0.3);
      }
    }
    .loading {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.75);
    }
  }
</style>

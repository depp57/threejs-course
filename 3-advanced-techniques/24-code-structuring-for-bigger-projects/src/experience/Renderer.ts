import { CineonToneMapping, PCFSoftShadowMap, Scene, sRGBEncoding, WebGLRenderer } from 'three';
import Sizes, { SizesEvent } from './utils/Sizes';
import Camera from './Camera';

export default class Renderer {

  private readonly renderer: WebGLRenderer;

  constructor(canvas: HTMLCanvasElement, scene: Scene, sizes: Sizes, camera: Camera) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true
    });

    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding          = sRGBEncoding;
    this.renderer.toneMapping             = CineonToneMapping;
    this.renderer.toneMappingExposure     = 1.75;
    this.renderer.shadowMap.enabled       = true;
    this.renderer.shadowMap.type          = PCFSoftShadowMap;
    this.renderer.setClearColor('#211d20');
    this.renderer.setSize(sizes.getWidth(), sizes.getHeight());
    this.renderer.setPixelRatio(sizes.pixelRatio);

    this.renderer.render(scene, camera.camera);
  }

  resize(sizesEvent: SizesEvent): void {
    this.renderer.setSize(sizesEvent.width, sizesEvent.height);
    this.renderer.setPixelRatio(sizesEvent.pixelRatio);
  }

  update(scene: Scene, camera: Camera): void {
    this.renderer.render(scene, camera.camera);
  }

  destroy(): void {
    this.renderer.dispose();
  }
}

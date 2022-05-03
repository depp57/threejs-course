import { PerspectiveCamera, Scene } from 'three';
import Sizes, { SizesEvent } from './utils/Sizes';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera {

  public readonly camera: PerspectiveCamera;
  private readonly controls: OrbitControls;

  constructor(canvas: HTMLCanvasElement, scene: Scene, sizes: Sizes) {
    this.camera = new PerspectiveCamera(
      35,
      sizes.getWidth() / sizes.getHeight(),
      .1,
      100
    );

    this.camera.position.set(6, 4, 8);
    scene.add(this.camera);

    this.controls               = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
  }

  resize(sizesEvent: SizesEvent): void {
    this.camera.aspect = sizesEvent.width / sizesEvent.height;
    this.camera.updateProjectionMatrix();
  }

  update(): void {
    this.controls.update();
  }

  destroy(): void {
    this.controls.dispose();
  }
}

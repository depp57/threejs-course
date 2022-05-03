import Sizes, { SizesEvent } from './utils/Sizes';
import Time, { TimeEvent } from './utils/Time';
import { Mesh, Scene } from 'three';
import Camera from './Camera';
import Renderer from './Renderer';
import World from './world/World';
import Resources from './utils/Resources';
import Debug from './utils/Debug';

export default class Experience {

  private readonly sizes: Sizes;
  private readonly time: Time;
  private readonly scene: Scene;
  private readonly camera: Camera;
  private readonly renderer: Renderer;
  private readonly world: World;
  private readonly resources: Resources;

  constructor(canvas: HTMLCanvasElement) {
    this.sizes = new Sizes();
    this.time  = new Time();

    this.sizes.on('resize', event => this.resize(event));
    this.time.on('tick', event => this.update(event));

    this.scene     = new Scene();
    this.resources = new Resources();
    this.camera    = new Camera(canvas, this.scene, this.sizes);
    this.renderer  = new Renderer(canvas, this.scene, this.sizes, this.camera);
    this.world     = new World(this.scene, this.resources);

    this.initDebug();
  }

  private resize(sizesEvent: SizesEvent): void {
    this.camera.resize(sizesEvent);
    this.renderer.resize(sizesEvent);
  }

  private update(timeEvent: TimeEvent): void {
    this.camera.update();
    this.world.update(timeEvent);
    this.renderer.update(this.scene, this.camera);
  }

  private destroy(): void {
    this.sizes.off('resize');
    this.time.off('tick');

    this.scene.traverse(child => {
      if (child instanceof Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        }
      }

      this.camera.destroy();
      this.renderer.destroy();

      if (Debug.getInstance().isActive) {
        Debug.getInstance().ui.destroy();
      }
    });
  }

  private initDebug(): void {
    const debug = Debug.getInstance();
    if (!debug.isActive) return;

    debug.objectsToDebug.scene = this.scene;
    debug.ui.add(this, 'destroy');
  }
}

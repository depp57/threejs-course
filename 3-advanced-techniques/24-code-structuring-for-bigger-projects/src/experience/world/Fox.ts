import { AnimationAction, AnimationMixer, Mesh, Scene } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Updatable } from './Updatable';
import { TimeEvent } from '../utils/Time';
import Debug from '../utils/Debug';

export default class Fox implements Updatable {

  private readonly model: GLTF;
  private animationMixer!: AnimationMixer;
  private readonly animationActions: Record<string, AnimationAction> = {};

  constructor(scene: Scene, foxModel: GLTF) {
    this.model = foxModel;

    this.initFox();
    scene.add(foxModel.scene);

    this.initAnimation();

    this.initDebug();
  }

  update(timeEvent: TimeEvent): void {
    this.animationMixer.update(timeEvent.delta * .001);
  }

  private initFox(): void {
    const fox = this.model.scene;

    fox.scale.set(.02, .02, .02);

    fox.traverse(child => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
  }

  private initAnimation(): void {
    this.animationMixer = new AnimationMixer(this.model.scene);

    this.animationActions.idle    = this.animationMixer.clipAction(this.model.animations[0]);
    this.animationActions.walking = this.animationMixer.clipAction(this.model.animations[1]);
    this.animationActions.running = this.animationMixer.clipAction(this.model.animations[2]);

    this.animationActions.current = this.animationActions.idle;
    this.animationActions.current.play();
  }

  private playAnimation(name: string): void {
    const oldAction = this.animationActions.current;
    const newAction = this.animationActions[name];

    newAction.reset();
    newAction.play();
    newAction.crossFadeFrom(oldAction, 1.5, false);

    this.animationActions.current = newAction;
  }

  private initDebug(): void {
    const debug = Debug.getInstance();
    if (!debug.isActive) return;

    const folder = debug.ui.addFolder('fox');

    const debugObject = {
      playIdle: () => this.playAnimation('idle'),
      playWalking: () => this.playAnimation('walking'),
      playRunning: () => this.playAnimation('running')
    };

    folder.add(debugObject, 'playIdle');
    folder.add(debugObject, 'playWalking');
    folder.add(debugObject, 'playRunning');
  }
}

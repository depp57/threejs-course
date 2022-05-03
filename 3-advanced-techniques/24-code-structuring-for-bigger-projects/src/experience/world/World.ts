import { Scene, Texture } from 'three';
import Environment from './Environment';
import Resources from '../utils/Resources';
import Floor from './Floor';
import Fox from './Fox';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Updatable } from './Updatable';
import { TimeEvent } from '../utils/Time';

export default class World {

  private objectsToUpdate: Updatable[] = []; // Only contains objects that are fully loaded

  constructor(scene: Scene, resources: Resources) {
    resources.on('ready', assets => {
      new Floor(scene,
        assets.get('grassColorTexture') as Texture,
        assets.get('grassNormalTexture') as Texture
      );
      this.objectsToUpdate.push(new Fox(scene, assets.get('foxModel') as GLTF));
      new Environment(scene, assets.get('environmentMapTexture') as Texture);
    });
  }

  update(timeEvent: TimeEvent): void {
    this.objectsToUpdate.forEach(objectToUpdate => {
      objectToUpdate.update(timeEvent);
    });
  }
}

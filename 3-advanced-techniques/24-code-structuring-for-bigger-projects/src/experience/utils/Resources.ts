import sources from '../sources';
import EventEmitter from './EventEmitter';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CubeTextureLoader, Loader, Texture, TextureLoader } from 'three';

export type ResourcesEvent = Map<string, Texture | GLTF>;

interface ResourcesEventsMap {
  'ready': ResourcesEvent;
}

type Source = {
  name: string,
  type: string,
  path: string[]
};

export default class Resources extends EventEmitter<ResourcesEventsMap> {

  private readonly sources: Source[];
  private readonly assets = new Map<string, Texture | GLTF>();

  private readonly loaders = new Map<string, Loader>();

  private remainingAssetsToLoad = sources.length;

  constructor() {
    super();

    this.sources = sources;

    this.setLoaders();
    this.startLoading();
  }

  private setLoaders(): void {
    this.loaders.set('gltfLoader', new GLTFLoader());
    this.loaders.set('textureLoader', new TextureLoader());
    this.loaders.set('cubeTextureLoader', new CubeTextureLoader());
  }

  private startLoading(): void {
    this.sources.forEach(source => {
      switch (source.type) {
        case 'cubeTexture':
          (this.loaders.get('cubeTextureLoader') as CubeTextureLoader).load(
            source.path, texture => this.onSourceLoader(source, texture)
          );
          break;
        case 'texture':
          (this.loaders.get('textureLoader') as TextureLoader).load(
            source.path[0], texture => this.onSourceLoader(source, texture)
          );
          break;
        case 'gltfModel':
          (this.loaders.get('gltfLoader') as GLTFLoader).load(
            source.path[0], texture => this.onSourceLoader(source, texture)
          );
          break;
        default:
          throw new Error(`Unable to load ${source.name}. ${source.type} is not a supported type.`);
      }
    });
  }

  private onSourceLoader(source: Source, loadedSource: Texture | GLTF): void {
    this.assets.set(source.name, loadedSource);
    this.remainingAssetsToLoad--;

    if (this.remainingAssetsToLoad === 0) {
      this.trigger('ready', this.assets);
    }
  }
}

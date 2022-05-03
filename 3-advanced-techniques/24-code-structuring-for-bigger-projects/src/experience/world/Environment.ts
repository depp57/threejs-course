import { DirectionalLight, Mesh, MeshStandardMaterial, Scene, sRGBEncoding, Texture } from 'three';
import Debug from '../utils/Debug';

export default class Environment {

  private readonly mapTexture: Texture;
  private readonly sunLight: DirectionalLight;
  private mapIntensity!: number;

  constructor(scene: Scene, environmentMap: Texture) {
    this.sunLight = this.createSunLight();
    scene.add(this.sunLight);

    this.mapTexture   = this.createEnvironmentMap(environmentMap);
    scene.environment = this.mapTexture;

    this.updateScene(scene);

    this.initDebug();
  }

  private createSunLight(): DirectionalLight {
    const sunLight             = new DirectionalLight('#ffffff', 4);
    sunLight.castShadow        = true;
    sunLight.shadow.camera.far = 15;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.normalBias = .05;
    sunLight.position.set(3.5, 2, -1.25);

    return sunLight;
  }

  private createEnvironmentMap(environmentMap: Texture): Texture {
    this.mapIntensity       = 2;
    environmentMap.encoding = sRGBEncoding;

    return environmentMap;
  }

  private updateScene(scene: Scene): void {
    scene.traverse(child => {
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material.envMap          = this.mapTexture;
        child.material.envMapIntensity = this.mapIntensity;
        child.material.needsUpdate     = true;
      }
    });
  }

  private initDebug(): void {
    const debug = Debug.getInstance();
    if (!debug.isActive) return;

    const folder = debug.ui.addFolder('environment');

    folder.add(this, 'mapIntensity')
      .name('envMapIntensity')
      .min(0)
      .max(4)
      .step(.1)
      .onChange(() => this.updateScene(debug.objectsToDebug.scene));

    folder.add(this.sunLight, 'intensity')
      .name('sunLightIntensity')
      .min(0)
      .max(10)
      .step(.1);

    folder.add(this.sunLight.position, 'x')
      .name('sunLightX')
      .min(-5)
      .max(5)
      .step(.1);

    folder.add(this.sunLight.position, 'y')
      .name('sunLightY')
      .min(-5)
      .max(5)
      .step(.1);

    folder.add(this.sunLight.position, 'z')
      .name('sunLightZ')
      .min(-5)
      .max(5)
      .step(.1);
  }
}

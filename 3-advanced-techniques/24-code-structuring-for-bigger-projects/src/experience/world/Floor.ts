import { CircleGeometry, Mesh, MeshStandardMaterial, RepeatWrapping, Scene, sRGBEncoding, Texture } from 'three';

export default class Floor {

  private geometry!: CircleGeometry;
  private textures!: { color: Texture, normal: Texture };
  private material!: MeshStandardMaterial;
  private mesh!: Mesh;

  constructor(scene: Scene, colorTexture: Texture, normalTexture: Texture) {
    this.initGeometry();
    this.initTextures(colorTexture, normalTexture);
    this.initMaterial();
    this.initMesh();

    scene.add(this.mesh);
  }

  private initGeometry(): void {
    this.geometry = new CircleGeometry(5, 64);
  }

  private initTextures(colorTexture: Texture, normalTexture: Texture): void {
    colorTexture.encoding = sRGBEncoding;
    colorTexture.repeat.set(1.5, 1.5);
    colorTexture.wrapS = RepeatWrapping;
    colorTexture.wrapT = RepeatWrapping;

    normalTexture.repeat.set(1.5, 1.5);
    normalTexture.wrapS = RepeatWrapping;
    normalTexture.wrapT = RepeatWrapping;

    this.textures = {color: colorTexture, normal: normalTexture};
  }

  private initMaterial(): void {
    this.material = new MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal
    });
  }

  private initMesh(): void {
    this.mesh               = new Mesh(this.geometry, this.material);
    this.mesh.rotation.x    = -Math.PI * .5;
    this.mesh.receiveShadow = true;
  }
}

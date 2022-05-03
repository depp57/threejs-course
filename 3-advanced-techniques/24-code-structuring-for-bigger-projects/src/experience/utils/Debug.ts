import * as lil from 'lil-gui';
import { GUI } from 'lil-gui';

export default class Debug {

  private static readonly instance = new Debug();

  public readonly isActive: boolean;
  public readonly ui!: GUI;

  public objectsToDebug: Record<string, any> = {};

  private constructor() {
    this.isActive = window.location.hash === '#debug';

    if (this.isActive) {
      this.ui = new lil.GUI();
    }
  }

  public static getInstance(): Debug {
    return Debug.instance;
  }
}

import './style.css';
import Experience from './experience/Experience';

const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;
new Experience(canvas);

export { };

declare module '*.glb';
declare module '*.png';

declare module 'meshline' {
  export const MeshLineGeometry: React.FC;
  export const MeshLineMaterial: React.FC;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      meshLineMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
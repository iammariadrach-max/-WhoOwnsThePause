import { illustrations } from "./IllustratedReading";
import { DotTexture } from "./StaticTexture";
export type SceneImage = keyof typeof illustrations;
export default function SceneFigure({ image }: { image: SceneImage }) {
  const photo = illustrations[image];
  return <figure className="scene-figure">
    <div className="scene-image"><img src={photo.src} alt={photo.alt} width={660} height={990} loading="lazy" decoding="async" /><DotTexture /></div>
    <figcaption>{photo.caption}</figcaption>
  </figure>;
}

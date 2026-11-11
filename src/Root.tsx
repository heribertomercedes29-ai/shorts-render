import React from "react";
import { Composition } from "remotion";
import { FiloShort } from "./videos/filo/Filo";
import { TOTAL, FPS } from "./videos/filo/story";
// Root LIMPIO (lección del sismoscopio): registra SOLO la composición del video en curso e importa
// únicamente módulos que existen en esta máquina Y en el Codespace. Los videos anteriores ya están
// renderizados y entregados; para re-renderizar uno, se vuelve a añadir su registro aquí.
export const Root: React.FC = () => (
  <>
    <Composition id="Filo" component={FiloShort} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
  </>
);

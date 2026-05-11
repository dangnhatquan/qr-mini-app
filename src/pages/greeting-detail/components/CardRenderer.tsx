import { ImageElement } from "@/components/za-editor/qr-element";
import { TextElement } from "@/components/za-editor/text-element";
import { CanvasElement, CanvasElementType } from "@/store";
import { FC, useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Group } from "react-konva";

interface CardRendererProps {
  elements: CanvasElement[];
  canvasBg: string;
  width?: number;
  height?: number;
}

export const CardRenderer: FC<CardRendererProps> = ({
  elements,
  canvasBg,
  width = 350,
  height = 450,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const newScale = containerWidth / width;
      setScale(newScale);
    }
  }, [width]);

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center overflow-hidden rounded-xl shadow-2xl"
    >
      <Stage width={width * scale} height={height * scale} scaleX={scale} scaleY={scale}>
        <Layer>
          <Rect width={width} height={height} fill={canvasBg} />
          <Group>
            {elements.map((el) => {
              if (el.type === CanvasElementType.IMAGE) {
                return <ImageElement key={el.id} imageProps={el} {...el} />;
              }
              if (el.type === CanvasElementType.TEXT) {
                return <TextElement key={el.id} textProps={el} {...el} />;
              }
              return null;
            })}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Group, Image as KonvaImage, Text as KonvaText } from "react-konva";
import useImage from "use-image";
import { CanvasElement, CanvasElementType } from "@/types/editor";

interface CardRendererProps {
  elements: CanvasElement[];
  canvasBg: string;
  width?: number;
  height?: number;
}

const URLImage = ({ imageProps }: { imageProps: CanvasElement }) => {
  const [img] = useImage(imageProps.src || "", "anonymous");
  return <KonvaImage image={img} {...imageProps} />;
};

export const CardRenderer: React.FC<CardRendererProps> = ({
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
                return <URLImage key={el.id} imageProps={el} />;
              }
              if (el.type === "text") {
                return <KonvaText key={el.id} {...el} />;
              }
              return null;
            })}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

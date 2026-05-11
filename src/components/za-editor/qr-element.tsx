import { useEffect, useRef } from "react";
import Konva from "konva";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";
import { CanvasElement } from "@/store";

export const ImageElement = ({
  imageProps,
  isSelected,
  onSelect,
  onChange,
}: {
  imageProps: CanvasElement;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange?: (newProps: CanvasElement) => void;
}) => {
  const displaySrc = imageProps.src;
  const [img] = useImage(displaySrc || "", "anonymous");
  const shapeRef = useRef<Konva.Image | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        image={img}
        {...imageProps}
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        draggable
        onDragEnd={(e) => {
          onChange?.({
            ...imageProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange?.({
              ...imageProps,
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            });
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

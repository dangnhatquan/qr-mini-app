import { useEffect, useRef } from "react";
import Konva from "konva";
import { Text, Transformer } from "react-konva";
import { CanvasElement } from "../context/KonvaEditorContext";

export const TextElement = ({
  textProps,
  isSelected,
  onSelect,
  onChange,
}: {
  textProps: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newProps: CanvasElement) => void;
}) => {
  const shapeRef = useRef<Konva.Text | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        {...textProps}
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...textProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          node.scaleX(1);
          onChange({
            ...textProps,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(20, node.width() * scaleX),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} enabledAnchors={["middle-left", "middle-right"]} />}
    </>
  );
};

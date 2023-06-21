import { Stack } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvidedDragHandleProps,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";

type DraggableNodeProps<T> = {
  dragHandler: DraggableProvidedDragHandleProps;
  data: T;
};

type DragAndDropListProps<T = any> = {
  data: T[];
  DraggableNode: (props: DraggableNodeProps<T>) => JSX.Element;
  onDragEnd?: (data: T[]) => void;
};

const DragAndDropList = ({
  data,
  DraggableNode,
  onDragEnd,
}: DragAndDropListProps) => {
  const [reordered, setReordered] = useState(false);
  const [listState, handlers] = useListState(data);
  const currentListState = useRef(listState);

  useEffect(() => {
    if (currentListState.current == listState) return;

    currentListState.current = listState;

    if (onDragEnd && reordered) {
      console.log("onDragEnd");
      onDragEnd(listState);
    }
  }, [listState]);

  const onDragEndHandler: OnDragEndResponder = ({ source, destination }) => {
    handlers.reorder({
      from: source.index,
      to: destination?.index || 0,
    });

    setReordered(true);
  };

  useEffect(() => {
    handlers.setState(data);
  }, [data]);

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Stack spacing="xs">
              {listState.map((item, index) => (
                <Draggable key={item.id} index={index} draggableId={item.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <DraggableNode
                        data={item}
                        dragHandler={provided.dragHandleProps!}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </Stack>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragAndDropList;

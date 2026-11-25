import { useRef, type PointerEvent } from "react";

type Handle = 0 | 1;

type RangeDragOptions = {
  /** A press on the track or a label: move the nearer handle there and return it (it is then dragged as before). */
  onTrackPress: (clientX: number) => Handle;
  /** Dragging after a press on the track or a label. */
  onTrackMove: (handle: Handle, clientX: number) => void;
  /** Dragging a pressed handle: `centreX` is where its centre should be (the pointer, less where it was grabbed). */
  onHandleMove: (handle: Handle, centreX: number) => void;
};

type Drag = { handle: Handle | null; fromHandle: boolean; offset: number; startX: number };

/**
 * Pointer handling shared by the two-handle sliders (RangeSlider, GradeRange). The element pressed decides which
 * handle moves, not the press position: a press on a handle drags that handle whatever the values, and moves it only
 * once the pointer moves, keeping the point it was grabbed by under the pointer. When both handles sit on the same
 * spot, the first movement decides: left takes the lower handle, right the upper. A press on the track or a label
 * moves the nearer handle there, as before. The handles' elements are the container's two [role=slider] children.
 */
export function useRangeDrag({ onTrackPress, onTrackMove, onHandleMove }: RangeDragOptions) {
  const drag = useRef<Drag | null>(null);
  const handlesOf = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>("[role=slider]")];
  const centre = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return rect.left + rect.width / 2;
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    const container = event.currentTarget;
    const handles = handlesOf(container);
    const pressed = handles.findIndex((handle) => handle.contains(event.target as Node));
    container.setPointerCapture(event.pointerId);
    if (pressed === 0 || pressed === 1) {
      const centres = handles.map(centre);
      const sameSpot = Math.abs(centres[0] - centres[1]) < 1;
      drag.current = { handle: sameSpot ? null : pressed, fromHandle: true, offset: event.clientX - centres[pressed], startX: event.clientX };
      handles[pressed].focus();
      return;
    }
    const handle = onTrackPress(event.clientX);
    drag.current = { handle, fromHandle: false, offset: 0, startX: event.clientX };
    handles[handle]?.focus();
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = drag.current;
    if (!current) return;
    if (current.handle === null) {
      const dx = event.clientX - current.startX;
      if (dx === 0) return;
      current.handle = dx < 0 ? 0 : 1;
      handlesOf(event.currentTarget)[current.handle]?.focus();
    }
    if (current.fromHandle) onHandleMove(current.handle, event.clientX - current.offset);
    else onTrackMove(current.handle, event.clientX);
  };

  const end = () => {
    drag.current = null;
  };

  return { onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end, onLostPointerCapture: end };
}

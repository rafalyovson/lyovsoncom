const VERTICAL_GAP = 13;
const HORIZONTAL_OFFSET = 5;

export const setFloatingElemPosition = (
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  isLink: boolean = false,
  verticalGap: number = VERTICAL_GAP,
  horizontalOffset: number = HORIZONTAL_OFFSET
): void => {
  const scrollerElem = anchorElem.parentElement;

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = "0";
    floatingElem.style.transform = "translate(-10000px, -10000px)";
    return;
  }

  const floatingElemRect = floatingElem.getBoundingClientRect();
  const editorScrollerRect = scrollerElem.getBoundingClientRect();

  // Calculate space above and below the target element
  const spaceAbove = targetRect.top - editorScrollerRect.top;
  const spaceBelow = editorScrollerRect.bottom - targetRect.bottom;

  // Determine if there's more space above or below the target element
  let top: number;
  if (spaceBelow > spaceAbove) {
    top = targetRect.bottom + verticalGap; // Position below the target
  } else {
    top = targetRect.top - floatingElemRect.height - verticalGap; // Position above the target
  }

  let left = targetRect.left - horizontalOffset;

  // Ensure the floating element doesn't overflow the editor horizontally
  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
  } else if (left < editorScrollerRect.left) {
    left = editorScrollerRect.left + horizontalOffset;
  }

  floatingElem.style.opacity = "1";
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
};

import { EMPTY_OBJ } from "./constants.ts";
import { commitRoot, diff } from "./diff/index.ts";
import { createElement, Fragment } from "./create-element.ts";
import type { ComponentChild, PreactElement } from "./internal.d.ts";
import options from "./options.ts";
import { slice } from "./util.ts";

/**
 * Render a Preact virtual node into a DOM element
 * @param  vnode The virtual node to render
 * @param  parentDom The DOM element to
 * render into
 * @param  [replaceNode] Optional: Attempt to re-use an
 * existing DOM tree rooted at `replaceNode`
 */
export function render(
  vnode: ComponentChild,
  parentDom: PreactElement,
  replaceNode: PreactElement | CallableFunction,
) {
  if (options._root) options._root(vnode, parentDom);

  // We abuse the `replaceNode` parameter in `hydrate()` to signal if we are in
  // hydration mode or not by passing the `hydrate` function instead of a DOM
  // element..
  const isHydrating = typeof replaceNode === "function";

  // To be able to support calling `render()` multiple times on the same
  // DOM node, we need to obtain a reference to the previous tree. We do
  // this by assigning a new `_children` property to DOM nodes which points
  // to the last rendered tree. By default this property is not present, which
  // means that we are mounting a new tree for the first time.
  const oldVNode = isHydrating
    ? null
    : (replaceNode && replaceNode._children) || parentDom._children;

  vnode = (
    (!isHydrating && replaceNode) ||
    parentDom
  )._children = createElement(Fragment, null, [vnode]);

  // List of effects that need to be called after diffing.
  let commitQueue = [];
  diff(
    parentDom,
    // Determine the new vnode tree and store it on the DOM element on
    // our custom `_children` property.
    vnode,
    oldVNode || EMPTY_OBJ,
    EMPTY_OBJ,
    parentDom.ownerSVGElement !== undefined,
    !isHydrating && replaceNode
      ? [replaceNode]
      : oldVNode
      ? null
      : parentDom.firstChild
      ? slice.call(parentDom.childNodes)
      : null,
    commitQueue,
    !isHydrating && replaceNode ? replaceNode
    : oldVNode ? oldVNode._dom : parentDom.firstChild,
    isHydrating,
  );

  // Flush all queued effects
  commitRoot(commitQueue, vnode);
}

/**
 * Update an existing DOM element with data from a Preact virtual node
 * @param  vnode The virtual node to render
 * @param  parentDom The DOM element to
 * update
 */
export function hydrate(vnode: ComponentChild, parentDom: PreactElement) {
  render(vnode, parentDom, hydrate);
}

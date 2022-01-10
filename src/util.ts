/// <reference lib="dom"/>
import { EMPTY_ARR } from "./constants.ts";

/**
 * Assign properties from `props` to `obj`
 * @template O, P The obj and props types
 * @param  obj The object to copy properties to
 * @param  props The object to copy properties from
 */
export function assign<O, P>(obj: O, props: P): O & P {
  // @ts-ignore We change the type of `obj` to be `O & P`
  for (const i in props) obj[i] = props[i];
  return obj as O & P;
}

/**
 * Remove a child node from its parent if attached. This is a workaround for
 * IE11 which doesn't support `Element.prototype.remove()`. Using this function
 * is smaller than including a dedicated polyfill.
 * @param  node The node to remove
 */
export function removeNode(node: Node) {
  const parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}

export const slice = EMPTY_ARR.slice;

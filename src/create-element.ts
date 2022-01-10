import { slice } from "./util.ts";
import options from "./options.ts";
import type { VNode } from "./internal.d.ts";
import type { ComponentChildren, Key } from "./index.d.ts";

let vnodeId = 0;

/**
 * Create an virtual node (used for JSX)
 * @param  type The node name or Component
 * constructor for this virtual node
 * @param  [props] The properties of the virtual node
 * @param  [children] The children of the virtual node
 */
export function createElement<
  Props extends { key: Key; ref: VNode["ref"] },
>(
  type: VNode["type"],
  props: Props,
  children: ComponentChildren[],
): VNode {
  let normalizedProps = {} as Omit<Props, "key" | "ref">,
    key: Key | undefined,
    ref: Props["ref"],
    i: keyof Props;
  for (i in props) {
    if (i == "key") key = props["key"];
    else if (i == "ref") ref = props["ref"];
    else {
      normalizedProps[i as keyof Omit<Props, "key" | "ref">] =
        props[i as keyof Omit<Props, "key" | "ref">];
    }
  }

  if (arguments.length > 2) {
    normalizedProps.children = arguments.length > 3
      ? slice.call(arguments, 2)
      : children;
  }

  // If a Component VNode, check for and apply defaultProps
  // Note: type may be undefined in development, must never error here.
  if (typeof type == "function" && type.defaultProps != null) {
    for (i in type.defaultProps) {
      if (normalizedProps[i] === undefined) {
        normalizedProps[i] = type.defaultProps[i];
      }
    }
  }

  return createVNode(type, normalizedProps, key, ref, null);
}

/**
 * Create a VNode (used internally by Preact)
 * @param  type The node name or Component
 * Constructor for this virtual node
 * @param  props The properties of this virtual node.
 * If this virtual node represents a text node, this is the text of the node (string or number).
 * @param  key The key for this virtual node, used when
 * diffing it against its children
 * @param  ref The ref property that will
 * receive a reference to its created child
 */
export function createVNode(
  type: VNode["type"],
  props: string | number | null | Record<string, unknown>,
  key: Key,
  ref: VNode["ref"],
  original: unknown,
): VNode {
  // V8 seems to be better at detecting type shapes if the object is allocated from the same call site
  // Do not inline into createElement and coerceToVNode!
  const vnode = {
    type,
    props,
    key,
    ref,
    _children: null,
    _parent: null,
    _depth: 0,
    _dom: null,
    // _nextDom must be initialized to undefined b/c it will eventually
    // be set to dom.nextSibling which can return `null` and it is important
    // to be able to distinguish between an uninitialized _nextDom and
    // a _nextDom that has been set to `null`
    _nextDom: undefined,
    _component: null,
    _hydrating: null,
    constructor: undefined,
    _original: original == null ? ++vnodeId : original,
  };

  // Only invoke the vnode hook if this was *not* a direct copy:
  if (original == null && options.vnode != null) options.vnode(vnode);

  return vnode;
}

export function createRef() {
  return { current: null };
}

export function Fragment<T>(props: { children: T }) {
  return props.children;
}

/**
 * Check if a the argument is a valid Preact VNode.
 * @param  vnode
 */
export const isValidElement = (vnode: unknown): vnode is VNode =>
  vnode != null && vnode.constructor === undefined;

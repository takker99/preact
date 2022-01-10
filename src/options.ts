/// <reference no-default-lib="true"/>
/// <reference lib="esnext"/>
/// <reference lib="dom"/>

import { _catchError } from "./diff/catch-error.ts";
import * as preact from "./index.d.ts";
import type {
  Component,
  ComponentChild,
  HookType,
  VNode,
} from "./internal.d.ts";

export interface Options extends preact.Options {
  /** Attach a hook that is invoked before render, mainly to check the arguments. */
  _root?(
    vnode: ComponentChild,
    parent: Element | Document | ShadowRoot | DocumentFragment,
  ): void;
  /** Attach a hook that is invoked before a vnode is diffed. */
  _diff?(vnode: VNode): void;
  /** Attach a hook that is invoked after a tree was mounted or was updated. */
  _commit?(vnode: VNode, commitQueue: Component[]): void;
  /** Attach a hook that is invoked before a vnode has rendered. */
  _render?(vnode: VNode): void;
  /** Attach a hook that is invoked before a hook's state is queried. */
  _hook?(component: Component, index: number, type: HookType): void;
  /** Bypass effect execution. Currenty only used in devtools for hooks inspection */
  _skipEffects?: boolean;
  /** Attach a hook that is invoked after an error is caught in a component but before calling lifecycle hooks */
  _catchError(error: unknown, vnode: VNode, oldVNode?: VNode | undefined): void;
}

/**
 * The `option` object can potentially contain callback functions
 * that are called during various stages of our renderer. This is the
 * foundation on which all our addons like `preact/debug`, `preact/compat`,
 * and `preact/hooks` are based on. See the `Options` type in `internal.d.ts`
 * for a full list of available option hooks (most editors/IDEs allow you to
 * ctrl+click or cmd+click on mac the type definition below).
 */
const options: Options = {
  _catchError,
};

export default options;

import options from '../options';
import { removeNode } from '../util';
import { applyRef } from './refs';

/**
 * Unmount a virtual node from the tree and apply DOM changes
 * @param {import('../internal').Internal} internal The virtual node to unmount
 * @param {import('../internal').Internal} parentInternal The parent of the VNode that
 * initiated the unmount
 * @param {boolean} [skipRemove] Flag that indicates that a parent node of the
 * current element is already detached from the DOM.
 */
export function unmount(internal, parentInternal, skipRemove) {
	let r;
	if (options.unmount) options.unmount(internal);

	if ((r = internal.ref)) {
		if (!r.current || r.current === internal._dom)
			applyRef(r, null, parentInternal);
	}

	let dom;
	if (!skipRemove && typeof internal.type != 'function') {
		skipRemove = (dom = internal._dom) != null;
	}

	internal._dom = null;

	if ((r = internal._component) != null) {
		if (r.componentWillUnmount) {
			try {
				r.componentWillUnmount();
			} catch (e) {
				options._catchError(e, parentInternal);
			}
		}

		r._parentDom = null;
	}

	if ((r = internal._children)) {
		for (let i = 0; i < r.length; i++) {
			if (typeof r[i] == 'object' && r[i])
				unmount(r[i], parentInternal, skipRemove);
		}
	}

	if (dom != null) removeNode(dom);
}
import render from './render';

const diffAttrs = (oldAttrs, newAttrs) => {
  const patches = [];

  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push($node => {
      $node.setAttribute(k, v);
      return $node;
    });
  }

  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push($node => {
        $node.removeAttribute(k);
        return $node;
      });
    }
  }

  return $node => {
    for (const patch of patches) {
      patch($node);
    }
  };
}

const zip = (xs, ys) => {
  const zipped = [];

  for (let i = 0; i < Math.min(xs, ys); i++) {
    zipped.push([xs[i], ys[i]]);
  }

  return zipped;
}

const diffChildren = (oldChildren, newChildren) => {
  const childrenPatches = [];

  for (const [oldVChild, newVChild] of zip(oldChildren, newChildren)) {
    childrenPatches.push(diff(oldVChild, newVChild));
  }

  const additionalPatches = [];
  for (const additionalChild of newChildren.slice(oldChildren.length)) {
    additionalPatches.push($node => $node.append(render(additionalChild)))
    return $node;
  }

  return $parent => {
    for (const [patch, child] of zip(childrenPatches, $parent.childNodes)) {
      patch(child);
    }

    for (const patch of additionalPatches) {
      patch($parent);
    }

    return $parent;
  };
};

const diff = (vOldNode, vNewNode) => {
  if (vNewNode === undefined) {
    return $node => {
      $node.remove();
      return undefined;
    };
  }

  if (typeof vOldNode === 'string' ||
    typeof vNewNode === 'string') {
      if (vOldNode !== vNewNode) {
        return $node => {
          const $newNode = render(vNewNode);
          $node.replaceWith($newNode);
          return $newNode;
        }
      } else {
        return $node => undefined;
      }
    }

  if (vOldNode.tagName !== vNewNode.tagName) {
    return $node => {
      const $newNode = render(vNewNode);
      $node.replaceWith($newNode);
      console.log('$newNode: ', $newNode);
      return $newNode;
    };
  }

  const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
  const patchChildren = diffChildren(vOldNode.children, vNewNode.children);

  return $node => {
    patchAttrs($node);
    patchChildren($node);
    return $node;
  }
}

export default diff;

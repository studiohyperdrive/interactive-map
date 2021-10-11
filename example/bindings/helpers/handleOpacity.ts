import { Mesh } from "three";
import { flattenChildren } from "@shd-developer/interactive-map";
import { setOpacity } from "@shd-developer/interactive-map/dist/utils";
import { Store } from "redux";

export const handleOpacity = (mesh: Mesh, store: Store) => {
  const parent = mesh.parent ? mesh.parent.parent ? mesh.parent.parent : mesh.parent : null;
  const { three } = store.getState();
  const scene = three.manager.scene;

  const children = flattenChildren(scene.children, Infinity);

  parent && children.forEach((c) => {
    if (c.parent && c.parent.name !== parent.name && c.parent.parent && c.parent.parent.name !== parent.name) {
      setOpacity(c, 0.3);
    } else {
      setOpacity(parent, 1);
    }
  });
}
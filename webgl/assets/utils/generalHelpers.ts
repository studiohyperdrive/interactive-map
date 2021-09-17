import { PerspectiveCamera, Intersection, Object3D } from "three";

export const visibleHeightAtZDepth = (depth: number, camera: PerspectiveCamera): number => {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z;
    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    // vertical fov in radians
    const vFOV = camera.fov * Math.PI / 180;

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

export const visibleWidthAtZDepth = (depth: number, camera: PerspectiveCamera): number => {
    const height = visibleHeightAtZDepth(depth, camera);
    return height * camera.aspect;
};

export const calculateCursorX = (e: MouseEvent): number => {
    return (e.clientX / window.innerWidth) * 2 - 1;
}

export const calculateCursorY = (e: MouseEvent): number => {
    return - (e.clientY / window.innerHeight) * 2 + 1;
}

export const getFirstIntersectionObject = (intersections: Intersection[]): Object3D | null => {
    if (intersections.length <= 0) {
        return null;
    }
    return intersections[0].object;
};
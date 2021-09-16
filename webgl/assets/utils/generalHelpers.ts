export const visibleHeightAtZDepth = ( depth: number, camera: THREE.PerspectiveCamera): number => {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z;
    if ( depth < cameraOffset ) depth -= cameraOffset;
    else depth += cameraOffset;

    // vertical fov in radians
    const vFOV = camera.fov * Math.PI / 180;

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
};

export const visibleWidthAtZDepth = ( depth: number, camera: THREE.PerspectiveCamera ): number => {
    const height = visibleHeightAtZDepth( depth, camera );
    return height * camera.aspect;
};

export const rotateArountPoint = ( obj: THREE.Object3D, point: THREE.Vector3, axis: THREE.Vector3, theta: number, pointIsWorld: boolean = false ): void => {
    // compensate for world coordinate
    if(pointIsWorld && obj.parent) {
        obj.parent.localToWorld(obj.position);
    }

    // position transformation
    obj.position.sub(point);
    obj.position.applyAxisAngle(axis, theta);
    obj.position.add(point);

    // undo world coordinates compensation
    if(pointIsWorld && obj.parent) {
        obj.parent.worldToLocal(obj.position);
    }
    // rotation transformation
    obj.rotateOnAxis(axis, theta);
};
# Plugins

---
**NOTE**

By default the `dataStore` will contain the following properties. They are set when the package is initialised so they will not be repeated in the *Dependencies* section of the plugin.

| Property | Description |
| --- | --- |
| `canvas` | The canvas on which te end result is shown |
| `sizes` | Object that contrains the initial width and height of the canvas |
| `scene` | The scene instance in which objects, cameras, ... are placed |
| `renderer` | The renderer displays the scene on the canvas |
| `camera` | The camera that the renderer uses to display the scene. As defined in `sceneConfig` |
| `cameraConfig` | The camera config as defined in `sceneConfig` |

---

## `AnimationMixerPlugin`

The `AnimationMixerPlugin` will create a new [`AnimationMixer`](https://threejs.org/docs/#api/en/animation/AnimationMixer) with the current scene. The mixer is updated in the plugin"s `update` method.

### Constructor

| Property | Description |
| --- | --- |
/

```js
new AnimationMixerPlugin();
```

### Output

| DataStore property | Description |
| --- | --- |
| `animationMixer` | The animation mixer instance |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
| `deltaTime` | Value that reflects the time in milliseconds since the previous frame | [`ClockPlugin`](#clockplugin) |

### Source

<details>

<summary>Code</summary>

```js
class AnimationMixerPlugin {
    constructor() {
        return class implements IAnimationMixerPlugin {
            private dataStore: IDataStore;

            public scene: Scene;
            public mixer: AnimationMixer;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.scene = dataStore.get("scene");
                this.mixer = new AnimationMixer(this.scene);

                dataStore.set("animationMixer", this.mixer);
            }

            public update() {
                const deltaTime = this.dataStore.get("deltaTime");
                this.mixer.update(deltaTime);
            }
        }
    }
}
```
</details> 

## `AnimationPlugin`

The `AnimationPlugin` allows you to define an `animationConfig` that will initiate animations after the model is loaded.

### Constructor

| Property | Description |
| --- | --- |
| `animationConfig` | Array with configuration objects |

```js
new AnimationPlugin([
    {
        name: string,
        matching: "partial" | "exact",
        loop: AnimationActionLoopStyles,
        startAnimation: (animationAction: AnimationAction, i: number) => void,
    },
]);
```

### Output

| DataStore property | Description |
| --- | --- |
| `animationConfig` | Array with configuration objects |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
| `animationMixer` | Mixer that will control the playback of the animations | [`AnimationMixerPlugin`](#animationmixerplugin) |
| `mapLoaded` | Boolean value that reflects the loaded state of the model | [`GltfDracoLoaderPlugin`](#gltfdracoloaderplugin) |

### Source

<details>

<summary>Code</summary>

```js
class AnimationPlugin {
    constructor(config: IAnimationConfig[]) {
        return class implements IAnimationPlugin{
            private dataStore: IDataStore;

            public mixer: AnimationMixer;
            public animationsStarted: boolean;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.mixer = dataStore.get("animationMixer");

                this.dataStore.set("animationConfig", config);

                this.animationsStarted = false;
            }

            public startAnimations() {
                const animations: AnimationClip[] = this.dataStore.get("animations");

                config.forEach(animationData => {
                    animations.forEach((animationClip, i) => {
                        if (isMatching(animationClip, animationData)) {
                            const action = this.mixer.clipAction(animationClip);
                            action.loop = animationData.loop;
                            animationData.startAnimation(action, i);
                        }
                    })
                });
            }

            public update() {
                if (this.dataStore.get("mapLoaded") && !this.animationsStarted) {
                    this.startAnimations();
                    this.animationsStarted = true;
                }
            }
        }
    }
}
```
</details> 

## `BrowserResizePlugin`

The `BrowserResizePlugin` resizes the canvas and camera and updates the `"sizes"` property on the dateStore when the `resize` event is fired. This plugin supports [`PerspectiveCamera`](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera) and [`OrthographicCamera`](https://threejs.org/docs/?q=orth#api/en/cameras/OrthographicCamera)

### Constructor

| Property | Description |
| --- | --- |
/

```js
new BrowserResizePlugin();
```

### Output

| DataStore property | Description |
| --- | --- |
| `sizes` | Object that contrains the width and height of the canvas, updated on resize |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
/

### Source

<details>

<summary>Code</summary>

```js
class BrowserResizePlugin {
    constructor() {
        return class implements IBrowserResizePlugin {
            private dataStore: IDataStore;

            public renderer: WebGLRenderer;
            public camera: PerspectiveCamera | OrthographicCamera;
            public cameraConfig: ICameraConfig;
            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.renderer = dataStore.get("renderer");
                this.camera = dataStore.get("camera");
                this.cameraConfig = dataStore.get("cameraConfig");
            }

            public bindEventListener(): void {
                window.addEventListener("resize", e => this.handleResize(e));
            }

            public unbindEventListener(): void {
                window.removeEventListener("resize", e => this.handleResize(e));
            }

            public handleResize(e: UIEvent) {
                this.dataStore.set("sizes", onWindowResize(this.renderer, this.camera, this.cameraConfig.config));
            }
        }
    }
}
```
</details> 

## `ClickPlugin`

The `ClickPlugin` enables click interaction with the model. For more information on how to define the bindings see [clicks](../README.md#clicks). See [click and hover](../README.md#click-and-hover) for more information about animations on hover.

### Constructor

| Property | Description |
| --- | --- |
| `clickBindings` | Array with click bindings |

```js
new ClickPlugin([
    {
        name: string,
        matching: "partial" | "exact",
        onClick: (mesh: Mesh) => void,
        animate: IAnimate[],
    }
]);
```

### Output

| DataStore property | Description |
| --- | --- |
| `clickBindings` | Array with click bindings |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
| `animations` | Array that contains all animations from the model | ["GltfDracoLoaderPlugin"] |
| `animationMixer` | Mixer that will control the playback of the animations | [`AnimationMixerPlugin`](#animationmixerplugin) |
| `intersection` | The object that has been clicked | [`RaycasterPlugin`](#raycasterplugin) |

### Source

<details>

<summary>Code</summary>

```js
class ClickPlugin {
    constructor(bindings: IClickBindingConfig[]) {
        return class implements IClickPlugin{
            private dataStore: IDataStore;

            public animations: AnimationClip[];
            public mixer: AnimationMixer;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.animations = dataStore.get("animations");
                this.mixer = dataStore.get("animationMixer");

                this.dataStore.set(`clickBindings`, bindings);
            }

            public bindEventListener(): void {
                window.addEventListener("click", e => this.handleClick(e as MouseEvent));
            }

            public unbindEventListener(): void {
                window.removeEventListener("click", e => this.handleClick(e as MouseEvent));
            }

            public handleClick = (e: MouseEvent): void => {
                const intersection = this.dataStore.get("intersection");
                if (!intersection) {
                    return;
                }

                const clicked = intersection.object;

                if (clicked instanceof Mesh) {
                    bindings.forEach(binding => {
                        if (isMatching(clicked, binding)) {``
                            binding.onClick(clicked);

                            this.handleBindingAnimation(binding, (animation: AnimationClip, animationBinding: IAnimate) => {
                                const action = this.mixer.clipAction(animation);
                                action.loop = animationBinding.loop;
                                if (!action.isRunning()) {
                                    action.reset().play();
                                }
                            });
                        }
                    });
                }
            }

            public handleBindingAnimation(binding: IBindingConfig, callback: (animation: AnimationClip, animationBinding: IAnimate) => void) {
                if (binding.animate) {
                    this.animations = this.dataStore.get("animations")
                    
                    binding.animate.forEach((animationBinding) => {
                        this.animations.forEach(animation => {
                            if (isMatching(animation, animationBinding)) {
                                callback(animation, animationBinding);
                            }
                        });
                    });
                }
            }
        }
    }
}
```
</details> 

## `ClockPlugin`

The `ClockPlugin` exposes a `elapsedTime` and `deltaTime` property. The values are updated on each frame.

### Constructor

| Property | Description |
| --- | --- |
/

```js
new ClockPlugin();
```

### Output

| DataStore property | Description |
| --- | --- |
| `elapsedTime` | Value that reflects the total time in milliseconds since the render loop started |
| `deltaTime` | Value that reflects the time in milliseconds since the previous frame |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
/

### Source

<details>

<summary>Code</summary>

```js
class ClockPlugin {
    constructor() {
        return class implements IClockPlugin {
            private dataStore: IDataStore;

            public clock: Clock;
            public previousTime: number;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.clock = new Clock();
		        this.previousTime = 0;
            }

            public update() {
                const elapsedTime = this.clock.getElapsedTime();
                const deltaTime = elapsedTime - this.previousTime;
                this.previousTime = elapsedTime;
                
                this.dataStore.set("elapsedTime", elapsedTime)
                this.dataStore.set("deltaTime", deltaTime)
            }
        }
    }
}
```
</details> 

## `GlobalIlluminationPlugin`

The `GlobalIlluminationPlugin` adds [`AmbientLight`](https://threejs.org/docs/#api/en/lights/AmbientLight) and [`DirectionalLight`](https://threejs.org/docs/?q=direc#api/en/lights/DirectionalLight) to the scene.

### Constructor

| Property | Description |
| --- | --- |
/

```js
new GlobalIlluminationPlugin();
```

### Output

| DataStore property | Description |
| --- | --- |
/

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
/

### Source

<details>

<summary>Code</summary>

```js
class GlobalIlluminationPlugin {
    constructor() {
        return class implements IGlobalIlluminationPlugin {
            private dataStore: IDataStore;

            public scene: Scene;
            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.scene = dataStore.get("scene");
                this.addLights()
            }

            public addLights() {
                const ambient = this.createAmbient();
                const directional = this.createDirectional();

                this.scene.add(ambient);
                this.scene.add(directional);
            }

            public createAmbient() {
                return new AmbientLight(0xffffff, 0.5);
            }
        
            public createDirectional() {
                const light = new DirectionalLight(0xffffff, 1);
                light.position.set(1, 1, 0.2);
        
                return light;
            }

            public update() {}
        }
    }
}
```
</details> 

## `GltfDracoLoaderPlugin`

The `GltfDracoLoaderPlugin` assynchronously loads a Draco compressed `.glTF` of `.glb` file. The model will be added to the `scene` and animations (if any) will be added to the `dataStore`. When finished it updates the `mapLoaded` property.

### Constructor

| Property | Description |
| --- | --- |
| `path` | path to the glTF file |

```js
new GltfDracoLoaderPlugin(path: string);
```

### Output

| DataStore property | Description |
| --- | --- |
| `mapLoaded` | Boolean value that reflects the loaded state of the model | [`GltfDracoLoaderPlugin`](#gltfdracoloaderplugin) |
| `animations` | Array that contains all animations from the model | ["GltfDracoLoaderPlugin"] |


### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
/

### Source

<details>

<summary>Code</summary>

```js
class GltfDracoLoaderPlugin {
    constructor(path: string) {
        return class implements IGltfDracoLoaderPlugin{
            private dataStore: IDataStore;

            public scene: Scene;
            public dracoLoader: DRACOLoader;
            public gltfLoader: GLTFLoader;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                dataStore.set("mapLoaded", false);
                dataStore.set("animations", []);

                this.scene = dataStore.get("scene");
                
                this.dracoLoader = new DRACOLoader();
                this.dracoLoader.setDecoderPath("decoder/");

                this.gltfLoader = new GLTFLoader();
                this.gltfLoader.setDRACOLoader(this.dracoLoader);

                this.loadGltf(path);
            }

            public loadGltf(path: string) {
                this.gltfLoader.load(path, (gltf) => {                    
                    this.dataStore.set("animations", gltf.animations);            
                    this.scene.add(gltf.scene);
                    this.dataStore.set("mapLoaded", true);                      
                });
            }

            public update() {}
        }
    }
}
```

</details> 

## `HoverPlugin`

The `HoverPlugin` enables hover interaction with the model. For more information on how to define the bindings see [hover](../README.md#hover). See [click and hover](../README.md#click-and-hover) for more information about animations on hover.

### Constructor

| Property | Description |
| --- | --- |
| `hoverBindings` | Array with hover bindings |

```js
new HoverPlugin([
    {
        name: string,
        matching: "partial" | "exact",
        onHoverStart: (mesh: Mesh) => void,
        onHoverEnd: (mesh: Mesh) => void,
        animate: IAnimate[],
    },
]);
```

### Output

| DataStore property | Description |
| --- | --- |
| `hoverBindings` | Array with click bindings |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
| `animations` | Array that contains all animations from the model | ["GltfDracoLoaderPlugin"] |
| `animationMixer` | Mixer that will control the playback of the animations | [`AnimationMixerPlugin`](#animationmixerplugin) |
| `intersection` | The object that has been clicked | [`RaycasterPlugin`](#raycasterplugin) |

### Source

<details>

<summary>Code</summary>

```js
class HoverPlugin {
    constructor(bindings: IHoverBindingConfig[]) {
        return class implements IHoverPlugin{
            private dataStore: IDataStore;

            public animations: AnimationClip[];
            public mixer: AnimationMixer;
            public hovered: Mesh | null = null;

            constructor(dataStore: DataStore) {
                this.dataStore = dataStore;

                this.animations = dataStore.get("animations");
                this.mixer = dataStore.get("animationMixer");

                this.dataStore.set(`hoverBindings`, bindings);
            }

            public bindEventListener(): void {
                window.addEventListener("mousemove", e => this.handleHover(e as MouseEvent));
            }

            public unbindEventListener(): void {
                window.removeEventListener("mousemove", e => this.handleHover(e as MouseEvent));
            }

            public handleHover(e: MouseEvent): void {
                const previous = this.hovered;
                const current = this.dataStore.get("intersection")?.object;
        
                if (previous === current) {
                    return
                }
        
                if (previous instanceof Mesh) {
                    bindings.forEach(binding => {
                        if (isMatching(previous, binding)) {
                            binding.onHoverEnd(previous);
                            this.handleBindingAnimation(binding, (animation: AnimationClip, animationBinding: IAnimate) => {
                                const action = this.mixer.clipAction(animation);
                                action.loop = LoopOnce;
                            });
                        }
                    });
                }
        
                if (current instanceof Mesh) {
                    bindings.forEach(binding => {
                        if (isMatching(current, binding)) {
                            binding.onHoverStart(current);
                            this.handleBindingAnimation(binding, (animation: AnimationClip, animationBinding: IAnimate) => {
                                const action = this.mixer.clipAction(animation);
                                action.loop = animationBinding.loop;
                                if (!action.isRunning()) {
                                    action.reset().play();
                                }
                            });
                        }
                    });
                }
        
                this.hovered = (current as Mesh);
            }

            public handleBindingAnimation(binding: IBindingConfig, callback: (animation: AnimationClip, animationBinding: IAnimate) => void) {
                if (binding.animate) {
                    this.animations = this.dataStore.get("animations")
                    
                    binding.animate.forEach((animationBinding) => {
                        this.animations.forEach(animation => {
                            if (isMatching(animation, animationBinding)) {
                                callback(animation, animationBinding);
                            }
                        });
                    });
                }
            }
        }
    }
}
```

</details> 

## `MapControlsPlugin`

The `MapControlsPlugin` add basic controls to the app. These controls can be configured through a `controlsConfig`.

### Constructor

| Property | Description |
| --- | --- |
| `controlsConfig` | Object that contains the controls setup |

```js
new MapControlsPlugin({
    enableDamping?: boolean,
    enableRotate?: boolean,
    enablePan?: boolean,
    enableZoom?: boolean,
    dampingFactor?: number,
    rotateSpeed?: number,
    panSpeed?: number,
    zoomSpeed?: number,
    mouseButtons?: IControlsMouseButtons,
    touches?: IControlsTouches,
    rotationLimits?: IControlsRotationLimits,
    panLimits?: IControlsPanLimits
    distanceLimits?: IControlsDistanceLimits,
    zoomLimits?: IControlsZoomLimits,
});
```

### Output

| DataStore property | Description |
| --- | --- |
/

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
/

### Source

<details>

<summary>Code</summary>

```js
class MapControlsPlugin {
    constructor(config: IMapControlsConfig) {
        return class implements IMapControlsPlugin {
            private dataStore: IDataStore;

            public camera: Camera;
            public canvas: HTMLCanvasElement;
            public mapControls: MapControls;
            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;

                this.camera = dataStore.get("camera");
                this.canvas = dataStore.get("canvas");
                this.mapControls = this.createMapControls(this.camera, this.canvas);
            }

            public update() {
                this.mapControls.update();
        
                // this.mapControls.enabled = false;
                //     Update the camera here
                // this.mapControls.enabled = true;
            };
        
            public createMapControls(camera: Camera, canvas: HTMLCanvasElement): MapControls {
                const mapControls = new MapControls(camera, canvas);
                if (config.enableDamping) {
                    mapControls.enableDamping = config.enableDamping;
                }
                if (config.enableRotate) {
                    mapControls.enableRotate = config.enableRotate;
                }
                if (config.enablePan) {
                    mapControls.enablePan = config.enablePan;
                }
                if (config.enableZoom) {
                    mapControls.enableZoom = config.enableZoom;
                }
                if (config.dampingFactor) {
                    mapControls.dampingFactor = config.dampingFactor;
                }
                if (config.rotateSpeed) {
                    mapControls.rotateSpeed = config.rotateSpeed;
                }
                if (config.panSpeed) {
                    mapControls.panSpeed = config.panSpeed;
                }
                if (config.zoomSpeed) {
                    mapControls.zoomSpeed = config.zoomSpeed
                }
                if (config.mouseButtons) {
                    mapControls.mouseButtons = config.mouseButtons
                }
                if (config.touches) {
                    mapControls.touches = config.touches
                }
                if (config.rotationLimits) {
                    const limits = config.rotationLimits;
        
                    // Vertical rotation limits
                    mapControls.minPolarAngle = limits.minPolarAngle? limits.minPolarAngle : Infinity;
                    mapControls.maxPolarAngle = limits.maxPolarAngle? limits.maxPolarAngle : Infinity;
        
                    // Horizontal rotation limits
                    mapControls.minAzimuthAngle = limits.minAzimuthAngle? limits.minAzimuthAngle : Infinity;
                    mapControls.maxAzimuthAngle = limits.maxAzimuthAngle? limits.maxAzimuthAngle : Infinity;
                }
                if (config.panLimits) {
                    const limits = config.panLimits;
        
                    // Panning limits
                    const minPan = limits.minPan? limits.minPan : new Vector3(Infinity, Infinity, Infinity);
                    const maxPan = limits.maxPan? limits.maxPan : new Vector3(Infinity, Infinity, Infinity);
                    const _v = new Vector3();
                    
                    mapControls.addEventListener("change", () => {
                        _v.copy(mapControls.target);
                        mapControls.target.clamp(minPan, maxPan);
                        _v.sub(mapControls.target);
                        camera.position.sub(_v);
                    })
                }
                if (config.distanceLimits) {
                    const limits = config.distanceLimits;
        
                    // Dolly (distance) limits
                    mapControls.minDistance = limits.minDistance? limits.minDistance : 0;
                    mapControls.maxDistance = limits.maxDistance? limits.maxDistance : Infinity;
                }
                if (config.zoomLimits) {
                    const limits = config.zoomLimits;
        
                    // Dolly (zoom) limits
                    mapControls.minZoom = limits.minZoom? limits.minZoom : 0;
                    mapControls.maxZoom = limits.maxZoom? limits.maxZoom : Infinity;
                }
        
        
                return mapControls
            }
        }
    }
}
```

</details> 

## `MousePositionPlugin`

The `MousePositionPlugin` populates the `mousePosition` property on the `dataStore`. This value is updated on `mousemove`.

### Constructor

| Property | Description |
| --- | --- |
/

```js
new MousePositionPlugin();
```

### Output

| DataStore property | Description |
| --- | --- |
| `mousePosition` | Object that contains the `x` and `y`values of the mouse |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
/

### Source

<details>

<summary>Code</summary>

```js
class MousePositionPlugin {
    constructor() {
        return class implements IMousePositionPlugin {
            private dataStore: IDataStore;
            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;
                
                window.addEventListener("mousemove", this.handleMouseMove);
            }

            public handleMouseMove = (e: MouseEvent) => {
                this.dataStore.set("mousePosition", {x: calculateCursorX(e), y: calculateCursorY(e)});
            }

            public update() {}
        }
    }
}
```

</details> 

## `RaycasterPlugin`

The `RaycasterPlugin` returns the `Mesh` that the mouse is currently over. This value can be updated on `click` or `mousemove`. 

### Constructor

| Property | Description |
| --- | --- |
| `config` | Configuration object. Trigger can be `click` of `mousemove` |

```js
new MousePositionPlugin({
    trigger: "click" | "mousemove",
});
```

### Output

| DataStore property | Description |
| --- | --- |
| `intersection` | The `Mesh` that the mouse is currently over |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
| `mousePosition` | Object that contains the `x` and `y`values of the mouse | [`MousePositionPlugin`](#mousepositionplugin) |

### Source

<details>

<summary>Code</summary>

```js
class RaycasterPlugin {
    constructor(config: IRaycasterConfig) {
        return class implements IRacasterPlugin {
            private dataStore: IDataStore;

            public raycaster: Raycaster;
            public camera: Camera;
            public scene: Scene;

            constructor(dataStore: IDataStore) {
                this.dataStore = dataStore;
                this.raycaster = new Raycaster();

                this.camera = dataStore.get("camera");
                this.scene = dataStore.get("scene");

                window.addEventListener(config.trigger, this.handleClick);
            }

            public handleClick = () => {
                const pos = this.dataStore.data.mousePosition;
                if (pos === undefined) {
                    return
                };
        
                this.raycaster.setFromCamera(pos, this.camera);
        
                this.dataStore.set("intersection", this.raycaster.intersectObjects(this.scene.children, true)[0]);                
            }

            public update() {}
        }
    }
}
```

</details> 
# Plugins

---
**NOTE**

By default the `dataStore` will contain the following properties. They are set when the package is initialised so they will not be repeated in the *Dependencies* section of the plugin.

| Property | Description |
| --- | --- |
| `canvas` | The canvas on which the end result is shown. |
| `sizes` | Object that contains the initial width and height of the canvas. |
| `scene` | The scene instance in which objects, cameras, etc are placed. |
| `renderer` | The renderer displays the scene on the canvas. |
| `camera` | The camera that the renderer uses to display the scene. As defined in `sceneConfig`. |
| `cameraConfig` | The camera config as defined in `sceneConfig`. |

---

## `AnimationMixerPlugin` [ScenePlugin]

The `AnimationMixerPlugin` will create a new [`AnimationMixer`](https://threejs.org/docs/#api/en/animation/AnimationMixer) with the current scene. The mixer is updated in the plugin's `update` method.

### Constructor

```js
new AnimationMixerPlugin();
```

### Output

| DataStore property | Description |
| --- | --- |
| `animationMixer` | The animation mixer instance. |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
| `deltaTime` | Value that reflects the time in milliseconds since the previous frame. | [`ClockPlugin`](#clockplugin-sceneplugin) |

### Source

[Code](../plugins/animation-mixer-plugin/animation-mixer-plugin.ts)

## `AnimationPlugin` [ScenePlugin]

The `AnimationPlugin` allows you to define an `animationConfig` that will initiate animations after the model is loaded.

### Constructor

| Property | Description |
| --- | --- |
| `animationConfig` | Array with configuration objects. |

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
| `animationConfig` | Array with configuration objects. |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
| `animationMixer` | Mixer that will control the playback of the animations. | [`AnimationMixerPlugin`](#animationmixerplugin-sceneplugin) |
| `mapLoaded` | Boolean value that reflects the loaded state of the model. | [`GltfDracoLoaderPlugin`](#gltfdracoloaderplugin-sceneplugin) |

### Source

[Code](../plugins/animation-plugin/animation-plugin.ts) 

## `BrowserResizePlugin` [EventPlugin]

The `BrowserResizePlugin` resizes the canvas & camera and updates the `sizes` property on the `dataStore` when the `resize` event is fired.
This plugin supports [`PerspectiveCamera`](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera) and [`OrthographicCamera`](https://threejs.org/docs/?q=orth#api/en/cameras/OrthographicCamera).

### Constructor

```js
new BrowserResizePlugin();
```

### Output

| DataStore property | Description |
| --- | --- |
| `sizes` | Object that contrains the width and height of the canvas, updated on resize. |

### Dependencies

This plugin has no dependencies.

### Source

[Code](../plugins/browser-resize-plugin/browser-resize-plugin.ts)

## `ClickPlugin` [EventPlugin]

The `ClickPlugin` enables click interaction with the model. For more information on how to define these bindings, see [Clicks](../README.md#clicks).
See [Click and hover](../README.md#click-and-hover) for more information about animations on hover.

### Constructor

| Property | Description |
| --- | --- |
| `clickBindings` | Array with click bindings. |

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
| `clickBindings` | Array with click bindings. |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
| `animations` | Array that contains all animations from the model. | [`GltfDracoLoaderPlugin`](#gltfdracoloaderplugin-sceneplugin) |
| `animationMixer` | Mixer that will control the playback of the animations. | [`AnimationMixerPlugin`](#animationmixerplugin-sceneplugin) |
| `intersection` | The object that has been clicked. | [`RaycasterPlugin`](#raycasterplugin-eventplugin) |

### Source

[Code](../plugins/click-plugin/click-plugin.ts) 

## `ClockPlugin` [ScenePlugin]

The `ClockPlugin` exposes an `elapsedTime` and `deltaTime` property. These values are updated on each frame.

### Constructor

```js
new ClockPlugin();
```

### Output

| DataStore property | Description |
| --- | --- |
| `elapsedTime` | Value that reflects the total time in milliseconds since the render loop started. |
| `deltaTime` | Value that reflects the time in milliseconds since the previous frame. |

### Dependencies

This plugin has no dependencies.

### Source

[Code](../plugins/clock-plugin/clock-plugin.ts)

## `GlobalIlluminationPlugin` [ScenePlugin]

The `GlobalIlluminationPlugin` adds a basic [`AmbientLight`](https://threejs.org/docs/#api/en/lights/AmbientLight) and [`DirectionalLight`](https://threejs.org/docs/?q=direc#api/en/lights/DirectionalLight) to the scene.

### Constructor

```js
new GlobalIlluminationPlugin();
```

### Output

This plugin does not write to the `dataStore`.

### Dependencies

This plugin has no dependencies.

### Source

[Code](../plugins/global-illumination-plugin/global-illumination-plugin.ts)

## `GltfDracoLoaderPlugin` [ScenePlugin]

The `GltfDracoLoaderPlugin` asynchronously loads a Draco compressed `.glTF` of `.glb` file. The model will be added to the `scene` and animations (if any) will be added to the `animations` property of the `dataStore`.
When finished it sets the `mapLoaded` property of the `dataStore` to `true`.

### Constructor

| Property | Description |
| --- | --- |
| `path` | path to the glTF file. |

```js
new GltfDracoLoaderPlugin(path: string);
```

### Output

| DataStore property | Description |
| --- | --- |
| `mapLoaded` | Boolean value that reflects the loaded state of the model. |
| `animations` | Array that contains all animations from the model. |


### Dependencies

This plugin has no dependencies.

### Source

[Code](../plugins/gltf-draco-loader-plugin/gltf-draco-loader-plugin.ts) 

## `HoverPlugin` [EventPlugin]

The `HoverPlugin` enables hover interaction with the model. For more information on how to define the bindings see [Hover](../README.md#hover).
See [Click and hover](../README.md#click-and-hover) for more information about triggering animations on hover.

### Constructor

| Property | Description |
| --- | --- |
| `hoverBindings` | Array with hover bindings. |

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
| `hoverBindings` | Array with hover bindings. |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
| `animations` | Array that contains all animations from the model. | [`GltfDracoLoaderPlugin`](#gltfdracoloaderplugin-sceneplugin) |
| `animationMixer` | Mixer that will control the playback of the animations. | [`AnimationMixerPlugin`](#animationmixerplugin-sceneplugin) |
| `intersection` | The object that is being hovered. | [`RaycasterPlugin`](#raycasterplugin-eventplugin) |

### Source

[Code](../plugins/hover-plugin/hover-plugin.ts)

## `MapControlsPlugin` [ScenePlugin]

The `MapControlsPlugin` adds basic controls to the app. These controls can be configured through a `controlsConfig`.

### Constructor

| Property | Description |
| --- | --- |
| `controlsConfig` | Object that contains the controls setup. |

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
| `controls` | The controls instance defined in the plugin. |

### Dependencies

This plugin has no dependencies.

### Source

[Code](../plugins/map-controls-plugin/map-controls-plugin.ts)

## `MousePositionPlugin` [EventPlugin]

The `MousePositionPlugin` populates the `mousePosition` property on the `dataStore`. This value is updated on the DOM event `mousemove`.

### Constructor

```js
new MousePositionPlugin();
```

### Output

| DataStore property | Description |
| --- | --- |
| `mousePosition` | Object that contains the `x` and `y`values of the mouse. |

### Dependencies

This plugin has no dependencies.

### Source

[Code](../plugins/mouse-position-plugin/mouse-position-plugin.ts)

## `RaycasterPlugin` [EventPlugin]

The `RaycasterPlugin` returns the `Mesh` that the mouse is currently over. This value can be updated on `click` or `mousemove`. 

### Constructor

| Property | Description |
| --- | --- |
| `config` | Configuration object, trigger can be either `click` or `mousemove`. |

```js
new MousePositionPlugin({
    trigger: "click" | "mousemove",
});
```

### Output

| DataStore property | Description |
| --- | --- |
| `intersection` | The `Mesh` that the mouse is currently over. |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
| `mousePosition` | Object that contains the `x` and `y`values of the mouse. | [`MousePositionPlugin`](#mousepositionplugin-eventplugin) |

### Source

[Code](../plugins/raycaster-plugin/raycaster-plugin.ts)

## `TabNavigationPlugin` [EventPlugin]

The `TabNavigationPlugin` allows developers to specify a list of meshes, based on name and previously mentioned matching rules, that can be cycled through when pressing the `Tab` and `Shift + Tab` keys.

This allows for tab-based navigation, highlighting and/or accessibility. This plugin does not prevent the default behaviour of the `Tab` and `Shift + Tab` keys when either end of the list is reached.

### Constructor

| Property | Description |
| --- | --- |
| `bindings` | A list of objects implementing `ITabNavigationBinding`. |

```js
new TabNavigationPlugin(
    [
        {
            name: "small-house",
            matching: "exact",
            order: 0,
            afterNavigate: (
                camera: PerspectiveCamera | OrthographicCamera,
                controls: MapControls,
                children: Array<Object3D | Mesh>
            ) => {
                //
            }
        },
        {
            name: "small-house001",
            matching: "exact",
            order: 0,
            afterNavigate: (
                camera: PerspectiveCamera | OrthographicCamera,
                controls: MapControls,
                children: Array<Object3D | Mesh>
            ) => {
                //
            }
        },
    ]
)
```

### Output

| DataStore property | Description |
| --- | --- |

### Dependencies

| DataStore property | Description | Plugin |
| --- | --- | --- |
| `mapLoaded` | Boolean value that reflects the loaded state of the model. | [`GltfDracoLoaderPlugin`](#gltfdracoloaderplugin-sceneplugin) |

### Source

[Code](../plugins/tab-navigation-plugin/tab-navigation-plugin.ts)
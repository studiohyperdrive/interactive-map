# Studio Hyperdrive - Interactive Map - Package

## General

This package is aimed at simplifying common three.js setups for interactive maps.

The package is built with:
- node: `v14.16.1` ( ~ `lts/fermium`)
- yarn: `v1.22.10`
- npm: `v6.14.12`
- three: `^0.132.2`

For a complete list of packages and version check out the `package.json` file.

## Usage

Basic usage of this package requires at least:
- A reference to an HTMLCanvasElement
- The path to a local GLTF & DRACO compatible mesh file
- Basic camera configuration
- Some default plugins
    - Browser resize plugin
    - Loader plugin
    - Illumination plugin (optional)

```
new ThreeEntryPoint(
    // Canvas element
    canvas,

    // Config
    {
        camera: {
            type: "orthographic",
            config: {
                frustumSize: 2,
                near: 0.0001,
                far: 5,
                position:
                {
                    x: 2,
                    y: 2,
                    z: 2
                }
            }
        },
    },

    // Event plugins
    [
        new BrowserResizePlugin
    ],

    // Scene plugins
    [
        new GltfDracoLoaderPlugin("/path-to-mesh"),
        new GlobalIlluminationPlugin,
    ],
)
```

#

## Plugins

To add functionality to your app you can use the provided plugins or write your own. There are two types of plugins. Scene plugins extend Three.js logic and event plugins bind to events. Communication between plugins is handled by a `dataStore`.

### Scene plugins

Scene plugins allow you to extend the Three.js logic. *eg. add controls that let the user interact with the scene*

Each plugin should expect a reference to the `dataStore` and have an `update` method. The `update` method is called on each frame. This allows you to inject logic in the render loop or update values in realtime.

[ClockPlugin](plugins/browser-resize-plugin/browser-resize-plugin.ts) is an example of a simple clock plugin that updates the `elapsedTime` and `deltaTime` properties in the `dataStore`.

### Event plugins

Event plugins bind to events and perform an action when that event is fired. 
*eg. Resizing the canvas and camera when the `resize` event is fired*

Each plugin should expect a reference to the `dataStore`. They should also have `bindEventListener` and `unbindEventListener` methods.

[BrowserResizePlugin](plugins/browser-resize-plugin/browser-resize-plugin.ts) is an example of a resize plugin that will update the `sizes` object on the `dataStore` while updating the canvas and camera on resize.

### Overview
A complete list of the provided plugins and their use cases can be found below.

| Plugin | Description |
| --- | --- |
| [`AnimationMixerPlugin`](docs/PLUGINS.md#animationmixerplugin-sceneplugin) | Creates a new `animationMixer` |
| [`AnimationPlugin`](docs/PLUGINS.md#animationplugin-sceneplugin) | Allows you to configure consistent animations |
| [`BrowserResizePlugin`](docs/PLUGINS.md#browserresizeplugin-eventplugin) | Makes the canvas responsive |
| [`ClickPlugin`](docs/PLUGINS.md#clickplugin-eventplugin) | Enables click bindings |
| [`ClockPlugin`](docs/PLUGINS.md#clockplugin-sceneplugin) | Calculates `elapsedTime` and `deltaTime` |
| [`GlobalIlluminationPlugin`](docs/PLUGINS.md#globalilluminationplugin-sceneplugin) | Adds ambient and directional lighting |
| [`GltfDracoLoaderPlugin`](docs/PLUGINS.md#gltfdracoloaderplugin-sceneplugin) | Loads a Draco compressed `.gltf` or `.glb` file |
| [`HoverPlugin`](docs/PLUGINS.md#hoverplugin-eventplugin) | Enables hover bindings |
| [`MapControlsPlugin`](docs/PLUGINS.md#mapcontrolsplugin-sceneplugin) | Adds basic interaction to the map |
| [`MousePositionPlugin`](docs/PLUGINS.md#mousepositionplugin-eventplugin) | Gets the mouse position |
| [`RaycasterPlugin`](docs/PLUGINS.md#raycasterplugin-eventplugin) | Gets the first mesh that intersects with the mouse |

#

## Clicks

Click bindings are provided by the [`ClickPlugin`](docs/PLUGINS.md#clickplugin-eventplugin). The bindings array is passed to the plugin's constructor.

To respond to click events in the scene you should first ensure clear naming is applied in the mesh file. Using either the `exact` or `partial` matching rules you can emulate behaviour similar to `document.querySelector`.

The example below will change the color of any mesh with `skyscraper` in its name. 

```
{
    name: "skyscraper",
    matching: "partial",

    onClick: (mesh: Mesh) => {
        const material = (mesh.material as MeshStandardMaterial).clone();    
        material.color.setHex(Math.random() * 0xffffff);
        mesh.material = material;
    };
}
```

You can use any framework or custom functions in the `onClick` callback function provided you can supply a reference to them. A simple way of doing this is by wrapping the click bindings in a function that takes the necessary services / instances / objects and returns an array of click bindings.

The example below uses the Next router to navigate to a dedicated page when clicking the `tower` mesh.

```
function createClickBindings(router: NextRouter) {
    return [
        {
            name: "tower",
            matching: "partial",

            onClick: () => {
                router.push("/tower");
            }
        },
    ];
}
```

## Hover

Hover bindings are provided by the [`HoverPlugin`](docs/PLUGINS.md#hoverplugin-eventplugin). The bindings array is passed to the plugin's constructor.

Similar to click bindings explained above you can define the same interaction for hover events. This example will randomly change the color of a `skyscraper` mesh when first hovering over the mesh and then revert it when hovering away.

```
{
    name: 'skyscraper',
    matching: 'partial',

    onHoverStart: (mesh: Mesh) => {
        const material = (mesh.material as MeshStandardMaterial).clone();    
        material.color.setHex(Math.random() * 0xffffff);
        mesh.material = material;
    },

    onHoverEnd: (mesh: Mesh) => {
        const material = (mesh.material as MeshStandardMaterial).clone();
        material.color.setHex(0xcbcbcb);
        mesh.material = material;
    }
}
```

Exactly like the `Click` bindings, references to other framework features can be included. The following example implements a basic redux store and writes the name of the hovered mesh to state.

That state is then read by a separate `Tooltip` component to be shown to the user.

```
function createHoverBindings(store: Store) {
    return [
        {
            name: "",
            matching: "partial",

            onHoverStart: (mesh: Mesh) => {
                store.dispatch({
                    type: actions.tooltip.set,
                    payload: mesh.name
                });
            },

            onHoverEnd: () => {
                store.dispatch({
                    type: actions.tooltip.reset
                });
            }
        }
    ];
}
```

## Animation

Use the [`AnimationPlugin`](docs/PLUGINS.md#animationplugin-sceneplugin) to enable the animation config.

Consistent animations can be defined in an array passed to the [`AnimationPlugin`](docs/PLUGINS.md#animationplugin-sceneplugin) constructor. The example below will start the associated `AnimationAction` at a random time and repeat that animation at a random interval.

```
{
    name: 'small-house',
    matching: 'partial',
    
    loop: LoopOnce,
    startAnimation: (animationAction: AnimationAction, i: number) => {         
        setTimeout(() => {
            animationAction
            .reset()
            .play();
            setInterval(() => {
                animationAction
                .reset()
                .play();
            }, MathUtils.randInt(5000, 10000));
        }, MathUtils.randInt(1000, 5000))
    }
}
```

### Click and hover

Animations that occur in response to an event are triggered from that event's optional `animate` property. Again, it's important to have clear nomenclature in place to ensure maintainability.

```
{
    name: 'small-house',
    matching: 'exact',

    onClick: () => {},

    animate: [
        {
            name: 'small-houseAction',
            matching: 'exact',
            loop: LoopOnce
        }
    ]
}
```

The example above, implemented as a `Click` binding, will perform the `small-houseAction` animation once on any `small-house` that gets clicked. (see [`ClickPlugin`](docs/PLUGINS.md#clickplugin-eventplugin))

This can also be done for `Hover` bindings. (see [`HoverPlugin`](docs/PLUGINS.md#hoverplugin-eventplugin))

```
{
    name: 'tower',
    matching: 'exact',

    onHoverStart: () => { },
    onHoverEnd: () => { },

    animate: [
        {
            name: 'penthouseAction',
            matching: 'partial',
            loop: LoopRepeat,
        },
    ]
}
```

#

## 3D

[This slite doc](https://studiohyperdrive.slite.com/api/s/note/AcyJqGtRBUoT88mcrUFudY/3D-naar-Three-js) documents a basic Blender to Three.js workflow. 

#

## Setup

- Navigate to the package root `cd package`
- (Optional) Install recommended Node version `nvm i`
- Install dependencies `npm i`
- (Optional) Run `npm run symlink` in the `example` folder to avoid having to publish every little change
- Run `npm run build` after making changes

#

## Team

* [Bavo Vanderghote](bavo.vanderghote@studiohyperdrive.be)
    * **Function**: Developer
    * **Period**: September 2021 -> ...

* [Ian Emsens](ian.emsens@studiohyperdrive.be)
    * **Function**: Developer
    * **Period**: September 2021 -> ...
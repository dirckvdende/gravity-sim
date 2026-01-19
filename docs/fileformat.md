
# Gravity sim file format

Files that can be loaded into the gravity sim have the ".grav" extension. The contents are formatted using JSON. You can find the exact JSON schema specification of the format [here](/src/assets/json/save.schema.json). For more information on how to use JSON schemas, visit [json-schema.org](https://json-schema.org). Below follows a short description of the file format.

## Main structure

The file contains a single JSON object with the following fields:

```json
{
    "icon": "https://example.com/image.png",
    "name": "My gravity sim scenario",
    "description": "Many planets!",
    "position": { "x": 10.1, "y": -20.4 },
    "zoomLevel": -2.1,
    "timestamp": 1765806030149,
    "speed": 86400,
    "objects": [ ... ]
}
```

The `icon` field contains a URL to an image that will be used as the icon for the scenario, for example when listing it among other scenarios. This can also be a [data URL](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data).

The `name` field contains the name of the scenario.

The `description` field is optional. It contains some description of the scenario.

The `position` field indicates the 2D position of the camera. When a user opens this scenario, this position will be at the center of their screen. Units are in meters.

The `zoomLevel` field indicates how far the user is zoomed in, on an exponential scale. A negative number means the view is zoomed out, while a positive number means it's zoomed in. A zoom level of 0 means one pixel in the browser corresponds with one meter in the sim.

The `timestamp` field indicates the current time, as displayed at the top left in the sim. It is represented using the number of milliseconds from January 1st, 1970, i.e. the output of JavaScript's [`Date.getTime()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime) method.

The `speed` field indicates the relative speed at which the sim will run at first, before the user changes this using the bottom menu. A value of 2 means every second, the sim will simulate 2 seconds. In the example 86400 means a day is simulated every second.

## Objects

Objects in the gravity sim are represented using the structure below:

```json
{
    "id": 42,
    "position": { "x": -7.4, "y": -9.1, "z": 0.4 },
    "velocity": { "x": 1.1, "y": 4.32, "z": -9.81 },
    "mass": 200.4145,
    "icon": "https://example.com/image.png",
    "size": 5.1,
    "name": "Earth",
    "description": "Our home!"
}
```

The `id` field is a non-negative integer that is unique to this object. It is used in the sim to tell objects apart.

The `position` field contains the position of the object in meters. Each of the `x`, `y`, and `z` fields is optional. If one is missing its value is inferred to be zero.

The `velocity` field contains the (directed) velocity of the object in m/s. Like with the `position` field, the `x`, `y`, and `z` are each optional.

The `mass` field contains the mass of the object in kg.

The `icon` field, like the global `icon` field, contains a URL to an icon to display for the object.

The `size` field contains the size (diameter) of the object in meters.

The `name` field has the name of the object.

The `description` field is optional, and contains some description or information on the object.
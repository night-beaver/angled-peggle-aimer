# Angled Peggle aimer

This repository currently only provides the web component and works as a **proof
of concept**. Using the web component with a back end to visualize chat's aim
should be easy, if not trivial, but that functionality is not provided here at
the moment.

## Usage

### Using the web component

First, ensure that the script is included in your document, by using the script
tag: `<script src="PeggleAimer.js" type="module"></script>`. Please note that
the `type="module"` attribute **MUST be present** for the component to work.

A new element can then be created by simply including the tag in your HTML body,
using the `<peggle-aimer></peggle-aimer>` tag. A reference to the element can
then be obtained like any other element in your JavaScript, for example:

```javascript
let aimer = document.querySelector('peggle-aimer');
```

Alternatively, you can create the element in JavaScript directly:

```javascript
let aimer = document.createElement('peggle-aimer');
document.body.appendChild(aimer);
```

#### Methods

The two main methods of the component you should be concerned about are:

-   `refresh()`
-   `addHand(angle, color)`

The `refresh()` method deletes all hands from the dial and re-renders the dial.

The `addHand(angle, color)` method adds a new hand to the dial, with the
corresponding angle (in degrees) and color. The color is a string and can be in
any CSS-compatible format, such as a color name (`red`, `cyan`) or hex code
(`#c0ffff`).

#### Properties and attributes

The component provides six main properties for you to manipulate:

-   `width`
-   `height`
-   `angleIncrement`
-   `innerRadius`
-   `margin`
-   `topOffset`

Manipulating the properties renders the changes instantly, with no need for any
separate update method.

All of these properties can be manipulated by either changing the property
directly (`aimer.width = 800`, for example) or by changing the corresponding
attribute for the HTML tag. The corresponding HTML attributes have names that
are otherwise identical to the properties, but use `kebab-case`, as opposed to
`pascalCase`, so for example, the HTML attribute for `angleIncrement` is called
`angle-increment` and would be used in the HTML tag like so:
`<peggle-aimer angle-increment="10"></peggle-aimer>`.

Additionally, there's a `mouse` HTML attribute available. This attribute being
present creates a dial that follows the mouse cursor, like in the demo. To
disable this behavior, simply omit the attribute.

---

### Running the demo

Since this repository contains the `.js` files generated by the TypeScript
compiler, trying the demo is as simple as navigating to the project's root
directory (same as `package.json`) and running a web server of your choice, a
simple example being Python's built-in http server module, executed via the
command: `python -m http.server`

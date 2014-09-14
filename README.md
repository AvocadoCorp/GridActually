# Grid Actually

Grid Actually is a dynamic, expandable, animated grid of square images using a single sprite.

[See the live demo](http://avocadocorp.github.io/GridActually/gridactuallytest.html)

## Usage
###1)###
Make an image sprite comprised of 27 square 200x200 images arranged side-by-side into a single image that's 200px high and 5400px wide.

An example is included in this repository as "gridactuallysprite.jpg".

###2)###
Add jQuery, the JS file, the CSS file, and the sprite to your favorite web page. Like...

```html
<script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
<script src="gridactually.js"></script>

<link rel="stylesheet" media="all" href="gridactually.css">
<img class="gridactually-image" src="gridactuallysprite.jpg">
```
## Huh. Why?
This grid was built for the homepage of Avocado, an app for people. And because the [ending of Love Actually](http://www.youtube.com/watch?v=iEQPXDGRaEk&t=2m37s) included an inspring design.

## Requirements
A recent version of jQuery. Built and tested with 1.11.1.

## License
Grid Actually is freely distributable under the MIT license. See LICENSE.txt for full license.


# Souhail Bourassi — portfolio

A static, single-page portfolio with a layered 3D hero portrait and depth throughout. There is no build step: serve the folder with any static server, such as VS Code Live Server or `npx http-server`.

## Files

- `index.html`: all content and markup.
- `assets/css/site.css`: the only stylesheet. Design tokens are at the top under `:root`.
- `assets/js/site.js`: nav state, scroll reveals, card tilt and glare, the portrait tilt and the testimonial carousel.
- `assets/js/hero-scene.js`: a faint Three.js starfield behind the hero. It loads `three@0.160.0` from jsDelivr through the import map in `index.html`.

## Hero portrait

The portrait is built from stacked CSS 3D layers inside `.portrait-card`, listed here from back to front:

1. **Glow:** a soft violet glow.
2. **Floor shadow:** a soft shadow under the portrait.
3. **Arch frame:** three `.frame-depth` slices behind it give the arch a solid, extruded edge.
4. **Photo:** sits 30px in front of the arch, with the head breaking out above it.
5. **Bottom fade:** blends the photo and arch into the floor.
6. **Badges:** float further forward.

The card turns toward the mouse. On touch devices it stays at a static 3D angle.

The portrait's dark matte is removed at display time by the SVG `#portrait-alpha` filter, so the source image is unchanged.

## Behaviour

- Visitors who set `prefers-reduced-motion` get static content.
- The starfield runs only while the hero is visible.
- The contact form still posts to the existing Getform endpoint.

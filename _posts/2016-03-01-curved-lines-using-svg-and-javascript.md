---
layout: post
title: Curved Lines using SVG and JavaScript
date: 2016-03-01
comments: true
---

This post deals with implementing an evenly curved line using SVG and
JavaScript. SVG supports quadratic and cubic bezier curves using the `C`, `S`
and `Q` path commands but those leave you with the calculation of the control
points.

## Calculating the control points

To obtain a consistent and even curve one needs to place the control points like
the following figure illustrates.

![Curved line control points](/img/blog/curved-line.svg)

Given are the outer control points *A* and *D*, as the line starting and ending
points, as well as the curviness expressed by the degree *a*.

```
function curvedLine(Ax, Ay, Dx, Dy, a) {
```

*d* is the calculated distance between the outer control points.

```
  const d = Math.sqrt(Math.pow(Ax-Dx, 2) + Math.pow(Ay-Dy, 2));
```

*rad* is the radian measure of the degree *a*.

```
  const rad = a / 180.0 * 2.0 * Math.PI;
```

*r* is the distance from the outer to the inner control points.

```
  const r = (0.3 * d) / Math.cos(rad);
```

*theta* is the calculated angle of the line passing through both outer control
points in radian.

```
const theta = Math.atan2(Ay - Dy, Ax - Dx);
```

*aO* and *aD* are two angles in radian that are required to calculate the inner
control points.

```
  const aO = theta - rad + Math.PI,
        aD = theta + rad;
```

The inner control points *B* and *C*, respectively, are calculated based on the
line connecting the outer control points using the angle *a* and *r* as illustrated in the figure.

```
  const Bx = Ax + r*Math.cos(aO),
        By = Ay + r*Math.sin(aO),
        Cx = Dx + r*Math.cos(aD),
        Cy = Dy + r*Math.sin(aD);
```

Last but not least, the SVG path is built from the control points.

```
  return `M${Ax},${Ay} C${Bx},${By} ${Cx},${Cy} ${Dx},${Dy}`
}
```

## Using the function

You can use an SVG library like D3.js to use the function result in an SVG path.

```
let svg = d3.select("body").append("svg")
  .attr("width", 500)
  .attr("height", 200);

svg.append('path')
  .attr('stroke', '#000')
  .attr('fill', 'none')
  .attr('d', curvedLine(30, 160, 470, 160, 20));
```

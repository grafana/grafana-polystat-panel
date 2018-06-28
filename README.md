# Grafana Polystat Panel

This panel plugin provides a [D3-based](http://www.d3js.org) multistat panel for [Grafana](http://www.grafana.org) 3.x/4.x/5.x.

A hexagon is create for each metric received, with the ability to group metrics into a composite metric, and display the alert state of the composite.

## Screenshots

This plugin supports autoscaling for best-fit sizing of each polygon to the panel size. When the complete text cannot be displayed, only tooltips are active.

### All visible
![Scaled3](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-scaled3.png?token=AHBelVMwePbR84Lvm0a441yGv1-oYRHxks5bPZn2wA%3D%3D)
### Scaled down
![Scaled1](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-scaled1.png?token=AHBelc7t0KnPYPhdCXoGlDUr94MRQ26bks5bPZpfwA%3D%3D)
### Scaled down with tooltip
![Scaled2](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-scaled2.png?token=AHBelfDDlMA9l_kdxoyJWF2xTPCFjIAvks5bPZqBwA%3D%3D)

## Options

![State with Composites](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-options-all.png?token=AHBelbOGGpJ0HX70ajMXl3XAcc1hMOHBks5bPZqZwA%3D%3D)

### Layout

![Layout](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-options-layout.png?token=AHBelZTu1VR3g8zqNi4n04kz3UJCf3Szks5bPZq1wA%3D%3D)

Specify the desired number of columns and rows, or select Autosize to allow the plugin to calculate a "best fit" for the size of the panel.

#### Columns
Max # of columns to create
#### Rows
Max # rows to create
NOTE: if both columns and rows are set, only rows*columns will be displayed, generally one or none should be set.

#### Display Limit
Set a limit on number of hexagons to be displayed, set to 0 for no limit.

### Sizing
![Sizing](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-options-sizing.png?token=AHBelZ71kGjJjai2SJTKRWnKFdYPTmVBks5bPZrQwA%3D%3D)

Set the size of the polygon to a fixed size, or select auto-size for "best fit".

### Sorting
![Sorting](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-options-sorting.png?token=AHBelZNWQODVZR-2EPEwJzf-sdx28LH9ks5bPZrmwA%3D%3D)

### Tooltips

![Tooltips](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-options-tooltips.png?token=AHBelVOgciJkmll_BXcaPpXAuJU-zYXoks5bPZr4wA%3D%3D)

Set the font to be used for Tooltips

### Global

![Global](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-options-global.png?token=AHBelTbJcmJGZBwMrHcaBdnMchKPqGGEks5bPZsNwA%3D%3D)

### Animation

![Animation](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-options-animation.png?token=AHBelcYWw5as0R_PUbY2_OptPqjDHpWRks5bPZsiwA%3D%3D)

#### Speed

Speed of animation in milliseconds

#### Display
Show all
Show triggered


### Actions

#### Click Through

Click through to use when none are defined for a hexagon.

#### Show Metric Name

Display the metric in the hexagon

#### Show Metric Value

Display the metric value

#### Animate Composites

Animate hexagon to display metrics if there are composites

## Overrides

![Overrides](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-overrides-all.png?token=AHBelZ0gKiwbiByMGYxi_lx6WzulQxamks5bPZs2wA%3D%3D)

## Composites

![Composites](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-composites-all.png?token=AHBelfcW7VqnZubK3PMd6ilkj_Ppqu8Hks5bPZtKwA%3D%3D)

## Value Mappings

## Time Range

### Screenshots

#### Tooltip

Hovering over a hexagon shows the metrics that comprise the displayed state.
For composites this will expand members of the composite.

![Tooltip](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-tooltip.png?token=AHBelUgpo8dN0wXl4MgaOx-jLg8q5hThks5bPZtpwA%3D%3D)

#### State with composites

This shows creation of composites, where you select which metrics comprise the composite.

![State with Composites](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-composite-example1.png?token=AHBelVeXvIfTh_x5wX9uu5QZ1eHrKSGvks5bPZt8wA%3D%3D)

This shows composites configured for GPU 0,1,2,3, and non-grouped metrics from GPU4-7.

![State with partial composites](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/master/src/screenshots/polystat-gpu-state-composites.png?token=AHBelXmqTBW2k3gB9TRwmdMnptr-ba4kks5bPZuNwA%3D%3D)
## Building

This plugin relies on Grunt/NPM/Bower, typical build sequence:

```
npm install
bower install
grunt
```

For development, you can run:
```
grunt watch
```
The code will be parsed then copied into "dist" if "jslint" passes without errors.


### Docker Support

A docker-compose.yml file is include for easy development and testing, just run
```
docker-compose up
```

Then browse to http://localhost:3000


## External Dependencies

* Grafana 3.x/4.x/5.x

## Build Dependencies

* npm
* bower
* grunt

#### Acknowledgements

This panel is based on these D3 examples:
* https://www.visualcinnamon.com/2013/07/self-organizing-maps-creating-hexagonal.html


#### Changelog


##### v1.0.0
- Initial commit

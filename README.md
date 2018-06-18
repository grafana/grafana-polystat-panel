# Grafana Polystat Panel

This panel plugin provides a [D3-based](http://www.d3js.org) multistat panel for [Grafana](http://www.grafana.org) 3.x/4.x/5.x.

A hexagon is create for each metric received, with the ability to group metrics into a composite metric, and display the alert state of the composite.

## Options

![State with Composites](src/screenshots/polystat-options.png)

### Layout

Specify the desired number of columns and rows, or select Autosize to allow the plugin to calculate a "best fit" for the size of the panel.

Columns: Max # of columns to create
Rows: Max # rows to create

NOTE: if both are set, only rows*columns will be displayed, generally one or none should be set.

Display Limit: Set a limit on number of hexagons to be displayed, set to 0 for no limit.

### Sizing

Set the size of the polygon to a fixed size, or select auto-size for "best fit".

### Tooltips

Set the font to be used for Tooltips

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

## Synthetics

## Composites

## Value Mappings

## Time Range

### Screenshots

#### Tooltip

Hovering over a hexagon shows the metrics that comprise the displayed state.
For composites this will expand members of the composite.

![Tooltip](src/screenshots/polystat-tooltip.png)

#### State with composites

This shows creation of composites, where you select which metrics comprise the composite.

![State with Composites](src/screenshots/polystat-composites.png)

This shows composites configured for GPU 0,1,2,3, and non-grouped metrics from GPU4-7.

![State with partial composites](src/screenshots/polystat-gpu-state-composites.png)
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

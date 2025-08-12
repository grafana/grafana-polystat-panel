# Overrides

Use overrides to apply additional rendering options for metrics, including custom thresholds and clickthroughs. 

This is an example override that sets the unit for metrics that match a regular expression:

![Override without Thresholds](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-overrides-no-thresholds.png)

The same override with thresholds added:

![Override with Thresholds](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-overrides-with-thresholds.png)

The final result of the above override with thresholds applied:

![Override with Thresholds Rendered](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-overrides-rendered-thresholds.png)

## Label

New in V2 is the ability to name overrides to find them easier when there are many being created. The label is not rendered on the polygon.

## Metric

The panel will provide "hints" for metric names, and allow you to enter a regular expression to match multiple metrics.

## Decimals (limit)

Sets the maximum number of decimals to be displayed. Leave this empty to show all decimals.

## Statistic to Display (Stat)

This lets you specify a different statistic to use for the matching metric, and will replace the global statistic.
As with the global setting, the full set of statistics Grafana provides are available.

## Unit Formatting

All of the unit types are available in this selector and will be applied to the value displayed.
A suffix is typically added by the formatter to indicate the unit like "B/sec" or symbols for temperatures, percentages, and similar.

## Thresholds

An override can specify a set of thresholds that are to be applied to the matching metric, and will replace any global threshold settings.

See the section [thresholds](#thresholds-details) below for details on how thresholds are evaluated.

## Prefix

Text in this field will be prepended to the rendered metric.

## Suffix

Text in this field will be appended to the rendered metric after any unit text is applied.

## Clickthrough URL

Use this option to specify an URL to go to when the polygon is clicked on. Regular expression capture groups and template variables are available to form the URL.

### Example using capture groups

For example, if we have multiple metrics like this:

```TEXT
hera_memutil
plex_memutil
```

And a regular expression for the override:

```REGEX
/(.*)_mem/
```

The capture group `$1` can be used in the url:

```TEXT
/dashboard/detail-dash?var-HOSTNAME=$1
```

The url will end up being:

`https://myserver/dashboard/detail-dash?var-HOSTNAME=hera`

For more examples using template variables and regular expression capture groups see [this section on templating](#templating)

### Clickthrough options 

- Sanitize URL: Normally this is enabled, and is intended to prevent malicious data entry.

- Open URL in New Tab: When checked, this will cause a new tab to be opened when you click on the polygon. For drill-down dashboards, disabling this is recommended.

- Enable Custom URL Target: When checked, this will allow you to set a custom value for the `target` attribute of the clickthrough. Note that his is only visible when `Open URL in New Tab` is disabled. This will override the equivalent global setting.

![Custom URL Target](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-custom-clickthrough-target.png)

- Custom URL Target: Specify the content for the `target` attribute of the clickthrough URL. This will override the equivalent global setting. Typical values are: _blank|_self|_parent|_top|

## Bottom Menu

See the menu at the bottom right side of the override for additional controls.

![Override Menu](https://raw.githubusercontent.com/grafana/grafana-polystat-panel/v2.x/src/img/screenshots/polystat-v2-override-bottom-menu.png)

- Ordering: Up and Down arrows allow you move the override so you can force a different evaluation priority or simply to group similar overrides together.

- Hide/Show: Use the "eye" icon to enable/disable the override.

- Duplicate: This button will make a copy of the current override and append it to the end of the list.  It will have a new name with "Copy" at the end.

- Delete: This button will delete the override completely.
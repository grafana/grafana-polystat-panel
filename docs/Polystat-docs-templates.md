# Template variables

## Using Dashboard Template Variables

Template variables are available in the `clickThroughUrl` setting, specified by using ${varname}.
They can also be passed to another dashboard by appending var-VARNAME=value to the url

```URL
/dashboard/xyz?var-VARNAME=${VARNAME}
```

Overrides using regular expressions with capture groups provide addition variables that can be referenced in a clickthroughUrl.

Example:

Regular Expression: `/TEMP_(?<A_HOST>.*)_/`
Clickthrough URL: `/grafana/d/eCLHPr57k/drilldown?orgId=1&var-host=${A_HOST}`

The above example will expand the capture named group `A_HOST` and replace the value in the specified URL.

## Using Polystat Variables

Each polygon represents either a single metric, or a composite metric

An example drilldown clickthrough url can be specified like this:

```URL
dashboard/db/drilldown?var-HOSTNAME=${__cell_name}
```

NOTE: Metrics are sorted using the global options "Sorting" settings. Global filters are also applied before dereferencing is performed.

### Single Metric Variables

The name and value of a polygon can be referenced using the following syntax:

* Metric Name: `${__cell_name}`
* Metric Value: `${__cell}`
* Metric Raw Value: `${__cell:raw}` syntax.
   By default values are URI encoded. Use this syntax to *disable* encoding

### Composite Metric Variables

The names and values of a composite polygon can be referenced using the following syntax:

* Composite Name: `${__composite_name}`
* Metric Name: `${__cell_name_n}`
* Metric Value: `${__cell_n}`
* Metric Raw Value: `${__cell_n:raw}` syntax.
  By default values are URI encoded. Use this syntax to *disable* encoding
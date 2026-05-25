# Use Clickthrough URLs

Use this setting to indicate the URL to open when clicking the polygon. 

Options include:

- **Sanitize URL**: Usually enabled, it prevents malicious data entry.

- **Open URL In New Tab**: If checked, clicking a polygon will open in a new tab. Disable this option in drill-down dashboards.

- **Enable Custom URL Target**: If checked, you can set a custom value for the `target` attribute of the clickthrough. Note that this is only visible when `Open in New Tab` is disabled.

- **Custom URL Target**: Specifies the content for the `target` attribute of the clickthrough URL. Typical values are `_blank`, `_self`, `_parent`, and `_top`.

## Form clickthrough URLs using regex and template variables

You can form URLs using regular expression capture groups and [template variables](#use-template-variables).

**Example 1**

For example, if you have multiple metrics like this:

```TEXT
hera_memutil
plex_memutil
```

And a regular expression for the override:

```REGEX
/(.*)_mem/
```

You can use the capture group `$1` in the URL:

```TEXT
/dashboard/detail-dash?var-HOSTNAME=$1
```

And obtain the final URL `https://myserver/dashboard/detail-dash?var-HOSTNAME=hera`.

**Example 2: Reuse text**

You have a text in your metric legend:

`some_email+some_text@domain.com SOME_TEXT`

To parse, it use the expression:

```
([^+]*)\+([^+]*)\s+(.*)
``` 

## Use template variables

### Using Dashboard Template Variables

Template variables are available in the `clickThroughUrl` setting, specified by using ${varname}. They can also be passed to another dashboard by appending var-VARNAME=value to the URL:

```URL
/dashboard/xyz?var-VARNAME=${VARNAME}
```

Overrides using regular expressions with capture groups provide additional variables that can be referenced in a ClickthroughUrl.

For example, to expand the capture named group `A_HOST` and replace the value in the specified URL, use:

- Regular Expression: `/TEMP_(?<A_HOST>.*)_/`
- Clickthrough URL: `/grafana/d/eCLHPr57k/drilldown?orgId=1&var-host=${A_HOST}`

### Using Polystat Variables

Each polygon represents either a single metric, or a composite metric.

You can specify a drilldown clickthrough URL like this:

```URL
dashboard/db/drilldown?var-HOSTNAME=${__cell_name}
```

Metrics are sorted using the global options "Sorting" settings. Global filters are also applied before dereferencing is performed.

#### Single Metric Variables

The name and value of a polygon can be referenced using the following syntax:

* Metric Name: `${__cell_name}`
* Metric Value: `${__cell}`
* Metric Raw Value: `${__cell:raw}` syntax. 

By default values are URI encoded. Use this syntax to *disable* encoding.

#### Composite Metric Variables

The names and values of a composite polygon can be referenced using the following syntax:

* Composite Name: `${__composite_name}`
* Metric Name: `${__cell_name_n}`
* Metric Value: `${__cell_n}`
* Metric Raw Value: `${__cell_n:raw}` syntax.

By default values are URI encoded. Use this syntax to *disable* encoding.
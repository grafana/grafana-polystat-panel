---
title: Troubleshooting
description: Troubleshoot layout warnings, missing text, missing polygons and clickthrough targets in the Polystat panel.
sidebar_position: 7
---

Find the symptom you see below for its likely cause and fix.

## Not enough rows and columns for data

The panel shows a message such as "Not enough rows and columns for data. There are 12 items to display, and only 8 places allocated."

This happens when you turn off both **Auto Size Columns** and **Auto Size Rows**, and **Columns** multiplied by **Rows** is smaller than the number of polygons to draw.

To resolve it, do one of the following under **Layout**:

- Increase **Columns** or **Rows**.
- Turn **Auto Size Columns** or **Auto Size Rows** back on.
- Lower **Display Limit** so the panel draws fewer polygons.

Refer to [Layout and sizing](./options/layout.md) for how these options interact.

## Polygons show no text

When the complete label and value can't fit inside a polygon, the panel hides the text and only the tooltip remains. This is common with many metrics in a small panel.

To resolve it, try one or more of the following:

- Make the panel larger, or lower **Display Limit** so each polygon gets more space.
- Shorten metric names with **Global Regex** under [Global options](./options/global.md#global-aliasing).
- Turn off **Auto Scale Fonts** under [Text](./options/text.md), set smaller font sizes and turn on **Use Ellipses** to truncate long labels.

## Panel shows text instead of polygons

The panel shows only the **Non Triggered State Text** and no polygons.

This happens when there is nothing left to draw. The two usual causes are:

- **Display Mode** under **Global** is **Show Triggered** and no metric has crossed a threshold. Check your thresholds, or set **Display Mode** to **Show All**.
- The query returns no numeric fields. Polystat only draws polygons for numeric values. Refer to [Data formats](./data-formats.md) for the shapes it accepts.

## Custom URL target option is missing

**Enable Custom URL Target** only appears when **Open URL In New Tab** is off. Turn off **Open URL In New Tab** on the global settings, override or composite you're configuring, then turn on **Enable Custom URL Target** and set **Custom URL Target**.

## Composite animation is slower than configured

The panel raises any **Animation Speed (ms)** value below `200` to `200`. Set a value of `200` or higher to control the speed.

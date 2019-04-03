# Change Log

## v1.0.0
- Initial commit
## v1.0.1
- Added Options -> Show Timestamp checkbox for tooltips
## v1.0.11
- Panel no longer shares data/affects other panels of same type
## v1.0.12
- Fixed composite state evaluations
- Added ability to set color and size of polygon border
- Single shape now centers itself
- Non-composites now show their value if possible
- New tests added to verify fixes
## v1.0.13
- Default to roboto font
- Default to short units and 2 decimals
- Moved panel options outside of saved config
- Add global unit format and global decimals
- No longer errors when thresholds not found
- Refactor thresholds to allow range evaluation in overrides
- Refactor and implement custom gradients for overrides
## v1.0.14
- Update Logo
- Fixed threshold evaluation
- Added global fill color option
- Autoscaling fonts has better results
- Refactor UI for overrides, implement enable/disable
- Refactor UI for composites, implement enable/disable
- Implement global fill color for no thresholds
- Now correctly parses custom color selection
## v1.0.15
- implemented metric referencing for clickthroughs (issue #38)
- implemented composite name referencing
- implemented template variables for clickthroughs
- fixed bug with default clickthrough and sanitize url

/**
 * Tests for the panel option registration in module.ts.
 *
 * Defaults registered here are what every panel that never set the option gets, including panels
 * saved by older plugin versions, so changing one silently re-renders existing dashboards.
 */
import { plugin } from './module';
import { PolygonNamedShapes, PolygonShapes } from './components/types';

/**
 * Runs the plugin's options supplier against a proxy that records every add*() call and returns
 * itself, so the builder chain completes without a real Grafana registry.
 */
const registeredOptions = (): Map<string, any> => {
  const captured = new Map<string, any>();
  const builder: any = new Proxy(
    {},
    {
      get: () => (config: any) => {
        if (config?.path) {
          captured.set(config.path, config.defaultValue);
        }
        return builder;
      },
    }
  );
  (plugin as any).optionsSupplier(builder, { data: [] });
  return captured;
};

describe('panel option defaults', () => {
  it('defaults the shape to the pointed-top hexagon', () => {
    // not PolygonNamedShapes[0], which would move if a shape were inserted at the head of the list
    expect(registeredOptions().get('globalShape')).toBe(PolygonShapes.HEXAGON_POINTED_TOP);
  });

  it('offers the default shape as a selectable option', () => {
    const registeredDefault = registeredOptions().get('globalShape');
    expect(PolygonNamedShapes.map((shape) => shape.value)).toContain(registeredDefault);
  });
});

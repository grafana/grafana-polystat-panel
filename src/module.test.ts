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
          captured.set(config.path, config);
        }
        return builder;
      },
    }
  );
  (plugin as any).optionsSupplier(builder, { data: [] });
  return captured;
};

describe('panel option defaults', () => {
  it('captures the options it claims to inspect', () => {
    // guards the harness itself: a Proxy that recorded nothing would make every other case vacuous
    const captured = registeredOptions();
    expect(captured.size).toBeGreaterThan(40);
    expect(captured.has('globalShape')).toBe(true);
  });

  it('defaults the shape to the pointed-top hexagon', () => {
    // not PolygonNamedShapes[0], which would move if a shape were inserted at the head of the list
    expect(registeredOptions().get('globalShape').defaultValue).toBe(PolygonShapes.HEXAGON_POINTED_TOP);
  });

  it('offers every shape the renderer supports in the shape picker', () => {
    // reads the settings actually wired onto the select, so pointing it at another option list
    // or dropping a shape from the picker fails here
    const offered = registeredOptions().get('globalShape').settings.options;
    expect(offered).toEqual(PolygonNamedShapes);
    expect(offered.map((shape: any) => shape.value).sort()).toEqual(Object.values(PolygonShapes).sort());
  });

  it.each([
    ['autoSizeColumns', true],
    ['autoSizeRows', true],
    ['autoSizePolygons', true],
    ['layoutNumColumns', 8],
    ['layoutNumRows', 8],
    ['globalShowValueEnabled', true],
  ])('defaults %s to the value existing panels rely on', (path, expected) => {
    expect(registeredOptions().get(path).defaultValue).toBe(expected);
  });
});

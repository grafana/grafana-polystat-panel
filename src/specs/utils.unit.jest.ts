/**
 * Tests for utils
 */

import {GetDecimalsForValue} from "../utils";

describe("Utils GetDecimalsForValue", () => {
  describe("With decimals", () => {
    it("returns 2 decimals", () => {
      let result = GetDecimalsForValue(10.55, 2);
      expect(result.decimals).toBe(2);
    });
    it("returns 1 decimal", () => {
      let result = GetDecimalsForValue(10.55, 1);
      expect(result.decimals).toBe(1);
    });
  });
});

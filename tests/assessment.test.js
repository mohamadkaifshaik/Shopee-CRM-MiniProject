const {
  calculatePercentage,
  calculateGrade,
  isPassed,
  getPerformanceFeedback,
} = require("../js/app.js");

describe("calculatePercentage", () => {
  test("full score → 100", () => expect(calculatePercentage(8, 8)).toBe(100));
  test("half score → 50", () => expect(calculatePercentage(4, 8)).toBe(50));
  test("zero score → 0", () => expect(calculatePercentage(0, 8)).toBe(0));
  test("zero total → 0 (no crash)", () =>
    expect(calculatePercentage(0, 0)).toBe(0));
  test("rounds correctly", () => expect(calculatePercentage(1, 3)).toBe(33));
});

describe("calculateGrade", () => {
  test("100 → A+", () => expect(calculateGrade(100)).toBe("A+"));
  test("90  → A+", () => expect(calculateGrade(90)).toBe("A+"));
  test("85  → A", () => expect(calculateGrade(85)).toBe("A"));
  test("75  → B", () => expect(calculateGrade(75)).toBe("B"));
  test("65  → C", () => expect(calculateGrade(65)).toBe("C"));
  test("55  → D", () => expect(calculateGrade(55)).toBe("D"));
  test("49  → F", () => expect(calculateGrade(49)).toBe("F"));
  test("0   → F", () => expect(calculateGrade(0)).toBe("F"));
});

describe("isPassed", () => {
  test("50 → true  (threshold)", () => expect(isPassed(50)).toBe(true));
  test("51 → true", () => expect(isPassed(51)).toBe(true));
  test("100 → true", () => expect(isPassed(100)).toBe(true));
  test("49 → false", () => expect(isPassed(49)).toBe(false));
  test("0  → false", () => expect(isPassed(0)).toBe(false));
});

describe("getPerformanceFeedback", () => {
  test("≥ 90 → pass + outstanding message", () => {
    const fb = getPerformanceFeedback(95);
    expect(fb.type).toBe("pass");
    expect(fb.msg).toMatch(/outstanding/i);
  });
  test("≥ 50 → pass type", () =>
    expect(getPerformanceFeedback(60).type).toBe("pass"));
  test("< 50 → fail type", () =>
    expect(getPerformanceFeedback(30).type).toBe("fail"));
  test("fail message mentions 'not pass'", () => {
    expect(getPerformanceFeedback(0).msg).toMatch(/not pass/i);
  });
  test("returns non-empty message always", () => {
    [0, 25, 50, 75, 100].forEach((p) =>
      expect(getPerformanceFeedback(p).msg.length).toBeGreaterThan(0),
    );
  });
});

describe("Integration: full quiz score flow", () => {
  test("6/8 → 75% → B → pass", () => {
    const pct = calculatePercentage(6, 8);
    expect(pct).toBe(75);
    expect(calculateGrade(pct)).toBe("B");
    expect(isPassed(pct)).toBe(true);
  });
  test("3/8 → 38% → F → fail", () => {
    const pct = calculatePercentage(3, 8);
    expect(pct).toBe(38);
    expect(calculateGrade(pct)).toBe("F");
    expect(isPassed(pct)).toBe(false);
  });
  test("8/8 → 100% → A+ → pass", () => {
    const pct = calculatePercentage(8, 8);
    expect(pct).toBe(100);
    expect(calculateGrade(pct)).toBe("A+");
    expect(isPassed(pct)).toBe(true);
  });
});

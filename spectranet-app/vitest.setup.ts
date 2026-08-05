import "@testing-library/jest-dom/vitest";
import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement scrollTo (it does no real layout/rendering),
// so components that call it need a no-op stub in the test environment.
Element.prototype.scrollTo = () => {};
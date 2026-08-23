import { describe, it, expect } from "vitest";
import { BLACKHOLE_VERT, BLACKHOLE_FRAG } from "./blackhole";

describe("blackhole shaders", () => {
  it("exports WebGL2 shader sources", () => {
    expect(BLACKHOLE_VERT).toContain("#version 300 es");
    expect(BLACKHOLE_VERT).toContain("gl_VertexID");
    expect(BLACKHOLE_FRAG).toContain("#version 300 es");
    expect(BLACKHOLE_FRAG).toContain("fragColor");
  });

  it("fragment shader is self-contained (no texture/attribute deps)", () => {
    expect(BLACKHOLE_FRAG).toContain("gl_FragCoord");
    expect(BLACKHOLE_FRAG).not.toContain("sampler2D");
    expect(BLACKHOLE_FRAG).not.toContain("attribute ");
  });

  it("handles the event horizon and accretion disk", () => {
    expect(BLACKHOLE_FRAG).toContain("smoothstep");
    expect(BLACKHOLE_FRAG).toContain("diskEmission");
    expect(BLACKHOLE_FRAG).toContain("HORIZON");
  });
});

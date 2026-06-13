import { describe, it, expect } from "vitest";
import { parseCoachSyllabus, buildCoach } from "./coaches";

const SAMPLE = `Series I

	volume 1: arm drag

		       00:00  1.  arm drag against standing
		done   00:42  2.  details: wrist control
		wip    07:49  5.  countering arm drag

	volume 2: harness

		later  00:30  1.  setting harness
`;

describe("parseCoachSyllabus", () => {
  const series = parseCoachSyllabus(SAMPLE);

  it("extrai séries e volumes", () => {
    expect(series).toHaveLength(1);
    expect(series[0].nome).toBe("Series I");
    expect(series[0].volumes).toHaveLength(2);
    expect(series[0].volumes[0].tema).toBe("arm drag");
  });

  it("extrai capítulos com status, tempo, número e título", () => {
    const caps = series[0].volumes[0].capitulos;
    expect(caps).toHaveLength(3);
    expect(caps[0]).toMatchObject({ status: "none", tempo: "00:00", numero: 1 });
    expect(caps[1].status).toBe("done");
    expect(caps[2].status).toBe("wip");
    expect(caps[2].titulo).toBe("countering arm drag");
  });
});

describe("buildCoach", () => {
  it("monta coach com slug e nome humanizados", () => {
    const c = buildCoach("marcelo_garcia", SAMPLE);
    expect(c.slug).toBe("marcelo-garcia");
    expect(c.nome).toBe("Marcelo Garcia");
    expect(c.series).toHaveLength(1);
  });
});

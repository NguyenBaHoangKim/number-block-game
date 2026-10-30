import type { Difficulty, Slot } from "./types";
/** Original coordinates for the seven-piece square dissection; no image assets. */
export function tangramSlots(seed: number): Slot[] {
  const polygons: [number, number][][] = [
    [
      [0, 0],
      [4, 0],
      [2, 2],
    ],
    [
      [0, 0],
      [2, 2],
      [0, 4],
    ],
    [
      [4, 4],
      [2, 4],
      [4, 2],
    ],
    [
      [1, 3],
      [2, 2],
      [3, 3],
      [2, 4],
    ],
    [
      [0, 4],
      [1, 3],
      [2, 4],
    ],
    [
      [3, 1],
      [3, 3],
      [2, 2],
    ],
    [
      [4, 0],
      [4, 2],
      [3, 3],
      [3, 1],
    ],
  ];
  const colors = [
    "#8b9be5",
    "#edbc55",
    "#78b794",
    "#db8caa",
    "#68b8c9",
    "#af91ce",
    "#d9a278",
  ];
  const angle = ((seed % 4) * Math.PI) / 2;
  return polygons.map((points, i) => {
    const rotated = points.map(
      ([x, y]) =>
        [
          2 + (x - 2) * Math.cos(angle) - (y - 2) * Math.sin(angle),
          2 + (x - 2) * Math.sin(angle) + (y - 2) * Math.cos(angle),
        ] as [number, number],
    );
    const minX = Math.min(...rotated.map((p) => p[0])),
      maxX = Math.max(...rotated.map((p) => p[0])),
      minY = Math.min(...rotated.map((p) => p[1])),
      maxY = Math.max(...rotated.map((p) => p[1]));
    return {
      id: `slot-${i}`,
      shape: i === 3 ? "square" : i === 6 ? "parallelogram" : "triangle",
      x: 20 + ((minX + maxX) / 2) * 15,
      y: 20 + ((minY + maxY) / 2) * 15,
      width: (maxX - minX) * 15,
      height: (maxY - minY) * 15,
      polygon: rotated.map(([x, y]) => [
        ((x - minX) / (maxX - minX)) * 100,
        ((y - minY) / (maxY - minY)) * 100,
      ]),
      rotation: 0,
      color: colors[i],
    };
  });
}
export function initialTangramRotation(index: number, difficulty: Difficulty) {
  return difficulty < 3 ? 0 : (index % 2) * 90;
}

/** Equal circular sectors, assembled edge to edge into one whole cake. */
export function cakeSlots(count: 2 | 4, seed: number): Slot[] {
  return Array.from({ length: count }, (_, i) => {
    const start = (i * Math.PI * 2) / count + ((seed % 4) * Math.PI) / 2;
    const points: [number, number][] = [
      [0, 0],
      ...Array.from({ length: 97 }, (_, j) => {
        const angle = start + (j * Math.PI * 2) / count / 96;
        return [Math.cos(angle), Math.sin(angle)] as [number, number];
      }),
    ];
    const minX = Math.min(...points.map((p) => p[0])),
      maxX = Math.max(...points.map((p) => p[0]));
    const minY = Math.min(...points.map((p) => p[1])),
      maxY = Math.max(...points.map((p) => p[1]));
    return {
      id: `slot-${i}`,
      shape: count === 2 ? "half" : "quarter",
      x: 50 + (minX + maxX) * 17,
      y: 50 + (minY + maxY) * 17,
      width: (maxX - minX) * 34,
      height: (maxY - minY) * 34,
      rotation: 0,
      color: ["#edbc55", "#db8caa", "#8b9be5", "#78b794"][i],
      polygon: points.map(([x, y]) => [
        ((x - minX) / (maxX - minX)) * 100,
        ((y - minY) / (maxY - minY)) * 100,
      ]),
    };
  });
}

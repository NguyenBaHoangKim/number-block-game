import { tangramSlots, initialTangramRotation, cakeSlots } from "./tangram";
import type {
  ChoicePayload,
  Difficulty,
  ExerciseQuestion,
  ExerciseType,
  Operation,
  Payload,
  PlacementPayload,
  Rule,
  Scalar,
  Shape,
  Solid,
  Slot,
} from "./types";
import { definitionByType, days, shapeNames, solidNames } from "./catalog";
import { calculate, solutions } from "./validators";
export function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
const colors = [
  "#8b9be5",
  "#edbc55",
  "#78b794",
  "#db8caa",
  "#68b8c9",
  "#af91ce",
];
export function generateQuestion(
  type: ExerciseType,
  difficulty: Difficulty,
  seed: number,
  id = `${type}-${difficulty}-${seed}`,
): ExerciseQuestion {
  const random = seeded(seed),
    pick = (max: number, min = 1) =>
      min + Math.floor(random() * (max - min + 1));
  const limit = difficulty === 1 ? 5 : difficulty === 2 ? 10 : 20;
  const a = pick(Math.max(2, Math.floor(limit / 2))),
    b = pick(Math.max(2, Math.floor(limit / 2)));
  let payload: Payload;
  let instruction = "";
  let explanation = "";
  let hint = "Quan sát từng khối và thử lại nhé.";
  function choice(
    rule: Rule,
    text: string,
    why: string,
    options?: Scalar[],
    multiple = false,
  ): ChoicePayload {
    instruction = text;
    explanation = why;
    const expected = solutions(rule, options ?? []);
    const answer = expected[0];
    const choices =
      options ??
      (typeof answer === "number"
        ? [answer, Math.max(0, answer - 1), answer + 1, answer + 2]
            .filter((n, i, all) => all.indexOf(n) === i)
            .slice(0, difficulty === 1 ? 2 : 3)
        : [answer, "Không phải"]);
    return {
      kind: "choice",
      rule,
      options: shuffle(choices, random),
      multiple,
    };
  }
  const addRule: Rule = { kind: "arithmetic", a, b, op: "+", ask: "result" };
  const total = a + b;
  switch (type) {
    case "tap_counting":
    case "quick_subitizing":
    case "odd_even_pairs": {
      const count = type === "tap_counting" && seed % 5 === 0 ? 0 : pick(limit);
      payload = {
        kind: "count",
        count,
        ...(type === "quick_subitizing" ? { flashMs: 1800 } : {}),
        ...(type === "odd_even_pairs" ? { pairs: true } : {}),
      };
      instruction =
        type === "tap_counting"
          ? "Chạm từng khối, mỗi khối một lần."
          : type === "quick_subitizing"
            ? "Mở hộp, nhìn các khối rồi chọn số lượng."
            : "Ghép từng cặp rồi chọn chẵn hay lẻ.";
      explanation =
        type === "odd_even_pairs"
          ? `${count} có ${Math.floor(count / 2)} cặp${count % 2 ? " và dư một khối: số lẻ." : ", không dư: số chẵn."}`
          : `Có ${count} khối, mỗi khối được đếm đúng một lần.`;
      hint = "Có thể nhìn lại, không cần đếm vội.";
      break;
    }
    case "match_number_quantity": {
      const count = pick(limit);
      payload = choice(
        { kind: "arithmetic", a: count, b: 0, op: "+", ask: "result" },
        "Nhóm đang có bao nhiêu khối?",
        `Nhóm có đúng ${count} khối.`,
      );
      break;
    }
    case "block_addition":
    case "number_line": {
      payload = choice(
        addRule,
        type === "number_line"
          ? `Từ ${a}, tiến ${b} bước sẽ đến số nào?`
          : `Ghép ${a} khối với ${b} khối. Có tất cả mấy khối?`,
        `${a} + ${b} = ${total}. Đếm tổng số khối sau khi gộp nhé.`,
      );
      hint = `Bắt đầu với ${a}, thêm lần lượt ${b} khối.`;
      break;
    }
    case "number_machine": {
      const subtract = difficulty >= 3 && seed % 2 === 0;
      const input = subtract ? total : a;
      const op = subtract ? ("-" as const) : ("+" as const);
      const output = subtract ? a : total;
      payload = choice(
        { kind: "arithmetic", a: input, b, op, ask: "result" },
        `Máy ${subtract ? "bớt" : "thêm"} ${b} khối. Đưa ${input} vào, được mấy?`,
        `${input} ${op} ${b} = ${output}. Máy ${subtract ? "lấy bớt" : "thêm"} đúng ${b} khối.`,
      );
      hint = `Nhìn dấu ${op} trên máy rồi đếm khối ${subtract ? "còn lại" : "sau khi thêm"}.`;
      break;
    }
    case "block_subtraction":
      payload = choice(
        { kind: "arithmetic", a: total, b, op: "-", ask: "result" },
        `Có ${total} khối, lấy ra ${b}. Còn mấy khối?`,
        `${total} − ${b} = ${a}. Đếm những khối ở lại.`,
      );
      break;
    case "missing_number":
      payload = choice(
        { kind: "arithmetic", a, b, op: "+", ask: "missing" },
        `${a} + ? = ${total}. Bé tìm phần còn thiếu nhé.`,
        `${a} + ${b} = ${total}, phần còn thiếu là ${b}.`,
      );
      break;
    case "seesaw_compare": {
      const right = seed % 4 === 0 ? a : b;
      payload = choice(
        { kind: "relation", a, b: right },
        "Chọn dấu đúng cho hai nhóm khối.",
        `${a} ${a === right ? "=" : a > right ? ">" : "<"} ${right}. Bên nhiều khối hơn hạ xuống.`,
        [">", "<", "="],
      );
      break;
    }
    case "number_pattern": {
      const increment = difficulty < 3 ? 1 : seed % 2 ? 2 : -1;
      const start = increment < 0 ? pick(10, 6) : pick(4);
      const sequence = Array.from(
        { length: 3 },
        (_, i) => start + i * increment,
      );
      payload = choice(
        { kind: "pattern", sequence, increment },
        "Dãy số thay đổi đều. Số tiếp theo là gì?",
        `Mỗi lần ${increment > 0 ? "thêm" : "bớt"} ${Math.abs(increment)}: số tiếp theo là ${sequence[2] + increment}.`,
      );
      hint = `So sánh hai nhóm đứng cạnh nhau: mỗi lần ${increment > 0 ? "thêm" : "bớt"} ${Math.abs(increment)}.`;
      break;
    }
    case "equal_groups_multiplication":
    case "multiplication_array":
    case "equal_sharing_division": {
      const groups = difficulty < 3 ? 2 : pick(4, 2),
        perGroup = pick(difficulty < 3 ? 3 : 5);
      payload = {
        kind: "distribution",
        mode: type === "equal_sharing_division" ? "share" : "groups",
        labels: Array.from({ length: groups }, (_, i) => `Nhóm ${i + 1}`),
        targets: Array(groups).fill(perGroup),
        total: groups * perGroup,
      };
      instruction =
        type === "equal_sharing_division"
          ? `Chia đều ${groups * perGroup} khối cho ${groups} bạn.`
          : `Tạo ${groups} nhóm, mỗi nhóm ${perGroup} khối.`;
      explanation =
        type === "equal_sharing_division"
          ? `${groups * perGroup} chia đều cho ${groups}: mỗi bạn ${perGroup} khối.`
          : `${groups} × ${perGroup} = ${groups * perGroup}. Các nhóm đều bằng nhau.`;
      hint = "Thêm một khối cho mỗi nhóm theo từng vòng.";
      break;
    }
    case "shape_recognition": {
      const shapes: Shape[] = ["triangle", "square", "circle", "rectangle"];
      const shape = shapes[pick(3, 0)];
      payload = choice(
        { kind: "shape", shape, ask: "shape" },
        "Hình đang được vẽ tên là gì?",
        `Đây là ${shapeNames[shape].toLowerCase()}.`,
        shapes.map((s) => shapeNames[s]),
      );
      break;
    }
    case "bridge_building":
    case "ten_frame_completion": {
      const capacity =
          type === "ten_frame_completion" ? 10 : Math.min(10, 4 + difficulty),
        prefilled = pick(capacity - 1, 1);
      payload = { kind: "count", count: capacity, capacity, prefilled };
      instruction =
        type === "ten_frame_completion"
          ? `Đã có ${prefilled} khối. Điền cho đủ mười ô.`
          : `Cầu cần ${capacity} khối, đã có ${prefilled}. Nối cầu nhé!`;
      explanation = `${prefilled} + ${capacity - prefilled} = ${capacity}. Bé đã thêm đủ phần còn thiếu.`;
      hint = `Đếm những ô còn trống: đó là số khối cần thêm.`;
      break;
    }
    case "tell_time_hour":
    case "tell_time_advanced": {
      const hour = pick(12),
        minute =
          type === "tell_time_hour"
            ? 0
            : difficulty < 3
              ? 30
              : [15, 30, 45][pick(2, 0)];
      if (type === "tell_time_advanced" && difficulty >= 4 && seed % 2 === 0) {
        const elapsed = pick(3);
        payload = choice(
          { kind: "clock", hour, minute, elapsed },
          "Từ đồng hồ bên trái đến bên phải đã qua mấy giờ?",
          `Hai kim phút giữ nguyên. Kim giờ tiến ${elapsed} giờ.`,
          [elapsed, elapsed + 1, elapsed + 2],
        );
        hint = "Theo chiều kim đồng hồ, đếm số bước của kim giờ.";
        break;
      }
      payload = choice(
        { kind: "clock", hour, minute },
        "Quan sát hai kim. Đồng hồ chỉ mấy giờ?",
        `Kim giờ và kim phút chỉ ${hour}:${String(minute).padStart(2, "0")}.`,
        [
          `${hour}:${String(minute).padStart(2, "0")}`,
          `${(hour % 12) + 1}:${String(minute).padStart(2, "0")}`,
          `${hour}:${String((minute + 30) % 60).padStart(2, "0")}`,
        ],
      );
      hint =
        "Kim ngắn chỉ giờ, kim dài chỉ phút. Mỗi số trên vòng phút là 5 phút.";
      break;
    }
    case "number_bonds":
    case "multiple_solutions": {
      const target = difficulty < 3 ? pick(7, 4) : pick(12, 8),
        minPart = difficulty === 1 ? 1 : 0,
        required = Math.min(
          difficulty < 3 ? 2 : 3,
          Math.floor(target / 2) - minPart + 1,
        );
      payload = { kind: "parts", target, required, minPart, commutative: true };
      instruction = `Tìm ${required} cách ghép hai nhóm thành ${target}.`;
      explanation = `Mỗi cặp đều có tổng ${target}. Đổi chỗ hai nhóm là cùng một cách ghép.`;
      hint = `Thử ${minPart} và ${target - minPart}; rồi tăng một bên, giảm bên kia.`;
      break;
    }
    case "closest_to_target": {
      const target = pick(limit - 2, 2);
      const candidates = [
        [Math.max(0, target - 2), target + 1],
        [target - 1, target + 2],
        [Math.max(0, target - 2), target - 1],
      ][seed % 3];
      payload = choice(
        { kind: "closest", target, candidates },
        `Số nào gần ${target} hơn?`,
        `Đếm số bước đến ${target}. Số ít bước hơn gần mục tiêu hơn.`,
        candidates,
      );
      hint = "Đếm số đoạn trên đường số tới đích.";
      break;
    }
    case "before_after_number": {
      const n = pick(limit - 1, 1),
        direction = seed % 2 ? 1 : -1;
      payload = choice(
        { kind: "neighbor", n, direction },
        `Số đứng ${direction === 1 ? "sau" : "trước"} ${n} là gì?`,
        `${n} ${direction === 1 ? "thêm" : "bớt"} 1 là ${n + direction}.`,
      );
      break;
    }
    case "number_distance":
      payload = choice(
        { kind: "distance", a, b: total },
        `Từ ${a} đến ${total} có bao nhiêu bước?`,
        `Có ${b} đoạn giữa hai số. Số vạch đi qua không phải số bước.`,
      );
      hint = "Đếm các đoạn nối giữa hai vạch.";
      break;
    case "choose_equation":
    case "reverse_calculation": {
      const op: Operation = seed % 2 ? "+" : "-",
        left = op === "+" ? a : total,
        result = calculate(left, op, b);
      const options = [
        `${left} ${op} ${b}`,
        `${left} ${op} ${b + 1}`,
        `${left + 1} ${op} ${b}`,
      ];
      payload = choice(
        {
          kind: "arithmetic",
          a: left,
          b,
          op,
          ask: type === "choose_equation" ? "equation" : "reverse",
        },
        type === "choose_equation"
          ? `${left} khối ${op === "+" ? "thêm" : "bớt"} ${b} khối. Chọn phép tính phù hợp.`
          : `Phép tính nào tạo ra ${result}?`,
        `${left} ${op} ${b} = ${result}.`,
        options,
      );
      break;
    }
    case "operator_missing":
      payload = choice(
        { ...addRule, ask: "operator" },
        `${a} ? ${b} = ${total}. Dấu nào phù hợp?`,
        `${a} + ${b} = ${total}.`,
        difficulty < 4 ? ["+", "-"] : ["+", "-", "×", "÷"],
      );
      break;
    case "spot_math_error":
      payload = choice(
        { ...addRule, ask: "repair", claimed: total + 1 },
        `Robot viết ${a} + ${b} = ${total + 1}. Sửa kết quả giúp bạn nhé.`,
        `Đếm lại được ${total} khối: ${a} + ${b} = ${total}.`,
      );
      break;
    case "equation_balance": {
      const c = Math.max(1, b - 1);
      payload = choice(
        { kind: "balance", a, b, c },
        `${a} + ${b} = ? + ${c}. Điền cho hai bên bằng nhau.`,
        `Hai bên đều bằng ${total}: ${total - c} + ${c} = ${total}.`,
      );
      hint = "Tìm tổng bên trái trước, rồi tìm phần còn thiếu bên phải.";
      break;
    }
    case "calculation_chain": {
      const start = a,
        operations = [
          { op: "+" as const, value: b },
          { op: "+" as const, value: difficulty < 3 ? 1 : 2 },
        ];
      const result = start + b + operations[1].value;
      payload = choice(
        { kind: "chain", start, operations },
        "Đi qua từng cổng. Số ở cuối đường là gì?",
        `${start} → ${start + b} → ${result}. Tính theo thứ tự từng bước.`,
      );
      break;
    }
    case "estimation": {
      const left = pick(19, 11),
        right = pick(19, 11),
        near = Math.round((left + right) / 10) * 10;
      payload = choice(
        { kind: "estimate", a: left, b: right, roundTo: 10 },
        `${left} + ${right} gần số chục nào nhất?`,
        `Tổng là ${left + right}; số chục gần nhất là ${near}.`,
        [near, near + 20, Math.max(0, near - 20)],
      );
      hint = "So với những mốc chục, không cần đếm từng khối.";
      break;
    }
    case "tangram":
    case "shape_construction":
    case "symmetry_completion":
    case "copy_structure":
    case "length_measurement":
    case "height_measurement":
    case "fraction_composition": {
      const n =
        type === "fraction_composition"
          ? difficulty < 3
            ? 2
            : seed % 2
              ? 2
              : 4
          : type === "tangram"
            ? difficulty < 3
              ? 3
              : 7
            : ["length_measurement", "height_measurement"].includes(type)
              ? pick(Math.min(7, difficulty + 3), 2)
              : Math.min(6, difficulty + 2);
      const shapes: Shape[] =
        type === "tangram"
          ? [
              "triangle",
              "triangle",
              "square",
              "triangle",
              "parallelogram",
              "triangle",
              "triangle",
            ]
          : [];
      const mode: PlacementPayload["mode"] =
        type === "tangram"
          ? "tangram"
          : type === "symmetry_completion"
            ? "mirror"
            : type === "copy_structure"
              ? "copy"
              : type === "length_measurement"
                ? "length"
                : type === "height_measurement"
                  ? "height"
                  : type === "fraction_composition"
                    ? "fraction"
                    : "construction";
      let slots: Slot[] = Array.from({ length: n }, (_, i) => ({
        id: `slot-${i}`,
        x:
          mode === "height"
            ? 50
            : mode === "length"
              ? 12 + i * 13
              : mode === "mirror"
                ? i % 2
                  ? 70
                  : 80
                : mode === "fraction"
                  ? 35 + (i % 2) * 30
                  : 16 + (i % 4) * 22,
        y:
          mode === "height"
            ? 86 - i * 12
            : mode === "length"
              ? 65
              : mode === "mirror"
                ? 20 + i * 12
                : mode === "fraction"
                  ? 35 + Math.floor(i / 2) * 30
                  : 25 + Math.floor(i / 4) * 32,
        shape:
          mode === "fraction"
            ? n === 2
              ? ("half" as const)
              : ("quarter" as const)
            : (shapes[i] ??
              (mode === "copy" || mode === "mirror"
                ? (["circle", "square", "triangle"] as const)[pick(2, 0)]
                : ("square" as const))),
        rotation:
          mode === "fraction"
            ? n === 2
              ? (i * 180 + (seed % 4) * 90) % 360
              : (i * 90 + (seed % 4) * 90) % 360
            : type === "tangram"
              ? (i % 2) * 90
              : 0,
        ...(mode === "copy" || mode === "mirror"
          ? { color: colors[pick(colors.length - 1, 0)] }
          : {}),
      }));
      if (type === "shape_construction") {
        const templates: [Shape, number, number, number, number][][] = [
          [
            ["triangle", 50, 23, 50, 30],
            ["square", 36, 55, 26, 26],
            ["square", 64, 55, 26, 26],
            ["rectangle", 50, 80, 26, 18],
          ],
          [
            ["triangle", 50, 18, 35, 25],
            ["rectangle", 50, 50, 32, 48],
            ["triangle", 25, 72, 25, 30],
            ["triangle", 75, 72, 25, 30],
          ],
          [
            ["square", 50, 25, 30, 30],
            ["rectangle", 50, 58, 45, 26],
            ["square", 20, 58, 15, 15],
            ["square", 80, 58, 15, 15],
            ["rectangle", 38, 83, 17, 24],
            ["rectangle", 62, 83, 17, 24],
          ],
        ];
        slots = templates[seed % templates.length].map(
          ([shape, x, y, width, height], i) => ({
            id: `slot-${i}`,
            shape,
            x,
            y,
            width,
            height,
            rotation: 0,
          }),
        );
      }
      if (type === "tangram") slots = tangramSlots(seed);
      if (mode === "fraction") slots = cakeSlots(n as 2 | 4, seed);
      payload = {
        kind: "placement",
        mode,
        slots,
        pieces: slots.map((s, i) => ({
          id: `piece-${i}`,
          shape: s.shape,
          color: s.color ?? colors[i % colors.length],
          rotation:
            type === "tangram"
              ? initialTangramRotation(i, difficulty)
              : mode === "fraction"
                ? 0
                : s.rotation,
          ...(s.polygon
            ? { polygon: s.polygon, width: s.width, height: s.height }
            : {}),
        })),
        ...(mode === "mirror"
          ? {
              fixed: slots.map((s) => ({
                ...s,
                id: `fixed-${s.id}`,
                x: 100 - s.x,
              })),
            }
          : {}),
        tolerance: 3,
      };
      instruction =
        mode === "mirror"
          ? "Đặt các mảnh phản chiếu qua đường giữa."
          : mode === "length"
            ? `Đo bằng ${n} khối sát nhau từ vạch đầu.`
            : mode === "height"
              ? `Xếp ${n} khối từ mặt đất để đo chiều cao.`
              : mode === "fraction"
                ? `Ghép ${n} phần bằng nhau thành một chiếc bánh.`
                : "Chọn mảnh rồi chạm bóng hình. Xoay nếu cần nhé.";
      explanation =
        mode === "length" || mode === "height"
          ? `Có ${n} đơn vị bằng nhau, sát nhau, không hở hoặc chồng.`
          : mode === "mirror"
            ? "Hai bên có vị trí phản chiếu và màu tương ứng."
            : mode === "fraction"
              ? "Các phần bằng nhau ghép đủ một toàn thể."
              : "Các mảnh đã khớp hình, vị trí và hướng. Bé ghép được rồi!";
      hint = "Chọn một mảnh, nhìn hình mẫu rồi chọn vị trí tương ứng.";
      break;
    }
    case "solid_shapes": {
      const solids: Solid[] = ["sphere", "cube", "cuboid", "cylinder", "cone"];
      const solid = solids[pick(4, 0)];
      payload = choice(
        { kind: "solid", solid },
        "Khối đang được vẽ tên là gì?",
        `Đây là ${solidNames[solid].toLowerCase()}.`,
        solids.map((s) => solidNames[s]),
      );
      hint = "Quan sát mặt cong, mặt phẳng và đỉnh của khối.";
      break;
    }
    case "math_maze":
    case "spatial_navigation":
    case "shortest_path": {
      const cols = difficulty < 3 ? 3 : 4,
        rows = cols,
        start = 0,
        goal = cols * rows - 1;
      const route = [
        ...Array.from({ length: cols }, (_, i) => i),
        ...Array.from({ length: rows - 1 }, (_, i) => (i + 2) * cols - 1),
      ];
      const obstacles = Array.from({ length: cols * rows }, (_, i) => i).filter(
        (i) => !route.includes(i) && i % 3 === seed % 3,
      );
      payload = {
        kind: "path",
        cols,
        rows,
        start,
        goal,
        obstacles,
        shortest: type === "shortest_path",
        ...(type === "math_maze"
          ? {
              allowed: route,
              cellValues: Array.from({ length: cols * rows }, (_, i) =>
                route.includes(i) ? 5 : 3 + (i % 2),
              ),
              cellExpressions: Array.from({ length: cols * rows }, (_, i) =>
                route.includes(i)
                  ? ["1+4", "2+3", "3+2"][i % 3]
                  : i % 2
                    ? "2+2"
                    : "1+2",
              ),
              target: 5,
            }
          : {}),
      };
      instruction =
        type === "math_maze"
          ? "Đi qua các phép tính có kết quả 5 để đến ngôi sao."
          : type === "shortest_path"
            ? "Tìm đường tới ngôi sao với ít bước nhất."
            : "Chạm ô bên cạnh hoặc dùng mũi tên để tới ngôi sao.";
      explanation = `Bé đã đi từng ô liền cạnh, tránh vật cản${type === "shortest_path" ? " và dùng ít bước nhất" : ""}.`;
      hint = "Mỗi lần chỉ đi lên, xuống, trái hoặc phải một ô.";
      break;
    }
    case "weight_comparison":
    case "capacity_measurement": {
      const quantities = [a, b === a ? b + 1 : b];
      payload = choice(
        {
          kind: "measure",
          axis: type === "weight_comparison" ? "weight" : "capacity",
          quantities,
          ask: seed % 2 ? "max" : "min",
        },
        `Vật nào ${type === "weight_comparison" ? (seed % 2 ? "nặng" : "nhẹ") : seed % 2 ? "chứa nhiều" : "chứa ít"} hơn?`,
        `So sánh ${quantities[0]} và ${quantities[1]} đơn vị; kích thước hình vẽ không quyết định đáp án.`,
        ["Vật 1", "Vật 2"],
      );
      hint =
        type === "weight_comparison"
          ? "So sánh số đơn vị cân ghi dưới mỗi vật. Số lớn hơn là nặng hơn."
          : "Hai cốc giống nhau. Mực nước cao hơn là chứa nhiều hơn.";
      break;
    }
    case "money_recognition":
    case "shopping_math": {
      const budget = total + 2,
        price = b;
      payload = choice(
        {
          kind: "money",
          budget,
          price,
          ask: type === "shopping_math" ? "change" : "value",
        },
        type === "shopping_math"
          ? `Có ${budget} xu đồ chơi, mua món ${price} xu. Còn mấy xu?`
          : "Tấm thẻ xu đồ chơi đang ghi giá trị bao nhiêu?",
        type === "shopping_math"
          ? `${budget} − ${price} = ${budget - price} xu còn lại.`
          : `Tấm thẻ có giá trị ${budget} xu đồ chơi.`,
      );
      break;
    }
    case "calendar_days": {
      const day = pick(6, 0),
        offset = seed % 2 ? 1 : -1;
      payload = choice(
        { kind: "calendar", day, offset },
        `Hôm nay ${days[day]}. ${offset > 0 ? "Ngày mai" : "Hôm qua"} là thứ mấy?`,
        `Đi ${offset > 0 ? "tiếp" : "lùi"} một ngày: ${days[(((day + offset) % 7) + 7) % 7]}.`,
        days,
      );
      break;
    }
    case "odd_one_out": {
      const shapes: Shape[] = ["circle", "square"];
      const different = pick(3, 0);
      const items = Array.from({ length: 4 }, (_, i) => ({
        shape: i === different ? shapes[1] : shapes[0],
        color: "#8b9be5",
        size: 1,
      }));
      payload = choice(
        { kind: "odd", items, attribute: "shape" },
        "Xét hình dạng: vật nào không cùng nhóm?",
        `Vật ${different + 1} là hình vuông; các vật còn lại là hình tròn.`,
        items.map((_, i) => `Vật ${i + 1}`),
      );
      break;
    }
    case "clue_deduction":
    case "multi_condition_logic": {
      const min = pick(difficulty < 3 ? 2 : 5, 0);
      const max = min + (difficulty < 3 ? 4 : 6),
        parity =
          type === "multi_condition_logic"
            ? seed % 2
              ? ("even" as const)
              : ("odd" as const)
            : undefined;
      const candidates = Array.from({ length: max + 1 }, (_, i) => i);
      payload = choice(
        { kind: "constraints", candidates, min, max, parity, all: true },
        `Chọn TẤT CẢ số lớn hơn ${min}, nhỏ hơn ${max}${parity ? (parity === "even" ? " và chẵn" : " và lẻ") : ""}.`,
        `Các số được chọn phải thỏa mọi điều kiện cùng lúc.`,
        candidates,
        true,
      );
      hint = "Xét lần lượt từng điều kiện, loại những số không phù hợp.";
      break;
    }
    case "character_claims": {
      const firstCorrect = seed % 2 === 0;
      const claims = [
        {
          id: "Bạn Mầm",
          a: firstCorrect ? total : a,
          b: firstCorrect ? a : total,
          relation: ">" as const,
        },
        {
          id: "Bạn Mây",
          a: firstCorrect ? a : total,
          b: firstCorrect ? total : a,
          relation: ">" as const,
        },
      ];
      payload = choice(
        { kind: "claims", claims },
        "Quan sát hai nhận định. Bạn nào nói đúng?",
        `${total} lớn hơn ${a}, nên ${firstCorrect ? "bạn Mầm" : "bạn Mây"} nói đúng.`,
        claims.map((c) => c.id),
      );
      break;
    }
    case "conditional_sorting":
    case "number_train": {
      const length = Math.min(5, 3 + difficulty),
        start = pick(Math.max(0, limit - length), 0);
      const values = shuffle(
        Array.from({ length }, (_, i) => start + i),
        random,
      );
      payload = { kind: "order", values, direction: seed % 2 ? "asc" : "desc" };
      instruction = `Xếp ${type === "number_train" ? "các toa" : "các tháp"} từ ${seed % 2 ? "bé đến lớn" : "lớn đến bé"}.`;
      explanation = "Mỗi vị trí đều theo đúng thứ tự đã yêu cầu.";
      hint = "Tìm số nhỏ nhất hoặc lớn nhất trước, rồi đến số kế tiếp.";
      break;
    }
    case "number_code": {
      const codes = [
        { symbol: "★", value: a },
        { symbol: "●", value: b },
      ];
      payload = choice(
        { kind: "code", codes, symbols: ["★", "●"], op: "+" },
        "Dùng bảng mã: ★ + ● bằng mấy?",
        `Thay biểu tượng bằng số: ${a} + ${b} = ${total}.`,
      );
      hint = "Đọc số của từng biểu tượng trong bảng mã.";
      break;
    }
    case "hidden_pattern": {
      const op: "+" | "-" = "+";
      const rows: [number, number, number][] = [
        [1, 2, 3],
        [2, 3, 5],
      ];
      payload = choice(
        { kind: "hidden", rows, a, b, op },
        "Mỗi hàng có cùng quy luật. Điền ô cuối.",
        `Cộng hai ô đầu được ô cuối: ${a} + ${b} = ${total}.`,
      );
      hint = "Thử cộng hai số đầu ở từng hàng mẫu.";
      break;
    }
    case "fraction_partition": {
      const denominator = difficulty < 3 ? 2 : seed % 2 ? 2 : 4,
        numerator = pick(denominator - 1);
      payload = { kind: "fraction", denominator, numerator };
      instruction = `Chia bánh thành ${denominator} phần bằng nhau rồi tô ${numerator} phần.`;
      explanation = `${numerator} phần trong ${denominator} phần bằng nhau: ${numerator}/${denominator}.`;
      hint = "Đổi số phần bằng nhau trước, rồi chạm phần muốn tô.";
      break;
    }
    case "fraction_compare": {
      const fractionPairs: [[number, number], [number, number]][] = [
        [
          [1, 2],
          [1, 4],
        ],
        [
          [1, 4],
          [1, 2],
        ],
        [
          [2, 4],
          [1, 2],
        ],
        [
          [3, 4],
          [1, 2],
        ],
        [
          [1, 4],
          [3, 4],
        ],
        [
          [2, 4],
          [3, 4],
        ],
      ];
      const [left, right] = fractionPairs[pick(fractionPairs.length - 1, 0)];
      payload = choice(
        { kind: "fraction_compare", left, right },
        "Hai bánh bằng nhau. Chọn dấu so sánh phần tô.",
        `So sánh phần tô trên hai chiếc bánh có cùng kích thước.`,
        [">", "<", "="],
      );
      break;
    }
    case "build_chart":
    case "character_survey":
    case "math_kitchen":
    case "animal_habitat_builder": {
      const labels =
        type === "math_kitchen"
          ? ["Trứng", "Táo", "Sữa"]
          : type === "animal_habitat_builder"
            ? ["Cá", "Thỏ", "Chim"]
            : type === "character_survey"
              ? ["Thích hoa", "Thích sao", "Thích lá"]
              : ["Táo", "Cam", "Chuối"];
      const targets = [pick(3), pick(3), pick(3)];
      payload = {
        kind: "distribution",
        mode:
          type === "math_kitchen"
            ? "recipe"
            : type === "animal_habitat_builder"
              ? "habitat"
              : type === "character_survey"
                ? "survey"
                : "chart",
        labels,
        targets,
        total: targets.reduce((s, n) => s + n, 0),
      };
      if (type === "animal_habitat_builder" && payload.kind === "distribution")
        payload.items = shuffle(
          targets.flatMap((count, category) =>
            Array.from({ length: count }, (_, i) => ({
              id: `animal-${category}-${i}`,
              category,
              animal: (["fish", "rabbit", "bird"] as const)[category],
            })),
          ),
          random,
        );
      instruction =
        type === "math_kitchen"
          ? "Lấy đúng từng nguyên liệu theo công thức."
          : type === "animal_habitat_builder"
            ? "Đưa đủ từng loài về khu của mình."
            : type === "character_survey"
              ? "Mỗi thẻ là một câu trả lời. Lập bảng sở thích nhé."
              : "Đếm từng loại đồ vật rồi dựng đúng các cột.";
      explanation = "Mỗi nhóm đã có đúng số lượng ghi trong dữ liệu nguồn.";
      hint =
        "Xem một nhóm trong mẫu, thêm đúng từng vật rồi chuyển sang nhóm khác.";
      break;
    }
    case "read_chart":
    case "data_extremes":
    case "data_prediction": {
      const bars = [
        { label: "Táo", value: a },
        { label: "Cam", value: b === a ? b + 1 : b },
        { label: "Chuối", value: total },
      ];
      const ask =
        type === "data_prediction"
          ? "predict"
          : type === "data_extremes" && seed % 2
            ? "min"
            : difficulty > 3 && type === "read_chart"
              ? "difference"
              : "max";
      const rule: Rule = {
        kind: "chart",
        bars,
        ask,
        ...(ask === "predict" ? { additional: [2, 0, 0] } : {}),
        ...(ask === "difference"
          ? { difference: [0, 2] as [number, number] }
          : {}),
      };
      const correct = solutions(rule, []);
      payload = choice(
        rule,
        ask === "predict"
          ? "Thêm số đã ghi. Chọn TẤT CẢ loại nhiều nhất."
          : ask === "difference"
            ? "Chuối nhiều hơn táo bao nhiêu?"
            : `Chọn TẤT CẢ loại có số lượng ${ask === "min" ? "ít" : "nhiều"} nhất.`,
        ask === "predict"
          ? "Cộng số bổ sung vào từng cột trước khi so sánh."
          : "Đọc các vạch trên biểu đồ để so sánh số lượng.",
        ask === "difference" ? undefined : bars.map((b) => b.label),
        ask !== "difference" && correct.length > 1,
      );
      break;
    }
    case "answer_platform_jump":
    case "treasure_hunt":
    case "rocket_launch_math": {
      const rounds = Array.from({ length: difficulty < 3 ? 2 : 3 }, (_, i) => ({
        a: a + i,
        b,
        op: "+" as const,
      }));
      payload = {
        kind: "mission",
        mode:
          type === "answer_platform_jump"
            ? "platform"
            : type === "treasure_hunt"
              ? "treasure"
              : "rocket",
        rounds,
      };
      instruction =
        type === "treasure_hunt"
          ? "Giải từng câu để lấy đủ chìa khóa mở rương."
          : type === "rocket_launch_math"
            ? "Giải từng phép tính để nạp năng lượng tên lửa."
            : "Chọn nền tảng có kết quả đúng để bạn nhảy tới.";
      explanation = "Bé đã vượt qua từng chặng bằng cách kiểm tra phép tính.";
      hint = "Đếm hai nhóm của chặng đang chơi, rồi chọn kết quả.";
      break;
    }
    default:
      throw new Error(`Missing generator: ${type satisfies never}`);
  }
  return {
    id,
    type,
    difficulty,
    instruction,
    hints: [
      hint,
      definitionByType[type].objective,
      "Bé có thể xem mẫu một bước rồi tự thử tiếp.",
    ],
    explanation,
    payload,
  };
}

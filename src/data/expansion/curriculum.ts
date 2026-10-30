import type {
  Difficulty,
  ExerciseQuestion,
  ExerciseType,
} from "../../features/exercises/types";
import {
  definitions,
  definitionByType,
} from "../../features/exercises/catalog";
import {
  generateQuestion,
  shuffle,
  seeded,
} from "../../features/exercises/generator";
export interface World {
  id: string;
  title: string;
  description: string;
  color: string;
  order: number;
  lessonIds: string[];
}
export interface CurriculumLesson {
  id: string;
  worldId: string;
  title: string;
  description: string;
  learningObjectives: string[];
  difficulty: Difficulty;
  estimatedMinutes: number;
  questionIds: string[];
  prerequisites: string[];
}
interface Blueprint {
  title: string;
  types: number[];
  variant?: "scene" | "visual_compare" | "color" | "shape" | "shape_sorting";
}
const worldsData = [
  [
    "Khu vườn những con số",
    "Gặp bạn mới, đếm và khám phá các số 0–10.",
    "#e8f1df",
  ],
  [
    "Thành phố phép cộng",
    "Gộp, tách, tìm phần còn thiếu và thử máy số.",
    "#fff0d5",
  ],
  [
    "Vương quốc so sánh",
    "So sánh lượng, khoảng cách và những chiếc cân.",
    "#e5eff7",
  ],
  [
    "Đảo hình học",
    "Ghép hình, đối xứng, xây dựng và đi đúng hướng.",
    "#eee7f7",
  ],
  ["Rừng quy luật", "Quan sát mẫu, giải mã và suy luận từng bước.", "#e1f0e9"],
  [
    "Thành phố cuộc sống",
    "Đo, mua sắm bằng xu đồ chơi, xem lịch và giờ.",
    "#f9e8de",
  ],
  [
    "Vùng đất phép nhân",
    "Nhóm bằng nhau, chia đều và các phần của chiếc bánh.",
    "#f4edcf",
  ],
  [
    "Vũ trụ trí tuệ",
    "Kết hợp kiến thức để khám phá những nhiệm vụ mới.",
    "#e8e7f5",
  ],
];
const bp = (
  title: string,
  types: number[],
  variant?: Blueprint["variant"],
): Blueprint => ({ title, types, variant });
const blueprints: Blueprint[][] = [
  [
    bp("Làm quen với bạn số", [1, 2]),
    bp("Đếm hoa trong vườn", [1], "scene"),
    bp("Tìm đúng thẻ số", [2]),
    bp("Khu vườn có bao nhiêu?", [1, 2], "scene"),
    bp("Điền bảng mười ô", [16]),
    bp("Số nào đứng cạnh?", [19]),
    bp("Xếp đoàn tàu số", [63]),
    bp("Số nào gần hơn?", [18]),
    bp("Nhìn nhanh đoán số", [9]),
    bp("Ngày hội số đầu tiên", [1, 2, 16, 19, 9]),
  ],
  [
    bp("Những khối kết bạn", [3]),
    bp("Tách nhóm đồ chơi", [4]),
    bp("Bí mật tạo thành số", [17]),
    bp("Cây cầu còn thiếu", [14]),
    bp("Ô số bí ẩn", [6]),
    bp("Chọn phép tính đúng", [21]),
    bp("Dấu phép tính biến mất", [22]),
    bp("Máy biến đổi số", [28]),
    bp("Lỗi của bạn robot", [23]),
    bp("Lễ hội phép cộng", [25, 3, 4, 6]),
  ],
  [
    bp("Bập bênh vui nhộn", [5]),
    bp("Bên nào nhiều hơn?", [5], "visual_compare"),
    bp("Cân hai chiếc giỏ", [39]),
    bp("Cân bằng phép tính", [24]),
    bp("Tìm số gần đích", [18]),
    bp("Bao nhiêu bước ở giữa?", [20]),
    bp("Sắp xếp bé đến lớn", [48]),
    bp("Chẵn hay lẻ?", [10]),
    bp("Ai nói đúng?", [47]),
    bp("Nhà vô địch cân bằng", [5, 20, 24, 47]),
  ],
  [
    bp("Săn hình quanh đảo", [13]),
    bp("Xây công trình hình học", [32]),
    bp("Ghép tranh Tangram", [31]),
    bp("Tìm nửa còn thiếu", [33]),
    bp("Khám phá khối 3D", [34]),
    bp("Đi đúng hướng", [35]),
    bp("Sao chép tòa tháp", [36]),
    bp("Phân loại hình", [48], "shape_sorting"),
    bp("Tìm vật khác biệt", [45]),
    bp("Kiến trúc sư nhí", [32, 33, 36]),
  ],
  [
    bp("Dãy số tiếp theo", [7]),
    bp("Quy luật màu sắc", [7], "color"),
    bp("Quy luật hình dạng", [7], "shape"),
    bp("Tìm quy luật ẩn", [51]),
    bp("Giải mã biểu tượng", [50]),
    bp("Những gợi ý bí mật", [46]),
    bp("Chọn đường ngắn nhất", [49]),
    bp("Mê cung phép tính", [30]),
    bp("Hai điều kiện cùng lúc", [52]),
    bp("Thám tử quy luật", [7, 46, 50, 51, 52]),
  ],
  [
    bp("Đo cây bút", [37]),
    bp("Tòa tháp cao bao nhiêu?", [38]),
    bp("Cốc nào chứa nhiều hơn?", [40]),
    bp("Cửa hàng đồ chơi", [41]),
    bp("Đi chợ cùng bạn", [42]),
    bp("Đồng hồ mấy giờ?", [15]),
    bp("Hôm qua và ngày mai", [43]),
    bp("Đồng hồ vui vẻ", [44]),
    bp("Lập biểu đồ trái cây", [57]),
    bp("Đọc biểu đồ thành phố", [58]),
  ],
  [
    bp("Những nhóm bằng nhau", [11]),
    bp("Mảng khối kỳ diệu", [55]),
    bp("Chia bánh cho bạn", [12]),
    bp("Chia bánh làm đôi", [53]),
    bp("Ghép bánh hoàn chỉnh", [54]),
    bp("Phần nào lớn hơn?", [56]),
    bp("Chuỗi phép tính", [27]),
    bp("Tìm phép tính ngược", [26]),
    bp("Nhiều cách tạo số", [25]),
    bp("Ngày hội chia sẻ", [11, 12, 53, 56]),
  ],
  [
    bp("Săn kho báu số", [64]),
    bp("Nhà bếp toán học", [65]),
    bp("Xây khu vườn động vật", [66]),
    bp("Phóng tên lửa", [67]),
    bp("Khảo sát sở thích", [59]),
    bp("Ai nhiều nhất?", [60]),
    bp("Dự đoán từ biểu đồ", [61]),
    bp("Thử thách nhiều điều kiện", [52]),
    bp("Hành trình tối ưu", [49]),
    bp("Nhà thám hiểm toán học", [62, 29, 8, 64, 67]),
  ],
];
export const worlds: World[] = worldsData.map(
  ([title, description, color], i) => ({
    id: `W${i + 1}`,
    title,
    description,
    color,
    order: i + 1,
    lessonIds: blueprints[i].map(
      (_, j) => `W${i + 1}-L${String(j + 1).padStart(2, "0")}`,
    ),
  }),
);
export const curriculumLessons: CurriculumLesson[] = [];
export const curriculumQuestions: ExerciseQuestion[] = [];
for (let worldIndex = 0; worldIndex < worlds.length; worldIndex++) {
  const world = worlds[worldIndex];
  for (
    let lessonIndex = 0;
    lessonIndex < blueprints[worldIndex].length;
    lessonIndex++
  ) {
    const blueprint = blueprints[worldIndex][lessonIndex],
      id = world.lessonIds[lessonIndex];
    const base = (
      worldIndex === 0 ? 1 : worldIndex < 3 ? 2 : worldIndex < 6 ? 3 : 4
    ) as Difficulty;
    const types = blueprint.types.map((n) => definitions[n - 1].type);
    const questions = Array.from({ length: 10 }, (_, i) => {
      const difficulty = Math.min(5, base + (i >= 7 ? 1 : 0)) as Difficulty;
      const q = generateQuestion(
        types[i % types.length],
        difficulty,
        worldIndex * 10000 + lessonIndex * 100 + i + 1,
        `${id}-Q${String(i + 1).padStart(2, "0")}`,
      );
      if (
        (blueprint.variant === "color" || blueprint.variant === "shape") &&
        q.payload.kind === "choice"
      ) {
        const symbols =
          blueprint.variant === "color"
            ? ["Đỏ", "Vàng", "Xanh"]
            : ["●", "■", "▲"];
        const repeat = [symbols[i % 3], symbols[(i + 1) % 3]];
        const length = i % 2 ? 4 : 3;
        q.payload = {
          kind: "choice",
          rule: {
            kind: "pattern",
            sequence: Array.from({ length }, (_, index) => repeat[index % 2]),
            repeat,
          },
          options: symbols,
        };
        q.instruction =
          blueprint.variant === "color"
            ? "Màu và ký hiệu lặp lại. Chọn thẻ tiếp theo."
            : "Hình nào tiếp theo trong mẫu lặp?";
        q.explanation =
          "Mẫu gồm hai thẻ luân phiên. Lặp lại cặp thẻ đầu để tìm thẻ kế tiếp.";
        q.hints = [
          "Nhìn hai thẻ đầu, rồi tìm nhóm lặp lại.",
          "Ký hiệu cũng giúp phân biệt, không cần chỉ nhìn màu.",
          "Thử đọc mẫu theo từng cặp.",
        ];
      }
      if (blueprint.variant === "scene" && q.payload.kind === "count") {
        q.payload.object = "flower";
        q.instruction = "Chạm từng bông hoa trong vườn, mỗi bông một lần.";
        q.hints[0] = "Bông đã chạm có dấu tích. Tìm những bông còn lại.";
      }
      if (
        blueprint.variant === "visual_compare" &&
        q.payload.kind === "choice" &&
        q.payload.rule.kind === "relation"
      ) {
        const r = q.payload.rule;
        q.payload = {
          kind: "choice",
          rule: { kind: "quantity_compare", a: r.a, b: r.b },
          options: ["Bên trái", "Bên phải", "Bằng nhau"],
        };
        q.instruction = "Chọn bên nhiều khối hơn, hoặc chọn Bằng nhau.";
        q.explanation =
          "Đếm từng nhóm để kiểm tra, không cần nhớ ký hiệu so sánh.";
      }
      if (blueprint.variant === "shape_sorting") {
        q.type = "conditional_sorting";
        q.payload = {
          kind: "order",
          values: shuffle(
            [0, 3, 4],
            seeded(worldIndex * 10000 + lessonIndex * 100 + i + 1),
          ),
          direction: i % 2 ? "desc" : "asc",
          display: "shapes",
        };
        q.instruction = `Xếp hình từ ${i % 2 ? "nhiều đến ít" : "ít đến nhiều"} cạnh.`;
        q.explanation =
          "Hình tròn không có cạnh thẳng, tam giác có 3, hình vuông có 4.";
        q.hints = [
          "Đi quanh viền và đếm các cạnh thẳng.",
          "Dùng số cạnh để xác định hình đứng trước.",
          "Chọn từng hình theo thứ tự đã hỏi.",
        ];
      }
      curriculumQuestions.push(q);
      return q;
    });
    curriculumLessons.push({
      id,
      worldId: world.id,
      title: blueprint.title,
      description: definitionByType[types[0]].objective,
      learningObjectives: types.map((t) => definitionByType[t].objective),
      difficulty: base,
      estimatedMinutes: 4,
      questionIds: questions.map((q) => q.id),
      prerequisites: lessonIndex ? [world.lessonIds[lessonIndex - 1]] : [],
    });
  }
}
export const questionById = Object.fromEntries(
  curriculumQuestions.map((q) => [q.id, q]),
);
export const lessonById = Object.fromEntries(
  curriculumLessons.map((l) => [l.id, l]),
);
export const aliasTypes: Record<string, ExerciseType> = {
  scene_object_counting: "tap_counting",
  visual_quantity_compare: "seesaw_compare",
  color_pattern: "number_pattern",
  shape_pattern: "number_pattern",
  shape_sorting: "conditional_sorting",
};
export { exerciseVoicePrompts } from "./voicePrompts";

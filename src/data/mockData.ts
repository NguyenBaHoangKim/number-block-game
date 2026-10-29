import type {
  Activity,
  CharacterIntroduction,
  Lesson,
  Question,
} from "../types/lesson";
export const appConfig = {
  name: "Đảo Khối Số",
  tagline: "Chơi vui, học giỏi",
  storageKey: "daoKhoiSo.progress.v1",
  maxStars: 3,
  defaultSettings: {
    effects: true,
    music: false,
    voice: true,
    background: false,
    volume: 0.4,
  },
};
export const numberCharacters = [
  { value: 1, name: "Mầm", color: "#ed9476", personality: "Nhỏ xíu mà tò mò!" },
  {
    value: 2,
    name: "Mây",
    color: "#8b9be5",
    personality: "Luôn có đôi, luôn vui!",
  },
  {
    value: 3,
    name: "Nắng",
    color: "#edbc55",
    personality: "Mang nắng đến mọi nơi.",
  },
  {
    value: 4,
    name: "Lá",
    color: "#78b794",
    personality: "Thích khám phá khu vườn.",
  },
  {
    value: 5,
    name: "Đào",
    color: "#db8caa",
    personality: "Một người bạn thích nhảy.",
  },
  {
    value: 6,
    name: "Biển",
    color: "#68b8c9",
    personality: "Êm đềm như sóng nhỏ.",
  },
  {
    value: 7,
    name: "Mơ",
    color: "#af91ce",
    personality: "Có rất nhiều ý tưởng!",
  },
  {
    value: 8,
    name: "Cam",
    color: "#dd9a58",
    personality: "Năng lượng tràn đầy.",
  },
  {
    value: 9,
    name: "Rêu",
    color: "#a7b663",
    personality: "Chậm rãi và chắc chắn.",
  },
  {
    value: 10,
    name: "Trời",
    color: "#779fd1",
    personality: "Cùng nhau vươn thật cao!",
  },
];
export const learningStages = [
  {
    id: "discover",
    title: "Khám phá các con số",
    subtitle: "Gặp gỡ những người bạn nhỏ, cùng đếm từ 1 đến 10.",
    color: "#eaf2e9",
    icon: "sprout",
    label: "KHỞI ĐẦU THẬT VUI",
  },
  {
    id: "combine",
    title: "Ghép và tách số",
    subtitle: "Khi các khối nhỏ kết bạn, điều kỳ diệu sẽ xảy ra!",
    color: "#fff1db",
    icon: "puzzle",
    label: "CÙNG NHAU KHÁM PHÁ",
  },
  {
    id: "calculate",
    title: "Cộng và trừ vui nhộn",
    subtitle: "Thêm một chút, bớt một chút. Bé làm được mà!",
    color: "#eeeafa",
    icon: "rocket",
    label: "NHÀ THÁM HIỂM NHÍ",
  },
];
learningStages.push(
  {
    id: "detective",
    title: "Thám tử quy luật",
    subtitle: "Đoán nhanh, ghép đôi và khám phá các số đến 20.",
    color: "#e4f1f5",
    icon: "search",
    label: "TƯ DUY VÀ GHI NHỚ",
  },
  {
    id: "create",
    title: "Xưởng sáng tạo toán học",
    subtitle: "Chia bánh, xây cầu, xếp nhóm và khám phá đồng hồ.",
    color: "#fce9e0",
    icon: "shapes",
    label: "BÉ THỬ SỨC · 6–8 TUỔI",
  },
);
interface Seed {
  title: string;
  description: string;
  activity: Activity;
  values: number[];
  prompt: string;
  options: (string | number)[];
  answer: string | number;
  explanation: string;
  hint: string;
  alternatives?: [number, number][];
  introduction?: CharacterIntroduction;
  practiceValues?: number[];
  characterLabels?: "number" | "name";
}
const seeds: Seed[] = [
  {
    title: "Xin chào các khối số",
    description: "Làm quen với Mầm, Mây và Nắng.",
    activity: "count",
    values: [1, 2, 3],
    practiceValues: [3],
    characterLabels: "name",
    introduction: {
      opening: "Trong khu vườn có ba người bạn nhỏ đang đợi bé…",
      invitation: "Gọi các bạn ra chơi!",
      closing:
        "Cả ba bạn đã đến rồi! Bây giờ, cùng đếm những khối nhỏ của Nắng nhé.",
      replayLabel: "Chào lại các bạn",
      cueDurationMs: 2200,
      cues: [
        {
          value: 1,
          greeting: "Chào bé! Tớ là Mầm. Nhỏ xíu mà thích khám phá lắm!",
        },
        {
          value: 2,
          greeting: "Xin chào! Tớ là Mây. Tớ thích nhảy cùng bạn bè!",
        },
        {
          value: 3,
          greeting: "Tớ là Nắng! Bé cùng đếm những khối nhỏ của tớ nhé!",
        },
      ],
    },
    prompt: "Bạn Nắng có bao nhiêu khối?",
    options: [1, 2, 3],
    answer: 3,
    explanation: "Một, hai, ba! Ba khối nhỏ tạo thành bạn Nắng.",
    hint: "Chạm từng ô của bạn Nắng để đếm đến 3.",
  },
  {
    title: "Khám phá số 4 và 5",
    description: "Gặp Lá và Đào trong khu vườn.",
    introduction: {
      opening:
        "Hôm nay có hai người bạn mới đến khu vườn. Bé cùng chào các bạn nhé!",
      invitation: "Gọi Lá và Đào ra chơi!",
      closing:
        "Lá và Đào rất vui được gặp bé! Cùng đếm từng khối của hai bạn nào.",
      replayLabel: "Chào lại Lá và Đào",
      cueDurationMs: 2400,
      cues: [
        {
          value: 4,
          greeting:
            "Chào bé! Tớ là Lá. Tớ thích chăm cây và khám phá khu vườn!",
        },
        {
          value: 5,
          greeting:
            "Xin chào! Tớ là Đào. Tớ thích nhảy múa. Mình cùng chơi nhé!",
        },
      ],
    },
    activity: "count",
    values: [4, 5],
    characterLabels: "name",
    prompt: "Nhân vật nào có năm khối?",
    options: ["Mây", "Lá", "Đào"],
    answer: "Đào",
    explanation: "Bạn Đào có đúng 5 khối đơn vị.",
    hint: "Đếm từng khối của bạn đứng bên phải nhé.",
  },
  {
    title: "Cùng đếm từ 1 đến 5",
    description: "Không bỏ sót người bạn nhỏ nào!",
    activity: "count",
    values: [5],
    prompt: "Bé đã đếm được bao nhiêu khối?",
    options: [4, 5, 6],
    answer: 5,
    explanation: "Năm lần chạm, năm khối khác nhau!",
    hint: "Ô đã đếm có dấu tích. Hãy chạm các ô còn lại.",
  },
  {
    title: "Khám phá số 6 đến 10",
    description: "Những người bạn lớn hơn xuất hiện.",
    introduction: {
      opening: "Năm người bạn mới đang đến thăm hòn đảo. Bé cùng làm quen nhé!",
      invitation: "Chào những người bạn mới!",
      closing:
        "Cả năm người bạn đã đến rồi! Cùng khám phá những nhóm khối lớn hơn nhé.",
      replayLabel: "Chào lại năm người bạn",
      cueDurationMs: 2400,
      cues: [
        {
          value: 6,
          greeting:
            "Chào bé! Tớ là Biển. Tớ mang những con sóng nhỏ đến chơi cùng bé!",
        },
        {
          value: 7,
          greeting: "Tớ là Mơ. Tớ có rất nhiều ý tưởng hay. Cùng khám phá nhé!",
        },
        {
          value: 8,
          greeting:
            "Xin chào, tớ là Cam! Tớ thích chạy nhảy và giúp đỡ bạn bè!",
        },
        {
          value: 9,
          greeting:
            "Tớ là Rêu. Mình cứ từ từ đếm từng khối, không cần vội nhé!",
        },
        {
          value: 10,
          greeting:
            "Chào bé, tớ là Trời! Cùng những người bạn nhỏ, mình làm được rất nhiều điều!",
        },
      ],
    },
    activity: "count",
    values: [6, 7, 8, 9, 10],
    prompt: "Bạn Trời có bao nhiêu khối?",
    options: [8, 9, 10],
    answer: 10,
    explanation: "Hai cột, mỗi cột năm khối: tất cả là 10.",
    hint: "Chạm từng ô, lần lượt từ dưới lên trên.",
  },
  {
    title: "Số và số lượng",
    description: "Bên nào có nhiều bạn hơn nhỉ?",
    activity: "compare",
    values: [3, 5],
    prompt: "Chọn dấu đúng: 3 … 5",
    options: [">", "<", "="],
    answer: "<",
    explanation: "3 ít hơn 5. Đĩa có 5 khối sẽ hạ xuống.",
    hint: "Đếm hai bên. Bên có 5 khối nhiều hơn bên có 3 khối.",
  },
  {
    title: "Số 5 được tạo thành",
    description: "Chia khối và khám phá chiếc cân.",
    activity: "compare",
    values: [2, 3],
    prompt: "Chọn dấu đúng: 2 … 3",
    options: [">", "<", "="],
    answer: "<",
    explanation: "2 + 3 vẫn là 5. Bên có 3 khối nặng hơn!",
    hint: "Thử chuyển khối qua lại. Mỗi khối nặng như nhau.",
  },
  {
    title: "Ghép 2 và 3",
    description: "Hai người bạn, một cuộc hội ngộ!",
    activity: "merge",
    values: [2, 3],
    prompt: "2 + 3 bằng bao nhiêu?",
    options: [4, 5, 6],
    answer: 5,
    explanation: "2 khối tím và 3 khối vàng ghép lại thành 5 khối!",
    hint: "Kéo nhóm tím sang nhóm vàng, hoặc bấm Ghép khối.",
  },
  {
    title: "Tách số 5",
    description: "Một nhóm lớn, hai nhóm nhỏ.",
    activity: "split",
    values: [5, 2],
    prompt: "5 tách ra 2, nhóm còn lại có mấy khối?",
    options: [2, 3, 4],
    answer: 3,
    explanation: "5 gồm 2 và 3. Hai nhóm vẫn có tổng cộng 5 khối.",
    hint: "Bấm Tách khối, rồi đếm nhóm ở bên trái.",
  },
  {
    title: "Tạo số 10",
    description: "Có bao nhiêu cách tạo thành mười?",
    activity: "merge",
    alternatives: [
      [5, 5],
      [6, 4],
      [7, 3],
    ],
    values: [5, 5],
    prompt: "5 + 5 bằng bao nhiêu?",
    options: [8, 9, 10],
    answer: 10,
    explanation:
      "Hai nhóm 5 ghép thành 10. Bé cũng có thể thử 6 + 4 hoặc 7 + 3!",
    hint: "Chọn một cách ghép, rồi chạm Ghép khối.",
  },
  {
    title: "Thêm một khối",
    description: "Một người bạn mới đến chơi.",
    activity: "numberline",
    values: [3, 1],
    prompt: "3 thêm 1 là bao nhiêu?",
    options: [2, 4, 5],
    answer: 4,
    explanation: "Từ số 3, bước thêm một bước đến số 4.",
    hint: "Bấm Tiến 1 bước và nhìn vị trí của Mầm.",
  },
  {
    title: "Cộng hai nhóm số",
    description: "Cùng nhau xây một đội thật lớn.",
    activity: "merge",
    alternatives: [
      [1, 5],
      [2, 4],
      [3, 3],
    ],
    values: [2, 4],
    prompt: "2 + 4 bằng bao nhiêu?",
    options: [5, 6, 7],
    answer: 6,
    explanation: "2 + 4 = 6. Thử thêm 1 + 5 và 3 + 3 nhé!",
    hint: "Hai nhóm có tổng cộng sáu ô nhỏ.",
  },
  {
    title: "Bớt đi một khối",
    description: "Một khối nhỏ đi dạo trong vườn.",
    activity: "split",
    values: [5, 1],
    prompt: "5 bớt 1 còn bao nhiêu?",
    options: [3, 4, 5],
    answer: 4,
    explanation: "Một khối đi dạo, bốn khối vẫn ở lại cùng bé.",
    hint: "Quan sát khối đi sang bên phải, đếm những khối còn lại.",
  },
  {
    title: "Tách một nhóm",
    description: "Tìm bạn cùng số và nối quy luật.",
    activity: "pattern",
    values: [1, 2, 3],
    prompt: "Số tiếp theo trong dãy 1, 2, 3 là gì?",
    options: [2, 4, 5],
    answer: 4,
    explanation: "Mỗi nhóm tăng thêm 1 khối, nên sau 3 là 4.",
    hint: "Nhóm sau nhiều hơn nhóm trước đúng một khối.",
  },
  {
    title: "Thử thách cộng trừ",
    description: "Bé đã sẵn sàng cho chuyến phiêu lưu!",
    activity: "missing",
    values: [3, 7],
    prompt: "3 + ? = 7. Số nào còn thiếu?",
    options: [3, 4, 5],
    answer: 4,
    explanation: "3 khối có sẵn, thêm 4 khối nữa sẽ có đủ 7!",
    hint: "Chọn một nhóm rồi đặt vào ô trống. Đếm để đủ bảy khối.",
  },
];
const coreLessons: Lesson[] = seeds.map((s, i) => {
  const question: Question = {
    prompt: s.prompt,
    options: s.options,
    answer: s.answer,
    explanation: s.explanation,
  };
  return {
    id: `lesson-${i + 1}`,
    stageId: i < 5 ? "discover" : i < 9 ? "combine" : "calculate",
    title: s.title,
    description: s.description,
    minutes: i < 5 ? 3 : 5,
    difficulty: i < 5 ? 1 : 2,
    learningObjective: s.explanation,
    steps: [
      {
        id: `l${i + 1}-intro`,
        type: "explain",
        title: s.title,
        instruction: s.description,
        activity: s.introduction ? "meet" : s.activity,
        values: s.values,
        introduction: s.introduction,
        hint: s.hint,
        alternatives: s.alternatives,
      },
      {
        id: `l${i + 1}-play`,
        type: "interact",
        title: "Đến lượt bé khám phá!",
        instruction: s.hint,
        activity: s.activity,
        values: s.practiceValues ?? s.values,
        characterLabels: s.characterLabels,
        hint: s.hint,
        alternatives: s.alternatives,
      },
      ...(i === 4
        ? [
            {
              id: "l5-match",
              type: "interact" as const,
              title: "Tìm đúng người bạn!",
              instruction: "Kéo nhóm có 5 khối vào ô số 5, hoặc chạm để chọn.",
              activity: "match" as const,
              values: [3, 4, 5],
              hint: "Đếm từng nhóm rồi tìm nhóm có đúng 5 khối.",
            },
          ]
        : []),
      ...(i === 5
        ? [
            {
              id: "l6-count",
              type: "interact" as const,
              title: "Năm khối, một gia đình",
              instruction:
                "Chạm đủ năm khối trước khi chia thành hai nhóm nhé.",
              activity: "count" as const,
              values: [5],
              hint: "Mỗi lần chạm một khối mới, bé sẽ thấy một dấu tích.",
            },
          ]
        : []),
      ...(i === 12
        ? [
            {
              id: "l13-split",
              type: "interact" as const,
              title: "Tách nhóm tìm bạn",
              instruction: "Tách 6 khối thành hai nhóm 3 khối.",
              activity: "split" as const,
              values: [6, 3],
              hint: "Bấm Tách khối hoặc kéo nhóm ra hai bên.",
            },
            {
              id: "l13-balance",
              type: "interact" as const,
              title: "Hai nhóm bằng nhau",
              instruction: "Chuyển khối để thử rồi đưa về 3 và 3 nhé!",
              activity: "compare" as const,
              values: [3, 3],
              hint: "Hai bên cùng có ba khối nên chiếc cân nằm ngang.",
            },
          ]
        : []),
      {
        id: `l${i + 1}-quiz`,
        type: "quiz",
        title: "Thử tài một chút nhé!",
        instruction: s.prompt,
        activity: s.activity,
        values: s.practiceValues ?? s.values,
        characterLabels: s.characterLabels,
        question,
        hint: s.hint,
      },
      ...(i === 10
        ? [
            {
              id: "l11-quiz2",
              type: "quiz" as const,
              title: "Cuộc hội ngộ nhỏ",
              instruction: "1 + 2 bằng bao nhiêu?",
              activity: "merge" as const,
              values: [1, 2],
              hint: "Đếm một khối và hai khối bạn mới.",
              question: {
                prompt: "1 + 2 bằng bao nhiêu?",
                options: [2, 3, 4],
                answer: 3,
                explanation: "Một khối và hai khối ghép thành ba!",
              },
            },
            {
              id: "l11-quiz3",
              type: "quiz" as const,
              title: "Thêm những người bạn",
              instruction: "3 + 5 bằng bao nhiêu?",
              activity: "merge" as const,
              values: [3, 5],
              hint: "Ba và năm khối có tổng cộng tám khối.",
              question: {
                prompt: "3 + 5 bằng bao nhiêu?",
                options: [6, 7, 8],
                answer: 8,
                explanation: "3 + 5 = 8. Nhóm của bé đang lớn lên!",
              },
            },
            {
              id: "l11-quiz4",
              type: "quiz" as const,
              title: "Đủ mười bạn rồi!",
              instruction: "6 + 4 bằng bao nhiêu?",
              activity: "merge" as const,
              values: [6, 4],
              hint: "Sáu khối thêm bốn khối sẽ đủ mười.",
              question: {
                prompt: "6 + 4 bằng bao nhiêu?",
                options: [8, 9, 10],
                answer: 10,
                explanation: "6 + 4 = 10. Bé đã ghép đủ mười người bạn!",
              },
            },
          ]
        : []),
      ...(i === 13
        ? [
            {
              id: "l14-quiz2",
              type: "quiz" as const,
              title: "Một thử thách nữa!",
              instruction: "8 bớt 3 còn bao nhiêu?",
              activity: "split" as const,
              values: [8, 3],
              hint: "Tách ba khối ra khỏi tám khối rồi đếm phần còn lại.",
              question: {
                prompt: "8 − 3 bằng bao nhiêu?",
                options: [4, 5, 6],
                answer: 5,
                explanation: "8 tách ra 3, còn lại 5. Bé thật giỏi!",
              },
            },
          ]
        : []),
    ],
  };
});
interface ExtendedSeed {
  title: string;
  description: string;
  objective: string;
  stageId: string;
  difficulty: 3 | 4;
  activity: Activity;
  values: number[];
  instruction: string;
  hint: string;
  question: Question;
  config?: import("../types/lesson").ActivityConfig;
}
const extendedSeeds: ExtendedSeed[] = [
  {
    title: "Một thoáng nhớ ngay",
    description: "Những khối nhỏ chơi trốn tìm cùng bé.",
    objective: "Nhận ra nhanh số lượng nhỏ mà không đếm lại từng ô.",
    stageId: "detective",
    difficulty: 3,
    activity: "memory",
    values: [4],
    instruction: "Bấm Mở hộp bí mật, nhìn thật kỹ rồi chọn số khối bé nhớ.",
    hint: "Nhìn cách các khối xếp thành hai hàng, mỗi hàng hai khối.",
    question: {
      prompt: "Trong hộp có bao nhiêu khối?",
      options: [3, 4, 5],
      answer: 4,
      explanation: "Hai hàng, mỗi hàng hai khối: có 4 khối tất cả.",
    },
    config: { flashMs: 1800 },
  },
  {
    title: "Đoàn tàu nhảy cách",
    description: "Mỗi toa tàu chở thêm hai người bạn.",
    objective: "Nhận biết quy luật tăng thêm 2.",
    stageId: "detective",
    difficulty: 3,
    activity: "pattern",
    values: [2, 4, 6],
    instruction: "Toa sau thêm hai khối. Bé tìm toa tiếp theo nhé!",
    hint: "2, 4, 6… thêm hai nữa sẽ đến 8.",
    question: {
      prompt: "2, 4, 6, ? — số nào tiếp theo?",
      options: [7, 8, 9],
      answer: 8,
      explanation: "Mỗi lần thêm 2: 2 → 4 → 6 → 8.",
    },
    config: { patternIncrement: 2 },
  },
  {
    title: "Vũ hội chẵn và lẻ",
    description: "Mỗi bạn tìm một người bạn nhảy cùng.",
    objective: "Hiểu số chẵn ghép thành các cặp, số lẻ dư một khối.",
    stageId: "detective",
    difficulty: 3,
    activity: "parity",
    values: [8],
    instruction: "Ghép các khối thành từng cặp. Có ai đứng một mình không?",
    hint: "Nếu ghép hết thành các cặp thì đó là số chẵn.",
    question: {
      prompt: "8 là số chẵn hay số lẻ?",
      options: ["Chẵn", "Lẻ"],
      answer: "Chẵn",
      explanation: "8 có 4 cặp, không ai đứng một mình nên 8 là số chẵn.",
    },
  },
  {
    title: "Khu vườn mười hai",
    description: "Đếm những mầm nhỏ vượt qua số mười.",
    objective: "Đếm chính xác nhóm 12 khối, làm quen phạm vi 20.",
    stageId: "detective",
    difficulty: 3,
    activity: "count",
    values: [12],
    instruction: "Chạm mỗi ô một lần và đếm đến mười hai nhé.",
    hint: "Sau mười là mười một, rồi mười hai.",
    question: {
      prompt: "Khu vườn có tất cả bao nhiêu khối?",
      options: [10, 12, 14],
      answer: 12,
      explanation: "Đếm thêm hai sau mười được mười hai: 10 + 2 = 12.",
    },
  },
  {
    title: "Vườn rau ba luống",
    description: "Mỗi luống trồng hai mầm cây nhỏ.",
    objective: "Hiểu 3 nhóm bằng nhau, mỗi nhóm 2, tạo thành 6.",
    stageId: "create",
    difficulty: 4,
    activity: "grouping",
    values: [3, 2],
    instruction:
      "Trồng từng luống, mỗi luống hai khối. Sau đó đếm cả khu vườn!",
    hint: "Ba nhóm hai khối: 2 + 2 + 2.",
    question: {
      prompt: "3 nhóm, mỗi nhóm 2 khối, có tất cả bao nhiêu?",
      options: [5, 6, 8],
      answer: 6,
      explanation: "3 × 2 = 2 + 2 + 2 = 6 khối.",
    },
  },
  {
    title: "Bữa bánh của ba bạn",
    description: "Giúp Mầm chia bánh thật công bằng.",
    objective: "Chia đều 6 đồ vật cho 3 bạn, mỗi bạn 2.",
    stageId: "create",
    difficulty: 4,
    activity: "sharing",
    values: [6, 3],
    instruction:
      "Chạm từng bạn để chia một chiếc bánh. Chia sao cho ba bạn bằng nhau nhé!",
    hint: "Chia mỗi bạn một chiếc, rồi chia thêm một vòng nữa.",
    question: {
      prompt: "6 chiếc bánh chia đều cho 3 bạn. Mỗi bạn được mấy chiếc?",
      options: [1, 2, 3],
      answer: 2,
      explanation: "6 ÷ 3 = 2. Mỗi người hai chiếc, không ai nhiều hay ít hơn.",
    },
  },
  {
    title: "Những mái nhà nhỏ",
    description: "Tìm mái nhà cho ngôi làng khối số.",
    objective: "Nhận diện tam giác qua ba cạnh và ba góc.",
    stageId: "create",
    difficulty: 4,
    activity: "shapes",
    values: [3],
    instruction: "Tìm hình có ba cạnh để làm mái nhà nhé.",
    hint: "Đi theo đường viền và đếm ba cạnh của tam giác.",
    question: {
      prompt: "Hình tam giác có mấy cạnh?",
      options: [3, 4, 5],
      answer: 3,
      explanation: "Tam giác có 3 cạnh và 3 góc. Một chiếc mái nhà thật đẹp!",
    },
    config: { targetShape: "triangle" },
  },
  {
    title: "Cây cầu tình bạn",
    description: "Nắng muốn qua suối thăm Mây.",
    objective: "Tìm hai khối còn thiếu để hoàn thành cầu sáu khối.",
    stageId: "create",
    difficulty: 4,
    activity: "bridge",
    values: [6, 2],
    instruction: "Cầu còn thiếu hai ô. Đặt từng khối để Nắng sang bên kia nhé!",
    hint: "Cầu cần 6 khối, đã có 4. Hãy thêm 2 khối.",
    question: {
      prompt: "Đã có 4 khối, cần 6 khối. Bé phải thêm mấy khối?",
      options: [1, 2, 3],
      answer: 2,
      explanation: "4 + 2 = 6. Đủ hai khối còn thiếu, Nắng qua suối an toàn!",
    },
  },
  {
    title: "Đến giờ đi chơi!",
    description: "Cùng Mây xem chiếc đồng hồ trong vườn.",
    objective: "Nhận biết giờ đúng: kim dài ở 12, kim ngắn ở số giờ.",
    stageId: "create",
    difficulty: 4,
    activity: "clock",
    values: [3],
    instruction: "Vặn kim ngắn đến số 3. Kim dài ở số 12 nhé!",
    hint: "Kim ngắn chỉ 3, kim dài chỉ 12: đó là 3 giờ.",
    question: {
      prompt: "Kim ngắn ở 3, kim dài ở 12. Đồng hồ chỉ mấy giờ?",
      options: ["3 giờ", "6 giờ", "9 giờ"],
      answer: "3 giờ",
      explanation: "Đúng 3 giờ! Kim dài ở 12 nên chưa thêm phút nào.",
    },
  },
  {
    title: "Gấp đôi niềm vui",
    description: "Hai đội, mỗi đội bốn người bạn.",
    objective: "Hiểu gấp đôi 4 được 8, chia đôi 8 được 4.",
    stageId: "create",
    difficulty: 4,
    activity: "grouping",
    values: [2, 4],
    instruction:
      "Tạo hai nhóm bốn khối giống nhau. Bé thấy số khối tăng thế nào?",
    hint: "Bốn khối ở nhóm thứ nhất và bốn khối ở nhóm thứ hai.",
    question: {
      prompt: "Gấp đôi 4 được bao nhiêu?",
      options: [6, 8, 10],
      answer: 8,
      explanation:
        "Gấp đôi 4 là 4 + 4 = 8. Chia 8 thành hai nhóm đều nhau, mỗi nhóm là 4.",
    },
  },
];
export const lessons: Lesson[] = [
  ...coreLessons,
  ...extendedSeeds.map((s, i): Lesson => ({
    id: `lesson-${15 + i}`,
    stageId: s.stageId,
    title: s.title,
    description: s.description,
    minutes: 5,
    difficulty: s.difficulty,
    learningObjective: s.objective,
    steps: [
      {
        id: `l${15 + i}-intro`,
        type: "explain",
        title: s.title,
        instruction: s.description,
        activity: s.activity,
        values: s.values,
        config: s.config,
        hint: s.hint,
      },
      {
        id: `l${15 + i}-play`,
        type: "interact",
        title: "Cùng giúp các bạn nhé!",
        instruction: s.instruction,
        activity: s.activity,
        values: s.values,
        config: s.config,
        hint: s.hint,
      },
      {
        id: `l${15 + i}-quiz`,
        type: "quiz",
        title: "Bé đã khám phá được gì?",
        instruction: s.question.prompt,
        activity: s.activity,
        values: s.values,
        config: s.config,
        hint: s.hint,
        question: s.question,
      },
    ],
  })),
];
export const badges = [
  {
    id: "first",
    title: "Bước chân đầu tiên",
    description: "Hoàn thành 1 bài học",
    required: 1,
    icon: "sprout",
  },
  {
    id: "explorer",
    title: "Nhà khám phá",
    description: "Hoàn thành 5 bài học",
    required: 5,
    icon: "compass",
  },
  {
    id: "star",
    title: "Ngôi sao toán học",
    description: `Hoàn thành cả ${lessons.length} bài`,
    required: lessons.length,
    icon: "trophy",
  },
];
export const homeCopy = {
  eyebrow: "MỖI KHỐI NHỎ, MỘT KHÁM PHÁ LỚN",
  title: "Chơi cùng khối số.\nLớn cùng niềm vui.",
  description:
    "Một thế giới nhỏ đầy màu sắc, nơi bé làm quen với toán qua những người bạn khối số đáng yêu.",
  tips: [
    "Dành cho bé 3–6 tuổi",
    "Học qua chơi, nhớ thật lâu",
    "Khám phá theo nhịp của bé",
  ],
};

// Original procedural music and sound palette; never fetches media assets.
export const audioProfiles = {
  lobby: {
    title: "Dạo chơi trên đảo",
    bpm: 84,
    level: 0.45,
    wave: "sine",
    melody: [
      523, 0, 659, 587, 0, 523, 440, 0, 494, 0, 587, 659, 587, 0, 440, 0,
    ],
    bass: [131, 147, 165, 147],
  },
  lesson: {
    title: "Cùng nhau khám phá",
    bpm: 112,
    level: 0.7,
    wave: "triangle",
    melody: [
      523, 659, 784, 659, 587, 698, 880, 698, 659, 784, 1047, 784, 587, 698,
      784, 659,
    ],
    bass: [131, 175, 165, 147],
  },
  playground: {
    title: "Khu vườn sáng tạo",
    bpm: 98,
    level: 0.57,
    wave: "sine",
    melody: [
      392, 523, 0, 659, 587, 0, 523, 440, 349, 440, 523, 0, 587, 523, 0, 392,
    ],
    bass: [131, 110, 175, 131],
  },
  challenge: {
    title: "Chuyến tàu chinh phục",
    bpm: 128,
    level: 0.77,
    wave: "triangle",
    melody: [
      523, 784, 659, 784, 587, 880, 698, 880, 659, 1047, 784, 1047, 698, 880,
      784, 659,
    ],
    bass: [131, 147, 165, 175],
  },
  celebration: {
    title: "Bé đã làm được rồi",
    bpm: 110,
    level: 0.67,
    wave: "sine",
    melody: [
      523, 659, 784, 1047, 0, 784, 880, 1047, 988, 784, 659, 523, 659, 784,
      1047, 0,
    ],
    bass: [131, 175, 196, 131],
  },
} satisfies Record<
  import("../types/audio").AudioMood,
  import("../types/audio").MusicProfile
>;
export const audioEffects = {
  pop: {
    notes: [440, 660],
    wave: "sine",
    duration: 0.12,
    spacing: 0.035,
    gain: 0.13,
  },
  merge: {
    notes: [330, 440, 554, 660],
    wave: "triangle",
    duration: 0.22,
    spacing: 0.07,
    gain: 0.13,
  },
  split: {
    notes: [784, 659, 523, 392],
    wave: "sine",
    duration: 0.2,
    spacing: 0.075,
    gain: 0.13,
  },
  correct: {
    notes: [523, 659, 784, 1047],
    wave: "triangle",
    duration: 0.24,
    spacing: 0.09,
    gain: 0.14,
  },
  tryAgain: {
    notes: [392, 440, 392],
    wave: "sine",
    duration: 0.18,
    spacing: 0.1,
    gain: 0.11,
  },
  complete: {
    notes: [523, 659, 784, 1047, 784, 1047],
    wave: "triangle",
    duration: 0.3,
    spacing: 0.12,
    gain: 0.14,
  },
  star: {
    notes: [880, 1047, 1319],
    wave: "sine",
    duration: 0.2,
    spacing: 0.07,
    gain: 0.11,
  },
  count: {
    notes: [523],
    wave: "triangle",
    duration: 0.17,
    spacing: 0,
    gain: 0.14,
  },
  greet: {
    notes: [392, 523, 659],
    wave: "sine",
    duration: 0.19,
    spacing: 0.065,
    gain: 0.14,
  },
  place: {
    notes: [330, 660],
    wave: "triangle",
    duration: 0.13,
    spacing: 0.05,
    gain: 0.13,
  },
  build: {
    notes: [196, 392, 587],
    wave: "triangle",
    duration: 0.16,
    spacing: 0.045,
    gain: 0.15,
  },
  pair: {
    notes: [440, 554],
    wave: "sine",
    duration: 0.2,
    spacing: 0.065,
    gain: 0.13,
  },
  share: {
    notes: [659, 784],
    wave: "sine",
    duration: 0.17,
    spacing: 0.055,
    gain: 0.12,
  },
  reveal: {
    notes: [330, 494, 740],
    wave: "sine",
    duration: 0.26,
    spacing: 0.09,
    gain: 0.12,
  },
  tick: { notes: [740], wave: "sine", duration: 0.07, spacing: 0, gain: 0.07 },
  start: {
    notes: [392, 523, 659, 784],
    wave: "triangle",
    duration: 0.18,
    spacing: 0.11,
    gain: 0.14,
  },
  step: {
    notes: [262, 392],
    wave: "triangle",
    duration: 0.13,
    spacing: 0.05,
    gain: 0.12,
  },
  hint: {
    notes: [587, 784],
    wave: "sine",
    duration: 0.3,
    spacing: 0.12,
    gain: 0.1,
  },
} satisfies Record<string, import("../types/audio").EffectProfile>;
export const shapeChoices: {
  kind: import("../types/lesson").ShapeKind;
  label: string;
  corners: number;
}[] = [
  { kind: "triangle", label: "Tam giác", corners: 3 },
  { kind: "square", label: "Hình vuông", corners: 4 },
  { kind: "circle", label: "Hình tròn", corners: 0 },
  { kind: "rectangle", label: "Chữ nhật", corners: 4 },
];
export const playModes = [
  {
    id: "map",
    title: "Hành trình khám phá",
    description: "Đi từng bước nhỏ, khám phá bài học theo chặng.",
    label: "Có lộ trình",
    icon: "compass",
  },
  {
    id: "playground",
    title: "Sân chơi tự do",
    description: "Tự ghép số, thử chiếc cân và xây thế giới của bé.",
    label: "Không có đáp án sai",
    icon: "blocks",
  },
  {
    id: "challenge",
    title: "Thử thách nhanh",
    description: "Năm câu đố nhỏ. Thêm đồng hồ nếu bé muốn thử sức!",
    label: "Ôn tập vui vẻ",
    icon: "zap",
  },
];
export const playgroundConfig = {
  tabs: [
    { id: "merge", label: "Ghép số" },
    { id: "split", label: "Tách số" },
    { id: "compare", label: "Chiếc cân" },
    { id: "build", label: "Xưởng xây dựng" },
  ] as const,
  colors: ["#8b9be5", "#edbc55", "#78b794", "#db8caa"],
  cols: 8,
  rows: 6,
  house: [
    11, 12, 18, 19, 20, 21, 25, 26, 27, 28, 29, 30, 34, 35, 36, 37, 42, 43, 44,
    45,
  ],
};
export const challengeConfig = {
  questionsPerRound: 5,
  seconds: 60,
  title: "Năm câu đố, một chuyến phiêu lưu",
  difficultyLabels: [
    { value: 0, label: "Tất cả" },
    { value: 1, label: "Nhận biết 1–5" },
    { value: 2, label: "Cộng trừ 1–10" },
    { value: 3, label: "Quy luật và số đến 20" },
    { value: 4, label: "Nhóm, chia và hình học" },
  ],
};

export const voiceCopy = {
  welcome:
    "Chào bé đến với Đảo Khối Số! Mình cùng chơi và khám phá những người bạn nhỏ nhé!",
  quizHelp: "Bé chạm một đáp án, rồi bấm nút có dấu tích để kiểm tra nhé.",
  tryAgain: "Gần đúng rồi! Không sao đâu, mình cùng thử lại nhé.",
  complete:
    "Bé làm được rồi! Cảm ơn bé đã cùng các bạn khám phá. Mình cùng nhận ngôi sao nào!",
  playground:
    "Chào bé đến xưởng khối số! Bé có thể ghép, tách, thử chiếc cân hoặc tự xây một ngôi nhà.",
  challenge:
    "Năm câu đố nhỏ đang đợi bé! Chọn bắt đầu để cùng thử sức nhé. Không cần vội đâu!",
  ready: "Bây giờ bé có thể bấm mũi tên để tiếp tục nhé.",
};
export const spokenNumbers = [
  "không",
  "một",
  "hai",
  "ba",
  "bốn",
  "năm",
  "sáu",
  "bảy",
  "tám",
  "chín",
  "mười",
  "mười một",
  "mười hai",
  "mười ba",
  "mười bốn",
  "mười lăm",
  "mười sáu",
  "mười bảy",
  "mười tám",
  "mười chín",
  "hai mươi",
];
export const spokenSymbols: Record<string, string> = {
  "<": "Bé hơn",
  ">": "Lớn hơn",
  "=": "Bằng nhau",
  Chẵn: "Số chẵn",
  Lẻ: "Số lẻ",
};

# Đảo Khối Số — bàn giao và đọc nhanh

Cập nhật 30/10/2026. Tài liệu này mô tả source thực tế sau đợt mở rộng theo `README_Number_Block_Game_Expansion_Spec.md` (bản sao đầy đủ đặc tả người dùng). Đây là ứng dụng frontend React + TypeScript + Vite, CSS thuần và SVG nguyên bản; không backend, tài khoản, UI framework mới hay asset Numberblocks.

## Nắm dự án trong một phút

| Hạng mục          | Hiện trạng                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------- |
| Nội dung cũ       | Giữ 24 bài / 5 chặng, 15 dạng học + giới thiệu nhân vật                                       |
| Nội dung mới      | 8 thế giới × 10 bài = 80 bài, ngân hàng 800 câu có seed                                       |
| Tổng bài          | 104 bài, gồm hai hành trình được giữ riêng                                                    |
| Kiến trúc mới     | 67 exercise types, tái sử dụng 9 engine tương tác                                             |
| Một lượt học mới  | 5 câu lấy từ ngân hàng 10 câu/bài; học lại đổi tập câu                                        |
| Mức độ            | Có dữ liệu sinh ở mức 1–5; sổ tay cho chọn nhanh mức 1/3/5                                    |
| Phạm vi số cơ bản | Mức 1: 1–5; mức 2: 1–10; mức 3–5: đến 20, tăng thêm yêu cầu suy luận/thao tác; có nhóm rỗng 0 |
| Chế độ            | Hành trình, sân chơi, thử thách 5/10/15 câu, nhiệm vụ ngày, luyện thích ứng                   |
| Phần thưởng       | 72 sao cũ + 240 sao mới; nhân vật và huy hiệu khám phá                                        |
| Giọng đọc         | 186 MP3 Linh tiếng Việt, 4.558.968 byte; tổng 553.359 ms (~9 phút 13 giây)                    |
| Nhạc và hiệu ứng  | Web Audio tổng hợp, 5 bối cảnh, 18 hiệu ứng; tắt/bật chung hoặc riêng                         |
| Tiến trình        | localStorage trên thiết bị, không thu thập thông tin cá nhân                                  |
| Deploy            | Vercel: Node 24.x, `npm ci`, `npm run build`, thư mục `dist`                                  |

**Lối vào:** Trang chủ → “8 thế giới, 80 bài học mới”, hoặc `/#worlds`. Hành trình 24 bài vẫn ở `/#map` và nút “24 bài gốc” trong thế giới. Điều hướng Bài học cũ vẫn giữ lối vào hành trình gốc.

## Trạng thái các phase

| Phase | Đã triển khai trong source                                                                                                                                                        |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Registry cho hoạt động cũ, validator tách khỏi UI, giữ 24 bài; chuẩn hóa engine mới, dữ liệu có seed, feedback/gợi ý, lưu tiến trình                                              |
| 2     | Type 16–30: Ten Frame, number bonds, số gần/đứng trước/sau/khoảng cách, chọn phép tính/dấu, tìm lỗi, cân bằng, nhiều cách, tính ngược, chuỗi, máy +/−, ước lượng, mê cung         |
| 3     | Type 31–44: Tangram 7 mảnh ghép kín hình vuông, công trình, đối xứng, khối 3D, điều hướng, sao chép, đo, cân, dung tích, xu đồ chơi/mua sắm, lịch tương đối, đồng hồ/giờ trôi qua |
| 4     | Type 45–61: khác biệt, suy luận, nhận định nhân vật, sắp xếp, đường ngắn nhất, giải mã, quy luật ẩn, nhiều điều kiện, phân số, mảng nhân, biểu đồ/khảo sát/dự đoán có dữ kiện     |
| 5     | Type 62–67: nhảy nền tảng, tàu số, kho báu, bếp toán, phân loại động vật, tên lửa; 8 thế giới, 80 bài, bộ sưu tập, huy hiệu, sổ tay, nhiệm vụ ngày                                |
| 6     | Kiểm thử tự động, kiểm tra hình học/nội dung, chống submit lặp, pointer/touch, bố cục 360/768/1440, focus modal, reduced motion, tách tải phần mở rộng                            |

**Phase 6 chưa nghiệm thu với trẻ thật:** Chưa có buổi chơi có người lớn giám sát và chưa đo trên điện thoại iOS/Android thật. Kiểm tra Chrome/WebKit bên dưới là mô phỏng trình duyệt. Không coi kết quả tự động là bằng chứng trẻ đã hiểu được toàn bộ nội dung.

## Chạy và kiểm tra

Dùng Node 24 (`.nvmrc` và `engines.node` cùng đặt 24). Không cần cài công cụ tạo voice để chạy web.

```sh
nvm use
npm ci
npm run dev
npm run build
npm run preview
npm run lint
npm test
```

Dev mặc định `http://localhost:5173`; preview `http://localhost:4173`. Test desktop dùng Google Chrome đã cài. Nếu dùng Chromium của Playwright:

```sh
npx playwright install chromium
PLAYWRIGHT_CHANNEL=chromium npm test
```

Kiểm tra cảm ứng bằng Chrome và WebKit:

```sh
npx playwright install webkit
npm run test:mobile
```

`test:mobile` có cấu hình riêng, giả lập Pixel 7 và iPhone 13; cần Google Chrome trên máy. Không thay thế thử trên điện thoại thật.

### Sửa lệch mục tiêu đếm (Lá/Đào và Trời)

- Lỗi trước đây: hướng dẫn bài 2 chỉ bạn Đào, nhưng CountActivity lấy tổng mọi nhóm hiển thị (4 + 5 = 9) làm điều kiện qua bước. Câu trả lời Đào/5 vẫn đúng; điều kiện thao tác đếm mới là phần bị lệch.
- `ActivityConfig.countTargetGroups` nay chỉ rõ các nhóm thuộc nhiệm vụ. Bài 2 vẫn cho thấy Lá và Đào, nhưng chỉ 5 khối Đào có thể đếm; bộ đếm là 0/5, không yêu cầu 9.
- Bài 4 giữ phần giới thiệu năm bạn, nhưng bước thực hành/câu hỏi chỉ đếm Trời 10 khối, không gom 6 + 7 + 8 + 9 + 10 = 40. Lời chuyển và giọng hướng dẫn đã đồng bộ với mục tiêu mới.
- Callback ready hỗ trợ cập nhật cả đúng/chưa xong: đếm lại, xây/chia/trồng lại, chọn từ đúng sang sai không giữ trạng thái hoàn thành cũ. Đường số chờ đủ số bước; cân có đích 3/3 thì cần về đúng 3/3. Mũi tên chuyển khối khớp với hướng chữ.
- Bài tách 6 thành 3 và 3 khóa thao tác đổi sang số tách khác. Bài điền nhóm khối phân biệt thiếu/thừa và hiển thị ≠ khi ghép sai.
- Test `tests/content-alignment.spec.ts` kiểm tra mục tiêu thao tác thực tế, không chỉ kiểm tra đáp án lưu trong data. Bao gồm mọi câu cũ, mọi màn đếm cũ và tính nhất quán lượng của 800 câu mới. Ảnh kiểm tra: `docs/screenshots/lesson-2-count-target.png`.

### Kết quả kiểm tra

- Build TypeScript/Vite và ESLint đạt trên Node 24.22.2.
- Sau đợt sửa mục tiêu đếm: **187/187 test tổng đạt** trên Node 24 (3,1 phút), thêm **2/2 test trạng thái hoàn thành/reset đạt** (6 giây). Bộ desktop hiện có 189 test. Bộ tổng bao gồm test nâng cao cho xoay Tangram, ghép bánh, nhiều đáp án, máy trừ và khoảng giờ.
- Bộ touch: **6/6 đạt** trên Chrome và WebKit (10,2 giây); tổng cộng 195 ca kiểm tra riêng biệt đã đạt.
- Kiểm tra dữ liệu: đủ 80 bài/800 ID câu duy nhất, 67 type có handler, không vòng prerequisites; mọi câu có lời giải được validator chấp nhận.
- Validator: đúng/sai/thiếu thao tác; 67 type × 3 mức × 8 seed; số 0, bằng nhau, nhiều đáp án đúng, phân số tương đương, chia đều, quay/vị trí hình, đường đi không nhảy ô, trùng cặp, dữ liệu sai.
- UI: thực sự thao tác để giải từng type; giữ nguyên luồng đi hết 24 bài cũ; tiếp tục khi tải lại, gợi ý/làm mẫu, khóa submit lặp, lưu sao, nhiệm vụ ngày, sổ tay, bộ sưu tập, mute/voice/nhạc và phát MP3 thật.
- Hình học: kiểm tra diện tích và điểm phủ Tangram để phát hiện hở/chồng; các phần bánh có diện tích bằng nhau và ghép thành một toàn thể.
- Nội dung: mỗi bài có ít nhất 3 cấu hình nội dung thực chất khác nhau, không chỉ thay ID.
- 186 file MP3 trong manifest đều tồn tại. Voice tải khi cần, không tải toàn bộ ngay ở trang chủ.

Ảnh ở `docs/screenshots/`: `worlds-map.png`, `worlds-mobile.png`, `tangram.png`, `fraction-composition.png`, `animal-habitat.png` và các ảnh giao diện cũ. Báo cáo desktop ở `playwright-report/` (`npx playwright show-report`); trace giữ lại khi test lỗi.

## Nội dung và tương tác

### 8 thế giới

| ID  | Thế giới              | Nội dung                                                    |
| --- | --------------------- | ----------------------------------------------------------- |
| W1  | Khu vườn những con số | Đếm, ghép lượng, Ten Frame, thứ tự, số liền kề, nhìn nhanh  |
| W2  | Thành phố phép cộng   | Ghép/tách, number bonds, phần thiếu, phép tính/dấu, máy số  |
| W3  | Vương quốc so sánh    | Cân bằng, nhiều/ít, khoảng cách, thứ tự, chẵn/lẻ, nhận định |
| W4  | Đảo hình học          | Hình phẳng/3D, Tangram, đối xứng, công trình, vị trí        |
| W5  | Rừng quy luật         | Dãy số, màu/hình, mã, suy luận, điều kiện, mê cung          |
| W6  | Thành phố cuộc sống   | Đo, dung tích, xu giả lập, mua sắm, lịch, đồng hồ, biểu đồ  |
| W7  | Vùng đất phép nhân    | Nhóm bằng nhau, chia đều, phân số, mảng nhân, tính ngược    |
| W8  | Vũ trụ trí tuệ        | Kho báu, bếp, động vật, tên lửa, thống kê, tổng hợp         |

Mỗi thế giới có 10 bài, mỗi bài có mục tiêu, mức độ, prerequisites và 10 câu. Một phiên lấy 5 câu có seed theo lượt học; tải lại giữ danh sách và vị trí câu. Mặc định mở tất cả cho gia đình chọn; tắt “Mở mọi bài” để các thẻ trong từng thế giới mở theo bài trước. Đây là khóa định hướng trên UI, không phải kiểm soát truy cập: đường dẫn trực tiếp vẫn dùng được.

Câu đếm chạm từng vật chỉ tính một lần, có đọc số. Cộng/trừ tái sử dụng hoạt ảnh dịch chuyển chính các khối. Ghép hình có kéo pointer, chạm mảnh → chạm vị trí, xoay 90°, hoàn tác và làm lại. Tangram gồm đúng hai tam giác lớn, một vừa, hai nhỏ, một vuông, một bình hành. Bánh được ghép từ 2 hoặc 4 phần bằng nhau. Đo chiều dài/cao dùng các đơn vị sát nhau; ở màn hình hẹp vùng đo có thể cuộn bên trong để giữ ô đủ lớn. Động vật được chọn và đặt vào khu, không chỉ trả lời bằng số.

Câu nhiều đáp án đúng khai báo `multiple` và yêu cầu chọn tất cả; so sánh có trường hợp bằng nhau; biểu đồ có thể đồng hạng. Dự đoán có lượng bổ sung cụ thể để trẻ suy luận từ dữ liệu. Tiền là **xu đồ chơi**, lịch dùng ngày tương đối, không giả lập dữ liệu thời gian thực.

Sân chơi cũ giữ ghép/tách/cân và xưởng xây. Bổ sung chạm để chuyển khối, hoàn tác/làm lại bước; chế độ vẽ mặc định vẫn chạm thêm/bớt khối. Thử thách mặc định 5, chọn 10/15 và cấp độ; đồng hồ 60 giây tùy chọn, mặc định tắt. Kỷ lục từng độ dài lưu riêng; 5 câu giữ schema cũ.

### 67 dạng có registry

| #   | Type                          | Tên                        | Engine         |
| --- | ----------------------------- | -------------------------- | -------------- |
| 1   | `tap_counting`                | Chạm để đếm                | `count`        |
| 2   | `match_number_quantity`       | Ghép số với số lượng       | `choice`       |
| 3   | `block_addition`              | Ghép khối để cộng          | `choice`       |
| 4   | `block_subtraction`           | Tách khối để trừ           | `choice`       |
| 5   | `seesaw_compare`              | Bập bênh so sánh           | `choice`       |
| 6   | `missing_number`              | Tìm số còn thiếu           | `choice`       |
| 7   | `number_pattern`              | Quy luật số                | `choice`       |
| 8   | `number_line`                 | Đi trên đường số           | `choice`       |
| 9   | `quick_subitizing`            | Nhìn nhanh nhớ số lượng    | `count`        |
| 10  | `odd_even_pairs`              | Chẵn và lẻ                 | `count`        |
| 11  | `equal_groups_multiplication` | Các nhóm bằng nhau         | `distribution` |
| 12  | `equal_sharing_division`      | Chia đều cho bạn           | `distribution` |
| 13  | `shape_recognition`           | Nhận biết hình             | `choice`       |
| 14  | `bridge_building`             | Xây cầu tình bạn           | `count`        |
| 15  | `tell_time_hour`              | Xem giờ đúng               | `choice`       |
| 16  | `ten_frame_completion`        | Điền bảng mười ô           | `count`        |
| 17  | `number_bonds`                | Các phần tạo thành số      | `parts`        |
| 18  | `closest_to_target`           | Số gần mục tiêu            | `choice`       |
| 19  | `before_after_number`         | Số đứng trước và sau       | `choice`       |
| 20  | `number_distance`             | Khoảng cách giữa các số    | `choice`       |
| 21  | `choose_equation`             | Chọn phép tính đúng        | `choice`       |
| 22  | `operator_missing`            | Tìm dấu phép tính          | `choice`       |
| 23  | `spot_math_error`             | Sửa lỗi cho robot          | `choice`       |
| 24  | `equation_balance`            | Cân bằng hai vế            | `choice`       |
| 25  | `multiple_solutions`          | Sưu tập cách giải          | `parts`        |
| 26  | `reverse_calculation`         | Tính ngược                 | `choice`       |
| 27  | `calculation_chain`           | Chuỗi phép tính            | `choice`       |
| 28  | `number_machine`              | Máy biến đổi số            | `choice`       |
| 29  | `estimation`                  | Ước lượng gần đúng         | `choice`       |
| 30  | `math_maze`                   | Mê cung phép tính          | `path`         |
| 31  | `tangram`                     | Ghép hình Tangram          | `placement`    |
| 32  | `shape_construction`          | Xây hình từ khối           | `placement`    |
| 33  | `symmetry_completion`         | Hoàn thành đối xứng        | `placement`    |
| 34  | `solid_shapes`                | Nhận biết khối 3D          | `choice`       |
| 35  | `spatial_navigation`          | Đi đúng hướng              | `path`         |
| 36  | `copy_structure`              | Sao chép công trình        | `placement`    |
| 37  | `length_measurement`          | Đo chiều dài               | `placement`    |
| 38  | `height_measurement`          | Đo chiều cao               | `placement`    |
| 39  | `weight_comparison`           | So sánh cân nặng           | `choice`       |
| 40  | `capacity_measurement`        | So sánh dung tích          | `choice`       |
| 41  | `money_recognition`           | Tiền xu đồ chơi            | `choice`       |
| 42  | `shopping_math`               | Đi chợ cùng bạn            | `choice`       |
| 43  | `calendar_days`               | Hôm qua và ngày mai        | `choice`       |
| 44  | `tell_time_advanced`          | Đồng hồ nâng cao           | `choice`       |
| 45  | `odd_one_out`                 | Tìm vật khác nhóm          | `choice`       |
| 46  | `clue_deduction`              | Suy luận theo gợi ý        | `choice`       |
| 47  | `character_claims`            | Bạn nào nói đúng           | `choice`       |
| 48  | `conditional_sorting`         | Xếp theo điều kiện         | `order`        |
| 49  | `shortest_path`               | Tìm đường ít bước          | `path`         |
| 50  | `number_code`                 | Giải mã biểu tượng         | `choice`       |
| 51  | `hidden_pattern`              | Quy luật hàng và cột       | `choice`       |
| 52  | `multi_condition_logic`       | Nhiều điều kiện            | `choice`       |
| 53  | `fraction_partition`          | Chia đôi và chia tư        | `fraction`     |
| 54  | `fraction_composition`        | Ghép phần thành chiếc bánh | `placement`    |
| 55  | `multiplication_array`        | Mảng hàng và cột           | `distribution` |
| 56  | `fraction_compare`            | So sánh phần bánh          | `choice`       |
| 57  | `build_chart`                 | Đếm và lập biểu đồ         | `distribution` |
| 58  | `read_chart`                  | Đọc biểu đồ                | `choice`       |
| 59  | `character_survey`            | Khảo sát sở thích          | `distribution` |
| 60  | `data_extremes`               | Lớn nhất và nhỏ nhất       | `choice`       |
| 61  | `data_prediction`             | Dự đoán có căn cứ          | `choice`       |
| 62  | `answer_platform_jump`        | Nhảy tới đáp án            | `mission`      |
| 63  | `number_train`                | Đoàn tàu số                | `order`        |
| 64  | `treasure_hunt`               | Săn kho báu                | `mission`      |
| 65  | `math_kitchen`                | Nhà bếp toán học           | `distribution` |
| 66  | `animal_habitat_builder`      | Xây khu vườn động vật      | `distribution` |
| 67  | `rocket_launch_math`          | Phóng tên lửa              | `mission`      |

Các biến thể `scene_object_counting`, `visual_quantity_compare`, `color_pattern`, `shape_pattern`, `shape_sorting` dùng handler tương ứng; curriculum đã đổi instruction/payload thực tế, không trỏ tới component chưa tồn tại.

## Nhân vật, giọng đọc và âm thanh

Nhân vật gốc: Mầm, Mây, Nắng, Lá, Đào và các bạn số lớn hơn, tạo bằng SVG/CSS. Bài 1/2/4 cũ có giới thiệu theo nhóm, nhân vật xuất hiện/vẫy tay/chào; có nghe lại và bỏ qua lời chào. Câu hỏi “nhân vật nào” ở bài cũ có lựa chọn bằng hình/tên; câu hỏi “bao nhiêu” dùng số.

- MP3 tĩnh ở `public/audio/narration/`, manifest ánh xạ câu → file hash + thời lượng. Giọng Linh được tổng hợp sẵn, không phải thu âm người thật; không dùng runtime TTS/SpeechSynthesisUtterance/API.
- 177 clip sau đợt tối ưu bài cũ + 9 hướng dẫn chung theo engine mới = 186 clip hiện tại. So với 221 clip ban đầu: giảm khoảng 15,8% số file, 26,9% tổng thời lượng dù đã thêm hướng dẫn engine. Đợt tối ưu bài cũ riêng giảm 19,91% file và 31,49% thời lượng.
- Bài cũ có giọng câu hỏi/lời chào/hướng dẫn. **800 câu sinh mới chưa có voice đọc trọn từng câu**: chỉ dùng 9 hướng dẫn engine chung, lời đếm, phản hồi và những lựa chọn có clip. Bé chưa đọc được vẫn cần người lớn hỗ trợ ở các bài mới nhiều chữ. Đây là giới hạn hiện tại, ưu tiên kiểm chứng nội dung trước.
- Chạm đếm đọc 1/2/3…, chạm lại không tăng; lời đếm xếp hàng, không chồng. Đếm lại xóa hàng đợi. Nhạc hạ khi có lời nói.
- Loa chính bật/tắt nhạc + hiệu ứng + giọng. Cài đặt cho phép bật/tắt từng lớp, chỉnh âm lượng, tiếp tục phát khi chuyển tab (mặc định tắt).
- Audio mở khóa sau tương tác. Trình duyệt có thể hạn chế khi khóa màn hình/đưa app nền; đóng trang thì dừng.

Khi sửa câu thoại dùng chung, sửa `src/data/mockData.ts` hoặc `src/data/expansion/voicePrompts.ts`; kiểm tra `src/data/narrationPlan.ts`, rồi chạy trên macOS có giọng Linh, `say`, `ffmpeg`, `ffprobe`:

```sh
npm run audio:generate
npm run build
npm test
```

Script chỉ tạo câu chưa có, cập nhật manifest và xóa hash MP3 mồ côi. Không tạo tự động MP3 cho từng câu sinh theo seed.

## Tiến trình, phần thưởng, dữ liệu

- `daoKhoiSo.progress.v1`: sao 24 bài, cài đặt tiếng/phát nền, bài gần nhất, kỷ lục thử thách. Giữ khả năng đọc dữ liệu cũ.
- `daoKhoiSo.learning.v1`: sao 80 bài, thống kê kỹ năng, hints/guided, 200 event gần nhất chống ghi trùng, nhiệm vụ 31 ngày, phiên đang học.
- 24 bài giữ luật sao cũ (3/2/1 theo số lần thử sai). 80 bài mới nhận 3 sao khi hoàn thành 5 lượt, kể cả dùng gợi ý/mẫu; thử lại không trừ sao. Học lại không cộng sao vô hạn.
- Luyện thích ứng dùng tỷ lệ đúng, số lần cần hướng dẫn và chuỗi đúng độc lập. Đúng sau khi xem mẫu không được tính vào chuỗi để tự tăng khó. Đây là heuristic cục bộ, chưa là mô hình đánh giá năng lực được kiểm định.
- Nhiệm vụ ngày gồm 3 câu, seed theo ngày thiết bị, không phạt bỏ ngày. Sổ tay ghi kỹ năng đã thử, nút chọn mức và luyện lại.
- Bộ sưu tập 10 bạn và 4 huy hiệu mở bằng số bài mới đã khám phá; chưa có hệ thống mua/đổi trang phục hay cửa hàng.
- Đặt lại tiến độ ở Cài đặt có xác nhận, xóa cả hai nhóm. Storage hỏng/bị chặn không làm crash; không đồng bộ giữa thiết bị/domain, không lưu tên/email/vị trí trẻ.
- Tải lại giữ **vị trí câu**, không phục hồi từng mảnh đang kéo hoặc đáp án dở trong câu.

## File và kiến trúc cần đọc

| File/thư mục                                                       | Vai trò                                                                       |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `src/App.tsx`                                                      | Routing hash, lazy-load ExpansionApp, settings, tổng sao, nhạc                |
| `src/data/mockData.ts`                                             | Nội dung 24 bài, nhân vật, cấu hình sân chơi/thử thách/voice cũ               |
| `src/features/exercises/legacyRegistry.tsx`, `legacyValidators.ts` | Đăng ký/chấm bài cũ, giữ renderer sẵn có                                      |
| `src/features/exercises/types.ts`                                  | Union 67 type, payload/answer discriminated unions                            |
| `catalog.ts`, `generator.ts`                                       | Mục tiêu/engine, sinh câu theo type/mức/seed                                  |
| `validators.ts`, `registry.tsx`, `payload.ts`                      | Toán thuần, lời giải mẫu, 9 renderer/67 entry, thu hẹp kiểu                   |
| `views/`                                                           | Đếm, lựa chọn, parts/order, ghép hình, đường đi, chia nhóm, phân số, nhiệm vụ |
| `tangram.ts`                                                       | Tọa độ đa giác Tangram và các phần bánh bằng nhau                             |
| `src/data/expansion/curriculum.ts`                                 | 8 thế giới, blueprint 80 bài, 800 câu/ID, prerequisites và biến thể           |
| `src/data/expansion/voicePrompts.ts`                               | 9 câu đọc hướng dẫn engine                                                    |
| `src/features/worlds/ExpansionApp.tsx`                             | Map, bài học, sổ tay, bộ sưu tập, nhiệm vụ ngày                               |
| `WorldLessonPlayer.tsx`, `practice.ts`, `worlds.css`               | Phiên học, pause, gợi ý, thích ứng/seed, giao diện responsive                 |
| `src/services/learningStorage.ts`, `progressStorage.ts`            | Lưu/xác thực/reset hai nhóm dữ liệu                                           |
| `src/services/audioService.ts`, `narrationService.ts`              | Nhạc/hiệu ứng, MP3 và hàng đợi lời đếm                                        |
| `src/components/PlaygroundPage.tsx`, `QuickChallengePage.tsx`      | Sân chơi có history/tap move; thử thách tùy độ dài                            |
| `tests/`                                                           | Regression cũ, validator, curriculum, 67 UI type, chất lượng, touch           |
| `playwright.mobile.config.ts`                                      | Kiểm tra riêng Chrome/WebKit cảm ứng                                          |

`src/features/exercises/legacyObjectives.ts` tách nhóm có mặt trong cảnh khỏi nhóm được yêu cầu đếm. Không suy luận nhóm cần đếm bằng cách dò chuỗi tiếng Việt; khai báo chỉ số nhóm trong config và kiểm tra mục tiêu bằng test.

Thêm nội dung: ưu tiên thêm blueprint/seed và điều kiện trong generator hiện có. Thêm type mới cần cập nhật union, catalog, generator, validator/rule và registry; tái sử dụng engine nếu luật thao tác giống nhau. Luôn thêm ca đúng/sai/biên; chạy kiểm tra curriculum để không có handler thiếu. Không dùng `eval` để chấm phép tính: parser chỉ nhận biểu thức số và toán tử cho phép.

Route mới: `/#worlds`, `/#world/W1`, `/#learn/W1-L01`, `/#daily`, `/#notebook`, `/#collection`, `/#practice`, `/#practice/tangram/3`. Route cũ: `/#home`, `/#map`, `/#progress`, `/#playground`, `/#challenge`, `/#play/lesson-2`.

## Cách kiểm tra thủ công

1. Trang chủ → 8 thế giới → W1 → bài đầu. Chạm từng vật, thử chạm trùng; kiểm tra, chuyển câu và tải lại. Hoàn thành đủ 5 câu, kiểm tra 3 sao; học lại không tăng quá 3 sao.
2. Sổ tay → Xem mọi kỹ năng → chọn Mức 1/3/5. Thử Ten Frame, number bonds, máy biến đổi số, bập bênh và số liền kề.
3. Với Tangram, chọn mảnh → xoay → đặt vào hình; thử sai vị trí/hướng rồi sửa. Thử kéo bằng chuột và chạm trên điện thoại. Dùng Hoàn tác/Làm lại. Ghép phần bánh phải tạo một hình tròn kín.
4. Thử chia đều, biểu đồ có nhiều đáp án và điều kiện logic; chọn thiếu/chọn sai phải có phản hồi tích cực. Phân loại con vật bằng chọn → khu → lấy lại.
5. Tạm dừng, Tab và Escape; đảm bảo focus ở modal, hoạt động còn khi tiếp tục. Bật giảm chuyển động hệ thống để kiểm tra hoạt ảnh.
6. Xưởng xây dựng: thêm màu, chuyển khối bằng chạm, hoàn tác/làm lại. Thử thách: đổi 5/10/15; xác nhận mặc định không đồng hồ và kỷ lục lưu riêng.
7. Kiểm tra âm thanh sau một lần bấm: nhạc sảnh/bài khác nhau, đọc khi đếm, loa chung tắt tất cả; từng option và phát nền được giữ khi tải lại. Bài mới chỉ có lời hướng dẫn chung như giới hạn phía trên.
8. Xem nhiệm vụ ngày, bộ sưu tập và sổ tay; reset có xác nhận xóa tiến trình hai hành trình. Kiểm tra 24 bài gốc vẫn ở map.
9. Kiểm tra điện thoại ngang/dọc, Safari iOS/Chrome Android thật. Với trẻ 4–5 tuổi có người lớn ngồi cùng: thử 3 bài đếm/ghép/so sánh, ghi chỗ bé cần đọc hộ, nhầm thao tác hoặc mất tập trung. Với 6–8 tuổi, thử quy luật/đo/chia nhóm. Chưa thực hiện buổi này trong phiên triển khai.

## Vercel và Git

- Repo đã có `origin`: `git@github-personal:NguyenBaHoangKim/number-block-game.git`; commit app trước đợt mở rộng: `ef2913d`.
- **Bản phát hành source 1.0.2** gồm nội dung mở rộng, sửa mục tiêu đếm và nhãn phiên bản ở cuối trang. Phiên bản lấy từ `package.json`, đồng bộ với lockfile. Xem `git log` để xác định commit; trạng thái deploy theo dashboard Vercel, tài liệu này không xác nhận URL production.
- Giữ `vercel.json`: framework Vite, `npm ci` → `npm run build` → `dist`, cache MP3 có hash 1 năm. `.nvmrc`/engines = Node 24.
- Import GitHub repository vào Vercel, Root Directory là repo root, Node 24.x, không cần Environment Variables/backend. Git integration deploy từ branch được chọn.
- Khi phát hành, commit source + lockfile + MP3/manifest + cấu hình. Không commit node_modules/dist/.env/.vercel/test-results/playwright-report.
- `/#...` là hash route nên tải lại không cần SPA rewrite đặc biệt. Sau deploy kiểm tra `/#worlds`, `/#learn/W1-L01`, `/#play/lesson-2` và một MP3 từ manifest; không yêu cầu tải hết file âm thanh.
- Tiến trình localhost/preview/production khác domain nên không tự chuyển sang nhau.

## Danh mục 24 bài gốc được giữ

| Bài | Tên                  | Cấp | Cơ chế chính            |
| --- | -------------------- | --- | ----------------------- |
| 1   | Xin chào các khối số | 1   | meet, count             |
| 2   | Khám phá số 4 và 5   | 1   | meet, count             |
| 3   | Cùng đếm từ 1 đến 5  | 1   | count                   |
| 4   | Khám phá số 6 đến 10 | 1   | meet, count             |
| 5   | Số và số lượng       | 1   | compare, match          |
| 6   | Số 5 được tạo thành  | 2   | compare, count          |
| 7   | Ghép 2 và 3          | 2   | merge                   |
| 8   | Tách số 5            | 2   | split                   |
| 9   | Tạo số 10            | 2   | merge                   |
| 10  | Thêm một khối        | 2   | numberline              |
| 11  | Cộng hai nhóm số     | 2   | merge                   |
| 12  | Bớt đi một khối      | 2   | split                   |
| 13  | Tách một nhóm        | 2   | pattern, split, compare |
| 14  | Thử thách cộng trừ   | 2   | missing, split          |
| 15  | Một thoáng nhớ ngay  | 3   | memory                  |
| 16  | Đoàn tàu nhảy cách   | 3   | pattern                 |
| 17  | Vũ hội chẵn và lẻ    | 3   | parity                  |
| 18  | Khu vườn mười hai    | 3   | count                   |
| 19  | Vườn rau ba luống    | 4   | grouping                |
| 20  | Bữa bánh của ba bạn  | 4   | sharing                 |
| 21  | Những mái nhà nhỏ    | 4   | shapes                  |
| 22  | Cây cầu tình bạn     | 4   | bridge                  |
| 23  | Đến giờ đi chơi!     | 4   | clock                   |
| 24  | Gấp đôi niềm vui     | 4   | grouping                |

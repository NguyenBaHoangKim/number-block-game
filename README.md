# Đảo Khối Số

Web học toán tiếng Việt bằng nhân vật khối số nguyên bản. React + TypeScript + Vite, CSS thuần và SVG. Chỉ frontend; không backend, tài khoản hay API bên ngoài.

## Chạy dự án

Đã chạy trên Node.js 26.7.0, npm 11.19.0. Vite yêu cầu Node 20.19+ hoặc 22.12+.

```sh
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm test
```

Vite mặc định chạy tại `http://localhost:5173`, preview tại `http://localhost:4173`.

Kiểm thử dùng Playwright và Google Chrome đã cài. Có thể thay bằng Chromium:

```sh
npx playwright install chromium
PLAYWRIGHT_CHANNEL=chromium npm test
```

## Nội dung và cách chơi

**24 bài, 5 chặng**, tối đa 72 sao. Mọi bài đều mở để gia đình chọn theo khả năng của bé. Các bài đầu phù hợp bé 3–4 tuổi với người lớn đồng hành; bài nhóm, chia, đồng hồ là phần thử sức nâng cao, có ghi cấp độ.

1. Khám phá các con số: chào nhân vật, đếm 1–10, ghép số với lượng.
2. Ghép và tách số: cân bằng, cộng/tách 5, nhiều cách tạo 10.
3. Cộng và trừ vui nhộn: đường số, cộng nhóm, bớt khối, quy luật, số còn thiếu.
4. Thám tử quy luật: ghi nhớ nhanh, dãy tăng 2, chẵn/lẻ, đếm 12.
5. Xưởng sáng tạo: nhóm bằng nhau, chia bánh, tam giác, xây cầu, giờ đúng và gấp đôi.

Ba chế độ:

- **Hành trình khám phá**: giới thiệu → thực hành → câu hỏi → tổng kết. Có gợi ý, thử lại và giải thích.
- **Sân chơi tự do**: điều chỉnh nhóm để ghép/tách/cân; ghép tối đa 20 khối. Xưởng xây dựng cho phép chọn màu, thêm/bớt khối, kéo khối đổi ô, xếp nhà và dọn sân; không có đáp án sai.
- **Thử thách nhanh**: 5 câu/vòng, chọn cấp độ, thời gian 60 giây tùy chọn. Lưu kỷ lục riêng, không cộng sao vô hạn vào bài học. Nếu một cấp có ít hơn 5 câu, vòng chơi có một câu ôn lại.

Nhân vật được tạo từ đúng số ô SVG có thể đếm được. Ghép/tách di chuyển chính các phần tử ban đầu bằng CSS transform; có Pointer Events và nút bấm thay thế. Cân nghiêng theo số lượng. Nhân vật mới ở bài 1, 2 và 4 lần lượt xuất hiện, vẫy tay, chào bằng tên và nói tiếng Việt trước khi bé tiếp tục. Có nút nghe lại.

Bài hỏi **nhân vật nào** có đáp án bằng hình và tên (ví dụ Mây, Lá, Đào). Bài hỏi **bao nhiêu** chọn số; bài so sánh chọn dấu. Các giá trị dùng để kiểm tra và hình minh họa được kiểm chứng cùng nhau.

## Giọng đọc và âm thanh

- Giọng Việt **Linh được tổng hợp sẵn**, đóng gói thành **221 file MP3** trong `public/audio/narration/` (khoảng 6,4 MB). Đây không phải giọng thu âm người thật.
- `src/data/narrationManifest.json` ánh xạ nội dung sang file và thời lượng; câu chữ gốc vẫn ở `src/data/mockData.ts`.
- Có voice cho lời chào, lời chuyển hoạt động, hướng dẫn, câu hỏi, giải thích, tên/lựa chọn và số từ 0 đến 20.
- Chạm một ô mới phát lời đếm; chạm lại không tăng và không đọc lại. Chạm nhanh thì lời đếm được xếp hàng, không chồng lên nhau. Mỗi nhóm bắt đầu đếm từ một. Nút đếm lại xóa hàng đợi.
- Lời chào chờ đủ thời lượng clip rồi đến nhân vật tiếp theo. Nhạc nền tự hạ khi có giọng đọc.
- Nhạc nền và **18 loại hiệu ứng** được tổng hợp bằng Web Audio. Sảnh, bài học, sân chơi, thử thách và tổng kết có giai điệu/nhịp riêng. Nhạc bài học rõ và nhanh hơn nhạc sảnh.
- **Nút loa trên đầu trang tắt/bật đồng thời nhạc, hiệu ứng và giọng đọc.** Cài đặt vẫn cho phép chỉnh từng lớp riêng và âm lượng chung.
- Tùy chọn **Tiếp tục phát khi chuyển tab** mặc định tắt, được lưu ở trình duyệt. Khi bật, ứng dụng cho phép tiếp tục nhạc/lời đọc lúc chuyển tab hoặc thu nhỏ cửa sổ. Trình duyệt/hệ điều hành có thể hạn chế phát khi khóa màn hình, đặc biệt trên điện thoại; đóng trang sẽ dừng phát.
- Âm thanh chỉ được mở khóa sau tương tác người dùng. Nếu trình duyệt chặn, nút nghe lại cho phép chủ động phát. Không dùng `speechSynthesis` hoặc dịch vụ đọc chữ trực tuyến trong bản hiện tại.

Frontend chạy được với các MP3 đã đóng gói, không cần cài công cụ tạo giọng. Để sửa lời thoại:

1. Sửa nội dung trong `src/data/mockData.ts`.
2. Trên máy macOS có giọng Linh, `say`, `ffmpeg`, `ffprobe` và Node hỗ trợ chạy TypeScript trực tiếp (môi trường hiện tại: Node 26), chạy:

```sh
npm run audio:generate
npm run build
```

Script `scripts/generateNarration.mjs` chỉ tạo clip chưa có theo hash nội dung, cập nhật manifest/thời lượng. Không cần tạo lại mọi file. Nếu chuyển sang giọng khác, cần tạo lại clip/manifest bằng giọng đó. Các tài sản Numberblocks không được sử dụng.

## Tiến độ và phần thưởng

`daoKhoiSo.progress.v1` lưu sao tốt nhất, bài gần nhất, cài đặt và thành tích thử thách trong `localStorage`. Dữ liệu phiên bản cũ được giữ và điền các cài đặt mới bằng mặc định. Storage hỏng/bị chặn được xử lý an toàn. Không lưu thông tin cá nhân.

Hoàn thành bài: 3 sao nếu không sai; 2 sao nếu sai 1–2 lần; 1 sao nếu sai nhiều hơn. Chỉ lưu điểm tốt nhất, học lại không cộng vô hạn. Có 3 huy hiệu và đặt lại tiến độ với xác nhận. Bước học đang dở nằm trong bộ nhớ phiên; mở lại bài bắt đầu ở phần giới thiệu.

## Cấu trúc và mở rộng

```text
src/
  App.tsx
  components/
    LessonPlayer.tsx
    NumberCharacter.tsx
    NarrationButton.tsx
    BlockWorkspace.tsx
    activities/                 # Các cơ chế chơi tái sử dụng
    PlaygroundPage.tsx
    QuickChallengePage.tsx
    HomePage.tsx
    LearningMap.tsx
    PlayModes.tsx
    SettingsDialog.tsx
  data/
    mockData.ts                 # Nội dung, nhân vật, câu hỏi, cấu hình nhạc/chế độ
    narrationManifest.json      # Metadata âm thanh được tạo tự động
  services/
    audioService.ts
    narrationService.ts
    progressStorage.ts
  types/
  styles/global.css
public/audio/narration/
scripts/generateNarration.mjs
tests/{app,expansion,voice}.spec.ts
```

Các route: `/#home`, `/#map`, `/#progress`, `/#playground`, `/#challenge`, `/#play/lesson-2`. URL bài không hợp lệ có trang quay lại.

Để thêm bài, sửa `mockData.ts`: thêm phần tử vào `extendedSeeds` hoặc thêm `Lesson` có ID duy nhất vào danh sách. Khai báo `stageId`, `difficulty`, `learningObjective`, các bước, activity/values, câu hỏi, đáp án và gợi ý. Thêm chặng khi cần; số lượng bài/sao trên giao diện được tính từ dữ liệu. Các activity mới dùng chung renderer, không cần sửa layout. Sau khi đổi văn bản, tạo lại voice để có MP3 tương ứng.

Các hoạt động hỗ trợ: `meet`, `count`, `merge`, `split`, `compare`, `match`, `missing`, `pattern` (tăng theo bước cấu hình), `numberline`, `memory`, `parity`, `grouping`, `sharing`, `shapes`, `bridge`, `clock`.

## Kiểm chứng

Bộ kiểm thử bao gồm: đi hết 24 bài, đúng/sai, bảo toàn khối khi ghép/tách/kéo, chào trước khi đếm, đáp án đúng loại, kiểm tra toán từ dữ liệu, chia đều, chẵn/lẻ, xây cầu, sân chơi, thử thách và đồng hồ tùy chọn, lưu/reset và chuyển dữ liệu cũ, phát/dừng/đổi nhạc, MP3 được tải/giải mã/phát thật, hàng đợi đếm, nút âm thanh chung và tùy chọn phát nền.

Responsive được kiểm tra từ 360 đến 1440px. Có focus bàn phím, dialog giữ focus và giảm chuyển động. Font Nunito được đóng gói cục bộ, không tải Google Fonts.

Kết quả mỗi lần chạy ở `playwright-report/`; mở bằng `npx playwright show-report`. Kiểm tra âm thanh tự động xác nhận luồng tải/phát và vòng đời; chưa đánh giá bằng tai trên mọi thiết bị, chưa kiểm thử khóa màn hình trên thiết bị iOS/Android thật.

Ảnh giao diện ở `docs/screenshots/`: trang chủ, sân chơi, lời chào và cầu tình bạn.
# number-block-game

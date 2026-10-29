# README — Web học toán tương tác bằng khối số (Frontend Demo)

> **Mục tiêu:** Xây dựng một bản demo frontend hoàn chỉnh cho trẻ em học toán thông qua các nhân vật khối số đầy màu sắc, hoạt ảnh ghép/tách, bài học cố định, trò chơi tương tác, hiệu ứng âm thanh và nhạc nền vui nhộn.
>
> **Công nghệ chính:** React + TypeScript + Vite.
>
> **Phạm vi bản demo:** Chỉ frontend. Không backend, không API, không database. Tất cả nội dung bài học, câu hỏi, cấu hình nhân vật và dữ liệu minh họa phải được đặt trong một module mock data riêng. Tiến độ có thể lưu ở `localStorage`.

---


## Định hướng sáng tạo và nội dung tương tác mở rộng

Mục tiêu là tạo một thế giới toán học vui nhộn với các nhân vật khối số tự thiết kế. Có thể học hỏi cách tổ chức bài học trực quan của các chương trình giáo dục toán cho trẻ nhỏ, nhưng phải sáng tạo nhân vật, cốt truyện, lời thoại, âm nhạc, hình ảnh và hoạt ảnh riêng. Danh sách dưới đây là gợi ý để phát triển, không phải giới hạn cứng: Codex có thể đề xuất thêm trò chơi phù hợp với độ tuổi và mục tiêu học tập.

### Phong cách nhân vật

- Thiết kế các khối số nhiều màu, dễ thương, có mắt, miệng, biểu cảm và tính cách riêng; ưu tiên hình khối bo tròn, đường nét rõ ràng, màu sắc tươi sáng và chuyển động mềm mại.
- Mỗi nhân vật biểu diễn số lượng bằng các ô/khối thành phần có thể đếm được. Số lượng, màu sắc, biểu cảm và trạng thái phải được sinh từ dữ liệu, không tạo một ảnh tĩnh riêng cho từng số.
- Tạo hoạt ảnh riêng cho các hành động: xuất hiện, nhảy, đi, va chạm nhẹ, ghép, tách, xoay, đếm, ăn mừng, trả lời sai và thử lại.
- Dùng SVG/CSS và React để nhân vật có thể thay đổi số lượng thành phần, màu, biểu cảm và vị trí trong lúc tương tác.

### Các hoạt động toán học nên có

1. **Ghép khối để cộng:** Hai nhóm khối tiến lại gần và ghép thành một nhóm mới. Ví dụ `2 + 3 = 5`; người học có thể kéo thả khối hoặc bấm nút ghép.
2. **Tách khối để trừ:** Một nhóm tách thành nhóm nhỏ hơn hoặc một số khối rời khỏi nhóm. Ví dụ `5 - 2 = 3`; cập nhật số lượng ngay khi hoạt ảnh hoàn thành.
3. **Bập bênh lớn hơn – bé hơn – bằng nhau:** Đặt các nhóm khối lên hai bên bập bênh. Bên có nhiều khối hơn hạ xuống; hai bên bằng nhau thì bập bênh cân bằng. Sau đó chọn ký hiệu `>`, `<` hoặc `=`.
4. **Đếm và chạm:** Chạm vào từng khối để đếm lần lượt; làm nổi bật khối đang được đếm và tránh đếm trùng.
5. **Tạo số bằng nhiều cách:** Chọn hai hoặc nhiều nhóm để tạo ra cùng một tổng, ví dụ `1 + 4`, `2 + 3`, `3 + 2`.
6. **Số còn thiếu:** Hoàn thành phép tính như `2 + ? = 5` bằng cách chọn hoặc kéo đúng số khối vào chỗ trống.
7. **Đường số:** Di chuyển nhân vật tiến/lùi theo số bước để minh họa cộng và trừ.
8. **Xếp quy luật:** Nhận biết và hoàn thành chuỗi màu sắc, số lượng hoặc mẫu lặp đơn giản.
9. **So sánh nhóm:** Quan sát hai nhóm, dự đoán nhóm nào nhiều hơn, ít hơn hoặc bằng nhau rồi kiểm tra bằng cách ghép từng cặp.
10. **Thử thách tự do:** Một khu vực cho phép trẻ tự kéo, thả, ghép, tách, xếp chồng và thử các phép tính mà không bị giới hạn bởi một câu hỏi duy nhất.
11. **Nhiệm vụ theo câu chuyện:** Giúp nhân vật chia đồ vật, gom nhóm, xây cầu hoặc cân bằng bập bênh; mỗi câu chuyện cần gắn với mục tiêu toán học rõ ràng.
12. **Ôn tập thích ứng:** Dựa trên câu trả lời trong phiên hiện tại để đưa ra câu hỏi tương tự hoặc tăng/giảm độ khó; không cần backend.

### Nguyên tắc tương tác

- Không chỉ hiển thị đáp án: hãy cho trẻ thấy vì sao đáp án đúng thông qua chuyển động, đếm được từng khối và phản hồi trực quan.
- Khi trả lời đúng, nhân vật có thể vui mừng, phát hiệu ứng nhẹ và giải thích ngắn. Khi trả lời sai, phản hồi thân thiện, gợi ý cách đếm hoặc thử lại; không chê bai hay gây áp lực.
- Các nút chính như Chơi, Ghép, Tách, Kiểm tra, Gợi ý, Làm lại, Tiếp tục và Bật/tắt âm thanh phải thực sự hoạt động.
- Âm thanh, nhạc nền và hiệu ứng có thể tự phát khi trình duyệt cho phép. Nếu autoplay bị chặn, cung cấp điều khiển âm thanh dễ thấy và tiếp tục hoạt động bình thường.
- Ưu tiên khả năng tiếp cận: tương phản tốt, chữ dễ đọc, mục tiêu chạm đủ lớn, không chỉ dùng màu để truyền đạt đáp án và hỗ trợ giảm chuyển động/ tắt âm thanh.

## 1. Chỉ dẫn dành cho Codex

Hãy đọc toàn bộ README này trước khi bắt đầu triển khai.

### 1.1. Yêu cầu thực hiện

1. Kiểm tra repository hiện tại trước khi sửa: xem cấu trúc thư mục, `package.json`, cấu hình Vite, các dependency và những component đã có.
2. Nếu repository đã có dự án React + TypeScript + Vite, hãy **tận dụng cấu trúc hiện tại**, không tạo dự án lồng bên trong hoặc ghi đè cấu hình không cần thiết.
3. Nếu repository chưa có dự án, khởi tạo React + TypeScript + Vite trong thư mục hiện tại.
4. Triển khai demo chạy được thực sự, không chỉ tạo giao diện tĩnh hoặc viết kế hoạch.
5. Không tạo backend, không gọi API từ xa, không cần đăng nhập.
6. Toàn bộ bài học và nội dung mẫu phải tập trung trong **một file mock data chính**: `src/data/mockData.ts`.
7. Có thể tạo các file asset âm thanh trong `public/audio/` nếu có nguồn phù hợp. Nếu chưa có file âm thanh, tạo cơ chế âm thanh tổng hợp bằng Web Audio API và giao diện bật/tắt âm thanh; không tham chiếu các file không tồn tại.
8. Chạy `npm run build`, sửa lỗi TypeScript/build nếu có. Nếu môi trường cho phép, chạy lint và kiểm tra các luồng chính.
9. Không tuyên bố đã chạy kiểm thử nếu thực tế chưa chạy.
10. Ưu tiên hoàn thành một sản phẩm nhỏ nhưng có trải nghiệm tương tác tốt, nhất quán và chỉn chu.

### 1.2. Những điều không được làm

- Không sử dụng Tailwind CSS hoặc Bootstrap.
- Không phụ thuộc backend hoặc dữ liệu từ API.
- Không để nút bấm chỉ có tính trang trí; mọi nút chính phải thực hiện hành động hợp lý.
- Có thể tham khảo các ý tưởng sư phạm phổ biến như đếm, ghép/tách số, so sánh số lượng và giải quyết vấn đề; không sao chép nguyên mẫu nhân vật, hình ảnh, lời thoại, nhạc, giọng đọc hoặc hoạt ảnh đặc trưng của Numberblocks. Hãy sáng tạo thiết kế và nội dung riêng.
- Không sử dụng emoji làm toàn bộ hình ảnh nhân vật. Có thể dùng emoji làm chi tiết phụ, nhưng nhân vật khối số phải được vẽ bằng SVG/CSS hoặc một giải pháp đồ họa tự tạo.
- Không tạo một ảnh tĩnh riêng cho mỗi số rồi dùng ảnh đó để giả lập phép ghép. Các khối phải được sinh từ dữ liệu để có thể chuyển động và tương tác.
- Không thêm các dependency nặng nếu CSS, SVG, React hoặc một thư viện nhỏ đã đủ giải quyết vấn đề.

---

## 2. Tầm nhìn sản phẩm

Tạo một website học toán vui nhộn cho trẻ em, lấy cảm hứng từ cách trực quan hóa số bằng các khối vuông. Các nhân vật là thiết kế nguyên bản: khối vuông bo góc, màu sắc tươi sáng, mắt và miệng biểu cảm, bóng đổ mềm và hiệu ứng nảy.

Trẻ có thể:

- Khám phá các số từ 1 đến 10.
- Nhìn số được tạo thành từ bao nhiêu khối đơn vị.
- Ghép hai nhóm khối để học phép cộng.
- Tách một nhóm khối để học phép trừ.
- Làm bài tập bằng cách chọn đáp án hoặc kéo thả khối.
- Nhận phản hồi vui vẻ, sao thưởng và huy hiệu.
- Nghe hiệu ứng âm thanh và nhạc nền vui nhộn, có thể tắt/bật.
- Tiếp tục bài học từ tiến độ đã lưu trên trình duyệt.

### 2.1. Định hướng sáng tạo

Không cần bó buộc bản demo trong một bộ bài tập khô cứng. Hãy sáng tạo các tình huống, trò chơi và hoạt ảnh toán học giàu tưởng tượng, miễn là phù hợp với trẻ nhỏ, giúp trẻ hiểu khái niệm bằng hình ảnh và có thể chơi lại. Có thể tham khảo **cách dạy toán trực quan** thường thấy trong các chương trình như Numberblocks — ví dụ số được tạo từ các khối đơn vị, ghép/tách số, đếm, so sánh và nhận biết quy luật — nhưng phải tự xây dựng nhân vật, câu chuyện, lời thoại, giao diện, âm thanh và hoạt ảnh riêng. Không sao chép nguyên mẫu hoặc tài sản chính thức.

### 2.2. Đối tượng

Mặc định thiết kế cho trẻ khoảng 3–6 tuổi, nhưng nội dung và giao diện cần đủ linh hoạt để bổ sung các cấp độ khác sau này.

### 2.3. Nguyên tắc UX

- Ưu tiên trực quan, ít chữ, hướng dẫn ngắn.
- Nút bấm lớn, dễ chạm trên màn hình cảm ứng.
- Màu sắc vui tươi nhưng không làm giao diện rối mắt.
- Không phạt nặng khi trả lời sai. Khuyến khích thử lại.
- Mỗi màn hình chỉ nên có một nhiệm vụ chính.
- Hiển thị tiến trình rõ ràng: bước hiện tại, số câu đã làm và phần thưởng.
- Âm thanh có thể tắt hoàn toàn; không bắt buộc phải nghe mới hoàn thành bài.
- Hỗ trợ responsive cho desktop, tablet và mobile.

---

## 3. Phạm vi bản demo

### 3.1. Bắt buộc có

1. Trang chủ.
2. Bản đồ/chọn bài học theo chặng.
3. Màn hình học bài theo từng bước.
4. Hệ thống nhân vật khối số từ 1 đến 10.
5. Hoạt ảnh ghép và tách khối.
6. Câu hỏi trắc nghiệm và ít nhất một dạng kéo-thả.
7. Phản hồi đúng/sai.
8. Sao thưởng và tiến độ học tập.
9. Lưu tiến độ bằng `localStorage`.
10. Bật/tắt nhạc nền và âm thanh hiệu ứng.
11. Một màn hình tổng kết bài học.
12. File mock data tập trung.
13. README dự án có hướng dẫn chạy.

### 3.2. Chưa cần

- Backend, REST API, GraphQL.
- Đăng nhập, tài khoản phụ huynh hoặc giáo viên.
- Database.
- CMS để chỉnh sửa bài học.
- AI tạo bài học.
- Bảng xếp hạng trực tuyến.
- Multiplayer.
- Hệ thống thanh toán.
- Nhân vật 3D thực sự.
- Thu âm giọng nói hoặc nhận dạng giọng nói.
- Hệ thống phân tích dữ liệu trẻ em.

### 3.3. Tiêu chí thành công

Bản demo được xem là đạt khi người dùng có thể mở trang, chọn bài, xem hướng dẫn, tương tác với khối, trả lời câu hỏi, nhận phản hồi, hoàn thành bài, nhận sao và tải lại trang mà tiến độ vẫn còn.

---

## 4. Công nghệ

### 4.1. Stack chính

- **React**
- **TypeScript**
- **Vite**
- **CSS thuần hoặc CSS Modules**
- **SVG** để vẽ các khối và khuôn mặt
- **Motion for React** (`motion`) cho hoạt ảnh nếu tương thích với phiên bản React hiện tại
- **Web Audio API** cho hiệu ứng âm thanh tổng hợp khi chưa có file audio
- **localStorage** để lưu tiến độ và cài đặt âm thanh

Có thể dùng `lucide-react` cho icon giao diện nếu dependency phù hợp với dự án.

Không bắt buộc dùng Material UI. Hãy ưu tiên giao diện riêng, thân thiện với trẻ. Không dùng Tailwind CSS hoặc Bootstrap.

### 4.2. Nguyên tắc lựa chọn thư viện

- Trước khi thêm package, kiểm tra package đã tồn tại trong dự án chưa.
- Không thêm thư viện drag-and-drop nặng chỉ để kéo thả vài khối. Có thể dùng Pointer Events hoặc HTML Drag and Drop API.
- Nếu Motion không phù hợp với dependency hiện có, dùng CSS keyframes và CSS transitions.
- Không dùng WebGL/Three.js cho bản demo đầu tiên.
- Không phụ thuộc font, ảnh, nhạc hoặc API từ một URL bên ngoài để giao diện hoạt động.

---

## 5. Thiết kế hình ảnh và hệ thống khối số

### 5.1. Phong cách đồ họa

Tạo phong cách hoạt hình 2.5D nguyên bản:

- Khối vuông có góc bo nhẹ.
- Mặt trước sáng, cạnh có sắc độ đậm hơn.
- Gradient tinh tế và bóng đổ mềm.
- Mắt to, biểu cảm thân thiện.
- Miệng đơn giản, có nhiều trạng thái: cười, ngạc nhiên, suy nghĩ.
- Chuyển động nhẹ: nhún, nảy, rung, xuất hiện, biến mất.
- Nền sáng, có mây, sao, hình tròn hoặc confetti trang trí nhưng không quá dày.
- Tránh hiệu ứng nhấp nháy nhanh hoặc quá nhiều chuyển động đồng thời.

Không sao chép tạo hình, bảng màu theo từng nhân vật, tên gọi, lời thoại hoặc tài sản hình ảnh chính thức của Numberblocks. Tạo bộ nhân vật và ngôn ngữ hình ảnh riêng.

### 5.2. Sinh khối từ dữ liệu

Mỗi nhân vật số phải được tạo từ số lượng khối đơn vị tương ứng. Ví dụ:

- Số 1: 1 khối.
- Số 2: 2 khối.
- Số 3: 3 khối.
- ...
- Số 10: 10 khối.

Dùng một component tái sử dụng, ví dụ:

```tsx
<NumberCharacter
  value={5}
  color="#F6B83F"
  expression="happy"
  animated
/>
```

Đây là API minh họa; Codex có thể điều chỉnh nhưng phải giữ nguyên ý tưởng tái sử dụng.

### 5.3. Quy tắc xếp khối

- Với số nhỏ, xếp thành cột hoặc dạng lưới dễ đếm.
- Với số 6–10, dùng cách xếp nhất quán, dễ nhìn và không vượt khỏi khung.
- Mỗi khối đơn vị cần có viền hoặc khoảng cách đủ rõ để trẻ đếm được.
- Không để khuôn mặt làm mất khả năng nhận diện số lượng.
- Các khối trong cùng một nhân vật phải có thể được render riêng để tạo hoạt ảnh ghép/tách.
- Cần responsive theo kích thước container.

### 5.4. Component khối đề xuất

- `NumberBlock`: một khối đơn vị.
- `BlockFace`: mắt, miệng và biểu cảm.
- `NumberCharacter`: nhóm khối biểu diễn một số.
- `BlockGroup`: một nhóm khối trong bài tập.
- `BlockWorkspace`: vùng tương tác kéo-thả.
- `MergeAnimation`: hiệu ứng ghép hai nhóm.
- `SplitAnimation`: hiệu ứng tách nhóm.
- `Confetti`: hiệu ứng hoàn thành.

Không nhất thiết phải tạo đủ component riêng nếu một số phần có thể gộp hợp lý, nhưng phải tránh component quá lớn chứa toàn bộ logic.

### 5.5. Biểu cảm

Tối thiểu hỗ trợ các trạng thái:

- `happy`
- `excited`
- `thinking`
- `surprised`
- `encouraging`

Trạng thái `encouraging` dùng khi trả lời sai để tạo cảm giác động viên, không chế giễu hoặc làm trẻ thất vọng.

### 5.6. Tính cách và thiết kế nhân vật

Tạo một bộ nhân vật khối số đáng yêu, vui nhộn và có bản sắc riêng:

- Dùng bảng màu đa dạng, tươi sáng; màu của từng số có thể khác nhau nhưng không bắt buộc phải gắn cố định theo quy luật cứng nhắc.
- Khuôn mặt biểu cảm, mắt to vừa phải, miệng linh hoạt; có thể thêm má hồng, lông mày, găng tay hoặc chân nhỏ như chi tiết phụ.
- Tạo các tính cách riêng như tò mò, thích nhảy, bình tĩnh, hào hứng khám phá; thể hiện bằng hoạt ảnh và biểu cảm chứ không chỉ bằng lời.
- Có hoạt ảnh phản ứng khi chạm vào, khi được ghép với bạn, khi bị tách ra, khi mất cân bằng hoặc khi tìm được đáp án.
- Mỗi nhân vật vẫn phải thể hiện đúng số lượng khối đơn vị. Trang trí không được che khuất các khối khiến trẻ khó đếm.
- Tự thiết kế hình dáng, màu sắc, phụ kiện, tên và lời thoại. Có thể lấy cảm hứng từ ý tưởng “số là một nhóm các khối đơn vị”, nhưng không mô phỏng một nhân vật Numberblocks cụ thể.

### 5.7. Các phép biến đổi phải được sinh từ dữ liệu

Không tạo ảnh riêng cho từng kết quả. Ví dụ, khi ghép `2 + 3`, hệ thống phải lấy hai khối từ nhóm thứ nhất và ba khối từ nhóm thứ hai, chạy animation để chúng di chuyển lại gần nhau rồi bố trí thành nhóm 5. Khi tách `5 - 2`, hai khối phải thật sự di chuyển ra khỏi nhóm và còn lại ba khối. Có thể dùng SVG, CSS transforms và state của React; thư viện animation nhỏ chỉ là tùy chọn.

---

## 6. Hoạt ảnh

### 6.1. Các hoạt ảnh bắt buộc

1. Nhân vật xuất hiện bằng hiệu ứng scale/fade hoặc nảy nhẹ.
2. Khối nhún khi người dùng chạm/click.
3. Hai nhóm khối di chuyển lại gần nhau khi ghép.
4. Các khối dịch chuyển vào vị trí mới để tạo nhóm kết quả.
5. Các khối tách ra khi học phép trừ.
6. Đáp án đúng có hiệu ứng sáng nhẹ, âm thanh xác nhận và sao.
7. Đáp án sai có rung rất nhẹ hoặc biểu cảm suy nghĩ, kèm lời khuyến khích.
8. Khi hoàn thành bài, xuất hiện confetti hoặc hiệu ứng chúc mừng ngắn.
9. Chuyển bước mượt nhưng không kéo dài làm trẻ phải chờ.

### 6.2. Nguyên tắc kỹ thuật

- Tạo animation dựa trên dữ liệu và state, không dùng delay thủ công rải rác ở nhiều component.
- Tránh tạo nhiều timer không được dọn dẹp.
- Ưu tiên transform/opacity để mượt.
- Tôn trọng `prefers-reduced-motion`.
- Có thể tắt animation hoặc giảm cường độ khi cần.
- Đảm bảo hoạt ảnh không làm mất khả năng tương tác.
- Không yêu cầu animation phải chính xác từng frame như phim hoạt hình; ưu tiên phản hồi nhanh và nhất quán.

---

## 7. Âm thanh và nhạc nền

### 7.1. Các lớp âm thanh

**Nhạc nền**
- Nhạc instrumental vui vẻ, nhịp vừa phải, phù hợp môi trường học tập.
- Âm lượng nhỏ hơn hiệu ứng và giọng hướng dẫn.
- Có nút bật/tắt nhạc.
- Có thể thiết kế nhạc nền/âm thanh mở đầu tự phát khi trình duyệt và môi trường cho phép; nếu trình duyệt chặn autoplay thì tự chuyển sang trạng thái chờ hoặc hiện nút phát rõ ràng. Không để lỗi autoplay làm hỏng trải nghiệm.
- Không bắt buộc có file nhạc thật trong bản đầu nếu chưa có tài nguyên được cấp phép.

**Hiệu ứng âm thanh**
- `pop`: khối xuất hiện.
- `merge`: các khối ghép.
- `split`: các khối tách.
- `correct`: đáp án đúng.
- `tryAgain`: khuyến khích thử lại.
- `complete`: hoàn thành bài.
- `star`: nhận sao.

Nếu chưa có file âm thanh, tạo hiệu ứng đơn giản bằng Web Audio API. Âm thanh tổng hợp nên ngắn, êm, dễ chịu; tránh âm quá lớn, sắc hoặc giật mình.

**Giọng hướng dẫn**
- Trong MVP, có thể dùng text hiển thị trước.
- Không bắt buộc triển khai text-to-speech nếu làm phức tạp.
- Nếu có dùng Web Speech API, cần kiểm tra khả năng hỗ trợ giọng tiếng Việt và cho phép tắt.
- Không giả vờ rằng đã có giọng thu âm thật khi chỉ hiển thị text.

### 7.2. Kiến trúc audio

Tạo một service tập trung, ví dụ `src/services/audioService.ts`, chịu trách nhiệm:

- Bật/tắt nhạc nền.
- Bật/tắt hiệu ứng.
- Phát các sound effect.
- Điều chỉnh âm lượng.
- Khởi tạo AudioContext sau tương tác của người dùng.
- Dọn dẹp tài nguyên nếu cần.

Không gọi trực tiếp Web Audio API ở nhiều component.

### 7.3. Nguồn nhạc

Không tải, trích xuất hoặc tái sử dụng nhạc, bài hát, giọng đọc hay âm thanh từ video Numberblocks. Chỉ sử dụng audio tự tạo hoặc tài nguyên có giấy phép sử dụng rõ ràng. Nếu chưa có nhạc, bản demo vẫn phải hoạt động với hiệu ứng âm thanh tổng hợp và nút bật/tắt.

---

## 8. Cấu trúc trang và luồng người dùng

### 8.1. Trang chủ

Mục tiêu: trẻ hiểu ngay đây là nơi học toán và có thể bắt đầu.

Nội dung:
- Logo/tên dự án nguyên bản, ví dụ **Khối Số Vui Nhộn**.
- Lời chào ngắn.
- Một nhân vật khối số đang vẫy tay hoặc nhún nhảy.
- Nút chính “Bắt đầu học”.
- Nút “Chọn bài học”.
- Khu vực thể hiện tổng sao hoặc tiến độ.
- Nút cài đặt âm thanh.
- Trang trí vui tươi, nền sáng, không nhồi quá nhiều thông tin.

### 8.2. Bản đồ học tập

- Chia bài thành các chặng.
- Hiển thị tên chặng, mô tả ngắn và các bài bên trong.
- Mỗi bài có trạng thái: chưa học, đang học hoặc hoàn thành.
- Hiển thị sao đã nhận.
- Bài chưa mở không được gây nhầm lẫn; nếu có khóa bài thì giải thích rõ. Trong MVP, có thể cho phép truy cập tất cả bài để dễ thử nghiệm.
- Có nút quay về trang chủ.

### 8.3. Màn hình học bài

Bố cục gợi ý:

- Thanh trên: nút quay lại, tên bài, tiến độ, nút âm thanh.
- Khu vực chính: nhân vật khối số, thao tác hoặc câu hỏi.
- Khu vực hướng dẫn: câu hướng dẫn ngắn bằng tiếng Việt.
- Khu vực điều khiển: “Tiếp tục”, “Kiểm tra”, “Thử lại”.
- Không hiển thị quá nhiều nút cùng lúc.
- Kích thước nhân vật lớn, dễ nhìn.

### 8.4. Màn hình kết thúc bài

- Hiển thị lời chúc mừng.
- Số câu đúng.
- Số sao nhận được.
- Nút “Học lại”.
- Nút “Bài tiếp theo”.
- Nút “Về bản đồ bài học”.
- Phát âm thanh chúc mừng nếu hiệu ứng được bật.

### 8.5. Trang thành tích

- Tổng số sao.
- Số bài đã hoàn thành.
- Danh sách huy hiệu đơn giản.
- Không cần thống kê phức tạp.
- Dữ liệu đọc từ localStorage.

---

## 9. Chương trình học cố định cho bản demo

Tạo dữ liệu bài học trong `src/data/mockData.ts`. Không viết nội dung bài học rải rác trong component giao diện.

MVP nên có 3 chặng và 14 bài. Mỗi bài gồm phần giới thiệu, ít nhất một hoạt động tương tác và phần kiểm tra. Không cần tất cả bài có cơ chế hoàn toàn khác nhau; có thể dùng lại các loại hoạt động nhưng phải thay đổi dữ liệu và mục tiêu học tập.

### Chặng 1 — Khám phá các con số

**Bài 1: Xin chào các khối số**
- Làm quen với số 1, 2, 3.
- Nhấn vào nhân vật để xem từng khối.
- Đếm số khối hiển thị.

**Bài 2: Khám phá số 4 và 5**
- Hiển thị nhóm 4 và 5 khối.
- Đếm từng khối.
- Chọn nhân vật có 5 khối.

**Bài 3: Cùng đếm từ 1 đến 5**
- Đếm đồ vật hoặc khối.
- Chọn đáp án theo số lượng.

**Bài 4: Khám phá số 6 đến 10**
- Hiển thị số 6, 7, 8, 9, 10.
- Nhận biết số lượng.
- Chọn nhóm có số lượng được yêu cầu.

**Bài 5: Số và số lượng — ai nhiều hơn?**
- Ghép số với nhóm khối tương ứng bằng kéo-thả.
- Hiển thị hai nhóm khối để trẻ so sánh: nhóm nào nhiều hơn, ít hơn hay bằng nhau?
- Dùng dấu `>`, `<`, `=` như phần mở rộng trực quan; với trẻ nhỏ, ưu tiên câu hỏi “bên nào nhiều hơn?” trước khi giới thiệu ký hiệu.
- Có thể đặt hai nhóm lên hai đĩa cân hoặc bập bênh để thể hiện số lượng.

### Chặng 2 — Ghép và tách số

**Bài 6: Số 5 được tạo thành — cân bằng nào!**
- Cho thấy số 5 có 5 khối đơn vị; trẻ chạm từng khối để đếm.
- Chia 5 khối lên hai bên bập bênh/cân, thử các cách 1–4 và 2–3.
- Cho trẻ dự đoán bên nào nặng hơn, rồi quan sát bập bênh nghiêng về phía có nhiều khối hơn.
- Thử hai bên có số khối bằng nhau để bập bênh cân bằng.
- Dùng mô hình đơn giản: mỗi khối đơn vị có cùng trọng lượng; không mô phỏng vật lý phức tạp.

**Bài 7: Ghép 2 và 3**
- Hoạt ảnh hai nhóm ghép thành 5.
- Câu hỏi: 2 + 3 bằng mấy?

**Bài 8: Tách số 5**
- Tách 5 thành hai nhóm nhỏ.
- Ví dụ 2 và 3, hoặc 1 và 4.
- Trẻ cần nhận biết tổng vẫn là 5.

**Bài 9: Tạo số 10**
- Cho thử nhiều cách ghép nhóm thành 10.
- Ví dụ 5 + 5, 6 + 4, 7 + 3.
- Không cần giải thích quá trừu tượng.

### Chặng 3 — Cộng và trừ vui nhộn

**Bài 10: Thêm một khối — người bạn mới đến**
- Nhìn nhóm 3, một nhân vật khối đơn vị nhảy vào để thành 4.
- Hiểu ý nghĩa “thêm một” qua hoạt ảnh và đếm lại từ đầu.
- Có thể chọn số kết quả hoặc kéo khối đơn vị vào nhóm.

**Bài 11: Cộng hai nhóm số — hội ngộ khối bạn bè**
- Thực hành phép cộng trong phạm vi 10 bằng cách kéo hai nhóm lại gần nhau.
- Hiển thị phép tính, animation ghép và kết quả được tạo động từ tổng số khối.
- Có các bài như 1+2, 2+4, 3+5, 6+4; xáo trộn thứ tự câu hỏi.
- Thêm chế độ “tìm nhiều cách tạo cùng một số”, ví dụ 6 = 1+5 = 2+4 = 3+3.

**Bài 12: Bớt đi một khối — một khối đi dạo**
- Từ 5 bớt 1 còn 4; khối được chọn di chuyển ra ngoài thay vì biến mất đột ngột.
- Đếm số khối còn lại và chọn kết quả.
- Có thể mở rộng thành “bớt đi 2” hoặc “còn lại bao nhiêu?” trong phạm vi 10.

**Bài 13: Tách một nhóm — tìm bạn cùng số**
- Tách một nhóm thành hai nhóm nhỏ bằng kéo-thả hoặc chọn điểm tách.
- Hỏi số lượng mỗi nhóm, số lượng còn lại hoặc cách tạo ra tổng ban đầu.
- Kết hợp thử thách bập bênh: tìm cách đặt khối để hai bên cân bằng.
- Giới thiệu quy luật đơn giản, ví dụ 1, 2, 3, __ hoặc xếp khối theo màu/hình để trẻ tìm phần tiếp theo.

**Bài 14: Thử thách cộng trừ**
- Câu hỏi trộn cộng/trừ trong phạm vi 10.
- Tổng kết, trao sao và khuyến khích học lại.

### 9.0. Thư viện hoạt động tương tác nên có

Hãy xây dựng các loại hoạt động có thể tái sử dụng để mỗi bài không chỉ là câu hỏi trắc nghiệm. MVP vẫn giữ 3 chặng, 14 bài; hãy phân bổ những loại hoạt động sau vào các bài phù hợp:

1. **Ghép khối:** kéo hai nhóm lại gần nhau; từng khối di chuyển và xếp lại thành tổng mới.
2. **Tách khối:** kéo một hoặc nhiều khối ra khỏi nhóm để minh họa phép trừ hoặc cách phân tích một số.
3. **Bập bênh so sánh:** đặt các nhóm khối lên hai đầu bập bênh. Bên nhiều khối hơn hạ xuống; hai bên bằng nhau thì cân bằng. Hỏi “bên nào nhiều hơn?”, “bên nào ít hơn?”, “làm sao để cân bằng?”.
4. **Tìm số còn thiếu:** hiển thị `3 + ? = 7` hoặc `8 - ? = 5`; trẻ thêm/bớt khối để tìm đáp án.
5. **Chọn cách tạo số:** cho một số đích, ví dụ 8, và yêu cầu tạo số đó bằng hai nhóm khác nhau.
6. **Đếm và chạm:** chạm từng khối để đếm tuần tự, có hiệu ứng đánh dấu khối đang đếm.
7. **So sánh nhóm:** chọn nhóm lớn hơn/nhỏ hơn/bằng nhau; có thể dùng ký hiệu `>`, `<`, `=` sau khi trẻ hiểu trực quan.
8. **Xếp quy luật:** hoàn thành chuỗi khối theo số lượng hoặc màu sắc, chẳng hạn 1–2–1–2 hoặc 2–4–6–?.
9. **Đường đi số:** di chuyển nhân vật trên đường số để tiến lên khi cộng và lùi lại khi trừ.
10. **Thử thách tự do:** cho trẻ tự kéo các khối vào sân chơi, ghép/tách tùy ý và xem phép tính tương ứng cập nhật trực tiếp.

Mỗi hoạt động cần có mục tiêu học tập rõ ràng, phản hồi tức thì và không yêu cầu thao tác kéo-thả quá chính xác. Hỗ trợ cả click/tap để trẻ không bị kẹt nếu thao tác kéo trên thiết bị cảm ứng khó.

### 9.1. Cấu trúc một bài học

Mỗi bài nên có 3–6 bước, tùy độ khó:

1. `explain`: giới thiệu khái niệm.
2. `demonstrate`: minh họa bằng khối.
3. `interact`: trẻ thao tác.
4. `quiz`: trả lời câu hỏi.
5. `feedback`: phản hồi đúng/sai.
6. `complete`: tổng kết bài.

Không bắt buộc mỗi bài phải dùng đủ cả 6 loại bước, nhưng cần có ít nhất một hoạt động tương tác và một câu hỏi kiểm tra.

---

## 10. Mock data — yêu cầu bắt buộc

Tạo **một file mock data chính**:

`src/data/mockData.ts`

File này chứa toàn bộ dữ liệu tĩnh cần cho demo, bao gồm:

- Thông tin ứng dụng.
- Danh sách chặng học.
- Danh sách bài học.
- Nội dung và thứ tự các bước.
- Lời hướng dẫn.
- Dữ liệu khối số.
- Câu hỏi, đáp án và giải thích.
- Cấu hình màu nhân vật.
- Thông tin huy hiệu hoặc phần thưởng.
- Các cài đặt mặc định liên quan đến bài học nếu cần.

Có thể tạo `src/types/lesson.ts` hoặc `src/types/index.ts` cho các kiểu dữ liệu TypeScript. Tuy nhiên, dữ liệu bài học thực tế phải tập trung trong `mockData.ts`.

### 10.1. Ví dụ kiểu dữ liệu

Đây là gợi ý, Codex có thể mở rộng nhưng phải có type rõ ràng:

```ts
export type LessonStepType =
  | "explain"
  | "demonstrate"
  | "interact"
  | "quiz"
  | "complete";

export interface QuizOption {
  id: string;
  label: string;
  value: number | string;
}

export interface LessonQuestion {
  id: string;
  prompt: string;
  type: "single-choice" | "drag-drop" | "count-blocks";
  options?: QuizOption[];
  correctAnswer: number | string;
  explanation: string;
}

export interface LessonStep {
  id: string;
  type: LessonStepType;
  title: string;
  instruction: string;
  blockValues?: number[];
  question?: LessonQuestion;
}

export interface Lesson {
  id: string;
  stageId: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  steps: LessonStep[];
}
```

Lưu ý:
- Dữ liệu phải nhất quán với kiểu TypeScript.
- Không dùng `any` tùy tiện.
- Không để câu hỏi thiếu đáp án đúng.
- Không để ID bị trùng.
- Không tham chiếu tới bài học hoặc asset không tồn tại.
- Đáp án đúng phải thực sự phù hợp với nội dung câu hỏi.

### 10.2. Export từ mock data

Ví dụ:

```ts
export const appConfig = { /* ... */ };
export const numberCharacters = [ /* ... */ ];
export const learningStages = [ /* ... */ ];
export const lessons = [ /* ... */ ];
export const badges = [ /* ... */ ];
```

Nên cung cấp helper để tìm bài học theo ID nếu hữu ích, nhưng không biến mock data thành một service phức tạp.

### 10.3. Không hardcode dữ liệu trong component

Không viết riêng nội dung từng bài bên trong `LessonPage.tsx`, `QuizEngine.tsx` hoặc các component UI. Component chỉ nhận dữ liệu và render dựa trên loại bước. Nếu thêm bài học mới, lý tưởng là chỉ cần bổ sung dữ liệu trong `mockData.ts` mà không phải viết lại layout.

---

## 11. Thiết kế logic học tập

### 11.1. Lesson player

Cần quản lý:
- Bài học hiện tại.
- Bước hiện tại.
- Câu trả lời đã chọn.
- Trạng thái kiểm tra đáp án.
- Điểm/số sao.
- Trạng thái hoàn thành.
- Trạng thái animation khi chuyển bước.

Khi chuyển bài hoặc rời màn hình, cần tránh để state của bài cũ làm ảnh hưởng bài mới.

### 11.2. Kiểm tra đáp án

- Với câu hỏi chọn đáp án, kiểm tra giá trị với `correctAnswer`.
- Với kéo thả, kiểm tra phần tử được đặt đúng vùng đích hoặc đúng nhóm.
- Hiển thị phản hồi ngay sau khi trẻ xác nhận.
- Không tự động chuyển bước quá nhanh khi trẻ chưa kịp đọc phản hồi.
- Cho phép thử lại nếu trả lời sai.
- Có thể giới hạn sao tối đa theo câu hoặc theo bài, nhưng logic phải rõ ràng và nhất quán.

### 11.3. Tính sao

Đề xuất:
- Hoàn thành bài: nhận ít nhất 1 sao.
- Trả lời đúng lần đầu: có thể nhận thêm điểm thưởng.
- Tổng sao tối đa cho một bài phải được xác định rõ.
- Học lại không nên cộng vô hạn sao cho cùng một lần hoàn thành. Có thể lưu số sao tốt nhất của bài.
- Dữ liệu lưu cục bộ, không cần bảo mật hay chống gian lận cho demo.

### 11.4. Khả năng truy cập bài học

Trong bản demo, nên cho phép mở tất cả bài học để dễ kiểm thử. Trạng thái chưa học/đã học vẫn được thể hiện, nhưng không nhất thiết khóa bài phía sau.

---

## 12. Lưu tiến độ bằng localStorage

Tạo service riêng, ví dụ `src/services/progressStorage.ts`.

Cần lưu:
- Bài học đã hoàn thành.
- Sao tốt nhất cho từng bài.
- Tổng số sao.
- Bài học gần nhất.
- Cài đặt âm thanh nếu muốn.

Yêu cầu:
- Có key/version rõ ràng, ví dụ `funMathDemo.progress.v1`.
- Xử lý trường hợp JSON bị lỗi hoặc dữ liệu không đúng định dạng.
- Có giá trị mặc định khi chưa có dữ liệu.
- Có thể reset tiến độ bằng nút trong phần cài đặt, kèm xác nhận.
- Không lưu thông tin cá nhân của trẻ.
- Không giả định localStorage luôn khả dụng; xử lý lỗi theo cách an toàn nếu có thể.

---

## 13. Âm thanh: cách triển khai MVP

Tạo `src/services/audioService.ts` để quản lý âm thanh.

Các hàm gợi ý:
- `initializeAudio()`
- `playEffect(name)`
- `setEffectsEnabled(enabled)`
- `setMusicEnabled(enabled)`
- `setMasterVolume(volume)`
- `disposeAudio()`

Có thể dùng Web Audio API để tạo các âm đơn giản theo từng hiệu ứng. Nếu triển khai nhạc nền tổng hợp, tạo một loop ngắn, nhẹ nhàng và có cách dừng hoàn toàn; không để nhiều oscillator hoặc timer tiếp tục chạy khi người dùng tắt nhạc hoặc rời trang.

Ưu tiên thực tế:
1. Nút bật/tắt hiệu ứng hoạt động.
2. Có âm thanh xác nhận đúng/sai.
3. Có âm thanh khi ghép/tách.
4. Có nút bật/tắt nhạc nền.
5. Nếu chưa có file nhạc được cấp phép, có thể tạo giai điệu nền bằng Web Audio API hoặc dùng trạng thái tắt mặc định; không được giả vờ có file nhạc thật khi file không tồn tại. Có thể thử tự phát khi mở ứng dụng nếu môi trường cho phép, nhưng phải xử lý trường hợp trình duyệt chặn autoplay.

Âm thanh phải bắt đầu sau một thao tác chủ động như nhấn “Bắt đầu học”. Cần đảm bảo không bị phát chồng vô hạn và có thể tắt ngay lập tức.

---

## 14. Gợi ý cấu trúc thư mục

Cấu trúc có thể điều chỉnh theo repository hiện tại, nhưng nên tách rõ UI, data, types và services.

```text
src/
├── app/
│   ├── App.tsx
│   └── routes.tsx              # Chỉ cần nếu dùng router
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx
│   │   ├── PageContainer.tsx
│   │   └── AudioControls.tsx
│   ├── blocks/
│   │   ├── NumberBlock.tsx
│   │   ├── BlockFace.tsx
│   │   ├── NumberCharacter.tsx
│   │   ├── BlockWorkspace.tsx
│   │   └── MergeAnimation.tsx
│   ├── lessons/
│   │   ├── LessonCard.tsx
│   │   ├── LessonPlayer.tsx
│   │   ├── LessonStepRenderer.tsx
│   │   ├── QuizQuestion.tsx
│   │   └── LessonCompletion.tsx
│   └── rewards/
│       ├── StarReward.tsx
│       └── Confetti.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── LearningMapPage.tsx
│   ├── LessonPage.tsx
│   └── ProgressPage.tsx
├── data/
│   └── mockData.ts             # Nguồn dữ liệu tĩnh chính
├── hooks/
│   ├── useProgress.ts
│   └── useAudioSettings.ts
├── services/
│   ├── audioService.ts
│   └── progressStorage.ts
├── types/
│   └── lesson.ts
├── styles/
│   ├── tokens.css
│   ├── global.css
│   └── animations.css
├── utils/
│   └── lessonHelpers.ts
└── main.tsx

public/
└── audio/
    └── README.md               # Ghi chú tài nguyên âm thanh; không tạo file giả
```

Không cần tạo file rỗng chỉ để giống cấu trúc trên. Chỉ tạo những file thực sự được dùng.

---

## 15. Thiết kế giao diện chi tiết

### 15.1. Bảng màu

Dùng palette vui tươi, độ tương phản tốt. Gợi ý:

- Nền: kem sáng hoặc xanh rất nhạt.
- Primary: xanh da trời.
- Secondary: vàng ấm.
- Accent: hồng san hô, xanh lá và tím.
- Text: xanh than/đen mềm, không dùng màu chữ quá nhạt.
- Success: xanh lá.
- Feedback nhẹ: vàng cam.

Màu từng nhân vật phải có thể cấu hình trong mock data. Không buộc toàn bộ nhân vật dùng một màu duy nhất.

### 15.2. Typography

- Dùng font sans-serif tròn, dễ đọc.
- Có thể dùng font hệ thống nếu không có font local phù hợp.
- Không phụ thuộc Google Fonts để trang vẫn hoạt động offline.
- Tiêu đề rõ, chữ hướng dẫn ngắn và lớn.
- Không dùng quá nhiều kiểu chữ.

### 15.3. Nút bấm

- Nút lớn, bo góc.
- Có trạng thái hover, active, focus và disabled.
- Có phản hồi trực quan khi bấm.
- Vùng chạm phù hợp với trẻ.
- Dùng nhãn tiếng Việt ngắn, dễ hiểu.
- Không dùng icon đơn độc cho hành động quan trọng nếu không rõ nghĩa.

### 15.4. Responsive

Phải kiểm tra:
- Desktop từ 1280px trở lên.
- Tablet khoảng 768–1024px.
- Mobile khoảng 360–430px.

Không để khối bị tràn khỏi vùng hiển thị. Khu vực ghép khối cần tự co giãn hoặc cuộn hợp lý. Các nút chính phải dễ bấm trên màn hình cảm ứng.

### 15.5. Cảm giác tổng thể

Giao diện nên giống một sân chơi học toán:
- Các thẻ bài học như những tấm bảng mềm mại.
- Có hình trang trí nhỏ nhưng không che nội dung.
- Nhân vật khối số là tâm điểm.
- Các chuyển động có chủ đích.
- Tránh dashboard quản trị hoặc giao diện doanh nghiệp khô cứng.

---

## 16. Điều hướng

Có thể dùng React Router nếu dự án cần URL riêng cho từng trang. Nếu chỉ làm demo đơn giản, có thể dùng state điều hướng nhưng phải đảm bảo nút quay lại và chuyển trang hoạt động rõ ràng.

Luồng tối thiểu:

```text
Trang chủ
  ├── Bắt đầu học → Bài học gần nhất hoặc Bản đồ học tập
  ├── Chọn bài → Bản đồ học tập
  │    └── Chọn bài
  │         └── Màn hình học bài
  │              └── Tổng kết bài
  │                   ├── Học lại
  │                   ├── Bài tiếp theo
  │                   └── Bản đồ học tập
  └── Thành tích → Trang thành tích
```

Nếu dùng React Router, cần xử lý ID bài học không hợp lệ bằng trang fallback thân thiện, không để crash ứng dụng.

---

## 17. Kiểm thử và tiêu chí nghiệm thu

### 17.1. Chức năng

- [ ] Ứng dụng chạy bằng `npm run dev`.
- [ ] Build thành công bằng `npm run build`.
- [ ] Trang chủ hiển thị đúng.
- [ ] Có thể vào bản đồ học tập.
- [ ] Hiển thị đủ 3 chặng và 14 bài trong mock data.
- [ ] Có thể mở bất kỳ bài học nào.
- [ ] Chuyển bước tiến/lùi đúng.
- [ ] Khối số được sinh theo giá trị.
- [ ] Hoạt ảnh ghép/tách chạy được.
- [ ] Câu hỏi trắc nghiệm kiểm tra đáp án chính xác.
- [ ] Có ít nhất một hoạt động kéo-thả hoạt động thực tế.
- [ ] Có phản hồi đúng/sai.
- [ ] Có thể hoàn thành bài.
- [ ] Sao thưởng tính đúng và không cộng vô hạn khi học lại.
- [ ] Tiến độ còn sau khi reload.
- [ ] Có thể reset tiến độ.
- [ ] Bật/tắt hiệu ứng âm thanh hoạt động.
- [ ] Bật/tắt nhạc nền hoạt động hoặc có trạng thái giải thích rõ nếu chưa có nhạc nền.
- [ ] Không có nút chính bị bỏ trống hành vi.
- [ ] Không có lỗi console nghiêm trọng.

### 17.2. Giao diện

- [ ] Không bị tràn ngang ở mobile.
- [ ] Các khối nhìn rõ ràng, phân biệt được từng đơn vị.
- [ ] Nút bấm đủ lớn.
- [ ] Văn bản tiếng Việt hiển thị đúng dấu.
- [ ] Trạng thái đúng/sai dễ hiểu.
- [ ] Hoạt ảnh không chặn thao tác tiếp theo.
- [ ] Tôn trọng reduced-motion.
- [ ] Trạng thái âm thanh rõ ràng; nếu autoplay bị trình duyệt chặn thì có cách bật thủ công và không gây lỗi.

### 17.3. Dữ liệu

- [ ] Toàn bộ nội dung bài học nằm trong `src/data/mockData.ts`.
- [ ] Component không chứa bản sao dữ liệu bài học.
- [ ] Các ID duy nhất.
- [ ] Câu hỏi có đáp án đúng.
- [ ] Bài học có bước hợp lệ.
- [ ] Số lượng khối khớp với giá trị.
- [ ] Không có đường dẫn audio/ảnh giả gây lỗi.

### 17.4. Kiểm tra thủ công các luồng

**Luồng A: học một bài**
1. Mở trang chủ.
2. Nhấn bắt đầu học.
3. Chọn bài 1.
4. Đi qua phần giới thiệu.
5. Thực hiện hoạt động tương tác.
6. Trả lời câu hỏi.
7. Hoàn thành bài.
8. Kiểm tra số sao.

**Luồng B: lưu tiến độ**
1. Hoàn thành một bài.
2. Reload trang.
3. Mở bản đồ học tập.
4. Kiểm tra bài đã hoàn thành và sao.
5. Reset tiến độ và xác nhận dữ liệu trở về mặc định.

**Luồng C: âm thanh**
1. Bật hiệu ứng.
2. Thao tác ghép khối.
3. Kiểm tra hiệu ứng phát.
4. Tắt hiệu ứng.
5. Thao tác lại và xác nhận không còn hiệu ứng.
6. Kiểm tra nhạc nền không tự phát khi chưa có tương tác.

**Luồng D: responsive**
1. Kiểm tra desktop.
2. Thu nhỏ viewport về tablet.
3. Thu nhỏ về mobile.
4. Kiểm tra khối, câu hỏi và nút điều khiển không bị cắt hoặc chồng lấn.

---

## 18. Hiệu năng và chất lượng mã

- Dùng TypeScript có type rõ ràng.
- Tách UI, dữ liệu và logic lưu trữ.
- Tránh component khổng lồ.
- Không dùng `any` nếu có thể định nghĩa type.
- Tránh tạo lại mảng hoặc callback phức tạp không cần thiết trong các vùng animation.
- Dùng key ổn định khi render list.
- Dọn dẹp audio node, event listener và timer.
- Tránh phát âm thanh lặp liên tục khi component render.
- Không cần tối ưu hóa quá sớm, nhưng phải giữ code dễ mở rộng.
- Không tải thư viện hoặc asset từ xa khi không cần.
- Không để console có warning nghiêm trọng.
- Không sử dụng dữ liệu thật hoặc thông tin cá nhân của trẻ.

---

## 19. Các bước triển khai được khuyến nghị

Codex nên triển khai theo thứ tự:

### Giai đoạn A — Khảo sát và nền tảng
1. Kiểm tra repository.
2. Xác nhận React + TypeScript + Vite.
3. Cấu hình lint/build nếu cần.
4. Tạo design tokens và global styles.
5. Tạo type cho dữ liệu bài học.

### Giai đoạn B — Mock data
1. Tạo `src/data/mockData.ts`.
2. Khai báo 3 chặng và 14 bài.
3. Tạo các câu hỏi hợp lệ.
4. Kiểm tra ID và đáp án.
5. Đảm bảo mọi component có thể đọc nội dung từ file này.

### Giai đoạn C — Khối số
1. Xây `NumberBlock`.
2. Xây `BlockFace`.
3. Xây `NumberCharacter`.
4. Tạo quy tắc bố trí khối.
5. Tạo hoạt ảnh ghép/tách.
6. Kiểm tra số từ 1 đến 10 ở các kích thước viewport.

### Giai đoạn D — Luồng học tập
1. Trang chủ.
2. Bản đồ học tập.
3. Lesson player.
4. Render các loại bước từ mock data.
5. Câu hỏi và phản hồi.
6. Màn hình tổng kết.

### Giai đoạn E — Tiến độ và âm thanh
1. `progressStorage`.
2. Hook quản lý tiến độ.
3. Sao và huy hiệu.
4. `audioService`.
5. Điều khiển âm lượng và trạng thái audio.
6. Kiểm tra lưu tiến độ và bật/tắt audio.

### Giai đoạn F — Hoàn thiện
1. Responsive.
2. Reduced motion.
3. Empty/error/fallback states.
4. Kiểm thử các luồng chính.
5. Chạy build.
6. Cập nhật hướng dẫn trong README của dự án.

---

## 20. Kết quả Codex cần bàn giao

Sau khi hoàn thành, hãy báo cáo ngắn gọn:

1. Các chức năng đã làm.
2. Cấu trúc thư mục chính.
3. Vị trí file mock data.
4. Các lệnh chạy dự án.
5. Kết quả `npm run build`.
6. Các kiểm thử đã thực sự chạy.
7. Những phần còn thiếu hoặc đang dùng mock/synthetic audio.
8. Cách thêm một bài học mới chỉ bằng cách sửa mock data.

Không được khẳng định nhạc nền thật, giọng đọc thật hoặc asset đồ họa bên ngoài đã có nếu thực tế chưa được thêm vào.

---

## 21. Definition of Done

Bản demo hoàn thành khi:

- Chạy được trên máy local bằng React + TypeScript + Vite.
- Có giao diện tiếng Việt hoàn chỉnh.
- Có trang chủ, bản đồ học tập, bài học, tổng kết và thành tích.
- Có 3 chặng và 14 bài học cố định được nạp từ mock data.
- Khối số được vẽ từ component tái sử dụng.
- Có tương tác ghép/tách khối thật, không chỉ là ảnh minh họa.
- Có câu hỏi, kiểm tra đáp án, phản hồi và phần thưởng.
- Có tiến độ lưu bằng localStorage.
- Có điều khiển âm thanh.
- Có hiệu ứng âm thanh hợp lệ; nhạc nền được xử lý đúng nếu có tài nguyên.
- Responsive cho desktop, tablet và mobile.
- Không phụ thuộc backend/API.
- Build thành công.
- Không dùng Tailwind CSS hoặc Bootstrap.
- Không sao chép tài sản có bản quyền của Numberblocks.

**Ưu tiên số một:** làm cho một bài học mẫu (đặc biệt bài 2 + 3 = 5) thật vui, trực quan và mượt mà trước; sau đó dùng cùng hệ thống component và mock data để hoàn thiện các bài còn lại.

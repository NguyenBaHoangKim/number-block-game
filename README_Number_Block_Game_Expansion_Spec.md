# NUMBER BLOCK GAME --- README ĐẶC TẢ MỞ RỘNG

Tài liệu này là đặc tả sản phẩm và hướng dẫn triển khai cho game học
toán tương tác dành cho trẻ em, sử dụng React + TypeScript + Vite. Mục
tiêu là mở rộng nội dung hiện có thành chương trình nhiều thế giới,
nhiều dạng bài, có dữ liệu câu hỏi tái sử dụng và UI thân thiện với trẻ.

## 1. Định hướng sản phẩm

### 1.1. Đối tượng và mục tiêu

-   Đối tượng chính: trẻ khoảng 4--8 tuổi; điều chỉnh theo năng lực thực
    tế, không khóa cứng theo tuổi.
-   Học bằng cách chạm, kéo, ghép, tách, sắp xếp, quan sát và giải quyết
    tình huống.
-   Chuyển kiến thức trừu tượng thành vật thể, nhân vật và câu chuyện
    trực quan.
-   Mỗi bài cần có mục tiêu học tập rõ ràng, phản hồi tích cực và cơ hội
    thử lại.

### 1.2. Nguyên tắc

1.  Ưu tiên thao tác trực quan hơn câu hỏi chữ.
2.  Một nhiệm vụ chính tại một thời điểm.
3.  Sai là cơ hội học: không mắng, không làm trẻ xấu hổ, không trừ điểm
    nặng.
4.  Tăng độ khó từng bước; không đồng thời tăng phạm vi số, số lựa chọn
    và số bước.
5.  Cho phép nhiều cách giải nếu toán học cho phép.
6.  Không bắt buộc âm thanh để hiểu bài; luôn có điều khiển tắt tiếng.
7.  Đồng hồ đếm ngược mặc định tắt.
8.  Thiết kế cho chuột, cảm ứng và bàn phím ở những hoạt động phù hợp.

### 1.3. Tính nguyên bản

Có thể lấy cảm hứng từ phương pháp dạy toán trực quan bằng các khối số,
nhưng nhân vật, tên gọi, tạo hình, lời thoại, nhạc, âm thanh, hoạt ảnh
và nhận diện phải nguyên bản. Không sao chép tài sản hoặc đặc điểm nhận
diện của thương hiệu có bản quyền.

## 2. Luồng trải nghiệm

1.  Màn hình chào: tên game, Bắt đầu, Cài đặt âm thanh.
2.  Bản đồ 8 thế giới: mỗi thế giới là một vùng đất có phong cách riêng.
3.  Trang thế giới: các bài học được thể hiện như điểm đến/nhiệm vụ.
4.  Giới thiệu bài: một nhân vật nói hoặc minh họa mục tiêu bằng 1--2
    câu ngắn.
5.  Màn chơi: hướng dẫn, vùng tương tác, phản hồi và gợi ý.
6.  Kết quả: ghi nhận nỗ lực, kỹ năng vừa luyện, nút Chơi tiếp/Thử lại.
7.  Tổng kết thế giới: tiến trình, nội dung cần luyện và phần thưởng
    trang trí.

Luôn có nút quay lại bản đồ, tạm dừng và phát lại hướng dẫn. Không tự
chuyển màn quá nhanh. Có thể lưu trạng thái lượt chơi khi tạm dừng.

## 3. UI/UX dành cho trẻ em

### 3.1. Phong cách hình ảnh

-   Hoạt hình 2D/2.5D, khối bo tròn, viền rõ, bóng mềm, biểu cảm thân
    thiện.
-   Màu tươi sáng nhưng không dùng neon chói phủ toàn màn hình.
-   Mỗi thế giới có bảng màu riêng; component và nút dùng chung design
    system.
-   Nhân vật có mắt, miệng, tư thế và biểu cảm rõ ràng.
-   Hình trang trí không được cạnh tranh với câu hỏi; ưu tiên sân chơi
    rộng.
-   Không dùng màu sắc làm tín hiệu duy nhất: thêm hình dạng, biểu
    tượng, nhãn hoặc họa tiết.

### 3.2. Kích thước và tương tác

-   Vùng chạm tối thiểu khoảng 48×48 CSS px; ưu tiên lớn hơn với trẻ
    nhỏ.
-   Nút cách nhau đủ xa, không đặt nút điều hướng sát vùng kéo thả.
-   Vật thể có vùng bắt kéo lớn hơn hình vẽ thực tế.
-   Mọi thao tác kéo thả nên có phương án thay thế: chạm vật → chạm vị
    trí đích.
-   Có nút hoàn tác/làm lại ở hoạt động xây dựng, ghép hình và vẽ đường.
-   Responsive cho điện thoại, tablet, laptop và desktop; ưu tiên
    tablet/điện thoại ngang khi sân chơi cần chiều rộng.

### 3.3. Chữ và hướng dẫn

-   Font sans-serif tròn, dễ đọc, hỗ trợ tiếng Việt.
-   Hướng dẫn ngắn, một câu, dùng từ quen thuộc; cỡ chữ lớn.
-   Cấp đầu kết hợp chữ, số và hình minh họa.
-   Không dùng đoạn văn dài trong màn chơi.
-   TTS tiếng Việt là bổ trợ, không phải điều kiện hoàn thành bài.
-   Có nút đọc lại; không phát chồng nhiều câu thoại.

### 3.4. Chuyển động và phản hồi

-   Hoạt ảnh có mục đích: nảy nhẹ khi chạm, trượt khi kéo, nhập lại khi
    cộng, tách ra khi trừ.
-   Thời lượng thao tác thường 150--450 ms; hoạt ảnh hoàn thành có thể
    dài hơn nhưng có thể bỏ qua.
-   Tránh nhấp nháy nhanh, rung liên tục hoặc chuyển động gây chóng mặt.
-   Đúng: nhân vật vui, vật thể phản hồi, lời khen đa dạng.
-   Sai: không có âm thanh thất bại gay gắt; làm nổi bật điểm cần xem
    lại và gợi ý.
-   Hỗ trợ `prefers-reduced-motion`.

### 3.5. Âm thanh và khả năng tiếp cận

-   Điều khiển riêng nhạc nền, hiệu ứng và giọng đọc.
-   Không phát âm thanh lớn bất ngờ; xử lý trường hợp browser chặn
    autoplay.
-   Có thể lưu lựa chọn âm thanh trong localStorage.
-   Có focus state, `aria-label` cho nút icon và điều hướng bàn phím phù
    hợp.
-   Không giới hạn thời gian trong bài học cơ bản.
-   Không phụ thuộc màu sắc duy nhất để phân biệt lựa chọn.

### 3.6. Bố cục màn chơi tham khảo

``` text
┌──────────────────────────────────────────────┐
│ ← Bản đồ      Khu vườn số       ● ● ○ ○  🔊 │
│                                              │
│       “Hãy giúp bạn thỏ tìm 5 củ cà rốt!”    │
│                                              │
│              [ 🥕  🥕  🥕 ]                  │
│                                              │
│       Kéo thêm cà rốt vào giỏ cho đủ 5       │
│                                              │
│       [ 🥕 ] [ 🥕 ] [ 🥕 ]                   │
│                                              │
│   [Gợi ý 💡]              [Kiểm tra ✓]       │
└──────────────────────────────────────────────┘
```

Đây chỉ là gợi ý. Mỗi dạng bài được phép thay đổi bố cục để phù hợp nội
dung.

## 4. Hệ thống độ khó

  -----------------------------------------------------------------------
  Mức                     Tên                     Đặc điểm
  ----------------------- ----------------------- -----------------------
  1                       Làm quen                Phạm vi nhỏ, ít lựa
                                                  chọn, hướng dẫn từng
                                                  bước, có mô hình trực
                                                  quan

  2                       Nhận biết               Ghép cặp, phân loại,
                                                  nhận dạng; giảm dần gợi
                                                  ý

  3                       Thực hành               Tự thao tác, phạm vi số
                                                  lớn hơn, nhiều câu liên
                                                  tiếp

  4                       Vận dụng                Bài toán ngữ cảnh,
                                                  nhiều bước, có thể có
                                                  nhiều cách giải

  5                       Thử thách               Điều kiện kết hợp, suy
                                                  luận và chiến lược
  -----------------------------------------------------------------------

Điều chỉnh từng yếu tố một. Nếu sai liên tiếp, giảm độ khó hoặc đưa mô
hình trực quan. Nếu đúng ổn định, tăng thử thách nhẹ. Không gắn nhãn
tiêu cực cho trẻ.

## 5. Danh mục 67 dạng bài tập

Mỗi dạng cần có: mục tiêu học tập, luật chơi, dữ liệu câu hỏi,
validator, gợi ý, feedback đúng/sai, trạng thái hoàn thành và test. Tên
tiếng Anh trong ngoặc là `exerciseType` đề xuất.

### A. 15 dạng hiện có

**1. Chạm để đếm (`tap_counting`)** - Mục tiêu: đếm từng vật đúng một
lần, hiểu thứ tự số. - Cách chơi: chạm từng vật thể; vật đã chạm đổi
trạng thái hoặc chuyển vào giỏ. - Ví dụ: chạm 5 con bướm; đọc "một, hai,
ba, bốn, năm". - Kiểm tra: số vật duy nhất đã chạm bằng số cần đếm; chạm
lại không tăng bộ đếm. - UI: vùng chạm lớn, số đếm rõ, nút đếm lại.

**2. Ghép số với số lượng (`match_number_quantity`)** - Mục tiêu: liên
hệ ký hiệu số với lượng. - Cách chơi: kéo nhóm vật thể vào số hoặc chạm
số rồi chạm nhóm. - Ví dụ: ghép số 5 với nhóm 5 khối. - Kiểm tra: đếm
phần tử trong nhóm và so với target. - UI: 2--4 nhóm cách xa nhau; dùng
khối, chấm hoặc đồ vật.

**3. Ghép khối để cộng (`block_addition`)** - Mục tiêu: hiểu cộng là gộp
nhóm. - Cách chơi: kéo hai nhóm lại gần, hai nhóm kết hợp thành một. -
Ví dụ: 2 khối + 3 khối = 5. - Kiểm tra: `a + b === answer`. - UI: hoạt
ảnh nhóm tiến lại và kết hợp, hiển thị biểu thức sau thao tác.

**4. Tách khối để trừ (`block_subtraction`)** - Mục tiêu: hiểu trừ là
lấy bớt khỏi một nhóm. - Cách chơi: kéo/chạm số khối cần lấy ra; nhóm
còn lại được đếm. - Ví dụ: 5 − 2 còn 3. - Kiểm tra:
`total - removed === answer`; không lấy nhiều hơn tổng. - UI: phần bị
lấy ra nằm ở khu riêng, phần còn lại vẫn hiển thị.

**5. So sánh bằng bập bênh (`seesaw_compare`)** - Mục tiêu: so sánh hai
lượng và hiểu \>, \<, =. - Cách chơi: quan sát hai nhóm trên bập bênh
rồi chọn ký hiệu. - Ví dụ: 4 khối và 6 khối. - Kiểm tra: so sánh số phần
tử. - UI: bập bênh chuyển động nhẹ; có lựa chọn ký hiệu và lời đọc.

**6. Tìm số còn thiếu (`missing_number`)** - Mục tiêu: hiểu quan hệ giữa
các số trong phép tính. - Cách chơi: điền ô trống bằng chạm chọn hoặc
nhập số. - Ví dụ: `3 + ? = 7`. - Kiểm tra: tính biểu thức bằng kiểu
number. - UI: ô trống lớn, cấp đầu có 2--4 đáp án.

**7. Hoàn thành quy luật số (`number_pattern`)** - Mục tiêu: nhận biết
quy luật tăng/giảm. - Cách chơi: chọn phần tử tiếp theo của chuỗi. - Ví
dụ: `1, 2, 3, ?` hoặc `2, 4, 6, ?`. - Kiểm tra: rule được khai báo rõ,
tránh câu hỏi có nhiều đáp án hợp lý nhưng chỉ chấp nhận một. - UI: thẻ
số rời, làm nổi bật bước nhảy.

**8. Đi trên đường số (`number_line`)** - Mục tiêu: hiểu thứ tự và
khoảng cách. - Cách chơi: di chuyển nhân vật từng bước trên đường số. -
Ví dụ: từ 3 tiến 1 bước đến 4. - Kiểm tra: vị trí cuối bằng vị trí đầu
cộng số bước có dấu. - UI: vạch lớn, có thể chạm số đích thay vì kéo
chính xác.

**9. Nhìn nhanh và nhớ số lượng (`quick_subitizing`)** - Mục tiêu: nhận
ra lượng nhỏ mà không đếm từng vật. - Cách chơi: hiện chấm/khối trong
thời gian ngắn, che lại rồi hỏi số lượng. - Ví dụ: nhìn nhanh 4 chấm rồi
chọn 4. - Kiểm tra: đáp án bằng số phần tử. - UI: thời gian hiển thị
điều chỉnh được; có chế độ không giới hạn.

**10. Chẵn và lẻ (`odd_even_pairs`)** - Mục tiêu: hiểu số chẵn ghép hết
thành cặp, số lẻ dư một. - Cách chơi: ghép vật thể thành từng cặp. - Ví
dụ: 7 khối tạo 3 cặp và dư 1. - Kiểm tra: `n % 2 === 0`. - UI: xếp cặp
thành hàng, không chỉ hỏi thuộc lòng.

**11. Nhóm bằng nhau / nhân (`equal_groups_multiplication`)** - Mục
tiêu: hiểu số nhóm × số phần tử mỗi nhóm. - Cách chơi: tạo các nhóm có
số phần tử bằng nhau rồi đếm tổng. - Ví dụ: 3 luống, mỗi luống 2 bông
hoa → 3 × 2 = 6. - Kiểm tra: `groups * itemsPerGroup`. - UI: nhóm có
ranh giới rõ, có thể chuyển thành mảng hàng/cột.

**12. Chia đều (`equal_sharing_division`)** - Mục tiêu: hiểu chia là
phân phối đều. - Cách chơi: kéo lần lượt vật thể vào các nhân vật/giỏ. -
Ví dụ: chia 6 bánh cho 3 bạn, mỗi bạn 2. - Kiểm tra: bài chia hết dùng
`total % recipients === 0`; bài chia dư phải được khai báo riêng. - UI:
phân phối từng vật theo vòng.

**13. Nhận biết hình học (`shape_recognition`)** - Mục tiêu: nhận biết
hình và đặc điểm. - Cách chơi: chọn hình phù hợp hoặc tìm hình trong
cảnh. - Ví dụ: chọn tam giác làm mái nhà, nhận biết 3 cạnh. - Kiểm tra:
shape ID và thuộc tính. - UI: hình lớn, viền rõ; có thể xoay hình.

**14. Xây cầu theo nhiệm vụ (`bridge_building`)** - Mục tiêu: vận dụng
đếm, cộng/trừ và ước lượng. - Cách chơi: thêm số khối còn thiếu để nối
hai bờ. - Ví dụ: cầu cần 7 khối, hiện có 5, thêm 2. - Kiểm tra: tổng
khối bằng mục tiêu và cầu nối được. - UI: cầu tiến triển theo từng khối,
có gợi ý khoảng trống.

**15. Xem giờ đúng (`tell_time_hour`)** - Mục tiêu: đọc giờ đúng trên
đồng hồ kim. - Cách chơi: xoay kim hoặc chọn giờ tương ứng. - Ví dụ: kim
phút ở 12, kim giờ ở 3 → 3 giờ. - Kiểm tra: lưu giờ/phút riêng; cấp đầu
chỉ phút = 0. - UI: đồng hồ lớn, kim giờ và kim phút khác độ dài/màu.

### B. Nhận thức số và tư duy số học

**16. Điền bảng Ten Frame (`ten_frame_completion`)** --- Bảng 2×5 ô, một
số ô có khối; bé điền ô trống hoặc chọn số còn thiếu. Ví dụ 7/10 ô, cần
thêm 3. Validator: `capacity - occupied`. UI: ô lớn, lấp đầy từ trái
sang phải.

**17. Tìm các cách tạo thành một số (`number_bonds`)** --- Cho tổng mục
tiêu, bé tìm các cặp phần. Ví dụ tạo 6 bằng 1+5, 2+4, 3+3. Validator:
tổng hai phần bằng target, không ghi nhận nghiệm trùng. UI: sơ đồ
phần--phần--tổng.

**18. Số nào gần mục tiêu hơn (`closest_to_target`)** --- Chọn số có
khoảng cách tuyệt đối nhỏ hơn tới target. Ví dụ target 8, chọn giữa 5 và
7. Validator: so sánh `abs(choice-target)`. UI: đường số hỗ trợ giải
thích.

**19. Tìm số đứng trước và sau (`before_after_number`)** --- Điền số
trước/sau số trung tâm. Ví dụ `_ 6 _` → 5 và 7. Validator: `n-1`, `n+1`,
xử lý giới hạn phạm vi. UI: ba ô lớn trên đường số.

**20. Số liền kề và khoảng cách (`number_distance`)** --- Đếm số bước
giữa hai số trên đường số. Ví dụ từ 3 đến 7 có 4 bước. Validator:
`abs(a-b)`. UI: tô các đoạn giữa vạch để phân biệt số điểm và số bước.

### C. Phép tính và tư duy logic

**21. Chọn phép tính đúng (`choose_equation`)** --- Chuyển câu chuyện
thành biểu thức. Ví dụ 3 táo thêm 2 táo → `3 + 2`. Kiểm tra phép tính
khớp thao tác thêm/bớt/gộp. UI: tranh trên, 2--3 thẻ biểu thức dưới.

**22. Tìm dấu phép tính (`operator_missing`)** --- Điền +, −, × hoặc ÷
vào biểu thức. Ví dụ `3 ? 2 = 5`. Chỉ đưa phép toán đã học. UI: dấu là
nút lớn.

**23. Tìm lỗi sai (`spot_math_error`)** --- Nhân vật đưa phép tính sai;
bé phát hiện và sửa. Ví dụ `2 + 3 = 6`. Validator ghi rõ sai ở toán
hạng, dấu hay kết quả. UI: nhân vật tò mò, không bị chế giễu; giải thích
bằng khối.

**24. Cân bằng hai vế (`equation_balance`)** --- Điền số để hai vế bằng
nhau. Ví dụ `3 + 2 = ? + 1`. Validator: giá trị hai vế bằng nhau. UI:
cân thăng bằng khi đúng.

**25. Nhiều cách giải (`multiple_solutions`)** --- Tìm nhiều biểu thức
tạo cùng kết quả. Ví dụ tạo 10 bằng 1+9, 2+8, 3+7. Validator loại nghiệm
trùng và xác định số nghiệm cần tìm. UI: sưu tập thẻ nghiệm.

**26. Tính ngược (`reverse_calculation`)** --- Từ kết quả suy luận toán
hạng hoặc biểu thức. Ví dụ chọn phép tính tạo ra 8. Validator theo điều
kiện câu hỏi. UI: hộp/máy bí mật, gợi ý từng bước.

**27. Chuỗi phép tính (`calculation_chain`)** --- Đi qua chuỗi cổng phép
tính. Ví dụ 1 → +2 → +3 → 6. Validator tính tuần tự. UI: đường ray, hiện
kết quả sau mỗi bước.

**28. Máy biến đổi số (`number_machine`)** --- Đưa số vào máy và áp dụng
quy tắc. Ví dụ máy +2, đầu vào 3, đầu ra 5. Validator áp dụng rule
function. UI: cửa vào, bánh răng, cửa ra.

**29. Chọn kết quả gần đúng (`estimation`)** --- Chọn khoảng kết quả hợp
lý trước khi tính chính xác. Ví dụ 19+21 gần 40 hay 80. Validator theo
ngưỡng được khai báo. UI: thang số hoặc khoảng giá trị.

**30. Mê cung phép tính (`math_maze`)** --- Chọn đường qua các ô có kết
quả đúng. Ví dụ chỉ đi qua ô có kết quả bằng 5. Validator kiểm tra đường
hợp lệ và tránh nhiều lời giải ngoài dự kiến. UI: mê cung đơn giản, ô
lớn, có gợi ý.

### D. Hình học và không gian

**31. Ghép hình Tangram (`tangram`)** --- Kéo các mảnh vào bóng đổ để
tạo hình. Ví dụ ghép mái nhà. Validator kiểm tra vị trí/góc xoay với
dung sai. UI: mảnh lớn, nút xoay, gợi ý đường viền.

**32. Xây hình từ các khối (`shape_construction`)** --- Dùng các khối để
dựng hình mẫu. Ví dụ tạo chữ nhật từ hai hình vuông. Validator kiểm tra
loại, số lượng và cấu trúc. UI: mẫu cạnh vùng xây, có hoàn tác.

**33. Tìm nửa còn lại (`symmetry_completion`)** --- Hoàn thành hình đối
xứng qua trục. Ví dụ con bướm. Validator kiểm tra vị trí phản chiếu. UI:
trục nổi bật, lưới hỗ trợ.

**34. Nhận biết hình 3D (`solid_shapes`)** --- Phân biệt cầu, lập
phương, hộp chữ nhật, trụ, nón; ghép vật thật với khối. UI: vật thể xoay
chậm, có nhãn và ví dụ.

**35. Điều khiển nhân vật (`spatial_navigation`)** --- Chọn
trái/phải/lên/xuống để tới đích. Ví dụ đi phải 2 ô, lên 1 ô. Validator
tọa độ và chướng ngại. UI: lưới lớn, mũi tên to, hoàn tác.

**36. Sao chép công trình (`copy_structure`)** --- Quan sát mẫu rồi dựng
lại. Ví dụ tháp 3 khối theo màu/vị trí. Validator số khối, vị trí, cấu
trúc. UI: cấp dễ giữ mẫu hiện, cấp khó mới ẩn.

### E. Đo lường và toán học thực tế

**37. Đo chiều dài (`length_measurement`)** --- Xếp khối liên tiếp dọc
vật cần đo. Ví dụ bút dài 5 khối. Validator không có khoảng trống/chồng
lấn. UI: điểm đầu/cuối rõ.

**38. Đo chiều cao (`height_measurement`)** --- Xếp khối cạnh vật thể để
đo. Ví dụ tháp cao 6 khối. Validator số đơn vị theo trục dọc. UI: đường
nền chung.

**39. Cân nặng (`weight_comparison`)** --- Đặt hai vật lên cân, dự đoán
nặng/nhẹ/bằng. Validator so sánh trọng lượng giả lập. UI: cân chuyển
động chậm, không suy luận khối lượng chỉ từ kích thước.

**40. Dung tích (`capacity_measurement`)** --- Đổ nước/bi vào cốc hoặc
so sánh cốc. Ví dụ cốc A 3 đơn vị, B 5. Validator so sánh
capacity/amount. UI: vạch chia rõ.

**41. Nhận biết tiền (`money_recognition`)** --- Ghép đồng tiền giả lập
với giá trị. Validator theo value; đơn vị tiền phải được khai báo rõ.
UI: tiền đồ chơi, không gây nhầm là giao dịch thật.

**42. Mua sắm (`shopping_math`)** --- Chọn món hàng, thanh toán và tính
tiền còn lại. Ví dụ có 10 xu, mua món 6 xu, còn 4. UI: quầy hàng hoạt
hình, giá rõ, không có giao dịch thật.

**43. Lịch và ngày tháng (`calendar_days`)** --- Hôm qua/hôm nay/ngày
mai, thứ tự ngày. Ví dụ hôm nay thứ Ba, ngày mai thứ Tư. Validator dùng
lịch giả lập và xử lý chuyển tuần.

**44. Đồng hồ nâng cao (`tell_time_advanced`)** --- Giờ rưỡi, giờ
hơn/kém và khoảng thời gian đơn giản. Ví dụ 3:30; từ 2 đến 4 là 2 tiếng.
Validator chuyển thời gian về phút.

### F. Tư duy logic và giải quyết vấn đề

**45. Tìm vật khác biệt (`odd_one_out`)** --- Chọn vật không cùng nhóm.
Ví dụ ba hình tròn, một hình vuông. Phải nêu tiêu chí phân loại rõ để
tránh mơ hồ.

**46. Suy luận theo gợi ý (`clue_deduction`)** --- Kết hợp gợi ý. Ví dụ
số lớn hơn 3, nhỏ hơn 6. Hỗ trợ nhiều đáp án khi câu hỏi yêu cầu tìm tất
cả.

**47. Ai đang nói đúng? (`character_claims`)** --- Hai nhân vật đưa ra
nhận định; bé chọn nhận định đúng. Validator đánh giá từng claim; nhân
vật không bị gắn nhãn xấu khi sai.

**48. Sắp xếp theo điều kiện (`conditional_sorting`)** --- Xếp số/vật
theo chiều cao, kích thước hoặc thuộc tính. UI: các bệ có thứ tự, có
hoàn tác.

**49. Tìm đường tối ưu (`shortest_path`)** --- Tìm đường tới đích ít
bước nhất, không đi xuyên vật cản. UI: mê cung nhỏ, nút thử đường và xóa
đường.

**50. Giải mã bí mật (`number_code`)** --- Mỗi biểu tượng đại diện một
số; dùng bảng mã giải thông điệp. UI: bảng mã hiển thị ở cấp dễ.

**51. Tìm quy luật ẩn (`hidden_pattern`)** --- Hoàn thành bảng dựa trên
quy luật hàng/cột. Rule phải tường minh trong dữ liệu.

**52. Bài toán nhiều điều kiện (`multi_condition_logic`)** --- Chọn
vật/số thỏa 2--3 điều kiện. Ví dụ số chẵn, lớn hơn 5, nhỏ hơn 10. UI:
điều kiện thành thẻ riêng.

### G. Phân số và chia nhóm nâng cao

**53. Chia đôi và chia tư (`fraction_partition`)** --- Chia một đơn vị
thành 2 hoặc 4 phần bằng nhau. Validator đảm bảo diện tích các phần bằng
nhau. UI: vật thể lớn, đường cắt rõ.

**54. Ghép các phần thành một hình (`fraction_composition`)** --- Ghép
hai nửa hoặc bốn phần tư thành một đơn vị. UI: mảnh có viền, tự khớp vị
trí.

**55. Mảng số (`multiplication_array`)** --- Tạo số hàng và cột. Ví dụ
3×4=12. Validator `rows * columns`. UI: lưới chấm/khối, liên hệ tổng
lặp.

**56. So sánh phân số (`fraction_compare`)** --- So sánh phần tô trên
các hình có cùng kích thước toàn thể. Ví dụ 1/2 và 1/4. UI: dùng họa
tiết/viền ngoài màu.

### H. Thống kê và dữ liệu

**57. Đếm và lập biểu đồ (`build_chart`)** --- Đếm loại đồ vật và điền
cột. Ví dụ 3 táo, 2 cam, 4 chuối. UI: biểu đồ cột ít cột, trục rõ.

**58. Đọc biểu đồ (`read_chart`)** --- Trả lời nhiều nhất/ít nhất/chênh
lệch từ biểu đồ. UI: câu hỏi ngắn, dữ liệu không quá dày.

**59. Khảo sát nhân vật (`character_survey`)** --- Thu thập sở thích
nhân vật rồi thống kê. Dữ liệu câu trả lời định trước, biểu diễn bằng
sticker.

**60. Tìm giá trị lớn nhất/nhỏ nhất (`data_extremes`)** --- Chọn
cột/nhóm lớn nhất hoặc nhỏ nhất; xử lý trường hợp bằng nhau.

**61. Dự đoán kết quả (`data_prediction`)** --- Dự đoán dựa trên dữ liệu
đã quan sát. Chỉ chấm một đáp án nếu dữ liệu đủ xác định; câu hỏi mở cần
tiêu chí riêng.

### I. Mini game sáng tạo

**62. Nhảy đúng đáp án (`answer_platform_jump`)** --- Chọn nền tảng mang
kết quả đúng để nhân vật nhảy. Ví dụ 2+3 chọn 5. Không yêu cầu phản xạ
quá nhanh; đồng hồ tùy chọn.

**63. Đoàn tàu số (`number_train`)** --- Lắp toa theo thứ tự hoặc quy
luật. Toa lớn, tự khớp khi thả gần đúng.

**64. Săn kho báu (`treasure_hunt`)** --- Giải 2--5 câu đố để lấy chìa
khóa/mảnh bản đồ. Mỗi chặng là câu hỏi độc lập; lưu tiến trình chặng.

**65. Nhà bếp toán học (`math_kitchen`)** --- Chọn nguyên liệu theo công
thức, đếm số lượng và trình tự. Ví dụ 2 trứng, 3 táo, 1 cốc sữa. Có thể
lấy lại nguyên liệu khi nhầm.

**66. Xây sở thú/thủy cung (`animal_habitat_builder`)** --- Phân loại
động vật vào khu vực và đảm bảo số lượng. UI thân thiện, không có hình
ảnh gây sợ.

**67. Phóng tên lửa (`rocket_launch_math`)** --- Hoàn thành chuỗi phép
tính để nạp năng lượng. Sai không trừ năng lượng; phóng tên lửa là phần
thưởng hoạt ảnh.

## 6. Khung chương trình 8 thế giới --- 80 bài học

Mỗi bài là một đơn vị học tập, không phải một component riêng. Một bài
nên có 5--15 câu hỏi/biến thể. Một exercise type có thể xuất hiện ở
nhiều thế giới với bối cảnh và độ khó khác nhau.

### Thế giới 1 --- Khu vườn những con số

Mục tiêu: số 0--10, đếm, ghép số-lượng, thứ tự và cấu trúc số.

  -----------------------------------------------------------------------------
  ID                Bài học           Dạng chính              Nội dung
  ----------------- ----------------- ----------------------- -----------------
  W1-L01            Làm quen với bạn  Character intro         Nhận diện nhân
                    số                                        vật và số

  W1-L02            Đếm hoa trong     tap_counting            Chạm đếm 1--5
                    vườn

  W1-L03            Tìm đúng thẻ số   match_number_quantity   Ghép số 1--5

  W1-L04            Khu vườn có bao   scene_object_counting   Đếm táo, hoa,
                    nhiêu?                                    bướm

  W1-L05            Điền bảng mười ô  ten_frame_completion    Bổ sung ô thiếu

  W1-L06            Số nào đứng cạnh? before_after_number     Số trước/sau

  W1-L07            Xếp đoàn tàu số   number_train            Xếp 1--10

  W1-L08            Số nào gần hơn?   closest_to_target       Gần mục tiêu

  W1-L09            Nhìn nhanh đoán   quick_subitizing        Nhận biết 1--5
                    số                                        chấm

  W1-L10            Ngày hội số đầu   Quick challenge         Ôn tổng hợp
                    tiên
  -----------------------------------------------------------------------------

### Thế giới 2 --- Thành phố phép cộng

Mục tiêu: gộp, tách, cộng trừ và quan hệ giữa các phần.

  --------------------------------------------------------------------------
  ID                Bài học           Dạng chính           Nội dung
  ----------------- ----------------- -------------------- -----------------
  W2-L01            Những khối kết    block_addition       Gộp nhóm
                    bạn

  W2-L02            Tách nhóm đồ chơi block_subtraction    Lấy bớt

  W2-L03            Bí mật của số 6   number_bonds         Các cặp tạo 6

  W2-L04            Cây cầu còn thiếu bridge_building      Thêm khối

  W2-L05            Ô số bí ẩn        missing_number       3+?=6

  W2-L06            Chọn phép tính    choose_equation      Tranh thành phép
                    đúng                                   tính

  W2-L07            Dấu phép tính     operator_missing     Điền + hoặc −
                    biến mất

  W2-L08            Máy biến đổi số   number_machine       Đầu vào/đầu ra

  W2-L09            Lỗi của bạn robot spot_math_error      Phát hiện sai

  W2-L10            Lễ hội phép cộng  multiple_solutions   Nhiều cách tạo
                                                           tổng
  --------------------------------------------------------------------------

### Thế giới 3 --- Vương quốc so sánh

Mục tiêu: lớn/nhỏ/bằng, khoảng cách và cân bằng.

  -------------------------------------------------------------------------------
  ID                Bài học           Dạng chính                Nội dung
  ----------------- ----------------- ------------------------- -----------------
  W3-L01            Bập bênh vui nhộn seesaw_compare            So sánh nhóm

  W3-L02            Bên nào nhiều     visual_quantity_compare   So sánh trực quan
                    hơn?

  W3-L03            Cân hai chiếc giỏ weight_comparison         Nặng/nhẹ/bằng

  W3-L04            Cân bằng phép     equation_balance          3+2=?+1
                    tính

  W3-L05            Tìm số gần đích   closest_to_target         Khoảng cách số

  W3-L06            Bao nhiêu bước ở  number_distance           Bước trên đường
                    giữa?                                       số

  W3-L07            Sắp xếp bé đến    conditional_sorting       Sắp xếp
                    lớn

  W3-L08            Chẵn hay lẻ?      odd_even_pairs            Ghép cặp

  W3-L09            Ai nói đúng?      character_claims          Kiểm tra nhận
                                                                định

  W3-L10            Nhà vô địch cân   Quick challenge           Ôn so sánh
                    bằng
  -------------------------------------------------------------------------------

### Thế giới 4 --- Đảo hình học

Mục tiêu: hình 2D/3D, cấu tạo hình, đối xứng và vị trí.

  -------------------------------------------------------------------------------
  ID                Bài học           Dạng chính            Nội dung
  ----------------- ----------------- --------------------- ---------------------
  W4-L01            Săn hình quanh    shape_recognition     Tròn, vuông, tam giác
                    đảo

  W4-L02            Xây ngôi nhà hình shape_construction    Ghép hình thành nhà
                    học

  W4-L03            Ghép tranh        tangram               Ghép hình mẫu
                    Tangram

  W4-L04            Tìm nửa còn thiếu symmetry_completion   Đối xứng

  W4-L05            Khám phá khối 3D  solid_shapes          Cầu, trụ, lập phương

  W4-L06            Đi đúng hướng     spatial_navigation    Trái/phải/lên/xuống

  W4-L07            Sao chép tòa tháp copy_structure        Dựng lại mẫu

  W4-L08            Phân loại hình    shape_sorting         Theo cạnh/loại

  W4-L09            Tìm vật khác biệt odd_one_out           Ngoại lệ

  W4-L10            Kiến trúc sư nhí  Creative challenge    Xây tự do
  -------------------------------------------------------------------------------

### Thế giới 5 --- Rừng quy luật

Mục tiêu: quy luật số, màu, hình và suy luận.

  -------------------------------------------------------------------------------
  ID                Bài học           Dạng chính              Nội dung
  ----------------- ----------------- ----------------------- -------------------
  W5-L01            Dãy số tiếp theo  number_pattern          1,2,3,?

  W5-L02            Quy luật màu sắc  color_pattern           Đỏ-vàng-đỏ-?

  W5-L03            Quy luật hình     shape_pattern           Tròn-vuông-tròn-?
                    dạng

  W5-L04            Tìm quy luật ẩn   hidden_pattern          Hoàn thành bảng

  W5-L05            Giải mã biểu      number_code             Biểu tượng thành số
                    tượng

  W5-L06            Những gợi ý bí    clue_deduction          Suy luận điều kiện
                    mật

  W5-L07            Chọn đường ngắn   shortest_path           Ít bước nhất
                    nhất

  W5-L08            Mê cung phép tính math_maze               Kết quả đúng

  W5-L09            Hai điều kiện     multi_condition_logic   Điều kiện kết hợp
                    cùng lúc

  W5-L10            Thám tử quy luật  Quick challenge         Logic tổng hợp
  -------------------------------------------------------------------------------

### Thế giới 6 --- Thành phố cuộc sống

Mục tiêu: đo lường, tiền, lịch, thời gian và dữ liệu.

  ID       Bài học                   Dạng chính             Nội dung
  -------- ------------------------- ---------------------- --------------------
  W6-L01   Đo cây bút                length_measurement     Đo bằng khối
  W6-L02   Tòa tháp cao bao nhiêu?   height_measurement     Đo chiều cao
  W6-L03   Cốc nào chứa nhiều hơn?   capacity_measurement   Dung tích
  W6-L04   Cửa hàng đồ chơi          money_recognition      Tiền giả lập
  W6-L05   Đi chợ cùng bạn           shopping_math          Tiền và tiền thừa
  W6-L06   Đồng hồ mấy giờ?          tell_time_hour         Giờ đúng
  W6-L07   Một ngày bao lâu?         calendar_days          Hôm qua/ngày mai
  W6-L08   Đồng hồ vui vẻ            tell_time_advanced     Giờ rưỡi
  W6-L09   Lập biểu đồ trái cây      build_chart            Đếm và biểu diễn
  W6-L10   Đọc biểu đồ thành phố     read_chart             Nhiều nhất/ít nhất

### Thế giới 7 --- Vùng đất phép nhân

Mục tiêu: nhóm bằng nhau, nhân, chia, phân số và mảng số.

  -----------------------------------------------------------------------------------
  ID                Bài học           Dạng chính                    Nội dung
  ----------------- ----------------- ----------------------------- -----------------
  W7-L01            Những nhóm bằng   equal_groups_multiplication   3 nhóm, mỗi nhóm
                    nhau                                            2

  W7-L02            Mảng khối kỳ diệu multiplication_array          3×4

  W7-L03            Chia bánh cho bạn equal_sharing_division        Chia đều

  W7-L04            Chia bánh làm đôi fraction_partition            Một nửa

  W7-L05            Ghép bánh hoàn    fraction_composition          Hai nửa thành một
                    chỉnh

  W7-L06            Phần nào lớn hơn? fraction_compare              1/2 và 1/4

  W7-L07            Chuỗi phép tính   calculation_chain             Nhiều bước

  W7-L08            Tìm phép tính     reverse_calculation           Từ kết quả
                    ngược

  W7-L09            Nhiều cách tạo số multiple_solutions            Các cách tạo 12

  W7-L10            Ngày hội chia sẻ  Quick challenge               Nhân/chia/phân số
  -----------------------------------------------------------------------------------

### Thế giới 8 --- Vũ trụ trí tuệ

Mục tiêu: kết hợp kiến thức, logic, dữ liệu và bài toán nhiều bước.

  ------------------------------------------------------------------------------
  ID                Bài học           Dạng chính               Nội dung
  ----------------- ----------------- ------------------------ -----------------
  W8-L01            Săn kho báu số    treasure_hunt            Nhiều chặng

  W8-L02            Nhà bếp toán học  math_kitchen             Theo công thức

  W8-L03            Xây sở thú        animal_habitat_builder   Phân nhóm và đếm

  W8-L04            Phóng tên lửa     rocket_launch_math       Nạp năng lượng

  W8-L05            Khảo sát sở thích character_survey         Thu thập dữ liệu

  W8-L06            Ai nhiều nhất?    data_extremes            Max/min

  W8-L07            Dự đoán từ biểu   data_prediction          Dự đoán có căn cứ
                    đồ

  W8-L08            Thử thách nhiều   multi_condition_logic    Suy luận kết hợp
                    điều kiện

  W8-L09            Hành trình tối ưu shortest_path            Lập kế hoạch

  W8-L10            Nhà thám hiểm     Final challenge          Tổng hợp
                    toán học
  ------------------------------------------------------------------------------

**Lưu ý curriculum:** `scene_object_counting`,
`visual_quantity_compare`, `color_pattern`, `shape_pattern`,
`shape_sorting` là các biến thể có thể cần type riêng. Nếu curriculum
tham chiếu chúng, phải đăng ký handler; không để lesson trỏ tới type
chưa triển khai. Một bài có thể có 5--15 câu. Bài giới thiệu không nhất
thiết chấm điểm.

## 7. Chế độ bổ trợ

### 7.1. Giới thiệu nhân vật

-   Nhân vật có tên nguyên bản, số đại diện (nếu có), màu, hình dáng và
    tính cách.
-   Hoạt ảnh chào hỏi; lời giới thiệu tối đa 1--2 câu.
-   Có bỏ qua/phát lại; không sao chép nhân vật có bản quyền.

### 7.2. Sân chơi tự do

-   Thêm/xóa khối; ghép/tách nhóm; đổi màu; xếp chồng; tạo hàng/cột.
-   Cân hai bên, đưa khối lên đường số.
-   Hoàn tác, làm lại, xóa sân.
-   Không chấm điểm; cho phép thử nghiệm tự do.

### 7.3. Thử thách nhanh

-   Mặc định 5 câu; tùy chọn 5/10/15.
-   Đồng hồ tùy chọn, mặc định tắt.
-   Câu hỏi từ kỹ năng đã mở khóa hoặc chủ đề được chọn.
-   Tổng kết số câu hoàn thành, kỹ năng tốt và gợi ý luyện; không trừ
    điểm vì sai.

### 7.4. Nhiệm vụ hằng ngày

-   3 nhiệm vụ ngắn, tổng thời lượng mục tiêu 3--5 phút.
-   Luân phiên kỹ năng; không phạt khi bỏ lỡ ngày.
-   Bản không backend có thể tạo nhiệm vụ theo ngày trên thiết bị.

### 7.5. Bộ sưu tập và huy hiệu

-   Huy hiệu theo kỹ năng/nỗ lực: người bạn biết đếm, nhà xây dựng, thám
    tử quy luật.
-   Phần thưởng trang trí: sticker, nền, phụ kiện nhân vật.
-   Không yêu cầu xem quảng cáo để mở khóa bài học; không bán vật phẩm
    cho trẻ trong phiên bản cơ bản.

### 7.6. Sổ tay toán học

-   Ghi nhận kỹ năng đã khám phá, ví dụ minh họa và nút thử lại.
-   Hiển thị tiến trình tích cực, không dán nhãn năng lực tiêu cực.

## 8. Kiến trúc React + TypeScript đề xuất

### 8.1. Nguyên tắc

Không tạo component riêng cho từng lesson. Tách dữ liệu curriculum, dữ
liệu câu hỏi, exercise registry, game engine, UI dùng chung và progress
store.

### 8.2. Cấu trúc thư mục gợi ý

``` text
src/
├── app/                  # App, routes, providers
├── components/
│   ├── character/
│   ├── game/             # Header, instruction, feedback, progress
│   ├── ui/
│   └── layout/
├── features/
│   ├── worlds/
│   ├── lessons/
│   ├── exercises/
│   │   ├── registry.ts
│   │   ├── shared/
│   │   ├── counting/
│   │   ├── arithmetic/
│   │   ├── geometry/
│   │   ├── measurement/
│   │   ├── logic/
│   │   ├── fractions/
│   │   ├── data/
│   │   └── minigames/
│   ├── free-play/
│   ├── quick-challenge/
│   ├── collection/
│   └── progress/
├── data/
│   ├── worlds.ts
│   ├── lessons/
│   ├── questions/
│   └── characters.ts
├── hooks/
├── services/
│   ├── audio/
│   ├── speech/
│   └── storage/
├── types/
└── utils/
```

Điều chỉnh theo source hiện tại; không di chuyển toàn bộ project nếu
không cần.

### 8.3. TypeScript model nền

``` ts
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type ExerciseType =
  | "tap_counting"
  | "match_number_quantity"
  | "block_addition"
  | "block_subtraction"
  | "seesaw_compare"
  | "missing_number"
  | "number_pattern"
  | "number_line"
  | "quick_subitizing"
  | "odd_even_pairs"
  | "equal_groups_multiplication"
  | "equal_sharing_division"
  | "shape_recognition"
  | "bridge_building"
  | "tell_time_hour"
  | "ten_frame_completion"
  | "number_bonds"
  | "closest_to_target"
  | "before_after_number"
  | "number_distance"
  | "choose_equation"
  | "operator_missing"
  | "spot_math_error"
  | "equation_balance"
  | "multiple_solutions"
  | "reverse_calculation"
  | "calculation_chain"
  | "number_machine"
  | "estimation"
  | "math_maze"
  | "tangram"
  | "shape_construction"
  | "symmetry_completion"
  | "solid_shapes"
  | "spatial_navigation"
  | "copy_structure"
  | "length_measurement"
  | "height_measurement"
  | "weight_comparison"
  | "capacity_measurement"
  | "money_recognition"
  | "shopping_math"
  | "calendar_days"
  | "tell_time_advanced"
  | "odd_one_out"
  | "clue_deduction"
  | "character_claims"
  | "conditional_sorting"
  | "shortest_path"
  | "number_code"
  | "hidden_pattern"
  | "multi_condition_logic"
  | "fraction_partition"
  | "fraction_composition"
  | "multiplication_array"
  | "fraction_compare"
  | "build_chart"
  | "read_chart"
  | "character_survey"
  | "data_extremes"
  | "data_prediction"
  | "answer_platform_jump"
  | "number_train"
  | "treasure_hunt"
  | "math_kitchen"
  | "animal_habitat_builder"
  | "rocket_launch_math";

export interface World {
  id: string;
  title: string;
  description: string;
  theme: string;
  order: number;
  lessonIds: string[];
}

export interface Lesson {
  id: string;
  worldId: string;
  title: string;
  description: string;
  learningObjectives: string[];
  exerciseType: ExerciseType;
  difficulty: Difficulty;
  estimatedMinutes: number;
  questionIds: string[];
  prerequisites?: string[];
}

export interface Question<TPayload = Record<string, unknown>> {
  id: string;
  lessonId: string;
  type: ExerciseType;
  difficulty: Difficulty;
  instruction: string;
  hint?: string;
  payload: TPayload;
  explanation?: string;
}
```

Đây là schema khởi đầu. Nên định nghĩa payload riêng cho từng exercise
type bằng discriminated union/generic; tránh `any` trong logic nghiệp
vụ.

### 8.4. Registry

``` tsx
type ExerciseResult = {
  correct: boolean;
  answer?: unknown;
  attempts: number;
  durationMs?: number;
};

type ExerciseProps<TPayload> = {
  question: Question<TPayload>;
  onAnswer: (result: ExerciseResult) => void;
  onHint: () => void;
  disabled?: boolean;
};

// Ví dụ minh họa; trong code thực tế dùng kiểu component cụ thể,
// không dùng any cho toàn bộ registry.
const exerciseRegistry = {
  tap_counting: TapCountingExercise,
  match_number_quantity: MatchNumberQuantityExercise,
  block_addition: BlockAdditionExercise,
  block_subtraction: BlockSubtractionExercise,
};
```

Khi curriculum tham chiếu type chưa có handler, cần báo lỗi lúc
build/test thay vì để màn hình trắng.

### 8.5. Ví dụ dữ liệu

``` ts
const question = {
  id: "w1-l03-q01",
  lessonId: "W1-L03",
  type: "match_number_quantity",
  difficulty: 1,
  instruction: "Hãy chọn nhóm có 5 khối nhé!",
  hint: "Con thử đếm từng khối trong mỗi nhóm.",
  payload: {
    groups: [3, 5, 4],
    target: 5
  },
  explanation: "Nhóm này có đúng 5 khối."
} satisfies Question<{
  groups: number[];
  target: number;
}>;
```

### 8.6. Quy tắc validator và sinh câu hỏi

-   Logic chấm đáp án độc lập UI.
-   Dùng number cho phép tính, không so sánh biểu thức bằng chuỗi.
-   Câu có nhiều đáp án đúng phải khai báo rõ.
-   Drag-and-drop có dung sai hoặc snap target.
-   Thao tác chưa hoàn tất không được tính là sai.
-   Khóa submit trong lúc feedback để tránh gửi nhiều lần.
-   Sinh câu hỏi phải tôn trọng phạm vi số, kiến thức đã học, không tạo
    phép trừ âm/chia dư nếu chưa dạy.
-   Đáp án nhiễu không được trùng đáp án đúng.
-   Có seed để tái hiện lỗi câu hỏi ngẫu nhiên.
-   Tránh lặp cùng mẫu liên tiếp.

## 9. Tiến độ và phần thưởng

-   Hoàn thành bài khi đã thử đủ lượt hoặc đạt mục tiêu; không bắt buộc
    đúng tuyệt đối.
-   Ghi nhận số lần thử và mức gợi ý riêng, không dùng để làm trẻ xấu
    hổ.
-   Sao dựa trên hoàn thành/nỗ lực, không chỉ tốc độ.
-   Không trừ sao vì sai; không dùng leaderboard công khai cho trẻ nhỏ.
-   Phần thưởng nên là sticker, nền, phụ kiện nhân vật.
-   Có nút chơi lại mà không làm mất tiến trình đã ghi nhận.

### Hệ thống gợi ý

1.  Nhắc lại mục tiêu.
2.  Gợi ý hướng quan sát.
3.  Hiển thị mô hình một phần.
4.  Làm mẫu một bước rồi để trẻ tự hoàn thành.

## 10. Lưu tiến trình và quyền riêng tư

### Phiên bản đầu

-   Dùng localStorage/IndexedDB cho cài đặt, tiến trình và vật phẩm mở
    khóa.
-   Có thể chơi không cần đăng nhập.
-   Không thu thập tên thật, email, vị trí hoặc thông tin nhạy cảm của
    trẻ.
-   Có nút xóa tiến trình trong cài đặt dành cho người lớn.
-   Không gửi hành vi lên server nếu chưa có nhu cầu và thông báo phù
    hợp.

### Khi có backend

-   Chỉ thu thập dữ liệu tối thiểu.
-   Xem xét quy định quyền riêng tư áp dụng cho trẻ em.
-   Không để API key/mật khẩu trong frontend hoặc repository.
-   Không triển khai quảng cáo theo dõi trẻ.

## 11. Hiệu năng và tương thích

-   Dùng SVG/CSS/React để tạo khối, biểu cảm và vật thể đơn giản; ưu
    tiên vector.
-   Lazy-load thế giới chưa mở; tối ưu ảnh và âm thanh.
-   Tránh render lại toàn bộ sân chơi khi một vật thể di chuyển.
-   Dùng pointer events hoặc thư viện drag-and-drop hỗ trợ touch.
-   Kiểm tra Safari iOS, Chrome Android, Chrome/Edge desktop và Safari
    macOS.
-   Xử lý autoplay bị browser chặn.
-   Nếu dùng Web Speech API, kiểm tra giọng `vi-VN`; có fallback
    chữ/hình.
-   Không cần backend cho bản học và lưu cục bộ; chỉ thêm khi cần đồng
    bộ, tài khoản hoặc quản trị nội dung.

## 12. Kiểm thử và nghiệm thu

### Mỗi exercise type

-   Test đáp án đúng và sai.
-   Test biên: nhỏ nhất/lớn nhất, bằng nhau, nhóm rỗng nếu hợp lệ.
-   Test gợi ý, làm lại và submit nhiều lần.
-   Test cảm ứng/pointer.
-   Test layout màn hình nhỏ.
-   Test validator độc lập UI.

### Curriculum

-   ID world/lesson/question duy nhất.
-   Mỗi lesson tham chiếu world tồn tại.
-   Mỗi lesson có mục tiêu và câu hỏi.
-   Mọi exercise type trong curriculum có handler.
-   Điều kiện mở khóa không tạo vòng phụ thuộc.
-   Tổng blueprint là 80 bài.

### UI trẻ em

-   Trẻ hiểu mục tiêu mà không cần đọc đoạn dài.
-   Nút đủ lớn, có khoảng cách.
-   Chơi được bằng cảm ứng.
-   Sai không gây cảm giác bị phạt.
-   Có thể tắt tiếng/giảm chuyển động.
-   Không có đồng hồ bắt buộc ở bài cơ bản.
-   Không phụ thuộc màu duy nhất.

### Definition of Done

Một tính năng chỉ hoàn thành khi có luật chơi, dữ liệu mẫu ít nhất 3 mức
độ phù hợp, trạng thái
idle/interaction/correct/incorrect/hint/completed, feedback thị giác và
văn bản, responsive, test validator, không lỗi console nghiêm trọng, âm
thanh tắt được và tài sản hình ảnh nguyên bản.

## 13. Roadmap

**Phase 1 --- Củng cố hiện tại** - Kiểm kê 15 dạng và 24 bài. - Chuẩn
hóa question data và registry. - Bổ sung biến thể câu hỏi. - Hoàn thiện
responsive, feedback, âm thanh, lưu tiến trình.

**Phase 2 --- Số học và logic** - Triển khai type 16--30: Ten Frame,
number bonds, số trước/sau, khoảng cách, phép tính, tìm lỗi, cân bằng,
máy biến đổi, tính ngược.

**Phase 3 --- Hình học và đo lường** - Triển khai type 31--44: Tangram,
đối xứng, hình 3D, điều hướng, đo, tiền, lịch, đồng hồ.

**Phase 4 --- Logic nâng cao, phân số và dữ liệu** - Triển khai type
45--61.

**Phase 5 --- Mini game và thế giới** - Triển khai type 62--67, bản đồ 8
thế giới, phần thưởng, bộ sưu tập và sổ tay.

**Phase 6 --- Hoàn thiện** - Thử nghiệm có người lớn giám sát, điều
chỉnh độ khó, tối ưu thiết bị di động và hiệu năng.

## 14. Hướng dẫn cho Codex

### Quy tắc

1.  Đọc source hiện tại trước khi sửa.
2.  Giữ tính năng đang hoạt động; không viết lại toàn bộ project.
3.  Không tự thêm TailwindCSS, Bootstrap hoặc UI framework khác nếu
    project chưa dùng.
4.  Dùng React + TypeScript, hạn chế `any`.
5.  Không tạo 67 component trùng lặp; tái sử dụng engine và shared
    components.
6.  Tách nội dung khỏi logic; câu hỏi là data-driven.
7.  Mỗi type có renderer/handler và validator riêng.
8.  Chạy build/test sau từng phase.
9.  Không giả định asset, font, audio hoặc API đã tồn tại.
10. Ưu tiên SVG/CSS nguyên bản; không dùng asset có bản quyền.
11. Âm thanh có nút điều khiển, không phụ thuộc autoplay.
12. Không đổi dependency/build config nếu không cần.

### Prompt mẫu

``` text
Đọc README đặc tả Number Block Game và kiểm tra source code hiện tại trước khi sửa.

Triển khai Phase [N] trong roadmap, chỉ trong phạm vi được yêu cầu:
- Giữ nguyên các tính năng hiện tại.
- Dùng React + TypeScript và data-driven exercise registry.
- UI thân thiện với trẻ 4–8 tuổi: hình minh họa lớn, nút lớn, hướng dẫn ngắn, feedback tích cực, responsive và thao tác cảm ứng.
- Không dùng TailwindCSS/Bootstrap hoặc thêm UI framework mới.
- Không sao chép nhân vật/asset có bản quyền.
- Có câu hỏi mẫu ở nhiều mức độ.
- Viết test cho validator và các trường hợp đúng/sai.
- Chạy build và test, sửa lỗi phát sinh.
- Báo cáo file thêm/sửa, tính năng hoàn thành, giới hạn và cách kiểm tra thủ công.

Không triển khai phase khác ngoài phạm vi yêu cầu.
```

## 15. Ưu tiên cuối cùng

Không cần hoàn thành cả 67 dạng ngay lập tức. Thứ tự có giá trị nhất: 1.
Làm 15 dạng hiện tại mượt và có nhiều câu hỏi. 2. Bổ sung dạng mới tạo
ra cách tư duy khác biệt. 3. Xây 8 thế giới tạo hành trình học tập. 4.
Thêm nhân vật, phần thưởng và mini game. 5. Kiểm thử với trẻ để điều
chỉnh độ khó và cách hướng dẫn.

**Thành công không nằm ở số lượng câu hỏi, mà ở việc trẻ hiểu ý tưởng
toán học, tự thao tác để khám phá và muốn thử thêm.**

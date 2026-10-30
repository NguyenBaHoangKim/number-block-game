# Đảo Khối Số

Web học toán tiếng Việt bằng nhân vật SVG nguyên bản. React + TypeScript + Vite, CSS thuần; không backend.

**Đọc toàn bộ trạng thái, kiến trúc, 67 dạng bài, cách kiểm tra và deploy trong [README_PROJECT_HANDOFF.md](README_PROJECT_HANDOFF.md).** Đặc tả gốc: [README_Number_Block_Game_Expansion_Spec.md](README_Number_Block_Game_Expansion_Spec.md).

- Giữ 24 bài cũ; thêm 8 thế giới / 80 bài / 800 câu có seed.
- 67 dạng bài dùng 9 engine tương tác; đếm, ghép/tách, Tangram, đo, logic, phân số, biểu đồ và mini game.
- Có luyện thích ứng, nhiệm vụ ngày, sổ tay, bộ sưu tập, gợi ý, lưu tiến trình cục bộ.
- Sân chơi có hoàn tác/chạm chuyển khối; thử thách 5/10/15 câu, đồng hồ tùy chọn.
- 186 MP3, nhạc/hiệu ứng có thể tắt. Câu mới dùng hướng dẫn chung theo engine, chưa đọc trọn từng câu.

Dùng Node 24:

```sh
npm ci
npm run dev
npm run build
npm run lint
npm test
```

Mở `/#worlds` cho hành trình mới; `/#map` cho 24 bài gốc. Test mặc định cần Google Chrome. Test cảm ứng mô phỏng:

```sh
npx playwright install webkit
npm run test:mobile
```

Vercel đã có cấu hình: `npm ci` → `npm run build` → `dist`, không cần biến môi trường. Phiên bản source hiện tại: **1.0.2**, hiển thị ở cuối trang. Chưa thử nghiệm với trẻ hoặc trên điện thoại thật; trạng thái deploy kiểm tra trong dashboard Vercel.

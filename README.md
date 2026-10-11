# HÀNH TRÌNH XÂY DỰNG ƯỚC MƠ
> *“Hiểu mình hôm nay – Kiến tạo ngày mai”*

Ứng dụng web tự đánh giá tâm lý giáo dục dành cho học sinh trung học phổ thông, tái tạo hoàn chỉnh dựa trên ứng dụng tham chiếu https://charming-figolla-d50bb4.netlify.app/ và tài liệu hồ sơ 55 trang ảnh chụp.

---

## I. TỔNG QUAN VÀ TÍNH NĂNG CHÍNH

1. **Hiển thị từng trang chuẩn xác (Single-Screen Viewport)**:
   - Mỗi màn hình chỉ xuất hiện 1 trang duy nhất, vừa vặn khung nhìn, không hiển thị thanh cuộn trình duyệt.
   - Hỗ trợ chuyển đổi nhanh 2 chế độ hiển thị:
     - **[ 16:9 — Ngang ]**: Tối ưu máy tính, máy chiếu lớp học, màn hình rộng.
     - **[ 9:16 — Dọc ]**: Tối ưu điện thoại di động và màn hình dọc.
2. **Quy định font chữ bắt buộc**:
   - Sử dụng chính xác font **Times New Roman** (`"Times New Roman", Times, Georgia, serif`) cho toàn bộ ứng dụng.
3. **Màn hình chào mừng (Welcome Screen)**:
   - Minh họa hoàng hôn thành phố (twilight sky, ánh vàng chân trời, các tòa nhà chọc trời và hình bóng học sinh hướng về tương lai).
   - Nút bật/tắt âm thanh hoạt động với Web Audio API (âm hưởng ambient êm dịu, không tải file ngoài).
   - Nút quản trị viên (Admin) kín đáo và tinh tế.
4. **Màn hình giới thiệu (Intro Screen)**:
   - Tiến trình 3 bước (Giới thiệu, Trả lời, Kết quả).
   - 3 thẻ năng lực: **Sự bền bỉ (Grit)**, **Mục đích sống (Purpose)**, **Tự kiểm soát (Self-Control)**.
   - Hộp lưu ý thân thiện cho học sinh.
5. **Khảo sát 24 câu hỏi chuẩn xác (Survey Screen)**:
   - Hiển thị từng câu một (Câu 1/24 đến 24/24) với thanh tiến trình xanh và phần trăm tương ứng (4% đến 100%).
   - 5 mức độ lựa chọn với hiệu ứng chọn nền hồng pastel, viền hồng và số thứ tự nổi bật.
   - Lưu trữ trạng thái câu trả lời khi quay lại (`← Câu trước`).
6. **Câu hỏi bổ sung không tính điểm (Supplemental Screen)**:
   - Đánh giá giai đoạn hiện tại của học sinh trong hành trình ước mơ (4 lựa chọn).
7. **Báo cáo kết quả cá nhân hóa (Result Screen)**:
   - Đồng hồ đo bán nguyệt (Semicircular Gauge) hiển thị **Chỉ số hành trình** (thang điểm 0–100).
   - 3 thẻ điểm thành phần: Sự bền bỉ, Mục đích sống, Tự kiểm soát.
   - **Tab 1: Tổng quan**: Nhận xét tổng hợp khích lệ theo điểm số thực tế.
   - **Tab 2: Chi tiết**: Điểm số và thanh tiến trình của 8 phân nhóm.
   - **Tab 3: Gợi ý**: Lời khuyên cụ thể cho điểm nổi bật và điểm cần bồi đắp.
   - **Tab 4: Lời nhắn**: Học sinh viết cam kết thực hiện trong 7 ngày tới.
8. **Xuất báo cáo PDF chuẩn A4**:
   - Chức năng in/lưu PDF thực sự bằng stylesheet in ấn tiêu chuẩn, giữ nguyên font tiếng Việt, biểu đồ, và ẩn các nút điều hướng.
9. **Khu vực Quản trị Admin**:
   - Đăng nhập bảo mật ở phía máy chủ với tài khoản: `0985581681` và mật khẩu khởi tạo: `thptvtt`.
   - Quản lý thêm, sửa, xóa, sao chép, đổi thứ tự, bật/tắt đảo điểm, xuất/nhập JSON/CSV và khôi phục 24 câu mặc định.
10. **Bảo mật và tính riêng tư**:
   - Câu trả lời của học sinh chỉ lưu trên thiết bị của học sinh (client-side), **hoàn toàn không gửi dữ liệu cá nhân lên máy chủ**.

---

## II. HỆ THỐNG TÍNH ĐIỂM CHUẨN XÁC

- **Điểm lựa chọn raw**: 1 đến 5.
- **Đảo điểm** (Câu 3 và Câu 18):
  $$\text{Điểm điều chỉnh} = 6 - \text{Điểm lựa chọn}$$
- **Chuẩn hóa thang điểm 100**:
  $$\text{Điểm câu} = \frac{\text{Điểm điều chỉnh} - 1}{4} \times 100$$
  *(Lựa chọn 1: 0đ | 2: 25đ | 3: 50đ | 4: 75đ | 5: 100đ)*
- **Điểm 3 nhóm chính**: Trung bình cộng điểm của 8 câu thuộc nhóm:
  - **Sự bền bỉ (Grit)**: Câu 1–8.
  - **Mục đích sống (Purpose)**: Câu 9–16.
  - **Tự kiểm soát (Self-Control)**: Câu 17–24.
- **Chỉ số hành trình tổng hợp**:
  $$\text{Chỉ số tổng hợp} = \frac{\text{Grit} + \text{Purpose} + \text{Self-Control}}{3}$$
- **8 phân nhóm chi tiết**:
  - *Grit*: Bền bỉ của hứng thú (Câu 1–4), Kiên trì nỗ lực (Câu 5–8).
  - *Purpose*: Khám phá định hướng (Câu 10, 12, 16), Cảm nhận ý nghĩa (Câu 9, 11, 13), Đóng góp cho người khác (Câu 14, 15).
  - *Self-Control*: Thực hiện nhiệm vụ (Câu 17, 21, 22), Lập kế hoạch (Câu 19, 24), Điều chỉnh phản ứng (Câu 18, 20, 23).

---

## III. HƯỚNG DẪN CHẠY THỬ VÀ PHÁT TRIỂN

### 1. Cài đặt và chạy cục bộ (Local Development)
```bash
# Cài đặt thư viện
npm install

# Khởi chạy server phát triển (Port 3000)
npm run dev
```

Truy cập: `http://localhost:3000`

### 2. Biên dịch Production
```bash
npm run build
npm start
```

---

## IV. HƯỚNG DẪN TRIỂN KHAI LÊN NETLIFY

### Cách 1: Triển khai Static Web App (Nếu chạy phía máy khách hoàn toàn)
1. Kết nối kho lưu trữ Git với Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Cấu hình file `netlify.toml` chuyển hướng SPA:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Cách 2: Triển khai Full-stack (Bao gồm Backend Admin API)
1. Sử dụng **Netlify Functions** để ánh xạ các route `/api/admin/*` và `/api/questions`.
2. Thiết lập Environment Variables trong Netlify Dashboard:
   - `ADMIN_USERNAME`: `0985581681`
   - `ADMIN_PASSWORD`: `<Mật khẩu bí mật của bạn>`
3. Dữ liệu cấu hình câu hỏi có thể kết nối với Supabase hoặc Netlify Blobs để lưu trữ đám mây dùng chung.

---

## V. NỘI DUNG ĐÃ KIỂM THỬ

- [x] Giao diện trang bìa đúng màu sắc, bảng màu pastel, hình minh họa hoàng hôn và thành phố.
- [x] Font chữ Times New Roman áp dụng toàn diện trên tất cả các thành phần.
- [x] Bộ chuyển đổi tỉ lệ `16:9` và `9:16` mượt mà, không làm mất tiến trình làm bài.
- [x] Âm thanh êm dịu Web Audio API hoạt động khi người dùng tương tác.
- [x] Đủ 24 câu hỏi khảo sát với thứ tự, phân nhóm và đảo điểm chính xác.
- [x] Công thức tính điểm cho ra kết quả trùng khớp 100% với số liệu mẫu PDF (79,2 / 81,3 / 87,5 / 68,8).
- [x] Đồng hồ bán nguyệt, các thanh tiến trình tiểu nhóm và gợi ý hiển thị chuẩn xác.
- [x] Tính năng lưu PDF in ra khổ A4 sạch sẽ, bỏ các nút bấm UI.
- [x] Đăng nhập Admin bảo mật phía máy chủ bằng token và mã băm SHA-256.
- [x] Quản lý câu hỏi (thêm, sửa, xóa, sắp xếp, xuất/nhập JSON/CSV, khôi phục mặc định).

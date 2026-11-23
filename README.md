# EC213 · Bài giảng đồ án CRM Biti's

Trang web bài giảng tự học cho đồ án môn EC213 (Quản trị quan hệ khách hàng), nhóm 04. Đồ án triển khai và mở rộng **Frappe CRM** cho doanh nghiệp Biti's.

Mỗi bài có ba phần, mỗi phần có trắc nghiệm:

1. **Kiến thức tổng quát:** khái niệm theo giáo trình (Prior, Buttle, Maklan, *Customer Relationship Management: Concepts, Applications and Technologies*, 5th ed.) và sách phân tích yêu cầu (Wiegers, Hokanson, *Software Requirements Essentials*).
2. **Ứng dụng trong đồ án:** cùng khái niệm đó, với số liệu và bản ghi thật của đồ án.
3. **Hiểu sâu đồ án:** làm gì, vì sao, cái nào của Frappe, cái nào của nhóm, và các câu thầy có thể hỏi.

Hiện có giai đoạn 0, 1 và 2. Các giai đoạn sau sẽ được thêm khi nhóm làm xong.

## Xem trang

- Trên GitHub Pages của repo (Settings → Pages → nhánh `main`, thư mục gốc).
- Hoặc mở `index.html` trực tiếp trong trình duyệt (không cần máy chủ).

Điểm trắc nghiệm chỉ lưu trong trình duyệt của bạn (localStorage), không gửi đi đâu.

## Thêm một bài mới

Yêu cầu: Node.js (chỉ để dựng trang; trang tạo ra là HTML tĩnh).

1. Tạo thư mục `src/<id>/` (ví dụ `src/gd3-01/`) gồm `meta.json`, `noi-dung.html`, `de.json`. Cách viết, luật nội dung và định dạng trắc nghiệm: [`tools/HUONG-DAN-VIET-BAI.md`](tools/HUONG-DAN-VIET-BAI.md).
2. Nếu là giai đoạn mới, thêm/sửa dòng của giai đoạn trong `src/groups.json`.
3. Chạy `node tools/build.js`. Lệnh này sinh `bai/<id>.html`, `assets/manifest.js` (mục lục chung) và `index.html`.
4. Thử trên trình duyệt chạy ẩn: `node tools/thu-trinh-duyet.js <id>` (cần Microsoft Edge ở đường dẫn mặc định trên Windows).
5. Commit cả `src/` lẫn các tệp sinh ra, rồi push.

## Cấu trúc

```
index.html            trang chủ (sinh ra)
bai/                  các bài (sinh ra)
assets/               site.css, site.js dùng chung; manifest.js là mục lục (sinh ra)
anh/                  ảnh dùng trong bài (sơ đồ BPMN)
src/                  nguồn từng bài + groups.json
tools/                build.js, thu-trinh-duyet.js, HUONG-DAN-VIET-BAI.md
```

## Nguồn và bản quyền

- Giáo trình và sách thuộc bản quyền của tác giả và nhà xuất bản. Repo này **không chứa bản sao**; bài giảng diễn đạt lại bằng lời của nhóm và ghi chương, trang/slide để tra lại bản gốc.
- Dữ liệu khách hàng, đơn hàng trong đồ án là **dữ liệu giả** do nhóm tạo. Thông tin về Biti's lấy từ nguồn công khai và ghi nguồn; chỗ nhóm tự đặt được đánh dấu `[GIẢ ĐỊNH]`. Đây không phải tài liệu của Biti's.
- Tài liệu Frappe, BPMN (OMG, Camunda) được trích dẫn bằng tên tài liệu và đường dẫn gốc.

## Về trắc nghiệm

Câu hỏi viết theo bộ quy tắc của nhóm (đáp án nhiễu bám lỗi hiểu nhầm có thật, mỗi câu có giải thích từng đáp án sai, có nguồn). Đề đã được kiểm tự động và giải mù (người giải không có tài liệu): lần sửa cuối vẫn còn khoảng 95% câu đoán được, chủ yếu ở phần kiến thức phổ thông và câu tính số học. Vì vậy điểm cao chưa chứng minh đã hiểu bài; hãy đọc phần giải thích cả khi chọn đúng.

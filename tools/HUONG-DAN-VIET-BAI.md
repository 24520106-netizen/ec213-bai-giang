# Hướng dẫn viết một bài (dành cho người và cho Claude)

Trang này là một site tĩnh nhiều bài. Thêm bài = tạo thư mục `src/<id>/` rồi chạy `node tools/build.js`. Không sửa `bai/`, `index.html`, `assets/manifest.js` bằng tay (chúng được sinh ra).

## Mỗi bài có 3 phần, mỗi phần có trắc nghiệm

| Phần | `id` section | Dạy gì | Ví dụ lấy từ đâu |
|---|---|---|---|
| 1. Kiến thức tổng quát | `kt` | Khái niệm **theo giáo trình/sách**, từ chỗ chưa biết gì: định nghĩa, giải thích đời thường, thuật ngữ Anh–Việt, mô hình, hiểu nhầm hay gặp. **Ví dụ ngoài đồ án** (công ty khác, tình huống chung) để tách khỏi phần 2. | Giáo trình (Prior, Buttle, Maklan, *CRM*, 5th ed.), sách Wiegers & Hokanson (*Software Requirements Essentials*), tài liệu chính thống đã tải (Frappe, BPMN) |
| 2. Ứng dụng trong đồ án | `ud` | Cùng khái niệm đó **đặt vào đồ án Biti's**: bảng "khái niệm ↔ thành phần của đồ án", số liệu thật, bản ghi thật, file thật; ví dụ đúng và ví dụ chưa đạt. | Dự án gốc `C:\Users\<tên-bạn>\Projects\EC213` |
| 3. Hiểu sâu đồ án | `da` | Làm gì, **vì sao** chọn vậy (và phương án khác đã bỏ), nằm **ở file/màn hình nào**, cái nào **của Frappe** cái nào **của nhóm**, cách tự kiểm tra, hạn chế đã biết, và 4–6 câu **"Thầy sẽ hỏi"** kèm trả lời gợi ý chỉ tới bằng chứng. | Dự án gốc |

## Cấu trúc thư mục một bài

```
src/<id>/meta.json      id, gd, thu_tu, tieu_de, tom_tat, muc_tieu_bai[], nguon[]
src/<id>/noi-dung.html  ba <section> kt, ud, da (xem mẫu bên dưới)
src/<id>/de.json        câu trắc nghiệm, định dạng skill trac-nghiem + trường "phan"
```

`meta.json`:
```json
{ "id": "gd0-01", "gd": "gd0", "thu_tu": "0.1", "tieu_de": "…", "tom_tat": "một câu",
  "muc_tieu_bai": ["Phân biệt được …", "Chỉ ra được … trong đồ án"],
  "nguon": [ { "ten": "Prior, Buttle & Maklan (2024), CRM, 5th ed.", "chi_tiet": "Chương 1, slide 3–15" } ] }
```

`noi-dung.html` (chỉ viết phần thân; build tự thêm khung trắc nghiệm cuối mỗi section):
```html
<section class="part" id="kt">
  <h2><span class="n">1</span>Kiến thức tổng quát: …</h2>
  <h3>Định nghĩa</h3> <p>…</p>
  <div class="ex"><b class="t">Ví dụ</b>…</div>
  <div class="src"><b class="t">Trong giáo trình</b>Chương 1, slide 3 …</div>
</section>
<section class="part" id="ud"> … </section>
<section class="part" id="da"> … </section>
```
Lớp CSS dùng được: `goal`, `note` (lưu ý/cách hiểu dễ nhầm), `ex` (ví dụ), `src` (trích nguồn giáo trình), `warn` (hạn chế/cảnh báo), `tablewrap` bọc `<table>`, `<details><summary>`, `<figure class="wide"><img src="../anh/…"><figcaption>`, `<small class="kh">` (giải thích ký hiệu dưới công thức), `<pre><code>`.
Ảnh chỉ lấy trong `anh/` (đường dẫn `../anh/<tên>.png`): `bpmn-chung.png`, `bpmn-chung-1.png`, `bpmn-chung-2.png`, `bpmn-dai-ly.png`, `bpmn-doi-tra.png`, `bpmn-marketing.png`, `bpmn-online.png`. Không chèn ảnh chụp màn hình có email, mật khẩu, MSSV.

## Luật nội dung

1. **Tiếng Việt, xưng "mình – bạn".** Câu ngắn. Cách nói người thật nói khi thuyết trình, không dịch máy.
2. **Bám nguồn và ghi nguồn.** Mọi định nghĩa, mô hình, số liệu của giáo trình ghi *chương* và *slide hoặc trang* (ví dụ "Chương 3, slide 7"). **Diễn đạt lại bằng lời của mình**; không chép dài. Nếu trích nguyên văn thì tối đa một trích dẫn ngắn (dưới 15 từ) mỗi mục, trong dấu ngoặc kép, có ghi nguồn. Không dán lại bảng, hình, đoạn văn của giáo trình. Điều giáo trình không nói thì **không gán cho giáo trình**; ghi "theo tài liệu Frappe (đường dẫn)" hoặc `[GIẢ ĐỊNH]` nếu nhóm tự đặt.
3. **Khái niệm nào cũng có ví dụ số.** Phép tính trong ví dụ phải tính lại bằng lệnh (`node -e` hoặc `python -c`) trước khi ghi.
4. **Không dùng khái niệm chưa dạy** trong bài. Nhắc sớm thì nói bằng lời và ghi "sẽ làm rõ ở bài …".
5. **Viết tắt ghi đủ lần đầu**, kể cả trong tiêu đề: ví dụ `SFA (Sales Force Automation – tự động hóa lực lượng bán hàng)`. Công thức có ký hiệu thì giải thích ngay dưới.
6. **Số liệu đồ án phải kiểm với tệp thật** (xem mục "Nguồn sự thật" bên dưới): không bịa, không làm tròn mà không nói. Điều nhóm tự đặt ghi `[GIẢ ĐỊNH]`. Điều chưa làm hoặc chưa kiểm ghi rõ là chưa.
7. **Phân biệt rõ "của Frappe" và "của nhóm"** ở phần 3. Phân biệt rõ "giáo trình nói" và "nhóm làm" ở phần 1 và 2.
8. **Không đưa vào site:** mật khẩu, khóa, token, địa chỉ email thật, MSSV, nội dung file `.dev-credentials.txt`, bản sao nguyên văn sách/slide.
9. Mỗi phần dài vừa phải (khoảng 700–1400 chữ), nhiều bảng và ví dụ hơn văn xuôi dài.

## Trắc nghiệm (`de.json`)

- **Bắt buộc đọc và theo skill `trac-nghiem`** (`C:\Users\<tên-bạn>\.claude\skills\trac-nghiem\SKILL.md` và `references/`): đáp án đúng không lộ qua độ dài/từ khóa/vị trí; đáp án nhiễu hao hao giống, mỗi đáp án sai gắn **nhãn lỗi hiểu nhầm thật** (`loi_sai`); mỗi mục tiêu ≥ 3 câu; không dùng "tất cả đáp án trên".
- Định dạng như `assets/de-mau.json` của skill, **thêm trường `"phan"`: `"kt"`, `"ud"` hoặc `"da"`** cho mỗi câu. `id` dạng `Q01…`. Mỗi phần **4–6 câu**, 1–2 mục tiêu mỗi phần (mỗi mục tiêu ≥ 3 câu). Một số câu `nhieu_dap_an` (2–3 đáp án đúng, thân câu ghi "chọn 2 đáp án") ở nơi hợp lý.
- Câu `kt` hỏi **hiểu và phân biệt khái niệm** (tình huống chung, không cần biết đồ án). Câu `ud` hỏi **vận dụng khái niệm vào số liệu/tình huống đồ án**. Câu `da` hỏi **vì sao/ở đâu/của ai/kiểm thế nào** (loại câu thầy hay hỏi).
- Trang hiển thị đáp án **theo thứ tự A–D như trong file** (không xáo), nên `giai_thich` được phép nhắc chữ A–D.
- Mỗi câu có `giai_thich` nêu vì sao đúng và vì sao từng đáp án sai sai, và `doan_goc` (nguồn: "Chương 3, slide 7" hoặc tên tệp của dự án).
- **Chạy script kiểm và sửa hết ERROR:** `python C:\Users\<tên-bạn>\.claude\skills\trac-nghiem\scripts\kiem-tra-de.py src/<id>/de.json` (cần `muc_tieu` ở đầu file là object mã → mô tả). Đọc từng WARN, sửa hoặc ghi lý do bỏ qua trong báo cáo.

## Kiểm trước khi báo xong

1. `node tools/build.js` không cảnh báo cho bài của bạn.
2. Thử trên trình duyệt: `node tools/thu-trinh-duyet.js <id>` (đếm câu mỗi phần, bấm thử một câu, báo lỗi console, ảnh hỏng, còn `{{`/TODO). Phải ra đúng số câu mỗi phần và "không lỗi console".
3. Không còn từ "TODO", không còn email/mật khẩu/MSSV.
4. Đối chiếu mọi số liệu đồ án với tệp nguồn.

## Nguồn sự thật

**Văn bản đã trích sẵn từ giáo trình/slide/sách** (thư mục `T`):
`T = <thư mục chứa văn bản đã trích từ giáo trình>\`
- `T\GT_ch1.txt … GT_ch14.txt`: 14 chương giáo trình *Customer Relationship Management: Concepts, Applications and Technologies*, 5th ed. (Prior, Buttle, Maklan), tiếng Anh; có dấu `=== trang k ===` (trang trong file chương).
- `T\SL_ch1.txt … SL_ch14.txt`: slide của thầy cho từng chương (`=== slide k ===`), ngắn gọn, dùng để biết thầy nhấn mạnh gì.
- `T\GT_full.txt`: cả giáo trình (373 trang).
- `T\DA_ch2.txt … DA_ch7.txt`, `T\DA_wiegers.txt`: sách *Software Requirements Essentials* (Wiegers, Hokanson), chương 2 đến 7 và toàn sách (sách làm đồ án).
- `T\BT_*.txt`, `T\SEM_*.txt`: bài tập và seminar của nhóm (tham khảo cách nhóm hiểu bài).

**Tài liệu chính thống đã tải về máy** (Frappe, BPMN, tích hợp): `C:\Users\<tên-bạn>\Projects\EC213\tai-lieu-chinh-thong\` (đọc `INDEX-TONG.md`, và `INDEX.md` trong từng thư mục `frappe`, `bpmn`, `tich-hop`, `phan-tich`). Trích dẫn bằng tên tệp và URL gốc ghi trong INDEX.

**Dự án đồ án**: `C:\Users\<tên-bạn>\Projects\EC213\`
- `PLAN.md` (kế hoạch 7 giai đoạn), `docs/phase-report.md` (nhật ký làm từng bước, **nguồn sự thật chính**), `docs/case-study-hien-chuong.md`, `docs/nghien-cuu-bitis.md`, `docs/checklist-tieu-chi.md`, `docs/ghi-chu-phan-bien-thay.md`, `docs/quy-trinh-sop.md`, `docs/ke-hoach-tinh-chinh-gd1-6.md`.
- `scripts/` (script cấu hình và chạy thử, đọc code để nói đúng chúng làm gì), `evidence/`, `mau/`, `Nop-bai/Nhóm 04 - Đồ án CRM/` (5 file `.bpmn` và Report).
- Bài giảng cũ `docs/bai-giang/gd0-chot-nen.html`, `gd1-cau-hinh-nhap-lieu.html`, `gd2-quy-trinh-bpmn.html`: **đã có nội dung tốt để tái dùng**, nhưng viết theo khuôn cũ; hãy viết lại theo khuôn mới và kiểm lại số liệu, không chép máy móc.
- Dữ liệu trực tiếp trong Frappe (đang chạy ở `http://nhom4.localhost:8000` khi bật bằng `scripts\frappe-start.ps1`) chỉ dùng khi thật cần; ưu tiên nhật ký và script.

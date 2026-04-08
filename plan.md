1. **Tạo custom CKEditor Plugin cho Media Library**
   - Viết plugin mở modal media (Media Modal), khi chọn ảnh hoặc video, chèn `<img src>` hoặc `<video src>` hoặc `<iframe src>` vào vị trí cursor.
2. **Tích hợp Plugin vào Editor component**
   - Thêm `MediaModal` component vào bên trong `Editor` hoặc gần nó (sử dụng State `isMediaModalOpen` để điều khiển).
   - Truyền `Plugin` vào cấu hình `config.plugins` và thêm icon vào `config.toolbar`.
3. **Handle media selection**
   - Lắng nghe event `onSelect` từ MediaModal. Lấy URL của media.
   - Nếu là image thì gọi `editor.model.change(writer => { const imageElement = writer.createElement('imageBlock', { src: url }); editor.model.insertContent(imageElement); })`.
   - Nếu là video thì sử dụng `mediaEmbed` hoặc một custom element.
4. **Pre-commit checks**

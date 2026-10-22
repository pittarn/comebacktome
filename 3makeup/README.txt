เว็บง้อแฟน (จดหมายถึงเธอ)

ไฟล์ทั้งหมดวางชั้นเดียว อัปขึ้น GitHub ได้เลย (เลือกทุกไฟล์ Ctrl+A แล้วลากไปวาง)

แก้ข้อความ / รูป / วิดีโอ  -> config.js
หน้าตา สี ฟอนต์            -> style.css
การทำงาน                    -> app.js (ปกติไม่ต้องแก้)

ใส่รูป:
1. ตั้งชื่อรูปเช่น 1.jpg 2.jpg ... แล้ววางข้างๆ index.html
2. ใน config.js ช่อง photos เปลี่ยน src: null เป็น src: "1.jpg"

Netlify: Build command เว้นว่าง / Publish directory "."
อย่าลืมตั้ง Project visibility เป็น Public

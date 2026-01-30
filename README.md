# Hotel Self Check-in

หน้าเว็บ Self Check-in สำหรับระบบ Hotel VMS

## การติดตั้ง

```bash
npm install
```

## การใช้งาน

```bash
npm start
```

## Environment Variables

- `PORT` - พอร์ตที่ใช้รัน server (default: 3000)
- `API_URL` - URL ของ API Server (Hotel VMS Backend)

## Deploy บน Railway

1. สร้าง project ใหม่บน Railway
2. เชื่อมต่อกับ GitHub repository นี้
3. ตั้งค่า Environment Variable:
   - `API_URL` = URL ของ API Server ที่ deploy แล้ว

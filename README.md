## Khởi tạo
```
$ git clone https://github.com/duongcongsang2000/SangKillerAPI
$ npm install

Thay đổi đường dẫn mongoose.connect('mongodb://localhost:27017/express-demo') trong file index.js thành địa chỉ mongo của VPS, tạo sẵn database trong VPS rồi thay tên express-demo thành DB mới tạo
$ npm run dev
```
## Xem Tất cả dữ liệu
```
Get method:  https://ipVps/data/readAll
response:      Toàn bộ dữ liệu trong DB
```

## Xóa dữ liệu
```
Post method:  https://ipVps/data/delete
request:     truyền vào id vd: 
{
    "id": "6342dd42f1f7720725f80be1"
}
Response: Trả về status
```

## Thêm dữ liệu
```
Post method:  https://ipVps/data/write
request:     Định dạng json vd: 
{
    "TIME": "TIME"
    "CPU": "CPU",
    "RAM": "RAM",
    "SSD": "SSD"
}
Response: Trả về dữ liệu vừa insert + status
```

## Đọc dữ liệu theo id
```
Get method:  https://ipVps/data/read?id=6342dd42f1f7720725f80be1

Response: Trả về dữ liệu theo id
```

## Sửa dữ liệu theo id
```
Post method:  https://ipVps/data/edit
request:     Định dạng json vd: 
{
    "id": "6342dd42f1f7720725f80be1",
    "newData": {"SSD": "ssd xịn"}
  
}
Response: nếu có có thay đổi thì trả về status: Modify Success + dữ liệu mới, dữ liệu ko thay đổi thì status: no data change, sai trường thì status: Field not correct
```
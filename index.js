var express = require('express')
const path = require('path');
var tools = require('./tools.js');
const knex = require('knex');              // import knex
const config = require('./knexfile.js'); // config cho database
const db = knex(config.development);        // config.development lấy database theo config
var cors = require('cors')


var port = 3000;

var app = express()


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())



var thueNop = {
    "thang1": 0,
    "thang2": 0,
    "thang3": 0,
    "thang4": 0,
    "thang5": 0,
    "thang6": 0,
    "thang7": 0,
    "thang8": 0,
    "thang9": 0,
    "thang10": 0,
    "thang11": 0,
    "thang12": 0,
}

var tongThueNopNam = 10;
var tongThueNopThang = 0;
var Nam;


var tongThueCaNam = 0;
var data = {};  // đây là thu nhập
// var thueNop = {}    // đây là thuế nộp

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
})

// get method để lấy thuế nộp 
app.get('/getThueNop', function (req, res) {
    console.log("Sendding thue nop")
    // res.send("<p>some</p>");

    res.send(thueNop);
})

// get method để lấy thuế nộp 
app.get('/getThueNopThem', function (req, res) {
    console.log("Sendding thue nop")

    var ThueNopThem = {
        'ThueCaNam': tongThueNopNam,
        'ThueDaNop': tongThueNopThang,
    }

    res.send(ThueNopThem);
})


// get method để gửi thu Nhập
app.get('/getThuNhap', function (req, res) {
    console.log("Sendding thu nhap")
    res.send(data);
})

app.get('/getThuNhapThem', function (req, res) {            // Them số năm vào đây
    console.log("Sendding thu nhap")

    var dataNam = {"Nam": Nam};

    res.send(dataNam);
})


// thông tin lương của id truyền vào
app.get('/getThuNhap/:id', function (req, res) {
    var idRequest = req.params.id;
    console.log(idRequest)
    
    db('BangLuong')
    .where("TTidLuong",idRequest)
    .select("thang1","thang2",'thang3',"thang4","thang5",
    'thang6', "thang7","thang8",'thang9',"thang10","thang11",'thang12')
    .then((data) => 
        res.send(data)
    )
})

// thông tin thuế của lần tính của id truyền vào
app.get('/getThueNop/:id', function (req, res) {
    var idRequest = req.params.id;
    console.log(idRequest)
    
    db('BangThue')
    .where("TTidThue",idRequest)
    .join("ThongTin", "BangThue.TTidThue","ThongTin.id")
    .select("thang1","thang2",'thang3',"thang4","thang5",
    'thang6', "thang7","thang8",'thang9',"thang10","thang11",'thang12', "ThueCaNam", "ThueDaNop")
    .then(data => 
        console.log(data)
    );
    res.send(data);
})

// xóa thông tin thuế của id
app.get('/deleteSalary/:id', function (req, res) {
    var idRequest = req.params.id;
    console.log(idRequest)
    
    db('ThongTin')
    .where("id",idRequest)
    .del()
    .then(() => console.log("Deleted"))

    db('BangThue')
    .where("TTidThue",idRequest)
    .del()
    .then(() => console.log("Deleted"))

    db('BangLuong')
    .where("TTidLuong",idRequest)
    .del()
    .then(() => console.log("Deleted"))
})

// hàm lấy tất thông tin
app.get('/selectAll/', function (req, res) {
    
    db('ThongTin')
    .join("BangThue", "BangThue.TTidThue","ThongTin.id")
    .join("BangLuong", "BangLuong.TTidLuong","ThongTin.id")
    .select("*")
    .then(data => 
        console.log(data)
    );
    res.send(data);

})


// post method để gửi thông tin vào server sau đó lưu lại
app.post('/getSalary', function (req, res) {
    
    arr = ["id", 'BHXH', 'BHYT', 'BHTN', 'Nam', 'nguoi_phu_thuoc', 'tu_thien', 'thu_nhap_mien_thue']

    thongTin = {}           //object cho vào bảng thông tin

    for (var [key, value] of Object.entries(req.body)) {                // đổi từ string sang int
        if (key == "BHTN" || key == "BHYT" || key == "BHXH" || key == "Nam" || key == "id") {                                    
            data[key] = value;
            
        } else {
            key = String(key);
            data[key] = parseInt(value, 10);
        }
        if (arr.includes(key)) {                                        // Lấy thông tin ở bảng thông tin vào object
            thongTin[key] = value;
        } 
        if(key == "Nam") {
            Nam = value;
        }
    }

    // let tongThueNopNam = 1;
    // var tongThueNopThang = 0;


    thueNop, data = tools.calObjTax(data, thueNop, tools.calTax, tools.calTaxAnual);  //data la

    // thueNop, data, tongThueNopThang, tongThueNopNam = tools.calObjTax(data, thueNop, tools.calTax, tools.calTaxAnual);  //data la
    tongThueNopNam = thueNop.tongThueNopNam
    tongThueNopThang = thueNop.tongThueNopThang

    delete thueNop.tongThueNopNam
    delete thueNop.tongThueNopThang

    // Thêm tổng thuế nộp cả năm vào trong obj thông tin để có thể insert vào table
    thongTin['ThueCaNam'] = tongThueNopNam; 
    thongTin['ThueDaNop'] = tongThueNopThang;             // Tổng thuế đã nộp 12 tháng        

    // console.log(data);
    // console.log(thueNop);

    // console.log(thongTin);

    
    
    // insert vào bảng thông tin
    db('ThongTin').insert(thongTin).then(() => console.log("data inserted"))
        .catch((err) => { console.log(err); throw err })
        .finally(() => {
            // db.destroy();
        });


    // insert vào bảng lương đóng
    db('BangLuong').insert(data).then(() => console.log("data inserted"))
        .catch((err) => { console.log(err); throw err })
        .finally(() => {
            // db.destroy();
        });
    
    
    // insert vào bảng thuế đóng hàng tháng
    db('BangThue').insert(thueNop).then(() => console.log("data inserted"))
        .catch((err) => { console.log(err); throw err })
        .finally(() => {
            // db.destroy();
        });
    
    
    res.status(201).send("okay");
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// /getThuNhap/:id  : thông tin lương của id truyền vào
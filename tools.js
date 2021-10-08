// const thongTin = '{"NguoiPhuThuoc":0,"ThangMot": 5000000,"ThangHai": 5000000,"ThangBa": 5000000,"ThangBon": 5000000,"ThangNam": 5000000,"ThangSau": 5000000,"ThangBay": 5000000,"ThangTam": 5000000,"ThangChin": 5000000,"ThangMuoi": 5000000,"ThangMuoiMot": 5000000,"ThangMuoiHai": 5000000}';

module.exports = {
    calObjTax,
    calTax,
    calTaxAnual,
}

const thongTin = '{"NguoiPhuThuoc":0,"ThangMot": 30000000,"ThangHai": 5000000,"ThangBa": 5000000}';


const myJSON = '{"name":"John", "age":30, "car":null}';
// const myObj = JSON.parse(thongTin);


//dạng gửi tới server đây là dữ liệu test
var data = {
    "id": 12,
    'Nam':'2020',
    "thang1": 500000000,
    "thang2": 500000000,
    "thang3": 500000000,
    "thang4": 500000000,
    "thang5": 500000000,
    "thang6": 500000000,
    "thang7": 500000000,
    "thang8": 160000000,
    "thang9": 160000000,
    "thang10": 160000000,
    "thang11": 160000000,
    "thang12": 160000000,
    "thu_nhap_mien_thue": 1000000,
    "nguoi_phu_thuoc": 2,
    "tu_thien": 500000,
    "BHYT": "true",
    "BHXH": "true",
    "BHTN": "true",
}

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

// hàm tính thuế theo phần trăm
// giá trị truyền vào là thu nhập chịu thuế sau khi đã khấu trừ các khoản

function calTaxAnual(tienChiuThue) {
    
    var rankTax = [60000000,120000000,216000000,384000000,624000000, 960000000, 99999999999]
    var rateTax = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35];
    var costPercent = [0, 250000, 7500000, 1650000, 3250000, 5850000, 9850000];
    var rate = 0;
    var costPer = 0;

    for (let x in rankTax, rateTax, costPercent) {
        if (tienChiuThue < rankTax[x]) {
            rate = rateTax[x];
            break;
        }
    }

    return tienChiuThue * rate;

}


function calTax(tienChiuThue) {
    
    var rankTax = [5000000,10000000,18000000,32000000,52000000, 8000000, 9999999999999]
    var rateTax = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35];
    var costPercent = [0, 250000, 7500000, 1650000, 3250000, 5850000, 9850000];
    var rate = 0;
    var costPer = 0;

    for (let x in rankTax, rateTax, costPercent) {
        if (tienChiuThue < rankTax[x]) {
            rate = rateTax[x];
            costPer = costPercent[x];
            break;
        }
    }

    return tienChiuThue * rate - costPer;

}

// hàm tính giá trị thuế từng tháng lưu vào target
function calObjTax(data, target, calTax, calTaxAnual) {
    var BHYT = 0;
    var BHXH = 0;
    var BHTN = 0;

    var rate = 0;
    const giamTruGiaCanh = 11000000;
    const ratePhuThuoc = 4400000;          // Tỉ lệ người phụ thuộc
    var tongThuNhapNam = 0;
    var tongGiamTruNam = 0;
    var tongTNCTCaNam = 0;
    var nguoiPhuThuoc = data.nguoi_phu_thuoc;
    var tienTuThien = data.tu_thien;
    var tongThueNopThang = 0;               // tổng thuế nộp theo tháng

    if (data.BHXH === "true") {
        BHXH = 0.08;
    }
    if (data.BHYT === "true") {
        BHYT = 0.015;
    }
    if (data.BHTN === "true") {
        BHTN = 0.01;
    }
    
    rate = BHYT + BHXH + BHTN;                         // Tỉ lệ đóng các loại bảo hiểm
    
    const id = data.id;
    const Nam = data.Nam;                        // lấy dữ liệu id ra
                            // lấy dữ liệu id ra

    delete data.nguoi_phu_thuoc;              // xóa dự liệu người phu thuộc
    delete data.BHXH;              // xóa dự liệu BHXH
    delete data.BHYT;              // xóa dự liệu BHYT
    delete data.BHTN;              // xóa dự liệu BHXH
    delete data.tu_thien;              // xóa dự liệu BHXH
    delete data.thu_nhap_mien_thue;              // xóa dự liệu BHXH
    delete data.id;              // xóa dự liệu BHXH
    delete data.Nam;              // xóa dự liệu BHXH
    delete target.TTidThue                           
    delete data.TTidLuong                           // gán lại để thuật tiện về sau cho vào obj



    for(var x in data, target){             //data là dự liệu lương, target là obj nộp thuế

        var giamTru = giamTruGiaCanh + (data[x] * rate) + nguoiPhuThuoc * ratePhuThuoc + tienTuThien;
        tongGiamTruNam += giamTru;
        tongThuNhapNam += data[x];

        var thuNhapChiuThue = data[x] - giamTru;

        if (thuNhapChiuThue > 0) {
            target[x] = calTax(thuNhapChiuThue);            // target[x] là thuế nộp theo từng tháng
            tongThueNopThang += target[x];                  // tổng thuế nộp theo từng tháng
        }
    }

    target["TTidThue"] = id;                           // gán lại để thuật tiện về sau cho vào obj
    data["TTidLuong"] = id; 
                               

    tongTNCTCaNam = tongThuNhapNam - tongGiamTruNam; 
    var tongThueNopNam = 0;
    if (tongTNCTCaNam <= 0) {
        tongThueNopNam = 0;
    } else {
        tongThueNopNam = calTaxAnual(tongTNCTCaNam);
    }

    target["tongThueNopNam"] = tongThueNopNam;
    target["tongThueNopThang"] = tongThueNopThang;
    
                     
    return target, data;  //target là thuế nộp, data là dữ liệu thu nhập từng tháng
}



// var tongThueCaNam = 0;
// var tongThueNopThang= 0;


// thueNop là obj theo từng tháng, myObj là dự liệu lương
// thueNop, data, tongThueCaNam, tongThueNopThang = calObjTax(data, thueNop, calTax, calTaxAnual)  
                    

// // for (const x in myObj, thueNop) {
// //     console.log("Luong thang: %d",myObj[x]);
// //     console.log("thue nop: %d",thueNop[x]);
// // }
// // console.log("Tong thue ca nam: %d", tongThueCaNam);

// console.log(thueNop);
// console.log(data);
// console.log(tongThueCaNam);
// console.log(tongThueNopThang);

// function plus(data, data1) {

// console.log(b1);    data+=1
//     data1+=1
//     return data, data1;
// }

// var a = 1;
// var b = 2;

// console.log(a);
// console.log(b);

// var a1 = 0;
// var b1 = 0;

// a1, b1 = plus(a, b);

// console.log(a1);



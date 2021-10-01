
exports.up = function(knex) {
  
    return knex.schema.createTable("ThongTin", tbl =>{
        tbl.text("id")
        tbl.text("BHXH")
        tbl.text("BHYT")
        tbl.text("BHTN")
        tbl.text("Nam", 128)
        tbl.integer("nguoi_phu_thuoc")
        tbl.integer("tu_thien")
        tbl.integer("thu_nhap_mien_thue")
        tbl.integer("ThueCaNam")
        tbl.integer("ThueDaNop")

    })
    .createTable("BangThue", tbl => {
        tbl.increments("idBangThue").primary();
        tbl.text("TTidThue").references("id").inTable("ThongTin")
        tbl.integer("thang1")
        tbl.integer("thang2")
        tbl.integer("thang3")
        tbl.integer("thang4")
        tbl.integer("thang5")
        tbl.integer("thang6")
        tbl.integer("thang7")
        tbl.integer("thang8")
        tbl.integer("thang9")
        tbl.integer("thang10")
        tbl.integer("thang11")
        tbl.integer("thang12")
    })
    .createTable("BangLuong", tbl => {
        tbl.increments("idBangLuong").primary();
        tbl.text("TTidLuong").references("id").inTable("ThongTin")
        tbl.integer("thang1")
        tbl.integer("thang2")
        tbl.integer("thang3")
        tbl.integer("thang4")
        tbl.integer("thang5")
        tbl.integer("thang6")
        tbl.integer("thang7")
        tbl.integer("thang8")
        tbl.integer("thang9")
        tbl.integer("thang10")
        tbl.integer("thang11")
        tbl.integer("thang12")
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("messages").dropTableIfExists("ThongTin")
};

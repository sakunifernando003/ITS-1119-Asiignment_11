import {customer_db,item_db,order_db} from "../db/db";
import ItemModel from "../model/ItemModel.js";


function loadItem(){
    $('#item-tbody').empty();
    item_db.map((item,index )  => {

        // let id = item.id;

        let name = item.name;
        let price = item.price;
        let supplier = item.supplier;
        let qty = item.qty;

        let data = `<tr>
                            <td>${index + 1}</td>
                            <td>${name}</td>
                            <td>${price}</td>
                            <td>${supplier}</td>
                            <td>${qty}</td>
                        </tr>`
        $(`#item-tbody`).append(data);

    })
}


$(`#item_save`).on('click', function()  {
    let id = "001"
    let name = $('#item-name').val();
    let price = $('#price').val();
    let supplier = $('#supplier').val();
    let qty = $('#qty').val();

    console.log(name,price,supplier,qty);

    if (name === '' || price === ''|| supplier ===''|| qty ===''){

        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

    } else {

        let item_data  = new ItemModel(name,price,supplier,qty);

        item_db.push(item_data);

        console.log(item_db);

        loadItem();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
    }
});

$("#item-tbody").on('click','tr',function (){
    let idx = $(this).index();
    console.log(idx);
    let obj = item_db[idx];
    console.log(obj);

    let name = obj.name;
    let price = obj.price;
    let supplier = obj.supplier;
    let qty = obj.qty;

    $("#item-name").val(name);
    $("#price").val(price);
    $("#supplier").val(supplier);
    $("#qty").val(qty);

});












import {order_db} from "../db/db.js";
import {customer_db} from "../db/db.js";
import {item_db} from "../db/db.js";

import OrdersModel from "../model/OrdersModel.js";


let idx = -1;

function loadOrderIds(){
    let count = order_db.length;
    $('#oId').val(count+1);
}

document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("oId")) {
        loadOrderIds();
    }
    if (document.getElementById("date")){
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        $('#date').val(formattedDate);
    }


    const select = document.getElementById("cId");
    select.innerHTML = '<option disabled selected>Select Customer</option>';

    $('#cId').on('click',function () {

        while (select.options.length > 1) {
            select.remove(1);
        }

        customer_db.forEach(cus => {
            const option = document.createElement("option");
            option.value = cus.id;
            option.textContent = cus.id;
            select.appendChild(option);
        });
    })

    const selectItem = document.getElementById("order_item_id");
    selectItem.innerHTML = '<option disabled selected>Select Item</option>';

    $('#order_item_id').on('click',function () {

        while (selectItem.options.length > 1) {
            selectItem.remove(1);
        }


        item_db.forEach(item => {
            const optionNew = document.createElement("option");
            optionNew.value = item.code;
            optionNew.textContent = item.code; // You can show ID + name
            selectItem.appendChild(optionNew);
        });
        console.log("item data :", item_db);
    })

});

document.getElementById("cId").addEventListener("change", function () {
    const selectedId = this.value;
    const selectedCustomer = customer_db.find(cus => cus.id === selectedId);
    if (selectedCustomer) {
        console.log("Selected Customer:", selectedCustomer);

        document.getElementById("cus_name").value = selectedCustomer.name;
        document.getElementById("cus_address").value = selectedCustomer.address;
        document.getElementById("cus_contact").value = selectedCustomer.contact;
    }
});

document.getElementById("order_item_id").addEventListener("change", function () {
    const selectedId = this.value;
    const selectedItem = item_db.find(item => item.code === selectedId);
    if (selectedItem) {
        console.log("Selected Item:", selectedItem);

        document.getElementById("item_name").value = selectedItem.iName;
        document.getElementById("item_price").value = selectedItem.price;
        document.getElementById("item_qty").value = selectedItem.qty;
    }
});

$('#btn_add_item').on('click', function () {
    let itemPrice = $('#item_price').val();
    let qtyOnHand = $('#item_qty').val();
    let orderQty = $('#order_qty').val();

    let oId = $('#oId').val();
    let cId = $('#cId').val();
    let code = $('#order_item_id').val();
    let date = $('#date').val();

    let total = itemPrice * orderQty;

    if (qtyOnHand < orderQty){
        Swal.fire({
            title: 'Error!',
            text: 'Out Of Stock',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

    }else {
        $('#tot').val(total);

    }

    let order_data = new OrdersModel(oId,cId,code,date,orderQty,total);

    order_db.push(order_data);
    console.log("order data: ",orders_db);

    loadTableData();
})

$('#btn_purchase').on('click',function () {
    let tot = $('#tot').val();
    let discount = $('#discount').val();

    $('#balance').val(tot-discount);
})

function loadTableData() {

    $('#order_tbody').empty();

    orders_db.map((item,index)=>{
        let oId = $('#oId').val();
        let cId = $('#cId').val();
        let code = $('#order_item_id').val();
        let date = $('#date').val();
        let qty = $('#order_qty').val();
        let total = $('#tot').val();

        let data = `<tr>
            <td>${index+1}</td>
            <td>${cId}</td>
            <td>${code}</td>
            <td>${date}</td>
            <td>${qty}</td>
            <td>${total}</td>
        </tr>`

        $('#order_tbody').append(data);
    })
}



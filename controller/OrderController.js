import { order_db } from "../db/db.js";
import { customer_db } from "../db/db.js";
import { item_db } from "../db/db.js";

import OrdersModel from "../model/OrdersModel.js";

function loadOrderIds() {
    const count = order_db.length;
    $('#oId').val(count + 1);
}

function populateCustomerSelect() {
    const select = document.getElementById("cId");
    select.innerHTML = '<option disabled selected>Select Customer</option>';
    customer_db.forEach(cus => {
        const option = document.createElement("option");
        option.value = cus.id;
        option.textContent = cus.id;
        select.appendChild(option);
    });
}

function populateItemSelect() {
    const selectItem = document.getElementById("order_item_id");
    selectItem.innerHTML = '<option disabled selected>Select Item</option>';
    item_db.forEach(item => {
        const optionNew = document.createElement("option");
        optionNew.value = item.code;
        optionNew.textContent = item.code; // Displaying only the code for now
        selectItem.appendChild(optionNew);
    });
}

document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("oId")) {
        loadOrderIds();
    }


    if (document.getElementById("date")) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        $('#date').val(formattedDate);
    }


    populateCustomerSelect();
    populateItemSelect();


    $('#cId').on('click', populateCustomerSelect);


    $('#order_item_id').on('click', populateItemSelect);


    document.getElementById("cId").addEventListener("change", function () {
        const selectedId = this.value;
        const selectedCustomer = customer_db.find(cus => cus.id === selectedId);
        if (selectedCustomer) {
            document.getElementById("cus_name").value = selectedCustomer.name;
            document.getElementById("cus_address").value = selectedCustomer.address;
            document.getElementById("cus_contact").value = selectedCustomer.contact;
        }
    });


    document.getElementById("order_item_id").addEventListener("change", function () {
        const selectedId = this.value;
        const selectedItem = item_db.find(item => item.code === selectedId);
        if (selectedItem) {
            document.getElementById("item_name").value = selectedItem.iName;
            document.getElementById("item_price").value = selectedItem.price;
            document.getElementById("item_qty").value = selectedItem.qty;
        }
    });


    $('#btn_add_item').on('click', function () {
        const itemPrice = parseFloat($('#item_price').val());
        const qtyOnHand = parseInt($('#item_qty').val());
        const orderQty = parseInt($('#order_qty').val());

        const oId = $('#oId').val();
        const cId = $('#cId').val();
        const code = $('#order_item_id').val();
        const date = $('#date').val();
        const total = itemPrice * orderQty;

        if (qtyOnHand < orderQty) {
            Swal.fire({
                title: 'Error!',
                text: 'Out Of Stock',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        } else {
            $('#tot').val(parseFloat($('#tot').val() || 0) + total);


            const selectedItem = item_db.find(item => item.code === code);
            if (selectedItem) selectedItem.qty -= orderQty;


            const order_data = new OrdersModel(oId, cId, code, date, orderQty, total);
            order_db.push(order_data);

            loadTableData();
        }
    });


    $('#btn_purchase').on('click', function () {
        const tot = parseFloat($('#tot').val() || 0);
        const discount = parseFloat($('#discount').val() || 0);
        $('#balance').val(tot - discount);
    });

    function loadTableData() {
        $('#order_tbody').empty();

        order_db.forEach((item, index) => {
            const data = `<tr>
                <td>${index + 1}</td>
                <td>${item.cId}</td>
                <td>${item.code}</td>
                <td>${item.date}</td>
                <td>${item.qty}</td>
                <td>${item.total}</td>
            </tr>`;
            $('#order_tbody').append(data);
        });
    }
});

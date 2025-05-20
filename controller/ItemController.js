
import { customer_db, item_db, order_db } from "../db/db.js";
import ItemModel from "../model/ItemModel.js";


const namePattern = /^[A-Za-z\s]{3,50}$/;
const pricePattern = /^\d+(\.\d{1,2})?$/;
const supplierPattern = /^[A-Za-z\s]{3,50}$/;
const qtyPattern = /^[1-9]\d*$/;

function loadItem() {
    $('#item-tbody').empty();
    item_db.map((item, index) => {
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
                    </tr>`;
        $(`#item-tbody`).append(data);
    });
}

function validateField(input, pattern, errorMsg) {
    const value = $(input).val();
    if (!pattern.test(value)) {
        $(input).addClass("is-invalid");
        $(input).removeClass("is-valid");
        $(input).next('.invalid-feedback').text(errorMsg).show();
        return false;
    } else {
        $(input).addClass("is-valid");
        $(input).removeClass("is-invalid");
        $(input).next('.invalid-feedback').hide();
        return true;
    }
}


$('#item-name').on('input', function () {
    validateField(this, namePattern, "Invalid name. Only letters and spaces (3-50 chars)." );
});

$('#price').on('input', function () {
    validateField(this, pricePattern, "Invalid price. Use numbers, max 2 decimal places.");
});

$('#supplier').on('input', function () {
    validateField(this, supplierPattern, "Invalid supplier name. Only letters and spaces (3-50 chars)." );
});

$('#qty').on('input', function () {
    validateField(this, qtyPattern, "Invalid quantity. Only positive integers are allowed.");
});

$(`#item_save`).on('click', function () {
    let name = $('#item-name').val();
    let price = $('#price').val();
    let supplier = $('#supplier').val();
    let qty = $('#qty').val();


    const isNameValid = validateField('#item-name', namePattern, "Invalid name.");
    const isPriceValid = validateField('#price', pricePattern, "Invalid price.");
    const isSupplierValid = validateField('#supplier', supplierPattern, "Invalid supplier name.");
    const isQtyValid = validateField('#qty', qtyPattern, "Invalid quantity.");

    if (!isNameValid || !isPriceValid || !isSupplierValid || !isQtyValid) {
        Swal.fire({
            title: 'Error!',
            text: 'Please correct the highlighted fields.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    let item_data = new ItemModel(name, price, supplier, qty);

    item_db.push(item_data);

    loadItem();

    Swal.fire({
        title: "Added Successfully!",
        icon: "success",
        draggable: true
    });


    $('#item-name, #price, #supplier, #qty').val('').removeClass('is-valid is-invalid');
});

$("#item-tbody").on('click', 'tr', function () {
    let idx = $(this).index();
    let obj = item_db[idx];

    let name = obj.name;
    let price = obj.price;
    let supplier = obj.supplier;
    let qty = obj.qty;

    $("#item-name").val(name);
    $("#price").val(price);
    $("#supplier").val(supplier);
    $("#qty").val(qty);
});


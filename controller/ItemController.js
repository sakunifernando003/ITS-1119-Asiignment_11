import { customer_db, item_db, order_db } from "../db/db.js";
import ItemModel from "../model/ItemModel.js";

const namePattern = /^[A-Za-z\s]{3,50}$/;
const pricePattern = /^\d+(\.\d{1,2})?$/;
const supplierPattern = /^[A-Za-z\s]{3,50}$/;
const qtyPattern = /^[1-9]\d*$/;

let selectedItemIndex = null;


function loadItem() {
    $('#item-tbody').empty();
    item_db.forEach((item, index) => {
        const data = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.supplier}</td>
                <td>${item.qty}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
                </td>
            </tr>`;
        $('#item-tbody').append(data);
    });
}

// Function to validate a field
function validateField(input, pattern, errorMsg) {
    const value = $(input).val();
    if (!pattern.test(value)) {
        $(input).addClass("is-invalid").removeClass("is-valid");
        $(input).next('.invalid-feedback').text(errorMsg).show();
        return false;
    } else {
        $(input).addClass("is-valid").removeClass("is-invalid");
        $(input).next('.invalid-feedback').hide();
        return true;
    }
}

// Input field validations
$('#item-name').on('input', () => validateField('#item-name', namePattern, "Invalid name. Only letters and spaces (3-50 chars)."));
$('#price').on('input', () => validateField('#price', pricePattern, "Invalid price. Use numbers, max 2 decimal places."));
$('#supplier').on('input', () => validateField('#supplier', supplierPattern, "Invalid supplier name. Only letters and spaces (3-50 chars)."));
$('#qty').on('input', () => validateField('#qty', qtyPattern, "Invalid quantity. Only positive integers are allowed."));


$('#item_save').on('click', function () {
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

    const name = $('#item-name').val();
    const price = $('#price').val();
    const supplier = $('#supplier').val();
    const qty = $('#qty').val();

    const item_data = new ItemModel(name, price, supplier, qty);
    item_db.push(item_data);

    loadItem();
    resetForm();
    Swal.fire({
        title: "Added Successfully!",
        icon: "success",
        confirmButtonText: "Ok"
    });
});


$('#item-tbody').on('click', 'tr', function () {
    selectedItemIndex = $(this).index();
    const selectedItem = item_db[selectedItemIndex];

    $('#item-name').val(selectedItem.name);
    $('#price').val(selectedItem.price);
    $('#supplier').val(selectedItem.supplier);
    $('#qty').val(selectedItem.qty);
});


$('#item_Update').on('click', function () {
    if (selectedItemIndex === null) {
        Swal.fire({
            title: 'Error!',
            text: 'Please select an item to update.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

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

    item_db[selectedItemIndex] = {
        name: $('#item-name').val(),
        price: $('#price').val(),
        supplier: $('#supplier').val(),
        qty: $('#qty').val()
    };

    loadItem();
    resetForm();
    Swal.fire({
        title: 'Updated Successfully!',
        icon: 'success',
        confirmButtonText: 'Ok'
    });
});


$('#item-tbody').on('click', '.delete-btn', function () {
    const indexToDelete = $(this).data('index');


    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
    }).then((result) => {
        if (result.isConfirmed) {
            item_db.splice(indexToDelete, 1);
            loadItem();
            Swal.fire({
                title: 'Deleted!',
                text: 'The item has been deleted.',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
        }
    });
});


function resetForm() {
    $('#item-name, #price, #supplier, #qty').val('').removeClass('is-valid is-invalid');
    selectedItemIndex = null;
}


loadItem();



$('#item_delete').on('click', function () {
    if (selectedItemIndex === null) {
        Swal.fire({
            title: 'Error!',
            text: 'Please select a customer to delete.',
            icon: 'error',
            confirmButtonText: 'Ok',
        });
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {

            item_db.splice(selectedItemIndex, 1);


            loadItem()

            Swal.fire({
                title: 'Deleted!',
                text: 'The customer has been deleted.',
                icon: 'success',
                confirmButtonText: 'Ok',
            });


            $('#item-name, #price, #supplier, #qty').val('').removeClass('is-valid is-invalid');
            selectedItemIndex = null;
        }
    });
});


$("#item-tbody").on('click', 'tr', function () {
    selectedItemIndex = $(this).index();
    let obj = item_db[selectedItemIndex];

    $('#item-name').val(selectedItem.name);
    $('#price').val(selectedItem.price);
    $('#supplier').val(selectedItem.supplier);
    $('#qty').val(selectedItem.qty);
});









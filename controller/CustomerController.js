import { customer_db } from "../db/db.js";
import CustomerModel from "../model/CustomerModel.js";

const namePattern = /^[A-Za-z\s]{3,50}$/;
const nicPattern = /^(\d{9}[VvXx]|\d{12})$/;
const addressPattern = /^.{5,100}$/;
const phonePattern = /^\d{10}$/;

function loadCustomer() {
    $('#customer-tbody').empty();
    customer_db.map((customer, index) => {
        let name = customer.name;
        let nic = customer.nic;
        let address = customer.address;
        let phone = customer.phone;

        let data = `<tr>
                        <td>${index + 1}</td>
                        <td>${name}</td>
                        <td>${nic}</td>
                        <td>${address}</td>
                        <td>${phone}</td>
                    </tr>`;
        $(`#customer-tbody`).append(data);
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

$('#name').on('input', function () {
    validateField(this, namePattern, "Invalid name. Only letters and spaces (3-50 chars).");
});

$('#nic').on('input', function () {
    validateField(this, nicPattern, "Invalid NIC. Use 9 digits + V/v/X/x or 12 digits.");
});

$('#address').on('input', function () {
    validateField(this, addressPattern, "Invalid address. Must be 5-100 characters long.");
});

$('#phone').on('input', function () {
    validateField(this, phonePattern, "Invalid phone number. Must be exactly 10 digits.");
});

$(`#customer_save`).on('click', function () {
    let name = $('#name').val();
    let nic = $('#nic').val();
    let address = $('#address').val();
    let phone = $('#phone').val();


    const isNameValid = validateField('#name', namePattern, "Invalid name.");
    const isNicValid = validateField('#nic', nicPattern, "Invalid NIC.");
    const isAddressValid = validateField('#address', addressPattern, "Invalid address.");
    const isPhoneValid = validateField('#phone', phonePattern, "Invalid phone number.");

    if (!isNameValid || !isNicValid || !isAddressValid || !isPhoneValid) {
        Swal.fire({
            title: 'Error!',
            text: 'Please correct the highlighted fields.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    let customer_data = new CustomerModel(name, nic, address, phone);

    customer_db.push(customer_data);

    loadCustomer();

    Swal.fire({
        title: "Added Successfully!",
        icon: "success",
        draggable: true
    });


    $('#name, #nic, #address, #phone').val('').removeClass('is-valid is-invalid');
});

$("#customer-tbody").on('click', 'tr', function () {
    let idx = $(this).index();
    let obj = customer_db[idx];

    let name = obj.name;
    let nic = obj.nic;
    let address = obj.address;
    let phone = obj.phone;

    $("#name").val(name);
    $("#nic").val(nic);
    $("#address").val(address);
    $("#phone").val(phone);
});

let selectedCustomerIndex = null; // Track the index of the selected customer

// Function to update customer data
$('#customer_Update').on('click', function () {
    if (selectedCustomerIndex === null) {
        Swal.fire({
            title: 'Error!',
            text: 'Please select a customer to update.',
            icon: 'error',
            confirmButtonText: 'Ok',
        });
        return;
    }

    let name = $('#name').val();
    let nic = $('#nic').val();
    let address = $('#address').val();
    let phone = $('#phone').val();

    const isNameValid = validateField('#name', namePattern, "Invalid name.");
    const isNicValid = validateField('#nic', nicPattern, "Invalid NIC.");
    const isAddressValid = validateField('#address', addressPattern, "Invalid address.");
    const isPhoneValid = validateField('#phone', phonePattern, "Invalid phone number.");

    if (!isNameValid || !isNicValid || !isAddressValid || !isPhoneValid) {
        Swal.fire({
            title: 'Error!',
            text: 'Please correct the highlighted fields.',
            icon: 'error',
            confirmButtonText: 'Ok',
        });
        return;
    }

    // Update the selected customer
    customer_db[selectedCustomerIndex] = new CustomerModel(name, nic, address, phone);

    // Reload the customer table
    loadCustomer();

    Swal.fire({
        title: 'Updated Successfully!',
        icon: 'success',
        confirmButtonText: 'Ok',
    });

    // Reset form and index
    $('#name, #nic, #address, #phone').val('').removeClass('is-valid is-invalid');
    selectedCustomerIndex = null;
});

// Modify the click handler for selecting a customer
$("#customer-tbody").on('click', 'tr', function () {
    selectedCustomerIndex = $(this).index(); // Set the selected index
    let obj = customer_db[selectedCustomerIndex];

    $("#name").val(obj.name);
    $("#nic").val(obj.nic);
    $("#address").val(obj.address);
    $("#phone").val(obj.phone);
});

// Function to delete a customer
$('#customer_delete').on('click', function () {
    if (selectedCustomerIndex === null) {
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
            // Remove the selected customer
            customer_db.splice(selectedCustomerIndex, 1);

            // Reload the customer table
            loadCustomer();

            Swal.fire({
                title: 'Deleted!',
                text: 'The customer has been deleted.',
                icon: 'success',
                confirmButtonText: 'Ok',
            });

            // Reset form and index
            $('#name, #nic, #address, #phone').val('').removeClass('is-valid is-invalid');
            selectedCustomerIndex = null;
        }
    });
});

// Modify the click handler for selecting a customer
$("#customer-tbody").on('click', 'tr', function () {
    selectedCustomerIndex = $(this).index(); // Set the selected index
    let obj = customer_db[selectedCustomerIndex];

    $("#name").val(obj.name);
    $("#nic").val(obj.nic);
    $("#address").val(obj.address);
    $("#phone").val(obj.phone);
});


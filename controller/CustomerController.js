import {customer_db,item_db,order_db}from "../db/db.js";
import CustomerModel  from "../model/CustomerModel.js";

function loadCustomer(){
    $('#customer-tbody').empty();
    customer_db.map((item,index )  => {

        // let id = item.id;

        let name = item.name;
        let nic = item.nic;
        let address = item.address;
        let phone = item.phone;

        let data = `<tr>
                            <td>${index + 1}</td>
                            <td>${name}</td>
                            <td>${nic}</td>
                            <td>${address}</td>
                            <td>${phone}</td>
                        </tr>`
        $(`#customer-tbody`).append(data);

    })
}

$(`#customer_save`).on('click', function()  {
    let id = "001"
    let name = $('#name').val();
    let nic = $('#nic').val();
    let address = $('#address').val();
    let phone = $('#phone').val();

    console.log(name,nic,address,phone);

    if (name === '' || nic === ''|| address ===''|| phone ===''){

        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

    } else {

        let customer_data  = new CustomerModel(name,nic,address,phone);

        customer_db.push(customer_data);

        console.log(customer_db);

        loadCustomer();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
    }
});

$("#customer-tbody").on('click','tr',function (){
    let idx = $(this).index();
    console.log(idx);
    let obj = customer_db[idx];
    console.log(obj);

    let name = obj.name;
    let nic = obj.nic;
    let address = obj.address;
    let phone = obj.phone;

    $("#name").val(name);
    $("#nic").val(nic);
    $("#address").val(address);
    $("#phone").val(phone);

});











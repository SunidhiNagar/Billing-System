let itemCounter = 0;

function addInvoiceItem() {
    itemCounter++;

    const newItemRow = `<tr id="itemRow${itemCounter}">
        <td><input type="text" class="form-control" placeholder="Enter Description required"></input></td>
        <td><input type="number" class="form-control quantity" placeholder="Enter Quantity required"></input></td>
        <td><input type="number" class="form-control unitPrice" placeholder="Enter Unit Price required"></input></td>
        <td>
            <select class="form-control dis">
                <option value="10%" selected>10%</option>    
                <option value="15%">15%</option>

                <option value="20%">20%</option>
                <option value="25%">25%</option>

                <option value="30%">30%</option>
                <option value="40%">40%</option>
                <option value="50%">50%</option>
            </select>
        </td>
        <td><input type="text" class="form-control totalItemPrice" disabled readonly></input></td>
        <td><button type="button" class="btn btn-danger" onclick="removeInvoiceItem(${itemCounter})">Remove</button></td>
    </tr>`;

    $("#invoiceItems").append(newItemRow);
    updateTotalAmount();

    // Bind change event to update total amount when discount changes
    $(`#itemRow${itemCounter} .dis`).change(updateTotalAmount);
}

function removeInvoiceItem(itemId) {
    $(`#itemRow${itemId}`).remove();
    updateTotalAmount();
}

function updateTotalAmount() {
    let totalAmount = 0;

    $("tr[id^='itemRow']").each(function() {
        const quantity = parseFloat($(this).find(".quantity").val()) || 0;
        const unitPrice = parseFloat($(this).find(".unitPrice").val()) || 0;
        const discount = parseFloat($(this).find(".dis").val()) || 0;

        const totalItemPrice = quantity * unitPrice * (1 - discount / 100);

        $(this).find(".totalItemPrice").val(totalItemPrice.toFixed(2));
        totalAmount += totalItemPrice;
    });

    $("#totalAmount").val(totalAmount.toFixed(2));
}

$(document).ready(function() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    $("#invoiceDate").val(formattedDate);

    // Submit form event handler
    $("#invoiceform").submit(function(event) {
        event.preventDefault();
        updateTotalAmount();
    });
});

// Print Invoice function
function printInvoice() {
    const customerName = $("#customerName").val();
    const invoiceDate = $("#invoiceDate").val();
    const items = [];

    $("tr[id^='itemRow']").each(function() {
        const description = $(this).find("td:eq(0) input").val();
        const quantity = $(this).find("td:eq(1) input").val();
        const unitPrice = $(this).find("td:eq(2) input").val();
        const discount = $(this).find("td:eq(3) select").val(); // Retrieve discount from the dropdown

        const totalItemPrice = $(this).find("td:eq(4) input").val(); // Note: Changed to index 4

        items.push({
            description: description,
            quantity: quantity,
            unitPrice: unitPrice,
            discount:discount,
            totalItemPrice: totalItemPrice,
        });
    });

    const totalAmount = $("#totalAmount").val();
    const invoiceContent = `
        <html>
            <head>
                <title>Invoice Slip</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        text-align:center;
                    }

                    h2 {
                        color: blue;
                        text-decoration:underline;
                    }

                    table {
                        width: 0%;
                        margin-top: 50px;
                        margin-left:40%;

                    }

                    th,
                    td {
                        border: 1px solid lightgrey;
                        text-align: left;
                        padding: 4px;

                    }

                    .total {
                        font-weight: bold;
                        margin-top:50px;
                    }
                </style>
            </head>
            <body>
                <h2>Invoice Slip</h2>
                <p style="margin-top:50px"><strong>Customer Name     </strong>${customerName}</p>
                <p><strong>Date and Time     </strong>${invoiceDate}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Discount</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((item) => `<tr>
                            <td>${item.description}</td>
                            <td>${item.unitPrice}</td>
                            <td>${item.quantity}</td>
                            <td>${item.discount}</td> <!-- Display discount -->

                            <td>${item.totalItemPrice}</td>
                        </tr>`).join("")}
                    </tbody>
                </table>
                <p class="total">Total Amount: ${totalAmount}</p>
            </body>
        </html>`;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
}

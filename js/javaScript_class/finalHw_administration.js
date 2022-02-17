const api_path = "maohong";
const token = "GfOOlXzRlMVNPWTKmD0tN68Cjkp2";
let orderList;

//初始化
window.onload = function () {
    init();
}

function init() {
    getOrderList();
    btnEvent();
}

/**
 * 畫面產出
 */
function renderView() {
    renderOrderList();
    renderC3();
}

function renderC3() {
    let data = createC3Data();
    renderC3View(data[0], data[1]);
}

function createC3Data() {
    //整理資料
    let countArr = [];
    orderList.orders.forEach(order => {
        let countObj = {};
        let products = order.products;
        products.forEach(product => {
            let token = true
            countObj = {
                title: product.title,
                id: product.id,
                price: product.price,
                quantity: product.quantity
            }
            //ID相同，則數量相加
            countArr.forEach(item => {
                if (item.id == product.id) {
                    item.quantity += countObj.quantity
                    token = false
                }
            })
            if (token) {
                countArr.push(countObj);
            }
        })
    })
    countArr.sort((a, b) => {
        return (b.price * b.quantity) - (a.price * a.quantity)
    })
    let c3DataArr = [];
    let colors = ['#DACBFF', '#9D7FEA', '#5434A7', '#301E5F'];
    let c3ColorObj = {};
    let otherValue = 0;
    for (let i = 0; i < countArr.length; i++) {
        let item = countArr[i];
        let value = item.quantity * item.price;
        if (i <= 2) {
            c3DataArr.push([item.title, value]);
        } else {
            otherValue += value;
        }
    }
    c3DataArr.push(['其他', otherValue]);
    for (let i = 0; i < c3DataArr.length; i++) {
        c3ColorObj[c3DataArr[i][0]] = colors[i]
    }
    return [c3DataArr, c3ColorObj]
}

function renderC3View(c3DataArr, c3ColorObj) {
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: c3DataArr,
            colors: c3ColorObj
        },
    });
}



/**
 * render orderList
 */
function renderOrderList() {
    const orderPageTable = document.querySelector('.orderPage-table');
    let tableTitle =
        `
    <thead>
        <tr>
            <th>訂單編號</th>
            <th>聯絡人</th>
            <th>聯絡地址</th>
            <th>電子郵件</th>
            <th>訂單品項</th>
            <th>訂單日期</th>
            <th>訂單狀態</th>
            <th>操作</th>
        </tr>
    </thead>
    `;
    let tableData = '';
    orderList.orders.forEach(item => {
        let paid = item.paid == false ? '未處理' : '已處理';
        let orderItems = '';
        item.products.forEach(order => {
            orderItems +=
                `
            <p>${order.title}</p>
            `
        })
        tableData +=
            `
        <tr>
            <td>${item.createdAt}</td>
            <td>
                <p>${item.user.name}</p>
                <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
            `
            +
            orderItems
            +
            `
            </td>
            <td>2021/03/08</td>
            <td class="orderStatus">
                <a href="#" class="paid" data-id="${item.id}">${paid}</a>
            </td>
            <td>
                <input type="button" class="delSingleOrder-Btn" data-id="${item.id}" value="刪除">
            </td>
        </tr>
        `
    })
    orderPageTable.innerHTML = tableTitle + tableData;
}

function btnEvent() {
    const tableEl = document.querySelector('.orderPage-list');
    tableEl.addEventListener('click', (e) => {
        console.log(e.target)
        e.preventDefault();
        e.stopPropagation();
        let type = e.target.getAttribute('class');

        if (type == 'paid') {
            let paid = e.target.text;
            paid = paid == '未處理' ? true : false;
            let id = e.target.getAttribute('data-id');
            editOrderList(id, paid);
        } else if (type == 'delSingleOrder-Btn') {
            let id = e.target.getAttribute('data-id');
            deleteOrderItem(id);
        } else if (type == "discardAllBtn") {
            deleteAllOrder();
        } else {
            return;
        }
    })
}


// 取得訂單列表
function getOrderList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            orderList = response.data
            renderView();
        })
}

// 修改訂單狀態
function editOrderList(orderId, paid) {
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
        {
            "data": {
                "id": orderId,
                "paid": paid
            }
        },
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            orderList = response.data
            renderView();
        })
}

// 刪除全部訂單
function deleteAllOrder() {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            orderList = response.data
            renderView();
        })
}

// 刪除特定訂單
function deleteOrderItem(orderId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            orderList = response.data
            renderView();
        })
        .catch(function (response) {
            console.log(response.data);
        })
}
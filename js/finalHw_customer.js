// 請代入自己的網址路徑
const api_path = "maohong";
const token = "GfOOlXzRlMVNPWTKmD0tN68Cjkp2";
let productList;

//初始化
window.onload = function () {
  menuEvent();
  init();
}

function init() {
  getProductList();
}

function renderView() {
  //get and render productList
  renderProductList();
  // get cartList
  getCartList();
  // productSelect
  productSelect();
  // form control
  validateFormAndSubmit();
}

/**
 * title menu 切換
 */
function menuEvent() {
  // menu 切換
  let menuOpenBtn = document.querySelector('.menuToggle');
  let linkBtn = document.querySelectorAll('.topBar-menu a');
  let menu = document.querySelector('.topBar-menu');
  menuOpenBtn.addEventListener('click', menuToggle);

  linkBtn.forEach((item) => {
    item.addEventListener('click', closeMenu);
  })
}

// 控制menu按鈕
function menuToggle() {
  if (menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu');
  } else {
    menu.classList.add('openMenu');
  }
}
function closeMenu() {
  menu.classList.remove('openMenu');
}

/**
 * 取得產品列表資料
 */
function getProductList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
    then(function (response) {
      productList = response.data;
      renderView();
    })
    .catch(function (error) {
      console.log(error.response.data)
    })
}

/**
 * render產品列表
 * @param {*} response 
 */
function renderProductList(response) {
  let processData = null;
  if (response) {
    processData = response;
  } else {
    processData = productList;
  }
  const productWrapEl = document.querySelector('.productWrap');
  let itemContent = '';
  const itemArr = processData.products;
  if (processData.status) {
    itemArr.forEach(item => {
      itemContent +=
        `
      <li class="productCard">
          <h4 class="productType">新品</h4>
          <img src="${item.images}" alt="">
          <a href="#" class="addCardBtn" id="addCart_${item.id}">加入購物車</a>
          <h3>${item.title}</h3>
          <del class="originPrice">NT$${item.origin_price}</del>
          <p class="nowPrice">NT$${item.price}</p>
      </li>
      `;
    })
  }
  productWrapEl.innerHTML = itemContent;
  //add 加入購物車 event
  itemArr.forEach(item => {
    const addCardBtn = document.querySelector('#addCart_' + item.id);
    addCardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addCartItem(item.id, 1);
    })
  })
}
// 加入購物車
function addCartItem(id, quantity) {
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    data: {
      "productId": id,
      "quantity": quantity
    }
  }).
    then(function (response) {
      if (response.data.status) {
        alert('加入成功!');
      }
      renderCart(response.data);
    })

}


// 取得購物車列表
function getCartList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      renderCart(response.data);
    })
}

// 清除購物車內全部產品
function deleteAllCartList() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      renderCart(response.data);
      console.log(response.data);
    })
}

// 刪除購物車內特定產品
function deleteCartItem(cartId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`).
    then(function (response) {
      renderCart(response.data);
      console.log(response.data);
    })
}

// 送出購買訂單
function createOrder(userData) {

  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
    {
      "data": {
        "user": {
          "name": userData.name,
          "tel": userData.tel,
          "email": userData.email,
          "address": userData.address,
          "payment": userData.payment
        }
      }
    }
  ).
    then(function (response) {
      if (response.data.status) {
        alert('送出成功')
      }
    })
    .catch(function (error) {
      console.log(error.response.data);
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
      console.log(response.data);
    })
}

// 修改訂單狀態
function editOrderList(orderId) {
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      "data": {
        "id": orderId,
        "paid": true
      }
    },
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
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
      alert(response.data.message)
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
      console.log(response.data);
    })
    .catch(function (response) {
      console.log(response.data);
    })
}

function renderCart(data) {
  const menuListEl = document.querySelector('.shoppingCart-table');
  let total = 0;
  let meunTitle =
    `<tr>
           <th width="40%">品項</th>
           <th width="15%">單價</th>
           <th width="15%">數量</th>
           <th width="15%">金額</th>
           <th width="15%"></th>
       </tr>`;
  let menuList = '';
  const menuData = data.carts;
  if (data.status) {
    if (menuData.length == 0) {
      menuList += '<tr><td>目前購物車中沒有品項</td></tr>';
    }
    menuData.forEach(arr => {
      let product = arr.product;
      total += product.price;
      let optionVal = createOptionVal();
      menuList +=
        `
          <tr id="${arr.id}">
              <td>
                  <div class="cardItem-title">
                      <img src="${product.images}" alt="">
                      <p>${product.title}</p>
                  </div>
              </td>
              <td>${product.price}</td>
              <td>
                <select  class="form-select" aria-label="Default select example">
                  ${optionVal}
                </select>
              </td>
              <td>${product.price}</td>
              <td class="discardBtn">
                  <a href="#" class="material-icons" id="delBtn_${arr.id}">
                      clear
                  </a>
              </td>
          </tr>
          `
    })
    let menuFooter =
      `
      <tr>
          <td>
              <a href="#" class="discardAllBtn">刪除所有品項</a>
          </td>
          <td></td>
          <td></td>
          <td>
              <p>總金額</p>
          </td>
          <td>NT$ ${total}</td>
      </tr>
      `;
    menuListEl.innerHTML = meunTitle + menuList + menuFooter
    //刪除所有品項 button event
    const delAllBtn = document.querySelector('.discardAllBtn');
    delAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (menuData.length == 0) {
        alert('購物車中無品項');
      } else {
        deleteAllCartList();
      }
    })
    //個別產品刪除 button event
    menuData.forEach(arr => {
      const delBtn = document.querySelector('#delBtn_' + arr.id);
      delBtn.addEventListener('click', (e) => {
        e.preventDefault();
        deleteCartItem(arr.id);
      })
    })
  } else {
    console.log(data.message);
  }
}

/**
 * 產生option 1~10
 * @returns string
 */
function createOptionVal() {
  let optionVal = '<option selected>請選擇數量</option>';
  for (let i = 1; i <= 10; i++) {
    optionVal += `<option value="${i}">${i}</option>`
  }
  return optionVal;
}

/**
 * 檢核欄位及送出
 */
function validateFormAndSubmit() {
  const constraints = {
    姓名: {
      presence: {
        message: "是必填欄位"
      },
    },
    寄送地址: {
      presence: {
        message: "是必填欄位"
      },
    },
    電話: {
      presence: {
        message: "是必填欄位"
      },
    },
    Email: {
      presence: {
        message: "是必填欄位"
      },
      email: {
        message: "非正式格式"
      }
    }
  };
  const form = document.querySelector('.orderInfo-form');
  const btnSubmit = document.querySelector('.orderInfo-btn');
  btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    let errors = validate(form, constraints);
    if (errors) {
      Object.keys(errors).forEach(keys => {
        document.querySelector(`p[data-message=${keys}]`).textContent = errors[keys]
      })
    } else {
      const formData = new FormData(form);
      const userData = {
        name: formData.get('姓名'),
        tel: formData.get('電話'),
        email: formData.get('Email'),
        address: formData.get('寄送地址'),
        payment: formData.get('tradetype')
      }
      createOrder(userData);
    }
  })
}

/**
 * 產品下拉選單控制
 */
function productSelect() {
  const productSelect = document.querySelector('.productSelect');
  productSelect.addEventListener('change', () => {
    const selectValue = productSelect.value;
    let newCart = productList.products.filter(item => {
      return item.category == selectValue;
    })
    newCart = selectValue == '全部' ? productList.products : newCart;
    let newCartObj = {
      status:true,
      products:newCart
    }
    renderProductList(newCartObj);
  })
}
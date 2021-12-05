const api_path = "maohong";
const token = "GfOOlXzRlMVNPWTKmD0tN68Cjkp2";
let productList;
let productCartTemp;

//初始化
window.onload = function () {
  init();
}

function init() {
  getProductList();
  btnEvent();
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
          <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
          <h3>${item.title}</h3>
          <del class="originPrice">NT$${item.origin_price}</del>
          <p class="nowPrice">NT$${item.price}</p>
      </li>
      `;
    })
  }
  productWrapEl.innerHTML = itemContent;
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

// 改變購物車物品數量
/**
 * 
 * @param {*} id 
 * @param {*} quantity 
 */
function changeCartQuantity(id, quantity) {
  axios.patch(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    data: {
      "id": id,
      "quantity": parseInt(quantity)
    }
  }).
    then(function (response) {
      if (response.data.status) {
        alert('調整成功!');
      }
      renderCart(response.data);
    })
    .catch(error => {
      console.log(error);
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
        let data = {
          status: true,
          carts: []
        }
        renderCart(data);
        formReset();
      }
    })
    .catch(function (error) {
      console.log(error.response.data);
    })
}

function btnEvent() {
  const productTable = document.querySelector('.productDisplay');
  productTable.addEventListener('click', (e) => {
    e.preventDefault();
    let type = e.target.getAttribute('class');
    let id = e.target.getAttribute('data-id');
    if (type == 'addCardBtn') {
      // 這裡加入購物車數量暫時固定為1
      addCartItem(id, 1);
    }
  })
  const shoppingCartTable = document.querySelector('.shoppingCart-table');
  shoppingCartTable.addEventListener('click', (e) => {
    e.preventDefault();
    let type = e.target.getAttribute('class');
    let id = e.target.getAttribute('data-id');
    if (type) {
      if (type == 'discardAllBtn') {
        if (productCartTemp.length == 0) {
          alert('購物車中無品項');
        } else {
          deleteAllCartList();
        }
      } else if (type.indexOf("delBtn") != -1) {
        deleteCartItem(id);
      } else {
        return;
      }
    }

  })
  shoppingCartTable.addEventListener('change', (e) => {
    let type = e.target.getAttribute('class');
    let id = e.target.getAttribute('data-id');
    if (type = "form-select") {
      let value = e.target.value;
      if (value != '請選擇數量') {
        changeCartQuantity(id, value)
      }
    }
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
    productCartTemp = menuData;
    menuData.forEach(arr => {
      let product = arr.product;
      total += product.price;
      let optionVal = createOptionVal(arr.quantity);
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
                <select  class="form-select" data-id="${arr.id}" aria-label="Default select example" value="${arr.quantity}">
                  ${optionVal}
                </select>
              </td>
              <td>${product.price}</td>
              <td class="discardBtn">
                  <a href="#" class="material-icons delBtn" data-id="${arr.id}">
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
  } else {
    console.log(data.message);
  }
}

/**
 * 產生option 1~10
 * @returns string
 */
function createOptionVal(quantity) {
  let optionVal = '<option selected disabled>請選擇數量</option>';
  for (let i = 1; i <= 10; i++) {
    if (i == quantity) {
      optionVal += `<option value="${i}" selected="selected">${i}</option>`
    } else {
      optionVal += `<option value="${i}">${i}</option>`
    }
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
      status: true,
      products: newCart
    }
    renderProductList(newCartObj);
  })
}

function formReset() {
  const form = document.querySelector('.orderInfo-form');
  form.reset();
}
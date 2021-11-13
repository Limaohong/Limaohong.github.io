let travelData = [];

let nameArr = ['ticketName', 'ticketImgUrl', 'ticketRegion', 'ticketPrice', 'ticketNum', 'ticketRate', 'ticketDescription']
let tempData = [];
let tempState = [
    {
        'name':'inputText',
        'state':0
    },
    {
        'name':'regionSelect',
        'state':0
    },
];

//初始化
window.onload = function () {
    getExternalData();
}

/**
 * get inital data
 */
function getExternalData(){
    axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
    .then(response => {
        travelData = response.data.data;
        renderHTML();
    })
}

/**
 * render畫面
 */
function renderHTML (){
    messageHide();
    addTravelCard();
    evtControl();
}

/**
 * 事件控制
 */
function evtControl(){
    btnAddCard();
    regionSelect();
    inputTextSelect();
}

/**
 * 畫面初始card render/一般執行card render
 * @param {*} inputDataArr 
 */
function addTravelCard(inputDataArr) {
    const ulElement = document.querySelector('ul');
    let newDataContnet = '';
    let excuateArr = [];
    if(inputDataArr) {
        excuateArr = inputDataArr;
    } else {
        excuateArr = travelData;
        tempData = travelData;
    }
    while (ulElement.hasChildNodes()) {
        ulElement.removeChild(ulElement.firstChild);
    }
    if(excuateArr.length == 0) {
        document.querySelector('.cantFind-area').style.display = 'block';
    } else {
        document.querySelector('.cantFind-area').style.display = 'none';

        excuateArr.forEach(data => {
            newDataContnet +=
                `
            <li class="ticketCard">
                <div class="ticketCard-img">
                    <a href="#">
                    <img src="${data.imgUrl}" alt="">
                    </a>
                    <div class="ticketCard-region">${data.area}</div>
                    <div class="ticketCard-rank">${data.rate}</div>
                </div>
                <div class="ticketCard-content">
                    <div>
                    <h3>
                        <a href="#" class="ticketCard-name">${data.name}</a>
                    </h3>
                    <p class="ticketCard-description">
                        ${data.description}
                    </p>
                    </div>
                    <div class="ticketCard-info">
                    <p class="ticketCard-num">
                        <span><i class="fas fa-exclamation-circle"></i></span>
                        剩下最後 <span id="ticketCard-num"> ${data.group} </span> 組
                    </p>
                    <p class="ticketCard-price">
                        TWD <span id="ticketCard-price">$${data.price}</span>
                    </p>
                    </div>
                </div>
            </li>`;
        })
        ulElement.innerHTML += newDataContnet;
    }
    
}

/**
 * button click
 */
function btnAddCard() {
    let addBtn = document.getElementById('addCard');
    const ulElement = document.querySelector('ul');
    addBtn.addEventListener('click', (e) => {
        const ticketName = document.querySelector('#ticketName').value;
        const ticketImgUrl = document.querySelector('#ticketImgUrl').value;
        const ticketRegion = document.querySelector('#ticketRegion').value;
        const ticketPrice = document.querySelector('#ticketPrice').value;
        const ticketNum = document.querySelector('#ticketNum').value;
        const ticketRate = document.querySelector('#ticketRate').value;
        const ticketDescription = document.querySelector('#ticketDescription').value;

        if (inputVerify()) {
            let newDataContnet =
                `
            <li class="ticketCard">
                <div class="ticketCard-img">
                    <a href="#">
                    <img src="${ticketImgUrl}" alt="">
                    </a>
                    <div class="ticketCard-region">${ticketRegion}</div>
                    <div class="ticketCard-rank">${ticketRate}</div>
                </div>
                <div class="ticketCard-content">
                    <div>
                    <h3>
                        <a href="#" class="ticketCard-name">${ticketName}</a>
                    </h3>
                    <p class="ticketCard-description">
                        ${ticketDescription}
                    </p>
                    </div>
                    <div class="ticketCard-info">
                    <p class="ticketCard-num">
                        <span><i class="fas fa-exclamation-circle"></i></span>
                        剩下最後 <span id="ticketCard-num"> ${ticketNum} </span> 組
                    </p>
                    <p class="ticketCard-price">
                        TWD <span id="ticketCard-price">$${ticketPrice}</span>
                    </p>
                    </div>
                </div>
            </li>`;
            ulElement.innerHTML += newDataContnet;

            let travelDataLen = travelData.length;
            let travelDataObj = {
                "id": travelDataLen,
                "name": ticketName,
                "imgUrl": ticketImgUrl,
                "area": ticketRegion,
                "description": ticketDescription,
                "group": ticketName,
                "price": ticketPrice,
                "rate": ticketRate,
            }
            travelData.push(travelDataObj);
        }

    })
}

/**
 * 必填(錯誤訊息)提示
 */
function inputVerify() {
    let flag = true;
    nameArr.forEach(item => {
        const itemVal = document.querySelector('#' + item).value;
        if (!itemVal) {
            flag = false;
            document.querySelector('#i_' + item).style.display = 'block';
        }
    })
    return flag;
}
/**
 * 執行card render function && 改變搜尋筆數
 * @param {*} cardArray 
 */
function renderCard(cardArray) {
    if(cardArray.length >= 1) {
        tempData = cardArray;
    }
    let searchResultText = document.getElementById('searchResult-text');
    searchResultText.textContent = `本次搜尋共 ${cardArray.length} 筆資料`;
    addTravelCard(cardArray);
}

/**
 * 地區選擇事件
 */
function regionSelect() {
    const regionSearch = document.querySelector('.regionSearch');
    regionSearch.addEventListener('change', (e) => {
        let area = e.target.value;
        let state = 0;
        tempState.forEach(data => {
            if(area != 'ALL') {
                if(data['name'] == 'regionSelect'){
                    data['state'] = 1;
                }
            } else {
                if(data['name'] == 'regionSelect'){
                    data['state'] = 0;
                }
            }
            state += data['state'];
        })
        if(state <= 1) {
            tempData = travelData
        }
        let rtnArr = tempData.filter(data => {
            return area =='ALL'?tempData:data['area'] == area
        })
        if(area == 'ALL') {
            let textSearch = document.getElementById('searchInput');
            triggerEvt(textSearch,'keyup');
            rtnArr = tempData;
        }
        renderCard(rtnArr);
    })
}
/**
 * input打字事件
 */
function inputTextSelect() {
    let textSearch = document.getElementById('searchInput');
    textSearch.addEventListener('keyup', (e) => {
        let inputText = e.target.value;
        let state = 0;
        tempState.forEach(data => {
            if(inputText != '') {
                if(data['name'] == 'inputText'){
                    data['state'] = 1;
                }
            } else {
                if(data['name'] == 'inputText'){
                    data['state'] = 0;
                }
            }
            state += data['state'];
        })
        if(state <= 1) {
            tempData = travelData
        }
        let rtnArr = tempData.filter(data => {
            return data.name.includes(inputText);
        })
        if(inputText == '') {
            const regionSearch = document.querySelector('.regionSearch');
            triggerEvt(regionSearch,'change');
            rtnArr = tempData;
        }
        renderCard(rtnArr);
    })
}

/**
 * 畫面初始化影藏alert message
 */
function messageHide() {
    nameArr.forEach(item => {
        document.querySelector('#i_' + item).style.display = 'none';
    })
}

/**
 * 觸發change事件
 * @param {*} el 
 */
function triggerEvt(el,event){
    let evt = new Event(event,{})
    el.dispatchEvent(evt);
}

let travelData = [
    {
        "id": 0,
        "name": "肥宅心碎賞櫻3日",
        "imgUrl": "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80",
        "area": "高雄",
        "description": "賞櫻花最佳去處。肥宅不得不去的超讚景點！",
        "group": 87,
        "price": 1400,
        "rate": 10
    },
    {
        "id": 1,
        "name": "貓空纜車雙程票",
        "imgUrl": "https://images.unsplash.com/photo-1501393152198-34b240415948?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
        "area": "台北",
        "description": "乘坐以透明強化玻璃為地板的「貓纜之眼」水晶車廂，享受騰雲駕霧遨遊天際之感",
        "group": 99,
        "price": 240,
        "rate": 2
    },
    {
        "id": 2,
        "name": "台中谷關溫泉會1日",
        "imgUrl": "https://images.unsplash.com/photo-1535530992830-e25d07cfa780?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
        "area": "台中",
        "description": "全館客房均提供谷關無色無味之優質碳酸原湯，並取用八仙山之山冷泉供蒞臨貴賓沐浴及飲水使用。",
        "group": 20,
        "price": 1765,
        "rate": 7
    }
];

let nameArr = ['ticketName', 'ticketImgUrl', 'ticketRegion', 'ticketPrice', 'ticketNum', 'ticketRate', 'ticketDescription']

//初始化
window.onload = function () {
    test();
    addTravelCard();
    addCard();
    selectChange();
}

function addTravelCard(inputDataArr) {
    let ulElement = document.querySelector('ul');
    let newDataContnet = '';
    let excuateArr = [];
    inputDataArr ? excuateArr = inputDataArr : excuateArr = travelData;
    while (ulElement.hasChildNodes()) {
        ulElement.removeChild(ulElement.firstChild);
    }
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

function addCard() {
    let addBtn = document.getElementById('addCard');
    let ulElement = document.querySelector('ul');
    addBtn.addEventListener('click', (e) => {
        let ticketName = document.querySelector('#ticketName').value;
        let ticketImgUrl = document.querySelector('#ticketImgUrl').value;
        let ticketRegion = document.querySelector('#ticketRegion').value;
        let ticketPrice = document.querySelector('#ticketPrice').value;
        let ticketNum = document.querySelector('#ticketNum').value;
        let ticketRate = document.querySelector('#ticketRate').value;
        let ticketDescription = document.querySelector('#ticketDescription').value;

        if(inputVerify()){
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

function inputVerify(){
    let flag = true;
    nameArr.forEach(item => {
        let itemVal = document.querySelector('#'+item).value;
        if(!itemVal) {
            flag = false;
            document.querySelector('#i_'+item).style.display = 'block';
        }
    })
    return flag;
}

function selectChange() {
    let regionSearch = document.querySelector('.regionSearch');
    regionSearch.addEventListener('change', (e) => {
        let selectDataArr = [];
        travelData.forEach(data => {
            let area = e.target.value;
            if (area == 'ALL') {
                selectDataArr = travelData;
            } else if (data['area'] == area) {
                selectDataArr.push(data);
            }
        })
        let searchResultText = document.getElementById('searchResult-text');
        searchResultText.textContent = `本次搜尋共 ${selectDataArr.length} 筆資料`;
        addTravelCard(selectDataArr);
    })
}

function test() {
    nameArr.forEach(item => {
        document.querySelector('#i_'+item).style.display = 'none';
    })
}
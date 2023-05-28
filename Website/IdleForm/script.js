// Гости
let guests_s = '1 Взрослый,|без детей';
let guests_o = '1 номер|для 1 гостя';

// Инициализация AirDatePicker
const day1 = new Date()
let day2 =  new Date()
day2.setDate(day1.getDate() + 2)

new AirDatepicker('#airdatepicker', {
    isMobile: true,
    autoClose: true,
    range: true,
    multipleDatesSeparator: " - ",
    selectedDates: [day1, day2],
    minDate: new Date()
});


// Инициализация Slider
function initSlider(rangeSlider_min, rangeSlider_max){
    localStorage.setItem('slidermin', rangeSlider_min);
    localStorage.setItem('slidermax', rangeSlider_max);
    document.querySelector('#RangeSlider .range-slider-val-left').style.width = `${rangeSlider_min + (100 - rangeSlider_max)}%`;
    document.querySelector('#RangeSlider .range-slider-val-right').style.width = `${rangeSlider_min + (100 - rangeSlider_max)}%`;

    document.querySelector('#RangeSlider .range-slider-val-range').style.left = `${rangeSlider_min}%`;
    document.querySelector('#RangeSlider .range-slider-val-range').style.right = `${(100 - rangeSlider_max)}%`;

    document.querySelector('#RangeSlider .range-slider-handle-left').style.left = `${rangeSlider_min}%`;
    document.querySelector('#RangeSlider .range-slider-handle-right').style.left = `${rangeSlider_max}%`;

    document.querySelector('#RangeSlider .range-slider-input-left').value = rangeSlider_min;
    document.querySelector('#RangeSlider .range-slider-input-left').addEventListener( 'input', e => {
        e.target.value = Math.min(e.target.value, e.target.parentNode.childNodes[5].value - 2);
        var value = (100 / ( parseInt(e.target.max) - parseInt(e.target.min) )) * parseInt(e.target.value) - (100 / (parseInt(e.target.max) - parseInt(e.target.min) )) * parseInt(e.target.min);
        var children = e.target.parentNode.childNodes[1].childNodes;
        children[1].style.width = `${value}%`;
        children[5].style.left = `${value}%`;
        children[7].style.left = `${value}%`;
        localStorage.setItem('slidermin', e.target.value);
        if (e.target.value < 1){
            document.getElementById("price1").value = 250;
        } else{
            document.getElementById("price1").value = e.target.value * 250;
        }
    });
    document.querySelector('#RangeSlider .range-slider-input-right').value = rangeSlider_max;
    document.querySelector('#RangeSlider .range-slider-input-right').addEventListener( 'input', e => {
        e.target.value = Math.max(e.target.value, e.target.parentNode.childNodes[3].value - (-2));
        var value = (100 / ( parseInt(e.target.max) - parseInt(e.target.min) )) * parseInt(e.target.value) - (100 / ( parseInt(e.target.max) - parseInt(e.target.min) )) * parseInt(e.target.min);
        var children = e.target.parentNode.childNodes[1].childNodes;
        children[3].style.width = `${100-value}%`;
        children[5].style.right = `${100-value}%`;
        children[9].style.left = `${value}%`;
        localStorage.setItem('slidermax', e.target.value);
        document.getElementById("price2").value = e.target.value * 250;
    });
}

function setMinSlider(el){
    let min = parseInt(el.value);
    let max = parseInt(localStorage.getItem('slidermax'));
    if (100 <= min && min <= 25000) {
        min = Math.floor(min / 250);
    } else {
        min = 96;
    }
    if (max - min < 4){
        if (max <= 96){
            while (max - min < 4){
                max = max + 1;
            }
        } else{
            while (max - min < 4){
                min = min - 1;
            }
        }
    }
    localStorage.setItem('slidermin', min);
    localStorage.setItem('slidermax', max);
    if (parseInt(el.value) >= parseInt(document.getElementById('price2').value) || parseInt(el.value) < 250) {
        document.getElementById("price1").style.borderColor = 'red';
        return;
    }
    initSlider(min, max);
}

function setMaxSlider(el){
    let max = parseInt(el.value);
    let min = parseInt(localStorage.getItem('slidermin'));
    if (100 <= max && max < 25000) {
        max = Math.ceil(max / 250);
    } else {
        max = 100;
    }
    if (max - min < 4){
        if (max <= 96){
            while (max - min < 4){
                max = max + 1;
            }
        } else{
            while (max - min < 4){
                min = min - 1;
            }
        }
    }
    localStorage.setItem('slidermin', min);
    localStorage.setItem('slidermax', max);
    if (parseInt(el.value) <= parseInt(document.getElementById('price1').value) || parseInt(el.value) < 260) {
        document.getElementById("price2").style.borderColor = 'red';
        return;
    }
    initSlider(min, max);
}


// Функции для окна выбора количества человек
function adultMinus(){  //Удалить взрослого
    let count = parseInt(document.getElementById("adults").innerHTML.split(" Взрослый")[0].split(" Взрослых")[0]);
    if (count > 1)
    {
        count = count - 1;
        if (count % 10 == 1 && count != 11){
            document.getElementById("adults").innerHTML = count + " Взрослый";
            let name = count + " Взрослый";
            localStorage.setItem('sel', name);
            document.getElementById("font2").innerHTML = count + " Взрослый, ";
        }
        else{
            document.getElementById("adults").innerHTML = count + " Взрослых";
            let name = count + " Взрослых";
            localStorage.setItem('sel', name);
            document.getElementById("font2").innerHTML = count + " Взрослых, ";
        }
    }
}

function adultPlus(){ //Добавить взрослого
    let count = parseInt(document.getElementById("adults").innerHTML.split(" Взрослый")[0].split(" Взрослых")[0]);
    if (count < 100)
    {
        count = count + 1;
        if (count % 10 == 1 && count != 11){
            document.getElementById("adults").innerHTML = count + " Взрослый";
            let name = count + " Взрослый";
            localStorage.setItem('sel', name);
            document.getElementById("font2").innerHTML = count + " Взрослый, ";
        }
        else{
            document.getElementById("adults").innerHTML = count + " Взрослых";
            let name = count + " Взрослых";
            localStorage.setItem('sel', name);
            document.getElementById("font2").innerHTML = count + " Взрослых, ";
        }
    }
}

let countOfChild;
function deleteChild(el){ //Удалить ребенка
    countOfChild = countOfChild - 1;
    var element = el;
    name = "selchild" + element.id.split('close')[1];
    var block = document.getElementById(name);
    block.remove();
    el.remove();
}

function addChild(){ //Добавить ребенка
    if (countOfChild != null && countOfChild > 0){
        let name = countOfChild.toString();
        if (document.getElementById("selchild" + name).value !== 'Выберите возраст'){
            name = "chb" + name;
            countOfChild = countOfChild + 1;
            document.getElementById(name).insertAdjacentHTML("afterend", `<div class='chb' id='chb${countOfChild}'><div class='close' id='close${countOfChild}' onclick='javascript:deleteChild(this)'></div><select class='selo' id='selchild${countOfChild}'><option value='Выберите возраст' disabled selected hidden>Выберите возраст</option><option>Ребёнок, до года</option><option>Ребёнок, 1 год</option><option>Ребёнок, 2 года</option><option>Ребёнок, 3 года</option><option>Ребёнок, 4 года</option><option>Ребёнок, 5 лет</option><option>Ребёнок, 6 лет</option><option>Ребёнок, 7 лет</option><option>Ребёнок, 8 лет</option><option>Ребёнок, 9 лет</option><option>Ребёнок, 10 лет</option><option>Ребёнок, 11 лет</option><option>Ребёнок, 12 лет</option><option>Ребёнок, 13 лет</option><option>Ребёнок, 14 лет</option><option>Ребёнок, 15 лет</option><option>Ребёнок, 16 лет</option><option>Ребёнок, 17 лет</option></select></div>`);
        }
    }
    else{
        countOfChild = 1;
        document.getElementById("childs").innerHTML += `<div class='chb' id='chb${countOfChild}'><div class='close' id='close${countOfChild}' onclick='javascript:deleteChild(this)'></div><select class='selo' id='selchild${countOfChild}'><option value='Выберите возраст' disabled selected hidden>Выберите возраст</option><option>Ребёнок, до года</option><option>Ребёнок, 1 год</option><option>Ребёнок, 2 года</option><option>Ребёнок, 3 года</option><option>Ребёнок, 4 года</option><option>Ребёнок, 5 лет</option><option>Ребёнок, 6 лет</option><option>Ребёнок, 7 лет</option><option>Ребёнок, 8 лет</option><option>Ребёнок, 9 лет</option><option>Ребёнок, 10 лет</option><option>Ребёнок, 11 лет</option><option>Ребёнок, 12 лет</option><option>Ребёнок, 13 лет</option><option>Ребёнок, 14 лет</option><option>Ребёнок, 15 лет</option><option>Ребёнок, 16 лет</option><option>Ребёнок, 17 лет</option></select></div>`;
    }
}

//Для островка
function O_RemoveAdult(el){
    let current = parseInt(document.getElementById("count"+el.id[el.id.length - 1]).innerHTML);
    if (current > 1) {
        document.getElementById("count"+el.id[el.id.length - 1]).innerHTML = current - 1;
    }
    else {
        return false;
    }
    if (current == 2) {
        el.style.color = 'lightgray';
    }
    if (current == 6) {
        document.getElementById("add"+el.id[el.id.length - 1]).style.color = 'gray';
    }
}

function O_AddAdult(el){
    let current = parseInt(document.getElementById("count"+el.id[el.id.length - 1]).innerHTML);
    if (current < 6) {
        document.getElementById("count"+el.id[el.id.length - 1]).innerHTML = current + 1;
    }
    else {
        return false;
    }
    if (current == 5) {
        el.style.color = 'lightgray';
    }
    if (current == 1) {
        document.getElementById("remove"+el.id[el.id.length - 1]).style.color = 'gray';
    }
}

function ChildRemoved(el){
    if (el.parentElement.getElementsByClassName('child_panel').length == 1){
        el.parentElement.innerHTML = '<label class="but1_child">Добавить<select onchange="ChildAdded(this)"><option value="Выберите возраст" selected hidden>Выберите возраст</option><option value="0 лет">До года</option><option value="1 год">1 год</option><option value="2 года">2 года</option><option value="3 года">3 года</option><option value="4 года">4 года</option><option value="5 лет">5 лет</option><option value="6 лет">6 лет</option><option value="7 лет">7 лет</option><option value="8 лет">8 лет</option><option value="9 лет">9 лет</option><option value="10 лет">10 лет</option><option value="11 лет">11 лет</option><option value="12 лет">12 лет</option><option value="13 лет">13 лет</option><option value="14 лет">14 лет</option><option value="15 лет">15 лет</option><option value="16 лет">16 лет</option><option value="17 лет">17 лет</option></select></label>';
    }
    else if (el.parentElement.getElementsByClassName('child_panel').length == 4){
        var to_past = document.createElement('label');
        to_past.className = "but_child";
        to_past.innerHTML = '+<select onchange="ChildAdded(this)"><option value="Выберите возраст" selected hidden>Выберите возраст</option><option value="0 лет">До года</option><option value="1 год">1 год</option><option value="2 года">2 года</option><option value="3 года">3 года</option><option value="4 года">4 года</option><option value="5 лет">5 лет</option><option value="6 лет">6 лет</option><option value="7 лет">7 лет</option><option value="8 лет">8 лет</option><option value="9 лет">9 лет</option><option value="10 лет">10 лет</option><option value="11 лет">11 лет</option><option value="12 лет">12 лет</option><option value="13 лет">13 лет</option><option value="14 лет">14 лет</option><option value="15 лет">15 лет</option><option value="16 лет">16 лет</option><option value="17 лет">17 лет</option></select>';
        el.parentElement.appendChild(to_past);
        el.remove();
    }
    else{
        el.remove();
    }
}

function ChildAdded(el){
    if (el.parentElement.parentElement.getElementsByClassName('child_panel').length == 0){
        el.parentElement.parentElement.innerHTML = '<div class="child_panel">' + el.value + '<img class="cross_child" src="akar-icons_cross.svg" onclick="ChildRemoved(this.parentNode);"></div>' + '<label class="but_child">+<select onchange="ChildAdded(this)"><option value="Выберите возраст" selected hidden>Выберите возраст</option><option value="0 лет">До года</option><option value="1 год">1 год</option><option value="2 года">2 года</option><option value="3 года">3 года</option><option value="4 года">4 года</option><option value="5 лет">5 лет</option><option value="6 лет">6 лет</option><option value="7 лет">7 лет</option><option value="8 лет">8 лет</option><option value="9 лет">9 лет</option><option value="10 лет">10 лет</option><option value="11 лет">11 лет</option><option value="12 лет">12 лет</option><option value="13 лет">13 лет</option><option value="14 лет">14 лет</option><option value="15 лет">15 лет</option><option value="16 лет">16 лет</option><option value="17 лет">17 лет</option></select></label>';
    } else if (el.parentElement.parentElement.getElementsByClassName('child_panel').length < 3){
        el.parentElement.parentElement.innerHTML = '<div class="child_panel">' + el.value + '<img class="cross_child" src="akar-icons_cross.svg" onclick="ChildRemoved(this.parentNode);"></div>' + el.parentElement.parentElement.innerHTML;
    } else if (el.parentElement.parentElement.getElementsByClassName('child_panel').length == 3){
        html_to_past = '<div class="child_panel">' + el.value + '<img class="cross_child" src="akar-icons_cross.svg" onclick="ChildRemoved(this.parentNode);"></div>';
        el.parentElement.parentElement.innerHTML = html_to_past + el.parentElement.parentElement.innerHTML.split('<label class="but_child">')[0];
    }
}

function RemoveRoom(el){
    let temp = el.innerHTML.split(' Номер')[0];
    document.getElementById("room"+temp).remove();
    el.remove();
    let list = document.getElementsByClassName("room");
    for (let i = parseInt(temp)+1; i <= list.length+1; i++) {
        document.getElementById("room"+i).previousElementSibling.innerHTML = (i-1).toString() + ' Номер<span class="remove_room" onclick="RemoveRoom(this.parentElement)">Удалить</span>';
        document.getElementById("room"+i).innerHTML = document.getElementById("room"+i).innerHTML.replace('remove'+i, 'remove'+(i-1).toString()).replace('add'+i, 'add'+(i-1).toString()).replace('count'+i, 'count'+(i-1).toString());
        document.getElementById("room"+i).id = "room"+(i-1).toString();
    }
    if (temp == '9'){
        const newNode = document.createElement("div");
        newNode.className = 'addroom';
        newNode.id = 'addroom';
        newNode.onclick = function () {
            RoomAdd(this);
        };
        newNode.innerHTML += '+ Добавить номер';
        const list2 = document.getElementById("selector_o");
        list2.insertBefore(newNode, document.getElementById("selectready_o"));
    }
}


function RoomAdd(el){
    let item = `<div class="r_adults">
            Взрослые
            <div class="input_adults">
                <div class="but_remove" id="remove1" onclick="javascript:O_RemoveAdult(this)">–</div>
                <div class="o_adults" id="count1">1</div>
                <div class="but_add" id="add1" onclick="javascript:O_AddAdult(this)">+</div>
            </div>
        </div>
        <div class="r_children">
            Дети
            <div class="input_children">
                <label class="but1_child">Добавить<select onchange="ChildAdded(this)">
                <option value="Выберите возраст" selected hidden>Выберите возраст</option>
                <option value="0 лет">До года</option>
                <option value="1 год">1 год</option>
                <option value="2 года">2 года</option>
                <option value="3 года">3 года</option>
                <option value="4 года">4 года</option>
                <option value="5 лет">5 лет</option>
                <option value="6 лет">6 лет</option>
                <option value="7 лет">7 лет</option>
                <option value="8 лет">8 лет</option>
                <option value="9 лет">9 лет</option>
                <option value="10 лет">10 лет</option>
                <option value="11 лет">11 лет</option>
                <option value="12 лет">12 лет</option>
                <option value="13 лет">13 лет</option>
                <option value="14 лет">14 лет</option>
                <option value="15 лет">15 лет</option>
                <option value="16 лет">16 лет</option>
                <option value="17 лет">17 лет</option>
            </select></label>
            </div>
        </div>`;
    const newNode = document.createElement("div");
    newNode.className = 'room';
    let count = el.parentElement.getElementsByClassName('room').length + 1;
    newNode.innerHTML = item.replace('remove1', 'remove'+count.toString()).replace('count1', 'count'+count.toString()).replace('add1', 'add'+count.toString());
    newNode.id = 'room'+count.toString();
    el.parentElement.appendChild(newNode);

    const list = document.getElementById("selector_o");
    list.insertBefore(newNode, document.getElementById("addroom"));
    const label = document.createElement("label");
    label.style = "font-weight: 700; justify-content: space-between; display: flex; margin-right: 10px; font-family: Inter; margin-left: 10px; margin-top: 10px; margin-bottom: 5px; letter-spacing: 0.02em;";
    label.innerHTML = count.toString() + ' Номер<span class="remove_room" onclick="RemoveRoom(this.parentElement)">Удалить</span>';
    list.insertBefore(label, newNode);
    if (el.parentElement.getElementsByClassName('room').length == 9){
        document.getElementById("addroom").remove();
    }
}
//

// Показать поле для выбора станций
if (localStorage.getItem('gorod') == 'Москва' && localStorage.getItem('service') == 'Суточно'){
    $('#metroform').show();
}
else {
    $('#metroform').hide();
}

let metro = [];
function removeStation(el) {  // Удалить панель станции
    var element = el;
    element.remove();
    metro.splice(metro.indexOf(availableStationNumbers[availableStations.indexOf(el.id)]), 1);
}

let linesNumbers = [  // Номера станций для каждой ветки метро Москвы
    '162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,2145,2159,2247,2249',
    '117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,2119,2200,2233',
    '182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203',
    '204,205,206,207,208,209,210,211,212,213,214,215,216',
    '265,266,267,268,269,270,271,272,273,274,275,276',
    '138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161',
    '242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264',
    '107,108,109,110,111,112,113,114,116,2093,2095,2125,2182,2194,2196,2198,2208,2210,2212,2214,2216,2218,2220,2237',
    '217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241',
    '277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,2139,2141,2177,2202,2204,2206',
    '297,298,299,300,301,302,303',
    '2184,2186,2188,2190,2192,2235',
    '2103,2105,2107,2109,2111,2113,2115,2117,2121,2123,2127,2129,2131,2133,2135,2137,2143,2147,2149,2151,2153,2155,2157,2161,2163,2165,2167,2169,2171,2173,2175',
    '2239,2241,2243,2245',
    '294,295,296'
];

function getLines() {  // Получить id всех станций по отмеченным веткам метро
    let items = document.getElementsByClassName('custom-checkbox');
    let stations = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i].checked == true) {
            stations.push(linesNumbers[items[i].id-1]);
        }
    }
    return stations;
}

function getLinesId() {  // Получить id отмеченных веток метро
    let items = document.getElementsByClassName('custom-checkbox');
    let lines = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i].checked == true) {
            lines.push(items[i].id);
        }
    }
    return lines;
}

// Границы блоков цены
document.getElementById('price1').oninput = function() {
    document.getElementById("price1").style.borderColor = '#D8D8D8';
    document.getElementById("price2").style.borderColor = '#D8D8D8';
}
document.getElementById('price2').oninput = function() {
    document.getElementById("price1").style.borderColor = '#D8D8D8';
    document.getElementById("price2").style.borderColor = '#D8D8D8';
}


//Автозаполнение (подсказки) для станций метро
function autocompleteStations(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                    let name = this.getElementsByTagName("input")[0].value;
                    if (!document.getElementById(name)) {
                        metro.push(availableStationNumbers[availableStations.indexOf(name)]);
                        let block = document.getElementById('list');
                        block.innerHTML += `<button id="${name}" onclick="removeStation(this)" type="button">${name}</button>`;
                    }
                    inp.value = "";
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

// Названия станций
var availableStations = [
    'Авиамоторная',
	'Автозаводская',
	'Академическая',
	'Александровский сад',
	'Алексеевская',
	'Алма-Атинская',
	'Алтуфьево',
	'Андроновка',
	'Аникеевка',
	'Аннино',
	'Арбатская',
	'Аэропорт',
	'Бабушкинская',
	'Багратионовская',
	'Баковка',
	'Балтийская',
	'Баррикадная',
	'Бауманская',
	'Беговая',
	'Белокаменная',
	'Беломорская',
	'Белорусская',
	'Беляево',
	'Бескудниково',
	'Бибирево',
	'Библиотека им. Ленина',
	'Битца',
	'Битцевский парк',
	'Борисово',
	'Боровицкая',
	'Боровское шоссе',
	'Ботанический сад',
	'Братиславская',
	'Бульвар Адмирала Ушакова',
	'Бульвар Дмитрия Донского',
	'Бульвар Рокоссовского',
	'Бунинская аллея',
	'Бутово',
	'Бутырская',
	'Варшавская',
	'ВДНХ',
	'Верхние котлы',
	'Верхние Лихоборы',
	'Владыкино',
	'Водники',
	'Водный стадион',
	'Войковская',
	'Волгоградский проспект',
	'Волжская',
	'Волоколамская',
	'Воробьевы горы',
	'Выставочная',
	'Выхино',
	'Говорово',
	'Гражданская',
	'Дегунино',
	'Деловой центр',
	'Депо',
	'Динамо',
	'Дмитровская',
	'Добрынинская',
	'Долгопрудная',
	'Домодедовская',
	'Достоевская',
	'Дубровка',
	'Жулебино',
	'ЗИЛ',
	'Зорге',
	'Зябликово',
	'Измайлово',
	'Измайловская',
	'Калитники',
	'Калужская',
	'Кантемировская',
	'Каховская',
	'Каширская',
	'Киевская',
	'Китай-город',
	'Кожуховская',
	'Коломенская',
	'Коммунарка',
	'Комсомольская',
	'Коньково',
	'Коптево',
	'Косино',
	'Котельники',
	'Красногвардейская',
	'Красногорская',
	'Краснопресненская',
	'Красносельская',
	'Красные ворота',
	'Красный Балтиец',
	'Красный Строитель',
	'Крестьянская застава',
	'Кропоткинская',
	'Крылатское',
	'Крымская',
	'Кузнецкий мост',
	'Кузьминки',
	'Кунцевская',
	'Курская',
	'Кутузовская',
	'Ленинский проспект',
	'Лермонтовский проспект',
	'Лесопарковая',
	'Лианозово',
	'Лихоборы',
	'Лобня',
	'Локомотив',
	'Ломоносовский проспект',
	'Лубянка',
	'Лужники',
	'Лухмановская',
	'Люблино',
	'Марк',
	'Марксистская',
	'Марьина роща',
	'Марьино',
	'Маяковская',
	'Медведково',
	'Международная',
	'Менделеевская',
	'Минская',
	'Митино',
	'Мичуринский проспект',
	'Молодежная',
	'Москва-Товарная',
	'Москворечье',
	'Мякинино',
	'Нагатинская',
	'Нагорная',
	'Нахабино',
	'Нахимовский проспект',
	'Некрасовка',
	'Немчиновка',
	'Нижегородская',
	'Новогиреево',
	'Новодачная',
	'Новокосино',
	'Новокузнецкая',
	'Новопеределкино',
	'Новослободская',
	'Новохохловская',
	'Новоясеневская',
	'Новые Черемушки',
	'Одинцово',
	'Озерная',
	'Окружная',
	'Октябрьская',
	'Октябрьское поле',
	'Ольховая',
	'Опалиха',
	'Орехово',
	'Остафьево',
	'Отрадное',
	'Охотный ряд',
	'Павелецкая',
	'Павшино',
	'Панфиловская',
	'Парк Культуры',
	'Парк Победы',
	'Партизанская',
	'Пенягино',
	'Первомайская',
	'Перерва',
	'Перово',
	'Петровский Парк',
	'Петровско-Разумовская',
	'Печатники',
	'Пионерская',
	'Планерная',
	'Площадь Гагарина',
	'Площадь Ильича',
	'Площадь Революции',
	'Подольск',
	'Покровское',
	'Полежаевская',
	'Полянка',
	'Пражская',
	'Преображенская площадь',
	'Прокшино',
	'Пролетарская',
	'Проспект Вернадского',
	'Проспект Мира',
	'Профсоюзная',
	'Пушкинская',
	'Пятницкое шоссе',
	'Рабочий поселок',
	'Раменки',
	'Рассказовка',
	'Речной вокзал',
	'Рижская',
	'Римская',
	'Ростокино',
	'Румянцево',
	'Рязанский проспект',
	'Савеловская',
	'Саларьево',
	'Свиблово',
	'Севастопольская',
	'Селигерская',
	'Семеновская',
	'Серпуховская',
	'Сетунь',
	'Силикатная',
	'Сколково',
	'Славянский бульвар',
	'Смоленская',
	'Сокол',
	'Соколиная гора',
	'Сокольники',
	'Солнцево',
	'Спартак',
	'Спортивная',
	'Сретенский бульвар',
	'Стрешнево',
	'Строгино',
	'Студенческая',
	'Сухаревская',
	'Сходненская',
	'Таганская',
	'Тверская',
	'Театральная',
	'Текстильщики',
	'Теплый Стан',
	'Тестовская',
	'Технопарк',
	'Тимирязевская',
	'Третьяковская',
	'Трикотажная',
	'Тропарево',
	'Трубная',
	'Тульская',
	'Тургеневская',
	'Тушинская',
	'Угрешская',
	'Улица 1905 года',
	'Улица Академика Янгеля',
	'Улица Горчакова',
	'Улица Дмитриевского',
	'Улица Скобелевская',
	'Улица Старокачаловская',
	'Университет',
	'Филатов Луг',
	'Филевский парк',
	'Фили',
	'Фонвизинская',
	'Фрунзенская',
	'Хлебниково',
	'Ховрино',
	'Хорошево',
	'Хорошевская',
	'Царицыно',
	'Цветной бульвар',
	'ЦСКА',
	'Черкизовская',
	'Чертановская',
	'Чеховская',
	'Чистые пруды',
	'Чкаловская',
	'Шаболовская',
	'Шелепиха',
	'Шереметьевская',
	'Шипиловская',
	'Шоссе Энтузиастов',
	'Щелковская',
	'Щербинка',
	'Щукинская',
	'Электрозаводская',
	'Юго-Западная',
	'Южная',
	'Ясенево'
];
// Id станций
var availableStationNumbers = [
    '111',
	'129,2169',
	'153',
	'214',
	'143',
	'137',
	'217',
	'2135',
	'1202',
	'240',
	'191,213',
	'121',
	'139',
	'207',
	'1127',
	'2127',
	'251',
	'188',
	'249',
	'2143',
	'2233',
	'123,276',
	'157',
	'1110',
	'218',
	'172',
	'1233',
	'303',
	'291',
	'228',
	'2216',
	'141,2161',
	'289',
	'299',
	'241',
	'162,2175',
	'297',
	'1234',
	'2139',
	'295',
	'142',
	'2123',
	'2204',
	'220,2163',
	'1104',
	'118',
	'119',
	'257',
	'287',
	'201',
	'177',
	'215',
	'261',
	'2212',
	'1213',
	'1111',
	'216,2165',
	'1225',
	'122',
	'223',
	'271',
	'1105',
	'135',
	'278',
	'284,2171',
	'263',
	'2121',
	'2113',
	'293',
	'2103',
	'184',
	'1220',
	'156',
	'132',
	'296',
	'131,294',
	'193,274,211',
	'148,254',
	'285',
	'130',
	'273',
	'167,267',
	'158',
	'2131',
	'2239',
	'264',
	'136',
	'1204',
	'275',
	'166',
	'168',
	'1212',
	'1232',
	'283',
	'173',
	'198',
	'2107',
	'253',
	'259',
	'196,204',
	'190,268',
	'209,2167',
	'152',
	'262',
	'302',
	'1108',
	'2155',
	'1101',
	'2109',
	'2095',
	'170',
	'2133',
	'2243',
	'288',
	'1107',
	'113',
	'277',
	'290',
	'124',
	'138',
	'216',
	'225',
	'2093',
	'202',
	'2208',
	'197',
	'1219',
	'1228',
	'200',
	'232',
	'233',
	'1201',
	'234',
	'2245',
	'1125',
	'2137',
	'108',
	'1106',
	'107',
	'127',
	'2218',
	'265',
	'2147',
	'161',
	'155',
	'1128',
	'2210',
	'2157,1112,2202',
	'150,272',
	'247',
	'272',
	'1203',
	'134',
	'1236',
	'219',
	'171',
	'270,128',
	'1205',
	'2115',
	'174',
	'116,194',
	'185',
	'1206',
	'183',
	'1226',
	'109',
	'2192,2198',
	'221,2177',
	'286',
	'205',
	'242',
	'2105',
	'112',
	'189',
	'1238',
	'1231',
	'248',
	'229',
	'238',
	'164',
	'2249',
	'256',
	'179',
	'145,266',
	'154',
	'252',
	'203',
	'1123',
	'2125',
	'2220',
	'117',
	'144',
	'282',
	'2117',
	'2145',
	'260',
	'224,2235,2237',
	'2159',
	'140',
	'235',
	'2206',
	'186',
	'230',
	'1124',
	'1237',
	'1126',
	'195',
	'192,212',
	'120',
	'2151',
	'165',
	'2214',
	'245',
	'176',
	'280',
	'2129',
	'199',
	'210',
	'146',
	'243',
	'255,269',
	'125',
	'126',
	'258',
	'159',
	'1119',
	'2119',
	'222',
	'114,149',
	'1208',
	'181',
	'279',
	'231',
	'147',
	'244',
	'2149',
	'250',
	'239',
	'298',
	'2241',
	'300',
	'301',
	'178',
	'2247',
	'206',
	'208',
	'2141',
	'175',
	'1103',
	'2200',
	'2153',
	'2188,2194',
	'133',
	'226',
	'2190,2196',
	'163',
	'236',
	'227',
	'169',
	'281',
	'151',
	'2111,2182,2186',
	'1102',
	'292',
	'110',
	'182',
	'1235',
	'246',
	'187',
	'180',
	'237',
	'160'
];
// Функция подсказок для станций
autocompleteStations(document.getElementById("myInput"), availableStations);




// Телеграм-объект
let tg = window.Telegram.WebApp;

function MetroShow(){
    $("#filterpop").hide();
    $("#metro_choice").show();
    tg.MainButton.hide();
}
function MetroHide(){
    $("#filterpop").show();
    $("#metro_choice").hide();
    tg.MainButton.show();
}
function HideAll(){
    $("#location").hide();
    $("#metro_map").hide();
    $("#metro_choice").hide();
    $("#selector").hide();
    $("#selector_o").hide();
    $("#filterpop").hide();
    $("#main").show();
    tg.MainButton.show();
}
function MetroMapShow(){
    $("#metro_choice").hide();
    $("#metro_map").show();
    tg.MainButton.hide();
}
function MetroMapHide(){
    $("#metro_map").hide();
    $("#metro_choice").show();
    tg.MainButton.hide();
}
function FilterShow(){
    $("#main").hide();
    $("#filterpop").show();
}
function FilterHide(){
    $("#main").show();
    $("#filterpop").hide();
}

$(document).ready(function(){  // При загрузке страницы
    HideAll();
    tg.MainButton.show();
});

function resize(){  // Ресайз яндекс-карты
    $('#frame').width($('#yamap').width() + 4);
}

tg.MainButton.text = "Поиск 🔍";
tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#FF385C";
tg.expand();
resize();
window.onresize = resize;

function selectorHide(){  // Скрыть окно выбора гостей
    document.getElementById("rotat").style.animation = "unrotateAndMove 0.3s ease-in-out";
    document.getElementById("rotat").style.transform = "rotate(0deg) translateY(0px)";
    $("#selector").hide();
    $("#selector_o").hide();
    tg.MainButton.show();
    document.getElementById("sel").href = "javascript:selectorOpen()";
}
function selectorOpen(){  // Показать окно выбора гостей
    if (localStorage.getItem('service') == 'Суточно'){
        $("#selector").show();
        document.getElementById("sel").href = "javascript:selectorHide()";
    }
    else{
        $("#selector_o").show();
        document.getElementById("sel").href = "javascript:select_O_Ready()";
    }
    tg.MainButton.hide();
    document.getElementById("rotat").style.animation = "rotateAndMove 0.3s ease-in-out";
    document.getElementById("rotat").style.transform = "rotate(90deg) translateY(2px)";
}

var children = '';
function selectReady(){  // При нажатии на "Готово"
    let countch = 0;
    const cells = document.getElementsByClassName('selo');
    var str = '';
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].value == 'Выберите возраст'){
            return false;
        }
        if (cells[i].value != ''){
            countch += 1;
            str += cells[i].value.replace('Ребёнок, ', '').split(' год')[0].split(' года')[0].split(' лет')[0].replace('до', '0') + ',';
        }
    }
    str = str.slice(0, -1);
    children = str;
    if (countch > 0){
        if (countch == 1 || (countch % 10 == 1 && countch > 11)){
            document.getElementById("font").innerHTML = countch + " ребёнок";
        }
        else if (countch > 1 && countch < 5){
            document.getElementById("font").innerHTML = countch + " ребёнка";
        }
        else {
            document.getElementById("font").innerHTML = countch + " детей";
        }
    }
    else {
        document.getElementById("font").innerHTML = "без детей";
    }
    selectorHide();
}


// Автозаполнение доп. фильтров
function RestoreFilters() {
    if (localStorage.getItem('f1e1') == '1') {
        document.getElementById('f1e1').checked = true;
    }
    if (localStorage.getItem('f1e2') == '1') {
        document.getElementById('f1e2').checked = true;
    }
    if (localStorage.getItem('f1e3') == '1') {
        document.getElementById('f1e3').checked = true;
    }
    if (localStorage.getItem('f1e4') == '1') {
        document.getElementById('f1e4').checked = true;
    }
    if (localStorage.getItem('f1e5') == '1') {
        document.getElementById('f1e5').checked = true;
    }
    if (localStorage.getItem('f1e6') == '1') {
        document.getElementById('f1e6').checked = true;
    }
    //
    if (localStorage.getItem('f2e1') == '1' && document.getElementById('sutochno').checked == true) {
        document.getElementById('f2e1').checked = true;
    }
    if (localStorage.getItem('f2e2') == '1') {
        document.getElementById('f2e2').checked = true;
    }
    if (localStorage.getItem('f2e3') == '1') {
        document.getElementById('f2e3').checked = true;
    }
    if (localStorage.getItem('f2e4') == '1') {
        document.getElementById('f2e4').checked = true;
    }
    //
    if (localStorage.getItem('f3e1') == '1') {
        document.getElementById('f3e1').checked = true;
    }
    if (localStorage.getItem('f3e2') == '1') {
        document.getElementById('f3e2').checked = true;
    }
    if (localStorage.getItem('f3e3') == '1') {
        document.getElementById('f3e3').checked = true;
    }
    if (localStorage.getItem('f3e4') == '1') {
        document.getElementById('f3e4').checked = true;
    }
    if (localStorage.getItem('f3e5') == '1') {
        document.getElementById('f3e5').checked = true;
    }
    if (localStorage.getItem('f3e6') == '1') {
        document.getElementById('f3e6').checked = true;
    }
    if (localStorage.getItem('f3e7') == '1') {
        document.getElementById('f3e7').checked = true;
    }
    if (localStorage.getItem('f3e8') == '1') {
        document.getElementById('f3e8').checked = true;
    }
    if (localStorage.getItem('f3e9') == '1') {
        document.getElementById('f3e9').checked = true;
    }
    if (localStorage.getItem('f3e10') == '1') {
        document.getElementById('f3e10').checked = true;
    }
    //
    if (localStorage.getItem('f4e1') == '1') {
        document.getElementById('f4e1').checked = true;
    }
    if (localStorage.getItem('f4e2') == '1') {
        document.getElementById('f4e2').checked = true;
    }
    //
    if (localStorage.getItem('f5e1') == '1') {
        document.getElementById('f5e1').checked = true;
    }
    if (localStorage.getItem('f5e2') == '1') {
        document.getElementById('f5e2').checked = true;
    }
    if (localStorage.getItem('f5e3') == '1') {
        document.getElementById('f5e3').checked = true;
    }
    if (document.getElementById('sutochno').checked == true){ // Для суточно
        if (localStorage.getItem('f6e1s') == '1') {
            document.getElementById('f6e1s').checked = true;
        }
        if (localStorage.getItem('f6e2s') == '1') {
            document.getElementById('f6e2s').checked = true;
        }
        if (localStorage.getItem('f6e3s') == '1') {
            document.getElementById('f6e3s').checked = true;
        }
        if (localStorage.getItem('f6e4s') == '1') {
            document.getElementById('f6e4s').checked = true;
        }
        if (localStorage.getItem('f6e5s') == '1') {
            document.getElementById('f6e5s').checked = true;
        }
    }
    else { // Для островок
        if (localStorage.getItem('f6e1o') == '1') {
            document.getElementById('f6e1o').checked = true;
        }
        if (localStorage.getItem('f6e2o') == '1') {
            document.getElementById('f6e2o').checked = true;
        }
        if (localStorage.getItem('f6e3o') == '1') {
            document.getElementById('f6e3o').checked = true;
        }
        if (localStorage.getItem('f6e4o') == '1') {
            document.getElementById('f6e4o').checked = true;
        }
        if (localStorage.getItem('f6e5o') == '1') {
            document.getElementById('f6e5o').checked = true;
        }
    }
}


let time; //Задержка

//async function getCenter(idput) {
//    document.getElementById('mapopen').href = 'JavaScript:Void(0)';
//    document.getElementById('mapopen').style.backgroundImage = "url('icon/spinner.svg')";
//    document.getElementById('mapopen').style.backgroundSize = "30px";
//    document.getElementById('mapopen').style.backgroundPositionY = "50%";
//    document.getElementById("ostrovok").disabled = true;
//    document.getElementById("sutochno").disabled = true;
//    return fetch("http://localhost/meme/ostrovok_location.php?id=" + idput)
//        .then((response)=>response.json())
//        .then((responseJson)=>{return responseJson});
//}

//Автокомплит (подсказки) для городов
function autocompleteStates(inp) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        let condition = document.getElementById('ostrovok').checked;
        let link = './sutochno.php?q='; // Для суточно
        if (condition) {
            link = './ostrovok.php?q='; // Для островок
        }
        clearTimeout(time);
        time = setTimeout(function() {
            fetch(link + val).then(
            function (response) {
                return response.json();
            }).then(async function (data) {
                test = data;
                spisok = data['data']['suggestions']; // Для суточно
                if (condition) {
                    spisok = data['data']['regions'];  // Для островок
                }
                let opt = [];
                for (i = 0; i < spisok.length; i++) {
                    if (condition) { // Для островок
                        let res = await fetch("./ostrovok_code.php?code=" + spisok[i]['country_code']);
                        let obj = await res.json();
                        let name_title = spisok[i]['name'];
                        opt.push([spisok[i]['id'], name_title, obj, spisok[i]['type']]);
                    }
                    else { // Для суточно
                        if (!spisok[i]['sight_id'] && spisok[i]['type'] != "country" && spisok[i]['type'] != "region"){
                            let region = '';
                            let country = '';
                            if (spisok[i]['region']){
                                region = spisok[i]['region'];
                            }
                            if (spisok[i]['country']){
                                country = spisok[i]['country'];
                            }
                            if (country != '' && region != ''){
                                region += ', ';
                            }
                            opt.push([region, country, spisok[i]['count'], spisok[i]['title'], spisok[i]['id'], spisok[i]['type'], spisok[i]['lat'], spisok[i]['lng']]);
                            opt.sort((a, b) => a[2] < b[2] ? 1 : -1);
                        }
                    }
                }
                if (opt.length == 0){
                    b = document.createElement("DIV");
                    b.style = 'width: auto;';
                    b.innerHTML = "<font color='grey'>Мы не знаем такое место :(</font>";
                    a.appendChild(b);
                }
                for (i = 0; i < opt.length; i++) {
                    if (condition) { // Для островок
                        if (i < 3) {
                            b = document.createElement("DIV");
                            if (i==0 || i==2|| i==4){
                                b.style.background = "#F5F5F5";
                            }
                            b.style.position = 'relative';
                            b.innerHTML = "<div style='background-image: " + 'url("icon/' + opt[i][3] + '.svg");' + "background-color: unset; padding: 0; border-style: none; margin: 0; width: 27px; height: 27px; background-size: 27px; background-repeat: no-repeat; position: absolute; top: 50%; right: 20px; transform: translate(0, -50%);'></div>";
                            b.innerHTML += "<strong style='display: inline-block; width: calc(100vw - 150px);'>" + opt[i][1] + "</strong>";
                            b.innerHTML += "<br><font size='1.3' color='grey'>"+ opt[i][2] + "</font>";
                            b.innerHTML += "<input type='hidden' value='" + opt[i][1] + "'>";
                            let toput = opt[i][1];
                            let idput = opt[i][0];
                            //При клике
                            b.addEventListener("click", async function(e) {
                                localStorage.setItem('search', 'Город');
                                localStorage.setItem('gorod', toput);
                                localStorage.setItem('id', idput);
                                document.getElementById("State").value = toput;
                                document.getElementById("State").placeholder = "Название города";
                                document.getElementById("State").style.borderColor = 'limegreen';
                                // Захват центра
                                //const json = await getCenter(idput);
                                const json = await fetch("./ostrovok_location.php?id=" + idput)
                                .then((response)=>response.json())
                                .then((responseJson)=>{return responseJson})
                                localStorage.setItem('lat', json.lat);
                                localStorage.setItem('lon', json.lon);
//                                document.getElementById('mapopen').href = 'javascript:YandexMapShow()';
//                                document.getElementById('mapopen').style.backgroundImage = "url('o_map_icon.svg')";
//                                document.getElementById('mapopen').style.backgroundPositionY = "40%";
//                                document.getElementById('mapopen').style.backgroundSize = "";
//                                document.getElementById("ostrovok").disabled = false;
//                                document.getElementById("sutochno").disabled = false;
                                closeAllLists();
                            });
                            a.appendChild(b);
                        }
                    }
                    else {
                        if (i < 3) {
                            b = document.createElement("DIV");
                            if (i==0 || i==2|| i==4){
                                b.style.background = "#F5F5F5";
                            }
                            b.innerHTML = "<strong>" + opt[i][3].substr(0, val.length) + "</strong>";
                            b.innerHTML += opt[i][3].substr(val.length) + "<b>"+ opt[i][2] + "</b><font size='1.3' color='grey'>"+ opt[i][0] + opt[i][1] +"</font>";
                            b.innerHTML += "<input type='hidden' value='" + opt[i][3] + "'>";
                            let toput = opt[i][3];
                            let idput = opt[i][4];
                            let typeput = opt[i][5];
                            let latput = opt[i][6];
                            let lonput = opt[i][7];
                            //При клике
                            b.addEventListener("click", function(e) {
                                if (toput == 'Москва'  && localStorage.getItem('service') == 'Суточно'){
                                    $('#metroform').show();
                                } else {
                                    $('#metroform').hide();
                                }
                                localStorage.setItem('search', 'Город');
                                localStorage.setItem('gorod', toput);
                                localStorage.setItem('id', idput);
                                localStorage.setItem('type', typeput);
                                localStorage.setItem('lat', latput);
                                localStorage.setItem('lon', lonput);
                                document.getElementById("State").value = toput;
                                document.getElementById('State').placeholder = "Название города";
                                document.getElementById("State").style.borderColor = 'limegreen';
                                closeAllLists();
                            });
                            a.appendChild(b);
                        }
                        else { break; }
                    }
                }
                return true;
            }).catch(function (err) {
                b = document.createElement("DIV");
                b.style = 'width: auto;';
                b.innerHTML = "<font color='grey'>Кажется, произошла ошибка :(</font>";
                a.appendChild(b);
                console.warn('Something went wrong.', err);
                return false;
            });
        }, 1000);
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
autocompleteStates(document.getElementById("State"));


function checkState(el){
    if (localStorage.getItem('gorod') != el.value && el.value != '')
    {
        el.style.borderColor = 'red';
    }
    if (localStorage.getItem('gorod') == el.value)
    {
        el.style.borderColor = 'limegreen';
    }
}


function YandexMapShow(){  // Яндекс карта
    $("#main").hide();
    $("#location").show();
    tg.MainButton.hide();
    // Инициализация карты
    let lat = localStorage.getItem('lat');
    let lon = localStorage.getItem('lon');
    let zoom = localStorage.getItem('zoom');
    if (lat == null || lon == null) {
        lat = 55.76;
        lon = 37.64;
    }
    if (zoom == null){
        zoom = 12;
    }
    myMap = new ymaps.Map("yamap", {
        center: [lat, lon],
        zoom: zoom,
        controls: ['zoomControl']
    },
    {suppressMapOpenBlock: true,
        minZoom: 11,
        maxZoom: 16,
        propagateEvents: true
    });
}

function YandexMapHide(){
    tg.MainButton.show();
    myMap.destroy();
    $("#location").hide();
    $("#main").show();
}

function SubmitMap()  // Подтвердить положение карты
{
    document.getElementById("State").value = "";
    document.getElementById('State').placeholder = "Поиск по карте";
    localStorage.setItem('search', 'Поиск по карте');
    //В автокомплит
    localStorage.setItem('lat', myMap.getCenter()[0]);
    localStorage.setItem('lon', myMap.getCenter()[1]);
    localStorage.setItem('zoom', myMap.getZoom());
    //Для передачи в бота
    localStorage.setItem('lat1', myMap.getBounds()[0][0]);
    localStorage.setItem('lon1', myMap.getBounds()[0][1]);
    localStorage.setItem('lat2', myMap.getBounds()[1][0]);
    localStorage.setItem('lon2', myMap.getBounds()[1][1]);
    document.getElementById("State").style.borderColor = '#6A6A6A';
    $('#metroform').hide();
    YandexMapHide();
}


function GetFilters()  // Сформировать фильтры
{
    let filters_s = '';
    let filters_o = '';
    let f1 = '!TYPE:';
    let f = '!SORT:';
    let serp = '!SERP:';
    let food = '!FOOD:';
    let stars = '!STARS:';
    // Первый блок
    if (document.getElementById('f1e1').checked) {
        filters_s += "&is_hotel=1&is_room=1";
        f1 += "BNB:Sanatorium:Resort:Mini-hotel:Hotel:Boutique_and_Design:";
        localStorage.setItem('f1e1', '1');
    } else {
        localStorage.setItem('f1e1', '0');
    }

    if (document.getElementById('f1e2').checked) {
        filters_s += "&is_bed=1";
        f1 += "Hostel:";
        localStorage.setItem('f1e2', '1');
    } else {
        localStorage.setItem('f1e2', '0');
    }

    if (document.getElementById('f1e3').checked) {
        filters_s += "&is_apartment=1";
        f1 += "Apartment:";
        localStorage.setItem('f1e3', '1');
    } else {
        localStorage.setItem('f1e3', '0');
    }

    if (document.getElementById('f1e4').checked) {
        filters_s += "&is_aparthotel=1";
        f1 += "Apart-hotel:BNB:Resort:Mini-hotel:Boutique_and_Design:";
        localStorage.setItem('f1e4', '1');
    } else {
        localStorage.setItem('f1e4', '0');
    }

    if (document.getElementById('f1e5').checked) {
        filters_s += "&is_guesthouse=1";
        f1 += "Guesthouse:";
        localStorage.setItem('f1e5', '1');
    } else {
        localStorage.setItem('f1e5', '0');
    }

    if (document.getElementById('f1e6').checked) {
        filters_s += "&is_house=1";
        f1 += "Camping:Glamping:Villas_and_Bungalows:Cottages_and_Houses:BNB:Farm:Castle:";
        localStorage.setItem('f1e6', '1');
    } else {
        localStorage.setItem('f1e6', '0');
    }
    // Второй блок + быстрое бронирование
    if (document.getElementById('f2e2').checked) {
        filters_s += "&smoking=1";
        f += "smoking:";
        localStorage.setItem('f2e2', '1');
    } else {
        localStorage.setItem('f2e2', '0');
    }

    if (document.getElementById('f2e3').checked) {
        filters_s += "&pets=1";
        f += "pets-allowed:";
        localStorage.setItem('f2e3', '1');
    } else {
        localStorage.setItem('f2e3', '0');
    }

    if (document.getElementById('f2e4').checked) {
        filters_s += "&is_dis=1";
        f += "accessible:";
        localStorage.setItem('f2e4', '1');
    } else {
        localStorage.setItem('f2e4', '0');
    }
    // Третий блок
    if (document.getElementById('f3e1').checked) {
        filters_s += "&wifi=1";
        f += "wi-fi:";
        localStorage.setItem('f3e1', '1');
    } else {
        localStorage.setItem('f3e1', '0');
    }

    if (document.getElementById('f3e2').checked) {
        filters_s += "&condition=1";
        f += "air-conditioning:";
        localStorage.setItem('f3e2', '1');
    } else {
        localStorage.setItem('f3e2', '0');
    }

    if (document.getElementById('f3e3').checked) {
        filters_s += "&kitchen=1";
        f += "kitchen:";
        localStorage.setItem('f3e3', '1');
    } else {
        localStorage.setItem('f3e3', '0');
    }

    if (document.getElementById('f3e4').checked) {
        filters_s += "&refrigerator=1";
        f += "fridge:";
        localStorage.setItem('f3e4', '1');
    } else {
        localStorage.setItem('f3e4', '0');
    }

    if (document.getElementById('f3e5').checked) {
        filters_s += "&balcony=1";
        f += "balcony:";
        localStorage.setItem('f3e5', '1');
    } else {
        localStorage.setItem('f3e5', '0');
    }

    if (document.getElementById('f3e6').checked) {
        filters_s += "&washmachine=1";
        f += "washing-machine:";
        localStorage.setItem('f3e6', '1');
    } else {
        localStorage.setItem('f3e6', '0');
    }

    if (document.getElementById('f3e7').checked) {
        filters_s += "&tv=1";
        f += "tv:";
        localStorage.setItem('f3e7', '1');
    } else {
        localStorage.setItem('f3e7', '0');
    }

    if (document.getElementById('f3e8').checked) {
        filters_s += "&kettle=1";
        f += "tea-or-coffee:";
        localStorage.setItem('f3e8', '1');
    } else {
        localStorage.setItem('f3e8', '0');
    }

    if (document.getElementById('f3e9').checked) {
        filters_s += "&microwave=1";
        f += "microwave:";
        localStorage.setItem('f3e9', '1');
    } else {
        localStorage.setItem('f3e9', '0');
    }

    if (document.getElementById('f3e10').checked) {
        filters_s += "&dishwasher=1";
        f += "dishwasher:";
        localStorage.setItem('f3e10', '1');
    } else {
        localStorage.setItem('f3e10', '0');
    }
    // Четвертый блок
    if (document.getElementById('f4e1').checked) {
        filters_s += "&parking=1";
        serp += "has_parking:";
        localStorage.setItem('f4e1', '1');
    } else {
        localStorage.setItem('f4e1', '0');
    }

    if (document.getElementById('f4e2').checked) {
        filters_s += "&pool=1";
        serp += "has_pool:";
        localStorage.setItem('f4e2', '1');
    } else {
        localStorage.setItem('f4e2', '0');
    }
    // Пятый блок
    if (document.getElementById('f5e1').checked) {
        filters_s += "&has_breakfast=1";
        food += "breakfast:";
        localStorage.setItem('f5e1', '1');
    } else {
        localStorage.setItem('f5e1', '0');
    }

    if (document.getElementById('f5e2').checked) {
        filters_s += "&has_lunch=1";
        food += "lunch:";
        localStorage.setItem('f5e2', '1');
    } else {
        localStorage.setItem('f5e2', '0');
    }

    if (document.getElementById('f5e3').checked) {
        filters_s += "&has_dinner=1";
        food += "dinner:";
        localStorage.setItem('f5e3', '1');
    } else {
        localStorage.setItem('f5e3', '0');
    }
    // Опционально
    if (document.getElementById('ostrovok').checked == true) { //Островок
        if (document.getElementById('f6e1o').checked) {
            stars += "5:";
            localStorage.setItem('f6e1o', '1');
        } else {
            localStorage.setItem('f6e1o', '0');
        }

        if (document.getElementById('f6e2o').checked) {
            stars += "4:";
            localStorage.setItem('f6e2o', '1');
        } else {
            localStorage.setItem('f6e2o', '0');
        }

        if (document.getElementById('f6e3o').checked) {
            stars += "3:";
            localStorage.setItem('f6e3o', '1');
        } else {
            localStorage.setItem('f6e3o', '0');
        }

        if (document.getElementById('f6e4o').checked) {
            stars += "2:";
            localStorage.setItem('f6e4o', '1');
        } else {
            localStorage.setItem('f6e4o', '0');
        }

        if (document.getElementById('f6e5o').checked) {
            stars += "1:0:";
            localStorage.setItem('f6e5o', '1');
        } else {
            localStorage.setItem('f6e5o', '0');
        }
    }
    else { // Суточно
        if (document.getElementById('f2e1').checked) {
            filters_s += "&booking_now=1";
            localStorage.setItem('f2e1', '1');
        } else {
            localStorage.setItem('f2e1', '0');
        }

        if (document.getElementById('f6e1s').checked) {
            filters_s += "&hasReview=1";
            localStorage.setItem('f6e1s', '1');
        } else {
            localStorage.setItem('f6e1s', '0');
        }

        if (document.getElementById('f6e2s').checked) {
            filters_s += "&is_self_in=1";
            localStorage.setItem('f6e2s', '1');
        } else {
            localStorage.setItem('f6e2s', '0');
        }

        if (document.getElementById('f6e3s').checked) {
            filters_s += "&documents=1";
            localStorage.setItem('f6e3s', '1');
        } else {
            localStorage.setItem('f6e3s', '0');
        }

        if (document.getElementById('f6e4s').checked) {
            filters_s += "&faster=1";
            localStorage.setItem('f6e4s', '1');
        } else {
            localStorage.setItem('f6e4s', '0');
        }

        if (document.getElementById('f6e5s').checked) {
            filters_s += "&superhost=1";
            localStorage.setItem('f6e5s', '1');
        } else {
            localStorage.setItem('f6e5s', '0');
        }
    }
    filters_o = f1 + f + serp + food + stars;

    if (document.getElementById('ostrovok').checked == true) { //Островок
        return filters_o;
    }
    else { // Суточно
        return filters_s;
    }
}


let s_filters = `
        <div class="header">Дополнительно:</div>
        <label class="container2">С хорошими отзывами
            <input type="checkbox" id="f6e1s">
            <span class="checkmark2"></span>
        </label>
        <label class="container2">Бесконтактное заселение
            <input type="checkbox" id="f6e2s">
            <span class="checkmark2"></span>
        </label>
        <label class="container2">Отчетные документы
            <input type="checkbox" id="f6e3s">
            <span class="checkmark2"></span>
        </label>
        <label class="container2">Быстро отвечают
            <input type="checkbox" id="f6e4s">
            <span class="checkmark2"></span>
        </label>
        <label class="container2">Суперхоязева
            <input type="checkbox" id="f6e5s">
            <span class="checkmark2"></span>
        </label>
`;
let o_filters = `
        <div class="header">Количество звёзд:</div>
        <label class="container2"><img src="star.svg"><img src="star.svg"><img src="star.svg"><img src="star.svg"><img src="star.svg">
            <input type="checkbox" id="f6e1o">
            <span class="checkmark2"></span>
        </label>
        <label class="container2"><img src="star.svg"><img src="star.svg"><img src="star.svg"><img src="star.svg">
            <input type="checkbox" id="f6e2o">
            <span class="checkmark2"></span>
        </label>
        <label class="container2"><img src="star.svg"><img src="star.svg"><img src="star.svg">
            <input type="checkbox" id="f6e3o">
            <span class="checkmark2"></span>
        </label>
        <label class="container2"><img src="star.svg"><img src="star.svg">
            <input type="checkbox" id="f6e4o">
            <span class="checkmark2"></span>
        </label>
        <label class="container2"><img src="star.svg">  или без звёзд
            <input type="checkbox" id="f6e5o">
            <span class="checkmark2"></span>
        </label>
`;

function Change_Ostrovok() {
    document.getElementById("State").style.borderColor = '#6A6A6A';
    document.getElementById('flash').style.display = 'none';
    document.getElementById('f6').innerHTML = o_filters;
    $('#metroform').hide();
    localStorage.setItem('service', 'Островок');
    document.documentElement.style.setProperty('--main-color', '#0F5DE4');
    document.documentElement.style.setProperty('--light-color', 'rgba(56, 120, 255, 0.5)');
    document.documentElement.style.setProperty('--lighter-color', 'rgba(56, 120, 255, 0.25)');
    document.getElementById('mapopen').style.backgroundImage = "url('o_map_icon.svg')";
    document.getElementById('gray_sutochno').style.opacity = "0";
    document.getElementById('gray_ostrovok').style.opacity = "1";
    document.getElementById('filterform').style.backgroundImage = "url(params_o.svg)";
    document.getElementById('descr').style.backgroundImage = "url(o_mapicon.svg)";
    tg.MainButton.color = "#0F5DE4";
}

function Change_Sutochno() {
    document.getElementById("State").style.borderColor = '#6A6A6A';
    document.getElementById('flash').style.display = 'block';
    document.getElementById('f6').innerHTML = s_filters;
    localStorage.setItem('service', 'Суточно');
    document.documentElement.style.setProperty('--main-color', '#FF385C');
    document.documentElement.style.setProperty('--light-color', 'rgba(255, 56, 92, 0.5)');
    document.documentElement.style.setProperty('--lighter-color', 'rgba(255, 56, 92, 0.25)');
    document.getElementById('mapopen').style.backgroundImage = "url('s_map_icon.svg')";
    document.getElementById('gray_sutochno').style.opacity = "1";
    document.getElementById('gray_ostrovok').style.opacity = "0";
    document.getElementById('filterform').style.backgroundImage = "url(params_s.svg)";
    document.getElementById('descr').style.backgroundImage = "url(s_mapicon.svg)";
    tg.MainButton.color = "#FF385C";
}


// Функции изменения слайдеров сервисов бронирования
$("#sutochno").change(function() {
    if(this.checked) {
        document.getElementById('ostrovok').checked = false;
        Change_Sutochno();
        guests_o = document.getElementById('font2').innerHTML + '|' + document.getElementById('font').innerHTML;
        document.getElementById('font2').innerHTML = guests_s.split('|')[0];
        document.getElementById('font').innerHTML = guests_s.split('|')[1];
    }
    else {
        document.getElementById('ostrovok').checked = true;
        Change_Ostrovok();
        guests_s = document.getElementById('font2').innerHTML + '|' + document.getElementById('font').innerHTML;
        document.getElementById('font2').innerHTML = guests_o.split('|')[0];
        document.getElementById('font').innerHTML = guests_o.split('|')[1];
    }
    document.getElementById('State').value = '';
    localStorage.removeItem('gorod');
    localStorage.removeItem('id');
    localStorage.removeItem('type');
});

$("#ostrovok").change(function() {
    if(this.checked) {
        document.getElementById('sutochno').checked = false;
        Change_Ostrovok();
        guests_s = document.getElementById('font2').innerHTML + '|' + document.getElementById('font').innerHTML;
        document.getElementById('font2').innerHTML = guests_o.split('|')[0];
        document.getElementById('font').innerHTML = guests_o.split('|')[1];
    }
    else {
        document.getElementById('sutochno').checked = true;
        Change_Sutochno();
        guests_o = document.getElementById('font2').innerHTML + '|' + document.getElementById('font').innerHTML;
        document.getElementById('font2').innerHTML = guests_s.split('|')[0];
        document.getElementById('font').innerHTML = guests_s.split('|')[1];
    }
    document.getElementById('State').value = '';
    localStorage.removeItem('gorod');
    localStorage.removeItem('id');
    localStorage.removeItem('type');
});

function select_O_Ready(){
    let rooms = document.getElementsByClassName('room').length;
    if (rooms == 1){
        document.getElementById('font2').innerHTML = '1 Номер';
    }
    else if (rooms >= 2 && rooms <= 4){
        document.getElementById('font2').innerHTML = rooms.toString() + ' Номера';
    }
    else {
        document.getElementById('font2').innerHTML = rooms.toString() + ' Номеров';
    }

    let adults_o = document.getElementsByClassName('o_adults');
    let count = 0;
    for (i = 0; i < adults_o.length; i++) {
        count += parseInt(adults_o[i].innerHTML);
    }
    count += document.getElementsByClassName('child_panel').length;
    if (count % 10 == 1){
        document.getElementById('font').innerHTML = 'для ' + count.toString() + ' гостя';
    }
    else {
        document.getElementById('font').innerHTML = 'для ' + count.toString() + ' гостей';
    }

    selectorHide();
}

// Автозаполнение всех полей
function allAutocomplete()
{
    if (localStorage.getItem('service') == null)
    {
        localStorage.setItem('service', 'Суточно');
    }
    let search = localStorage.getItem('search');
    if (search == null)
    {
        localStorage.setItem('search', 'Город');
    }
    //Выбор сервиса
    if (localStorage.getItem('service') == 'Суточно'){
        document.getElementById('sutochno').checked = true;
        document.getElementById('ostrovok').checked = false;
        Change_Sutochno();
        document.getElementById('font2').innerHTML = guests_s.split('|')[0];
        document.getElementById('font').innerHTML = guests_s.split('|')[1];
    } else {
        document.getElementById('sutochno').checked = false;
        document.getElementById('ostrovok').checked = true;
        Change_Ostrovok();
        document.getElementById('font2').innerHTML = guests_o.split('|')[0];
        document.getElementById('font').innerHTML = guests_o.split('|')[1];
    }

    // Слайдер
    let mins = localStorage.getItem('slidermin');
    let maxs = localStorage.getItem('slidermax');
    if (mins !== null) {
        initSlider(parseInt(mins), parseInt(maxs));
    } else{
        initSlider(6, 24);
    }

    // Город
    let gorod = localStorage.getItem('gorod');
    if (gorod !== null) {
        if (search == "Город") {
            document.getElementById("State").value = localStorage.getItem('gorod');
        }
        else{
            document.getElementById("State").placeholder = "Поиск по карте";
        }
    }

    // Цены
    price1 = localStorage.getItem('price1');
    if (price1 !== null) {
        document.getElementById("price1").value = price1;
    }
    price2 = localStorage.getItem('price2');
    if (price2 !== null) {
        document.getElementById("price2").value = price2;
    }
    // Станции
    metros2 = localStorage.getItem('metros2');
    if (metros2 !== null) {
        let arr = metros2.split('&');
        for (let i = 0; i < arr.length-1; i++) {
            let name = availableStations[availableStationNumbers.indexOf(arr[i])];
            metro.push(arr[i]);
            let block = document.getElementById('list');
            block.innerHTML += `<button id="${name}" onclick="removeStation(this)" type="button">${name}</button>`;
        }
    }
    // Ветки
    lines = localStorage.getItem('lines');
    if (lines !== null) {
        let arr = lines.split(',');
        for (let i = 0; i < arr.length-1; i++) {
            document.getElementById(arr[i]).checked = true;
        }
    }
    // Доп. фильтры
    RestoreFilters();
}

allAutocomplete();


// Формирование ссылки суточно
function Get_Sutochno()
{
    let id = localStorage.getItem('id');  // Id региона
    let type = localStorage.getItem('type');  // Тип региона (в ссылку)
    let term = localStorage.getItem('gorod');  // Название города

    if (localStorage.getItem('search') == "Поиск по карте"){  // Если поиск был по карте
        localStorage.removeItem('gorod');
        localStorage.removeItem('id');
        localStorage.removeItem('type');
    }

    // Если ничего не было забито
    if (id == null){
        id = '397366';
        type = 'city';
        term = 'Москва';
    }

    // Конечный диапазон цен
    let price = document.getElementById("price1").value + ',' + document.getElementById("price2").value;

    // Метро
    let metros = '';
    for (let i = 0; i < metro.length; i++) {
        metros += metro[i] + ',';
    }
    let metros2 = '';
    for (let i = 0; i < metro.length; i++) {
        metros2 += metro[i] + '&';
    }
    localStorage.setItem('metros2', metros2);
    // Ветки
    let linesid = getLinesId();
    let linid = '';
    for (let i = 0; i < linesid.length; i++) {
        linid += linesid[i] + ',';
    }
    localStorage.setItem('lines', linid);
    let lines = getLines();
    for (let i = 0; i < lines.length; i++) {
        metros += lines[i] + ',';
    }
    // Конечное значение станций
    if (metros !== '' && localStorage.getItem('gorod') == 'Москва'){
        metros = '&metro=' + metros + '5000';
    }
    else {
        metros = '';
    }

    // Гости
    let sel = document.getElementById("adults").innerHTML;
    localStorage.setItem('sel', sel);
    sel = sel.split(" Взрослый")[0].split(" Взрослых")[0];
    if (children != ''){
        children = '&guests_childrens=' + children;
    }

    // Даты
    const dates = document.getElementById('airdatepicker').value.split(' - ');
    let firstDate = dates[0].split('.');
    let secondDate = dates[1].split('.');
    let za = firstDate[2] + '-' + firstDate[1] + '-' + firstDate[0];
    let ot = secondDate[2] + '-' + secondDate[1] + '-' + secondDate[0];

    // Доп. фильтры
    let filters = GetFilters();

    let link = '';
    // Формирование и отправка боту ссылки
    if (localStorage.getItem('search') == "Поиск по карте"){
        let lat1 = localStorage.getItem('lat1');
        let lon1 = localStorage.getItem('lon1');
        let lat2 = localStorage.getItem('lat2');
        let lon2 = localStorage.getItem('lon2');
        link = "https://sutochno.ru/front/searchapp/search?price=" + price + metros + filters + "&guests_adults=" + sel + children + "&occupied=" + za + "%3B" + ot + "&SW.lat=" + lat1 + "&SW.lng=" + lon1 + "&NE.lat=" + lat2 + "&NE.lng=" + lon2;
    }
    else {
        link = "https://sutochno.ru/front/searchapp/search?price=" + price + metros + filters + "&guests_adults=" + sel + children + "&occupied=" + za + "%3B" + ot + "&id=" + id + "&type=" + type + "&term=" + term;
    }
    return link;
}

// Формирование ссылки островок
function Get_Ostrovok()
{
    let query = '';
    let id = localStorage.getItem('id');  // Id региона

    if (id == null){ // Если ничего не было забито
        id = '2395';
    }

    if (localStorage.getItem('search') == "Поиск по карте"){
        let lat = localStorage.getItem('lat');
        let lon = localStorage.getItem('lon');
        let zoom = localStorage.getItem('zoom');
        let soo = {'11': 18000, '12': 13000, '13': 6500, '14': 3000, '15': 1700, '16': 800};
        let rad = soo[zoom];
        if (rad == null) {
            rad = 6500;
        }
        query += '!GEO:radius' + rad + ':lat' + lat + ':lon' + lon + ':';
        localStorage.removeItem('gorod');
        localStorage.removeItem('id');
        localStorage.removeItem('type');
    } else{
        query += '!REGION:id' + id + ':';
    }

    // Конечный диапазон цен
    let price = document.getElementById("price1").value + ',' + document.getElementById("price2").value;
    query += '!PRICE:' + price + ':';

    // Гости
    let rooms = document.getElementsByClassName("room");
    let temp_query = '';
    for (let i = 0; i < rooms.length; i++) {
        let temp_room = 'r';
        temp_room += rooms[i].getElementsByClassName("o_adults")[0].innerHTML;
        let o_children = rooms[i].getElementsByClassName("child_panel");
        temp_room += '&';
        for (let j = 0; j < o_children.length; j++) {
            temp_room += o_children[j].innerHTML.split(' ')[0] + '&';
        }
        temp_query += temp_room;
    }
    query += '!GUESTS:' + temp_query;

    // Даты
    const dates = document.getElementById('airdatepicker').value.split(' - ');
    let firstDate = dates[0].split('.');
    let secondDate = dates[1].split('.');
    let za = firstDate[2] + '-' + firstDate[1] + '-' + firstDate[0] + ',';
    let ot = secondDate[2] + '-' + secondDate[1] + '-' + secondDate[0];
    query += '!DATE:' + za + ot + ':';

    // Доп. фильтры
    let filters = GetFilters();
    query += filters;

    return query;
}

// По нажатию на кнопку Телеграм
Telegram.WebApp.onEvent('mainButtonClicked', function(){
    // Если город введен неверно
    if (document.getElementById("State").style.borderColor == 'red' && localStorage.getItem('search') == "Город"){
        HideAll();
        return false;
    }
    // Если цены введены неверно
    if (!(new Date(document.getElementById("price1").value) < new Date(document.getElementById("price2").value))){
        document.getElementById("price1").style.borderColor = 'red';
        document.getElementById("price2").style.borderColor = 'red';
        HideAll();
        return false;
    }

    // Сохранить цены
    localStorage.setItem('price1', document.getElementById("price1").value);
    localStorage.setItem('price2', document.getElementById("price2").value);

    let link = '';
    if (document.getElementById("aviasales").checked){
        link += 'AVIA';
    }
    if (localStorage.getItem('service') == 'Суточно'){ // Отправка боту ссылки
        link += Get_Sutochno();
        tg.sendData(`${link}`);
    }
    else {
        link += Get_Ostrovok();
        tg.sendData(`${link}`);
    }
});

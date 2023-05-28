import math
from base64 import b64encode
import urllib.request
from PIL import Image
from arsenic.constants import SelectorType
import time
from bs4 import BeautifulSoup as bs
import asyncio
from arsenic import get_session, browsers, services
import urllib.parse
import csv
from aiogram.types import BufferedInputFile
import io

import requests
import json
import db


def allocate_rooms(raw_guests: str):
    guests = list()
    room_link = list()
    raw_rooms = raw_guests[1:].split('r')
    for raw_room in raw_rooms:
        room = dict()
        r_link = ''
        raw_kids = raw_room[2:].split('&')
        room["adults"] = int(raw_room[0])
        r_link += raw_room[0]
        kids = []
        if raw_room[2:-1] != '':
            for kid in raw_kids:
                if kid != '':
                    kids.append(int(kid))
        room["children"] = kids
        if len(kids) > 0:
            r_link += 'and' + '.'.join([str(x) for x in kids])
        guests.append(room)
        room_link.append(r_link)
    return guests, '-'.join(room_link)


def basic_auth(username, password):
    token = b64encode(f"{username}:{password}".encode('utf-8')).decode("ascii")
    return f'Basic {token}'


user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
headers = {'User-Agent': user_agent, }


service = services.Chromedriver(binary="DRIVER_PATH")  # Linux
browser = browsers.Chrome()
browser.capabilities = {"goog:chromeOptions": {
    "args": ["--headless", "start-maximized", "--no-sandbox", "--disable-dev-shm-usage", "--log-path", "/dev/null", "--disable-blink-features=AutomationControlled", '--disable-gpu'],
    'prefs':
        {
            'profile.managed_default_content_settings.javascript': 2,
            'profile.managed_default_content_settings.images': 2,
            'profile.managed_default_content_settings.mixed_script': 2,
            'profile.managed_default_content_settings.media_stream': 2,
            'profile.managed_default_content_settings.stylesheets': 2
        },
    "excludeSwitches": ["enable-automation"]
}}


# Коллаж из 2 (или 4/1) фото квартиры
async def collage(links):
    image1 = Image.open(urllib.request.urlopen(urllib.request.Request(links[0].replace('{size}', 'x220'), None, headers), timeout=7))
    if len(links) == 2 or len(links) == 3:
        image2 = Image.open(urllib.request.urlopen(urllib.request.Request(links[1].replace('{size}', 'x220'), None, headers), timeout=7))
        min_w = min([image1.width, image2.width])
        min_h = min([image1.height, image2.height])
        layer = Image.new("RGB", (min_w * 2, min_h))
        layer.paste(image1, (0, 0))
        layer.paste(image2, (min_w, 0))
    elif len(links) == 4:
        image2 = Image.open(urllib.request.urlopen(urllib.request.Request(links[1].replace('{size}', 'x220'), None, headers), timeout=7))
        image3 = Image.open(urllib.request.urlopen(urllib.request.Request(links[2].replace('{size}', 'x220'), None, headers), timeout=7))
        image4 = Image.open(urllib.request.urlopen(urllib.request.Request(links[3].replace('{size}', 'x220'), None, headers), timeout=7))
        min_w = min([image1.width, image2.width, image3.width, image4.width])
        min_h = min([image1.height, image2.height, image3.height, image4.height])
        layer = Image.new("RGB", (min_w * 2, min_h * 2))
        layer.paste(image1, (0, 0))
        layer.paste(image2, (min_w, 0))
        layer.paste(image3, (0, min_h))
        layer.paste(image4, (min_w, min_h))
    else:
        layer = Image.new("RGB", (image1.width, image1.height))
        layer.paste(image1, (0, 0))
    img_byte_arr = io.BytesIO()
    layer.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    photo = BufferedInputFile(img_byte_arr, 'Image.png')
    return photo


# Функция запроса и парсинга островок
async def ostrovok_get(query: str, username: str):
    print('О: начато для @' + username)
    start_time = time.time()
    # Парсинг фильтров
    filters = query[1:].split('!')
    price = [int(filters[1][6:-1].split(',')[0]), int(filters[1][6:-1].split(',')[1])]
    raw_guests = filters[2][7:]
    guests = allocate_rooms(raw_guests)
    checkin = filters[3][5:-1].split(',')[0]
    checkout = filters[3][5:-1].split(',')[1]
    kind = filters[4][5:-1].split(':')
    amenities = filters[5][5:-1].split(':')
    serp = filters[6][5:-1].split(':')
    #  Определение типа питания
    meal_raw = filters[7][5:-1].split(':')
    meal = []
    if meal_raw[0] != '':
        if len(meal_raw) == 3:
            meal = ['all-inclusive', 'full-board', 'some-meal']
        elif len(meal_raw) == 2:
            if ('breakfast' in meal_raw) and ('lunch' in meal_raw):
                meal = ['all-inclusive', 'full-board', 'some-meal', 'half-board', 'half-board-lunch']
            elif ('breakfast' in meal_raw) and ('dinner' in meal_raw):
                meal = ['all-inclusive', 'full-board', 'some-meal', 'half-board', 'half-board-dinner']
            elif ('lunch' in meal_raw) and ('dinner' in meal_raw):
                meal = ['all-inclusive', 'full-board', 'some-meal']
        else:
            if 'breakfast' in meal_raw:
                meal = ['all-inclusive', 'full-board', 'some-meal', 'half-board', 'half-board-lunch', 'half-board-dinner', 'breakfast']
            elif 'lunch' in meal_raw:
                meal = ['all-inclusive', 'full-board', 'some-meal', 'half-board', 'half-board-lunch', 'lunch']
            elif 'dinner' in meal_raw:
                meal = ['all-inclusive', 'full-board', 'some-meal', 'half-board', 'half-board-dinner', 'dinner']

    star_rating = filters[8][6:-1].split(':')
    city = ''
    if 'REGION' in filters[0]:  # Поиск по региону
        region_id = int(filters[0][9:-1])
        city = str(region_id)
        url = "https://api.worldota.net/api/b2b/v3/search/serp/region/"
        payload = json.dumps({
            "checkin": checkin,
            "checkout": checkout,
            "language": "ru",
            "guests": guests[0],
            "region_id": region_id,
            "currency": "RUB"
        })
    else:  # Поиск по карте
        city = 'GEO'
        raw = filters[0][4:-1].split(':')
        radius = int(raw[0][6:])
        latitude = float(raw[1][3:])
        longitude = float(raw[2][3:])
        url = "https://api.worldota.net/api/b2b/v3/search/serp/geo/"
        payload = json.dumps({
            "checkin": checkin,
            "checkout": checkout,
            "language": "ru",
            "guests": guests[0],
            "longitude": longitude,
            "latitude": latitude,
            "radius": radius,
            "currency": "RUB"
        })
    # Запрос + обработка исключений
    headers = {
        'Content-Type': 'application/json',
        'Authorization': basic_auth('LOGIN', 'PASSWORD')
    }
    try:
        response = requests.request("POST", url, headers=headers, data=payload, timeout=10)
        if str(response.status_code).startswith('5'):
            response = requests.request("POST", url, headers=headers, data=payload, timeout=10)
            if str(response.status_code).startswith('5'):
                print("Ошибка запроса к api - " + str(response.status_code))
                return 0, str(response.status_code)
    except Exception as e:
        print("Ошибка запроса к api - " + str(e))
        return 0, str(e)

    raw_data = response.json()
    if raw_data['status'] != 'ok':
        print("Ошибка запроса - " + raw_data['error'])
        return 0, raw_data['error']

    # Предварительная сортировка
    hotels_raw = raw_data['data']['hotels']
    hotels = list()
    for item in hotels_raw:  # Для каждого отеля
        hotel = dict()  # Конечный словарь отеля
        hotel['id'] = item["id"]
        rate_list = list()  # Список номеров в отеле
        for rate in item['rates']:  # Для каждого номера
            room = dict()
            # Цена
            max_daily = max([float(daily_price) for daily_price in rate["daily_prices"]])
            if price[0] > max_daily or max_daily > price[1]:
                continue
            room_price = rate["payment_options"]["payment_types"][0]["show_amount"]
            # Питание
            if (len(meal) > 0) and (rate["meal"] not in meal):
                continue
            # Особенности номера
            if amenities[0] != '':
                flag = False
                for am_value in amenities:
                    if am_value not in rate["amenities_data"]:
                        flag = True
                if flag:
                    continue
            # SERP-фильтры
            if serp[0] != '':
                flag = False
                print(rate["serp_filters"])
                for serp_value in serp:
                    if serp_value not in rate["serp_filters"]:
                        flag = True
                if flag:
                    continue
            room_name = rate["room_name"].replace('*', '').replace('`', '')
            room["name"] = room_name
            room["price"] = int(room_price.split('.')[0])
            rate_list.append(room)

        # Если в отеле нашлись комнаты - добавить в список
        if len(rate_list) > 0:
            rate_joined = list()
            rate_ready = [list(), list()]
            for some in rate_list:
                if some["name"] not in rate_ready[0]:
                    rate_ready[0].append(some["name"])
                    rate_ready[1].append([])
                    rate_ready[1][len(rate_ready[1])-1].append(some["price"])
                else:
                    current = rate_ready[1][rate_ready[0].index(some["name"])]
                    if some["price"] not in current:
                        rate_ready[1][rate_ready[0].index(some["name"])].append(some["price"])
            for i in range(len(rate_ready[0])):
                price1 = min(rate_ready[1][i])
                price2 = max(rate_ready[1][i])
                price_ready = str(price1)
                if price1 != price2:
                    price_ready = str(price1) + '~' + str(price2)
                room_joined = '▫ ' + rate_ready[0][i] + ': *' + price_ready + ' ₽* за все время'
                rate_joined.append(room_joined)
            hotel['rooms'] = rate_joined
            hotels.append(hotel)
    if len(hotels) == 0:
        print("Результатов нет")
        return 2, "Результатов нет"
    # Вторичная сортировка
    hotels_ready = await db.get_hotels(hotels, kind, star_rating, checkin.split('-'), checkout.split('-'), guests[1])
    if len(hotels_ready) == 0:
        print("Результатов нет")
        return 2, "Результатов нет"
    time_lapsed = time.time() - start_time
    print(f"О: окончено за {int(time_lapsed)} с. для @" + username)
    return hotels_ready, len(hotels_ready), checkin, checkout, city, 'Островок'


# Функция запроса на сайт суточно
async def browser_get(link, username):
    start_time = time.time()
    async with get_session(service, browser) as session:
        await session.set_window_size(1920, 1080)
        print('С: начато для @' + username)
        await session.get(link)
        await session.execute_script("document.body.style.zoom='70%'")
        try:  # Ожидание загрузки страницы
            await session.wait_for_element(40, 'div.card-prices__primary', SelectorType.css_selector)
        except Exception:  # Время таймаута прошло
            try:  # Захват сообщения на странице
                await asyncio.sleep(2)
                message = await session.get_element("div.content > div.panel-body.js-filter-reset > p", SelectorType.css_selector)
            except Exception as e:  # Ошибка захвата
                await session.close()
                print("[0] Ошибка захвата сообщения о нулевых результатах.")
                text_error = "Ошибка захвата сообщения о нулевых результатах: " + str(e)
                return 0, text_error
            else:  # Захват успешный
                message = await message.get_text()
                await session.close()
                if "расширить" in message:
                    print("[2] Результатов нет.")
                    return 2, "Результатов нет"
                else:
                    print("[0] Ошибка неизвестного характера.")
                    return 0, "Сообщения не найдено"
        else:  # Загрузка страницы успешна
            await asyncio.sleep(4)  # Ожидание прогрузки дополнительных элементов
            # Нажатие на кнопки
            js_script = "button_list = document.querySelectorAll('div.arrows__btn-wrapp--right > button'); button_list.forEach(r_button => {r_button.click(); r_button.click();});"
            await session.execute_script(js_script)
            # Количество результатов
            text = await session.get_element("div.content > div.sorting > div.sorting--amount > span", SelectorType.css_selector)
            text = await text.get_text()
            count = text.split(' ')[1]
            if 'вариант' not in text.split(' ')[2]:
                count = count + text.split(' ')[2]
            html = await session.get_page_source()
            html = html.replace('*', '').replace('`', '')  # Удаление символов разметки Markdown
            await session.close()  # Закрытие браузера
            try:  # Парсинг результатов
                cards = await pars(html)
            except Exception as e:  # В случае ошибки
                print("[0] Ошибка парсинга.")
                text_error = "Ошибка парсинга: " + str(e)
                return 0, text_error
            else:  # Расчет конечного времени загрузки результата
                time_lapsed = time.time() - start_time
                print(f"С: окончено за {int(time_lapsed)} с. для @" + username)
                if 'term' in link:
                    city = link.split('&term=')[1]
                else:
                    city = 'GEO'
                checkin = link.split('&occupied=')[1].split('%3B')[0]
                checkout = link.split('%3B')[1].split('&')[0]
                return [cards, count, checkin, checkout, city, 'Суточно']


# Функция парсинга результатов
async def pars(html):
    soup = bs(html, features="lxml")
    items = soup.find_all(class_="card")
    cards = list()
    for item in items:
        if "на ваши даты" in item.text:  # Если жилье недоступно
            continue
        card = dict()
        # Название
        card['name'] = item.select("a.card-content > h2")[0].text
        # Цена в сутки
        price = item.find(class_='card-prices__bottom').find(class_='price')
        card['price'] = price.select("span:nth-child(1)")[0].text
        # Оценка
        card['rate'] = ''
        rating = item.select('a.card-prices > div.card-prices__top > a > div > span.rating-list__rating')
        for rate in rating:
            card['rate'] = "— *" + rate.text + "* ⭐"
        # Количество отзывов
        card['count'] = ""
        reviews = item.select('a.card-prices > div.card-prices__top > a > div > span.rating-list__count.rating-list__count_prev')
        for review in reviews:
            card['count'] = review.text
        if "отзыв" in card['count']:
            card['count'] = "—  " + card['count']
        # Адрес
        card['address'] = item.select('a.card-content > div.card-content__object-info > div.card-content__address > a > p')[0].text
        # Комнаты + площадь
        atr = item.select('a.card-content > div.card-content__facilities > div.facilities__main')
        sometext = '🏷  '
        for atrs in atr:
            for temp in atrs:
                sometext += temp.text + ', '
        size = item.select('a.card-content > div.card-content__facilities > div.facilities__size')
        for sizes in size:
            sometext += ' — ' + sizes.text
        card['atrs'] = sometext.replace(',  —', ' —', -1).replace(',   —', ' —')
        # Информация о типе
        info = item.select('a.card-content > div.card-content__object-subtext.tmp-font--medium > span.object-hotel__type')
        sometext = ''
        for infos in info:
            sometext = infos.text + ' '
        info = item.select('a.card-content > div.card-content__object-subtext.tmp-font--medium > span:nth-child(2)')
        for infos in info:
            sometext = sometext + infos.text + ' '
        card['info'] = sometext
        # Ссылка на квартиру + id квартиры
        url1 = item.select('a.card-content')[0]
        url = 'https://sutochno.ru' + url1['href']
        id_num = url.replace('https://sutochno.ru/front/searchapp/detail/', '').split('?')[0]
        card['id'] = id_num  # ID квартиры
        # Формирование партнерской ссылки
        card['url'] = 'https://tp.media/r?marker=404212&trs=204502&p=2690&u=' + urllib.parse.quote(url) + '&campaign_id=99'
        # Массив фотографий
        card['photo'] = list()
        # Первое фото - ссылка
        photo1 = item.select('div.card__img > div > div.sc-sliderlight.slider-light.shadow > div.sc-sliderlight__track.track > div:nth-child(1) > img')[0]
        card['photo'].append(photo1['src'])
        # Второе фото - ссылка
        photo2 = item.select('div.card__img > div > div.sc-sliderlight.slider-light.shadow > div.sc-sliderlight__track.track > div:nth-child(2) > img')[0]
        card['photo'].append(photo2['src'])
        # Локация
        card['location'] = 'Сут@' + card['id']
        try:
            # Третье фото - ссылка
            photo3 = item.select('div.card__img > div > div.sc-sliderlight.slider-light.shadow > div.sc-sliderlight__track.track > div:nth-child(3) > img')[0]
            # Четвертое фото - ссылка
            photo4 = item.select('div.card__img > div > div.sc-sliderlight.slider-light.shadow > div.sc-sliderlight__track.track > div:nth-child(4) > img')[0]
        except Exception:
            print("Всего 2 фото")
        else:
            card['photo'].append(photo3['src'])
            card['photo'].append(photo4['src'])
        # Результат карточки
        cards.append(card)
    return cards


def find_place(id):
    with open('table.csv', 'r', newline='', encoding="utf8") as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        lat = ''
        lon = ''
        for row in reader:
            if row[0] == id:
                address = row[9].split(',')
                lat = address[0]
                lon = address[1]
                break
        if lat != '' and lon != '':
            return [True, lat, lon]
        else:
            return [False]

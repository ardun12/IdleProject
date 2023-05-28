import urllib.parse
from sqlalchemy import create_engine, text
from datetime import datetime, timedelta
import amplitude as amp


engine = create_engine(url="SQL_CONNECTION_URL", pool_timeout=20, pool_recycle=299)


# Получить информацию об отелях
async def get_hotels(hotels, kind, star, lcheckin, lcheckout, guests):
    engine.connect()
    dates = lcheckin[2] + '.' + lcheckin[1] + '.' + lcheckin[0] + '-' + lcheckout[2] + '.' + lcheckout[1] + '.' + lcheckout[0]
    # Формирование списка id отелей
    list_id = ""
    for hotel in hotels:
        list_id += "'" + hotel["id"] + "', "
    list_id = list_id[:-2]
    # Формирование типа отелей
    list_kind = " AND `kind` IN ("
    if kind[0] != '':
        for value in kind:
            list_kind += "'" + value + "', "
        list_kind = list_kind[:-2] + ")"
    else:
        list_kind = ""
    # Формирование звездности
    list_star = " AND `star` IN ("
    if star[0] != '':
        for value in star:
            list_star += "'" + value + "', "
        list_star = list_star[:-2] + ")"
    else:
        list_star = ""
    # Запрос
    result = engine.execute(text(f"SELECT * FROM `Hotels` WHERE `id` IN ({list_id}){list_kind}{list_star}"))
    hotels_new = list()
    for item in result.fetchall():
        new = dict()
        new["id"] = str(item[0])
        new["name"] = str(item[1]).replace('*', '').replace('`', '')
        new["address"] = str(item[4]).replace('*', '').replace('`', '')
        new["lat"] = str(item[5])
        new["lon"] = str(item[6])
        new["star"] = int(item[7])
        new["photo"] = str(item[8]).split('|')[:-1]
        new["location"] = "Ост@" + new["lat"] + "@" + new["lon"]
        for old in hotels:
            if old["id"] == new["id"]:
                new["rooms"] = old["rooms"]
        # Партнерская ссылка
        new["url"] = 'https://tp.media/r?marker=404212&trs=204502&p=7038&u=' + urllib.parse.quote(f'https://www.ostrovok.ru/rooms/{new["id"]}/?cur=RUB&dates={dates}&guests={guests}&lang=ru') + '&campaign_id=459'
        hotels_new.append(new)
    engine.dispose()
    return hotels_new


# Сбросить дневной лимит на запросы
async def reset_limit():
    engine.connect()
    engine.execute(text(f"UPDATE `users` SET `Limit_num` = DEFAULT"))
    engine.dispose()


# Проверить остаток на запросы для пользователя
async def check_limit(chatid):
    engine.connect()
    data = True
    result = engine.execute(text(f"SELECT `Limit_num` FROM `users` WHERE `users`.`Chatid` = '{chatid}'"))
    for item in result.fetchone():
        data = int(item)
    if data <= 0:
        data = False
    engine.dispose()
    return data


# Получить остаток на запросы для пользователя
async def get_limit(chatid):
    engine.connect()
    data = 3
    result = engine.execute(text(f"SELECT `Limit_num` FROM `users` WHERE `users`.`Chatid` = '{chatid}'"))
    for item in result.fetchone():
        data = int(item)
    engine.dispose()
    return data


# Снизить остаток на запросы для пользователя
async def update_limit(chatid, username):
    engine.connect()
    engine.execute(text(f"UPDATE `users` SET `Limit_num` = `Limit_num` - 1 WHERE `users`.`Chatid` = '{chatid}'"))
    engine.dispose()
    # Амплитуда
    if await get_limit(chatid) == 0:
        amp.limit(chatid, username)


# Получить все chat_id
async def get_all_chatid():
    engine.connect()
    data = list()
    result = engine.execute(text(f"SELECT `Chatid` FROM `users`"))
    for item in result.fetchall():
        data.append(str(item[0]))
    engine.dispose()
    return data


# Зарегистрировать пользователя в базе
async def register_user(username, chatid):
    engine.connect()
    data = False
    # Проверить наличие пользователя в базе
    result = engine.execute(text(f"SELECT * FROM `users` WHERE `users`.`Chatid` = '{chatid}'"))
    # Если не найден - зарегистрировать
    if result.fetchone() is None:
        data = True
        engine.execute(text(f"INSERT INTO `users` (`Id`, `Username`, `Chatid`, `Pay`, `Limit_num`) VALUES (NULL, '{username}', '{chatid}', '01-01-2001', 3);"))
    engine.dispose()
    return data


# Получить chat_id по username
async def get_chatid(username):
    engine.connect()
    data = ''
    result = engine.execute(text(f"SELECT `Chatid` FROM `users` WHERE `users`.`Username` = '{username}'"))
    temp = result.fetchone()
    if temp is not None:
        for item in temp:
            data = str(item)
    engine.dispose()
    return data


# Проверить подписку
async def check_payment(chatid):
    engine.connect()
    now = datetime.now()
    res = engine.execute(text(f"SELECT `Pay` FROM `users` WHERE `users`.`Chatid` = '{chatid}'"))
    result = now
    for item in res.fetchone():
        data = str(item).split('-')
        result = datetime(int(data[2]), int(data[1]), int(data[0])) + timedelta(days=1)
    if now > result:
        engine.dispose()
        return False
    else:
        engine.dispose()
        return True


# Получить дату платежа
async def get_payment(chatid):
    engine.connect()
    result = engine.execute(text(f"SELECT `Pay` FROM `users` WHERE `users`.`Chatid` = '{chatid}'"))
    data = datetime.now()
    for item in result.fetchone():
        data = str(item)
    engine.dispose()
    return data


# Обновить дату платежа
async def update_payment(chatid):
    engine.connect()
    period = (datetime.now() + timedelta(30)).strftime("%d-%m-%Y")
    engine.execute(text(f"UPDATE `users` SET `Pay` = '{period}' WHERE `users`.`Chatid` = '{chatid}'"))
    engine.dispose()

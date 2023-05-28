from contextlib import asynccontextmanager
from datetime import date, timedelta
from enum import Enum
from typing import Optional
from datetime import date
from typing import List, Optional
from dataclasses import dataclass, asdict

import uvicorn
from fastapi import FastAPI, Depends, Request
from fastapi.staticfiles import StaticFiles

from .tripster import TripsterClient
from .predict import classify_text


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Initialise async services on start
    https://fastapi.tiangolo.com/advanced/events/#lifespan
    """
    application = None  # initialise your telegram-bot app
    await application.start()
    yield
    # Clean up the ML models and stop application
    await application.stop()


app = FastAPI(title="Idlebot API", lifespan=lifespan)

class MovementType(Enum):
    any = 'Любой'
    foot = 'Пешком'
    car = 'На машине'
    watership = 'На кораблике'
    bicycle = 'На велосипеде'
    indoor = 'В помещении'
    bus = 'На автобусе'
    other = 'Другое'


class ExperienceType(Enum):
    private = 'Индивидуальная'
    group = 'Групповая'
    tour = 'Любой'


@dataclass
class ExperienceForm:
    """Модель данных формы поиска"""
    city__name_ru: str = 'Москва'
    start_date: str = str(date.today()) # дата "от" включительно
    end_date: str = str(date.today() + timedelta(2)) # дата "по" включительно
    start_price: int = 1500 # минимальная стоимость
    end_price: int = 3500 # максимальная стоимость
    persons_count: int = 2# количество человек
    movement_type: str = MovementType.foot.name   
    type: str = ExperienceType.group.name
    sorting: str  = 'popularity' # popularity/price


@dataclass
class ExperienceResults:
    """Модель результатов поиска"""
    result: dict

@dataclass
class ExperienceFilter:
    """Filter parameters for the API request"""
    ids: Optional[List[int]] = None
    exclude_ids: Optional[List[int]] = None
    city: Optional[int] = None
    city__slug: Optional[str] = None
    country: Optional[int] = None
    country__slug: Optional[str] = None
    region: Optional[int] = None
    region__slug: Optional[str] = None
    citytag: Optional[int] = None
    guide: Optional[int] = None
    exp_format: Optional[int] = None
    type: Optional[str] = None
    movement_type: Optional[str] = None
    tags: Optional[List[int]] = None
    tag__slugs: Optional[List[str]] = None
    persons_count: Optional[int] = None
    start_price: Optional[int] = None
    end_price: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

@dataclass
class ExperienceSort:
    """Sorting options"""
    popularity: Optional[str] = None
    price: Optional[str] = None

@dataclass
class ExperienceParams:
    """Combines the filter, sort, and other request parameters"""
    filter: Optional[ExperienceFilter] = None
    sort: Optional[ExperienceSort] = None
    detailed: Optional[bool] = False
    updated_after: Optional[date] = None
    schedule_updated_after: Optional[date] = None
    format: Optional[str] = "json"
    page_size: Optional[int] = None
    per_page: Optional[int] = None
    need_results: Optional[bool] = True
    need_aggregations: Optional[bool] = False
    need_upcoming_events: Optional[bool] = False


@app.get(
    "/experiences/",
    response_model=ExperienceResults
)
async def experiences(
    request: Request 
    ):
    tripster_client = await TripsterClient.async_init()
    experience_form: ExperienceForm = ExperienceForm()
    print(asdict(experience_form))
    result = await tripster_client.get_experiences({'city__name_ru': 'Москва'})
    # result = await tripster_client.get_experiences(Experience_form.dict())    
    return ExperienceResults(result)


@app.get("/autocomplete")
async def autocomplete(
    term: Optional[str] = None, 
    tripster_client: TripsterClient = Depends(get_client)
    ):
    results = await tripster_client.autocomplete(term)
    cities = []
    for result in results:
        cities.append(result.title)
    return cities


@app.get("/predict")
async def predict(x: float):
    result = ml_models["answer_to_everything"](x)
    return {"result": result}


@app.post("/tripster-form")
async def tripster_form(info : Request):
    req_info = await info.json()
    
    return {
        "status" : "SUCCESS",
        "data" : req_info
    }


if __name__ == '__main__':
    uvicorn.run("main:app", reload=True)
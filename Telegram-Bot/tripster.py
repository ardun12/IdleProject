import asyncio
import logging
from typing import Optional, List
from dataclasses import dataclass, asdict, fields

import aiohttp


logger = logging.getLogger(__name__)
TRIPSTER_API_ENDPOINT="https://experience.tripster.ru/api/"
TRIPSTER_SECRET=""
TRIPSTER_PARTNER_ID=""

class DataClassUnpack:
    classFieldCache = {}

    @classmethod
    def instantiate(cls, classToInstantiate, argDict):
        if classToInstantiate not in cls.classFieldCache:
            cls.classFieldCache[classToInstantiate] = {
                f.name for f in fields(classToInstantiate) if f.init}

        fieldSet = cls.classFieldCache[classToInstantiate]
        filteredArgDict = {k : v for k, v in argDict.items() if k in fieldSet}
        return classToInstantiate(**filteredArgDict)


@dataclass
class Experience:
    """Represents the data for a single experience"""
    id: Optional[int] = None
    title: Optional[str] = None
    url: Optional[str] = None
    city: Optional[int] = None
    exp_format: Optional[int] = None
    type: Optional[str] = None
    slug: Optional[str] = None
    city_slug: Optional[str] = None
    country: Optional[str] = None
    country_slug: Optional[str] = None
    region: Optional[int] = None
    region_slug: Optional[str] = None
    citytag: Optional[int] = None
    guide: Optional[int] = None
    guide_name: Optional[str] = None
    guide_url: Optional[str] = None
    duration: Optional[int] = None
    movement_type: Optional[str] = None
    persons_count: Optional[int] = None
    price: Optional[str] = None
    currency: Optional[str] = None
    thumbnail_url: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    description: Optional[str] = None
    schedule: Optional[dict] = None
    tags: Optional[List[str]] = None
    category: Optional[dict] = None
    is_online: Optional[bool] = False
    is_hotel_pickup_allowed: Optional[bool] = False
    is_free_cancellation_allowed: Optional[bool] = False
    is_instant_confirmation_allowed: Optional[bool] = False
    is_mobile_ticket_allowed: Optional[bool] = False


@dataclass
class ExperienceResponse:
    """Response data for the `experiences` endpoint"""
    count: Optional[int] = None
    next: Optional[str] = None
    previous: Optional[str] = None
    results: Optional[List[Experience]] = None
    aggregations: Optional[dict] = None
    search_results: Optional[dict] = None
    upcoming_events: Optional[dict] = None


class TripsterClient:
    """Клиент для Tripster Web API"""
    def __init__(self, partner_id: str, secret: str) -> None:
        self.partner_id: str = partner_id
        self.secret: str = secret
        self.api_endpoint: str = TRIPSTER_API_ENDPOINT
        self.auth_token: str = ""

    @classmethod
    async def async_init(cls, partner_id: Optional[str] = None, secret: Optional[str] = None):
        self = TripsterClient(
            partner_id or TRIPSTER_PARTNER_ID, 
            secret or TRIPSTER_SECRET)
        if await self.authenticate():
            return self
        else:
            logger.error("Failed to init Tripster API Client")

    async def authenticate(self):
        async with aiohttp.ClientSession() as session:
            try:
                url = self.api_endpoint + "auth/obtain_token/partner/"
                json_data: dict = {
                    'partner': self.partner_id, 
                    'secret': self.secret,
                }
                async with session.post(url=url, json=json_data) as response:
                    if response.status == 200:
                        data = await response.json()
                        self.auth_token = data.get("token")
                        return True
                    else:
                        logger.error("Failed to obtain authentication token from Tripster API")
                        return False
            except Exception as ex:
                logger.error('Unable to get token for next reason: %s', str(ex))
                return False

    async def make_request(self, endpoint: str, method: str = "GET", params=None) -> Optional[dict]:
        if not self.auth_token:
            if not await self.authenticate():
                return None
        
        headers: dict = {
            'Authorization': f'Token {self.auth_token}',
            'Content-Type': 'application/json'
        }
        async with aiohttp.ClientSession(headers=headers) as session:
            try:
                async with session.request(method, self.api_endpoint + endpoint, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data
                    else:
                        logger.error("Failed to retrieve data from Tripster API")
                        return None
            except Exception as ex:
                logger.error(f'Unable to fetch {endpoint} for next reason: %s', str(ex))
                return None

    async def get_experiences(self, params: dict) -> ExperienceResponse:
        data = await self.make_request("experiences", method = "GET", params=params)
        experience_data = DataClassUnpack.instantiate(ExperienceResponse, data)
        results = data.get("results")
        experience_data.results = [DataClassUnpack.instantiate(Experience, exp) for exp in results]
        return experience_data

    async def get_activities(self, params: dict) -> Optional[dict]:
        data = await self.make_request("experiences", method = "GET", params=params)
        return data

    async def autocomplete(self, term: Optional[str]) -> Optional[dict]:
        params = {"search": term}
        data =  await self.make_request('autocomplete', method = "GET", params=params)
        return data


async def main():
    client: TripsterClient = TripsterClient(TRIPSTER_PARTNER_ID, TRIPSTER_SECRET)
    params = {
        "city__slug": "moscow",
        "type": "private",
        "sorting": "popularity",
        "detailed": "true"
    }
    data = await client.get_experiences(params)
    logger.debug(data)
    params = {
        "city__slug": "moscow",
        "sorting": "price",
        "detailed": "false"
    }
    data = await client.get_activities(params)
    logger.debug(data)


if __name__=="__main__":
    asyncio.run(main())

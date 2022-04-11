from core.models.location import Location
from core.helpers import api_response
import json


def create_location(request, raw_location):

    try:
        city = list(filter(lambda loc: "locality" in loc["types"], raw_location["data"]["address"]))[0]["long_name"]
        state = list(
            filter(lambda loc: "administrative_area_level_1" in loc["types"], raw_location["data"]["address"])
        )[0]["long_name"]

        country = list(filter(lambda loc: "country" in loc["types"], raw_location["data"]["address"]))[0]["long_name"]
        location, _ = Location.objects.get_or_create(
            google_place_id=raw_location["data"]["placeId"],
        )
        location.latitude = raw_location["data"]["latlng"]["lat"]
        location.longitude = raw_location["data"]["latlng"]["lng"]
        location.city = city
        location.state = state
        location.country = country
        location.save()
        id = int(json.dumps(location.id))
    except KeyError:
        return api_response(400, "Invalid data", {})
    except IndexError:
        return api_response(400, "Invalid data", {})
    return id

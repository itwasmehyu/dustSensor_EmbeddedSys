from rasa_sdk import Action
from rasa_sdk.events import SlotSet
import datetime
import requests

class ActionTellTime(Action):
    def name(self):
        return "action_tell_time"

    def run(self, dispatcher, tracker, domain):
        now = datetime.datetime.now()
        time_text = f"Bây giờ là {now.strftime('%H:%M:%S')}."
        dispatcher.utter_message(text=time_text)
        return []

class ActionTellWeather(Action):
    def name(self):
        return "action_tell_weather"
    
    def run(self, dispatcher, tracker, domain):
        weather_text = "Hôm nay trời nắng đẹp, nhiệt độ khoảng 30°C."
        dispatcher.utter_message(text=weather_text)
        return []

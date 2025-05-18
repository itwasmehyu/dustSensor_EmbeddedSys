import requests
from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher

class ActionTellAirQuality(Action):
    def name(self):
        return "action_tell_air_quality"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        api_url = "http://localhost:3030/api/new-dust"
        try:
            response = requests.get(api_url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                pm25 = data.get("dust_density", 0)
                advice = self.get_advice(pm25)

                message = f"Chất lượng không khí: PM2.5 = {pm25} µg/m³. {advice}"
            else:
                message = "Xin lỗi, tôi không thể lấy dữ liệu không khí lúc này."
        
        except requests.exceptions.RequestException:
            message = "Đã có lỗi xảy ra khi kết nối đến API dữ liệu không khí."

        dispatcher.utter_message(text=message)
        return []

    def get_advice(self, pm25):
        """Đưa ra lời khuyên dựa trên mức độ ô nhiễm"""
        if pm25 <= 12:
            return "Không khí trong lành, bạn có thể thoải mái ra ngoài."
        elif pm25 <= 35:
            return "Không khí khá tốt, nhưng bạn có thể đeo khẩu trang khi ra ngoài nếu nhạy cảm."
        elif pm25 <= 55:
            return "Không khí bắt đầu ô nhiễm nhẹ, nên hạn chế các hoạt động ngoài trời."
        elif pm25 <= 150:
            return "Không khí ô nhiễm, người nhạy cảm nên đeo khẩu trang khi ra ngoài."
        elif pm25 <= 250:
            return "Không khí rất ô nhiễm, hãy hạn chế ra ngoài và đóng cửa sổ."
        else:
            return "Ô nhiễm nghiêm trọng! Nên ở trong nhà và sử dụng máy lọc không khí."

class ActionDefaultFallback(Action):
    def name(self):
        return "action_default_fallback"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        message = "Xin chào tôi là bot trả lời tự động đưa ra lời khuyên về độ bụi trong không khí?"
        dispatcher.utter_message(text=message)
        return []




# import requests
# from rasa_sdk import Action
# from rasa_sdk.executor import CollectingDispatcher

# class ActionTellAirQuality(Action):
#     def name(self):
#         return "action_tell_air_quality"

#     def run(self, dispatcher: CollectingDispatcher, tracker, domain):
#         api_url = "http://localhost:3030/api/new-dust"
#         try:
#             response = requests.get(api_url, timeout=5)
#             pm25 = response.json().get('PM25', 0)
#             advice = self.get_air_quality_advice(pm25)
#             dispatcher.utter_message(text=advice)
#         except Exception as e:
#             dispatcher.utter_message(text="Xin lỗi, tôi không thể lấy được thông tin về chất lượng không khí.")
#         return []

#     def get_air_quality_advice(self, pm25):
#         if pm25 <= 12:
#             return "Không khí trong lành, bạn có thể thoải mái ra ngoài."
#         elif pm25 <= 35:
#             return "Không khí khá tốt, nhưng bạn có thể đeo khẩu trang khi ra ngoài nếu nhạy cảm."
#         elif pm25 <= 55:
#             return "Không khí bắt đầu ô nhiễm nhẹ, nên hạn chế các hoạt động ngoài trời."
#         elif pm25 <= 150:
#             return "Không khí ô nhiễm, người nhạy cảm nên đeo khẩu trang khi ra ngoài."
#         elif pm25 <= 250:
#             return "Không khí rất ô nhiễm, hãy hạn chế ra ngoài và đóng cửa sổ."
#         else:
#             return "Chất lượng không khí cực kỳ xấu, hãy ở trong nhà và đóng cửa sổ."

class ActionHealthProtection(Action):
    def name(self):
        return "action_health_protection"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        protection_tips = [
            "1. Đeo khẩu trang khi ra ngoài",
            "2. Giữ ẩm không khí trong nhà",
            "3. Rửa tay thường xuyên",
            "4. Tránh tiếp xúc với không khí ô nhiễm"
        ]
        dispatcher.utter_message(text="\n".join(protection_tips))
        return []

# class ActionWeatherForecast(Action):
#     def name(self):
#         return "action_weather_forecast"

#     def run(self, dispatcher: CollectingDispatcher, tracker, domain):
#         # Định nghĩa trực tiếp API key (hoặc có thể lưu trong biến môi trường an toàn hơn)
#         api_key = "0e28d01ee5d95d90e3bc33e7ab9760a0"

#         # Lấy vị trí từ người dùng (nếu có)
#         location = tracker.get_slot("location")
#         if location:
#             # Sử dụng địa điểm được cung cấp
#             lat = location.get("lat")
#             lon = location.get("lon")
#         else:
#             # Sử dụng vị trí mặc định (Hà Nội)
#             lat = "21.0285"
#             lon = "105.8542"

#         try:
#             # Gọi API OpenWeatherMap
#             url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
#             response = requests.get(url)
#             data = response.json()

#             if response.status_code == 200:
#                 # Xử lý dữ liệu thời tiết
#                 temperature = data['main']['temp']
#                 humidity = data['main']['humidity']
#                 description = data['weather'][0]['description']
#                 wind_speed = data['wind']['speed']

#                 message = f"Dự báo thời tiết tại vị trí của bạn:\n"
#                 message += f"Nhiệt độ: {temperature:.1f}°C\n"
#                 message += f"Độ ẩm: {humidity}%\n"
#                 message += f"Trời: {description}\n"
#                 message += f"Tốc độ gió: {wind_speed} m/s"

#                 dispatcher.utter_message(text=message)
#             else:
#                 dispatcher.utter_message(text="Xin lỗi, không thể lấy được thông tin thời tiết.")
                
#         except Exception as e:
#             dispatcher.utter_message(text="Xin lỗi, có lỗi khi truy cập API thời tiết.")
#             print(f"Error: {str(e)}")

#         return []

class ActionOutdoorActivities(Action):
    def name(self):
        return "action_outdoor_activities"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        activities = [
            "1. Đi dạo trong công viên",
            "2. Chạy bộ",
            "3. Đạp xe",
            "Lưu ý: Tránh các hoạt động ngoài trời khi chất lượng không khí xấu"
        ]
        dispatcher.utter_message(text="\n".join(activities))
        return []
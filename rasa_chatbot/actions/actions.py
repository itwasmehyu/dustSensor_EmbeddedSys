import requests
from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher

class ActionTellAirQuality(Action):
    def name(self):
        return "action_tell_air_quality"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        # api_url = "http://localhost:3030/api/dust"
        # try:
        #     response = requests.get(api_url)
        #     data = response.json()
        #     # kiểu dữ liệu {
        #     #   "city": "Hanoi",
        #     #   "pm2_5": 85
        #     # }
        #     if response.status_code == 200:
        #         pm25 = data.get("pm2_5", 0)
        #         city = data.get("city", "khu vực của bạn")
        #         advice = self.get_advice(pm25)

        #         message = f"Chất lượng không khí tại {city}: PM2.5 = {pm25} µg/m³. {advice}"
        #     else:
        #         message = "Xin lỗi, tôi không thể lấy dữ liệu không khí lúc này."
        
        # except Exception as e:
            # message = "Đã có lỗi xảy ra khi lấy dữ liệu không khí."

        # fix dữ liệu
        data = {
            "city": "Hanoi",
            "pm2_5": 85
        }
        pm25 = data.get("pm2_5", 0)
        city = data.get("city", "khu vực của bạn")
        advice = self.get_advice(pm25)

        message = f"Chất lượng không khí tại {city}: PM2.5 = {pm25} µg/m³. {advice}"
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

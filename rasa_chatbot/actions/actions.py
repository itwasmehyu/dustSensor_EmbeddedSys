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

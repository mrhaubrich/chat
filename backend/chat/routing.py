from django.urls import re_path

from chat import channels as consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room>\d+)/$", consumers.ChatConsumer.as_asgi()),
]
"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from signal import pause

from channels.routing import ProtocolTypeRouter, URLRouter
from chat.views import (
    CategoryViewSet, CreateUserView, RoomViewSet, index, teste,
)
from django.contrib import admin
from django.urls import path, re_path
from rest_framework import routers

from chat import channels as consumers

ROUTER = routers.DefaultRouter()

ROUTER.register('categories', CategoryViewSet, basename='categories')
ROUTER.register('rooms', RoomViewSet, basename='rooms')

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('rooms/<int:pk>/messages/<int:message_pk>/', RoomViewSet.as_view({
    #     'patch': 'edit_message',
    #     'delete': 'delete_message'
    # })),
    # path('rooms/<int:pk>/messages/', RoomViewSet.as_view({
    #     'get': 'messages',
    #     'post': 'send_message'
    # })),
    path('create_user/', CreateUserView.as_view()),
    path('', index),
    re_path(r'^chat/(?P<room>\d+)/$', teste),
] + ROUTER.urls

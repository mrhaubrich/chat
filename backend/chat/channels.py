# chat channels
# Path: backend/chat/channels.py

import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

from .models import Message, Room


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room = self.scope['url_route']['kwargs']['room']
        self.room_group_name = f'chat_{self.room}'
        self.user = self.scope['user']
        if self.user.is_anonymous:
            await self.close()
        else:
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        user = await self.get_user(self.user.username)
        room = await self.get_room()
        await self.create_message(message, user, room)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': f'{user.username} diz: {message}',
                'user': user.username
            }
        )

    async def chat_message(self, event):
        message = event['message']
        user = event['user']
        await self.send(text_data=json.dumps({
            'message': message,
            'user': user
        }))

    @database_sync_to_async
    def get_room(self):
        return Room.objects.get(id=self.room)
    
    @database_sync_to_async
    def create_message(self, message, user, room):
        return Message.objects.create(user=user, room=room, message=message)
    
    @database_sync_to_async
    def get_user(self, username):
        try:
            return get_user_model().objects.get(username=username)
        except ObjectDoesNotExist:
            return AnonymousUser()
        
    @database_sync_to_async
    def update_last_seen(self, user):
        user.last_seen = timezone.now()
        user.save()
# chat consumers
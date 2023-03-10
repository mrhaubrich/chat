from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from chat import models


class RoomSerializer(serializers.ModelSerializer):
    users = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = models.Room
        fields = ['id', 'name', 'users']


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = models.Message
        fields = ['id', 'message', 'timestamp', 'edited_timestamp', 'user']


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, style={'input_type': 'password'})

    class Meta:
        model = models.User
        fields = ['id', 'username', 'last_seen', 'is_online', 'password']


class CategorySerializer(serializers.ModelSerializer):
    parent = serializers.StringRelatedField()
    # children is a CategorySerializer
    children = serializers.ListField(child=RecursiveField())

    class Meta:
        model = models.Category
        fields = ['id', 'name', 'parent', 'children']

from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class User(AbstractUser):
    """Add additional fields to the default User model"""
    # last_seen
    # is_online
    last_seen = models.DateTimeField(auto_now=True)
    is_online = models.BooleanField(default=False)
    channels_token = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.username


class Message(models.Model):
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    edited_timestamp = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey('Room', on_delete=models.CASCADE, related_name='messages')

    def __str__(self):
        return self.message

    class Meta:
        ordering = ['-timestamp']


class Room(models.Model):
    name = models.CharField(max_length=255)
    users = models.ManyToManyField(User, related_name='rooms', blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey(
        'self', null=True, blank=True, related_name='children', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

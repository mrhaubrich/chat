# Generated by Django 4.1.7 on 2023-02-20 20:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_alter_room_messages_alter_room_users'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='channels_token',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
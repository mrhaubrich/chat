from chat.models import Room
from chat.serializers import MessageSerializer, RoomSerializer, UserSerializer
from django.conf import settings
from django.shortcuts import render
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action, schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Create your views here.


@schema(None)
class RoomViewSet(viewsets.ModelViewSet):
    max_paginate_by = 20
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.serializer_class.Meta.model.objects.all()
        return self.request.user.rooms.all()

    def perform_create(self, serializer):
        serializer.save(users=[self.request.user])

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        room_pk = pk
        room = self.serializer_class.Meta.model.objects.get(pk=room_pk)
        room.users.add(request.user)
        return Response(status.HTTP_202_ACCEPTED)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        room = self.get_object()
        room.users.remove(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        room: Room = self.get_object()
        messages = room.messages.all()
        # if len(messages) > 0:
        #     paginator = Paginator(messages, 20)
        #     page = request.GET.get('page')
        #     messages = paginator.get_page(page)
        for message in messages:
            # only first 50 characters
            message.message = message.message[:10000]
        messages = self.paginate_queryset(messages)[::-1]
        return self.get_paginated_response(MessageSerializer(messages, many=True).data)

    @action(detail=True, methods=['post'], url_path='messages/send')
    def send_message(self, request, pk=None):
        room = self.get_object()
        message = request.data.get('message')
        room.messages.create(user=request.user, message=message)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'])
    def edit_message(self, request, pk=None, message_pk=None):
        room = self.get_object()
        message = request.data.get('message')
        room.messages.filter(pk=message_pk).update(message=message)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['delete'])
    def delete_message(self, request, pk=None, message_pk=None):
        room = self.get_object()
        room.messages.filter(pk=message_pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChannelsConnectionView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        return Response({
            'channels_url': settings.get('CHANNELS_URL'),
            'channels_token': self.get_serializer(request.user).data['channels_token']
        })


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)

    def perform_create(self, serializer):
        instance = serializer.save()
        instance.set_password(instance.password)
        instance.save()


def index(request):
    return render(request, "chat/index.html")


def teste(request, room):
    return render(request, "chat/teste.html", {
        'room': room
    })

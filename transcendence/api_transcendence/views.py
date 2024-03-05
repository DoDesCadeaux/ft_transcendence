# api/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from app.models import User
from app.serializer import UserManagementSerializer  # Assurez-vous d'avoir un fichier serializers.py dans votre application principale


class UserUpdateAPIView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserManagementSerializer

    def update(self, request, *args, **kwargs):
        id_api = self.kwargs.get('id_api')
        try:
            user = User.objects.get(id_api=id_api)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Mise à jour de l'username
        new_username = request.data.get('username')
        if new_username:
            user.username = new_username

        # Mise à jour de la photo
        new_photo = request.data.get('photo')
        if new_photo:
            user.photo = new_photo

        user.save()
      
        serializer = UserManagementSerializer(user)
        return Response(serializer.data)
    

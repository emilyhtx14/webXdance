"""djangoProject1 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
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
from django.contrib import admin
from django.urls import path

from matching.views import matching_create_view, matching_detail_view, create_home_view
from video.views import show_view


urlpatterns = [
    path('admin/', admin.site.urls),
    path('chat/', show_view),
    path('matching/', matching_create_view),
    path('matching/result',matching_detail_view),
    path('home/', create_home_view)

]

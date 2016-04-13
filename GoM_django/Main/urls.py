"""GoM_django URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from Main import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^login/$', views.user_login),
    url(r'^logout/$', views.user_logout),
    url(r'^register/$', views.register),
    url(r'^profile/$', views.profile_overview),
    url(r'^profile/edit/$', views.edit_profile),
    url(r'^questions/$', views.questions),
    url(r'^query/$', views.query),
    url(r'^dashboard/$', views.dashboard),
    url(r'^diary/$', views.diary),
    url(r'^dashboard/(?P<user_id>[0-9]+)/$', views.coach_user_profile),
]

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
from GoM_django import settings
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns



urlpatterns = [
    url(r'^$', views.index),
    url(r'^login/$', views.user_login),
    url(r'^logout/$', views.user_logout),
    url(r'^register/$', views.register),
    url(r'^profile/$', views.profile_overview),
    url(r'^profile/edit/$', views.edit_profile),
    url(r'^profile/help/$', views.profile_help),

    # url(r'^questions/$', views.questions),
    # url(r'^query/$', views.query),

    # url(r'^survey_submit/$', views.survey_submit),
    url(r'^survey/add/$', views.add_survey),
    url(r'^survey/view/$', views.view_surveys),
    url(r'^survey/view/(?P<survey_id>.*)/$', views.view_survey),
    url(r'^survey/modify/(?P<survey_id>.*)/$', views.view_edit_survey),
    url(r'^student/surveys/$', views.student_survey_profile),


    url(r'^dashboard/$', views.dashboard),
    url(r'^diary/$', views.diary),
    url(r'^dashboard/(?P<user_id>[0-9]+)/$', views.coach_user_profile),
    url(r'^coachlist/$', views.approved_coaches),


    # url(r'^activity/add/$', views.add_activity),
    # # url(r'^activity_view/$', views.view_activities),
    # url(r'^assign_activity/$', views.assign_activity),
    # url(r'^complete_task/$', views.complete_task),

    url(r'^test/$', views.test_pic),

    url(r'^survey/flow/(?P<survey_id>.*)/$', views.flow),
    url(r'^survey/take/(?P<survey_id>.*)/$', views.take_survey),
    url(r'^survey/default/$', views.default_surveys),
    url(r'^coach/survey/assign/$', views.assign_survey),
    url(r'^admin/default-setting/$', views.update_default_setting),

    url(r'^atrack/add/$', views.add_track),
    url(r'^atrack/all/$', views.view_tracks),
    url(r'^atrack/take/(?P<track_id>.*)/$', views.view_track),
    url(r'^coach/atrack/assign/$', views.assign_activity_track),
    url(r'^activity/complete/$', views.complete_activity),
    url(r'^student/tracks/$', views.student_activity_profile),
    url(r'^coach/diary/(?P<student_id>.*)/$', views.coach_diary),


    url(r'^atrack/all/(?P<track_id>\w+)/$', views.view_activity),
    url(r'^atrack/all/(?P<track_id>\w+)/(?P<activity_id>.*)/$', views.view_activity),
    # url(r'^atrack/(?P<track_id>.*)/edit/$', views.edit_activity),
    url(r'^atrack/view/(?P<track_id>.*)/$', views.completed_track),
    url(r'^activity/add_single/$', views.add_single_activity),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

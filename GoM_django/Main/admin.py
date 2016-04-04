from django.contrib import admin
from Main.models import *

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'gender', 'college', 'city')
    search_fields = ['name']

admin.site.register(user_profile, ProfileAdmin)
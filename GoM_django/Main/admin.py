from django.contrib import admin
from Main.models import *

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'gender', 'college', 'city')
    search_fields = ['name']

class CoachAdmin(admin.ModelAdmin):
    list_display = ('name', 'gender','email_id')
    search_fields = ['name']

class AdminAdmin(admin.ModelAdmin):
    list_display = ('name', 'gender', 'email_id')
    search_fields = ['name']    
admin.site.register(user_profile, ProfileAdmin)
admin.site.register(coach_profile, CoachAdmin)
admin.site.register(admin_profile, AdminAdmin)

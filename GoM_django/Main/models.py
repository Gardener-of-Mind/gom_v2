from django.db import models
from django.contrib.auth.models import User
from django.db import models
from mongoengine import *
from django.utils import timezone

class gauss(Document):
    email = StringField(required=True)
    first_name = StringField(max_length=50)
    last_name = StringField(max_length=50)


class Diary(Document):
    modified_date = DateTimeField()
    title = StringField(required=True)
    text_data = StringField(required= True)
    user_id = IntField(required=True)

    def save(self, *args, **kwargs):
        self.modified_date = timezone.now()
        return super(Diary, self).save(*args, **kwargs)


# Survey Models

class survey(Document):
    name= StringField(max_length=50,blank=True)
    category= StringField(max_length=50,blank=True)

class survey_questions(Document):
    text=StringField(max_length=1000)
    query_type= StringField(max_length=50)
    options = ListField(null=True)  
    score= ListField(blank=True,null=True)
    survey= ReferenceField(survey)
    class Meta:
        verbose_name_plural = 'Questions'
    def __unicode__(self):
        return str(self.text)

class survey_answers(Document):
    answers = ListField(null=True)
    question= ReferenceField(survey_questions)
    user_id= IntField(null=True)


#Activity Models


class Activity(Document):
    name= StringField(max_length=50,blank=True)
    category= StringField(max_length=50,blank=True)


class Task(Document):
    title = StringField(max_length=100)
    details = StringField(max_length=500,blank=True)
    activity = ReferenceField(Activity)

    class Meta:
        verbose_name_plural = 'Task'
    def __unicode__(self):
        return str(self.text)


class UserActivity(Document):
    completed_tasks = ListField(ReferenceField(Task))
    assigned_activity = ReferenceField(Activity)
    user_id= IntField(null=True)





# Relational DB models



class coach_profile(models.Model):
    user = models.OneToOneField(User, null=True)    
    GENDERS = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    name = models.CharField(max_length=200)
    gender = models.CharField(max_length=1, choices=GENDERS)
    phone_one = models.BigIntegerField(blank=True,null=True, default='')
    email_id = models.EmailField(unique=True)
    about_me= models.TextField(default='')  
    city = models.CharField(max_length=20, null=True)
    profile_pic= models.ImageField(blank=True, upload_to='pictures', null=True, default='pictures/default.jpg')     
    status = models.BooleanField(default=False)
    created     = models.DateTimeField(editable=False, null=True)

    class Meta:
        verbose_name_plural = 'coach_profile'
    def __unicode__(self):
        return str(self.name)

    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.id:
            self.created = timezone.now()
        return super(coach_profile, self).save(*args, **kwargs)


class user_profile(models.Model):
    user = models.OneToOneField(User, null=True)    
    GENDERS = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    name = models.CharField(max_length=200)
    gender = models.CharField(max_length=1, choices=GENDERS)
    college = models.CharField(max_length=200, default='')
    city = models.CharField(max_length=20, null=True, default='')
    phone = models.BigIntegerField(blank=True,null=True)
    email_id = models.EmailField(unique=True)
    occupation= models.CharField(max_length=200, default='', blank=True)
    about_me= models.TextField(default='')
    coach = models.ForeignKey(coach_profile, null=True, default=None, blank= True)
    profile_pic= models.ImageField(blank=True, upload_to='pictures', null=True, default='pictures/default.jpg') 
    # questions= models.BooleanField(default=False)
    anxiety_score= models.IntegerField(blank=True,null=True)
    class Meta:
        verbose_name_plural = 'user_profile'
    def __unicode__(self):
        return str(self.name)
    


class admin_profile(models.Model):
    user = models.OneToOneField(User, null=True)    
    GENDERS = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    name = models.CharField(max_length=200)
    gender = models.CharField(max_length=1, choices=GENDERS)
    phone_one = models.BigIntegerField(blank=True,null=True)
    email_id = models.EmailField(unique=True)
    profile_pic= models.ImageField(blank=True, upload_to='pictures', null=True, default='pictures/default.jpg') 

    class Meta:
        verbose_name_plural = 'admin_profile'
    def __unicode__(self):
        return str(self.name)





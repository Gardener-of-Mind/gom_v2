from django.db import models
from django.contrib.auth.models import User
from django.db import models
from mongoengine import *


class gauss(Document):
    email = StringField(required=True)
    first_name = StringField(max_length=50)
    last_name = StringField(max_length=50)



class survey_questions(Document):
	text=StringField(max_length=1000)
	query_type= StringField(max_length=50)
	options = ListField(null=True)	
	score= IntField(blank=True,null=True)
	category= StringField(max_length=50,blank=True)
	class Meta:
		verbose_name_plural = 'Questions'
	def __unicode__(self):
		return str(self.text)

class survey_answers(Document):
	answers = ListField(null=True)
	question= ReferenceField(survey_questions)
	user_id= IntField(null=True)



class coach_profile(models.Model):
	user = models.OneToOneField(User, null=True)	
	GENDERS = (
		('M', 'Male'),
		('F', 'Female'),
	)
	name = models.CharField(max_length=200)
	gender = models.CharField(max_length=1, choices=GENDERS)
	phone_one = models.BigIntegerField(blank=True,null=True)
	email_id = models.EmailField(unique=True)
	class Meta:
		verbose_name_plural = 'coach_profile'
	def __unicode__(self):
		return str(self.name)


class user_profile(models.Model):
	user = models.OneToOneField(User, null=True)	
	GENDERS = (
		('M', 'Male'),
		('F', 'Female'),
	)
	name = models.CharField(max_length=200)
	gender = models.CharField(max_length=1, choices=GENDERS)
	college = models.CharField(max_length=200, default='')
	city = models.CharField(max_length=20)
	phone = models.BigIntegerField(blank=True,null=True)
	email_id = models.EmailField(unique=True)
	occupation= models.CharField(max_length=200, default='', blank=True)
	about_me= models.TextField(default='')
	coach = models.ForeignKey(coach_profile, null=True, default=None, blank= True)
	profile_pic= models.ImageField(blank=True, upload_to='pictures', null=True)	
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

	class Meta:
		verbose_name_plural = 'admin_profile'
	def __unicode__(self):
		return str(self.name)


class question(models.Model):
	text=models.CharField(max_length=1000)
	query_type= models.CharField(max_length=50)
	option1= models.CharField(max_length=1000, blank=True)
	option2= models.CharField(max_length=1000, blank=True)
	option3= models.CharField(max_length=1000, blank=True)
	option4= models.CharField(max_length=1000, blank=True)
	option6= models.CharField(max_length=1000, blank=True)
	option7= models.CharField(max_length=1000, blank=True)
	option8= models.CharField(max_length=1000, blank=True)
	option9= models.CharField(max_length=1000, blank=True)
	option10= models.CharField(max_length=1000, blank=True)
	score= models.IntegerField(blank=True,null=True)
	category= models.CharField(max_length=50,blank=True)
	class Meta:
		verbose_name_plural = 'Questions'
	def __unicode__(self):
		return str(self.text)

		
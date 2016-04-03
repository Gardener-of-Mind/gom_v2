from django.db import models
from django.contrib.auth.models import User



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
	phone_one = models.BigIntegerField(blank=True,null=True)
	email_id = models.EmailField(unique=True)
	questions= models.BooleanField(default=False)
	anxiety_score= models.IntegerField(blank=True,null=True)
	class Meta:
		verbose_name_plural = 'user_profile'
	def __unicode__(self):
		return str(self.name)


class question(models.Model):
	text=models.CharField(max_length=1000)
	answer= models.CharField(max_length=1000, blank=True, default='')
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

		
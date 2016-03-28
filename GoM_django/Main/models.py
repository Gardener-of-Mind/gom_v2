from django.db import models

# Create your models here.

class user_profile(models.Model):
	GENDERS = (
		('M', 'Male'),
		('F', 'Female'),
        # ('O', 'Other'),	
	)
	name = models.CharField(max_length=200)
	gender = models.CharField(max_length=1, choices=GENDERS)
	college = models.CharField(max_length=200, default='')
	city = models.CharField(max_length=20)
	phone_one = models.BigIntegerField()
	email_id = models.EmailField(unique=True)
	class Meta:
		verbose_name_plural = 'user_profile'
	def __unicode__(self):
		return str(self.name)
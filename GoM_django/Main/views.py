# -*- coding: utf-8 -*-
from django.template import RequestContext
from django.shortcuts import render, render_to_response, redirect
# from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect,Http404,HttpResponse, JsonResponse
from django.template.loader import get_template
from django.template import Context
from django.core.mail import send_mail, EmailMessage
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.db import IntegrityError
from Main.models import *
import json
from django.forms.models import model_to_dict
# Create your views here.

def index(request):
	return render(request,'index.html')


def user_login(request):
	if request.user.is_authenticated():
		return HttpResponseRedirect('../dashboard/')

	if request.POST:
		username= request.POST['username']
		password= request.POST['password']
		user= authenticate(username=username, password=password)
		if user:
			login(request,user)
			# profile= user_profile.objects.filter(user=user)
			# if profile.questions == False:
				# return HttpResponseRedirect('../dashboard/')
			return HttpResponseRedirect('../dashboard/')
	return render(request,'login.html')


def register(request):
	if request.POST:
		username= request.POST['username']
		email_id= request.POST['email']
		password = request.POST['password']
		# try:
		try:
			user = User.objects.create_user(username= username, email= email_id,password= password)
		except:
			error = "Username is already Taken"
			return render(request, 'register.html', {'error' : error} )
		user.set_password(user.password)
		try:
			profile=user_profile(user=user,email_id=email_id, name=username)
			profile.save()
		except:
			error = "Email Address is already taken"
			user.delete()
			return render(request, 'register.html', {'error' : error})
		auth_user= authenticate(username=username,password=password)
		login(request,auth_user)
		# except:
		# 	return HttpResponse('Error')
		return HttpResponseRedirect('../questions/')
	return render(request,'register.html')


def user_logout(request):
    logout(request)
    return redirect('../')


def questions(request):
	if request.POST:
		survey_id = str(request.POST['oid'])
		surveys = survey.objects(id=survey_id)
		questions_list = survey_questions.objects(survey= survey).order_by('id')
	surveys= survey.objects.all().first()
	oid = surveys.id
	surveys= surveys.to_json()
	# data = serializers.serialize("json", questions_list)
	# return HttpResponse(queries)
	return render(request,'initial_survey.html', {'oid':oid})



def query(request):
	if request.POST:
		survey_id = str(request.POST['oid'])
		survey_ob = survey.objects(id=survey_id).first()
		questions_list = survey_questions.objects(survey= survey_ob).order_by('id')
		queries= questions_list.to_json()
		return HttpResponse(queries)


def survey_submit(request):
	user = request.user
	try:
		profile =user.user_profile
	except:
		return HttpResponse('Profile object error')

	if request.POST:
		answers_list = request.POST.getlist('answers[]')
		# return HttpResponse(str(answers_list))
		survey_id = str(request.POST['oid'])
		survey_ob = survey.objects(id=survey_id).first()
		questions = survey_questions.objects(survey=survey_ob) 
		category = str(survey_ob.category)
		k=0
		total_score= 0
		# for query in questions:
		# 	answer = answers_list[k]
		# 	try:
		# 		answer_index = query.options.index(str(answer))
		# 		score = query.score['answer_index'] 
		# 	except:
		# 		pass
		# 	total_score+= score
		# 	k+=1

		# if category == 'anxiety':
		# 	profile.anxiety_score += total_score

		return HttpResponseRedirect('../profile/edit/') 




@login_required
def dashboard(request):
	user=request.user
	try:
		profile= user_profile.objects.get(user=user)
		return render(request,'user/dashboard.html',{'profile': profile})
	except:
		pass			
	try:
		profile= coach_profile.objects.get(user=user)
		user_profile_obs = profile.user_profile_set.all()
		return render(request,'coach/dashboard.html',{'profile': profile, 'user_profiles' : user_profile_obs})
	except:
		pass
	try:
		profile= admin_profile.objects.get(user=user)
		coach_obs = coach_profile.objects.filter(status=False)
		return render(request,'admin/dashboard.html',{'profile': profile, 'coach_obs' : coach_obs})
	except:
		pass		
	return HttpResponse('Profile Not Found')


@login_required
def edit_profile(request):
	user=request.user
	try:
		profile= user_profile.objects.get(user=user)
	except:
		return HttpResponse('Error')


	if 'profile' not in locals():
		return HttpResponse('Error')
	else:
		if request.POST.get('profile_pic',False):
			# try:
			profile.profile_pic = request.FILES['display_pic']
			profile.save()
			return HttpResponseRedirect('.')
			# except:
				# return HttpResponse('Error')
		if request.POST:
			try:
				name = str(request.POST['name'])
			except:
				name = ''
			
			try:
				gender = str(request.POST['gender'])
			except:
				gender = 'M'

			try:
				college = str(request.POST['college'])
			except:
				college = ''

			try:
				city = str(request.POST['city'])
			except:
				city = ''

			try:
				occupation = str(request.POST['occupation'])
			except:
				occupation = ''

			try:
				phone = int(request.POST['phone'])
			except:
				phone = 0

			try:
				about_me = str(request.POST['about_me'])
			except:
				about_me = ''

			profile.name= name
			profile.gender= gender
			profile.college = college
			profile.occupation = occupation
			profile.phone = phone
			profile.city= city
			profile.about_me = about_me
			profile.save()
			return HttpResponseRedirect('.')

		return render(request,'user/profile_account.html', {'profile':profile})


@login_required
def profile_overview(request):
	user=request.user
	try:
		profile= user_profile.objects.get(user=user)
	except:
		pass			
	try:
		profile= coach_profile.objects.get(user=user)
	except:
		pass
	try:
		profile= admin_profile.objects.get(user=user)
	except:
		pass
	if 'profile' not in locals():
		return HttpResponse('Error')
	else:
		return render(request,'user/profile_overview.html', {'profile':profile})


@login_required
def diary(request):
	user= request.user
	profile= user.user_profile
	if request.POST:
		oid = str(request.POST.get('oid',False))
		text = str(request.POST['text'])
		try:
			diary = Diary.objects(id= oid).first()
			diary.text_data = text
			diary.save()
		except:
			title = str(request.POST['title'])
			diary = Diary(title=title,text_data=text, user_id =int(profile.id))
			diary.save()
		# diary = diary.to_json()
		return HttpResponseRedirect('.')
	diaries= Diary.objects(user_id = int(profile.id))
	diaries= diaries.to_json()
	return render(request,'user/diary.html', {"profile": profile, "diaries" : diaries})



@login_required
def coach_user_profile(request,user_id):
	user= request.user
	try:
		profile = coach_profile.objects.get(user=user)
	except:
		return HttpResponse('Coach Object Error')

	try:
		user_profile_ob = user_profile.objects.get(id= int(user_id))
	except:
		return HttpResponse('User Profile object error')

	return render(request,'coach/user_details.html', {'profile' : profile, 'user_profile' : user_profile_ob})



@login_required
def approved_coaches(request):
	user = request.user
	try:
		profile = admin_profile.objects.get(user=user)
	except:
		return HttpResponse('Admin object Error')

	coach_obs = coach_profile.objects.filter(status=True)
	return render(request, 'admin/approved_coach.html', {'profile' : profile, 'coach_obs' : coach_obs})





def test_pic(request):
	pro  = user_profile.objects.all()[0]
	return render_to_response('test.html', {'pro' : pro }, context_instance = RequestContext(request))


def profile_help(request):
	user = request.user
	profile= user_profile.objects.get(user=user)
	return render(request,'user/profile_help.html', {'profile' : profile})



def add_survey(request):
	user = request.user
	profile = admin_profile.objects.get(user=user)
	return render(request, 'admin/survey_add.html', {'profile' : profile})

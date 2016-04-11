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
		user = User.objects.create_user(username= username, email= email_id,password= password)
		user.set_password(user.password)
		profile=user_profile(user=user,email_id=email_id)
		profile.save()
		auth_user= authenticate(username=username,password=password)
		login(request,auth_user)
		# except:
		# 	return HttpResponse('Error')
		return HttpResponseRedirect('../profile/edit/')
	return render(request,'register.html')


def user_logout(request):
    logout(request)
    return redirect('../')



def questions(request):
	if request.POST:
		qid= int(request.POST['qid'])
		query= question.objects.get(id=qid)
		return query
	questions_list = survey_questions.objects.all()
	queries= questions_list.to_json()
	# data = serializers.serialize("json", questions_list)
	# return HttpResponse(queries)


	return render(request,'initial_survey.html', {'questions':queries})

def query(request):
	if request.POST:
		category= request.POST['category']
		if category == 'anxiety':
			questions_list = survey_questions.objects(category='anxiety')
			queries= questions_list.to_json()
			return HttpResponse(queries)

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
		return render(request,'coach/dashboard.html',{'profile': profile})
	except:
		pass
	try:
		profile= admin_profile.objects.get(user=user)
		return render(request,'admin/dashboard.html',{'profile': profile})
	except:
		pass		
	return HttpResponse('Profile Not Found')

@login_required
def edit_profile(request):
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
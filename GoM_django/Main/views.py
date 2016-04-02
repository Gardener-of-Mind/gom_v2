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
from django.db import IntegrityError


# Create your views here.
def index(request):
	return render(request,'index.html')

def login(request):
	if request.POST:
		username= request.POST['username']
		password= request.POST['password']
		user= authenticate(username=username, password=password)
		if user:
			login(request,user)
			profile= user_profile.objects.filter(user=user)
			if profile.questions == False:
				return HttpResponseRedirect('../questions/')
			return HttpResponseRedirect('../dashboard/')
	return render(request,'login.html')

def register(request):
	if request.POST:
		username= request.POST['username']
		email_id= request.POST['email']
		password = request.POST['password']
		try:
			user = User.objects.create(username= username, email= email_id,password= password)
		except:
			return HttpResponse('Error')
		return HttpResponseRedirect('../questions/')
	return render(request,'register.html')

def questions(request):
	if request.POST:
		qid= int(request.POST['qid'])
		query= question.objects.get(id=qid)
		return query
	query= query.objects.all().order_by('id')[0]
	return render(request,'initial_survey.html', {'query' : query})


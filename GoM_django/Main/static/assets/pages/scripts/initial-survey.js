function nextQuestion(qid,answer) {
	$.ajax({
		url : '.',
		method: 'POST',
		data: JSON.parse({"qid":qid,"answer":answer}),
		success: function(response) {
			showForm();
			console.log(response);
		},
		error: function() {
			console.log("error");
		},
	});
}

function beginSurvey(category) {
	$.ajax({
		url : '.',
		method: 'POST',
		data: JSON.parse({"category":category}),
		success: function(response) {
			console.log(response);
		},
		error: function() {
			console.log("error");
		},
	});
}

$(document).ready(function(){

	$('.body-box').animate({'padding-top':'40px','opacity':'1'},500);

	$('.survey-type-btn').click(function(){
		console.log($(this).data('type'))
		// beginSurvey();
	});
	// surveySwitch();
	// $('.body-box').css({'opacity':'','margin-top':''});
	// setTimeout(function(){
	// },500);

	// $('.mcq').click(function(){
	// 	$(this).toggleClass('selected');
	// })

	// $('.yes-no-option').click(function(){
	// 	$('.yes-no-option').removeClass("active inactive");
	// 	$(this).addClass("active");
	// 	$(this).siblings().addClass('inactive');
	// });
	// sliderInit();
});

function surveySwitch() {

	$('.survey-form-back').click(function(){
		$('.survey-form').fadeOut(300);
		$('.survey-type').delay(400).fadeIn(300);
	});
}

function showForm() {
	$('.survey-type').fadeOut(300);
	$('.survey-form').delay(400).fadeIn(300);
}

function mcqInit() {

	$('.mcq input[type="checkbox"]').on('click',function(){
		if($(this).is(':checked')) {
			$($(this).closest('.mcq')[0]).addClass('selected');
		}
		else {
			$($(this).closest('.mcq')[0]).removeClass('selected');
		}
	});
}
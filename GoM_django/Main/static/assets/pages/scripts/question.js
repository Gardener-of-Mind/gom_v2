function hideForm() {
        $('.survey-form').fadeOut(300);
        $('.survey-type').delay(400).fadeIn(300);
}


function showForm() {
    $('.survey-type').fadeOut(300);
    $('.survey-form').delay(400).fadeIn(300);
}

$.ajaxSetup({
    cache: false,
    headers : {
        "X-CSRFToken" : getCookie('csrftoken')
    },
})

function sendSurvey(answers,sid) {
    $.ajax({
        url : '../survey_submit/',
        method: 'POST',
        cache: false,
        headers : {
            "X-CSRFToken" : getCookie('csrftoken')
        },
        data: {"oid":sid,"answers[]":answers},
        success: function(response) {
            window.location.href = './../profile/edit/';
        },
        error: function() {
            alert("error");
        },
    });
}

$('.body-box').animate({
    'padding-top': '40px',
    opacity: '1'
}, 500);

resetSurvey();
startSurvey('578801165237d745c1a1a7c8');
var store = {
    question: null,
};
function loadQuestion(answer) {
    if (typeof answer === 'undefined') {
        $.post('.', {
            first: 1
        }, function(response) {
            store.question = JSON.parse(response)
            generateQuestion(store.question);
            // console.log(question)

            $('.next-ques')[0].onclick = (function(){
                $('ques-cont').fadeOut(200);
                var response = getAnswerObj(store.question['_id']);
                console.log(response)
                if (response !== false) {
                    loadQuestion(response);
                }
            });
        });
    } else {
        if (answer === 'YES') {
            answer = 0;
        }
        if (answer === 'NO') {
            answer = 1;
        }
        $.post('.', {
            answer: JSON.stringify(answer),
            question_id: store.question._id.$oid
        }, function(response) {
            if (response === 'Survey Completed') {
                location.pathname = '/student/surveys/';
            }

            store.question = JSON.parse(response)
            generateQuestion(store.question);

            $('.next-ques')[0].onclick = (function(){
                $('ques-cont').fadeOut(200);
                var response = getAnswerObj(store.question['_id']);
                if (response !== false) {
                    loadQuestion(response);
                }
            });
        });
    }
}

function startSurvey(sid) {
    showForm();
    loadQuestion();
}

function generateQuestion(quesObj){
    $('.progress-title').html(quesObj["category"]);

    $('.ques').html(quesObj["text"]);

    switch (quesObj["query_type"]) {
        case "dual"         :   genDual();
                                break;
        case "dropdownbox"  :   genSelect(quesObj["options"]);
                                break;
        case "radio"        :   genRadio(quesObj["options"]);
                                break;
        case "checkbox"     :   genCheckbox(quesObj["options"]);
                                break;
        case "rating"       :   genRating();
                                break;
        case "text"         :   genText();
                                break;
    }

    $('.ques-cont').delay(300).fadeIn(250);
}

function genDual() {
    var data = '<div class="col-sm-12 yes-no-type option-type" data-option-type="dual"> <div class="yes-no"> <span class="yes-no-ques">Choose between the two options.</span> <span class="yes-no-option yes-no-cross"><i class="fa fa-close"></i><span class="yes-no-tag">NO</span></span> <span class="yes-no-option yes-no-tick"><i class="fa fa-check"></i><span class="yes-no-tag">YES</span></span> </div> </div>';

    $('.options-cont').html(data);

    $('.yes-no-option').click(function(){
        $('.yes-no-option').removeClass("active inactive");
        $(this).addClass("active");
        $(this).siblings().addClass('inactive');
    });
}

function genRating(options) {
    var data = '<div class="col-sm-12 slider-type option-type" data-option-type="rating"> <div class="slider"> <div id="demo-simple-slider" class="dragdealer"> <div class="handle green-circle"> <div class="icon"></div> </div> </div> <table class="scale"> <tr> <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td> <td>7</td> <td>8</td> <td>9</td> <td>10</td> </tr> </table> </div> </div>';

    $('.options-cont').html(data);

    setTimeout(function() {
        sliderInit();
    }, 500)
}



function genSelect(options) {
    var data = '<div class="col-sm-12 select-type option-type" style="z-index: 1;" data-option-type="dropdownbox"> <form class="options" data-form-type="dropdownbox"> <div class="selectholder"> <label>CHOOSE SOME OPTION</label> <select><option value="...">...</option>';
    $.each(options,function(i,val){
        data += '<option value="'+i+'">'+val.text+'</option>';
    });
    data += '</select> </div></div>';

    $('.options-cont').html(data);

    selectInit();
}

function genRadio(options) {
    var data = '<div class="col-sm-12 main radio-type option-type " data-option-type="radio">';

    $.each(options,function(i,val){
        data += '<div class="col-sm-6"> <div class="radioholder"> <input type="radio" name="radio-type" value="'+i+'"> <label>'+ val.text +'</label> </div> </div>';
    })
    data += '</div>';

    $('.options-cont').html(data);

    radioInit();
}

function genCheckbox(options) {
    var data = '<div class="col-sm-12 mcq-type option-type" data-option-type="checkbox">';

    $.each(options,function(i,val){
        data += '<div class="col-sm-6"> <label> <div class="mcq"> <input type="checkbox" name="checkbox-type">'+val.text+'</div> </label> </div>';
    });

    data += '</div>';

    $('.options-cont').html(data);

    checkboxInit();
}

function genText() {
    var data = '<div class="col-sm-12 text-type option-type" data-option-type="text"> <textarea class="survey-textarea" placeholder="Just to give us a flavour..."></textarea> </div>';
    $('.options-cont').html(data);
}



function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function sliderInit(){

    var icon = $('.icon'),
    widget = $('.widget'),
    steps = 10,
    dd = new Dragdealer('demo-simple-slider',{
        horizontal: true,
        steps: steps,
        speed: 0.3,
        loose: false,
        animationCallback: function(x, y) {
            var percent = parseInt(steps * (x*100), 10);
            icon.css({'background-position-y': (750 * x * 9/10 + 75) + 'px'});
        }
    });
    dd.setStep(5);
    var openWidget = function(){
        setTimeout(function(){
            widget.addClass('active');
        }, 800);
        widget.addClass('loaded');
    };

    $(window).ready(function(){
        openWidget();
        window.getSliderValue = function(){
            return dd.getStep();
        }
    });
}

function selectInit(){
    // set up select boxes
    $('.selectholder').each(function(){
        $(this).children().hide();
        var description = $(this).children('label').text();
        $(this).append('<span class="desc">'+description+'</span>');
        $(this).append('<span class="pulldown"></span>');
        // set up dropdown element
        $(this).append('<div class="selectdropdown"></div>');
      $(this).children('select').children('option').each(function(){
            $drop = $(this).parent().siblings('.selectdropdown');
            var name = $(this).text();
            var value = $(this).attr('value');
            $drop.append('<span data-value="'+value+'">'+name+'</span>');
        });
        // on click, show dropdown
        $(this).click(function(){
            if($(this).hasClass('activeselectholder')) {
                // roll up roll up
                $(this).children('.selectdropdown').slideUp(200);
                $(this).removeClass('activeselectholder');
                // change span back to selected option text
                if($(this).children('select').val() != '0') {
                    $(this).children('.desc').fadeOut(100, function(){
                        $(this).text($('span.active').text());
                        $(this).fadeIn(100);
                    });
                }
            }
            else {
                // if there are any other open dropdowns, close 'em
                $('.activeselectholder').each(function(){
                    $(this).children('.selectdropdown').slideUp(200);
                    // change span back to selected option text
                    if($(this).children('select').val() != '0') {
                        $(this).children('.desc').fadeOut(100, function(){
                            $(this).text($('span.active').text());
                            $(this).fadeIn(100);
                        });
                    }
                    $(this).removeClass('activeselectholder');
                });
                // roll down
                $(this).children('.selectdropdown').slideDown(200);
                $(this).addClass('activeselectholder');
                // change span to show select box title while open
                if($(this).children('select').val() != '0') {
                    $(this).children('.desc').fadeOut(100, function(){
                        $(this).text($('span.active').text());
                        $(this).fadeIn(100);
                    });
                }
            }
        });
    });
    // select dropdown click action
    $('.selectholder .selectdropdown span').click(function(){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var text = $(this).text();
        var value = $(this).data('value');
        $(this).parent().siblings('select').val(value);
        $(this).parent().siblings('.desc').fadeOut(100, function(){
            $(this).text(text);
            $(this).fadeIn(100);
        });
    });
}

function radioInit(){
      // set up radio boxes
    $('.radioholder').each(function(){
        $(this).children().hide();
        var description = $(this).children('label').html();
        $(this).append('<span class="desc">'+description+'</span>');
        $(this).prepend('<span class="tick"></span>');
        // on click, update radio boxes accordingly
        $(this).click(function(){
            $(this).children('input').prop('checked', true);
            $(this).children('input').trigger('change');
        });
    });
    // update radio holder classes when a radio element changes
    $('input[type=radio]').change(function(){
    $('input[type=radio]').each(function(){
      if($(this).prop('checked') == true) {
        $(this).parent().addClass('activeradioholder');
      }
            else $(this).parent().removeClass('activeradioholder');
        });
    });
    // manually fire radio box change event on page load
    $('input[type=radio]').change();
}

function checkboxInit() {
    $('.mcq input[type="checkbox"]').change(function(){
        $(this).closest(".mcq").toggleClass('selected');
        return false;
    });
}

function resetSurvey(){
    $('.progress-title').html("");
    $('.progress-percent').html("0% COMPLETED");
    $('.progess-front').css("width","0%");
    $('.ques').html("");
    $('.options-cont').html();
}

function getAnswerObj(qid) {
    var ansObj = "";
    switch($('.option-type').data("option-type")) {
        case "dual"         :   if($('.option-type .active').length != 0) {
                                    ansObj = ($('.option-type .active  span').html());
                                }
                                else {
                                    alert("Choose one of the option!");
                                    return false;
                                }
                                break;
        case "dropdownbox"  :   if($('.option-type option:selected').val() !=  "...") {
                                    ansObj = ($('.option-type option:selected').val());
                                }
                                else {
                                    alert("Choose one of the option apart from ...!");
                                    return false;
                                }
                                break;
        case "radio"        :   if($('.option-type input[type="radio"]:checked').length != 0) {
                                    ansObj = ($('.option-type input[type="radio"]:checked').val());
                                }
                                else {
                                    alert("Choose one of the option!");
                                    return false;
                                }
                                break;
        case "checkbox"     :   if($('.option-type input[type="checkbox"]:checked').length != 0) {
                                    ansObj = [];
                                    $('.options-cont input[type="checkbox"]').each(function(i) {
                                        if (this.checked) {
                                            ansObj.push(i)
                                        }
                                    })
                                    // ansObj = ($('.options-cont input[type="checkbox"]:checked').map(function () {return this.value;}).get());
                                }
                                else {
                                    alert("Choose atleast one of the option!");
                                    return false;
                                }
                                break;

                                break;
        case "rating"       :   ansObj = (getSliderValue()[0] - 1);
                                break;
        case "text"         :   if($('.survey-textarea').val()!="") {
                                    ansObj = ($('.survey-textarea').val());
                                }
                                else {
                                    alert("Enter some text!");
                                    return false;
                                }
                                break;
    }
    return ansObj;
}

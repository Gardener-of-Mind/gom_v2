var survey_type;
var survey_id;
$(".set-default-btn").click(function() {
    survey_id = ($(this).data('sid'))
    console.log($(this).data('sid'))
})
$('#save-default').click(function() {
    if ($("#anxiety")[0].checked) {
        survey_type = ('anxiety')
    } else if ($("#depression")[0].checked) {
        survey_type = ('depression')
    } else if ($("#stress")[0].checked) {
        survey_type = ('stress')
    }
    $.ajax({
        url:'/admin/default-setting/',
        method:'POST',
        headers : {
            "X-CSRFToken" : getCookie('csrftoken')
        },
        data: {
            survey_type: survey_type,
            survey_id: survey_id,
        },
        success: function() {
            $('#set-default').modal('hide');
        }
    })
})

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

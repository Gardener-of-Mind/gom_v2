$('#image').hide();
$('#video').hide();

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

var aid;
var tid;
var idx;
var task;

$('button.edit').click(function() {
  aid = $(this).data('aid');
  tid = $(this).data('tid');
  idx = $(this).data('idx');
  $("#activity-idx").html('Activity '+idx);

  $.ajax({
    method: 'GET',
    url: '/atrack/all/'+aid+'/'+tid+'/',
    success: function(resp) {
      task = JSON.parse(resp);
      CKEDITOR.instances.edit.setData(task.text);
    },
  })
})

$('button.delete').click(function() {
  aid = $(this).data('aid');
  tid = $(this).data('tid');
  idx = $(this).data('idx');
  $("#activity-idx").html('Activity '+idx);

  var sure = confirm([
    'Delete activity '+idx,
    'Are you sure?'
  ].join('\n'));

  if (sure) {
    $.ajax({
      url: '/activity/delete/',
      method:'POST',
      headers : {
        "X-CSRFToken" : getCookie('csrftoken')
      },
      data: {
        track_id: aid,  // this is correct: activity@client = track@server
        activity_id: tid,  // this is correct: task@client = activity@server
      },
      success: function(resp) {
        window.location.reload();
        console.log(resp)
      }
    });
  }
});

$('.modal-save').click(function() {
  $.ajax({
    url: '/atrack/all/'+aid+'/'+tid+'/',
    method:'POST',
    headers : {
      "X-CSRFToken" : getCookie('csrftoken')
    },
    data: {
      track_id: aid,  // this is correct: activity@client = track@server
      activity_id: tid,  // this is correct: task@client = activity@server
      text: CKEDITOR.instances.edit.getData(),
      activity_type: task.activity_type,
    },
    success: function(resp) {
      window.location.reload();
      console.log(resp)
    }
  });
});

$('.modal-submit').click(function() {
  $.ajax({
    url: '/activity/add_single/',
    method:'POST',
    headers : {
      "X-CSRFToken" : getCookie('csrftoken')
    },
    data: {
      activity: true,
      track_id: $('#add-activity').data('aid'),  // this is correct: activity@client = track@server
      // activity_id: tid,  // this is correct: task@client = activity@server
      text: CKEDITOR.instances.questionText.getData(),
      next_allowed_after: $('#next_allowed_after').val(),
      activity_type: $('#questionType').val(),
    },
    success: function(resp) {
      // window.location.reload();
      console.log(resp)
    }
  });
});

$('#questionType').change(function() {
  switch($(this).val()) {
    case 'image':
      $('#image').show();
      $('#video').hide();
      break;

    case 'video':
      $('#image').hide();
      $('#video').show();
      break;

    case 'text':
      break;

    default:
  }
});

/**
Todo Module
**/
var AppTodo = function () {

    // private functions & variables

    var _initComponents = function() {
        
        $('.edit-diary').on("click",function(){
            $parent = $(this).closest('.portlet.light.bordered');
            console.log("yo",$parent,$(parent).find('.diary-title'));
            $('#todo-task-modal .diary-modal-title').val($parent.find('.diary-title').html());
            $('#todo-task-modal .diary-modal-date').val($parent.find('.diary-date').html());
            $('#todo-task-modal .diary-modal-message').val($parent.find('.diary-message').html());
            $('#todo-task-modal .diary-modal-save').data('did',$(this).data('did'));

        });

        $('#todo-task-modal .diary-modal-save').on("click",function(){
            var dairyObj = {};
            dairyObj["title"] = $('#todo-task-modal .diary-modal-title').val();
            dairyObj["text"] = $('#todo-task-modal .diary-modal-message').val();
            dairyObj["oid"] = $('#todo-task-modal .diary-modal-save').data('did');
            if(dairyObj["title"] != "" && dairyObj["text"] != "") {
                $.ajax({
                    url:'.',
                    method:'POST',
                    headers : {
                        "X-CSRFToken" : getCookie('csrftoken')
                    },
                    data: dairyObj,
                    success:function(response){
                        console.log(response);
                    },
                    error: function(){
                        alert("Try Again!");
                    }
                });
            }
            else
                alert("Empty title or message");
            
        });

        $('.add-diary').on("click",function(){
            $('#todo-task-modal .diary-modal-title').val("");
            $('#todo-task-modal .diary-modal-date').val(new Date().toLocaleDateString());
            $('#todo-task-modal .diary-modal-message').val("");
            $('#todo-task-modal .diary-modal-save').data('did',"");
        })
    }

    var _handleProjectListMenu = function() {
        if (App.getViewPort().width <= 992) {
            $('.todo-project-list-content').addClass("collapse");
        } else {
            $('.todo-project-list-content').removeClass("collapse").css("height", "auto");
        }
    }

    // public functions
    return {

        //main function
        init: function () {
            _initComponents();     
            _handleProjectListMenu();

            App.addResizeHandler(function(){
                _handleProjectListMenu();    
            });       
        }

    };

}();

jQuery(document).ready(function() {
    AppTodo.init();
});

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
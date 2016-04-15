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
            dairyObj.title = $('#todo-task-modal .diary-modal-title').val();
            dairyObj.message= $('#todo-task-modal .diary-modal-message').val();
            dairyObj.did = $('#todo-task-modal .diary-modal-save').data('did');
            $.ajax({
                url:'..//',
                method:'POST',
                data: dairyObj,
                success:function(response){
                    console.log(response);
                },
                error: function(){
                    alert("Try Again!");
                }
            })
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
$( document ).ready(function() {

    var url = 'http://localhost/html/projects/security-policies-symf3.4/web/app_dev.php/policy';

    getPageData();

    /* Get Page Data*/
    function getPageData() {
        debugger;
        $.ajax({
            dataType: 'json',
            url: url,
        }).done(function(data){
            debugger;
            manageRow(data);
        }).fail(function( jqXHR, textStatus, errorThrown ) {
            debugger;
        })
    };
    

    /* Add new Item table row */
    function manageRow(data) {
        var	rows = '';
        $.each( data, function( key, value ) {
            rows = rows + '<tr>';
            rows = rows + '<td>'+value.name+'</td>';
            rows = rows + '<td>'+value.implicitAction+'</td>';
            rows = rows + '<td data-id="'+value.id+'">';
            rows = rows + '<button data-toggle="modal" data-target="#edit-item" class="btn btn-primary edit-item">Edit</button> ';
            rows = rows + '<button class="btn btn-danger remove-item">Delete</button>';
            rows = rows + '</td>';
            rows = rows + '</tr>';
        });

        debugger;

        $("tbody").html(rows);
    }

    /* Create new Item */
    $(".crud-submit").click(function(e){
        e.preventDefault();
        var form_action = $("#create-item").find("form").attr("action");
        var name = $("#create-item").find("input[name='name']").val();
        var implicit_action = $("#create-item").find("textarea[name='implicit_action']").val();

        if(name != '' && implicit_action != ''){
            $.ajax({
                dataType: 'json',
                type:'POST',
                url: url + form_action,
                data:{name:name, implicit_action:implicit_action}
            }).done(function(data){
                $("#create-item").find("input[name='name']").val('');
                $("#create-item").find("textarea[name='implicit_action']").val('');
                getPageData();
                $(".modal").modal('hide');
                toastr.success('Item Created Successfully.', 'Success Alert', {timeOut: 5000});
            });
        }else{
            alert('You are missing name or implicit_action.')
        }

    });

    /* Remove Item */
    $("body").on("click",".remove-item",function(){
        var id = $(this).parent("td").data('id');
        var c_obj = $(this).parents("tr");

        $.ajax({
            dataType: 'json',
            type:'POST',
            url: url + 'api/delete.php',
            data:{id:id}
        }).done(function(data){
            c_obj.remove();
            toastr.success('Item Deleted Successfully.', 'Success Alert', {timeOut: 5000});
            getPageData();
        });

    });

    /* Edit Item */
    $("body").on("click",".edit-item",function(){

        var id = $(this).parent("td").data('id');
        var name = $(this).parent("td").prev("td").prev("td").text();
        var implicit_action = $(this).parent("td").prev("td").text();

        $("#edit-item").find("input[name='name']").val(name);
        $("#edit-item").find("textarea[name='implicit_action']").val(implicit_action);
        $("#edit-item").find(".edit-id").val(id);

    });

    /* Updated new Item */
    $(".crud-submit-edit").click(function(e){

        e.preventDefault();
        var form_action = $("#edit-item").find("form").attr("action");
        var name = $("#edit-item").find("input[name='name']").val();

        var implicit_action = $("#edit-item").find("textarea[name='implicit_action']").val();
        var id = $("#edit-item").find(".edit-id").val();

        if(name != '' && implicit_action != ''){
            $.ajax({
                dataType: 'json',
                type:'POST',
                url: url + form_action,
                data:{name:name, implicit_action:implicit_action,id:id}
            }).done(function(data){
                getPageData();
                $(".modal").modal('hide');
                toastr.success('Item Updated Successfully.', 'Success Alert', {timeOut: 5000});
            });
        }else{
            alert('You are missing name or implicit_action.')
        }

    });
});

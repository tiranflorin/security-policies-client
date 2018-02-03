$(document).ready(function () {
    var url = 'http://localhost/html/projects/security-policies-symf3.4/web/app_dev.php/policy';

    getPageData();

    function getPageData() {
        $.ajax({
            dataType: 'json',
            url: url
        }).done(function (data) {
            manageRow(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            debugger;
        })
    };

    /* Add new Item table row */
    function manageRow(data) {
        var rows = '';
        $.each(data, function (key, value) {
            rows = rows + '<tr>';
            rows = rows + '<td>' + value.name + '';
            // Just consider the first row the default policy. TODO: Enforce this on the back-end.
            if (key === 0) {
                rows = rows + ' (Default policy)';
            }
            rows = rows + '</td><td>' + value.implicitAction + '</td>';
            rows = rows + '<td data-id="' + value.id + '">';
            rows = rows + '<button data-toggle="modal" data-target="#clone-item" class="btn btn-success clone-item">Clone</button> ';
            if (key != 0) {
                rows = rows + '<button data-toggle="modal" data-target="#edit-item" class="btn btn-info edit-item">Edit</button> ';
                rows = rows + '<button class="btn btn-danger remove-item">Delete</button>';
            }
            rows = rows + '</td>';
            rows = rows + '</tr>';
        });
        $("tbody").html(rows);
    }

    /* Remove Item */
    $("body").on("click", ".remove-item", function () {
        var id = $(this).parent("td").data('id');
        var c_obj = $(this).parents("tr");

        $.ajax({
            dataType: 'json',
            type: 'DELETE',
            url: url + '/' + id
        }).done(function (data) {
            c_obj.remove();
            toastr.success('Item Deleted Successfully.', 'Success!', {timeOut: 5000});
            getPageData();
        });
    });

    /* Update Item */
    $(".crud-submit-edit").click(function (e) {
        e.preventDefault();
        var name = $("#edit-item").find("input[name='name']").val();
        var implicit_action = $("#edit-item").find("textarea[name='implicit_action']").val();
        var id = $("#edit-item").find(".edit-id").val();
        var data = {name: name, implicit_action: implicit_action};

        if (name != '' && implicit_action != '') {
            $.ajax({
                dataType: 'json',
                type: 'PUT',
                url: url + '/' + id,
                beforeSend: function (xhr) {
                    xhr.overrideMimeType("application/json; charset=UTF-8");
                },
                data: JSON.stringify(data)
            }).done(function (data) {
                getPageData();
                $(".modal").modal('hide');
                toastr.success('Item Updated Successfully.', 'Success!', {timeOut: 5000});
            });
        } else {
            alert('You are missing name or implicit_action.')
        }
    });

    /* Clone new Item */
    $(".crud-submit-clone").click(function (e) {
        e.preventDefault();
        var name = $("#clone-item").find("input[name='name']").val();
        var implicit_action = $("#clone-item").find("textarea[name='implicit_action']").val();
        var cloneId = $("#clone-item").find(".clone-id").val();
        var data = {cloneId: cloneId, name: name, implicit_action: implicit_action};

        if (name != '' && implicit_action != '') {
            $.ajax({
                dataType: 'json',
                type: 'POST',
                url: url,
                beforeSend: function (xhr) {
                    xhr.overrideMimeType("application/json; charset=UTF-8");
                },
                data: JSON.stringify(data)
            }).done(function (data) {
                getPageData();
                $(".modal").modal('hide');
                toastr.success('Item Cloned Successfully.', 'Success!', {timeOut: 5000});
            });
        } else {
            alert('You are missing name or implicit_action.')
        }
    });

    /* Populate Edit Form */
    $("body").on("click", ".edit-item", function () {
        var id = $(this).parent("td").data('id');
        var name = $(this).parent("td").prev("td").prev("td").text();
        var implicit_action = $(this).parent("td").prev("td").text();
        $("#edit-item").find("input[name='name']").val(name);
        $("#edit-item").find("textarea[name='implicit_action']").val(implicit_action);
        $("#edit-item").find(".edit-id").val(id);

    });

    /* Populate Clone Form */
    $("body").on("click", ".clone-item", function () {
        var id = $(this).parent("td").data('id');
        var name = $(this).parent("td").prev("td").prev("td").text();
        var implicit_action = $(this).parent("td").prev("td").text();
        $("#clone-item").find("input[name='name']").val(name);
        $("#clone-item").find("textarea[name='implicit_action']").val(implicit_action);
        $("#clone-item").find(".clone-id").val(id);

    });
});

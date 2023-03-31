$(document).ready(function () {

    !(function (w, d) {
        "use strict";

        var titles = d.querySelectorAll(".title"),
            i = 0,
            len = titles.length;

        for (; i < len; i++)
            titles[i].onclick = function (e) {
                for (var j = 0; j < len; j++)
                    if (this != titles[j])
                        titles[j].parentNode.className = titles[
                            j
                            ].parentNode.className.replace(/ open/i, "");

                var cn = this.parentNode.className;

                this.parentNode.className = ~cn.search(/open/i)
                    ? cn.replace(/ open/i, "")
                    : cn + " open";
            };
    })(this, document);


    //Agregar Conexion

    $('#add_new_server').on('click', function (event){
        const form = document.getElementById('new_server');

        form.addEventListener('submit', (event) => {

            alert(form.action);

            event.preventDefault();
            var formData = new FormData(form);
            formData.append('action', 'new_server');
            formData.append('user_mac', user_mac);

            $.ajax({

                url: form.action,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: async function () {
                    $('#modal-addhost').modal('hide');
                    await sleep(300);
                    showAndDismissAlert('success', 'Servidor Añadido!');
                    $(this).submit();
                    location.reload();
                },
                error: function () {
                    console.log("Error");
                },
                dataType: 'text' //Valor predeterminado: Intelligent Guess (xml, json, script, text, html).
            });
        });
    });


    $('.conection').dblclick(async function (event) {
        var element = $(this);
        var server = $(this).data('server');
        var server_id = $(this).data('id');
        var server_name = $(this).data('name');
        event.preventDefault();
        $(this).addClass('conection-loading');

        disconnectAll();

        $.ajax({
            url: baseUrl + '/lib/services/connect_db.php',
            type: 'POST',
            data: {action: "connect_db", server: server},
            success: async function (response) {
                element.removeClass('conection-loading');

                $('#loading').show();


                if (response['success']) {
                    var id_element = '#'+server;

                    //actualizar foto servidor
                    $('#'+server_id+"_"+server_name).attr("src", "./img/icons/mysql_connection.png");
                    //actualizar icono estado
                    $('#status_connect').attr("src", "./img/icons/done.png");
                    $('#table_'+server_id+"_"+server_name).html('');
                    element.addClass('connected');


                    $.ajax({
                        
                        url: baseUrl + '/lib/services/servers.php',
                        type: "POST",
                        data: {action: "show_menu", database: response['text'], server_id: server_id},
                        success: function (data) {
                            alert(data);
                            $('#loading').hide();
                            $('#table_' + server_id + "_" + server_name).append(data);
                        },
                        error: function () {
                            console.log("Error");
                        },
                        dataType: 'text' //Valor predeterminado: Intelligent Guess (xml, json, script, text, html).
                    });

                    $('#table_'+server_id+"_"+server_name).removeClass('d-none');

                    //server_name = server_name+'holafgfhgf';



                    //showAndDismissAlert('success', 'Conexion Establecida con "'+server_name+'"!');
                    showAlert('success','Conexion Establecida con "'+server_name+'"!','notificacion');
                }
            },
            error: function (response) {
                element.removeClass('conection-loading');
                response = response.responseJSON;
                // showAndDismissAlert('danger', '["'+server_name+'"] -> '+response.error+'!');
                console.log(response);
                $('#status_connect').attr("src", "./img/icons/error.png");
            }
        });

    });

    $('.conection').contextmenu(function (event) {

        var server = $(this).data('server');
        var server_id = $(this).data('id');
        var server_name = $(this).data('name');
        //Abrir menu
        event.preventDefault();
        const {clientX: mouseX, clientY: mouseY} = event;
        const menu = document.getElementById('context-menu');
        menu.style.top = `${mouseY}px`;
        menu.style.left = `${mouseX}px`;
        menu.classList.add('visible');

        //Cerrar menu
        $(document).click(function (e) {
            if(e.target.offsetParent != menu){
                closeMenu(menu);
            }
        });

        //Cerrar conexion
        $('#close-connection').click(function (event){
            event.preventDefault();
            closeMenu(menu);
            $('#'+server_id+"_"+server_name).attr("src", "./img/icons/mysql.png");
            $('#table_'+server_id+"_"+server_name).addClass('d-none');
        });

    });

});



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function closeMenu(menu){
    menu.classList.remove('visible');
}


// function showAndDismissAlert(type, message) {
//     var htmlAlert = '<div class="alert alert-' + type + '">' + message + '</div>';
//
//     // Prepend so that alert is on top, could also append if we want new alerts to show below instead of on top.
//     $(".alert-messages").prepend(htmlAlert);
//
//     // Since we are prepending, take the first alert and tell it to fade in and then fade out.
//     // Note: if we were appending, then should use last() instead of first()
//     $(".alert-messages .alert").first().hide().fadeIn(200).delay(61600).fadeOut(700, function () { $(this).remove(); });
// }

function click_on_database(input, server_id, database) {
    var server = $(input).data('database');

    $.ajax({

        url: baseUrl + '/lib/services/servers.php',
        type: "POST",
        data: {action: "show_tables", database: server},
        success: function (data) {
            $('#container-right').html(data);
            $('#table_databases').DataTable(
                {
                    "lengthChange": false,
                    "iDisplayLength": 15,
                    "language": {
                        "sProcessing":     "Procesando...",
                        "sLengthMenu":     "Mostrar _MENU_ registros",
                        "sZeroRecords":    "No se encontraron resultados",
                        "sEmptyTable":     "Ningún dato disponible en esta tabla",
                        "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                        "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                        "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                        "sInfoPostFix":    "",
                        "sSearch":         "Buscar:",
                        "sUrl":            "",
                        "sInfoThousands":  ",",
                        "sLoadingRecords": "Cargando...",
                        "oPaginate": {
                            "sFirst":    "Primero",
                            "sLast":     "Último",
                            "sNext":     "Siguiente",
                            "sPrevious": "Anterior"
                        },
                        "oAria": {
                            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                        }

                    }
                }
            );
            $('#table_databases_wrapper div:first-child .col-sm-12:first-child').remove();
            $('#table_databases_wrapper div:first-child .col-sm-12:first-child').removeClass('col-sm-12 col-md-6');
            $('#table_databases_wrapper div:first-child').addClass('col-sm-12');
        },
        error: function () {
            console.log("Error");
        },
        dataType: 'text' //Valor predeterminado: Intelligent Guess (xml, json, script, text, html).
    });
}

function disconnectAll(){
    var element = $('.connected');
    if(element.length > 0){
        var server_id = element.data('id');
        var server_name = element.data('name');
    }
    $('#'+server_id+"_"+server_name).attr("src", "./img/icons/mysql.png");
    $('#table_'+server_id+"_"+server_name).html('');
    element.removeClass('connected');
}

async function getWidht(server_name){
    $('#adjust-width').html(server_name+'il');
    return $('#adjust-width').width();
}

function dropdown_tables(input){
    var server = $(input).data('database');
    $('.table_'+server).removeClass('d-none');
}

async function showAlert(icon, msg, type) {

    let width = await getWidht(msg);

    swal.fire({
        icon: icon,
        title: msg,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 93000,
        width: width,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', swal.stopTimer);
            toast.addEventListener('mouseleave', swal.resumeTimer);
        }
    });
}
$(function() {
   	function isValidEmail (email)
	{
		return (/^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,4}$/i).test(email);
	}
   
    //Обратный звонок
	$("#perezvon_send").click(function(){
		$('.error').hide();
		var error = 0;
        var offseterr = $('#perezvon').offset().top;
	   	var perezvon_fio = $("#perezvon_fio").val();
		if (perezvon_fio == '') { $("#perezvon_fio_error").text("Вы не заполнили поле Ваше имя"); $("#perezvon_fio_error").show(); error = 1;  };
		var perezvon_tel = $("#perezvon_tel").val();
		if (perezvon_tel == '') { $("#perezvon_tel_error").text("Вы не заполнили поле Ваш телефон"); $("#perezvon_tel_error").show(); error = 1;  };
		if (error)
		{
			return false;
		}
		$.post("/send/send", 
		{
		    type: "perezvon",
			perezvon_fio:perezvon_fio,
			perezvon_tel:perezvon_tel,
		}, function(data) 
			{ 
				alert(data);
            }
        );
	});
    $("#perezvon_text input").on("input",function(){
        $(this).parent().find(".error").hide();
    });
});
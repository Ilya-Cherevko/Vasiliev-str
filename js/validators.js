$(function() {
	$('#perezvon .tel1, #c_tel, #k_tel, #f_tel').keydown(function(e) {
       if (!(e.which==8 || e.which==9 || e.which==13 || e.which==16 || e.which==32 || e.which==37 || e.which==39 || e.which==40 || e.which==41 || e.which==43 || e.which==44 ||e.which==45 ||e.which==46 ||(e.which>47 && e.which<58) || e.which==109 )) return false; 
	}); 	

	$('#perezvon .tel1, #c_tel, #k_tel').keypress(function(e) {
//       alert(e.which);
//       if (e.which>47 && e.which<58) return false; 
	}); 	

});
function substr( f_string, f_start, f_length ) {if(f_start < 0) {f_start += f_string.length;}if(f_length == undefined) {f_length = f_string.length;} else if(f_length < 0){f_length += f_string.length;} else {f_length += f_start;}if(f_length < f_start) {f_length = f_start;}return f_string.substring(f_start, f_length);}

function formular( valv, beg, ed, mn, it){
  len = parseInt(valv)+'';
  checkone = substr(len,-2, 1)
  val = substr(len,-1);
  if(checkone == 1){
    ball = mn;
  }else{
    if(val == 0 || val == 5 || val == 6 || val == 7 || val == 8 || val == 9){
  	  ball = mn;
  	}else if(val == 2 || val == 3 || val == 4){
  	  ball = ed;
  	}else{
  	  ball = it;
  	}
  }
return valv+' '+beg+ball;
}

function ii(baseunit, val){
  if(baseunit=='pc'){
    return parseInt(val);
  }else{
    return (parseFloat(val)).toFixed(4);
  }
}

function iii(baseunit, val, minval){
  if(minval === undefined){
    minval = 1;
  }

  if(baseunit=='pc'){
    if(val<=0){
      val = 1;
    }
    return parseInt(val);
  }else{
    if(val<=0.0000){
      val = minval;
    }
    return (parseFloat(val)).toFixed(12);
  }
}

function recount(){
    all_summa = 0; all_weigth = 0; all_korob = 0; all_plitok = 0;
    $("input[type='checkbox']:checked").each(function(){
      fi = $(this).attr('name')
      summa = $(this).attr('summa')*1;
      all_summa = parseFloat(all_summa)+parseFloat(summa);

      weigth = ($(this).attr('ves')*1).toFixed(2);
      all_weigth = parseFloat(all_weigth)+parseFloat(weigth);

      korob = $(this).attr('korob')*1;
      all_korob = parseFloat(all_korob)+parseFloat(korob);

      plitok = $(this).attr('plitok')*1;
      all_plitok = parseFloat(all_plitok)+parseFloat(plitok);
    });
	// discount
	disumm = $('#itogo').attr('discount')*1; ditype = $('#itogo').attr('dtype'); pf = $('#itogo').attr('pf')*1; pt = $('#itogo').attr('pt')*1;
	if(disumm>0 && all_summa>=pf && pt>=all_summa){
	  if(ditype=='P'){
	    discount = ((all_summa/100)*disumm).toFixed(2);
	  }else{
	    discount = all_summa-disumm;
	  }
	  all_summa = all_summa-discount;
	}else{
	  //alert(disumm+'>0 && '+all_summa+'>='+pf+' && '+pt+'>='+all_summa);
	}
    $('#itogo').html((all_summa*1).toFixed(0));
    $('#ves').html((all_weigth*1).toFixed(2));
    if(all_korob > 0 && all_plitok > 0){
      $('#korobki').html(formular(all_korob,'короб','ки','ок','ка')+' и '+formular(all_plitok,'плит','ки','ок','ка'));
    }else if(all_korob > 0 && all_plitok <= 0){
      $('#korobki').html(formular(all_korob,'короб','ки','ок','ка'));
    }else{
      $('#korobki').html(formular(all_plitok,'плит','ки','ок','ка'));
    }

}

function calculater(data){
s_base = data.attr('s_base');
s_plitki = (iii(s_base, data.attr('s_plitki'))*1).toFixed(4);
s_val = iii(s_base, data.val())*1;
s_id = data.attr('s_id')*1;
s_inpack = data.attr('n_inpack')*1;
// summa
summa = Math.round(data.attr('s_price')*s_val);
$('#idp_'+s_id).html(summa);
// post
$.post("/ajax/upnum.php", { id: s_id, num: s_val },function(s){}, "html");
// calc plitki
num_plitok = (s_val/s_plitki).toFixed(0);
data.attr('n_plitok',num_plitok);
// calc weigth
weigth = (data.attr('s_weigth')*num_plitok).toFixed(2);
// calc packs
numpack = Math.floor(num_plitok/s_inpack);
if(numpack > 0){
  knp = num_plitok-(numpack*s_inpack);
  korob = numpack;
  if(knp > 0){
    plitok = knp;
    $('#pack_'+s_id).html(formular(numpack,'короб','ки','ок','ка')+' + '+formular(knp,'плит','ки','ок','ка'));
  }else{ plitok = 0;
    $('#pack_'+s_id).html(formular(numpack,'короб','ки','ок','ка'));
  }
}else{
  plitok = num_plitok;
  $('#pack_'+s_id).html('');
  knp=0;
  korob = 0;
}
data.attr('n_pack',numpack);
// up data
$('#text_'+s_id).html(formular(parseInt(num_plitok),'плит','ки','ок','ка')+' ('+weigth+' кг) по '+formular(parseInt(s_inpack),'штук','и','','а')+' в коробке');
$("input[prid='"+s_id+"']").attr('summa', summa).attr('ves', weigth).attr('korob', numpack).attr('plitok', plitok);
// recount all
recount();
}

function calculaterpm(s_base, s_val, s_plitki, plusminus){
s_plitki = (s_plitki*1).toFixed(4);
s_val = s_val*1;
//alert('s_base='+s_base+', s_val='+s_val+', s_plitki='+s_plitki+', plusminus='+plusminus);
if(plusminus=='plus'){
  num_in_one = (s_val/s_plitki).toFixed(0);
  num_in_one = (num_in_one*1)+1;
  s_new = (num_in_one*s_plitki).toFixed(4);
}else if(plusminus=='minus'){
  num_in_one = (s_val/s_plitki).toFixed(0);
  num_in_one = (num_in_one*1)-1;
  if(num_in_one<=0)num_in_one=1;
  s_new = (num_in_one*s_plitki).toFixed(4);
}else{
  num_in_one = (s_val/s_plitki).toFixed(0);
  s_new = (num_in_one*s_plitki).toFixed(4);
}
//alert('num_in_one='+num_in_one+', s_new='+s_new);
return s_new;
}

$(function(){
$(window).keydown(function(e) {
      if (e.ctrlKey && e.which == 37)
      {
         href = $('#goto_back a').attr('href');
         if (href !== undefined) {
           window.location = href;
         }
      }
      else if (e.ctrlKey && e.which == 39)
      {
         href = $('#goto_next a').attr('href');
         if (href !== undefined) {
           window.location = href;
         }
      }
   });
});

var pricemath = function(text,parent) {

		if (!text) var text = 0
		if (text > parseFloat(parent.attr('max')) && parent.attr('max'))
		{
			text = parent.attr('max')
		};
		if (text < parseFloat(parent.attr('min')) && parent.attr('min'))
		{
			text = parent.attr('min')
		};
		parent.val(text)
		text = parent.val()
		text = text*(parent.data('price'));
		text = Math.ceil(text).toString()
		if (text.length >= 4)
		{
			text = text.substr(0,text.length-3)+' '+text.substr(text.length-3,text.length)
		}

		parent.data('price-block').text(text);

};

$(document).ready(function(){
	$('.count-form .count-input, .cart-block .count-input').bind('change', function() {
		$(this).val($(this).val().replace(/,/g, ".").replace(/ /g, ""))
		var text = parseFloat($(this).val());
		var val = 0;
		pricemath(text,$(this))
	});

	$('.count-form .count-input').each(function(){
		$(this).data('old',$(this).val())
		var box = $('<span class="count-input-container"></span>');
		$(this).wrap(box);
		$('<a href="#" class="js button-minus"></a>').data('parent',$(this)).insertBefore($(this))
		$('<a href="#" class="js button-plus"></a>').data('parent',$(this)).insertAfter($(this))
		$(this).data('price-block',$(this).parents('.product-page-order').find('.total-price .price'));
		$(this).data('price',
			$(this).parents('.count-block').find('.count-price strong').text()
		);
		var price = $(this).data('price');
		price = Math.round($(this).data('price').replace(/ /g, ""))
		$(this).data('price',price);
		pricemath($(this).val(),$(this))
	});


	$('.cart-block .count-input').each(function(){
		$(this).data('old',$(this).val())
		$(this).data('price-block',$(this).parents('tr').find('.price-block .price'));
		$(this).data('price',
			$(this).attr('price')
		);
		var price = $(this).data('price');
		price = Math.round($(this).data('price').replace(/ /g, ""))
		$(this).data('price',price);
	});

});


$(document).ready(function(){
  page = $('#page_url').val();

  $(".button-minus").live("click", function(){
  	data = $(this).parents().children(".num");
  	s_base = data.attr('s_base');
  	s_val = calculaterpm(s_base, iii(s_base, data.val()), data.attr('s_plitki'), 'minus');
    data.val(ii(s_base, s_val));
    if(page=='cart'){
      calculater(data);
    }
  });

  $(".button-plus").live("click", function(){
  	data = $(this).parents().children(".num");
  	s_base = data.attr('s_base');
  	s_val = calculaterpm(s_base, iii(s_base, data.val()), data.attr('s_plitki'), 'plus');
    data.val(ii(s_base, s_val));
    if(page=='cart'){
      calculater(data);
    }
  });

  $(".num").live("change", function(){
    data = $(this);
  	s_base = data.attr('s_base');
  	s_val = calculaterpm(s_base, iii(s_base, data.val(), data.attr('s_plitki')), data.attr('s_plitki'), 'simple');
    data.val(ii(s_base, s_val));
    if(page=='cart'){
      calculater(data);
    }
  });

  $('.buy').live("click", function(){
    div = $(this).parent().parent().children("div");
    input = $('#inp-'+div.attr('id'));
    tinfo = $('#t-'+div.attr('id'));
    tinfo.html('Добавляем в корзину..');
    $.post('/ajax/addtotrash.php', { id: input.attr('s_id'), num: input.val() },
      function(data){
        tinfo.html(data);
        setTimeout(function(){tinfo.html(''); },700)
      }
    );
  });

  $('#addtotra').live("click", function(){
    input = $('#inp-addtotra');
    tinfo = $('#infoaddtotra');
    tinfo.html('Добавляем в корзину..');
    $.post('/ajax/addtotrash.php', { id: input.attr('s_id'), num: input.val() },
      function(data){
        tinfo.html(data);
        setTimeout(function(){tinfo.html(''); },700)
      }
    );
  });

});


//form slider
$(document).ready(function(){
	var posX;
	$('<div class="form-slider-box"><div class="sl-line"><i></i></div><b class="sl-border-right"></b><b class="sl-border-left"></b><div class="sl-drag"></div><div class="sl-left"><i></i></div><div class="sl-right"><i></i></div><div class="sl-selected"></div><div class="num1 num"><span class="text"></span></div><div class="num2 num"><span class="text"></span></div><div class="num3 num"><span class="text"></span></div><div class="num-first num"><span class="text"></span></div><div class="num-last num"><span class="text"></span></div></div>')
	.appendTo('.form-slider');
	$('.form-slider').each(function(){
		var slider = $(this).find('.form-slider-box');
		var sliderFor = $(this).find('.number-from').attr('name');
		var sliderSmall = $(this).find('.number-from').attr('vid');
		var sliderLengthMax = parseInt($(this).find('.number-to').attr('max'));
		var sliderLengthMin = parseInt($(this).find('.number-from').attr('min'));
		var sliderLengthBordMax = parseInt($(this).find('.number-to').attr('border'));
		var sliderLengthBordMin = parseInt($(this).find('.number-from').attr('border'));
		var sliderToValue = parseInt($(this).find('.number-to').attr('value'));
		var sliderFromValue = parseInt($(this).find('.number-from').attr('value'));
		var sliderLength = sliderLengthMax-sliderLengthMin;
		var sliderOffset = slider.offset();

		var sliderWidth = parseInt($(this).css('width'));
		if (!sliderWidth)
			sliderWidth = slider.width();

		slider.width(sliderWidth)

		slider.find('.sl-line').css({'width':sliderWidth});
		var sliderLineWidth = parseInt(slider.find('.sl-line').css('width')) + parseInt(slider.find('.sl-line').css('padding-left')) + parseInt(slider.find('.sl-line').css('padding-right'))

		var sliderClickX = 0;
		var numPos = 0;

		slider.find('.num-first .text').text(sliderLengthMin);
		slider.find('.num-last .text').text(sliderLengthMax);
		var numOffset = $('.num1').offset()

		if(sliderSmall=='small'){
		  numPos = 40;
		}else if(sliderFor=='PRICE_F'){
		  numPos = 30;
		}else{numPos = sliderWidth*25/100;}
		slider.find('.num1').css({left:numPos}).find('.text').text(Math.floor(
			numPos*sliderLengthMax/sliderWidth + (sliderWidth-numPos)*sliderLengthMin/sliderWidth
		));

		if(sliderSmall=='small'){
		  numPos = 120;
		}else if(sliderFor=='PRICE_F'){
		  numPos = 90;
		}else{numPos = sliderWidth*50/100;}
		slider.find('.num2').css({left:numPos}).find('.text').text(Math.floor(
			numPos*sliderLengthMax/sliderWidth + (sliderWidth-numPos)*sliderLengthMin/sliderWidth
		));

		if(sliderSmall=='small'){
		  numPos = 200;
		}else if(sliderFor=='PRICE_F'){
		  numPos = 150;
		}else{
		  numPos = sliderWidth*75/100;
		}
		slider.find('.num3').css({left:numPos}).find('.text').text(Math.floor(
			numPos*sliderLengthMax/sliderWidth + (sliderWidth-numPos)*sliderLengthMin/sliderWidth
		));
		numPos = sliderWidth*100/100;
		slider.find('.num-last').css({left:numPos});
		numPos = sliderWidth*0/100;
		slider.find('.num-first').css({left:numPos});

		if (sliderLengthBordMin) {
		numPos = sliderLengthBordMin - sliderLengthMin;
		numPos = (( (sliderLineWidth) * (numPos) ) / (sliderLengthMax-sliderLengthMin));
		numPos += (sliderLineWidth-numPos)/sliderLengthMax;

		slider.find('.sl-border-left').css({width:numPos});
		};

		if (sliderLengthBordMax) {
		numPos = sliderLengthBordMax - sliderLengthMin;
		numPos = (( (sliderLineWidth) * (numPos) ) / (sliderLengthMax-sliderLengthMin));
		numPos += (sliderLineWidth-numPos)/sliderLengthMax;
		numPos = sliderLineWidth - numPos;

		slider.find('.sl-border-right').css({width:numPos});
		};

		var sliderLeft = slider.find('.sl-left');
		var sliderRight = slider.find('.sl-right');

		var slDragLeft = false;
		var slDragRight = false;

		var formText;

		sliderRight.css({left:sliderWidth});
		sliderLeft.css({'left':'0px'});

			$(window).resize(function(){
				sliderOffset = slider.offset();
			});

			$(document).mouseup(function(e){
				e.preventDefault();
				slDragLeft = false;
				slDragRight = false;
				sliderRight.css({
					'z-index':4
				}).removeClass('sl-arrow-focus').removeClass('sl-right-focus');
				sliderLeft.css({
					'z-index':4
				}).removeClass('sl-arrow-focus').removeClass('sl-left-focus');
			});

			sliderLeft.live('mousedown',function(e){
				e.preventDefault();
				sliderOffset = slider.offset();
				posX = e.pageX;
				e.preventDefault();
				slDragLeft = true;
				sliderClickX = (posX-sliderOffset.left)-parseInt($(this).css('left'))
				sliderLeft.css({
					'z-index':5
				}).addClass('sl-arrow-focus').addClass('sl-left-focus');
			});

			sliderRight.live('mousedown',function(e){
				e.preventDefault();
				sliderOffset = slider.offset();
				posX = e.pageX;
				slDragRight = true;
				sliderClickX = (posX-sliderOffset.left)-parseInt($(this).css('left'))
				sliderRight.css({
					'z-index':5
				}).addClass('sl-arrow-focus').addClass('sl-right-focus');
			});

			$(document).bind('mousemove', function(b){
				posX = b.pageX;
				if (slDragLeft)
				{
					b.preventDefault();
					sliderLeft.css({
						left:sliderMove(sliderLeft)
					});
					sliderLine();
					sliderNumbers(slider,sliderLengthMax,sliderLengthMin);
				};
				if (slDragRight)
				{
					b.preventDefault();
					sliderRight.css({
						left:sliderMove(sliderRight)
					});
					sliderLine();
					sliderNumbers(slider,sliderLengthMax,sliderLengthMin);
				};
			});

		slider.find('.num .text').click(function(){
			var pos = $(this).parents('.num').css('left');
			sliderPos(pos)
		});

		slider.find('.sl-drag').click(function(e){
			sliderOffset = slider.offset();
			var pos = e.pageX-sliderOffset.left;
			sliderPos(pos)
		});

		var sliderPos = function(pos,inputs,input){
			var sliderInputFrom = false;
			var sliderInputTo = false;
			if (!inputs) {
				pos = parseFloat(pos);
				if (pos-parseFloat(sliderLeft.css('left')) > -(pos-parseFloat(sliderRight.css('left'))))
				{
					sliderRight.css({left:pos})
				}
				else
				{
					sliderLeft.css({left:pos})
				};
				if ( pos < 0)
				{
					sliderLeft.css({left:0})
				};
				if ( pos > sliderWidth)
				{
					sliderRight.css({left:sliderWidth})
				};
			}
			else {

				if (input.is('.number-from'))	{sliderInputFrom=true}
				if (input.is('.number-to'))		{sliderInputTo=true}

					pos = pos - sliderLengthMin;

					pos = (

						( (sliderWidth) * (pos) ) / (sliderLengthMax-sliderLengthMin)

					);

					pos += (sliderWidth-pos)/sliderLengthMax;


					if (sliderInputFrom) {
						if ( pos >= parseInt(sliderRight.css('left'))) {
							pos = parseInt(sliderRight.css('left'));
							sliderInputFrom=false;
						};
						if ( pos < 0)				{sliderInputFrom=false;pos = 0};
						sliderLeft.css({left:pos});
					};

					if (sliderInputTo) {
						if ( pos <= parseInt(sliderLeft.css('left'))) {
							pos = parseInt(sliderLeft.css('left'));
							sliderInputTo=false;
						};
						if ( pos > sliderWidth)	{sliderInputTo=false;pos = sliderWidth};
						sliderRight.css({left:pos});
					};
			};
			sliderLine();
			sliderNumbers(slider,sliderLengthMax,sliderLengthMin,sliderInputFrom,sliderInputTo);
		};

		slider.parents('.form-slider').find('.number').bind('focus', function(){
			formText = $(this).val();
		});
		slider.parents('.form-slider').find('.number').bind('blur', function(){
			if (!parseInt($(this).val()))
			{
				$(this).val(formText);
			};
			sliderPos(parseInt($(this).val()),true,$(this));
		});

		var sliderMove = function(mb){
			var left = parseInt(mb.css('left'))
			var sliderpos = (posX-sliderOffset.left);

			left = sliderpos-sliderClickX;

			if ( left < 0)
			{
				left = 0;
			};
			if ( left > sliderWidth)
			{
				left = sliderWidth;
			};
			if (mb == sliderLeft)
			if ( left >= parseInt(sliderRight.css('left')))
			{
				left = parseInt(sliderRight.css('left'));
			};
			if (mb == sliderRight)
			if ( left <= parseInt(sliderLeft.css('left')))
			{
				left = parseInt(sliderLeft.css('left'));
			};


			return left;
		};

		var sliderLine = function(){
			slider.find('.sl-selected').width(
				parseInt(sliderRight.css('left'))-parseInt(sliderLeft.css('left'))
			).css({
				left:parseInt(sliderLeft.css('left'))
			});
		};

		var sliderNumbers = function(slider,sliderLengthMax,sliderLengthMin,sliderInputFrom,sliderInputTo){
			var sliderLength = sliderLengthMax-sliderLengthMin;
			var sliderPos = parseFloat(sliderLeft.css('left'));
			if (!sliderInputFrom)
			slider.parent().find('.number-from').attr('value',Math.floor(
				sliderPos*sliderLengthMax/sliderWidth + (sliderWidth-sliderPos)*sliderLengthMin/sliderWidth
			));
			sliderPos = parseFloat(sliderRight.css('left'));
			if (!sliderInputTo)
			slider.parent().find('.number-to').attr('value',Math.floor(
				sliderPos*sliderLengthMax/sliderWidth + (sliderWidth-sliderPos)*sliderLengthMin/sliderWidth
			));
			slider.parent().find('.number').each(function(){
				$(this).val(parseInt($(this).val()))
			});
		};

		if (sliderToValue)
		slider.parents('.form-slider').find('.number-to').attr('value', sliderToValue).blur();
		if (sliderFromValue)
		slider.parents('.form-slider').find('.number-from').attr('value', sliderFromValue).blur();

		sliderNumbers(slider,sliderLengthMax,sliderLengthMin);


	});

});

// rub
$(document).ready(function(){
	$('<b class="dash"></b>').prependTo('span.rub');
});

// js link
$(document).ready(function(){
	$('a.js').wrapInner('<span class="dashed"></span>');
	$('a').live('click', function(){
		if ($(this).is('.js'))
		{
		return false;
		};
	});
});

// input placeholder
function elementSupportsAttribute(element,attribute) {
	var test = document.createElement(element);
	if (attribute in test) {
		return true;
	} else {
		return false;
	}
}
if (!elementSupportsAttribute('input','placeholder')) {
	var placeholderDo = function(input){
		input.each(function(){
			placeholder = $(this).attr('placeholder');
			if (placeholder)
			{
				$(this).attr('value',placeholder).addClass('placeholder');
			}
		});
	};
	$(document).ready(function(){
		var placeholder;
		placeholderDo($('input').not('[type="button"]').not('[type="image"]').not('[type="checkbox"]').not('[type="radio"]'))
		var input = $('input.placeholder');
		input.focusin(function(){
			if ($(this).hasClass('placeholder'))
			{
				$(this).removeClass('placeholder').attr('value','');
			};
		});
		input.focusout(function(){
			if (!$(this).attr('value'))
			{
				placeholderDo($(this));
			};
		});
	});
};

// slider and gallery and search

$(document).ready(function(){

	$("#search").autocomplete({
		source: "/ajax/search.php",
		minLength: 2,
		focus: function() {
			// prevent value inserted on focus
			return false;
		},
		select: function(event, ui) {
			var terms = split( this.value );
			// remove the current input
			terms.pop();
			// add the selected item
			terms.push( ui.item.value );
			// add placeholder to get the comma-and-space at the end
			terms.push("");
			this.value = terms.join(", ");
			return false;
		}
	});

	var scrollSpeed = 500;	//slider scroll speed

	//slider function full width
	var sliderWidth = function(parent){
		var width = 0;
		parent.find('.slider-block').each(function(){
			width += $(this).innerWidth();
		});
		parent.width(width);
	};

	//slider function main block width
	var setSliderWidth = function(slider){
		var width = 0;
		var parentWidth = parseInt(slider.offsetParent().width());
		slider.find('.slider-block').each(function(){
			if (width+$(this).innerWidth() < parentWidth)
			{
				width += $(this).innerWidth();
			};
		});
		var nwidth = width;
		width += (parseInt(slider.find('.slider-container').css('padding-left'))+parseInt(slider.find('.slider-container').css('padding-right')));
		if (width > slider.find('.slider-block').innerWidth())
		{
			var border = slider.find('.slider-container-box').width()+parseInt(slider.find('.slider-container-box').css('left'));
			if (nwidth > border)
			{
				var left = parseInt(slider.find('.slider-container-box').css('left'));
				slider.find('.slider-container-box').css({'left':left+(nwidth-border)});
			};
			if (nwidth >= slider.find('.slider-container-box').width())
			{
				slider.find('.slider-arrow-right').hide();
				slider.find('.slider-arrow-left').hide();
			}
			else
			{
				slider.find('.slider-arrow-right').show();
				slider.find('.slider-arrow-left').show();
			};
			return width;
		};
	};

	//slider functions right move
	var moveRight = function(parent)
	{
		parent.not(':animated').animate({'left':'-='+parent.find('.slider-block').innerWidth()},scrollSpeed,function(){stopRight(parent)});
	};

	var stopRight = function(parent)
	{
		var parentWidth = parseInt(parent.parents('.slider-standart').width());
		var position = parent.position();
		var positionLeft = position.left;
		var position = Math.floor(position.left)+parseInt(parent.width());
		if ( position <= parentWidth )
		{
			parent.parents('.slider-standart').find('.slider-arrow-right').addClass('slider-arrow-right-disabled');
		};
		if ( positionLeft < 0 )
		{
			parent.parents('.slider-standart').find('.slider-arrow-left-disabled').removeClass('slider-arrow-left-disabled');
		}
	};

	//slider functions left move
	var moveLeft = function(parent)
	{
		parent.not(':animated').animate({'left':'+='+parent.find('.slider-block').innerWidth()},scrollSpeed,function(){stopLeft(parent)});
	};

	var stopLeft = function(parent)
	{
		var parentWidth = parseInt(parent.parents('.slider-standart').width());
		var position = parent.position();
		var positionLeft = position.left;
		var position = Math.ceil(position.left)+parseInt(parent.width());
		if ( positionLeft >= 0 )
		{
			parent.parents('.slider-standart').find('.slider-arrow-left').addClass('slider-arrow-left-disabled');
		};
		if ( position > parentWidth )
		{
			parent.parents('.slider-standart').find('.slider-arrow-right-disabled').removeClass('slider-arrow-right-disabled');
		}
	};

	//slider initialization
	$('<span class="slider-fade-left"></span>').appendTo('.slider-standart');
	$('<span class="slider-fade-right"></span>').appendTo('.slider-standart');
	$('<span class="slider-arrow-left"></span>').prependTo('.slider-standart');
	$('<span class="slider-arrow-right"></span>').prependTo('.slider-standart');

	$('.slider-container-box').each(function(){
		sliderWidth($(this));
		stopRight($(this));
		stopLeft($(this));
	});

	$('.slider-standart').each(function(){
		$(this).width(setSliderWidth($(this)));
	});

	// slider right button
	$('.slider-arrow-right').click(function(){
		$(this).not('.slider-arrow-right-disabled').each(function(){
			moveRight($(this).parents('.slider-standart').find('.slider-container-box'));
		});
	});

	// slider left button
	$('.slider-arrow-left').click(function(){
		$(this).not('.slider-arrow-left-disabled').each(function(){
			moveLeft($(this).parents('.slider-standart').find('.slider-container-box'));
		});
	});

	// slider resize
	$(window).resize(function(){
		$('.slider-standart').each(function(){
			$(this).css({'width':setSliderWidth($(this))});
			stopRight($(this).find('.slider-container-box'));
			stopLeft($(this).find('.slider-container-box'));
		});
	});

	//=======
	//gallery
	//=======

		var galleryMaxWidth = function() {
			$('.gallery .image-box img').each(function(){

				var maxWidth = $(this).data('width');
				var box = $(this).parents('.image-box');

				$(this).css({'width':'100%'});
				if ($(this).width() >= maxWidth) $(this).css({'width':maxWidth});

				$('body').height('100%')


			});
		};
		var animSpeed;
		var oldHeight = 0;
		var galleryChangeImage = function (gallery,link,speed) {
			if (!speed) var speed = 0;
			animSpeed = speed;
			var link = link.attr('href')
			var data = gallery.data('image');
			var temp = gallery.data('temp');
			var box = gallery.find('.image-box');
			var image = box.find('img');

			if (data != link) {

				gallery.data('image',link);

				var change = function() {
					var image = temp.find('img[src*="'+link+'"]');
					if (image.length == 0) {
						image = $('<img src="'+link+'" alt="" />').appendTo(temp);
						box.find('.loading').css({'display':'block'}).animate({opacity:0.8},{duration:speed,queue:false});
						image.css({
							opacity:0
						});
					}
					else
					{
						box.find('.loading').animate({opacity:0},{duration:speed,queue:false,complete:function(){$(this).css({'display':'none'})}});
						image.triggerHandler('load');
					};
					image.data('src',link)
					image.bind('load', function(){
						image.data('width',image.width())
						box.find('.loading').animate({opacity:0},{duration:animSpeed,queue:false,complete:function(){$(this).css({'display':'none'})}});
						if (image.data('src') == gallery.data('image'))
						{
							box
							.css({
								height:oldHeight
							})
							.prepend(image)
							galleryMaxWidth();
							box.stop().dequeue()
							.animate({
								height:image.height()
							},{
								duration:animSpeed,
								step:function(){$('body').height('auto')},
								complete:function() {
									box.css({'height':'auto'});
									galleryMaxWidth();
									if (image.data('src') == gallery.data('image')) {
										image.stop().dequeue()
										.animate({
											opacity:1
										},
											animSpeed,
											function() {
												$(this).css({opacity:''})
											}
										)
									};
								}
							});

						};

					});

				};
					if (image.length > 0 ) {
						image.stop().dequeue()
							.animate({
								opacity:0
							},
							speed,
							function() {
								if (link == gallery.data('image')) {
									oldHeight = box.find('img').height();
									box.height(oldHeight);
									box.find('img').appendTo(temp);

									change()
								};
							}
						)
					}
					else
					{
						oldHeight = box.find('img').height();
						if (oldHeight) box.height(oldHeight);
						change()
					};
			};
		};

		$('.gallery .image-box img').each(function(){
			$(this).data('width',$(this).width());
			galleryMaxWidth();
		});
		if ($('.gallery').length != 0) {
			$(window).resize(function(){
				galleryMaxWidth();
			});
			$('.slider-block .image-link').click(function(e){
				e.preventDefault();
				$(this).parents('.jcarousel').find('.slider-block ').removeClass('selected')
				$(this).parents('.slider-block').addClass('selected')
				galleryChangeImage($(this).parents('.gallery'),$(this),300);
			});
			$('.gallery').each(function(){
				var parent = $(this);
				var temp = $('<div style="position:absolute;top:-1px;height:1px;overflow:hidden" class="galleryTempBox"></div>');
				temp.appendTo('body').data('parent',parent);
				parent.data('temp',temp);
				var first = parent.find('.slider-block').first();
				first.addClass('selected');
				$('<i class="loading"></i>').appendTo(parent.find('.image-box'));
				galleryChangeImage($(this),first.find('.image-link'));
			});
		};

});

// filter
var offsetTop;
$(document).ready(function(){
	if ($('#filter-block').length != 0) {
		wwidth();
		var blockWidth = $('#filter-block').width();
		var offset = $('#filter-block').offset();
		var parent = $('#filter-block').parents('.block-container');
		var height1 = $('.filter-manufactures').height();
		var height2 = $('.filter-parameters').height();

		var offsetTopSet = function(){offsetTop = $(window).height()*0.2;};
		offsetTopSet();

		parent.height($('#filter-block').innerHeight()).css({
			'margin-bottom':parseInt($('#filter-block').css('margin-bottom'))+parseInt($('#filter-block').css('margin-top'))
		});
		$('#filter-block').css({'margin-bottom':0,'margin-top':0});
		$('<i id="fullscreen-bg"></i>').prependTo('body').height($('body').height()+200).hide();

		$('.link-filter-manufactures').click(function(){
			filterOpen($(this))
		});

		$('.link-filter-parameters').click(function(){
			filterClose($('#filter-block'))
		});

		$('#fullscreen-bg').click(function(){
			filterClose($(this))
		});

		$(window).resize(function(){
			offsetTopSet()
			offset = $('#filter-block').offset();
			wwidth();
			$('#filter-block.big').css({
					width:filterWidth,
					left:filterLeft
			}).css({
					top:wtopfunc()
			},{duration:'fast',queue:false});
			$('#fullscreen-bg').height($('body').height());
		});

		$(window).scroll(function(){
			if ($('#filter-block').height() < $(window).height())
			{
				$('#filter-block.big').css({
					top:wtopfunc()
				},{duration:'fast',queue:false});
			};
		});

		var tpaddingTop = $('#filter-block .corners-block-inner').css('padding-top');
		var tpaddingLeft = $('#filter-block .corners-block-inner').css('padding-left');
		var tpaddingRight = $('#filter-block .corners-block-inner').css('padding-right');
		var tpaddingBottom = $('#filter-block .corners-block-inner').css('padding-bottom');


		var paddingTopBig = 14;
		var paddingLeftBig = 28;
		var paddingRightBig = 28;
		var paddingBottomBig = 6;

		var filterClose = function(tlink){
		    $('#close-big-filter').hide();
			$('#filter-block.big').not(':animated').each(function(){
				$('#main').queue(function(){

					tooltipClose($('#filter-block'));
					$('.link-filter-manufactures').removeClass('active');
					$('.link-filter-parameters').addClass('active');

					$('#filter-block.big:not(:animated) .filter-manufactures').insertAfter('#filter-block .filter-parameters').animate({opacity:0,height:$('#filter-block .filter-manufactures').height()},function(){
						$(this).animate({height:0},function(){
							$(this).css({'height':'auto','display':'none'});
						});
					});

					var parentOffset = parent.offset();

					$('#filter-block').removeClass('big').animate({
						width:blockWidth,
						left:parentOffset.left,
						top:parentOffset.top
					},function(){
						$(this).css({
							left:0,top:0,
							position:'relative'
						}).prependTo(parent);
						height2 = $('#filter-block .filter-parameters').height();
						$('#filter-block .filter-parameters').css({height:0,opacity:0}).animate({height:height2,opacity:1},function(){$(this).css({'height':'auto',opacity:''});$('#main').clearQueue();});
					});
					$('#fullscreen-bg').stop().animate({opacity:0},function(){
						$('#fullscreen-bg').css({'display':'none'});
					});
					$('#filter-block .corners-block-inner').animate({
						paddingTop:tpaddingTop,
						paddingLeft:tpaddingLeft,
						paddingRight:tpaddingRight,
						paddingBottom:tpaddingBottom
					});

				});
			});
		};

		var filterOpen = function(){
			$('#filter-block').not('.big').not(':animated').each(function(){
				$('#main').queue(function(){
					tooltipClose();
					$('.link-filter-parameters').removeClass('active');
					$('.link-filter-manufactures').addClass('active');

					$('#filter-block:not(.big):not(:animated) .filter-parameters').insertAfter('#filter-block .filter-manufactures').animate({opacity:0,height:$('#filter-block .filter-parameters').height()},function(){
						$(this).animate({height:0},function(){
							$(this).css({'height':'auto','display':'none'});
						});
					});

					wwidth();
					offset = $('#filter-block').offset();

					$('#filter-block').prependTo('body').css({
						width:blockWidth,
						position:'absolute',
						top:offset.top,
						left:offset.left,
						'z-index':100
					}).animate({
						width:filterWidth,
						left:filterLeft,
						top:wtopfunc()
					},{complete:function(){  autoresize();
						$(this).addClass('big').css({
							width:filterWidth,
							left:filterLeft,
							top:wtopfunc()
						});
						height1 = $('#filter-block .filter-manufactures').height();
						autoresize();
						$('#filter-block .filter-manufactures').css({height:0,opacity:0}).animate({height:height1,opacity:1},function(){
							$(this).css({'height':'auto','opacity':''});
							$('#main').clearQueue();
							$('#filter-block').css({top:wtopfunc()});
						});
					}});

					$('#filter-block .corners-block-inner').animate({
						paddingTop:paddingTopBig,
						paddingLeft:paddingLeftBig,
						paddingRight:paddingRightBig,
						paddingBottom:paddingBottomBig
					});
                    autoresize();
					$('#filter-block').not('.big').next('#fullscreen-bg').stop().height($('body').height()).css({'display':'block',opacity:0}).animate({opacity:0.50});
					$('#close-big-filter').show();
				});
			});
		};
	};


});



var wtop;
var wtopfunc = function(){
			if ($('#filter-block').height()+offsetTop*1.5 < $(window).height()){
					wtop = $(window).scrollTop()+offsetTop;
			}else{
					wtop = offsetTop;
			};
			return wtop;
};

var filterLeft;
var filterWidth;
var wwidth = function(){
		filterWidth = $('#main .container-width').innerWidth()*0.94;
		filterLeft = $(window).width()/2-filterWidth/2;
		if ($(window).width() < $('#main .container-width').innerWidth() )
		{
			filterWidth = $('#main .container-width').innerWidth()*0.94;
			if ($(window).width() > $('#main .container-width').innerWidth())
			{
				filterLeft = $(window).width()/2-filterWidth/2;
			}
			else
			{
				filterLeft = $('#main .container-width').innerWidth()/2-filterWidth/2;
			}
		};
};

//shake

var shake = function(shakeBlock,power,time){
	$('#main').queue(function(){
		shakeBlock.css({'position':'relative'});
		shakeBlock.css({'left':'0px'});
		shakeBlock.css({'top':'0px'});
		var back = shakeBlock.css('background-color');
		var posLeft = parseInt(shakeBlock.css('left'));
		var posTop = parseInt(shakeBlock.css('top'));
		var t;
		for (i = 5; i > 0; i-=1)  {
			t = i;
			shakeBlock
				.animate({'left':'-='+power},{duration:time/i,easing:'linear'})
				.animate({'left':'+='+power},{duration:time/i,easing:'linear'})
				.animate({'left':'+='+power},{duration:time/i,easing:'linear'})
				.animate({'left':'-='+power},{duration:time/i,easing:'linear'})
			if (t===1) {
				shakeBlock
				.animate({left:posLeft},{duration:time/i,easing:'linear',complete:function(){$('#main').clearQueue()}});
			};
		};
	});
};

$(document).ready(function(){
	$('.link-filter-parameters-show').click(function(){
		shake($('#filter-block'),10,90);
	});
});

//filter-collections
$(document).ready(function(){

  var ul = $('.updoli');
  ul.parents('ul').data('height',ul.parents('ul').height());
  ul.slideUp(0,function(){ul.parents('ul').height(0);ul.parents('ul').height('auto');});

	$('.collection-list .top-button').click(function(e){

			var thisLi = $(this).parents('li');
			var thisB = $(this);

			thisLi.queue(function(){

				thisB.toggleClass('top-open');
				thisB.toggleClass('top-close');

				var animTime = 300;

				if ($.browser.msie && $.browser.version == 8.0 ) animTime = 0;


				if (thisB.is('.top-close')) {
					thisLi.parents('ul').data('height',thisLi.parents('ul').height());
					thisLi.find('ul').slideUp(animTime,function(){thisLi.clearQueue();thisLi.parents('ul').height(0);thisLi.parents('ul').height('auto')});
					tooltipClose($(thisLi));
				};
				if (thisB.is('.top-open')) {
					thisLi.find('ul').slideDown(animTime,function(){thisLi.clearQueue();thisLi.parents('ul').height(thisLi.parents('ul').data('height')).height('auto')});
				};

			});

	});
	$('.collection-list .top-close').each(function(){
		$(this).parents('li').find('ul').hide();
	});
	$('.link-filter-hide-collections').toggle(function(){
		var list = $(this);
			$(this).find('span').text('cкрыть коллекции')
			var ul = $('.collection-list > li ul');
			var animTime = 300;
			if ($.browser.msie && $.browser.version == 8.0 ) animTime = 0;
			ul.slideDown(animTime,function(){ul.parents('ul').height(ul.parents('ul').data('height')).height('auto'); autoresize();});
			$('.collection-list .top-button').removeClass('top-close').addClass('top-open');
			tooltipClose();

	}, function(){
		var list = $(this);
			$(this).find('span').text('показать коллекции');
			var ul = $('.collection-list > li ul:visible');
			var animTime = 300;
			if ($.browser.msie && $.browser.version == 8.0 ) animTime = 0;
			ul.parents('ul').data('height',ul.parents('ul').height());
			ul.slideUp(animTime,function(){ul.parents('ul').height(0);ul.parents('ul').height('auto'); autoresize();});
			$('.collection-list .top-button').removeClass('top-open').addClass('top-close');
			tooltipClose();
	});

	$('.link-filter-options').toggle(function(){
		$(this).find('span').text('Скрыть параметры')
		$('.filter-options').slideDown(function(){
		  autoresize();
		});

		tooltipClose();
	}, function(){
		$(this).find('span').text('Показать параметры');
		$('.filter-options').slideUp(function(){
		  autoresize();
		});
		tooltipClose();
	});
	$('.collection-list > li > input[type="checkbox"]').change(function(e){
		var change = $(this).attr('checked');
		$(this).parents('li').find('ul input[type="checkbox"]').attr('checked',change);
	});
	$('.collection-list > li > ul input[type="checkbox"]').change(function(e){
		$(this).parents('ul').parents('li').find(' > input[type="checkbox"]').attr('checked',false);
	});
});

function autoresize(){
body = $('body').height();
block = $('#filter-block').height()+200;

if(body>block){
  $('#fullscreen-bg').height(body);
}else{
  $('#fullscreen-bg').height(block);
}
}

//tooltip

var	allTooltips = {};
$(document).ready(function(){
	$('.tooltip').each(function(){
		var parent = $(this);
		var parentWidth = $(this).width();
		var text = $(this).attr('title');
		var header = $(this).text();
		var tooltip = $('<span class="b-tooltip"><i class="b-tooltip-top"></i><span class="b-tooltip-inner"><a href="#" class="js b-tooltip-close"></a><strong class="b-tooltip-header">'+header+'</strong> '+text+'</span></span>')
		.appendTo('body').css({opacity:0}).slideUp(1);
		parent.html(parent.html()+'<a href="#" class="js b-tooltip-button"></a>');
		parent.removeAttr('title');
		var button = parent.find('.b-tooltip-button');
		var buttonClose = tooltip.find('.b-tooltip-close');
		tooltip.data('button',button);
		button.data('tooltip',tooltip);
	});
	allTooltips = $('.b-tooltip');
	$(window).resize(function(){
		tooltipOffset();
	});
	$(window).scroll(function(){
		tooltipOffset();
	});
	$(document).click(function(e){
		var trg = $(e.target)
		if (!trg.is('.b-tooltip *') && !trg.is(allTooltips))
			if (!trg.is('.b-tooltip-button'))
			{
				tooltipClose();
			}
			else
			{
				tooltipClose($('.tooltip').not(trg.parents('.tooltip')));
			}
	});
	$('.b-tooltip-button').click(function(){
			if (!duration) var duration = 200;
			if ($.browser.msie && $.browser.version <= 8.0) duration = 0;
			var button = $(this);
			var tooltip = button.data('tooltip');
				if (button.data('state') != 'open') {
					button.data('state','open');
					tooltip.stop().css({
						display:'block'
					})
					.animate({
						opacity:1
					},{duration:duration,queue:false,complete:function(){
						$(this).css({'opacity':''})
					}});
					tooltipOffset();
				}
				else
				{
					tooltipClose(button.parents('.tooltip'))
				};
	});
	$('.b-tooltip-close').click(function(){
			var parent = $(this).parents('.b-tooltip').data('button').parents('.tooltip');
			tooltipClose(parent)
	});
});

var tooltipClose = function(tooltipParent,duration){
	if (!duration) var duration = 200;
	if ($.browser.msie && $.browser.version <= 8.0) duration = 0;
	if (!tooltipParent) tooltipParent = $(document);
	tooltipParent.find('.b-tooltip-button').each(function(){
			var button = $(this);
			if (button.data('state') == 'open') {
				button.data('state','close')
				var tooltip = $(this).data('tooltip');
				tooltip.stop()
					.animate({opacity:0},{duration:duration,queue:false,complete:function(){
						$(this).css({'display':'none'})
					}});
			};
	});
};
var tooltipOffset = function(){
	var button;
	var buttonOffset;
	var left;
	var top;
	allTooltips.not(':hidden').each(function(){
		button = $(this).data('button');
		buttonOffset = button.offset();
		left = buttonOffset.left-105;
		top = buttonOffset.top+40;
		if (left+258 >= $(window).width() && $('#main').width() <= $(window).width())
		{
			left = $(window).width()-258
		};
		$(this)
		.css({
			left:left,top:top
		});
	});
};

//buttons focus / hover
$(document).ready(function(){
	var focused;
	if (!$.browser.msie || ($.browser.msie && $.browser.version >= 7.0 )) {
		var buttons = 	$('.button-small, .button-big, .slider-arrow-left, .slider-arrow-right, .button-minus, .button-plus');
		buttons.live('focusin mousedown',function(e){
			if (e.type == 'mousedown') {
				$(this).data('focus',true);
				e.preventDefault();
			};
			$(this).addClass('focus');
			focused = true;
		});
		buttons.live('focusout',function(e){
			$(this).removeClass('focus');
			focused = false;
		});
		$(document).bind('mouseup', function(e){
			buttons.data('focus',false).removeClass('focus');
			focused = false;
		});
		$(document).bind('mousemove',function(e){
			if ( focused )
			{
				e.preventDefault()
			};
		});
		buttons.hover(function(){
			if ($(this).data('focus')) {
				$(this).addClass('focus').addClass('hover');
			} else {
				$(this).addClass('hover');
			};
		},function(){
			if ($(this).data('focus')) {
				$(this).removeClass('focus').removeClass('hover');
			} else {
				$(this).removeClass('hover');
			};
		});
	};

});

//catalog
$(document).ready(function(){

	var catalogLi = $('.items-catalog li.item');
	catalogLi.find('.bg').css({opacity:0,left:0,'display':'none',height:$(this).parent().find('.item-container').innerHeight()});
	g_height = 0;
	$(window).load(function(){
		catalogLi.find('.hidden').each(function(){
			$(this).css({'max-width':'100%'});
			//if($(this).height()>g_height)g_height=$(this).height();
			if ($.browser.opera){
			  $(this).data('height',$(this).height()-50);
			}else{
			  $(this).data('height',$(this).height());
			}
			$(this).data('margin-top',$(this).css('margin-top'));
			$(this).data('margin-bottom',$(this).css('margin-bottom'));
			$(this).data('padding-top',$(this).css('padding-top'));
			$(this).data('padding-bottom',$(this).css('padding-bottom'));
		}).height(0).css({opacity:0,'padding-bottom':0,'padding-top':0,'margin-bottom':0,'margin-top':0,'left':'0','position':'relative','width':'auto'});
		if ($.browser.opera){
		  h = $('.items-catalog').height();
		  $('.items-catalog').height(h+100);
		}

		var animTime = 300;
		var bgAnimTime = 150;
		if ($.browser.msie && $.browser.version <= 8.0 ) bgAnimTime = 0;
		catalogLi.hover(function(){
			catalogLi.find('.bg').filter(':animated').parents('li.item').css({'z-index':'5'})
			var bg = $(this).find('.bg')
			var container = $(this).find('.item-container');
			$(this).height($(this).height()).css({'z-index':10});
			$(this).find('.item-container').css({'margin-bottom':'-1000px'})
			$(this).find('.bg')
				.stop().dequeue()
				.css({
					'display':'block',
					height:container.innerHeight()
				})
				.animate({
					opacity:1
				},bgAnimTime,
				function(){
					$(this).css({'opacity':''});
					$(this).css({height:container.innerHeight()});
				});
			var hidden = $(this).find('.hidden')
			hidden.each(function(){
				$(this).stop().dequeue()
				.animate({
					'height':$(this).data('height'),
					'padding-bottom':$(this).data('padding-bottom'),
					'padding-top':$(this).data('padding-top'),
					'margin-bottom':$(this).data('margin-bottom'),
					'margin-top':$(this).data('margin-top'),
					 opacity:1
				},{duration:animTime,
				step:function(){
					bg.css({height:container.innerHeight()})
				},
				complete:function(){
					$(this).css({opacity:''}).data('height',$(this).height())
				}});
			});

		},function(){
			var parent = $(this)
			var bg = $(this).find('.bg')
			var container = $(this).find('.item-container');
			$(this).find('.bg')
				.stop().dequeue()
				.animate({
					opacity:0
				},bgAnimTime*2,
				function(){
					$(this).css({'display':'none'});
					parent.css({'z-index':1});
				});
			var hidden = $(this).find('.hidden')
			hidden.each(function(){
				$(this).stop().dequeue()
				.stop().dequeue()
				.animate({
					'height':0,
					'padding-bottom':0,
					'padding-top':0,
					'margin-bottom':0,
					'margin-top':0,
					 opacity:0
				},{duration:animTime,
				step:function(){
					bg.css({height:container.innerHeight()})
				}});
			});
		});
	});
});



function rebind(){
  $('<b class="dash"></b>').prependTo('span.rub');
  	$('.count-form .count-input').each(function(){
		$(this).data('old',$(this).val())
		var box = $('<span class="count-input-container"></span>');
		$(this).wrap(box);
		$('<a href="#" class="js button-minus"></a>').data('parent',$(this)).insertBefore($(this))
		$('<a href="#" class="js button-plus"></a>').data('parent',$(this)).insertAfter($(this))
		$(this).data('price-block',$(this).parents('.product-page-order').find('.total-price .price'));
		$(this).data('price',
			$(this).parents('.count-block').find('.count-price strong').text()
		);
		var price = $(this).data('price');
		price = Math.round($(this).data('price').replace(/ /g, ""))
		$(this).data('price',price);
		pricemath($(this).val(),$(this))
	});

var focused;
	if (!$.browser.msie || ($.browser.msie && $.browser.version >= 7.0 )) {
		var buttons = 	$('.button-small, .button-big, .slider-arrow-left, .slider-arrow-right, .button-minus, .button-plus');
		buttons.live('focusin mousedown',function(e){
			if (e.type == 'mousedown') {
				$(this).data('focus',true);
				e.preventDefault();
			};
			$(this).addClass('focus');
			focused = true;
		});
		buttons.live('focusout',function(e){
			$(this).removeClass('focus');
			focused = false;
		});
		$(document).bind('mouseup', function(e){
			buttons.data('focus',false).removeClass('focus');
			focused = false;
		});
		$(document).bind('mousemove',function(e){
			if ( focused )
			{
				e.preventDefault()
			};
		});
		buttons.hover(function(){
			if ($(this).data('focus')) {
				$(this).addClass('focus').addClass('hover');
			} else {
				$(this).addClass('hover');
			};
		},function(){
			if ($(this).data('focus')) {
				$(this).removeClass('focus').removeClass('hover');
			} else {
				$(this).removeClass('hover');
			};
		});
	};

  var catalogLi = $('.items-catalog li.item');
	catalogLi.find('.bg').css({opacity:0,left:0,'display':'none',height:$(this).parent().find('.item-container').innerHeight()});
	$(window).ready(function(){
		catalogLi.find('.hidden').each(function(){
			$(this).css({'max-width':'100%'})
			$(this).data('height',$(this).height());
			$(this).data('margin-top',$(this).css('margin-top'));
			$(this).data('margin-bottom',$(this).css('margin-bottom'));
			$(this).data('padding-top',$(this).css('padding-top'));
			$(this).data('padding-bottom',$(this).css('padding-bottom'));
		}).height(0).css({opacity:0,'padding-bottom':0,'padding-top':0,'margin-bottom':0,'margin-top':0,'left':'0','position':'relative','width':'auto'});
		var animTime = 300;
		var bgAnimTime = 150;
		if ($.browser.msie && $.browser.version <= 8.0 ) bgAnimTime = 0;

		catalogLi.hover(function(){

			catalogLi.find('.bg').filter(':animated').parents('li.item').css({'z-index':'5'})
			var bg = $(this).find('.bg')
			var container = $(this).find('.item-container');
			$(this).height($(this).height()).css({'z-index':10});
			$(this).find('.item-container').css({'margin-bottom':'-1000px'})

			$(this).find('.bg')
				.stop().dequeue()
				.css({
					'display':'block',
					height:container.innerHeight()
				})
				.animate({
					opacity:1
				},bgAnimTime,
				function(){
					$(this).css({'opacity':''});
					$(this).css({height:container.innerHeight()});
				});
			var hidden = $(this).find('.hidden')
			hidden.each(function(){
				$(this).stop().dequeue()
				.animate({
					'height':$(this).data('height'),
					'padding-bottom':$(this).data('padding-bottom'),
					'padding-top':$(this).data('padding-top'),
					'margin-bottom':$(this).data('margin-bottom'),
					'margin-top':$(this).data('margin-top'),
					 opacity:1
				},{duration:animTime,
				step:function(){
					bg.css({height:container.innerHeight()})
				},
				complete:function(){
					$(this).css({opacity:''}).data('height',$(this).height())
				}});
			});

		},function(){
			var parent = $(this)
			var bg = $(this).find('.bg')
			var container = $(this).find('.item-container');
			$(this).find('.bg')
				.stop().dequeue()
				.animate({
					opacity:0
				},bgAnimTime*2,
				function(){
					$(this).css({'display':'none'});
					parent.css({'z-index':1});
				});
			var hidden = $(this).find('.hidden')
			hidden.each(function(){
				$(this).stop().dequeue()
				.stop().dequeue()
				.animate({
					'height':0,
					'padding-bottom':0,
					'padding-top':0,
					'margin-bottom':0,
					'margin-top':0,
					 opacity:0
				},{duration:animTime,
				step:function(){
					bg.css({height:container.innerHeight()})
				}});
			});
		});
	});
}



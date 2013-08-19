/* Основной скрипт анкеты */
$(function() {
	var fieldsetCount = $('#formElem').children().length;
	var current 	= 1;
	var stepsWidth	= 0;
    var widths 		= new Array();
	$('#steps .step').each(function(i){
        var $step 		= $(this);
		widths[i]  		= stepsWidth;
        stepsWidth	 	+= $step.width();
    });
	$('#steps').width(stepsWidth);
	$('#formElem').children(':first').find(':input:first').focus();	
	$('#navigation').show();
    $('#navigation a').bind('click',function(e){
		var $this	= $(this);
		var prev	= current;
		$this.closest('ul').find('li').removeClass('selected');
        $this.parent().addClass('selected');
		current = $this.parent().index() + 1;
        $('#steps').stop().animate({
            marginLeft: '-' + widths[current-1] + 'px'
        },500,function(){
			if(current == fieldsetCount)
				validateSteps();
			else
				validateStep(prev);
			$('#formElem').children(':nth-child('+ parseInt(current) +')').find(':input:first').focus();	
		});
        e.preventDefault();
    });
	
	$('#formElem > fieldset').each(function(){
		var $fieldset = $(this);
		$fieldset.children(':last').find(':input').keydown(function(e){
			if (e.which == 9){
				$('#navigation li:nth-child(' + (parseInt(current)+1) + ') a').click();
				$(this).blur();
				e.preventDefault();
			}
		});
	});
	
	function validateEmail(email) {
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if( !emailReg.test( email ) ) {
			return false;
		}
		else {
			return true;
		}
	}
	
	function validateSteps(){
		var FormErrors = false;
		for(var i = 1; i < fieldsetCount; ++i){
			var error = validateStep(i);
			if(error == -1)
				FormErrors = true;
		}
		$('#formElem').data('errors',FormErrors);	
	}
	
	function validateStep(step){
		if(step == fieldsetCount) return;
		
		var error = 1;
		var hasError = false;
		$('#formElem').children(':nth-child('+ parseInt(step) +')').find(':input[data-type="validate"]').each(function(){
			var $this 		= $(this);
			var valueLength = jQuery.trim($this.val()).length;
			
			if ($this.attr("data") == "mail_check") {
				if(!validateEmail(String($this.val()))){
					hasError = true;
					$this.css('background-color','#FFEDEF');
					}
				else
					$this.css('background-color','#FFFFFF');
			}
			
			if(valueLength == ''){
				hasError = true;
				$this.css('background-color','#FFEDEF');
			}
			else
				$this.css('background-color','#FFFFFF');	
		});
		var $link = $('#navigation li:nth-child(' + parseInt(step) + ') a');
		$link.parent().find('.error,.checked').remove();
		
		$link.removeClass("checked_mark");
		$link.removeClass("error_mark");
		
		var valclass = 'checked_mark';
		if(hasError){
			error = -1;
			valclass = 'error_mark';
		}
		
		$link.addClass(valclass);
		
		return error;
	}
	
	$("#ad").change( function() {
		if ($(this).val() == "other"){
			$("#ad_other").fadeIn();
		}
		else{
			$("#ad_other").fadeOut();
		}
	});
	

	$('#registerButton').bind('click',function(){
		validateSteps();
		$this = $('input[name="yes"]');
		if (!$this.is(':checked')){
			$(".error_check").fadeIn();
			FormErrors = true;
			$('#formElem').data('errors',FormErrors);
		}
		else
		{
			$(".error_check").fadeOut();
			FormErrors = false;
		}
		$this = $('select[name="ad"]');
		if ($this.val() == "no"){
			$(".error_radio").fadeIn();
			FormErrors = true;
			$('#formElem').data('errors',FormErrors);
		}
		else
		{
			$(".error_radio").fadeOut();
			FormErrors = false;
		}
		if($('#formElem').data('errors')){
			alert('Имеются некорректно заполненные поля');
			return false;
		}
		else
		{
			alert("Спасибо! Ваши данные успешно отправлены.");
		}
	});
});

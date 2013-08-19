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
	
	$("input[type='number']").keydown(function(event) {
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || 
            (event.keyCode == 65 && event.ctrlKey === true) || 
            (event.keyCode >= 35 && event.keyCode <= 39)) {
                 return;
        }
        else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault(); 
            }   
        }
    });
	
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
			if(valueLength == ''){
				hasError = true;
				$this.css('background-color','#FFEDEF');
			}
			else
				$this.css('background-color','#FFFFFF');
		});
		var $link = $('#navigation li:nth-child(' + parseInt(step) + ') a');
		$link.parent().find('.error,.checked').remove();
		
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
		$this = $('input[name="yes"]');
		if (!$this.is(':checked')){
			$(".error_check").fadeIn();
			FormErrors = true;
			$('#formElem').data('errors',FormErrors);
		}
		else
		{
			$(".error_check").fadeOut();
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

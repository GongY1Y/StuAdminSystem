$(function(){
	$('#entry').click(function(){
		if($('#adminName').val()==''){
			$('.mask,.dialog').show();
			$('.dialog .dialog-bd p').html('请输入职工号/学号');
		}else if($('#adminPwd').val()==''){
			$('.mask,.dialog').show();
			$('.dialog .dialog-bd p').html('请输入密码');
		}else{
			$('.mask,.dialog').hide();
			location.href='/verification?uid=' + $('#adminName').val() + '&password=' + $('#adminPwd').val();
		}
	});
});

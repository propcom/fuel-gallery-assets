/***
 * Gallery Manager Module - JS
 ***/

jQuery(document).ready(function($) {

	//Display form to create new album
	$('#create_new_album').live("click", function() {
		$('#welcome').fadeOut('fast', function() {
			$('#form_new_album').fadeIn('fast');
		});
	});

	//Hide form to create new album
	$('#form_new_album_close').live("click", function() {
		$('#form_new_album').fadeOut('fast', function() {
			$('#welcome').fadeIn('fast');
		});
	});

	//Quick search - Simply filter albums names
	$('#quick_search').live('keyup change', function(){
		var filter = $(this).val();
		
		if (filter) {
			$('ul.nav').find("span.album_name:not(:Contains(" + filter + "))").parent().parent().fadeOut(150);
			$('ul.nav').find("span.album_name:Contains(" + filter + ")").parent().parent().fadeIn(20);
		}
		else{
			$('ul.nav').find("li").fadeIn(20);
		}
	});

	//Add insensitive function for filter
	jQuery.expr[':'].Contains = function(a,i,m){
		return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
	};

	//iPhone Checkbox to set album live
	$('#checkbox_live').iphoneStyle({
		onChange: function(elem, value) { 

			var album = elem.attr('data-album-id');
					
			$.post('/admin/gallery/ajax/set_status', { album_id: album, live: value }, function(data) {
				
				//Hide the star
				$('ul.nav li#'+album+" a i").hide();

				//Prepend the new full/empty one
				if(value==true)
					$('ul.nav li#'+album+" a").prepend('<i class="icon-star"></i>');
				else
					$('ul.nav li#'+album+" a").prepend('<i class="icon-star-empty"></i>');
			});
		}
	});

	//Update Album name
	$('#album_name').live('change enterKey', function(){

		var album = $('#album_info').attr('data-active-album');
		var name = $('#album_name').val();
		
		
		$.post('/admin/gallery/ajax/album_name', { album_id: album, name: name }, function(data) {

			var album = $('#album_info').attr('data-active-album');

			$('ul.nav li#'+album+" a span").text(name);
			
			var input = $('#album_name').addClass('green');
			setTimeout(function () {
				input.removeClass('green');
			}, 1000);
		});
	});

	//Update image caption
	$('.caption').live('change enterKey', function(){

		var caption = $(this);		
		
		$.post('/admin/gallery/ajax/img_caption', { id: caption.attr('id'), caption: caption.val() }, function(data) {

			caption.addClass('green');
			setTimeout(function () {
				caption.removeClass('green');
			}, 1000);

		});
	});

	//Handle sortable
	$("#filelist").sortable();
	$("#filelist").bind( "sortupdate", function(event, ui) {

		var album = $('#album_info').attr('data-active-album');

		$.post('/admin/gallery/ajax/sort_imgs', { album_id: album, order: $(this).sortable('toArray') }, function(data) {
			return true;
		});
	});

	//Delete image
	$('a.del').live('click', function(){
		var answer = confirm("Are you sure?");
		if(answer){
			var img = $(this);
			$.post('/admin/gallery/ajax/del_img', { id: img.parent().attr('id') }, function(data) {
				img.parent().effect('blind');
			});
		}
		return false;
	});

});
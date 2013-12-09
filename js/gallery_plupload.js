jQuery(document).ready(function($) {

	//Config
	var uploader = new plupload.Uploader({
		runtimes : 'html5,flash',
		containes: 'plupload',
		drop_element: 'droparea',
		browse_button: 'browse',
		url: '/admin/gallery/ajax/plupload',
		flash_swf_url: '/assets/gallery/js/plupload/plupload.flash.swf',
		multipart: true,
		urlstream_upload: true,
		multipart_params:{album_id: $('#album_info').attr('data-active-album')},
		resize : {width : 800, height : 600, quality : 100},
		max_file_size: '3mb',
		filters : [ {title: 'Images', extensions: 'jpg,jpeg,gif,png'} ],
	});

	//CSS hacks foe hover effects on droparea
	$('#droparea').bind({
		dragover : function(e){
			$(this).addClass('hover');
			
		},
		dragleave : function(e){
			$(this).removeClass('hover');
			
		}
	});

	//Init plupload
	uploader.init();

	//Detect files added and start upload
	uploader.bind('FilesAdded', function(up, files){

		var filelist = $('#filelist');

		for(var i in files)
		{
			var file = files[i];
			filelist.prepend('<div id="'+file.id+'" class="file well">'+file.name+'<div class="progress progress-striped active"><div class="bar" style="width: 1%;"></div></div>');
		}

		$('#droparea').removeClass('hover');
		uploader.start();
		uploader.refresh();
	});

	//check browser can handle html5 drag&drop
	uploader.bind('init', function(up, params){
		if(params.runtime !='html5') {
			$('#winner').hide();
			$('#looser').show();
		}
	});

	//Alert errors (filesize, formats...)
	uploader.bind('Error', function(up, err){
		uploader.refresh();
		$('#droparea').removeClass('hover');
	});

	//Display upload progress bar
	uploader.bind('UploadProgress', function(up, file){
		$('#'+file.id).find('.bar').css('width',file.percent+'%');
	});

	//Once uploaded, hide progress
	uploader.bind('FileUploaded', function(up, file, response){
		data = $.parseJSON(response.response);
		$('#filelist').append(data.html);
		$('#'+file.id).delay(500).fadeOut('slow');
	});

});
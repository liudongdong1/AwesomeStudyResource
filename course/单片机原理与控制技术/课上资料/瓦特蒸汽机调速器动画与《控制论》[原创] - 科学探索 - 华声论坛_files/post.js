function seccheck(theform, seccodecheck, secqaacheck, previewpost) {
	if(!previewpost && (seccodecheck || secqaacheck)) {
		var url = 'ajax.php?inajax=1&action=';
		if(seccodecheck) {
			var x = new Ajax('XML', '');
			x.get(url + 'checkseccode&seccodeverify=' + $('seccodeverify').value, function(s) {
				if(s != 'succeed') {
					alert(s);
					$('seccodeverify').focus();
				} else if(secqaacheck) {
					checksecqaa(url, theform);
				} else {
					postsubmit(theform);
				}
			});
		} else if(secqaacheck) {
			checksecqaa(url, theform);
		}
	} else {
		postsubmit(theform, previewpost);
	}
}

function checksecqaa(url, theform) {
	var x = new Ajax('XML', '');
	var secanswer = $('secanswer').value;
	secanswer = is_ie && document.charset == 'utf-8' ? encodeURIComponent(secanswer) : secanswer;
	x.get(url + 'checksecanswer&secanswer=' + secanswer, function(s) {
		if(s != 'succeed') {
			alert(s);
			$('secanswer').focus();
		} else {
			postsubmit(theform);
		}
	});
}

function postsubmit(theform, previewpost) {
	if(!previewpost) {
		theform.replysubmit ? theform.replysubmit.disabled = true : theform.topicsubmit.disabled = true;
		theform.submit();
	}
}

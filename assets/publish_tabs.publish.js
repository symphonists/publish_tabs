/*-----------------------------------------------------------------------------
	Language strings
-----------------------------------------------------------------------------*/	 

Symphony.Language.add({
	'Untitled Tab': false
});
	

/*-----------------------------------------------------------------------------
	PublishTabs
-----------------------------------------------------------------------------*/
(function ($, undefined) {
	
	'use strict';
	
	var PublishTabs = {
			
		tab_controls: null,
		new_entry: null,
		
		init: function() {
			var self = this;
			
			// thy shalt not pass if no Publish Tab fields used
			var tab_fields = $('.field-publish_tabs');
			if (!tab_fields.length) return;
			
			$('body').addClass('publish-tabs');
			
			// are we creating a new entry or editing an existing one?
			var env = Symphony.Context.get('env');
			this.new_entry = (env.page === 'new');
			
			var has_invalid_tabs = false;
			this.tab_controls = $('<ul class="tabs"></ul>');
			
			var publish_tabs = Symphony.Context.get('publish-tabs');
			
			for(var i in publish_tabs) {

				var main_fields = '';
				var sidebar_fields = '';
				
				for(var field in publish_tabs[i].main) main_fields += '#' + publish_tabs[i].main[field] + ', ';
				for(var field in publish_tabs[i].sidebar) sidebar_fields += '#' + publish_tabs[i].sidebar[field] + ', ';
				
				main_fields = main_fields.replace(/, $/,'');
				sidebar_fields = sidebar_fields.replace(/, $/,'');
				
				$(main_fields).wrapAll('<div class="tab-group tab-group-' + publish_tabs[i]['tab_id'] + '"></div>');
				$(sidebar_fields).wrapAll('<div class="tab-group tab-group-' + publish_tabs[i]['tab_id'] + '"></div>');
				
				var tab_field = $('#field-' + publish_tabs[i]['tab_id']).remove();
				var tab_text = (tab_field.text() != '') ? tab_field.text() : Symphony.Language.get('Untitled Tab');
				var tab_button = $('<li class="tab-'+publish_tabs[i]['tab_id']+'" data-id="'+publish_tabs[i]['tab_id']+'">' + tab_text + '</li>');

				this.tab_controls.append(tab_button);
				
				// add click event to tab
				tab_button.bind('click', function() {
					if ($(this).hasClass('selected')) return;
					tab_button.addClass('invalid').append('<span>!</span>');
				});
				
				// find invalid fields
				if ($('.tab-group-' + i + ' .invalid').length) {
					has_invalid_tabs = true;
					tab_button.addClass('invalid').append('<span>!</span>');
				}
				
			}
			
			if (has_invalid_tabs) {
				this.tab_controls.find('li.invalid:first').click();
			} else {
				this.tab_controls.find('li:first').click();
			}
			
			$('#context').append(this.tab_controls);

			var initial_tab = self.getURLParameter('publish-tab');
			if( initial_tab !== undefined ){
				$('.'+initial_tab).trigger('click');
			}
		},
		
		showTab: function(tab) {
			var w = $('#contents').width();
			
			// deselect current tab and select the new tab
			this.tab_controls.find('li.selected').removeClass('selected');
			this.tab_controls.find('li.tab-' + tab).addClass('selected');
			
			// hide current tab group and select new group
			$('.tab-group-selected').removeClass('tab-group-selected');
			$('.tab-group-' + tab).addClass('tab-group-selected');
					
			var invalid_field = $('.tab-group-' + tab + ' .invalid');
			// focus first invalid element
			if (invalid_field.length) {
				invalid_field.eq(0).find('*[name*="fields["]').focus();
			}
			// focus first field in tab when creating a new entry
			else if (this.new_entry) {
				$('.tab-group-' + tab + ' .field:first *[name*="fields["]').focus();
			}
		},

		getURLParameter: function(name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
		}
		
	}

	$(document).ready(function() {
		PublishTabs.init();
		$('.drawer.vertical-left, .drawer.vertical-right').trigger('update.drawer');
	});
	
})(jQuery);

/*-----------------------------------------------------------------------------
	Language strings
-----------------------------------------------------------------------------*/	 

Symphony.Language.add({
	'Untitled Tab': false
});
	

/*-----------------------------------------------------------------------------
	PublishTabs
-----------------------------------------------------------------------------*/

var PublishTabs = {
	
	tab_controls: null,
	new_entry: null,
	
	init: function() {
		var self = this;
		
		// thy shalt not pass if no Publush Tab fields used
		var tab_fields = jQuery('.field-publish_tabs');
		if (!tab_fields.length) return;
		
		jQuery('body').addClass('publish-tabs');
		
		// are we creating a new entry or editing an existing one?
		var env = Symphony.Context.get('env');
		this.new_entry = (env.page === 'new');
		
		var has_invalid_tabs = false;
		this.tab_controls = jQuery('<ul class="tabs"></ul>');
		
		var publish_tabs = Symphony.Context.get('publish-tabs');
		
		for(var i in publish_tabs) {

			var main_fields = '';
			var sidebar_fields = '';
			
			for(field in publish_tabs[i].main) main_fields += '#' + publish_tabs[i].main[field] + ', ';
			for(field in publish_tabs[i].sidebar) sidebar_fields += '#' + publish_tabs[i].sidebar[field] + ', ';
			
			main_fields = main_fields.replace(/, $/,'');
			sidebar_fields = sidebar_fields.replace(/, $/,'');
			
			jQuery(main_fields).wrapAll('<div class="tab-group tab-group-' + publish_tabs[i]['tab_id'] + '"></div>');
			jQuery(sidebar_fields).wrapAll('<div class="tab-group tab-group-' + publish_tabs[i]['tab_id'] + '"></div>');
			
			var tab_field = jQuery('#field-' + publish_tabs[i]['tab_id']).remove();
			var tab_text = (tab_field.text() != '') ? tab_field.text() : Symphony.Language.get('Untitled Tab');
			var tab_button = jQuery('<li class="'+publish_tabs[i]['tab_id']+'">' + tab_text + '</li>');

			this.tab_controls.append(tab_button);
			
			// add click event to tab
			tab_button.bind('click', function() {
				if (jQuery(this).hasClass('selected')) return;
				var tab_class = jQuery(this).attr('class')
					.replace(/invalid/,'')
					.replace(/selected/,'')
					.replace(/ /g,'');
				self.showTab(tab_class);
			});
			
			// find invalid fields
			if (jQuery('.tab-group-' + i + ' .invalid').length) {
				has_invalid_tabs = true;
				tab_button.addClass('invalid').append('<span>!</span>');
			}
			
		}
		
		if (has_invalid_tabs) {
			this.tab_controls.find('li.invalid:first').click();
		} else {
			this.tab_controls.find('li:first').click();
		}
		
		jQuery('#context').append(this.tab_controls);

		var initial_tab = self.getURLParameter('publish-tab');
		if( initial_tab !== undefined ){
			jQuery('.'+initial_tab).trigger('click');
		}
	},
	
	showTab: function(tab) {
		var w = jQuery('#contents').width();
		
		// deselect current tab and select the new tab
		this.tab_controls.find('li.selected').removeClass('selected');
		this.tab_controls.find('li.' + tab).addClass('selected');
		
		// hide current tab group and select new group
		jQuery('.tab-group-selected').removeClass('tab-group-selected');
		jQuery('.tab-group-' + tab).addClass('tab-group-selected');
				
		var invalid_field = jQuery('.tab-group-' + tab + ' .invalid');
		// focus first invalid element
		if (invalid_field.length) {
			invalid_field.eq(0).find('*[name*="fields["]').focus();
		}
		// focus first field in tab when creating a new entry
		else if (this.new_entry) {
			jQuery('.tab-group-' + tab + ' .field:first *[name*="fields["]').focus();
		}
	},

	getURLParameter: function(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	}
	
}

jQuery(document).ready(function() {
	PublishTabs.init();
	jQuery('.drawer.vertical-left, .drawer.vertical-right').trigger('update.drawer');
});

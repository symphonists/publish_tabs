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

	var localStorage = window.localStorage || {};

	window.PublishTabs = {

		tab_controls: null,
		new_entry: false,
		sectionHandle: 'not-found',

		init: function() {
			var self = this;
			var context = $('#context');

			// thy shalt not pass if no Publish Tab fields used
			var tab_fields = $('.field-publish_tabs');
			if (!tab_fields.length) return;

			var body = $('body');

			// isolate the section handle: this is use as a key for local storage
			this.sectionHandle = /section-handle-[^\s]+/g.exec(body.attr('class'))[0];

			body.addClass('publish-tabs');

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

				var $main_fields = $(main_fields);
				var $sidebar_fields = $(sidebar_fields);

				$main_fields.wrapAll('<div class="tab-group tab-group-' + publish_tabs[i]['tab_id'] + '"></div>');
				$sidebar_fields.wrapAll('<div class="tab-group tab-group-' + publish_tabs[i]['tab_id'] + '"></div>');

				var tab_field = $('#field-' + publish_tabs[i]['tab_id']).remove();
				var tab_text = (tab_field.text() != '') ? tab_field.text() : Symphony.Language.get('Untitled Tab');
				var tab_button = $('<li class="tab-'+publish_tabs[i]['tab_id']+'" data-id="'+publish_tabs[i]['tab_id']+'">' + tab_text + '</li>');

				this.tab_controls.append(tab_button);

				// add click event to tab
				tab_button.on('click', function (e) {
					var t = $(this);
					var id = t.attr('data-id');
					if (t.hasClass('selected')) return;
					if (!!id) {
						self.showTab(id);
						// if it's a real user click
						if (!!e.originalEvent) {
							self.saveLocalTab('publish-tab', id);
						}
					}
				});

				// find invalid fields
				if (!!$main_fields.add($sidebar_fields).find('.invalid').length) {
					has_invalid_tabs = true;
					tab_button.addClass('invalid').append('<span class="icon">!</span>');
				}
			}

			// append tags controls
			context.append(this.tab_controls);

			// selected the right tab
			if (has_invalid_tabs) {
				this.tab_controls.find('li.invalid:first').click();
			} else {
				var initial_tab = self.getURLParameter('publish-tab');
				var local_tab = self.getLocalTab('publish-tab');

				var selector = !!initial_tab ? '.' + initial_tab : (!!local_tab ? local_tab : 'li:first');
				this.tab_controls.find(selector).click();
			}
		},

		showTab: function(tab) {
			var w = $('#contents').width();

			// de-select current tab and select the new tab
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
		},

		generateLocalKey: function (name) {
			if (!name) {
				throw new Exception('A name must be given');
			}
			return 'symphony.' + name + '.' + this.sectionHandle;
		},

		getLocalTab: function (name) {
			return localStorage[this.generateLocalKey(name)];
		},

		saveLocalTab: function (name, tab) {
			localStorage[this.generateLocalKey(name)] = '.tab-' + tab;
		}
	};

	$(function() {
		PublishTabs.init();
		$('.drawer.vertical-left, .drawer.vertical-right').trigger('update.drawer');
	});

})(jQuery);
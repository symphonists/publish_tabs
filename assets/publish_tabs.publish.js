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

		init: function() {
			var self = this;
			var context = $('#context');

			// thy shalt not pass if no Publish Tab fields used
			var tab_fields = $('.field-publish_tabs');
			if (!tab_fields.length) return;

			var body = $('body');

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
						self.showTab(t);
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

			// Init - Variables
			var o = {
				tabGroup: '.tab-group',
				secTabGroup: '.secondary.column .tab-group',
				priTabGroup: '.primary.column .tab-group',
				columns: '.two.columns',
				secColumn: '.secondary.column',
				priColumn: '.primary.column',
				contextTabs: '#context .tabs li'
			};

			// Init - Repartition of the divided tabs in the Primary Column
			if($(o.secTabGroup).length){
				$(o.secTabGroup).parents(o.columns).attr('class', '');

				$(o.secTabGroup).each(function(){
					var t = $(this);
					var classes = t.attr('class').split(' ');

					if($(o.priTabGroup+'.'+classes[1]).length) {
						$('> .field, > .field-group', t).each(function(){
							$(this).appendTo(o.priTabGroup+'.'+classes[1]);
						});
					} else {
						var tID = classes[1].replace('tab-group-', '');
						var prev = $(o.contextTabs+'[data-id="'+tID+'"]').prev();

						if(prev.length) {
							$(o.priTabGroup).eq(prev.index()).after(t);
						} else {
							t.prependTo(o.priColumn);
						}
					}
				});

				$(o.secTabGroup).remove();
			}

			// Init - Add a title to each Tab
			$(o.contextTabs).each(function(){
				var t = $(this);
				var tID = t.attr('data-id');
				var title = t.text();
				$(o.priTabGroup+'.tab-group-'+tID).prepend('<h2>'+title+'</h2>');
			});

			// Init Scroll Events
			self.updateTab();
			$(window).on('scroll', function(){
				self.updateTab();
			}).on('resize', function(){
				self.updateTab();
			});
		},

		showTab: function(t) {
			$('html, body').stop().animate({scrollTop: ($('.tab-group').eq(t.index()).offset().top - 159)}, 750);

			return false;
		},

		updateTab: function() {
			var o = {
				tabGroup: '.tab-group',
				contextTabs: '#context .tabs li'
			};
			var win = $(window);
			var pageEnd = $(document).height() - win.height();
			var curScroll = win.scrollTop();

			if(curScroll == 0){
				$(o.contextTabs).removeClass('selected');
				if(win.width() < 1280) $(o.contextTabs + ':first-child').addClass('selected');
				else $(o.contextTabs + ':nth-child(2)').addClass('selected');
			} else if(curScroll == pageEnd){
				$(o.contextTabs).removeClass('selected');
				$(o.contextTabs + ':last-child').addClass('selected');
			} else {
				$(o.tabGroup).each(function(){
					var t = $(this);

					if(curScroll + (win.height() / 2) > t.offset().top) {
						$(o.contextTabs).removeClass('selected');
						$(o.contextTabs).eq(t.index()).addClass('selected');
					}
				});
			}
		},
	};

	$(function() {
		PublishTabs.init();
		$('.drawer.vertical-left, .drawer.vertical-right').trigger('update.drawer');
	});

})(jQuery);

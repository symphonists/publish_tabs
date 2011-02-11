<?php
	
	class extension_publish_tabs extends Extension {
		
		public function about() {
			return array(
				'name'			=> 'Publish Tabs',
				'version'		=> '1.0.1',
				'release-date'	=> '2011-02-11',
				'author'		=> array(
					'name'			=> 'Nick Dunn',
					'website'		=> 'http://nick-dunn.co.uk'
				),
				'description' => 'Add tab groups to entry forms'
			);
		}
		
		public function uninstall() {
			Symphony::Database()->query("DROP TABLE `tbl_fields_publish_tabs`");
		}
		
		public function install() {
			Symphony::Database()->query(
				"CREATE TABLE IF NOT EXISTS `tbl_fields_publish_tabs` (
					`id` int(11) NOT NULL auto_increment,
					`field_id` int(11) NOT NULL,
					PRIMARY KEY (`id`)
				)"
			);
			return true;
		}
		
		public function getSubscribedDelegates() {
			return array(
				array(
					'page'		=> '/backend/',
					'delegate'	=> 'InitaliseAdminPageHead',
					'callback'	=> 'initializeAdmin'
				),
			);
		}
		
		public function initializeAdmin($context) {	
			$page = $context['parent']->Page;
			
			$callback = Administration::instance()->getPageCallback();
			
			// only proceed on New or Edit publish pages
			if ($page instanceof contentPublish and in_array($page->_context['page'], array('new', 'edit'))) {
				
				$page->addStylesheetToHead(URL . '/extensions/publish_tabs/assets/publish_tabs.publish.css', 'screen', 9876543213);
				$page->addScriptToHead(URL . '/extensions/publish_tabs/assets/publish_tabs.publish.js', 987654322);
				
				include_once(TOOLKIT . '/class.sectionmanager.php');
				$sm = new SectionManager(Administration::instance());
				
				$section_id = $sm->fetchIDFromHandle($callback['context']['section_handle']);
				$section = $sm->fetch($section_id);
				
				$tabs = array();
				$current_tab = '';
				
				foreach($section->fetchFieldsSchema() as $i => $field) {
					if ($i == 0 && $field['type'] != 'publish_tabs') $current_tab = 'untitled-tab';
					if ($field['type'] == 'publish_tabs') {
						$current_tab = $field['element_name'];
					} else {
						$tabs[$current_tab][$field['location']][] = 'field-' . $field['id'];
					}
				}
				
				$page->addElementToHead(new XMLElement(
					'script',
					"Symphony.Context.add('publish-tabs', " . json_encode($tabs) . ")",
					array('type' => 'text/javascript')
				), 987654321);
			}
			
		}		
			
	}
?>
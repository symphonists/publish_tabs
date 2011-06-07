<?php
	
	Class fieldPublish_Tabs extends Field{	
		
		function __construct(&$parent){
			parent::__construct($parent);
			$this->_name = __('Publish Tab');
			$this->_required = false;			
			$this->set('hide', 'no');
		}
				
		public function processRawFieldData($data, &$status, $simulate=false, $entry_id=NULL) {	
			$status = self::__OK__;			
			return array(
				'value' => ''
			);			
		}
		
		function commit(){
			if(!parent::commit()) return false;			
			$id = $this->get('id');
			if($id === false) return false;			
			$fields = array();			
			$fields['field_id'] = $id;
			$this->_engine->Database->query("DELETE FROM `tbl_fields_".$this->handle()."` WHERE `field_id` = '$id' LIMIT 1");
			return $this->_engine->Database->insert($fields, 'tbl_fields_' . $this->handle());			
		}
		
		function displayPublishPanel(&$wrapper, $data=NULL, $flagWithError=NULL, $fieldnamePrefix=NULL, $fieldnamePostfix=NULL){
			$wrapper->setAttribute('id', 'tab-' . Lang::createHandle($this->get('label')));
			$wrapper->setValue($this->get('label'));
		}
		
		public function appendFormattedElement(&$wrapper, $data, $encode=false, $mode=NULL) {
	
		}
		
		public function prepareTableValue($data, XMLElement $link=NULL, $entry_id=NULL) {
			
			// build this entry fully
			$em = new EntryManager(Administration::instance());
			$entries = $em->fetch($entry_id);
			
			if ($entries === false) return parent::prepareTableValue(NULL, $link, $entry_id);
			
			$entry = reset($em->fetch($entry_id));
			
			// get the first field inside this tab
			$field_id = Symphony::Database()->fetchVar('id', 0, "SELECT `id` FROM `tbl_fields` WHERE `parent_section` = '".$this->get('parent_section')."' AND `sortorder` = ".($this->get('sortorder') + 1)." ORDER BY `sortorder` LIMIT 1");
			
			if ($field_id === NULL) return parent::prepareTableValue(NULL, $link, $entry_id);
			
			$field = $em->fieldManager->fetch($field_id);
			
			// get the first field's value as a substitude for the tab's return value
			return $field->prepareTableValue($entry->getData($field_id), $link, $entry_id);
		}
				
		public function createTable(){
			
			return $this->Database->query(
			
				"CREATE TABLE IF NOT EXISTS `tbl_entries_data_" . $this->get('id') . "` (
				  `id` int(11) unsigned NOT NULL auto_increment,
				  `entry_id` int(11) unsigned NOT NULL,
				  `value` double default NULL,
				  PRIMARY KEY  (`id`),
				  KEY `entry_id` (`entry_id`),
				  KEY `value` (`value`)
				) TYPE=MyISAM;"
			
			);
		}
						
	}

?>
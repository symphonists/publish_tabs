<?php

	Class fieldPublish_Tabs extends Field{


	/*-------------------------------------------------------------------------
		Definition:
	-------------------------------------------------------------------------*/

		public function __construct(){
			parent::__construct();

			$this->_name = __('Publish Tab');
			$this->_required = false;
			$this->set('hide', 'no');
		}

	/*-------------------------------------------------------------------------
		Setup:
	-------------------------------------------------------------------------*/

		public function createTable(){
			return Symphony::Database()->query(
				"CREATE TABLE IF NOT EXISTS `tbl_entries_data_" . $this->get('id') . "` (
				  `id` int(11) unsigned NOT NULL auto_increment,
				  `entry_id` int(11) unsigned NOT NULL,
				  `value` double default NULL,
				  PRIMARY KEY  (`id`),
				  KEY `entry_id` (`entry_id`),
				  KEY `value` (`value`)
				) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"
			);
		}

	/*-------------------------------------------------------------------------
		Settings:
	-------------------------------------------------------------------------*/

		public function commit(){
			if(!parent::commit()) return false;

			$id = $this->get('id');

			if($id === false) return false;

			$fields = array();
			$fields['field_id'] = $id;

			return FieldManager::saveSettings($id, $fields);
		}

	/*-------------------------------------------------------------------------
		Publish:
	-------------------------------------------------------------------------*/

		public function displayPublishPanel(&$wrapper, $data=NULL, $flagWithError=NULL, $fieldnamePrefix=NULL, $fieldnamePostfix=NULL){
			$wrapper->setValue($this->get('label'));
		}

		public function processRawFieldData($data, &$status, $simulate=false, $entry_id=NULL) {
			$status = self::__OK__;

			return array(
				'value' => ''
			);
		}

	/*-------------------------------------------------------------------------
		Output:
	-------------------------------------------------------------------------*/

		public function appendFormattedElement(&$wrapper, $data, $encode=false, $mode=NULL) {

		}

		public function prepareTableValue($data, XMLElement $link=NULL, $entry_id=NULL) {
			// build this entry fully
			$entries = EntryManager::fetch($entry_id);

			if ($entries === false) return parent::prepareTableValue(NULL, $link, $entry_id);

			$entry = reset(EntryManager::fetch($entry_id));

			// get the first field inside this tab
			$field_id = Symphony::Database()->fetchVar('id', 0, "SELECT `id` FROM `tbl_fields` WHERE `parent_section` = '".$this->get('parent_section')."' AND `sortorder` = ".($this->get('sortorder') + 1)." ORDER BY `sortorder` LIMIT 1");

			if ($field_id === NULL) return parent::prepareTableValue(NULL, $link, $entry_id);

			$field = FieldManager::fetch($field_id);

			// get the first field's value as a substitude for the tab's return value
			return $field->prepareTableValue($entry->getData($field_id), $link, $entry_id);
		}

	}

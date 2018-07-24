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
			return false;
		}

		public function requiresTable()
		{
			return false;
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

		public function displayPublishPanel(XMLElement &$wrapper, $data = NULL, $flagWithError = NULL, $fieldnamePrefix = NULL, $fieldnamePostfix = NULL, $entry_id = NULL){
			$wrapper->setValue($this->get('label'));
		}

		public function processRawFieldData($data, &$status, &$message = NULL, $simulate = false, $entry_id = NULL) {
			$status = self::__OK__;

			return array(
				'value' => ''
			);
		}

	/*-------------------------------------------------------------------------
		Output:
	-------------------------------------------------------------------------*/

		public function fetchIncludableElements() {
			return null;
		}

		public function appendFormattedElement(XMLElement &$wrapper, $data, $encode = false, $mode = NULL, $entry_id = NULL) {

		}

		public function prepareReadableValue($data, $entry_id = null, $truncate = false, $defaultValue = null) {
			return $this->prepareTableValue($data, null, $entry_id);
		}

		public function prepareTableValue($data, XMLElement $link = null, $entry_id = null) {
			if (!$entry_id) {
				return;
			}
			// Fetch entry
			$entry = (new EntryManager)
				->select([])
				->projection(['e.id'])
				->disableDefaultSort()
				->entry($entry_id)
				->section($this->get('parent_section'))
				->execute()
				->next();

			if (!$entry) {
				return parent::prepareTableValue(null, $link, $entry_id);
			}
			// build this entry fully
			$entry = (new EntryManager)
				->select()
				->entry($entry_id)
				->section($this->get('parent_section'))
				->includeAllfields()
				->execute()
				->next();

			// get the first field inside this tab
			$field_id = Symphony::Database()
				->select(['id'])
				->from('tbl_fields')
				->where(['parent_section' => $this->get('parent_section')])
				->where(['sortorder' => ['>' => $this->get('sortorder')]])
				->where(['show_column' => 'yes'])
				->where(['id' => ['!=' => $this->get('id')]])
				->orderBy('sortorder')
				->limit(1)
				->execute()
				->variable('id');

			if (!$field_id) {
				return parent::prepareTableValue(null, $link, $entry_id);
			}

			$field = (new FieldManager)
				->select()
				->field($field_id)
				->execute()
				->next();

			// get the first field's value as a substitute for the tab's return value
			return $field->prepareTableValue($entry->getData($field_id), $link, $entry_id);
		}

	}

# Publish Tabs
 
Version: 0.9.1   
Author: Nick Dunn  
Build Date: 2010-09-04  
Requirements: Symphony 2.2*

*** NOTE** this extension requires as-yet unreleased Symphony 2.2 which will contain a simple update to Symphony's HTML output that makes this stuff possible. To try it out on pre-2.2 builds you'll need this core code change: <http://github.com/nickdunn/symphony-2/commit/95c006206542076f9f483c53b7a1a327ef314eac>

## Purpose
Do you have a gazillion fields in your section and the entry form has become too complex? Do you yearn for simplicity and the ability to arrange fields into logical groups? This extension allows you to do just that, and displays groups of fields as tabs.

## Installation
 
1. Upload the 'publish_tabs' folder in this archive to your Symphony 'extensions' folder
2. Enable it by selecting "Publish Tabs" in the list, choose Enable from the with-selected menu, then click Apply
3. When creating or editing a section you can add the "Publish Tab" field


## Usage

Add one or more Publish Tab field(s) to a section. Give each a sensible label. Save.

When you add a Publish Tab field to a section, any fields that appear *after* this field in the field order will become part of that tab (both left and right columns). For this reason you should make sure that the first field in your section is a Publish Tab, else a tab named "Untitled Tab" will be added for you when the form is displayed.

## Changelog

* **0.9.1** Fixes issue where title could not be created on publish form
* **0.9** Initial public release
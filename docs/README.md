# Documentation

This is the developer documentation for this project. Here you will find the code, commented with explanations.

## Contents:

* ### Project files

  * [brunch-config.js](https://github.com/sc0ttj/Project/blob/jdi/docs/brunch-config.js.md)

* ### Main app

  * [app.js](https://github.com/sc0ttj/Project/blob/jdi/docs/app/js/app.js.md)

* ### CMS 

  * [cms.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/cms.js.md)

  * #### CMS Modules

    * [ajaxer.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/ajaxer.js.md)
    * [export_manager.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/export_manager.js.md)
    * [file_manager.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/file_manager.js.md)
    * [image_manager.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/image_manager.js.md)
    * [meta_manager.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/meta_manager.js.md)
    * [modal.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/modal.js.md)
    * [page_editor.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/page_editor.js.md)
    * [preview_manager.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/preview_manager.js.md)
    * [section_manager.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/section_manager.js.md)
    * [templater.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/templater.js.md)
    * [translation_manager.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/translation_manager.js.md)
    * [ui.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/ui.js.md)
    * [video_manager.js](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/video_manager.js.md)

### Test Suite

  * [_phantom_runner.js](https://github.com/sc0ttj/Project/blob/jdi/docs/test/js/_phantom_runner.js.md)
  * [test_runner.js](https://github.com/sc0ttj/Project/blob/jdi/docs/test/js/test_runner.js.md)
  * [tests.js](https://github.com/sc0ttj/Project/blob/jdi/docs/test/js/tests.js.md)

### Templates

  The templating system used is [Mustache.js](https://github.com/janl/mustache.js).  
  Templates are in `src/app/templates/*.tmpl`, with corresponding styles in `src/app/css/*.scss`.  
      
  Each template is a collection of re-usable page elements, behaviours  and styles. For example, a template might provide a 'full width video' or 'fixed background image'.  

  * The templates are used at build time by Brunch to build `src/app/assets/index.html` (brunch will use Mustache).
  * Templates are also used by the [Section Manager](https://github.com/sc0ttj/Project/blob/jdi/docs/cms/js/modules/section_manager.js.md) in the CMS when adding new sections to the page.  
  
  
---
  
#### About These Docs:

These docs were generated using [JDI](https://github.com/alexanderGugel/jdi)

The recommended way to install jdi is via npm:

`npm i jdi -g`

To build these docs, add markdown in your code comments, then run:

```
jdi brunch-config.js
jdi src/app/js/app.js
jdi src/cms/js/cms.js
jdi src/cms/js/cms/modules/*.js
jdi src/test/js/*.js
etc
```

Then copy the generated `.md` files to the relevant place in the `docs/` directory.
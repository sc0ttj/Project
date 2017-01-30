var $ = require('cash-dom');
var self;

"use strict";

module.exports = {
  init: function(){
    self = this;
  },

  showUI: function () {
    var form        = '',
        $meta       = $('head').find('meta[name^="title"], meta[name^="description"], meta[name^="author"], meta[name^="keywords"], meta[name^="news_keywords"], meta[name^="copyright"]'),
        $twitter    = $('head').find('meta[name^="twitter"]'),
        $facebook   = $('head').find('meta[property]'),
        $googleplus = $('head').find('meta[itemprop]');

    var addMetaSection = function (title, $list){
      var type = 'name';

      if (title === 'Facebook'){
        type = 'property';
      } else if (title === 'Google+') {
        type = 'itemprop';
      }

      form += '<h3 class="cms-meta-group-header">'+title+'</h3>\n\r';
 
      $list.each(function (el) {
        var metaKey     = el.attributes[0].nodeValue,
            metaValue   = el.attributes[1].nodeValue;
        form += '\
        <label>\n\r\
          <p class="cms-meta-key">'+metaKey+'</p>\n\r\
          <input data-type="'+type+'" name="'+metaKey+'" class="cms-meta-value" type="text" value="'+metaValue+'" size="25" />\n\r\
        </label>\n\r';
      });

    };

    form = '<form name="cms-meta-form" class="cms-meta-form" action="" method="POST">\n\r';
    addMetaSection('Meta Info', $meta);
    addMetaSection('Twitter', $twitter);
    addMetaSection('Facebook', $facebook);
    addMetaSection('Google+', $googleplus);
    form += '</form>\n\r';
    
    // load modal
    cms.modal.create({
      title: 'Edit Meta Info',
      contents: form
    });
    cms.modal.show();

    self.addEventHandlers();

  },

  addEventHandlers: function (e) {
    $('input.cms-meta-value').on('change', function updateMetaField(){
      var attr      = $(this).data('type'),
          metaKey   = $(this).attr('name'),
          metaValue = $(this).val();

      self.updateMeta(attr, metaKey, metaValue);
    });
  },

  updateMeta: function (attr, key, value) {
    var elemToUpdate = $('head').find('meta['+attr+'^="'+key+'"]');

    if (key === 'title'){
      //update <title> in <head>
      $('head title').text(value);
    }

    if (value) {
      $(elemToUpdate).attr('content', value);
    } else {
      $(elemToUpdate).attr('content', '');
    }
  },

}
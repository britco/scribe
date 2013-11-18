define([
  './plugins/core/formatters',
  './plugins/core/patches',
  './api',
  './api/undo-manager'
], function (
  formatters,
  patches,
  api
) {

  'use strict';

  function Editable(el) {
    this.el = el;
    this.commands = {};

    this.el.setAttribute('contenteditable', true);

    this.use(patches.boldCommand());
    this.use(patches.emptyEditorWhenDeleting());
    this.use(patches.rootParagraphElement());
    // TODO: pair with undoManager?
    this.use(patches.undoCommand());

    this.use(formatters());

    this.undoManager = new api.UndoManager();

    this.el.addEventListener('input', function () {
      this.undoManager.push(this.getHTML());
    }.bind(this), false);
  }

  // For plugins
  // TODO: tap combinator?
  Editable.prototype.use = function (fn) {
    fn(this);
    return this;
  };


  Editable.prototype.getHTML = function () {
    var selection = new api.Selection();

    selection.placeMarkers();
    var html = this.el.innerHTML;
    selection.removeMarkers(this.el);

    return html;
  };

  Editable.prototype.setHTML = function (html) {
    this.undoManager.push(this.getHTML());
    this.el.innerHTML = html;
  };

  Editable.prototype.text = function () {
    return this.el.textContent.trim();
  };

  return Editable;

});

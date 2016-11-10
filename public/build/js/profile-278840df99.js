/*!
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2015
 * @version 4.1.5
 *
 * File input styled for Bootstrap 3.0 that utilizes HTML5 File Input's advanced 
 * features including the FileReader API. 
 * 
 * The plugin drastically enhances the HTML file input to preview multiple files on the client before
 * upload. In addition it provides the ability to preview content of images, text, videos, audio, html, 
 * flash and other objects. It also offers the ability to upload and delete files using AJAX, and add 
 * files in batches (i.e. preview, append, or remove before upload).
 * 
 * Author: Kartik Visweswaran
 * Copyright: 2015, Kartik Visweswaran, Krajee.com
 * For more JQuery plugins visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */
(function ($) {
    var isIE = function(ver) {
            var div = document.createElement("div"), status;
            div.innerHTML = "<!--[if IE " + ver + "]><i></i><![endif]-->";
            status = (div.getElementsByTagName("i").length == 1);
            document.body.appendChild(div);
            div.parentNode.removeChild(div);
            return status;
        },
        hasFileAPISupport = function () {
            return window.File && window.FileReader;
        },
        hasDragDropSupport = function() {
            var $div = document.createElement('div');
            return !isIE(9) && (('draggable' in $div) || ('ondragstart' in $div && 'ondrop' in $div));
        },
        hasFileUploadSupport = function () {
            return hasFileAPISupport && window.FormData;
        },
        addCss = function($el, css) {
            $el.removeClass(css).addClass(css);
        },
        STYLE_SETTING = 'style="width:{width};height:{height};"',
        OBJECT_PARAMS = '      <param name="controller" value="true" />\n' +
            '      <param name="allowFullScreen" value="true" />\n' +
            '      <param name="allowScriptAccess" value="always" />\n' +
            '      <param name="autoPlay" value="false" />\n' +
            '      <param name="autoStart" value="false" />\n'+
            '      <param name="quality" value="high" />\n',
        DEFAULT_PREVIEW = '<div class="file-preview-other">\n' +
            '       <i class="glyphicon glyphicon-file"></i>\n' +
            '   </div>';

    var defaultFileActionSettings = {
        removeIcon: '<i class="glyphicon glyphicon-trash text-danger"></i>',
        removeClass: 'btn btn-xs btn-default',
        removeTitle: 'Remove file',
        uploadIcon: '<i class="glyphicon glyphicon-upload text-info"></i>',
        uploadClass: 'btn btn-xs btn-default',
        uploadTitle: 'Upload file',
        indicatorNew: '<i class="glyphicon glyphicon-hand-down text-warning"></i>',
        indicatorSuccess: '<i class="glyphicon glyphicon-ok-sign file-icon-large text-success"></i>',
        indicatorError: '<i class="glyphicon glyphicon-exclamation-sign text-danger"></i>',
        indicatorLoading: '<i class="glyphicon glyphicon-hand-up text-muted"></i>',
        indicatorNewTitle: 'Not uploaded yet',
        indicatorSuccessTitle: 'Uploaded',
        indicatorErrorTitle: 'Upload Error',
        indicatorLoadingTitle: 'Uploading ...'
    };
    var defaultLayoutTemplates = {
        main1: '{preview}\n' +
        '<div class="kv-upload-progress hide"></div>\n' +
        '<div class="input-group {class}">\n' +
        '   {caption}\n' +
        '   <div class="input-group-btn">\n' +
        '       {remove}\n' +
        '       {cancel}\n' +
        '       {upload}\n' +
        '       {browse}\n' +
        '   </div>\n' +
        '</div>',
        main2: '{preview}\n<div class="kv-upload-progress hide"></div>\n{remove}\n{cancel}\n{upload}\n{browse}\n',
        preview: '<div class="file-preview {class}">\n' +
        '    <div class="close fileinput-remove">&times;</div>\n' +
        '    <div class="{dropClass}">\n' +
        '    <div class="file-preview-thumbnails">\n' +
        '    </div>\n' +
        '    <div class="clearfix"></div>' +
        '    <div class="file-preview-status text-center text-success"></div>\n' +
        '    <div class="kv-fileinput-error"></div>\n' +
        '    </div>\n' +
        '</div>',
        icon: '<span class="glyphicon glyphicon-file kv-caption-icon"></span>',
        caption: '<div tabindex="-1" class="form-control file-caption {class}">\n' +
        '   <span class="file-caption-ellipsis">&hellip;</span>\n' +
        '   <div class="file-caption-name"></div>\n' +
        '</div>',
        modal: '<div id="{id}" class="modal fade">\n' +
        '  <div class="modal-dialog modal-lg">\n' +
        '    <div class="modal-content">\n' +
        '      <div class="modal-header">\n' +
        '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n' +
        '        <h3 class="modal-title">Detailed Preview <small>{title}</small></h3>\n' +
        '      </div>\n' +
        '      <div class="modal-body">\n' +
        '        <textarea class="form-control" style="font-family:Monaco,Consolas,monospace; height: {height}px;" readonly>{body}</textarea>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>',
        progress: '<div class="progress">\n' +
        '    <div class="progress-bar progress-bar-success progress-bar-striped text-center" role="progressbar" aria-valuenow="{percent}" aria-valuemin="0" aria-valuemax="100" style="width:{percent}%;">\n' +
        '        {percent}%\n' +
        '     </div>\n' +
        '</div>',
        footer: '<div class="file-thumbnail-footer">\n' +
        '    <div class="file-caption-name" style="width:{width}">{caption}</div>\n' +
        '    {actions}\n' +
        '</div>',
        actions: '<div class="file-actions">\n' +
        '    <div class="file-footer-buttons">\n' +
        '        {upload}{delete}{other}' +
        '    </div>\n' +
        '    <div class="file-upload-indicator" tabindex="-1" title="{indicatorTitle}">{indicator}</div>\n' +
        '    <div class="clearfix"></div>\n' +
        '</div>',
        actionDelete: '<button type="button" class="kv-file-remove {removeClass}" title="{removeTitle}"{dataUrl}{dataKey}>{removeIcon}</button>\n',
        actionUpload: '<button type="button" class="kv-file-upload {uploadClass}" title="{uploadTitle}">{uploadIcon}</button>\n'
    };
    var defaultPreviewTypes = ['image', 'html', 'text', 'video', 'audio', 'flash', 'object'];
    var defaultPreviewTemplates = {
        generic: '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n' +
        '   {content}\n' +
        '   {footer}\n' +
        '</div>\n',
        html: '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n' +
        '    <object data="{data}" type="{type}" width="{width}" height="{height}">\n' +
        '       ' + DEFAULT_PREVIEW + '\n' +
        '    </object>\n' +
        '   {footer}\n' +
        '</div>',
        image: '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n' +
        '   <img src="{data}" class="file-preview-image" title="{caption}" alt="{caption}" ' + STYLE_SETTING + '>\n' +
        '   {footer}\n' +
        '</div>\n',
        text: '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n' +
        '   <div class="file-preview-text" title="{caption}" ' + STYLE_SETTING + '>\n' +
        '       {data}\n' +
        '   </div>\n' +
        '   {footer}\n' +
        '</div>\n',
        video: '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + STYLE_SETTING + '>\n' +
        '   <video width="{width}" height="{height}" controls>\n' +
        '       <source src="{data}" type="{type}">\n' +
        '       ' + DEFAULT_PREVIEW + '\n' +
        '   </video>\n' +
        '   {footer}\n' +
        '</div>\n',
        audio: '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + STYLE_SETTING + '>\n' +
        '   <audio controls>\n' +
        '       <source src="{data}" type="{type}">\n' +
        '       ' + DEFAULT_PREVIEW + '\n' +
        '   </audio>\n' +
        '   {footer}\n' +
        '</div>\n',
        flash: '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + STYLE_SETTING + '>\n' +
        '   <object type="application/x-shockwave-flash" width="{width}" height="{height}" data="{data}">\n' +
        OBJECT_PARAMS + '       ' + DEFAULT_PREVIEW + '\n' +
        '   </object>\n' +
        '   {footer}\n' +
        '</div>\n',
        object: '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + STYLE_SETTING + '>\n' +
        '    <object data="{data}" type="{type}" width="{width}" height="{height}">\n' +
        '      <param name="movie" value="{caption}" />\n' +
        OBJECT_PARAMS + '           ' + DEFAULT_PREVIEW + '\n' +
        '   </object>\n' +
        '   {footer}\n' +
        '</div>',
        other: '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + STYLE_SETTING + '>\n' +
        '   ' + DEFAULT_PREVIEW + '\n' +
        '   {footer}\n' +
        '</div>',
    };
    var defaultPreviewSettings = {
        image: {width: "auto", height: "160px"},
        html: {width: "213px", height: "160px"},
        text: {width: "160px", height: "160px"},
        video: {width: "213px", height: "160px"},
        audio: {width: "213px", height: "80px"},
        flash: {width: "213px", height: "160px"},
        object: {width: "160px", height: "160px"},
        other: {width: "160px", height: "160px"}
    };
    var defaultFileTypeSettings = {
        image: function(vType, vName) {
            return (typeof vType !== "undefined") ? vType.match('image.*') : vName.match(/\.(gif|png|jpe?g)$/i);
        },
        html: function(vType, vName) {
            return (typeof vType !== "undefined") ? vType == 'text/html' : vName.match(/\.(htm|html)$/i);
        },
        text: function(vType, vName) {
            return typeof vType !== "undefined" && vType.match('text.*') || vName.match(/\.(txt|md|csv|nfo|php|ini)$/i);
        },
        video: function (vType, vName) {
            return typeof vType !== "undefined" && vType.match(/\.video\/(ogg|mp4|webm)$/i) || vName.match(/\.(og?|mp4|webm)$/i);
        },
        audio: function (vType, vName) {
            return typeof vType !== "undefined" && vType.match(/\.audio\/(ogg|mp3|wav)$/i) || vName.match(/\.(ogg|mp3|wav)$/i);
        },
        flash: function (vType, vName) {
            return typeof vType !== "undefined" && vType == 'application/x-shockwave-flash' || vName.match(/\.(swf)$/i);
        },
        object: function (vType, vName) {
            return true;
        },
        other: function (vType, vName) {
            return true;
        },
    };
    var isEmpty = function (value, trim) {
            return value === null || value === undefined || value == []
            || value === '' || trim && $.trim(value) === '';
        },
        isArray = function (a) {
            return Array.isArray(a) || Object.prototype.toString.call(a) === '[object Array]';
        },
        isSet = function (needle, haystack) {
            return (typeof haystack == 'object' && needle in haystack);
        },
        getValue = function (options, param, value) {
            return (isEmpty(options) || isEmpty(options[param])) ? value : options[param];
        },
        getElement = function (options, param, value) {
            return (isEmpty(options) || isEmpty(options[param])) ? value : $(options[param]);
        },
        uniqId = function () {
            return Math.round(new Date().getTime() + (Math.random() * 100));
        },
        htmlEncode = function(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        },
        vUrl = window.URL || window.webkitURL;

    var FileInput = function (element, options) {
        this.$element = $(element);
        if (hasFileAPISupport() || isIE(9)) {
            this.init(options);
            this.listen();
        } else {
            this.$element.removeClass('file-loading');
        }
    };

    FileInput.prototype = {
        constructor: FileInput,
        init: function (options) {
            var self = this, $el = self.$element;
            for (key in options) {
                self[key] = options[key];
            }
            if (isEmpty(self.allowedPreviewTypes)) {
                self.allowedPreviewTypes = defaultPreviewTypes;
            }
            self.uploadFileAttr = !isEmpty($el.attr('name')) ? $el.attr('name') : 'file_data';
            self.reader = null;
            self.formdata = {};
            self.isIE9 = isIE(9);
            self.isIE10 = isIE(10);
            self.filestack = [];
            self.ajaxRequests = [];
            self.isError = false;
            self.dropZoneEnabled = hasDragDropSupport() && self.dropZoneEnabled;
            self.isDisabled = self.$element.attr('disabled') || self.$element.attr('readonly');
            self.isUploadable = hasFileUploadSupport && !isEmpty(self.uploadUrl);
            self.slug = typeof options.slugCallback == "function" ? options.slugCallback : self.slugDefault;
            self.mainTemplate = self.showCaption ? self.getLayoutTemplate('main1') : self.getLayoutTemplate('main2');
            self.captionTemplate = self.getLayoutTemplate('caption');
            self.previewGenericTemplate = self.getPreviewTemplate('generic');
            if (isEmpty(self.$element.attr('id'))) {
                self.$element.attr('id', uniqId());
            }
            if (typeof self.$container == 'undefined') {
                self.$container = self.createContainer();
            } else {
                self.refreshContainer();
            }
            self.$progress = self.$container.find('.kv-upload-progress');
            self.$btnUpload = self.$container.find('.kv-fileinput-upload')
            self.$captionContainer = getElement(options, 'elCaptionContainer', self.$container.find('.file-caption'));
            self.$caption = getElement(options, 'elCaptionText', self.$container.find('.file-caption-name'));
            self.$previewContainer = getElement(options, 'elPreviewContainer', self.$container.find('.file-preview'));
            self.$preview = getElement(options, 'elPreviewImage', self.$container.find('.file-preview-thumbnails'));
            self.$previewStatus = getElement(options, 'elPreviewStatus', self.$container.find('.file-preview-status'));
            self.$errorContainer = getElement(options, 'elErrorContainer', self.$previewContainer.find('.kv-fileinput-error'));
            if (!isEmpty(self.msgErrorClass)) {
                addCss(self.$errorContainer, self.msgErrorClass);
            }
            self.$errorContainer.hide();
            self.initialPreviewContent = '';
            var content = self.initialPreview;
            self.initialPreviewCount = isArray(content) ? content.length : (content.length > 0 ? content.split(self.initialPreviewDelimiter).length : 0);
            self.fileActionSettings = $.extend(defaultFileActionSettings, options.fileActionSettings);
            self.previewInitId = "preview-" + uniqId();
            self.initPreview();
            self.initPreviewDeletes();
            self.original = {
                preview: self.$preview.html(),
                caption: self.$caption.html()
            };
            self.options = options;
            self.setFileDropZoneTitle();
            self.uploadCount = 0;
            self.uploadPercent = 0;
            self.$element.removeClass('file-loading');
            self.setEllipsis();
        },
        raise: function(event) {
            var self = this;
            if (arguments.length > 1) {
                self.$element.trigger(event, arguments[1]);
            } else {
                self.$element.trigger(event);
            }
        },
        getLayoutTemplate: function(t) {
            var self = this;
            return isSet(t, self.layoutTemplates) ? self.layoutTemplates[t] : defaultLayoutTemplates[t];
        },
        getPreviewTemplate: function(t) {
            var self = this;
            return isSet(t, self.previewTemplates) ? self.previewTemplates[t] : defaultPreviewTemplates[t];
        },
        getOutData: function () {
            var self = this, jqXHR = arguments.length > 0 ? arguments[0] : {},
                responsedata = arguments.length > 1 ? arguments[1] : {},
                filesdata = arguments.length > 2 ? arguments[2] : self.filestack;
            return {
                form: self.formdata,
                files: filesdata,
                extra: self.getExtraData(),
                response: responsedata,
                reader: self.reader,
                jqXHR: jqXHR
            };
        },
        setEllipsis: function() {
            var self = this, $ellipsis = self.$captionContainer.find('.file-caption-ellipsis'), $cap = self.$caption,
                $div = $cap.clone().css('height', 'auto').hide();
            self.$captionContainer.parent().before($div);
            if ($div.outerWidth() > $cap.outerWidth()) {
               $ellipsis.show();
            } else {
               $ellipsis.hide();
            }
            $div.remove();
        },
        listen: function () {
            var self = this, $el = self.$element, $cap = self.$captionContainer, $btnFile = self.$btnFile;
            $el.on('change', $.proxy(self.change, self));
            $(window).on('resize', function() {
                self.setEllipsis();
            });
            $btnFile.off('click').on('click', function (ev) {
                self.raise('filebrowse');
                if (self.isError && !self.isUploadable) {
                    self.clear(false);
                }
                $cap.focus();
            });
            $el.closest('form').off('reset').on('reset', $.proxy(self.reset, self));
            self.$container.off('click')
                .on('click', '.fileinput-remove:not([disabled])', $.proxy(self.clear, self))
                .on('click', '.fileinput-cancel', $.proxy(self.cancel, self));
            if (self.isUploadable && self.dropZoneEnabled && self.showPreview) {
                self.initDragDrop();
            }
            if (!self.isUploadable) {
                return;
            }
            self.$container.find('.kv-fileinput-upload').off('click').on('click', function(e) {
                if (!self.isUploadable) {
                    return;
                }
                e.preventDefault();
                var totLen = self.getFileStack().length;
                if (self.isDisabled || $(this).hasClass('disabled') || !isEmpty($(this).attr('disabled')) || totLen == 0) {
                    return;
                }
                self.resetUpload();
                self.$progress.removeClass('hide');
                self.uploadCount = 0;
                self.uploadPercent = 0;
                var i, len = self.filestack.length, template = self.getLayoutTemplate('progress');
                self.lock();
                self.setProgress(0);
                if ((self.uploadAsync || totLen == 1) && self.showPreview) {
                    var outData = self.getOutData();
                    self.raise('filebatchpreupload', [outData]);
                    for (i = 0; i < len; i++) {
                        if (self.filestack[i] !== undefined) {
                            self.upload(i, self.getFileStack(), true);
                        }
                    }
                    setTimeout(function() {
                        $(document).ajaxStop(function() {
                            self.setProgress(100);
                            self.$preview.find('file-preview-frame').removeClass('file-loading');
                            self.unlock();
                            self.clearFileInput();
                            self.raise('filebatchuploadcomplete', [self.filestack, self.getExtraData()]);
                        });
                    }, 100);
                    return;
                }
                self.uploadBatch();
            });
        },
        setProgress: function(percent) {
            var self = this, template = self.getLayoutTemplate('progress'), pct = Math.min(percent, 100);
            self.$progress.html(template.replace(/\{percent\}/g, pct));
        },
        lock: function() {
            var self = this;
            self.resetErrors();
            self.disable();
            if (self.showRemove) {
                addCss(self.$container.find('.fileinput-remove'), 'hide');
            }
            if (self.showCancel) {
                self.$container.find('.fileinput-cancel').removeClass('hide');
            }
            self.raise('filelock', [self.filestack, self.getExtraData()]);
        },
        unlock: function() {
            var self = this;
            self.enable();
            if (self.showCancel) {
                addCss(self.$container.find('.fileinput-cancel'), 'hide');
            }
            if (self.showRemove) {
                self.$container.find('.fileinput-remove').removeClass('hide');
            }
            self.raise('fileunlock', [self.filestack, self.getExtraData()]);
        },
        refresh: function (options) {
            var self = this, $el = self.$element,
                params = (arguments.length) ? $.extend(self.options, options) : self.options;
            $el.off();
            self.init(params);
            var $zone = self.$container.find('.file-drop-zone');
            $zone.off('dragenter dragover drop');
            $(document).off('dragenter dragover drop');
            self.listen();
            self.setFileDropZoneTitle();
        },
        initDragDrop: function() {
            var self = this, $zone = self.$container.find('.file-drop-zone');
            $zone.off('dragenter dragover drop');
            $(document).off('dragenter dragover drop');
            $zone.on('dragenter dragover', function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (self.isDisabled) {
                    return;
                }
                addCss($(this), 'highlighted');
            });
            $zone.on('dragleave', function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (self.isDisabled) {
                    return;
                }
                $(this).removeClass('highlighted');
            });
            $zone.on('drop', function (e) {
                e.preventDefault();
                if (self.isDisabled) {
                    return;
                }
                self.change(e, 'dragdrop');
                $(this).removeClass('highlighted');
            });
            $(document).on('dragenter dragover drop', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
        },
        setFileDropZoneTitle: function() {
            var self = this, $zone = self.$container.find('.file-drop-zone');
            $zone.find('.' + self.dropZoneTitleClass).remove();
            if (!self.isUploadable || !self.showPreview ||
                $zone.length == 0 || self.getFileStack().length > 0 ||
                !self.dropZoneEnabled) {
                return;
            }
            if ($zone.find('.file-preview-frame').length == 0) {
                $zone.prepend('<div class="' + self.dropZoneTitleClass + '">' + self.dropZoneTitle + '</div>');
            }
            self.$container.removeClass('file-input-new');
            addCss(self.$container, 'file-input-ajax-new');
        },
        initFileActions: function() {
            var self = this;
            self.$preview.find('.kv-file-remove').each(function() {
                var $el = $(this), $frame = $el.closest('.file-preview-frame'),
                    ind = $frame.attr('data-fileindex');
                $el.off('click').on('click', function() {
                    $frame.fadeOut('slow', function() {
                        self.filestack[ind] = undefined;
                        self.clearObjects($frame);
                        $frame.remove();
                        var filestack = self.getFileStack(), len = filestack.length,
                            chk = self.$container.find('.file-preview-initial').length;
                        if (len == 0 && chk == 0) {
                            self.original.preview = '';
                            self.reset();
                        } else {
                            var n = self.initialPreviewCount + len,
                                cap = n > 1 ? self.msgSelected.replace(/\{n\}/g, n) : filestack[0].name;
                            self.setCaption(cap);
                        }
                    });
                });
            });
            self.$preview.find('.kv-file-upload').each(function() {
                var $el = $(this);
                $el.off('click').on('click', function() {
                    var $frame = $el.closest('.file-preview-frame'),
                        ind = $frame.attr('data-fileindex');
                    self.upload(ind, self.filestack);
                });
            });
        },
        renderInitFileFooter: function(i) {
            var self = this, hasConfig = self.initialPreviewConfig.length > 0,
                template = self.getLayoutTemplate('footer');
            if (hasConfig && !isEmpty(self.initialPreviewConfig[i])) {
                var config = self.initialPreviewConfig[i],
                    caption = ('caption' in config) ? config.caption : '',
                    width = ('width' in config) ? config.width : 'auto',
                    url = ('url' in config) ? config.url : false,
                    key = ('key' in config) ? config.key : null,
                    disabled = url === false ? true : false,
                    actions = self.initialPreviewShowDelete ? self.renderFileActions(false, true, disabled, url, key) : '',
                    footer = template.replace(/\{actions\}/g, actions);
                return footer.replace(/\{caption\}/g, caption).replace(/\{width\}/g, width)
                    .replace(/\{indicator\}/g, '').replace(/\{indicatorTitle\}/g, '');
            }
            return '';
        },
        renderFileFooter: function(caption, width) {
            var self = this, config = self.fileActionSettings,
                template = self.getLayoutTemplate('footer');
            if (self.isUploadable) {
                var footer = template.replace(/\{actions\}/g, self.renderFileActions(true, true, false, false, false));
                return footer.replace(/\{caption\}/g, caption).replace(/\{width\}/g, width)
                    .replace(/\{indicator\}/g, config.indicatorNew).replace(/\{indicatorTitle\}/g, config.indicatorNewTitle);
            } else {
                return template.replace(/\{actions\}/g, '').replace(/\{caption\}/g, caption).replace(/\{width\}/g, width)
                    .replace(/\{indicator\}/g, '').replace(/\{indicatorTitle\}/g, '');
            }
            return '';
        },
        renderFileActions: function(showUpload, showDelete, disabled, url, key) {
            if (!showUpload && !showDelete) {
                return '';
            }
            var self = this,
                vUrl = url == false ? '' : ' data-url="' + url + '"',
                vKey = key == false ? '' : ' data-key="' + key + '"',
                btnDelete = self.getLayoutTemplate('actionDelete'),
                btnUpload = '',
                template = self.getLayoutTemplate('actions'),
                otherActionButtons = self.otherActionButtons.replace(/\{dataKey\}/g, vKey),
                config = self.fileActionSettings,
                removeClass = disabled ? config.removeClass + ' disabled' : config.removeClass;
            btnDelete = btnDelete
                .replace(/\{removeClass\}/g, removeClass)
                .replace(/\{removeIcon\}/g, config.removeIcon)
                .replace(/\{removeTitle\}/g, config.removeTitle)
                .replace(/\{dataUrl\}/g, vUrl)
                .replace(/\{dataKey\}/g, vKey);
            if (showUpload) {
                btnUpload = self.getLayoutTemplate('actionUpload')
                    .replace(/\{uploadClass\}/g, config.uploadClass)
                    .replace(/\{uploadIcon\}/g, config.uploadIcon)
                    .replace(/\{uploadTitle\}/g, config.uploadTitle);
            }
            return template
                .replace(/\{delete\}/g, btnDelete)
                .replace(/\{upload\}/g, btnUpload)
                .replace(/\{other\}/g, otherActionButtons);
        },
        getInitialPreview: function(template, content, i) {
            var self = this, ind = 'init_' + i,
                previewId = self.previewInitId + '-' + ind;
            footer = self.renderInitFileFooter(i, false);
            return template
                .replace(/\{previewId\}/g, previewId)
                .replace(/\{frameClass\}/g, ' file-preview-initial')
                .replace(/\{fileindex\}/g, ind)
                .replace(/\{content\}/g, content)
                .replace(/\{footer\}/g, footer);
        },
        initPreview: function () {
            var self = this, html = '', content = self.initialPreview, len = self.initialPreviewCount,
                cap = self.initialCaption.length, previewId = self.previewInitId + '-init_' + i;
            caption = (cap > 0) ? self.initialCaption : self.msgSelected.replace(/\{n\}/g, len);
            if (isArray(content) && len > 0) {
                for (var i = 0; i < len; i++) {
                    html += self.getInitialPreview(self.previewGenericTemplate, content[i], i);
                }
                if (len > 1 && cap == 0) {
                    caption = self.msgSelected.replace(/\{n\}/g, len);
                }
            } else {
                if (len > 0) {
                    var fileList = content.split(self.initialPreviewDelimiter);
                    for (var i = 0; i < len; i++) {
                        html += self.getInitialPreview(self.previewGenericTemplate, content[i], i);
                    }
                    if (len > 1 && cap == 0) {
                        caption = self.msgSelected.replace(/\{n\}/g, len);
                    }
                } else {
                    if (cap > 0) {
                        self.setCaption(caption);
                        return;
                    } else {
                        return;
                    }
                }
            }
            self.initialPreviewContent = html;
            self.$preview.html(html);
            self.setCaption(caption);
            self.$container.removeClass('file-input-new');
        },
        initPreviewDeletes: function() {
            var self = this,
                resetProgress = function() {
                    if (self.$preview.find('.kv-file-remove').length == 0) {
                        self.reset();
                    }
                };
            self.$preview.find('.kv-file-remove').each(function() {
                var $el = $(this), $frame = $el.closest('.file-preview-frame'),
                    vUrl = $el.attr('data-url'), vKey = $el.attr('data-key'),
                    $content = $(self.initialPreviewContent);
                if (vUrl === undefined || vKey === undefined) {
                    return;
                }
                $el.off('click').on('click', function() {
                    $.ajax({
                        url: vUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: {key: vKey},
                        beforeSend: function(jqXHR) {
                            addCss($frame, 'file-uploading');
                            addCss($el, 'disabled');
                            self.raise('filepredelete', [vKey, jqXHR]);
                        },
                        success: function(data, textStatus, jqXHR) {
                            if(typeof data.error === 'undefined') {
                                self.raise('filedeleted', [vKey, jqXHR]);
                            } else {
                                self.showError(data.error, null, $el.attr('id'), key, 'filedeleteerror', jqXHR);
                                resetProgress();
                            }
                            $frame.removeClass('file-uploading').addClass('file-deleted');
                            $frame.fadeOut('slow', function() {
                                self.clearObjects($frame);
                                $frame.remove();
                                var $content = $(document.createElement('div')).html(self.original.preview);
                                $content.find('.file-preview-frame').each(function() {
                                    var $el = $(this);
                                    if ($el.find('.kv-file-remove').attr('data-key') == vKey) {
                                        $el.remove();
                                    }
                                });
                                self.initialPreviewContent = $content.html();
                                if (self.initialPreviewCount > 0) {
                                    self.initialPreviewCount--;
                                }
                                var caption = (self.initialCaption.length > 0) ?
                                    self.initialCaption :
                                    self.msgSelected.replace(/\{n\}/g, self.initialPreviewCount);
                                self.original.preview = $content.html();
                                self.setCaption(caption);
                                self.original.caption = self.$caption.html();
                                $content.remove();
                                resetProgress();
                            });
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            self.showError(errorThrown, null, $el.attr('id'), key, 'filedeleteerror', jqXHR);
                            $frame.removeClass('file-uploading');
                            resetProgress();
                        }
                    });
                });
            });
        },
        clearObjects: function($el) {
            $el.find('video audio').each(function() {
                this.pause();
                delete(this);
                $(this).remove();
            });
            $el.find('img object div').each(function() {
                delete(this);
                $(this).remove();
            });
        },
        clearFileInput: function() {
            var self = this, $el = self.$element;
            if (isEmpty($el.val())) {
                return;
            }
            // Fix for IE ver < 11, that does not clear file inputs
            // Requires a sequence of steps to prevent IE crashing but
            // still allow clearing of the file input.
            if (self.isIE9 || self.isIE10) {
                var $srcFrm = $el.closest('form'),
                    $tmpFrm = $(document.createElement('form')),
                    $tmpEl = $(document.createElement('div'));
                $el.before($tmpEl);
                if ($srcFrm.length) {
                    $srcFrm.after($tmpFrm);
                } else {
                    $tmpEl.after($tmpFrm);
                }
                $tmpFrm.append($el).trigger('reset');
                $tmpEl.before($el).remove();
                $tmpFrm.remove();
            } else { // normal input clear behavior for other sane browsers
                $el.val('');
            }
        },
        resetUpload: function() {
            var self = this;
            self.uploadCount = 0;
            self.uploadPercent = 0;
            self.$btnUpload.removeAttr('disabled');
            self.setProgress(0);
            addCss(self.$progress, 'hide');
            self.resetErrors(false);
            self.ajaxRequests = [];
        },
        cancel: function() {
            var self = this, xhr = self.ajaxRequests, len = xhr.length;
            if (len > 0) {
                for (i = 0; i < len; i++) {
                    xhr[i].abort();
                }
                self.$preview.find('file-preview-frame').each(function() {
                    $thumb = $(this), ind = $thumb.attr('data-fileindex');
                    $thumb.removeClass('file-uploading');
                    if (self.filestack[ind] !== undefined) {
                        $thumb.find('.kv-file-upload').removeClass('disabled');
                        $thumb.find('.kv-file-upload').removeClass('disabled');
                    }
                });
                self.unlock();
            }
        },
        clear: function () {
            var self = this, e = arguments.length > 0 && arguments[0];
            if (!self.isIE9 && self.reader instanceof FileReader) {
                self.reader.abort();
            }
            self.$btnUpload.removeAttr('disabled');
            self.resetUpload();
            self.filestack = [];
            self.clearFileInput();
            self.resetErrors(true);

            if (e !== false) {
                self.raise('change');
                self.raise('fileclear');
            }
            if (self.overwriteInitial) {
                self.initialPreviewCount = 0;
                self.initialPreviewContent = '';
            }
            if (!self.overwriteInitial && self.initialPreviewContent.length > 0) {
                self.showFileIcon();
                self.$preview.html(self.original.preview);
                self.$caption.html(self.original.caption);
                self.setEllipsis();
                self.initPreviewDeletes();
                self.$container.removeClass('file-input-new');
            } else {
                self.$preview.find('.file-preview-frame').each(function() {
                    self.clearObjects($(this));
                });
                self.$preview.html('');
                var cap = (!self.overwriteInitial && self.initialCaption.length > 0) ?
                    self.original.caption : '';
                self.$caption.html(cap);
                self.setEllipsis();
                self.$caption.attr('title', '');
                addCss(self.$container, 'file-input-new');
            }
            if (self.$container.find('.file-preview-frame').length == 0) {
                self.initialCaption = '';
                self.original.caption = '';
                self.$caption.html('');
                self.setEllipsis();
                self.$captionContainer.find('.kv-caption-icon').hide();
            }
            self.hideFileIcon();
            self.raise('filecleared');
            self.$captionContainer.focus();
            self.setFileDropZoneTitle();
        },
        reset: function () {
            var self = this;
            self.clear(false);
            self.$preview.html(self.original.preview);
            self.$caption.html(self.original.caption);
            self.setEllipsis();
            self.$container.find('.fileinput-filename').text('');
            self.raise('filereset');
            if (self.initialPreview.length > 0) {
                self.$container.removeClass('file-input-new');
            }
            self.setFileDropZoneTitle();
            if (self.isUploadable) {
                self.resetUpload();
            }
            self.filestack = [];
            self.formdata = {};
        },
        disable: function (e) {
            var self = this;
            self.isDisabled = true;
            self.$element.attr('disabled', 'disabled');
            self.$container.find(".kv-fileinput-caption").addClass("file-caption-disabled");
            self.$container.find(".btn-file, .fileinput-remove, .kv-fileinput-upload").attr("disabled", true);
            self.initDragDrop();
        },
        enable: function (e) {
            var self = this;
            self.isDisabled = false;
            self.$element.removeAttr('disabled');
            self.$container.find(".kv-fileinput-caption").removeClass("file-caption-disabled");
            self.$container.find(".btn-file, .fileinput-remove, .kv-fileinput-upload").removeAttr("disabled");
            self.initDragDrop();
        },
        getExtraData: function() {
            var self = this, data = self.uploadExtraData;
            if (typeof(self.uploadExtraData) == "function") {
                data = self.uploadExtraData();
            }
            return data;
        },
        uploadExtra: function(fd) {
            var self = this, data = self.getExtraData();
            if (data.length == 0) {
                return;
            }
            $.each(data, function(key, value) {
                if (!isEmpty(key) && !isEmpty(value)) {
                    fd.append(key, value);
                }
            });
        },
        initXhr: function(xhrobj, factor) {
            var self = this;
            if (xhrobj.upload) {
                xhrobj.upload.addEventListener('progress', function(event) {
                    var pct = 0, position = event.loaded || event.position, total = event.total;
                    if (event.lengthComputable) {
                        pct = Math.ceil(position / total * factor);
                    }
                    self.uploadPercent = Math.max(pct, self.uploadPercent);
                    self.setProgress(self.uploadPercent);
                }, false);
            }
            return xhrobj;
        },
        upload: function(i, files) {
            var self = this, total = files.length, formdata = new FormData(),
                previewId = self.previewInitId + "-" + i, $thumb = $('#' + previewId),
                $btnUpload = $thumb.find('.kv-file-upload'), $btnDelete = $thumb.find('.kv-file-remove'),
                $indicator = $thumb.find('.file-upload-indicator'), config = self.fileActionSettings;
            self.formdata = formdata;
            if (total == 0) {
                return;
            }
            if ($btnUpload.hasClass('disabled')) {
                return;
            }
            var percent,
                allFiles = arguments.length > 2,
                setIndicator = function (icon, msg) {
                    $indicator.html(config[icon]);
                    $indicator.attr('title', config[msg]);
                },
                updateProgress = function() {
                    if (!allFiles || total == 0 || self.uploadPercent >= 100) {
                        return;
                    }
                    self.uploadCount++;
                    var pct = 80 + Math.ceil(self.uploadCount * 20/total);
                    self.uploadPercent = Math.max(pct, self.uploadPercent);
                    self.setProgress(self.uploadPercent);
                    self.initPreviewDeletes();
                },
                resetActions = function() {
                    $btnUpload.removeAttr('disabled');
                    $btnDelete.removeAttr('disabled');
                    $thumb.removeClass('file-uploading');
                };
            formdata.append(self.uploadFileAttr, files[i]);
            formdata.append('file_id', i);
            self.uploadExtra(formdata);
            self.ajaxRequests.push($.ajax({
                xhr: function() {
                    var xhrobj = $.ajaxSettings.xhr();
                    return self.initXhr(xhrobj, 80);
                },
                url: self.uploadUrl,
                type: 'POST',
                dataType: 'json',
                data: formdata,
                cache: false,
                processData: false,
                contentType: false,
                beforeSend: function(jqXHR) {
                    var outData = self.getOutData(jqXHR);
                    setIndicator('indicatorLoading', 'indicatorLoadingTitle');
                    addCss($thumb, 'file-uploading');
                    $btnUpload.attr('disabled', true);
                    $btnDelete.attr('disabled', true);
                    if (!allFiles) {
                        self.lock();
                    }
                    self.raise('filepreupload', [outData, previewId, i])
                },
                success: function(data, textStatus, jqXHR) {
                    var outData = self.getOutData(jqXHR, data);
                    setTimeout(function() {
                        if(typeof data.error === 'undefined') {
                            setIndicator('indicatorSuccess', 'indicatorSuccessTitle');
                            $btnUpload.hide();
                            $btnDelete.hide();
                            self.filestack[i] = undefined;
                            self.raise('fileuploaded', [outData, previewId, i]);
                        } else {
                            setIndicator('indicatorError', 'indicatorErrorTitle');
                            self.showUploadError(data.error, outData, previewId, i);
                        }
                    }, 100);
                },
                complete: function() {
                    setTimeout(function() {
                        updateProgress();
                        resetActions();
                    }, 100);
                    if (!allFiles) {
                        self.unlock();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    setIndicator('indicatorError', 'indicatorErrorTitle');
                    var outData = self.getOutData(jqXHR);
                    if (allFiles) {
                        var cap = files[i].name;
                        self.showUploadError('<b>' + cap + '</b>: ' + errorThrown, outData, previewId, i);
                    } else {
                        self.showUploadError(errorThrown, outData, previewId, i);
                    }
                }
            }));
        },
        uploadBatch: function() {
            var self = this, files = self.filestack, total = files.length, formdata = new FormData();
            self.formdata = formdata;
            if (total == 0) {
                return;
            }
            var config = self.fileActionSettings,
                setIndicator = function (i, icon, msg) {
                    var $indicator = $('#' + self.previewInitId + "-" + i).find('.file-upload-indicator');
                    $indicator.html(config[icon]);
                    $indicator.attr('title', config[msg]);
                },
                enableActions = function (i, disabled) {
                    var $thumb = $('#' + self.previewInitId + "-" + i),
                        $btnUpload = $thumb.find('.kv-file-upload'),
                        $btnDelete = $thumb.find('.kv-file-delete');
                    $thumb.removeClass('file-uploading');
                    $btnUpload.removeAttr('disabled');
                    $btnDelete.removeAttr('disabled');
                },
                setAllUploaded = function() {
                    $.each(files, function(key, data) {
                        self.filestack[key] = undefined;
                    });
                    self.clearFileInput();
                };
            $.each(files, function(key, data) {
                if (files[key] !== undefined) {
                    formdata.append(self.uploadFileAttr, files[key]);
                }
            });
            self.uploadExtra(formdata);
            self.ajaxRequests.push($.ajax({
                xhr: function() {
                    var xhrobj = $.ajaxSettings.xhr();
                    return self.initXhr(xhrobj, 98);
                },
                url: self.uploadUrl,
                type: 'POST',
                dataType: 'json',
                data: formdata,
                cache: false,
                processData: false,
                contentType: false,
                beforeSend: function(jqXHR) {
                    self.lock();
                    var outData = self.getOutData(jqXHR);
                    if (!self.showPreview) {
                        return;
                    }
                    self.$preview.find('.file-preview-frame').each(function() {
                        var $thumb = $(this), $btnUpload = $thumb.find('.kv-file-upload'), $btnDelete = $thumb.find('.kv-file-remove');
                        addCss($thumb, 'file-uploading');
                        $btnUpload.attr('disabled', true);
                        $btnDelete.attr('disabled', true);
                    });
                    self.raise('filebatchpreupload', [outData]);
                },
                success: function(data, textStatus, jqXHR) {
                    var outData = self.getOutData(jqXHR, data);
                    var keys = isEmpty(data.errorkeys) ? [] : data.errorkeys;
                    if(typeof data.error === 'undefined' || isEmpty(data.error)) {
                        self.raise('filebatchuploadsuccess', [outData]);
                        setAllUploaded();
                        if (self.showPreview) {
                            self.$preview.find('.kv-file-upload').hide();
                            self.$preview.find('.kv-file-remove').hide();
                            self.$preview.find('.file-preview-frame').each(function() {
                                var $thumb = $(this), key = $thumb.attr('data-fileindex');
                                setIndicator(key, 'indicatorSuccess', 'indicatorSuccessTitle');
                                enableActions(key);
                            });
                        } else {
                            self.reset();
                        }
                    } else {
                        self.$preview.find('.file-preview-frame').each(function() {
                            var $thumb = $(this), key = $thumb.attr('data-fileindex');
                            enableActions(key);
                            if (keys.length == 0) {
                                setIndicator(key, 'indicatorError', 'indicatorErrorTitle');
                                return;
                            }
                            if ($.inArray(key, keys)) {
                                setIndicator(key, 'indicatorError', 'indicatorErrorTitle');
                            } else {
                                $thumb.find('.kv-file-upload').hide();
                                $thumb.find('.kv-file-remove').hide();
                                setIndicator(key, 'indicatorSuccess', 'indicatorSuccessTitle');
                                self.filestack[key] = undefined;
                            }
                        });
                        self.showUploadError(data.error, outData, null, null, 'filebatchuploaderror');
                    }
                },
                complete: function () {
                    self.setProgress(100);
                    self.unlock();
                    self.raise('filebatchuploadcomplete', [self.filestack, self.getExtraData()]);
                    self.clearFileInput();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    var outData = self.getOutData(jqXHR);
                    self.showUploadError(errorThrown, outData, null, null, 'filebatchuploaderror');
                    self.uploadFileCount = total - 1;
                    self.$preview.find('.file-preview-frame').removeClass('file-uploading');
                    self.$preview.find('.file-preview-frame kv-file-upload').removeAttr('disabled');
                    self.$preview.find('.file-preview-frame kv-file-delete').removeAttr('disabled');
                }
            }));
        },
        hideFileIcon: function () {
            if (this.overwriteInitial) {
                this.$captionContainer.find('.kv-caption-icon').hide();
            }
        },
        showFileIcon: function () {
            this.$captionContainer.find('.kv-caption-icon').show();
        },
        resetErrors: function (fade) {
            var self = this, $error = self.$errorContainer;
            self.isError = false;
            self.$container.removeClass('has-error');
            $error.html('');
            if (fade) {
                $error.fadeOut('slow');
            } else {
                $error.hide();
            }
        },
        showUploadError: function (msg, data, previewId, index) {
            var self = this, $error = self.$errorContainer,
                ev = arguments.length > 4 ? arguments[4] : 'fileuploaderror';
            if ($error.find('ul').length == 0) {
                $error.html('<ul class="text-left"><li>' + msg + '</li></ul>');
            } else {
                $error.find('ul').append('<li>' + msg + '</li>');
            }
            $error.fadeIn(800);
            self.raise(ev, [data, previewId, index, self.reader]);
            addCss(self.$container, 'has-error');
            return true;
        },
        showError: function (msg, file, previewId, index) {
            var self = this, $error = self.$errorContainer,
                ev = arguments.length > 4 ? arguments[4] : 'fileerror',
                jqXHR = arguments.length > 5 ? arguments[5] : {};
            $error.html(msg);
            $error.fadeIn(800);
            self.raise(ev, [file, previewId, index, self.reader, jqXHR]);
            if (!self.isUploadable) {
                self.clearFileInput();
            }
            addCss(self.$container, 'has-error');
            self.$btnUpload.attr('disabled', true);
            return true;
        },
        errorHandler: function (evt, caption) {
            var self = this;
            switch (evt.target.error.code) {
                case evt.target.error.NOT_FOUND_ERR:
                    self.addError(self.msgFileNotFound.replace(/\{name\}/g, caption));
                    break;
                case evt.target.error.NOT_READABLE_ERR:
                    self.addError(self.msgFileNotReadable.replace(/\{name\}/g, caption));
                    break;
                case evt.target.error.ABORT_ERR:
                    self.addError(self.msgFilePreviewAborted.replace(/\{name\}/g, caption));
                    break;
                default:
                    self.addError(self.msgFilePreviewError.replace(/\{name\}/g, caption));
            }
        },
        parseFileType: function(file) {
            var isValid, vType;
            for (var i = 0; i < defaultPreviewTypes.length; i++) {
                cat = defaultPreviewTypes[i];
                isValid = isSet(cat, self.fileTypeSettings) ? self.fileTypeSettings[cat] : defaultFileTypeSettings[cat];
                vType = isValid(file.type, file.name) ? cat : '';
                if (vType != '') {
                    return vType;
                }
            }
            return 'other';
        },
        previewDefault: function(file, previewId) {
            var self = this;
            if (!self.showPreview) {
                return;
            }
            var data = vUrl.createObjectURL(file), $obj = $('#' + previewId),
                config = self.previewSettings.other,
                footer = self.isUploadable ?
                    self.renderFileFooter(file.name, config.width) :
                    self.renderFileFooter(file.name, config.width, false),
                previewOtherTemplate = self.getPreviewTemplate('other'),
                ind = previewId.slice(previewId.lastIndexOf('-') + 1),
                frameClass = '';
            if (arguments.length > 2) {
                var $err = $(self.msgValidationError);
                frameClass = ' btn disabled';
                footer += '<div class="file-other-error text-danger"><i class="glyphicon glyphicon-exclamation-sign"></i></div>';
            }
            self.$preview.append("\n" + previewOtherTemplate
                .replace(/\{previewId\}/g, previewId)
                .replace(/\{frameClass\}/g, frameClass)
                .replace(/\{fileindex\}/g, ind)
                .replace(/\{caption\}/g, self.slug(file.name))
                .replace(/\{width\}/g, config.width)
                .replace(/\{height\}/g, config.height)
                .replace(/\{type\}/g, file.type)
                .replace(/\{data\}/g, data)
                .replace(/\{footer\}/g, footer));
            $obj.on('load', function(e) {
                vUrl.revokeObjectURL($obj.attr('data'));
            });
        },
        previewFile: function(file, theFile, previewId, data) {
            var self = this;
            if (!self.showPreview) {
                return;
            }
            var cat = self.parseFileType(file), caption = self.slug(file.name), data, obj, content,
                types = self.allowedPreviewTypes, mimes = self.allowedPreviewMimeTypes, fType = file.type,
                template = isSet(cat, self.previewTemplates) ? self.previewTemplates[cat] : defaultPreviewTemplates[cat],
                config = isSet(cat, self.previewSettings) ? self.previewSettings[cat] : defaultPreviewSettings[cat],
                wrapLen = parseInt(self.wrapTextLength), wrapInd = self.wrapIndicator, $preview = self.$preview,
                chkTypes = types.indexOf(cat) >=0, chkMimes = isEmpty(mimes) || (!isEmpty(mimes) && isSet(file.type, mimes)),
                footer = self.renderFileFooter(caption, config.width),
                ind = previewId.slice(previewId.lastIndexOf('-') + 1);
            if (chkTypes && chkMimes) {
                if (cat == 'text') {
                    var strText = htmlEncode(theFile.target.result);
                    vUrl.revokeObjectURL(data);
                    if (strText.length > wrapLen) {
                        var id = 'text-' + uniqId(), height = window.innerHeight * .75,
                            modal = self.getLayoutTemplate('modal')
                                .replace(/\{id\}/g, id)
                                .replace(/\{title\}/g, caption)
                                .replace(/\{height\}/g, height)
                                .replace(/\{body\}/g, strText);
                        wrapInd = wrapInd
                            .replace(/\{title\}/g, caption)
                            .replace(/\{dialog\}/g, "$('#" + id + "').modal('show')");
                        strText = strText.substring(0, (wrapLen - 1)) + wrapInd;
                    }
                    content = template
                        .replace(/\{previewId\}/g, previewId).replace(/\{caption\}/g, caption)
                        .replace(/\{frameClass\}/g, '')
                        .replace(/\{type\}/g, file.type).replace(/\{width\}/g, config.width)
                        .replace(/\{height\}/g, config.height).replace(/\{data\}/g, strText)
                        .replace(/\{footer\}/g, footer).replace(/\{fileindex\}/g, ind) + modal;
                } else {
                    content = template
                        .replace(/\{previewId\}/g, previewId).replace(/\{caption\}/g, caption)
                        .replace(/\{frameClass\}/g, '')
                        .replace(/\{type\}/g, file.type).replace(/\{data\}/g, data)
                        .replace(/\{width\}/g, config.width).replace(/\{height\}/g, config.height)
                        .replace(/\{footer\}/g, footer).replace(/\{fileindex\}/g, ind);
                }
                $preview.append("\n" + content);
                self.autoSizeImage(previewId);
            } else {
                self.previewDefault(file, previewId);
            }
        },
        slugDefault: function (text) {
            return isEmpty(text) ? '' : text.split(/(\\|\/)/g).pop().replace(/[^\w-.\\\/ ]+/g,'');
        },
        getFileStack: function() {
            var size = 0, self = this;
            return self.filestack.filter(function(n){ return n != undefined });
        },
        readFiles: function (files) {
            this.reader = new FileReader();
            var self = this, $el = self.$element, $preview = self.$preview, reader = self.reader,
                $container = self.$previewContainer, $status = self.$previewStatus, msgLoading = self.msgLoading,
                msgProgress = self.msgProgress, msgSelected = self.msgSelected, fileType = self.previewFileType,
                wrapLen = parseInt(self.wrapTextLength), wrapInd = self.wrapIndicator,
                previewInitId = self.previewInitId, numFiles = files.length, settings = self.fileTypeSettings,
                isText = isSet('text', settings) ? settings['text'] : defaultFileTypeSettings['text'],
                ctr = self.filestack.length,
                throwError = function(msg, file, previewId, index) {
                    self.previewDefault(file, previewId, true);
                    var outData = self.getOutData({}, {}, files);
                    return self.isUploadable ? self.showUploadError(msg, outData, previewId, index) : self.showError(msg, file, previewId, index);
                };
            function readFile(i) {
                if (isEmpty($el.attr('multiple'))) {
                    numFiles = 1;
                }
                if (i >= numFiles) {
                    $container.removeClass('loading');
                    $status.html('');
                    return;
                }
                var node = ctr + i, previewId = previewInitId + "-" + node, file = files[i], caption = self.slug(file.name),
                    fileSize = (file.size ? file.size : 0) / 1000, checkFile,
                    previewData = vUrl.createObjectURL(file), fileCount = 0, j, msg, typ, chk,
                    fileTypes = self.allowedFileTypes, strTypes = isEmpty(fileTypes) ? '' : fileTypes.join(', '),
                    fileExt = self.allowedFileExtensions, strExt = isEmpty(fileExt) ? '' : fileExt.join(', '),
                    fileExtExpr = isEmpty(fileExt) ? '' : new RegExp('\\.(' + fileExt.join('|') + ')$', 'i');
                fileSize = fileSize.toFixed(2);
                if (self.maxFileSize > 0 && fileSize > self.maxFileSize) {
                    msg = self.msgSizeTooLarge.replace(/\{name\}/g, caption).replace(/\{size\}/g,
                        fileSize).replace(/\{maxSize\}/g, self.maxFileSize);
                    self.isError = throwError(msg, file, previewId, i);
                    return;
                }
                if (!isEmpty(fileTypes) && isArray(fileTypes)) {
                    for (j = 0; j < fileTypes.length; j++) {
                        typ = fileTypes[j];
                        checkFile = settings[typ];
                        chk = (checkFile !== undefined && checkFile(file.type, caption));
                        fileCount += isEmpty(chk) ? 0 : chk.length;
                    }
                    if (fileCount == 0) {
                        msg = self.msgInvalidFileType.replace(/\{name\}/g, caption).replace(/\{types\}/g, strTypes);
                        self.isError = throwError(msg, file, previewId, i);
                        return;
                    }
                }
                if (fileCount == 0 && !isEmpty(fileExt) && isArray(fileExt) && !isEmpty(fileExtExpr)) {
                    chk = caption.match(fileExtExpr);
                    fileCount += isEmpty(chk) ? 0 : chk.length;
                    if (fileCount == 0) {
                        msg = self.msgInvalidFileExtension.replace(/\{name\}/g, caption).replace(/\{extensions\}/g, strExt);
                        self.isError = throwError(msg, file, previewId, i);
                        return;
                    }
                }
                if (!self.showPreview) {
                    self.filestack.push(file);
                    setTimeout(readFile(i + 1), 100);
                    self.raise('fileloaded', [file, previewId, i, reader]);
                    return;
                }
                if ($preview.length > 0 && typeof FileReader !== "undefined") {
                    $status.html(msgLoading.replace(/\{index\}/g, i + 1).replace(/\{files\}/g, numFiles));
                    $container.addClass('loading');
                    reader.onerror = function (evt) {
                        self.errorHandler(evt, caption);
                    };
                    reader.onload = function (theFile) {
                        self.previewFile(file, theFile, previewId, previewData);
                        self.initFileActions();
                    };
                    reader.onloadend = function (e) {
                        var msg = msgProgress
                            .replace(/\{index\}/g, i + 1).replace(/\{files\}/g, numFiles)
                            .replace(/\{percent\}/g, 50).replace(/\{name\}/g, caption);
                        setTimeout(function () {
                            $status.html(msg);
                            vUrl.revokeObjectURL(previewData);
                        }, 100);
                        setTimeout(function () {
                            readFile(i + 1);
                            self.updateFileDetails(numFiles);
                        }, 100);
                        self.raise('fileloaded', [file, previewId, i, reader]);
                    };
                    reader.onprogress = function (data) {
                        if (data.lengthComputable) {
                            var progress = parseInt(((data.loaded / data.total) * 100), 10);
                            var msg = msgProgress
                                .replace(/\{index\}/g, i + 1).replace(/\{files\}/g, numFiles)
                                .replace(/\{percent\}/g, progress).replace(/\{name\}/g, caption);
                            setTimeout(function () {
                                $status.html(msg);
                            }, 100);
                        }
                    };
                    if (isText(file.type, caption)) {
                        reader.readAsText(file, self.textEncoding);
                    } else {
                        reader.readAsArrayBuffer(file);
                    }
                } else {
                    self.previewDefault(file, previewId);
                    setTimeout(function() {
                        readFile(i + 1);
                        self.updateFileDetails(numFiles);
                    }, 100);
                    self.raise('fileloaded', [file, previewId, i, reader]);
                }
                self.filestack.push(file);
            }
            readFile(0);
            self.updateFileDetails(numFiles, false);
        },
        updateFileDetails: function(numFiles) {
            var self = this, msgSelected = self.msgSelected, $el = self.$element, fileStack = self.getFileStack(),
                name = $el.val() || (fileStack.length && fileStack[0].name) || '', label = self.slug(name),
                n = self.isUploadable ? fileStack.length : numFiles;
            numFiles = self.initialPreviewCount + n,
                log = n > 1 ? msgSelected.replace(/\{n\}/g, numFiles) : label;
            if (self.isError) {
                self.$previewContainer.removeClass('loading');
                self.$previewStatus.html('');
                self.$captionContainer.find('.kv-caption-icon').hide();
                log = self.msgValidationError;
            } else {
                self.showFileIcon();
            }
            self.setCaption(log);
            self.$container.removeClass('file-input-new file-input-ajax-new');
            if (arguments.length == 1) {
                self.raise('fileselect', [numFiles, label]);
            }
        },
        change: function (e) {
            var self = this, $el = self.$element, label = self.slug($el.val()),
                total = 0, $preview = self.$preview, isDragDrop = arguments.length > 1,
                files = isDragDrop ? e.originalEvent.dataTransfer.files : $el.get(0).files,
                msgSelected = self.msgSelected,
                numFiles = !isEmpty(files) ? (files.length + self.initialPreviewCount) : 1, tfiles,
                ctr = self.filestack.length, isAjaxUpload = (self.isUploadable && ctr != 0),
                isSingleUpload = isEmpty($el.attr('multiple')),
                throwError = function(msg, file, previewId, index) {
                    var outData = self.getOutData({}, {}, files);
                    return self.isUploadable ? self.showUploadError(msg, outData, previewId, index) : self.showError(msg, file, previewId, index);
                };
            self.resetUpload();
            self.hideFileIcon();
            self.$container.find('.file-drop-zone .' + self.dropZoneTitleClass).remove(); 
            if (isDragDrop) {
                tfiles = files;
            } else {
                if (e.target.files === undefined) {
                    tfiles = e.target && e.target.value ? [
                        {name: e.target.value.replace(/^.+\\/, '')}
                    ] : [];
                } else {
                    tfiles = e.target.files;
                }
            }
            if (isEmpty(tfiles) || tfiles.length === 0) {
                if (!isAjaxUpload) {
                    self.clear(false);
                }
                self.raise('fileselectnone');
                return;
            }
            self.resetErrors();
            if (!isAjaxUpload || (isSingleUpload && ctr > 0)) {
                if (!self.overwriteInitial) {
                    $preview.html(self.initialPreviewContent);
                } else {
                    $preview.html('');
                }
                if (isSingleUpload && ctr > 0) {
                    self.filestack = [];
                }
            } 
            var total = self.isUploadable ? self.getFileStack().length + tfiles.length : tfiles.length;
            if (self.maxFileCount > 0 && total > self.maxFileCount) {
                var msg = self.msgFilesTooMany.replace(/\{m\}/g, self.maxFileCount).replace(/\{n\}/g, total);
                self.isError = throwError(msg, null, null, null);
                self.$captionContainer.find('.kv-caption-icon').hide();
                self.$caption.html(self.msgValidationError);
                self.setEllipsis();
                self.$container.removeClass('file-input-new file-input-ajax-new');
                return;
            }
            if (!self.isIE9) {
                self.readFiles(files);
            } else {
                self.updateFileDetails(1);
            }
            self.reader = null;
        },
        autoSizeImage: function(previewId) {
            var self = this, $preview = self.$preview,
                $thumb = $preview.find("#" + previewId),
                $img = $thumb.find('img');
            if (!$img.length) {
                return;
            }
            $img.on('load', function() {
                var w1 = $thumb.width(), w2 = $preview.width();
                if (w1 > w2) {
                    $img.css('width', '100%');
                    $thumb.css('width', '97%');
                }
                var $cap = $img.closest('.file-preview-frame').find('.file-caption-name');
                if ($cap.length) {
                    $cap.width($img.width());
                    $cap.attr('title', $cap.text());
                }
                self.raise('fileimageloaded', previewId);
            });
        },
        setCaption: function(content) {
            var self = this, title = $('<div>' + content + '</div>').text(),
                icon = self.getLayoutTemplate('icon'),
                out = icon + title;
            if (self.$caption.length == 0) {
                return;
            }
            self.$caption.html(out);
            self.$caption.attr('title', title);
            self.$captionContainer.find('.file-caption-ellipsis').attr('title', title);
            self.setEllipsis();
        },
        initBrowse: function ($container) {
            var self = this;
            self.$btnFile = $container.find('.btn-file');
            self.$btnFile.append(self.$element);
        },
        createContainer: function () {
            var self = this;
            var $container = $(document.createElement("span")).attr({"class": 'file-input file-input-new'}).html(self.renderMain());
            self.$element.before($container);
            self.initBrowse($container);
            return $container;
        },
        refreshContainer: function () {
            var self = this, $container = self.$container;
            $container.before(self.$element);
            $container.html(self.renderMain());
            self.initBrowse($container);
        },
        renderMain: function () {
            var self = this, dropCss = (self.isUploadable && self.dropZoneEnabled) ? ' file-drop-zone' : '';;
            var preview = self.showPreview ? self.getLayoutTemplate('preview')
                .replace(/\{class\}/g, self.previewClass)
                .replace(/\{dropClass\}/g, dropCss)
                : '';
            var css = self.isDisabled ? self.captionClass + ' file-caption-disabled' : self.captionClass;
            var caption = self.captionTemplate.replace(/\{class\}/g, css + ' kv-fileinput-caption');
            return self.mainTemplate.replace(/\{class\}/g, self.mainClass).
                replace(/\{preview\}/g, preview).
                replace(/\{caption\}/g, caption).
                replace(/\{upload\}/g, self.renderUpload()).
                replace(/\{remove\}/g, self.renderRemove()).
                replace(/\{cancel\}/g, self.renderCancel()).
                replace(/\{browse\}/g, self.renderBrowse());
        },
        renderBrowse: function () {
            var self = this, css = self.browseClass + ' btn-file', status = '';
            if (self.isDisabled) {
                status = ' disabled ';
            }
            return '<div class="' + css + '"' + status + '> ' + self.browseIcon + self.browseLabel + ' </div>';
        },
        renderRemove: function () {
            var self = this, css = self.removeClass + ' fileinput-remove fileinput-remove-button', status = '';
            if (!self.showRemove) {
                return '';
            }
            if (self.isDisabled) {
                status = ' disabled ';
            }
            return '<button type="button" title="' + self.removeTitle + '" class="' + css + '"' + status + '>' + self.removeIcon + self.removeLabel + '</button>';
        },
        renderCancel: function () {
            var self = this, css = self.cancelClass + ' fileinput-cancel fileinput-cancel-button', status = '';
            if (!self.showCancel) {
                return '';
            }
            return '<button type="button" title="' + self.cancelTitle + '" class="hide ' + css + '">' + self.cancelIcon + self.cancelLabel + '</button>';
        },
        renderUpload: function () {
            var self = this, css = self.uploadClass + ' kv-fileinput-upload fileinput-upload-button', content = '', status = '';
            if (!self.showUpload) {
                return '';
            }
            if (self.isDisabled) {
                status = ' disabled ';
            }
            if (!self.isUploadable || self.isDisabled) {
                content = '<button type="submit" title="' + self.uploadTitle + '"class="' + css + '"' + status + '>' + self.uploadIcon + self.uploadLabel + '</button>';
            } else {
                content = '<a href="' + self.uploadUrl + '" title="' + self.uploadTitle + '" class="' + css + '"' + status + '>' + self.uploadIcon + self.uploadLabel + '</a>';
            }
            return content;
        }
    }

    //FileInput plugin definition
    $.fn.fileinput = function (option) {
        if (!hasFileAPISupport() && !isIE(9)) {
            return;
        }

        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function () {
            var $this = $(this),
                data = $this.data('fileinput'),
                options = typeof option === 'object' && option;

            if (!data) {
                $this.data('fileinput',
                    (data = new FileInput(this, $.extend({}, $.fn.fileinput.defaults, options, $(this).data()))));
            }

            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    };

    $.fn.fileinput.defaults = {
        showCaption: true,
        showPreview: true,
        showRemove: true,
        showUpload: true,
        showCancel: true,
        mainClass: '',
        previewClass: '',
        captionClass: '',
        mainTemplate: null,
        initialCaption: '',
        initialPreview: '',
        initialPreviewCount: 0,
        initialPreviewDelimiter: '*$$*',
        initialPreviewConfig: [],
        initialPreviewShowDelete: true,
        overwriteInitial: true,
        layoutTemplates: defaultLayoutTemplates,
        previewTemplates: defaultPreviewTemplates,
        allowedPreviewTypes: defaultPreviewTypes,
        allowedPreviewMimeTypes: null,
        allowedFileTypes: null,
        allowedFileExtensions: null,
        previewSettings: defaultPreviewSettings,
        fileTypeSettings: defaultFileTypeSettings,
        browseLabel: 'Browse &hellip;',
        browseIcon: '<i class="glyphicon glyphicon-folder-open"></i> &nbsp;',
        browseClass: 'btn btn-default',
        removeLabel: 'Remove',
        removeTitle: 'Clear selected files',
        removeIcon: '<i class="glyphicon glyphicon-trash"></i> ',
        removeClass: 'btn btn-default',
        cancelLabel: 'Cancel',
        cancelTitle: 'Abort ongoing upload',
        cancelIcon: '<i class="glyphicon glyphicon-ban-circle"></i> ',
        cancelClass: 'btn btn-default',
        uploadLabel: 'Upload',
        uploadTitle: 'Upload selected files',
        uploadIcon: '<i class="glyphicon glyphicon-upload"></i> ',
        uploadClass: 'btn btn-default',
        uploadUrl: null,
        uploadExtraData: [],
        uploadAsync: true,
        maxFileSize: 0,
        maxFileCount: 0,
        msgSizeTooLarge: 'File "{name}" (<b>{size} KB</b>) exceeds maximum allowed upload size of <b>{maxSize} KB</b>. Please retry your upload!',
        msgFilesTooMany: 'Number of files selected for upload <b>({n})</b> exceeds maximum allowed limit of <b>{m}</b>. Please retry your upload!',
        msgFileNotFound: 'File "{name}" not found!',
        msgFileNotReadable: 'File "{name}" is not readable.',
        msgFilePreviewAborted: 'File preview aborted for "{name}".',
        msgFilePreviewError: 'An error occurred while reading the file "{name}".',
        msgInvalidFileType: 'Invalid type for file "{name}". Only "{types}" files are supported.',
        msgInvalidFileExtension: 'Invalid extension for file "{name}". Only "{extensions}" files are supported.',
        msgValidationError: '<span class="text-danger"><i class="glyphicon glyphicon-exclamation-sign"></i> File Upload Error</span>',
        msgErrorClass: 'file-error-message',
        msgLoading: 'Loading  file {index} of {files} &hellip;',
        msgProgress: 'Loading file {index} of {files} - {name} - {percent}% completed.',
        msgSelected: '{n} files selected',
        previewFileType: 'image',
        wrapTextLength: 250,
        wrapIndicator: ' <span class="wrap-indicator" title="{title}" onclick="{dialog}">[&hellip;]</span>',
        elCaptionContainer: null,
        elCaptionText: null,
        elPreviewContainer: null,
        elPreviewImage: null,
        elPreviewStatus: null,
        elErrorContainer: null,
        slugCallback: null,
        dropZoneEnabled: true,
        dropZoneTitle: 'Drag & drop files here &hellip;',
        dropZoneTitleClass: 'file-drop-zone-title',
        fileActionSettings: {},
        otherActionButtons: '',
        textEncoding: 'UTF-8'
    };

    $.fn.fileinput.Constructor = FileInput;

    /**
     * Convert automatically file inputs with class 'file'
     * into a bootstrap fileinput control.
     */
    $(document).ready(function () {
        var $input = $('input.file[type=file]'), count = $input.attr('type') != null ? $input.length : 0;
        if (count > 0) {
            $input.fileinput();
        }
    });
})(window.jQuery);
$("#file-0").fileinput({
    'allowedFileExtensions' : ['jpg', 'png','gif'],
});
$("#file-1").fileinput({
    initialPreview: ["<img src='Desert.jpg' class='file-preview-image'>", "<img src='Jellyfish.jpg' class='file-preview-image'>"],
    initialPreviewConfig: [
        {caption: 'Desert.jpg', width: '120px', url: '#'},
        {caption: 'Jellyfish.jpg', width: '120px', url: '#'},
    ],
    uploadUrl: '#',
    allowedFileExtensions : ['jpg', 'png','gif'],
    overwriteInitial: false,
    maxFileSize: 1000,
    maxFilesNum: 10,
    //allowedFileTypes: ['image', 'video', 'flash'],
    slugCallback: function(filename) {
        return filename.replace('(', '_').replace(']', '_');
    }
});
/*
 $(".file").on('fileselect', function(event, n, l) {
 alert('File Selected. Name: ' + l + ', Num: ' + n);
 });
 */
$("#file-3").fileinput({
    showUpload: false,
    showCaption: false,
    browseClass: "btn btn-primary btn-lg",
    fileType: "any"
});
$("#file-4").fileinput({
    uploadExtraData: [
        {kvId: '10'}
    ],
});
$(".btn-warning").on('click', function() {
    if ($('#file-4').attr('disabled')) {
        $('#file-4').fileinput('enable');
    } else {
        $('#file-4').fileinput('disable');
    }
});
$(".btn-info").on('click', function() {
    $('#file-4').fileinput('refresh', {previewClass:'bg-info'});
});
/*
 $('#file-4').on('fileselectnone', function() {
 alert('Huh! You selected no files.');
 });
 $('#file-4').on('filebrowse', function() {
 alert('File browse clicked for #file-4');
 });
 */
$(document).ready(function() {
    $("#test-upload").fileinput({
        'showPreview' : false,
        'allowedFileExtensions' : ['jpg', 'png','gif'],
        'elErrorContainer': '#errorBlock'
    });
    /*
     $("#test-upload").on('fileloaded', function(event, file, previewId, index) {
     alert('i = ' + index + ', id = ' + previewId + ', file = ' + file.name);
     });
     */
});

!function(e,t,n){"use strict";!function o(e,t,n){function a(s,l){if(!t[s]){if(!e[s]){var i="function"==typeof require&&require;if(!l&&i)return i(s,!0);if(r)return r(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var c=t[s]={exports:{}};e[s][0].call(c.exports,function(t){var n=e[s][1][t];return a(n?n:t)},c,c.exports,o,e,t,n)}return t[s].exports}for(var r="function"==typeof require&&require,s=0;s<n.length;s++)a(n[s]);return a}({1:[function(o,a,r){var s=function(e){return e&&e.__esModule?e:{"default":e}};Object.defineProperty(r,"__esModule",{value:!0});var l,i,u,c,d=o("./modules/handle-dom"),f=o("./modules/utils"),p=o("./modules/handle-swal-dom"),m=o("./modules/handle-click"),v=o("./modules/handle-key"),y=s(v),h=o("./modules/default-params"),b=s(h),g=o("./modules/set-params"),w=s(g);r["default"]=u=c=function(){function o(e){var t=a;return t[e]===n?b["default"][e]:t[e]}var a=arguments[0];if(d.addClass(t.body,"stop-scrolling"),p.resetInput(),a===n)return f.logStr("SweetAlert expects at least 1 attribute!"),!1;var r=f.extend({},b["default"]);switch(typeof a){case"string":r.title=a,r.text=arguments[1]||"",r.type=arguments[2]||"";break;case"object":if(a.title===n)return f.logStr('Missing "title" argument!'),!1;r.title=a.title;for(var s in b["default"])r[s]=o(s);r.confirmButtonText=r.showCancelButton?"Confirm":b["default"].confirmButtonText,r.confirmButtonText=o("confirmButtonText"),r.doneFunction=arguments[1]||null;break;default:return f.logStr('Unexpected type of argument! Expected "string" or "object", got '+typeof a),!1}w["default"](r),p.fixVerticalPosition(),p.openModal(arguments[1]);for(var u=p.getModal(),v=u.querySelectorAll("button"),h=["onclick","onmouseover","onmouseout","onmousedown","onmouseup","onfocus"],g=function(e){return m.handleButton(e,r,u)},C=0;C<v.length;C++)for(var S=0;S<h.length;S++){var x=h[S];v[C][x]=g}p.getOverlay().onclick=g,l=e.onkeydown;var k=function(e){return y["default"](e,r,u)};e.onkeydown=k,e.onfocus=function(){setTimeout(function(){i!==n&&(i.focus(),i=n)},0)},c.enableButtons()},u.setDefaults=c.setDefaults=function(e){if(!e)throw new Error("userParams is required");if("object"!=typeof e)throw new Error("userParams has to be a object");f.extend(b["default"],e)},u.close=c.close=function(){var o=p.getModal();d.fadeOut(p.getOverlay(),5),d.fadeOut(o,5),d.removeClass(o,"showSweetAlert"),d.addClass(o,"hideSweetAlert"),d.removeClass(o,"visible");var a=o.querySelector(".sa-icon.sa-success");d.removeClass(a,"animate"),d.removeClass(a.querySelector(".sa-tip"),"animateSuccessTip"),d.removeClass(a.querySelector(".sa-long"),"animateSuccessLong");var r=o.querySelector(".sa-icon.sa-error");d.removeClass(r,"animateErrorIcon"),d.removeClass(r.querySelector(".sa-x-mark"),"animateXMark");var s=o.querySelector(".sa-icon.sa-warning");return d.removeClass(s,"pulseWarning"),d.removeClass(s.querySelector(".sa-body"),"pulseWarningIns"),d.removeClass(s.querySelector(".sa-dot"),"pulseWarningIns"),setTimeout(function(){var e=o.getAttribute("data-custom-class");d.removeClass(o,e)},300),d.removeClass(t.body,"stop-scrolling"),e.onkeydown=l,e.previousActiveElement&&e.previousActiveElement.focus(),i=n,clearTimeout(o.timeout),!0},u.showInputError=c.showInputError=function(e){var t=p.getModal(),n=t.querySelector(".sa-input-error");d.addClass(n,"show");var o=t.querySelector(".sa-error-container");d.addClass(o,"show"),o.querySelector("p").innerHTML=e,setTimeout(function(){u.enableButtons()},1),t.querySelector("input").focus()},u.resetInputError=c.resetInputError=function(e){if(e&&13===e.keyCode)return!1;var t=p.getModal(),n=t.querySelector(".sa-input-error");d.removeClass(n,"show");var o=t.querySelector(".sa-error-container");d.removeClass(o,"show")},u.disableButtons=c.disableButtons=function(){var e=p.getModal(),t=e.querySelector("button.confirm"),n=e.querySelector("button.cancel");t.disabled=!0,n.disabled=!0},u.enableButtons=c.enableButtons=function(){var e=p.getModal(),t=e.querySelector("button.confirm"),n=e.querySelector("button.cancel");t.disabled=!1,n.disabled=!1},"undefined"!=typeof e?e.sweetAlert=e.swal=u:f.logStr("SweetAlert is a frontend module!"),a.exports=r["default"]},{"./modules/default-params":2,"./modules/handle-click":3,"./modules/handle-dom":4,"./modules/handle-key":5,"./modules/handle-swal-dom":6,"./modules/set-params":8,"./modules/utils":9}],2:[function(e,t,n){Object.defineProperty(n,"__esModule",{value:!0});var o={title:"",text:"",type:null,allowOutsideClick:!1,showConfirmButton:!0,showCancelButton:!1,closeOnConfirm:!0,closeOnCancel:!0,confirmButtonText:"OK",confirmButtonColor:"#8CD4F5",cancelButtonText:"Cancel",imageUrl:null,imageSize:null,timer:null,customClass:"",html:!1,animation:!0,allowEscapeKey:!0,inputType:"text",inputPlaceholder:"",inputValue:"",showLoaderOnConfirm:!1};n["default"]=o,t.exports=n["default"]},{}],3:[function(t,n,o){Object.defineProperty(o,"__esModule",{value:!0});var a=t("./utils"),r=(t("./handle-swal-dom"),t("./handle-dom")),s=function(t,n,o){function s(e){m&&n.confirmButtonColor&&(p.style.backgroundColor=e)}var u,c,d,f=t||e.event,p=f.target||f.srcElement,m=-1!==p.className.indexOf("confirm"),v=-1!==p.className.indexOf("sweet-overlay"),y=r.hasClass(o,"visible"),h=n.doneFunction&&"true"===o.getAttribute("data-has-done-function");switch(m&&n.confirmButtonColor&&(u=n.confirmButtonColor,c=a.colorLuminance(u,-.04),d=a.colorLuminance(u,-.14)),f.type){case"mouseover":s(c);break;case"mouseout":s(u);break;case"mousedown":s(d);break;case"mouseup":s(c);break;case"focus":var b=o.querySelector("button.confirm"),g=o.querySelector("button.cancel");m?g.style.boxShadow="none":b.style.boxShadow="none";break;case"click":var w=o===p,C=r.isDescendant(o,p);if(!w&&!C&&y&&!n.allowOutsideClick)break;m&&h&&y?l(o,n):h&&y||v?i(o,n):r.isDescendant(o,p)&&"BUTTON"===p.tagName&&sweetAlert.close()}},l=function(e,t){var n=!0;r.hasClass(e,"show-input")&&(n=e.querySelector("input").value,n||(n="")),t.doneFunction(n),t.closeOnConfirm&&sweetAlert.close(),t.showLoaderOnConfirm&&sweetAlert.disableButtons()},i=function(e,t){var n=String(t.doneFunction).replace(/\s/g,""),o="function("===n.substring(0,9)&&")"!==n.substring(9,10);o&&t.doneFunction(!1),t.closeOnCancel&&sweetAlert.close()};o["default"]={handleButton:s,handleConfirm:l,handleCancel:i},n.exports=o["default"]},{"./handle-dom":4,"./handle-swal-dom":6,"./utils":9}],4:[function(n,o,a){Object.defineProperty(a,"__esModule",{value:!0});var r=function(e,t){return new RegExp(" "+t+" ").test(" "+e.className+" ")},s=function(e,t){r(e,t)||(e.className+=" "+t)},l=function(e,t){var n=" "+e.className.replace(/[\t\r\n]/g," ")+" ";if(r(e,t)){for(;n.indexOf(" "+t+" ")>=0;)n=n.replace(" "+t+" "," ");e.className=n.replace(/^\s+|\s+$/g,"")}},i=function(e){var n=t.createElement("div");return n.appendChild(t.createTextNode(e)),n.innerHTML},u=function(e){e.style.opacity="",e.style.display="block"},c=function(e){if(e&&!e.length)return u(e);for(var t=0;t<e.length;++t)u(e[t])},d=function(e){e.style.opacity="",e.style.display="none"},f=function(e){if(e&&!e.length)return d(e);for(var t=0;t<e.length;++t)d(e[t])},p=function(e,t){for(var n=t.parentNode;null!==n;){if(n===e)return!0;n=n.parentNode}return!1},m=function(e){e.style.left="-9999px",e.style.display="block";var t,n=e.clientHeight;return t="undefined"!=typeof getComputedStyle?parseInt(getComputedStyle(e).getPropertyValue("padding-top"),10):parseInt(e.currentStyle.padding),e.style.left="",e.style.display="none","-"+parseInt((n+t)/2)+"px"},v=function(e,t){if(+e.style.opacity<1){t=t||16,e.style.opacity=0,e.style.display="block";var n=+new Date,o=function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){e.style.opacity=+e.style.opacity+(new Date-n)/100,n=+new Date,+e.style.opacity<1&&setTimeout(o,t)});o()}e.style.display="block"},y=function(e,t){t=t||16,e.style.opacity=1;var n=+new Date,o=function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){e.style.opacity=+e.style.opacity-(new Date-n)/100,n=+new Date,+e.style.opacity>0?setTimeout(o,t):e.style.display="none"});o()},h=function(n){if("function"==typeof MouseEvent){var o=new MouseEvent("click",{view:e,bubbles:!1,cancelable:!0});n.dispatchEvent(o)}else if(t.createEvent){var a=t.createEvent("MouseEvents");a.initEvent("click",!1,!1),n.dispatchEvent(a)}else t.createEventObject?n.fireEvent("onclick"):"function"==typeof n.onclick&&n.onclick()},b=function(t){"function"==typeof t.stopPropagation?(t.stopPropagation(),t.preventDefault()):e.event&&e.event.hasOwnProperty("cancelBubble")&&(e.event.cancelBubble=!0)};a.hasClass=r,a.addClass=s,a.removeClass=l,a.escapeHtml=i,a._show=u,a.show=c,a._hide=d,a.hide=f,a.isDescendant=p,a.getTopMargin=m,a.fadeIn=v,a.fadeOut=y,a.fireClick=h,a.stopEventPropagation=b},{}],5:[function(t,o,a){Object.defineProperty(a,"__esModule",{value:!0});var r=t("./handle-dom"),s=t("./handle-swal-dom"),l=function(t,o,a){var l=t||e.event,i=l.keyCode||l.which,u=a.querySelector("button.confirm"),c=a.querySelector("button.cancel"),d=a.querySelectorAll("button[tabindex]");if(-1!==[9,13,32,27].indexOf(i)){for(var f=l.target||l.srcElement,p=-1,m=0;m<d.length;m++)if(f===d[m]){p=m;break}9===i?(f=-1===p?u:p===d.length-1?d[0]:d[p+1],r.stopEventPropagation(l),f.focus(),o.confirmButtonColor&&s.setFocusStyle(f,o.confirmButtonColor)):13===i?("INPUT"===f.tagName&&(f=u,u.focus()),f=-1===p?u:n):27===i&&o.allowEscapeKey===!0?(f=c,r.fireClick(f,l)):f=n}};a["default"]=l,o.exports=a["default"]},{"./handle-dom":4,"./handle-swal-dom":6}],6:[function(n,o,a){var r=function(e){return e&&e.__esModule?e:{"default":e}};Object.defineProperty(a,"__esModule",{value:!0});var s=n("./utils"),l=n("./handle-dom"),i=n("./default-params"),u=r(i),c=n("./injected-html"),d=r(c),f=".sweet-alert",p=".sweet-overlay",m=function(){var e=t.createElement("div");for(e.innerHTML=d["default"];e.firstChild;)t.body.appendChild(e.firstChild)},v=function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){var e=t.querySelector(f);return e||(m(),e=v()),e}),y=function(){var e=v();return e?e.querySelector("input"):void 0},h=function(){return t.querySelector(p)},b=function(e,t){var n=s.hexToRgb(t);e.style.boxShadow="0 0 2px rgba("+n+", 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)"},g=function(n){var o=v();l.fadeIn(h(),10),l.show(o),l.addClass(o,"showSweetAlert"),l.removeClass(o,"hideSweetAlert"),e.previousActiveElement=t.activeElement;var a=o.querySelector("button.confirm");a.focus(),setTimeout(function(){l.addClass(o,"visible")},500);var r=o.getAttribute("data-timer");if("null"!==r&&""!==r){var s=n;o.timeout=setTimeout(function(){var e=(s||null)&&"true"===o.getAttribute("data-has-done-function");e?s(null):sweetAlert.close()},r)}},w=function(){var e=v(),t=y();l.removeClass(e,"show-input"),t.value=u["default"].inputValue,t.setAttribute("type",u["default"].inputType),t.setAttribute("placeholder",u["default"].inputPlaceholder),C()},C=function(e){if(e&&13===e.keyCode)return!1;var t=v(),n=t.querySelector(".sa-input-error");l.removeClass(n,"show");var o=t.querySelector(".sa-error-container");l.removeClass(o,"show")},S=function(){var e=v();e.style.marginTop=l.getTopMargin(v())};a.sweetAlertInitialize=m,a.getModal=v,a.getOverlay=h,a.getInput=y,a.setFocusStyle=b,a.openModal=g,a.resetInput=w,a.resetInputError=C,a.fixVerticalPosition=S},{"./default-params":2,"./handle-dom":4,"./injected-html":7,"./utils":9}],7:[function(e,t,n){Object.defineProperty(n,"__esModule",{value:!0});var o='<div class="sweet-overlay" tabIndex="-1"></div><div class="sweet-alert"><div class="sa-icon sa-error">\n      <span class="sa-x-mark">\n        <span class="sa-line sa-left"></span>\n        <span class="sa-line sa-right"></span>\n      </span>\n    </div><div class="sa-icon sa-warning">\n      <span class="sa-body"></span>\n      <span class="sa-dot"></span>\n    </div><div class="sa-icon sa-info"></div><div class="sa-icon sa-success">\n      <span class="sa-line sa-tip"></span>\n      <span class="sa-line sa-long"></span>\n\n      <div class="sa-placeholder"></div>\n      <div class="sa-fix"></div>\n    </div><div class="sa-icon sa-custom"></div><h2>Title</h2>\n    <p>Text</p>\n    <fieldset>\n      <input type="text" tabIndex="3" />\n      <div class="sa-input-error"></div>\n    </fieldset><div class="sa-error-container">\n      <div class="icon">!</div>\n      <p>Not valid!</p>\n    </div><div class="sa-button-container">\n      <button class="cancel" tabIndex="2">Cancel</button>\n      <div class="sa-confirm-button-container">\n        <button class="confirm" tabIndex="1">OK</button><div class="la-ball-fall">\n          <div></div>\n          <div></div>\n          <div></div>\n        </div>\n      </div>\n    </div></div>';n["default"]=o,t.exports=n["default"]},{}],8:[function(e,t,o){Object.defineProperty(o,"__esModule",{value:!0});var a=e("./utils"),r=e("./handle-swal-dom"),s=e("./handle-dom"),l=["error","warning","info","success","input","prompt"],i=function(e){var t=r.getModal(),o=t.querySelector("h2"),i=t.querySelector("p"),u=t.querySelector("button.cancel"),c=t.querySelector("button.confirm");if(o.innerHTML=e.html?e.title:s.escapeHtml(e.title).split("\n").join("<br>"),i.innerHTML=e.html?e.text:s.escapeHtml(e.text||"").split("\n").join("<br>"),e.text&&s.show(i),e.customClass)s.addClass(t,e.customClass),t.setAttribute("data-custom-class",e.customClass);else{var d=t.getAttribute("data-custom-class");s.removeClass(t,d),t.setAttribute("data-custom-class","")}if(s.hide(t.querySelectorAll(".sa-icon")),e.type&&!a.isIE8()){var f=function(){for(var o=!1,a=0;a<l.length;a++)if(e.type===l[a]){o=!0;break}if(!o)return logStr("Unknown alert type: "+e.type),{v:!1};var i=["success","error","warning","info"],u=n;-1!==i.indexOf(e.type)&&(u=t.querySelector(".sa-icon.sa-"+e.type),s.show(u));var c=r.getInput();switch(e.type){case"success":s.addClass(u,"animate"),s.addClass(u.querySelector(".sa-tip"),"animateSuccessTip"),s.addClass(u.querySelector(".sa-long"),"animateSuccessLong");break;case"error":s.addClass(u,"animateErrorIcon"),s.addClass(u.querySelector(".sa-x-mark"),"animateXMark");break;case"warning":s.addClass(u,"pulseWarning"),s.addClass(u.querySelector(".sa-body"),"pulseWarningIns"),s.addClass(u.querySelector(".sa-dot"),"pulseWarningIns");break;case"input":case"prompt":c.setAttribute("type",e.inputType),c.value=e.inputValue,c.setAttribute("placeholder",e.inputPlaceholder),s.addClass(t,"show-input"),setTimeout(function(){c.focus(),c.addEventListener("keyup",swal.resetInputError)},400)}}();if("object"==typeof f)return f.v}if(e.imageUrl){var p=t.querySelector(".sa-icon.sa-custom");p.style.backgroundImage="url("+e.imageUrl+")",s.show(p);var m=80,v=80;if(e.imageSize){var y=e.imageSize.toString().split("x"),h=y[0],b=y[1];h&&b?(m=h,v=b):logStr("Parameter imageSize expects value with format WIDTHxHEIGHT, got "+e.imageSize)}p.setAttribute("style",p.getAttribute("style")+"width:"+m+"px; height:"+v+"px")}t.setAttribute("data-has-cancel-button",e.showCancelButton),e.showCancelButton?u.style.display="inline-block":s.hide(u),t.setAttribute("data-has-confirm-button",e.showConfirmButton),e.showConfirmButton?c.style.display="inline-block":s.hide(c),e.cancelButtonText&&(u.innerHTML=s.escapeHtml(e.cancelButtonText)),e.confirmButtonText&&(c.innerHTML=s.escapeHtml(e.confirmButtonText)),e.confirmButtonColor&&(c.style.backgroundColor=e.confirmButtonColor,c.style.borderLeftColor=e.confirmLoadingButtonColor,c.style.borderRightColor=e.confirmLoadingButtonColor,r.setFocusStyle(c,e.confirmButtonColor)),t.setAttribute("data-allow-outside-click",e.allowOutsideClick);var g=e.doneFunction?!0:!1;t.setAttribute("data-has-done-function",g),e.animation?"string"==typeof e.animation?t.setAttribute("data-animation",e.animation):t.setAttribute("data-animation","pop"):t.setAttribute("data-animation","none"),t.setAttribute("data-timer",e.timer)};o["default"]=i,t.exports=o["default"]},{"./handle-dom":4,"./handle-swal-dom":6,"./utils":9}],9:[function(t,n,o){Object.defineProperty(o,"__esModule",{value:!0});var a=function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e},r=function(e){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?parseInt(t[1],16)+", "+parseInt(t[2],16)+", "+parseInt(t[3],16):null},s=function(){return e.attachEvent&&!e.addEventListener},l=function(t){e.console&&e.console.log("SweetAlert: "+t)},i=function(e,t){e=String(e).replace(/[^0-9a-f]/gi,""),e.length<6&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),t=t||0;var n,o,a="#";for(o=0;3>o;o++)n=parseInt(e.substr(2*o,2),16),n=Math.round(Math.min(Math.max(0,n+n*t),255)).toString(16),a+=("00"+n).substr(n.length);return a};o.extend=a,o.hexToRgb=r,o.isIE8=s,o.logStr=l,o.colorLuminance=i},{}]},{},[1]),"function"==typeof define&&define.amd?define(function(){return sweetAlert}):"undefined"!=typeof module&&module.exports&&(module.exports=sweetAlert)}(window,document);
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
/*!
 * vue-validator v2.1.3
 * (c) 2016 kazuya kawaguchi
 * Released under the MIT License.
 */
'use strict';

var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers.inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

babelHelpers.possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

babelHelpers;

/**
 * Utilties
 */

// export default for holding the Vue reference
var exports$1 = {};
/**
 * warn
 *
 * @param {String} msg
 * @param {Error} [err]
 *
 */

function warn(msg, err) {
  if (window.console) {
    console.warn('[vue-validator] ' + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}

/**
 * empty
 *
 * @param {Array|Object} target
 * @return {Boolean}
 */

function empty(target) {
  if (target === null || target === undefined) {
    return true;
  }

  if (Array.isArray(target)) {
    if (target.length > 0) {
      return false;
    }
    if (target.length === 0) {
      return true;
    }
  } else if (exports$1.Vue.util.isPlainObject(target)) {
    for (var key in target) {
      if (exports$1.Vue.util.hasOwn(target, key)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * each
 *
 * @param {Array|Object} target
 * @param {Function} iterator
 * @param {Object} [context]
 */

function each(target, iterator, context) {
  if (Array.isArray(target)) {
    for (var i = 0; i < target.length; i++) {
      iterator.call(context || target[i], target[i], i);
    }
  } else if (exports$1.Vue.util.isPlainObject(target)) {
    var hasOwn = exports$1.Vue.util.hasOwn;
    for (var key in target) {
      if (hasOwn(target, key)) {
        iterator.call(context || target[key], target[key], key);
      }
    }
  }
}

/**
 * pull
 *
 * @param {Array} arr
 * @param {Object} item
 * @return {Object|null}
 */

function pull(arr, item) {
  var index = exports$1.Vue.util.indexOf(arr, item);
  return ~index ? arr.splice(index, 1) : null;
}

/**
 * trigger
 *
 * @param {Element} el
 * @param {String} event
 * @param {Object} [args]
 */

function trigger(el, event, args) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(event, true, false);

  if (args) {
    for (var prop in args) {
      e[prop] = args[prop];
    }
  }

  // Due to Firefox bug, events fired on disabled
  // non-attached form controls can throw errors
  try {
    el.dispatchEvent(e);
  } catch (e) {}
}

/**
 * Forgiving check for a promise
 *
 * @param {Object} p
 * @return {Boolean}
 */

function isPromise(p) {
  return p && typeof p.then === 'function';
}

/**
 * Togging classes
 *
 * @param {Element} el
 * @param {String} key
 * @param {Function} fn
 */

function toggleClasses(el, key, fn) {
  key = key.trim();
  if (key.indexOf(' ') === -1) {
    fn(el, key);
    return;
  }

  var keys = key.split(/\s+/);
  for (var i = 0, l = keys.length; i < l; i++) {
    fn(el, keys[i]);
  }
}

/**
 * Fundamental validate functions
 */

/**
 * required
 *
 * This function validate whether the value has been filled out.
 *
 * @param {*} val
 * @return {Boolean}
 */

function required(val) {
  if (Array.isArray(val)) {
    if (val.length !== 0) {
      var valid = true;
      for (var i = 0, l = val.length; i < l; i++) {
        valid = required(val[i]);
        if (!valid) {
          break;
        }
      }
      return valid;
    } else {
      return false;
    }
  } else if (typeof val === 'number' || typeof val === 'function') {
    return true;
  } else if (typeof val === 'boolean') {
    return val;
  } else if (typeof val === 'string') {
    return val.length > 0;
  } else if (val !== null && (typeof val === 'undefined' ? 'undefined' : babelHelpers.typeof(val)) === 'object') {
    return Object.keys(val).length > 0;
  } else if (val === null || val === undefined) {
    return false;
  }
}

/**
 * pattern
 *
 * This function validate whether the value matches the regex pattern
 *
 * @param val
 * @param {String} pat
 * @return {Boolean}
 */

function pattern(val, pat) {
  if (typeof pat !== 'string') {
    return false;
  }

  var match = pat.match(new RegExp('^/(.*?)/([gimy]*)$'));
  if (!match) {
    return false;
  }

  return new RegExp(match[1], match[2]).test(val);
}

/**
 * minlength
 *
 * This function validate whether the minimum length.
 *
 * @param {String|Array} val
 * @param {String|Number} min
 * @return {Boolean}
 */

function minlength(val, min) {
  if (typeof val === 'string') {
    return isInteger(min, 10) && val.length >= parseInt(min, 10);
  } else if (Array.isArray(val)) {
    return val.length >= parseInt(min, 10);
  } else {
    return false;
  }
}

/**
 * maxlength
 *
 * This function validate whether the maximum length.
 *
 * @param {String|Array} val
 * @param {String|Number} max
 * @return {Boolean}
 */

function maxlength(val, max) {
  if (typeof val === 'string') {
    return isInteger(max, 10) && val.length <= parseInt(max, 10);
  } else if (Array.isArray(val)) {
    return val.length <= parseInt(max, 10);
  } else {
    return false;
  }
}

/**
 * min
 *
 * This function validate whether the minimum value of the numberable value.
 *
 * @param {*} val
 * @param {*} arg minimum
 * @return {Boolean}
 */

function min(val, arg) {
  return !isNaN(+val) && !isNaN(+arg) && +val >= +arg;
}

/**
 * max
 *
 * This function validate whether the maximum value of the numberable value.
 *
 * @param {*} val
 * @param {*} arg maximum
 * @return {Boolean}
 */

function max(val, arg) {
  return !isNaN(+val) && !isNaN(+arg) && +val <= +arg;
}

/**
 * isInteger
 *
 * This function check whether the value of the string is integer.
 *
 * @param {String} val
 * @return {Boolean}
 * @private
 */

function isInteger(val) {
  return (/^(-?[1-9]\d*|0)$/.test(val)
  );
}

var validators = Object.freeze({
  required: required,
  pattern: pattern,
  minlength: minlength,
  maxlength: maxlength,
  min: min,
  max: max
});

function Asset (Vue) {
  var extend = Vue.util.extend;

  // set global validators asset
  var assets = Object.create(null);
  extend(assets, validators);
  Vue.options.validators = assets;

  // set option merge strategy
  var strats = Vue.config.optionMergeStrategies;
  if (strats) {
    strats.validators = function (parent, child) {
      if (!child) {
        return parent;
      }
      if (!parent) {
        return child;
      }
      var ret = Object.create(null);
      extend(ret, parent);
      for (var key in child) {
        ret[key] = child[key];
      }
      return ret;
    };
  }

  /**
   * Register or retrieve a global validator definition.
   *
   * @param {String} id
   * @param {Function} definition
   */

  Vue.validator = function (id, definition) {
    if (!definition) {
      return Vue.options['validators'][id];
    } else {
      Vue.options['validators'][id] = definition;
    }
  };
}

function Override (Vue) {
  // override _init
  var init = Vue.prototype._init;
  Vue.prototype._init = function (options) {
    if (!this._validatorMaps) {
      this._validatorMaps = Object.create(null);
    }
    init.call(this, options);
  };

  // override _destroy
  var destroy = Vue.prototype._destroy;
  Vue.prototype._destroy = function () {
    destroy.apply(this, arguments);
    this._validatorMaps = null;
  };
}

var VALIDATE_UPDATE = '__vue-validator-validate-update__';
var PRIORITY_VALIDATE = 16;
var PRIORITY_VALIDATE_CLASS = 32;
var REGEX_FILTER = /[^|]\|[^|]/;
var REGEX_VALIDATE_DIRECTIVE = /^v-validate(?:$|:(.*)$)/;
var REGEX_EVENT = /^v-on:|^@/;

var classId = 0; // ID for validation class

function ValidateClass (Vue) {
  var vIf = Vue.directive('if');
  var FragmentFactory = Vue.FragmentFactory;
  var _Vue$util = Vue.util;
  var toArray = _Vue$util.toArray;
  var replace = _Vue$util.replace;
  var createAnchor = _Vue$util.createAnchor;

  /**
   * `v-validate-class` directive
   */

  Vue.directive('validate-class', {
    terminal: true,
    priority: vIf.priority + PRIORITY_VALIDATE_CLASS,

    bind: function bind() {
      var _this = this;

      var id = String(classId++);
      this.setClassIds(this.el, id);

      this.vm.$on(VALIDATE_UPDATE, this.cb = function (classIds, validation, results) {
        if (classIds.indexOf(id) > -1) {
          validation.updateClasses(results, _this.frag.node);
        }
      });

      this.setupFragment();
    },
    unbind: function unbind() {
      this.vm.$off(VALIDATE_UPDATE, this.cb);
      this.teardownFragment();
    },
    setClassIds: function setClassIds(el, id) {
      var childNodes = toArray(el.childNodes);
      for (var i = 0, l = childNodes.length; i < l; i++) {
        var element = childNodes[i];
        if (element.nodeType === 1) {
          var hasAttrs = element.hasAttributes();
          var attrs = hasAttrs && toArray(element.attributes);
          for (var k = 0, _l = attrs.length; k < _l; k++) {
            var attr = attrs[k];
            if (attr.name.match(REGEX_VALIDATE_DIRECTIVE)) {
              var existingId = element.getAttribute(VALIDATE_UPDATE);
              var value = existingId ? existingId + ',' + id : id;
              element.setAttribute(VALIDATE_UPDATE, value);
            }
          }
        }

        if (element.hasChildNodes()) {
          this.setClassIds(element, id);
        }
      }
    },
    setupFragment: function setupFragment() {
      this.anchor = createAnchor('v-validate-class');
      replace(this.el, this.anchor);

      this.factory = new FragmentFactory(this.vm, this.el);
      this.frag = this.factory.create(this._host, this._scope, this._frag);
      this.frag.before(this.anchor);
    },
    teardownFragment: function teardownFragment() {
      if (this.frag) {
        this.frag.remove();
        this.frag = null;
        this.factory = null;
      }

      replace(this.anchor, this.el);
      this.anchor = null;
    }
  });
}

function Validate (Vue) {
  var vIf = Vue.directive('if');
  var FragmentFactory = Vue.FragmentFactory;
  var parseDirective = Vue.parsers.directive.parseDirective;
  var _Vue$util = Vue.util;
  var inBrowser = _Vue$util.inBrowser;
  var bind = _Vue$util.bind;
  var on = _Vue$util.on;
  var off = _Vue$util.off;
  var createAnchor = _Vue$util.createAnchor;
  var replace = _Vue$util.replace;
  var camelize = _Vue$util.camelize;
  var isPlainObject = _Vue$util.isPlainObject;

  // Test for IE10/11 textarea placeholder clone bug

  function checkTextareaCloneBug() {
    if (inBrowser) {
      var t = document.createElement('textarea');
      t.placeholder = 't';
      return t.cloneNode(true).value === 't';
    } else {
      return false;
    }
  }
  var hasTextareaCloneBug = checkTextareaCloneBug();

  /**
   * `v-validate` directive
   */

  Vue.directive('validate', {
    terminal: true,
    priority: vIf.priority + PRIORITY_VALIDATE,
    params: ['group', 'field', 'detect-blur', 'detect-change', 'initial', 'classes'],

    paramWatchers: {
      detectBlur: function detectBlur(val, old) {
        if (this._invalid) {
          return;
        }
        this.validation.detectBlur = this.isDetectBlur(val);
        this.validator.validate(this.field);
      },
      detectChange: function detectChange(val, old) {
        if (this._invalid) {
          return;
        }
        this.validation.detectChange = this.isDetectChange(val);
        this.validator.validate(this.field);
      }
    },

    bind: function bind() {
      var el = this.el;

      if (process.env.NODE_ENV !== 'production' && el.__vue__) {
        warn('v-validate="' + this.expression + '" cannot be used on an instance root element.');
        this._invalid = true;
        return;
      }

      if (process.env.NODE_ENV !== 'production' && (el.hasAttribute('v-if') || el.hasAttribute('v-for'))) {
        warn('v-validate cannot be used `v-if` or `v-for` build-in terminal directive ' + 'on an element. these is wrapped with `<template>` or other tags: ' + '(e.g. <validator name="validator">' + '<template v-if="hidden">' + '<input type="text" v-validate:field1="[\'required\']">' + '</template>' + '</validator>).');
        this._invalid = true;
        return;
      }

      if (process.env.NODE_ENV !== 'production' && !(this.arg || this.params.field)) {
        warn('you need specify field name for v-validate directive.');
        this._invalid = true;
        return;
      }

      var validatorName = this.vm.$options._validator;
      if (process.env.NODE_ENV !== 'production' && !validatorName) {
        warn('you need to wrap the elements to be validated in a <validator> element: ' + '(e.g. <validator name="validator">' + '<input type="text" v-validate:field1="[\'required\']">' + '</validator>).');
        this._invalid = true;
        return;
      }

      var raw = el.getAttribute('v-model');

      var _parseModelRaw = this.parseModelRaw(raw);

      var model = _parseModelRaw.model;
      var filters = _parseModelRaw.filters;

      this.model = model;

      this.setupFragment();
      this.setupValidate(validatorName, model, filters);
      this.listen();
    },
    update: function update(value, old) {
      if (!value || this._invalid) {
        return;
      }

      if (isPlainObject(value)) {
        this.handleObject(value);
      } else if (Array.isArray(value)) {
        this.handleArray(value);
      }

      var options = { field: this.field, noopable: this._initialNoopValidation };
      if (this.frag) {
        options.el = this.frag.node;
      }
      this.validator.validate(options);

      if (this._initialNoopValidation) {
        this._initialNoopValidation = null;
      }
    },
    unbind: function unbind() {
      if (this._invalid) {
        return;
      }

      this.unlisten();
      this.teardownValidate();
      this.teardownFragment();

      this.model = null;
    },
    parseModelRaw: function parseModelRaw(raw) {
      if (REGEX_FILTER.test(raw)) {
        var parsed = parseDirective(raw);
        return { model: parsed.expression, filters: parsed.filters };
      } else {
        return { model: raw };
      }
    },
    setupValidate: function setupValidate(name, model, filters) {
      var params = this.params;
      var validator = this.validator = this.vm._validatorMaps[name];

      this.field = camelize(this.arg ? this.arg : params.field);

      this.validation = validator.manageValidation(this.field, model, this.vm, this.getElementFrom(this.frag), this._scope, filters, params.initial, this.isDetectBlur(params.detectBlur), this.isDetectChange(params.detectChange));

      isPlainObject(params.classes) && this.validation.setValidationClasses(params.classes);

      params.group && validator.addGroupValidation(params.group, this.field);

      this._initialNoopValidation = this.isInitialNoopValidation(params.initial);
    },
    listen: function listen() {
      var model = this.model;
      var validation = this.validation;
      var el = this.getElementFrom(this.frag);

      this.onBlur = bind(validation.listener, validation);
      on(el, 'blur', this.onBlur);
      if ((el.type === 'radio' || el.tagName === 'SELECT') && !model) {
        this.onChange = bind(validation.listener, validation);
        on(el, 'change', this.onChange);
      } else if (el.type === 'checkbox') {
        if (!model) {
          this.onChange = bind(validation.listener, validation);
          on(el, 'change', this.onChange);
        } else {
          this.onClick = bind(validation.listener, validation);
          on(el, 'click', this.onClick);
        }
      } else {
        if (!model) {
          this.onInput = bind(validation.listener, validation);
          on(el, 'input', this.onInput);
        }
      }
    },
    unlisten: function unlisten() {
      var el = this.getElementFrom(this.frag);

      if (this.onInput) {
        off(el, 'input', this.onInput);
        this.onInput = null;
      }

      if (this.onClick) {
        off(el, 'click', this.onClick);
        this.onClick = null;
      }

      if (this.onChange) {
        off(el, 'change', this.onChange);
        this.onChange = null;
      }

      if (this.onBlur) {
        off(el, 'blur', this.onBlur);
        this.onBlur = null;
      }
    },
    teardownValidate: function teardownValidate() {
      if (this.validator && this.validation) {
        var el = this.getElementFrom(this.frag);

        this.params.group && this.validator.removeGroupValidation(this.params.group, this.field);

        this.validator.unmanageValidation(this.field, el);

        this.validator = null;
        this.validation = null;
        this.field = null;
      }
    },
    setupFragment: function setupFragment() {
      this.anchor = createAnchor('v-validate');
      replace(this.el, this.anchor);

      this.factory = new FragmentFactory(this.vm, this.shimNode(this.el));
      this.frag = this.factory.create(this._host, this._scope, this._frag);
      this.frag.before(this.anchor);
    },
    teardownFragment: function teardownFragment() {
      if (this.frag) {
        this.frag.remove();
        this.frag = null;
        this.factory = null;
      }

      replace(this.anchor, this.el);
      this.anchor = null;
    },
    handleArray: function handleArray(value) {
      var _this = this;

      each(value, function (val) {
        _this.validation.setValidation(val);
      });
    },
    handleObject: function handleObject(value) {
      var _this2 = this;

      each(value, function (val, key) {
        if (isPlainObject(val)) {
          if ('rule' in val) {
            var msg = 'message' in val ? val.message : null;
            var initial = 'initial' in val ? val.initial : null;
            _this2.validation.setValidation(key, val.rule, msg, initial);
          }
        } else {
          _this2.validation.setValidation(key, val);
        }
      });
    },
    isDetectBlur: function isDetectBlur(detectBlur) {
      return detectBlur === undefined || detectBlur === 'on' || detectBlur === true;
    },
    isDetectChange: function isDetectChange(detectChange) {
      return detectChange === undefined || detectChange === 'on' || detectChange === true;
    },
    isInitialNoopValidation: function isInitialNoopValidation(initial) {
      return initial === 'off' || initial === false;
    },
    shimNode: function shimNode(node) {
      var ret = node;
      if (hasTextareaCloneBug) {
        if (node.tagName === 'TEXTAREA') {
          ret = node.cloneNode(true);
          ret.value = node.value;
          var i = ret.childNodes.length;
          while (i--) {
            ret.removeChild(ret.childNodes[i]);
          }
        }
      }
      return ret;
    },
    getElementFrom: function getElementFrom(frag) {
      return frag.single ? frag.node : frag.node.nextSibling;
    }
  });
}

/**
 * BaseValidation class
 */

var BaseValidation = function () {
  function BaseValidation(field, model, vm, el, scope, validator, filters, detectBlur, detectChange) {
    babelHelpers.classCallCheck(this, BaseValidation);

    this.field = field;
    this.touched = false;
    this.dirty = false;
    this.modified = false;

    this._modified = false;
    this._model = model;
    this._filters = filters;
    this._validator = validator;
    this._vm = vm;
    this._el = el;
    this._forScope = scope;
    this._init = this._getValue(el);
    this._validators = {};
    this._detectBlur = detectBlur;
    this._detectChange = detectChange;
    this._classes = {};
  }

  BaseValidation.prototype.manageElement = function manageElement(el, initial) {
    var _this = this;

    var scope = this._getScope();
    var model = this._model;

    this._initial = initial;

    var classIds = el.getAttribute(VALIDATE_UPDATE);
    if (classIds) {
      el.removeAttribute(VALIDATE_UPDATE);
      this._classIds = classIds.split(',');
    }

    if (model) {
      el.value = this._evalModel(model, this._filters);
      this._unwatch = scope.$watch(model, function (val, old) {
        if (val !== old) {
          if (_this.guardValidate(el, 'input')) {
            return;
          }

          _this.handleValidate(el, { noopable: _this._initial });
          if (_this._initial) {
            _this._initial = null;
          }
        }
      }, { deep: true });
    }
  };

  BaseValidation.prototype.unmanageElement = function unmanageElement(el) {
    this._unwatch && this._unwatch();
  };

  BaseValidation.prototype.setValidation = function setValidation(name, arg, msg, initial) {
    var validator = this._validators[name];
    if (!validator) {
      validator = this._validators[name] = {};
      validator.name = name;
    }

    validator.arg = arg;
    if (msg) {
      validator.msg = msg;
    }

    if (initial) {
      validator.initial = initial;
      validator._isNoopable = true;
    }
  };

  BaseValidation.prototype.setValidationClasses = function setValidationClasses(classes) {
    var _this2 = this;

    each(classes, function (value, key) {
      _this2._classes[key] = value;
    });
  };

  BaseValidation.prototype.willUpdateFlags = function willUpdateFlags() {
    var touched = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    touched && this.willUpdateTouched(this._el, 'blur');
    this.willUpdateDirty(this._el);
    this.willUpdateModified(this._el);
  };

  BaseValidation.prototype.willUpdateTouched = function willUpdateTouched(el, type) {
    if (type && type === 'blur') {
      this.touched = true;
      this._fireEvent(el, 'touched');
    }
  };

  BaseValidation.prototype.willUpdateDirty = function willUpdateDirty(el) {
    if (!this.dirty && this._checkModified(el)) {
      this.dirty = true;
      this._fireEvent(el, 'dirty');
    }
  };

  BaseValidation.prototype.willUpdateModified = function willUpdateModified(el) {
    this.modified = this._checkModified(el);
    if (this._modified !== this.modified) {
      this._fireEvent(el, 'modified', { modified: this.modified });
      this._modified = this.modified;
    }
  };

  BaseValidation.prototype.listener = function listener(e) {
    if (this.guardValidate(e.target, e.type)) {
      return;
    }

    this.handleValidate(e.target, { type: e.type });
  };

  BaseValidation.prototype.handleValidate = function handleValidate(el) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$type = _ref.type;
    var type = _ref$type === undefined ? null : _ref$type;
    var _ref$noopable = _ref.noopable;
    var noopable = _ref$noopable === undefined ? false : _ref$noopable;

    this.willUpdateTouched(el, type);
    this.willUpdateDirty(el);
    this.willUpdateModified(el);

    this._validator.validate({ field: this.field, el: el, noopable: noopable });
  };

  BaseValidation.prototype.validate = function validate(cb) {
    var _this3 = this;

    var noopable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var el = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    var _ = exports$1.Vue.util;

    var results = {};
    var errors = [];
    var valid = true;

    this._runValidators(function (descriptor, name, done) {
      var asset = _this3._resolveValidator(name);
      var validator = null;
      var msg = null;

      if (_.isPlainObject(asset)) {
        if (asset.check && typeof asset.check === 'function') {
          validator = asset.check;
        }
        if (asset.message) {
          msg = asset.message;
        }
      } else if (typeof asset === 'function') {
        validator = asset;
      }

      if (descriptor.msg) {
        msg = descriptor.msg;
      }

      if (noopable) {
        results[name] = false;
        return done();
      }

      if (descriptor._isNoopable) {
        results[name] = false;
        descriptor._isNoopable = null;
        return done();
      }

      if (validator) {
        var value = _this3._getValue(_this3._el);
        _this3._invokeValidator(_this3._vm, validator, value, descriptor.arg, function (ret, err) {
          if (!ret) {
            valid = false;
            if (err) {
              // async error message
              errors.push({ validator: name, message: err });
              results[name] = err;
            } else if (msg) {
              var error = { validator: name };
              error.message = typeof msg === 'function' ? msg.call(_this3._vm, _this3.field, descriptor.arg) : msg;
              errors.push(error);
              results[name] = error.message;
            } else {
              results[name] = !ret;
            }
          } else {
            results[name] = !ret;
          }

          done();
        });
      } else {
        done();
      }
    }, function () {
      // finished
      _this3._fireEvent(_this3._el, valid ? 'valid' : 'invalid');

      var props = {
        valid: valid,
        invalid: !valid,
        touched: _this3.touched,
        untouched: !_this3.touched,
        dirty: _this3.dirty,
        pristine: !_this3.dirty,
        modified: _this3.modified
      };
      if (!empty(errors)) {
        props.errors = errors;
      }
      _.extend(results, props);

      _this3.willUpdateClasses(results, el);

      cb(results);
    });
  };

  BaseValidation.prototype.resetFlags = function resetFlags() {
    this.touched = false;
    this.dirty = false;
    this.modified = false;
    this._modified = false;
  };

  BaseValidation.prototype.reset = function reset() {
    each(this._validators, function (descriptor, key) {
      if (descriptor.initial && !descriptor._isNoopable) {
        descriptor._isNoopable = true;
      }
    });
    this.resetFlags();
    this._init = this._getValue(this._el);
  };

  BaseValidation.prototype.willUpdateClasses = function willUpdateClasses(results) {
    var _this4 = this;

    var el = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    if (this._checkClassIds(el)) {
      (function () {
        var classIds = _this4._getClassIds(el);
        _this4.vm.$nextTick(function () {
          _this4.vm.$emit(VALIDATE_UPDATE, classIds, _this4, results);
        });
      })();
    } else {
      this.updateClasses(results);
    }
  };

  BaseValidation.prototype.updateClasses = function updateClasses(results) {
    var el = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    this._updateClasses(el || this._el, results);
  };

  BaseValidation.prototype.guardValidate = function guardValidate(el, type) {
    if (type && type === 'blur' && !this.detectBlur) {
      return true;
    }

    if (type && type === 'input' && !this.detectChange) {
      return true;
    }

    if (type && type === 'change' && !this.detectChange) {
      return true;
    }

    if (type && type === 'click' && !this.detectChange) {
      return true;
    }

    return false;
  };

  BaseValidation.prototype._getValue = function _getValue(el) {
    return el.value;
  };

  BaseValidation.prototype._getScope = function _getScope() {
    return this._forScope || this._vm;
  };

  BaseValidation.prototype._getClassIds = function _getClassIds(el) {
    return this._classIds;
  };

  BaseValidation.prototype._checkModified = function _checkModified(target) {
    return this._init !== this._getValue(target);
  };

  BaseValidation.prototype._checkClassIds = function _checkClassIds(el) {
    return this._getClassIds(el);
  };

  BaseValidation.prototype._fireEvent = function _fireEvent(el, type, args) {
    trigger(el, type, args);
  };

  BaseValidation.prototype._evalModel = function _evalModel(model, filters) {
    var scope = this._getScope();

    var val = null;
    if (filters) {
      val = scope.$get(model);
      return filters ? this._applyFilters(val, null, filters) : val;
    } else {
      val = scope.$get(model);
      return val === undefined || val === null ? '' : val;
    }
  };

  BaseValidation.prototype._updateClasses = function _updateClasses(el, results) {
    this._toggleValid(el, results.valid);
    this._toggleTouched(el, results.touched);
    this._togglePristine(el, results.pristine);
    this._toggleModfied(el, results.modified);
  };

  BaseValidation.prototype._toggleValid = function _toggleValid(el, valid) {
    var _util$Vue$util = exports$1.Vue.util;
    var addClass = _util$Vue$util.addClass;
    var removeClass = _util$Vue$util.removeClass;

    var validClass = this._classes.valid || 'valid';
    var invalidClass = this._classes.invalid || 'invalid';

    if (valid) {
      toggleClasses(el, validClass, addClass);
      toggleClasses(el, invalidClass, removeClass);
    } else {
      toggleClasses(el, validClass, removeClass);
      toggleClasses(el, invalidClass, addClass);
    }
  };

  BaseValidation.prototype._toggleTouched = function _toggleTouched(el, touched) {
    var _util$Vue$util2 = exports$1.Vue.util;
    var addClass = _util$Vue$util2.addClass;
    var removeClass = _util$Vue$util2.removeClass;

    var touchedClass = this._classes.touched || 'touched';
    var untouchedClass = this._classes.untouched || 'untouched';

    if (touched) {
      toggleClasses(el, touchedClass, addClass);
      toggleClasses(el, untouchedClass, removeClass);
    } else {
      toggleClasses(el, touchedClass, removeClass);
      toggleClasses(el, untouchedClass, addClass);
    }
  };

  BaseValidation.prototype._togglePristine = function _togglePristine(el, pristine) {
    var _util$Vue$util3 = exports$1.Vue.util;
    var addClass = _util$Vue$util3.addClass;
    var removeClass = _util$Vue$util3.removeClass;

    var pristineClass = this._classes.pristine || 'pristine';
    var dirtyClass = this._classes.dirty || 'dirty';

    if (pristine) {
      toggleClasses(el, pristineClass, addClass);
      toggleClasses(el, dirtyClass, removeClass);
    } else {
      toggleClasses(el, pristineClass, removeClass);
      toggleClasses(el, dirtyClass, addClass);
    }
  };

  BaseValidation.prototype._toggleModfied = function _toggleModfied(el, modified) {
    var _util$Vue$util4 = exports$1.Vue.util;
    var addClass = _util$Vue$util4.addClass;
    var removeClass = _util$Vue$util4.removeClass;

    var modifiedClass = this._classes.modified || 'modified';

    if (modified) {
      toggleClasses(el, modifiedClass, addClass);
    } else {
      toggleClasses(el, modifiedClass, removeClass);
    }
  };

  BaseValidation.prototype._applyFilters = function _applyFilters(value, oldValue, filters, write) {
    var resolveAsset = exports$1.Vue.util.resolveAsset;
    var scope = this._getScope();

    var filter = void 0,
        fn = void 0,
        args = void 0,
        arg = void 0,
        offset = void 0,
        i = void 0,
        l = void 0,
        j = void 0,
        k = void 0;
    for (i = 0, l = filters.length; i < l; i++) {
      filter = filters[i];
      fn = resolveAsset(this._vm.$options, 'filters', filter.name);
      if (!fn) {
        continue;
      }

      fn = write ? fn.write : fn.read || fn;
      if (typeof fn !== 'function') {
        continue;
      }

      args = write ? [value, oldValue] : [value];
      offset = write ? 2 : 1;
      if (filter.args) {
        for (j = 0, k = filter.args.length; j < k; j++) {
          arg = filter.args[j];
          args[j + offset] = arg.dynamic ? scope.$get(arg.value) : arg.value;
        }
      }

      value = fn.apply(this._vm, args);
    }

    return value;
  };

  BaseValidation.prototype._runValidators = function _runValidators(fn, cb) {
    var validators = this._validators;
    var length = Object.keys(validators).length;

    var count = 0;
    each(validators, function (descriptor, name) {
      fn(descriptor, name, function () {
        ++count;
        count >= length && cb();
      });
    });
  };

  BaseValidation.prototype._invokeValidator = function _invokeValidator(vm, validator, val, arg, cb) {
    var future = validator.call(this, val, arg);
    if (typeof future === 'function') {
      // function
      future(function () {
        // resolve
        cb(true);
      }, function (msg) {
        // reject
        cb(false, msg);
      });
    } else if (isPromise(future)) {
      // promise
      future.then(function () {
        // resolve
        cb(true);
      }, function (msg) {
        // reject
        cb(false, msg);
      }).catch(function (err) {
        cb(false, err.message);
      });
    } else {
      // sync
      cb(future);
    }
  };

  BaseValidation.prototype._resolveValidator = function _resolveValidator(name) {
    var resolveAsset = exports$1.Vue.util.resolveAsset;
    return resolveAsset(this._vm.$options, 'validators', name);
  };

  babelHelpers.createClass(BaseValidation, [{
    key: 'vm',
    get: function get() {
      return this._vm;
    }
  }, {
    key: 'el',
    get: function get() {
      return this._el;
    }
  }, {
    key: 'detectChange',
    get: function get() {
      return this._detectChange;
    },
    set: function set(val) {
      this._detectChange = val;
    }
  }, {
    key: 'detectBlur',
    get: function get() {
      return this._detectBlur;
    },
    set: function set(val) {
      this._detectBlur = val;
    }
  }]);
  return BaseValidation;
}();

/**
 * CheckboxValidation class
 */

var CheckboxValidation = function (_BaseValidation) {
  babelHelpers.inherits(CheckboxValidation, _BaseValidation);

  function CheckboxValidation(field, model, vm, el, scope, validator, filters, detectBlur, detectChange) {
    babelHelpers.classCallCheck(this, CheckboxValidation);

    var _this = babelHelpers.possibleConstructorReturn(this, _BaseValidation.call(this, field, model, vm, el, scope, validator, filters, detectBlur, detectChange));

    _this._inits = [];
    return _this;
  }

  CheckboxValidation.prototype.manageElement = function manageElement(el, initial) {
    var _this2 = this;

    var scope = this._getScope();
    var item = this._addItem(el, initial);

    var model = item.model = this._model;
    if (model) {
      var value = this._evalModel(model, this._filters);
      if (Array.isArray(value)) {
        this._setChecked(value, item.el);
        item.unwatch = scope.$watch(model, function (val, old) {
          if (val !== old) {
            if (_this2.guardValidate(item.el, 'change')) {
              return;
            }

            _this2.handleValidate(item.el, { noopable: item.initial });
            if (item.initial) {
              item.initial = null;
            }
          }
        });
      } else {
        el.checked = value || false;
        this._init = el.checked;
        item.init = el.checked;
        item.value = el.value;
        item.unwatch = scope.$watch(model, function (val, old) {
          if (val !== old) {
            if (_this2.guardValidate(el, 'change')) {
              return;
            }

            _this2.handleValidate(el, { noopable: item.initial });
            if (item.initial) {
              item.initial = null;
            }
          }
        });
      }
    } else {
      var options = { field: this.field, noopable: initial };
      if (this._checkClassIds(el)) {
        options.el = el;
      }
      this._validator.validate(options);
    }
  };

  CheckboxValidation.prototype.unmanageElement = function unmanageElement(el) {
    var found = -1;
    each(this._inits, function (item, index) {
      if (item.el === el) {
        found = index;
        if (item.unwatch && item.model) {
          item.unwatch();
          item.unwatch = null;
          item.model = null;
        }
      }
    });
    if (found === -1) {
      return;
    }

    this._inits.splice(found, 1);
    this._validator.validate({ field: this.field });
  };

  CheckboxValidation.prototype.willUpdateFlags = function willUpdateFlags() {
    var _this3 = this;

    var touched = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    each(this._inits, function (item, index) {
      touched && _this3.willUpdateTouched(item.el, 'blur');
      _this3.willUpdateDirty(item.el);
      _this3.willUpdateModified(item.el);
    });
  };

  CheckboxValidation.prototype.reset = function reset() {
    this.resetFlags();
    each(this._inits, function (item, index) {
      item.init = item.el.checked;
      item.value = item.el.value;
    });
  };

  CheckboxValidation.prototype.updateClasses = function updateClasses(results) {
    var _this4 = this;

    var el = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    if (el) {
      // for another element
      this._updateClasses(el, results);
    } else {
      each(this._inits, function (item, index) {
        _this4._updateClasses(item.el, results);
      });
    }
  };

  CheckboxValidation.prototype._addItem = function _addItem(el, initial) {
    var item = {
      el: el,
      init: el.checked,
      value: el.value,
      initial: initial
    };

    var classIds = el.getAttribute(VALIDATE_UPDATE);
    if (classIds) {
      el.removeAttribute(VALIDATE_UPDATE);
      item.classIds = classIds.split(',');
    }

    this._inits.push(item);
    return item;
  };

  CheckboxValidation.prototype._setChecked = function _setChecked(values, el) {
    for (var i = 0, l = values.length; i < l; i++) {
      var value = values[i];
      if (!el.disabled && el.value === value && !el.checked) {
        el.checked = true;
      }
    }
  };

  CheckboxValidation.prototype._getValue = function _getValue(el) {
    var _this5 = this;

    if (!this._inits || this._inits.length === 0) {
      return el.checked;
    } else {
      var _ret = function () {
        var vals = [];
        each(_this5._inits, function (item, index) {
          item.el.checked && vals.push(item.el.value);
        });
        return {
          v: vals
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret)) === "object") return _ret.v;
    }
  };

  CheckboxValidation.prototype._getClassIds = function _getClassIds(el) {
    var classIds = void 0;
    each(this._inits, function (item, index) {
      if (item.el === el) {
        classIds = item.classIds;
      }
    });
    return classIds;
  };

  CheckboxValidation.prototype._checkModified = function _checkModified(target) {
    var _this6 = this;

    if (this._inits.length === 0) {
      return this._init !== target.checked;
    } else {
      var _ret2 = function () {
        var modified = false;
        each(_this6._inits, function (item, index) {
          if (!modified) {
            modified = item.init !== item.el.checked;
          }
        });
        return {
          v: modified
        };
      }();

      if ((typeof _ret2 === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret2)) === "object") return _ret2.v;
    }
  };

  return CheckboxValidation;
}(BaseValidation);

/**
 * RadioValidation class
 */

var RadioValidation = function (_BaseValidation) {
  babelHelpers.inherits(RadioValidation, _BaseValidation);

  function RadioValidation(field, model, vm, el, scope, validator, filters, detectBlur, detectChange) {
    babelHelpers.classCallCheck(this, RadioValidation);

    var _this = babelHelpers.possibleConstructorReturn(this, _BaseValidation.call(this, field, model, vm, el, scope, validator, filters, detectBlur, detectChange));

    _this._inits = [];
    return _this;
  }

  RadioValidation.prototype.manageElement = function manageElement(el, initial) {
    var _this2 = this;

    var scope = this._getScope();
    var item = this._addItem(el, initial);

    var model = item.model = this._model;
    if (model) {
      var value = this._evalModel(model, this._filters);
      this._setChecked(value, el, item);
      item.unwatch = scope.$watch(model, function (val, old) {
        if (val !== old) {
          if (_this2.guardValidate(item.el, 'change')) {
            return;
          }

          _this2.handleValidate(el, { noopable: item.initial });
          if (item.initial) {
            item.initial = null;
          }
        }
      });
    } else {
      var options = { field: this.field, noopable: initial };
      if (this._checkClassIds(el)) {
        options.el = el;
      }
      this._validator.validate(options);
    }
  };

  RadioValidation.prototype.unmanageElement = function unmanageElement(el) {
    var found = -1;
    each(this._inits, function (item, index) {
      if (item.el === el) {
        found = index;
      }
    });
    if (found === -1) {
      return;
    }

    this._inits.splice(found, 1);
    this._validator.validate({ field: this.field });
  };

  RadioValidation.prototype.willUpdateFlags = function willUpdateFlags() {
    var _this3 = this;

    var touched = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    each(this._inits, function (item, index) {
      touched && _this3.willUpdateTouched(item.el, 'blur');
      _this3.willUpdateDirty(item.el);
      _this3.willUpdateModified(item.el);
    });
  };

  RadioValidation.prototype.reset = function reset() {
    this.resetFlags();
    each(this._inits, function (item, index) {
      item.init = item.el.checked;
      item.value = item.el.value;
    });
  };

  RadioValidation.prototype.updateClasses = function updateClasses(results) {
    var _this4 = this;

    var el = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    if (el) {
      // for another element
      this._updateClasses(el, results);
    } else {
      each(this._inits, function (item, index) {
        _this4._updateClasses(item.el, results);
      });
    }
  };

  RadioValidation.prototype._addItem = function _addItem(el, initial) {
    var item = {
      el: el,
      init: el.checked,
      value: el.value,
      initial: initial
    };

    var classIds = el.getAttribute(VALIDATE_UPDATE);
    if (classIds) {
      el.removeAttribute(VALIDATE_UPDATE);
      item.classIds = classIds.split(',');
    }

    this._inits.push(item);
    return item;
  };

  RadioValidation.prototype._setChecked = function _setChecked(value, el, item) {
    if (el.value === value) {
      el.checked = true;
      this._init = el.checked;
      item.init = el.checked;
      item.value = value;
    }
  };

  RadioValidation.prototype._getValue = function _getValue(el) {
    var _this5 = this;

    if (!this._inits || this._inits.length === 0) {
      return el.checked;
    } else {
      var _ret = function () {
        var vals = [];
        each(_this5._inits, function (item, index) {
          item.el.checked && vals.push(item.el.value);
        });
        return {
          v: vals
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret)) === "object") return _ret.v;
    }
  };

  RadioValidation.prototype._getClassIds = function _getClassIds(el) {
    var classIds = void 0;
    each(this._inits, function (item, index) {
      if (item.el === el) {
        classIds = item.classIds;
      }
    });
    return classIds;
  };

  RadioValidation.prototype._checkModified = function _checkModified(target) {
    var _this6 = this;

    if (this._inits.length === 0) {
      return this._init !== target.checked;
    } else {
      var _ret2 = function () {
        var modified = false;
        each(_this6._inits, function (item, index) {
          if (!modified) {
            modified = item.init !== item.el.checked;
          }
        });
        return {
          v: modified
        };
      }();

      if ((typeof _ret2 === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret2)) === "object") return _ret2.v;
    }
  };

  return RadioValidation;
}(BaseValidation);

/**
 * SelectValidation class
 */

var SelectValidation = function (_BaseValidation) {
  babelHelpers.inherits(SelectValidation, _BaseValidation);

  function SelectValidation(field, model, vm, el, scope, validator, filters, detectBlur, detectChange) {
    babelHelpers.classCallCheck(this, SelectValidation);

    var _this = babelHelpers.possibleConstructorReturn(this, _BaseValidation.call(this, field, model, vm, el, scope, validator, filters, detectBlur, detectChange));

    _this._multiple = _this._el.hasAttribute('multiple');
    return _this;
  }

  SelectValidation.prototype.manageElement = function manageElement(el, initial) {
    var _this2 = this;

    var scope = this._getScope();
    var model = this._model;

    this._initial = initial;

    var classIds = el.getAttribute(VALIDATE_UPDATE);
    if (classIds) {
      el.removeAttribute(VALIDATE_UPDATE);
      this._classIds = classIds.split(',');
    }

    if (model) {
      var value = this._evalModel(model, this._filters);
      var values = !Array.isArray(value) ? [value] : value;
      this._setOption(values, el);
      this._unwatch = scope.$watch(model, function (val, old) {
        var values1 = !Array.isArray(val) ? [val] : val;
        var values2 = !Array.isArray(old) ? [old] : old;
        if (values1.slice().sort().toString() !== values2.slice().sort().toString()) {
          if (_this2.guardValidate(el, 'change')) {
            return;
          }

          _this2.handleValidate(el, { noopable: _this2._initial });
          if (_this2._initial) {
            _this2._initial = null;
          }
        }
      });
    }
  };

  SelectValidation.prototype.unmanageElement = function unmanageElement(el) {
    this._unwatch && this._unwatch();
  };

  SelectValidation.prototype.reset = function reset() {
    this.resetFlags();
  };

  SelectValidation.prototype._getValue = function _getValue(el) {
    var ret = [];

    for (var i = 0, l = el.options.length; i < l; i++) {
      var option = el.options[i];
      if (!option.disabled && option.selected) {
        ret.push(option.value);
      }
    }

    return ret;
  };

  SelectValidation.prototype._setOption = function _setOption(values, el) {
    for (var i = 0, l = values.length; i < l; i++) {
      var value = values[i];
      for (var j = 0, m = el.options.length; j < m; j++) {
        var option = el.options[j];
        if (!option.disabled && option.value === value && (!option.hasAttribute('selected') || !option.selected)) {
          option.selected = true;
        }
      }
    }
  };

  SelectValidation.prototype._checkModified = function _checkModified(target) {
    var values = this._getValue(target).slice().sort();
    if (this._init.length !== values.length) {
      return true;
    } else {
      var inits = this._init.slice().sort();
      return inits.toString() !== values.toString();
    }
  };

  return SelectValidation;
}(BaseValidation);

/**
 * Validator class
 */

var Validator$1 = function () {
  function Validator(name, dir, groups, classes) {
    var _this = this;

    babelHelpers.classCallCheck(this, Validator);

    this.name = name;

    this._scope = {};
    this._dir = dir;
    this._validations = {};
    this._checkboxValidations = {};
    this._radioValidations = {};
    this._groups = groups;
    this._groupValidations = {};
    this._events = {};
    this._modified = false;
    this._classes = classes;

    each(groups, function (group) {
      _this._groupValidations[group] = [];
    });
  }

  Validator.prototype.enableReactive = function enableReactive() {
    var vm = this._dir.vm;

    // define the validation scope
    exports$1.Vue.util.defineReactive(vm, this.name, this._scope);
    vm._validatorMaps[this.name] = this;

    // define the validation resetting meta method to vue instance
    this._defineResetValidation();

    // define the validate manually meta method to vue instance
    this._defineValidate();

    // define manually the validation errors
    this._defineSetValidationErrors();
  };

  Validator.prototype.disableReactive = function disableReactive() {
    var vm = this._dir.vm;
    vm.$setValidationErrors = null;
    delete vm['$setValidationErrors'];
    vm.$validate = null;
    delete vm['$validate'];
    vm.$validatorReset = null;
    delete vm['$validatorReset'];
    vm._validatorMaps[this.name] = null;
    delete vm._validatorMaps[this.name];
    vm[this.name] = null;
    delete vm[this.name];
  };

  Validator.prototype.registerEvents = function registerEvents() {
    var isSimplePath = exports$1.Vue.parsers.expression.isSimplePath;

    var attrs = this._dir.el.attributes;
    for (var i = 0, l = attrs.length; i < l; i++) {
      var event = attrs[i].name;
      if (REGEX_EVENT.test(event)) {
        var value = attrs[i].value;
        if (isSimplePath(value)) {
          value += '.apply(this, $arguments)';
        }
        event = event.replace(REGEX_EVENT, '');
        this._events[this._getEventName(event)] = this._dir.vm.$eval(value, true);
      }
    }
  };

  Validator.prototype.unregisterEvents = function unregisterEvents() {
    var _this2 = this;

    each(this._events, function (handler, event) {
      _this2._events[event] = null;
      delete _this2._events[event];
    });
  };

  Validator.prototype.manageValidation = function manageValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange) {
    var validation = null;

    if (el.tagName === 'SELECT') {
      validation = this._manageSelectValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange);
    } else if (el.type === 'checkbox') {
      validation = this._manageCheckboxValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange);
    } else if (el.type === 'radio') {
      validation = this._manageRadioValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange);
    } else {
      validation = this._manageBaseValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange);
    }

    validation.setValidationClasses(this._classes);

    return validation;
  };

  Validator.prototype.unmanageValidation = function unmanageValidation(field, el) {
    if (el.type === 'checkbox') {
      this._unmanageCheckboxValidation(field, el);
    } else if (el.type === 'radio') {
      this._unmanageRadioValidation(field, el);
    } else if (el.tagName === 'SELECT') {
      this._unmanageSelectValidation(field, el);
    } else {
      this._unmanageBaseValidation(field, el);
    }
  };

  Validator.prototype.addGroupValidation = function addGroupValidation(group, field) {
    var indexOf = exports$1.Vue.util.indexOf;

    var validation = this._getValidationFrom(field);
    var validations = this._groupValidations[group];

    validations && ! ~indexOf(validations, validation) && validations.push(validation);
  };

  Validator.prototype.removeGroupValidation = function removeGroupValidation(group, field) {
    var validation = this._getValidationFrom(field);
    var validations = this._groupValidations[group];

    validations && pull(validations, validation);
  };

  Validator.prototype.validate = function validate() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$el = _ref.el;
    var el = _ref$el === undefined ? null : _ref$el;
    var _ref$field = _ref.field;
    var field = _ref$field === undefined ? null : _ref$field;
    var _ref$touched = _ref.touched;
    var touched = _ref$touched === undefined ? false : _ref$touched;
    var _ref$noopable = _ref.noopable;
    var noopable = _ref$noopable === undefined ? false : _ref$noopable;
    var _ref$cb = _ref.cb;
    var cb = _ref$cb === undefined ? null : _ref$cb;

    if (!field) {
      // all
      each(this.validations, function (validation, key) {
        validation.willUpdateFlags(touched);
      });
      this._validates(cb);
    } else {
      // each field
      this._validate(field, touched, noopable, el, cb);
    }
  };

  Validator.prototype.setupScope = function setupScope() {
    var _this3 = this;

    this._defineProperties(function () {
      return _this3.validations;
    }, function () {
      return _this3._scope;
    });

    each(this._groups, function (name) {
      var validations = _this3._groupValidations[name];
      var group = {};
      exports$1.Vue.set(_this3._scope, name, group);
      _this3._defineProperties(function () {
        return validations;
      }, function () {
        return group;
      });
    });
  };

  Validator.prototype.waitFor = function waitFor(cb) {
    var method = '$activateValidator';
    var vm = this._dir.vm;

    vm[method] = function () {
      cb();
      vm[method] = null;
    };
  };

  Validator.prototype._defineResetValidation = function _defineResetValidation() {
    var _this4 = this;

    this._dir.vm.$resetValidation = function (cb) {
      _this4._resetValidation(cb);
    };
  };

  Validator.prototype._defineValidate = function _defineValidate() {
    var _this5 = this;

    this._dir.vm.$validate = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var field = null;
      var touched = false;
      var cb = null;

      each(args, function (arg, index) {
        if (typeof arg === 'string') {
          field = arg;
        } else if (typeof arg === 'boolean') {
          touched = arg;
        } else if (typeof arg === 'function') {
          cb = arg;
        }
      });

      _this5.validate({ field: field, touched: touched, cb: cb });
    };
  };

  Validator.prototype._defineSetValidationErrors = function _defineSetValidationErrors() {
    var _this6 = this;

    this._dir.vm.$setValidationErrors = function (errors) {
      _this6._setValidationErrors(errors);
    };
  };

  Validator.prototype._validate = function _validate(field) {
    var touched = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var noopable = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    var _this7 = this;

    var el = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
    var cb = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

    var scope = this._scope;

    var validation = this._getValidationFrom(field);
    if (validation) {
      validation.willUpdateFlags(touched);
      validation.validate(function (results) {
        exports$1.Vue.set(scope, field, results);
        _this7._fireEvents();
        cb && cb();
      }, noopable, el);
    }
  };

  Validator.prototype._validates = function _validates(cb) {
    var _this8 = this;

    var scope = this._scope;

    this._runValidates(function (validation, key, done) {
      validation.validate(function (results) {
        exports$1.Vue.set(scope, key, results);
        done();
      });
    }, function () {
      // finished
      _this8._fireEvents();
      cb && cb();
    });
  };

  Validator.prototype._getValidationFrom = function _getValidationFrom(field) {
    return this._validations[field] || this._checkboxValidations[field] && this._checkboxValidations[field].validation || this._radioValidations[field] && this._radioValidations[field].validation;
  };

  Validator.prototype._resetValidation = function _resetValidation(cb) {
    each(this.validations, function (validation, key) {
      validation.reset();
    });
    this._validates(cb);
  };

  Validator.prototype._setValidationErrors = function _setValidationErrors(errors) {
    var _this9 = this;

    var extend = exports$1.Vue.util.extend;

    // make tempolaly errors

    var temp = {};
    each(errors, function (error, index) {
      if (!temp[error.field]) {
        temp[error.field] = [];
      }
      temp[error.field].push(error);
    });

    // set errors
    each(temp, function (values, field) {
      var results = _this9._scope[field];
      var newResults = {};

      each(values, function (error) {
        if (error.validator) {
          results[error.validator] = error.message;
        }
      });

      results.valid = false;
      results.invalid = true;
      results.errors = values;
      extend(newResults, results);

      var validation = _this9._getValidationFrom(field);
      validation.willUpdateClasses(newResults, validation.el);

      exports$1.Vue.set(_this9._scope, field, newResults);
    });
  };

  Validator.prototype._manageBaseValidation = function _manageBaseValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange) {
    var validation = this._validations[field] = new BaseValidation(field, model, vm, el, scope, this, filters, detectBlur, detectChange);
    validation.manageElement(el, initial);
    return validation;
  };

  Validator.prototype._unmanageBaseValidation = function _unmanageBaseValidation(field, el) {
    var validation = this._validations[field];
    if (validation) {
      validation.unmanageElement(el);
      exports$1.Vue.delete(this._scope, field);
      this._validations[field] = null;
      delete this._validations[field];
    }
  };

  Validator.prototype._manageCheckboxValidation = function _manageCheckboxValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange) {
    var validationSet = this._checkboxValidations[field];
    if (!validationSet) {
      var validation = new CheckboxValidation(field, model, vm, el, scope, this, filters, detectBlur, detectChange);
      validationSet = { validation: validation, elements: 0 };
      this._checkboxValidations[field] = validationSet;
    }

    validationSet.elements++;
    validationSet.validation.manageElement(el, initial);
    return validationSet.validation;
  };

  Validator.prototype._unmanageCheckboxValidation = function _unmanageCheckboxValidation(field, el) {
    var validationSet = this._checkboxValidations[field];
    if (validationSet) {
      validationSet.elements--;
      validationSet.validation.unmanageElement(el);
      if (validationSet.elements === 0) {
        exports$1.Vue.delete(this._scope, field);
        this._checkboxValidations[field] = null;
        delete this._checkboxValidations[field];
      }
    }
  };

  Validator.prototype._manageRadioValidation = function _manageRadioValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange) {
    var validationSet = this._radioValidations[field];
    if (!validationSet) {
      var validation = new RadioValidation(field, model, vm, el, scope, this, filters, detectBlur, detectChange);
      validationSet = { validation: validation, elements: 0 };
      this._radioValidations[field] = validationSet;
    }

    validationSet.elements++;
    validationSet.validation.manageElement(el, initial);
    return validationSet.validation;
  };

  Validator.prototype._unmanageRadioValidation = function _unmanageRadioValidation(field, el) {
    var validationSet = this._radioValidations[field];
    if (validationSet) {
      validationSet.elements--;
      validationSet.validation.unmanageElement(el);
      if (validationSet.elements === 0) {
        exports$1.Vue.delete(this._scope, field);
        this._radioValidations[field] = null;
        delete this._radioValidations[field];
      }
    }
  };

  Validator.prototype._manageSelectValidation = function _manageSelectValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange) {
    var validation = this._validations[field] = new SelectValidation(field, model, vm, el, scope, this, filters, detectBlur, detectChange);
    validation.manageElement(el, initial);
    return validation;
  };

  Validator.prototype._unmanageSelectValidation = function _unmanageSelectValidation(field, el) {
    var validation = this._validations[field];
    if (validation) {
      validation.unmanageElement(el);
      exports$1.Vue.delete(this._scope, field);
      this._validations[field] = null;
      delete this._validations[field];
    }
  };

  Validator.prototype._fireEvent = function _fireEvent(type) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var handler = this._events[this._getEventName(type)];
    handler && this._dir.vm.$nextTick(function () {
      handler.apply(null, args);
    });
  };

  Validator.prototype._fireEvents = function _fireEvents() {
    var scope = this._scope;

    scope.touched && this._fireEvent('touched');
    scope.dirty && this._fireEvent('dirty');

    if (this._modified !== scope.modified) {
      this._fireEvent('modified', scope.modified);
      this._modified = scope.modified;
    }

    var valid = scope.valid;
    this._fireEvent(valid ? 'valid' : 'invalid');
  };

  Validator.prototype._getEventName = function _getEventName(type) {
    return this.name + ':' + type;
  };

  Validator.prototype._defineProperties = function _defineProperties(validationsGetter, targetGetter) {
    var _this10 = this;

    var bind = exports$1.Vue.util.bind;

    each({
      valid: { fn: this._defineValid, arg: validationsGetter },
      invalid: { fn: this._defineInvalid, arg: targetGetter },
      touched: { fn: this._defineTouched, arg: validationsGetter },
      untouched: { fn: this._defineUntouched, arg: targetGetter },
      modified: { fn: this._defineModified, arg: validationsGetter },
      dirty: { fn: this._defineDirty, arg: validationsGetter },
      pristine: { fn: this._definePristine, arg: targetGetter },
      errors: { fn: this._defineErrors, arg: validationsGetter }
    }, function (descriptor, name) {
      Object.defineProperty(targetGetter(), name, {
        enumerable: true,
        configurable: true,
        get: function get() {
          return bind(descriptor.fn, _this10)(descriptor.arg);
        }
      });
    });
  };

  Validator.prototype._runValidates = function _runValidates(fn, cb) {
    var length = Object.keys(this.validations).length;

    var count = 0;
    each(this.validations, function (validation, key) {
      fn(validation, key, function () {
        ++count;
        count >= length && cb();
      });
    });
  };

  Validator.prototype._walkValidations = function _walkValidations(validations, property, condition) {
    var _this11 = this;

    var hasOwn = exports$1.Vue.util.hasOwn;
    var ret = condition;

    each(validations, function (validation, key) {
      if (ret === !condition) {
        return;
      }
      if (hasOwn(_this11._scope, validation.field)) {
        var target = _this11._scope[validation.field];
        if (target && target[property] === !condition) {
          ret = !condition;
        }
      }
    });

    return ret;
  };

  Validator.prototype._defineValid = function _defineValid(validationsGetter) {
    return this._walkValidations(validationsGetter(), 'valid', true);
  };

  Validator.prototype._defineInvalid = function _defineInvalid(scopeGetter) {
    return !scopeGetter().valid;
  };

  Validator.prototype._defineTouched = function _defineTouched(validationsGetter) {
    return this._walkValidations(validationsGetter(), 'touched', false);
  };

  Validator.prototype._defineUntouched = function _defineUntouched(scopeGetter) {
    return !scopeGetter().touched;
  };

  Validator.prototype._defineModified = function _defineModified(validationsGetter) {
    return this._walkValidations(validationsGetter(), 'modified', false);
  };

  Validator.prototype._defineDirty = function _defineDirty(validationsGetter) {
    return this._walkValidations(validationsGetter(), 'dirty', false);
  };

  Validator.prototype._definePristine = function _definePristine(scopeGetter) {
    return !scopeGetter().dirty;
  };

  Validator.prototype._defineErrors = function _defineErrors(validationsGetter) {
    var _this12 = this;

    var hasOwn = exports$1.Vue.util.hasOwn;
    var isPlainObject = exports$1.Vue.util.isPlainObject;
    var errors = [];

    each(validationsGetter(), function (validation, key) {
      if (hasOwn(_this12._scope, validation.field)) {
        var target = _this12._scope[validation.field];
        if (target && !empty(target.errors)) {
          each(target.errors, function (err, index) {
            var error = { field: validation.field };
            if (isPlainObject(err)) {
              if (err.validator) {
                error.validator = err.validator;
              }
              error.message = err.message;
            } else if (typeof err === 'string') {
              error.message = err;
            }
            errors.push(error);
          });
        }
      }
    });

    return empty(errors) ? undefined : errors.sort(function (a, b) {
      return a.field < b.field ? -1 : 1;
    });
  };

  babelHelpers.createClass(Validator, [{
    key: 'validations',
    get: function get() {
      var extend = exports$1.Vue.util.extend;

      var ret = {};
      extend(ret, this._validations);

      each(this._checkboxValidations, function (dataset, key) {
        ret[key] = dataset.validation;
      });

      each(this._radioValidations, function (dataset, key) {
        ret[key] = dataset.validation;
      });

      return ret;
    }
  }]);
  return Validator;
}();

function Validator (Vue) {
  var FragmentFactory = Vue.FragmentFactory;
  var vIf = Vue.directive('if');
  var _Vue$util = Vue.util;
  var isArray = _Vue$util.isArray;
  var isPlainObject = _Vue$util.isPlainObject;
  var createAnchor = _Vue$util.createAnchor;
  var replace = _Vue$util.replace;
  var extend = _Vue$util.extend;
  var camelize = _Vue$util.camelize;

  /**
   * `validator` element directive
   */

  Vue.elementDirective('validator', {
    params: ['name', 'groups', 'lazy', 'classes'],

    bind: function bind() {
      var params = this.params;

      if (process.env.NODE_ENV !== 'production' && !params.name) {
        warn('validator element requires a \'name\' attribute: ' + '(e.g. <validator name="validator1">...</validator>)');
        return;
      }

      this.validatorName = '$' + camelize(params.name);
      if (!this.vm._validatorMaps) {
        throw new Error('Invalid validator management error');
      }

      var classes = {};
      if (isPlainObject(this.params.classes)) {
        classes = this.params.classes;
      }

      this.setupValidator(classes);
      this.setupFragment(params.lazy);
    },
    unbind: function unbind() {
      this.teardownFragment();
      this.teardownValidator();
    },
    getGroups: function getGroups() {
      var params = this.params;
      var groups = [];

      if (params.groups) {
        if (isArray(params.groups)) {
          groups = params.groups;
        } else if (!isPlainObject(params.groups) && typeof params.groups === 'string') {
          groups.push(params.groups);
        }
      }

      return groups;
    },
    setupValidator: function setupValidator(classes) {
      var validator = this.validator = new Validator$1(this.validatorName, this, this.getGroups(), classes);
      validator.enableReactive();
      validator.setupScope();
      validator.registerEvents();
    },
    teardownValidator: function teardownValidator() {
      this.validator.unregisterEvents();
      this.validator.disableReactive();

      if (this.validatorName) {
        this.validatorName = null;
        this.validator = null;
      }
    },
    setupFragment: function setupFragment(lazy) {
      var _this = this;

      var vm = this.vm;

      this.validator.waitFor(function () {
        _this.anchor = createAnchor('vue-validator');
        replace(_this.el, _this.anchor);
        extend(vm.$options, { _validator: _this.validatorName });
        _this.factory = new FragmentFactory(vm, _this.el.innerHTML);
        vIf.insert.call(_this);
      });

      !lazy && vm.$activateValidator();
    },
    teardownFragment: function teardownFragment() {
      vIf.unbind.call(this);
    }
  });
}

function ValidatorError (Vue) {
  /**
   * ValidatorError component
   */

  var error = {
    name: 'validator-error',

    props: {
      field: {
        type: String,
        required: true
      },
      validator: {
        type: String
      },
      message: {
        type: String,
        required: true
      },
      partial: {
        type: String,
        default: 'validator-error-default'
      }
    },

    template: '<div><partial :name="partial"></partial></div>',

    partials: {}
  };

  // only use ValidatorError component
  error.partials['validator-error-default'] = '<p>{{field}}: {{message}}</p>';

  return error;
}

function Errors (Vue) {
  var _ = Vue.util;
  var error = ValidatorError(Vue); // import ValidatorError component

  /**
   * ValidatorErrors component
   */

  var errors = {
    name: 'validator-errors',

    props: {
      validation: {
        type: Object,
        required: true
      },
      group: {
        type: String,
        default: null
      },
      field: {
        type: String,
        default: null
      },
      component: {
        type: String,
        default: 'validator-error'
      }
    },

    computed: {
      errors: function errors() {
        var _this = this;

        if (this.group !== null) {
          return this.validation[this.group].errors;
        } else if (this.field !== null) {
          var target = this.validation[this.field];
          if (!target.errors) {
            return;
          }

          return target.errors.map(function (error) {
            var err = { field: _this.field };
            if (_.isPlainObject(error)) {
              if (error.validator) {
                err.validator = error.validator;
              }
              err.message = error.message;
            } else if (typeof error === 'string') {
              err.message = error;
            }
            return err;
          });
        } else {
          return this.validation.errors;
        }
      }
    },

    template: '<template v-for="error in errors">' + '<component :is="component" :partial="partial" :field="error.field" :validator="error.validator" :message="error.message">' + '</component>' + '</template>',

    components: {}
  };

  // define 'partial' prop
  errors.props['partial'] = error.props['partial'];

  // only use ValidatorErrors component
  errors.components[error.name] = error;

  // install ValidatorErrors component
  Vue.component(errors.name, errors);

  return errors;
}

/**
 * plugin
 *
 * @param {Function} Vue
 * @param {Object} options
 */

function plugin(Vue) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (plugin.installed) {
    warn('already installed.');
    return;
  }

  exports$1.Vue = Vue;
  Asset(Vue);
  Errors(Vue);

  Override(Vue);
  Validator(Vue);
  ValidateClass(Vue);
  Validate(Vue);
}

plugin.version = '2.1.3';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

module.exports = plugin;
}).call(this,require('_process'))
},{"_process":1}],3:[function(require,module,exports){
(function (process,global){
/*!
 * Vue.js v1.0.21
 * (c) 2016 Evan You
 * Released under the MIT License.
 */
'use strict';

function set(obj, key, val) {
  if (hasOwn(obj, key)) {
    obj[key] = val;
    return;
  }
  if (obj._isVue) {
    set(obj._data, key, val);
    return;
  }
  var ob = obj.__ob__;
  if (!ob) {
    obj[key] = val;
    return;
  }
  ob.convert(key, val);
  ob.dep.notify();
  if (ob.vms) {
    var i = ob.vms.length;
    while (i--) {
      var vm = ob.vms[i];
      vm._proxy(key);
      vm._digest();
    }
  }
  return val;
}

/**
 * Delete a property and trigger change if necessary.
 *
 * @param {Object} obj
 * @param {String} key
 */

function del(obj, key) {
  if (!hasOwn(obj, key)) {
    return;
  }
  delete obj[key];
  var ob = obj.__ob__;
  if (!ob) {
    return;
  }
  ob.dep.notify();
  if (ob.vms) {
    var i = ob.vms.length;
    while (i--) {
      var vm = ob.vms[i];
      vm._unproxy(key);
      vm._digest();
    }
  }
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Check whether the object has the property.
 *
 * @param {Object} obj
 * @param {String} key
 * @return {Boolean}
 */

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

/**
 * Check if an expression is a literal value.
 *
 * @param {String} exp
 * @return {Boolean}
 */

var literalValueRE = /^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/;

function isLiteral(exp) {
  return literalValueRE.test(exp);
}

/**
 * Check if a string starts with $ or _
 *
 * @param {String} str
 * @return {Boolean}
 */

function isReserved(str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F;
}

/**
 * Guard text output, make sure undefined outputs
 * empty string
 *
 * @param {*} value
 * @return {String}
 */

function _toString(value) {
  return value == null ? '' : value.toString();
}

/**
 * Check and convert possible numeric strings to numbers
 * before setting back to data
 *
 * @param {*} value
 * @return {*|Number}
 */

function toNumber(value) {
  if (typeof value !== 'string') {
    return value;
  } else {
    var parsed = Number(value);
    return isNaN(parsed) ? value : parsed;
  }
}

/**
 * Convert string boolean literals into real booleans.
 *
 * @param {*} value
 * @return {*|Boolean}
 */

function toBoolean(value) {
  return value === 'true' ? true : value === 'false' ? false : value;
}

/**
 * Strip quotes from a string
 *
 * @param {String} str
 * @return {String | false}
 */

function stripQuotes(str) {
  var a = str.charCodeAt(0);
  var b = str.charCodeAt(str.length - 1);
  return a === b && (a === 0x22 || a === 0x27) ? str.slice(1, -1) : str;
}

/**
 * Camelize a hyphen-delmited string.
 *
 * @param {String} str
 * @return {String}
 */

var camelizeRE = /-(\w)/g;

function camelize(str) {
  return str.replace(camelizeRE, toUpper);
}

function toUpper(_, c) {
  return c ? c.toUpperCase() : '';
}

/**
 * Hyphenate a camelCase string.
 *
 * @param {String} str
 * @return {String}
 */

var hyphenateRE = /([a-z\d])([A-Z])/g;

function hyphenate(str) {
  return str.replace(hyphenateRE, '$1-$2').toLowerCase();
}

/**
 * Converts hyphen/underscore/slash delimitered names into
 * camelized classNames.
 *
 * e.g. my-component => MyComponent
 *      some_else    => SomeElse
 *      some/comp    => SomeComp
 *
 * @param {String} str
 * @return {String}
 */

var classifyRE = /(?:^|[-_\/])(\w)/g;

function classify(str) {
  return str.replace(classifyRE, toUpper);
}

/**
 * Simple bind, faster than native
 *
 * @param {Function} fn
 * @param {Object} ctx
 * @return {Function}
 */

function bind(fn, ctx) {
  return function (a) {
    var l = arguments.length;
    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
  };
}

/**
 * Convert an Array-like object to a real Array.
 *
 * @param {Array-like} list
 * @param {Number} [start] - start index
 * @return {Array}
 */

function toArray(list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
}

/**
 * Mix properties into target object.
 *
 * @param {Object} to
 * @param {Object} from
 */

function extend(to, from) {
  var keys = Object.keys(from);
  var i = keys.length;
  while (i--) {
    to[keys[i]] = from[keys[i]];
  }
  return to;
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 *
 * @param {*} obj
 * @return {Boolean}
 */

function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {*} obj
 * @return {Boolean}
 */

var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';

function isPlainObject(obj) {
  return toString.call(obj) === OBJECT_STRING;
}

/**
 * Array type check.
 *
 * @param {*} obj
 * @return {Boolean}
 */

var isArray = Array.isArray;

/**
 * Define a property.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 * @param {Boolean} [enumerable]
 */

function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Debounce a function so it only gets called after the
 * input stops arriving after the given wait period.
 *
 * @param {Function} func
 * @param {Number} wait
 * @return {Function} - the debounced function
 */

function _debounce(func, wait) {
  var timeout, args, context, timestamp, result;
  var later = function later() {
    var last = Date.now() - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    }
  };
  return function () {
    context = this;
    args = arguments;
    timestamp = Date.now();
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    return result;
  };
}

/**
 * Manual indexOf because it's slightly faster than
 * native.
 *
 * @param {Array} arr
 * @param {*} obj
 */

function indexOf(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) return i;
  }
  return -1;
}

/**
 * Make a cancellable version of an async callback.
 *
 * @param {Function} fn
 * @return {Function}
 */

function cancellable(fn) {
  var cb = function cb() {
    if (!cb.cancelled) {
      return fn.apply(this, arguments);
    }
  };
  cb.cancel = function () {
    cb.cancelled = true;
  };
  return cb;
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 *
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 */

function looseEqual(a, b) {
  /* eslint-disable eqeqeq */
  return a == b || (isObject(a) && isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false);
  /* eslint-enable eqeqeq */
}

var hasProto = ('__proto__' in {});

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

// UA sniffing for working around browser-specific quirks
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;

var transitionProp = undefined;
var transitionEndEvent = undefined;
var animationProp = undefined;
var animationEndEvent = undefined;

// Transition property/event sniffing
if (inBrowser && !isIE9) {
  var isWebkitTrans = window.ontransitionend === undefined && window.onwebkittransitionend !== undefined;
  var isWebkitAnim = window.onanimationend === undefined && window.onwebkitanimationend !== undefined;
  transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition';
  transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend';
  animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation';
  animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend';
}

/**
 * Defer a task to execute it asynchronously. Ideally this
 * should be executed as a microtask, so we leverage
 * MutationObserver if it's available, and fallback to
 * setTimeout(0).
 *
 * @param {Function} cb
 * @param {Object} ctx
 */

var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;
  function nextTickHandler() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks = [];
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  /* istanbul ignore if */
  if (typeof MutationObserver !== 'undefined') {
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(counter);
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = counter;
    };
  } else {
    // webpack attempts to inject a shim for setImmediate
    // if it is used as a global, so we have to work around that to
    // avoid bundling unnecessary code.
    var context = inBrowser ? window : typeof global !== 'undefined' ? global : {};
    timerFunc = context.setImmediate || setTimeout;
  }
  return function (cb, ctx) {
    var func = ctx ? function () {
      cb.call(ctx);
    } : cb;
    callbacks.push(func);
    if (pending) return;
    pending = true;
    timerFunc(nextTickHandler, 0);
  };
})();

function Cache(limit) {
  this.size = 0;
  this.limit = limit;
  this.head = this.tail = undefined;
  this._keymap = Object.create(null);
}

var p = Cache.prototype;

/**
 * Put <value> into the cache associated with <key>.
 * Returns the entry which was removed to make room for
 * the new entry. Otherwise undefined is returned.
 * (i.e. if there was enough room already).
 *
 * @param {String} key
 * @param {*} value
 * @return {Entry|undefined}
 */

p.put = function (key, value) {
  var removed;
  if (this.size === this.limit) {
    removed = this.shift();
  }

  var entry = this.get(key, true);
  if (!entry) {
    entry = {
      key: key
    };
    this._keymap[key] = entry;
    if (this.tail) {
      this.tail.newer = entry;
      entry.older = this.tail;
    } else {
      this.head = entry;
    }
    this.tail = entry;
    this.size++;
  }
  entry.value = value;

  return removed;
};

/**
 * Purge the least recently used (oldest) entry from the
 * cache. Returns the removed entry or undefined if the
 * cache was empty.
 */

p.shift = function () {
  var entry = this.head;
  if (entry) {
    this.head = this.head.newer;
    this.head.older = undefined;
    entry.newer = entry.older = undefined;
    this._keymap[entry.key] = undefined;
    this.size--;
  }
  return entry;
};

/**
 * Get and register recent use of <key>. Returns the value
 * associated with <key> or undefined if not in cache.
 *
 * @param {String} key
 * @param {Boolean} returnEntry
 * @return {Entry|*}
 */

p.get = function (key, returnEntry) {
  var entry = this._keymap[key];
  if (entry === undefined) return;
  if (entry === this.tail) {
    return returnEntry ? entry : entry.value;
  }
  // HEAD--------------TAIL
  //   <.older   .newer>
  //  <--- add direction --
  //   A  B  C  <D>  E
  if (entry.newer) {
    if (entry === this.head) {
      this.head = entry.newer;
    }
    entry.newer.older = entry.older; // C <-- E.
  }
  if (entry.older) {
    entry.older.newer = entry.newer; // C. --> E
  }
  entry.newer = undefined; // D --x
  entry.older = this.tail; // D. --> E
  if (this.tail) {
    this.tail.newer = entry; // E. <-- D
  }
  this.tail = entry;
  return returnEntry ? entry : entry.value;
};

var cache$1 = new Cache(1000);
var filterTokenRE = /[^\s'"]+|'[^']*'|"[^"]*"/g;
var reservedArgRE = /^in$|^-?\d+/;

/**
 * Parser state
 */

var str;
var dir;
var c;
var prev;
var i;
var l;
var lastFilterIndex;
var inSingle;
var inDouble;
var curly;
var square;
var paren;
/**
 * Push a filter to the current directive object
 */

function pushFilter() {
  var exp = str.slice(lastFilterIndex, i).trim();
  var filter;
  if (exp) {
    filter = {};
    var tokens = exp.match(filterTokenRE);
    filter.name = tokens[0];
    if (tokens.length > 1) {
      filter.args = tokens.slice(1).map(processFilterArg);
    }
  }
  if (filter) {
    (dir.filters = dir.filters || []).push(filter);
  }
  lastFilterIndex = i + 1;
}

/**
 * Check if an argument is dynamic and strip quotes.
 *
 * @param {String} arg
 * @return {Object}
 */

function processFilterArg(arg) {
  if (reservedArgRE.test(arg)) {
    return {
      value: toNumber(arg),
      dynamic: false
    };
  } else {
    var stripped = stripQuotes(arg);
    var dynamic = stripped === arg;
    return {
      value: dynamic ? arg : stripped,
      dynamic: dynamic
    };
  }
}

/**
 * Parse a directive value and extract the expression
 * and its filters into a descriptor.
 *
 * Example:
 *
 * "a + 1 | uppercase" will yield:
 * {
 *   expression: 'a + 1',
 *   filters: [
 *     { name: 'uppercase', args: null }
 *   ]
 * }
 *
 * @param {String} s
 * @return {Object}
 */

function parseDirective(s) {
  var hit = cache$1.get(s);
  if (hit) {
    return hit;
  }

  // reset parser state
  str = s;
  inSingle = inDouble = false;
  curly = square = paren = 0;
  lastFilterIndex = 0;
  dir = {};

  for (i = 0, l = str.length; i < l; i++) {
    prev = c;
    c = str.charCodeAt(i);
    if (inSingle) {
      // check single quote
      if (c === 0x27 && prev !== 0x5C) inSingle = !inSingle;
    } else if (inDouble) {
      // check double quote
      if (c === 0x22 && prev !== 0x5C) inDouble = !inDouble;
    } else if (c === 0x7C && // pipe
    str.charCodeAt(i + 1) !== 0x7C && str.charCodeAt(i - 1) !== 0x7C) {
      if (dir.expression == null) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        dir.expression = str.slice(0, i).trim();
      } else {
        // already has filter
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22:
          inDouble = true;break; // "
        case 0x27:
          inSingle = true;break; // '
        case 0x28:
          paren++;break; // (
        case 0x29:
          paren--;break; // )
        case 0x5B:
          square++;break; // [
        case 0x5D:
          square--;break; // ]
        case 0x7B:
          curly++;break; // {
        case 0x7D:
          curly--;break; // }
      }
    }
  }

  if (dir.expression == null) {
    dir.expression = str.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  cache$1.put(s, dir);
  return dir;
}

var directive = Object.freeze({
  parseDirective: parseDirective
});

var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
var cache = undefined;
var tagRE = undefined;
var htmlRE = undefined;
/**
 * Escape a string so it can be used in a RegExp
 * constructor.
 *
 * @param {String} str
 */

function escapeRegex(str) {
  return str.replace(regexEscapeRE, '\\$&');
}

function compileRegex() {
  var open = escapeRegex(config.delimiters[0]);
  var close = escapeRegex(config.delimiters[1]);
  var unsafeOpen = escapeRegex(config.unsafeDelimiters[0]);
  var unsafeClose = escapeRegex(config.unsafeDelimiters[1]);
  tagRE = new RegExp(unsafeOpen + '((?:.|\\n)+?)' + unsafeClose + '|' + open + '((?:.|\\n)+?)' + close, 'g');
  htmlRE = new RegExp('^' + unsafeOpen + '.*' + unsafeClose + '$');
  // reset cache
  cache = new Cache(1000);
}

/**
 * Parse a template text string into an array of tokens.
 *
 * @param {String} text
 * @return {Array<Object> | null}
 *               - {String} type
 *               - {String} value
 *               - {Boolean} [html]
 *               - {Boolean} [oneTime]
 */

function parseText(text) {
  if (!cache) {
    compileRegex();
  }
  var hit = cache.get(text);
  if (hit) {
    return hit;
  }
  if (!tagRE.test(text)) {
    return null;
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, html, value, first, oneTime;
  /* eslint-disable no-cond-assign */
  while (match = tagRE.exec(text)) {
    /* eslint-enable no-cond-assign */
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push({
        value: text.slice(lastIndex, index)
      });
    }
    // tag token
    html = htmlRE.test(match[0]);
    value = html ? match[1] : match[2];
    first = value.charCodeAt(0);
    oneTime = first === 42; // *
    value = oneTime ? value.slice(1) : value;
    tokens.push({
      tag: true,
      value: value.trim(),
      html: html,
      oneTime: oneTime
    });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push({
      value: text.slice(lastIndex)
    });
  }
  cache.put(text, tokens);
  return tokens;
}

/**
 * Format a list of tokens into an expression.
 * e.g. tokens parsed from 'a {{b}} c' can be serialized
 * into one single expression as '"a " + b + " c"'.
 *
 * @param {Array} tokens
 * @param {Vue} [vm]
 * @return {String}
 */

function tokensToExp(tokens, vm) {
  if (tokens.length > 1) {
    return tokens.map(function (token) {
      return formatToken(token, vm);
    }).join('+');
  } else {
    return formatToken(tokens[0], vm, true);
  }
}

/**
 * Format a single token.
 *
 * @param {Object} token
 * @param {Vue} [vm]
 * @param {Boolean} [single]
 * @return {String}
 */

function formatToken(token, vm, single) {
  return token.tag ? token.oneTime && vm ? '"' + vm.$eval(token.value) + '"' : inlineFilters(token.value, single) : '"' + token.value + '"';
}

/**
 * For an attribute with multiple interpolation tags,
 * e.g. attr="some-{{thing | filter}}", in order to combine
 * the whole thing into a single watchable expression, we
 * have to inline those filters. This function does exactly
 * that. This is a bit hacky but it avoids heavy changes
 * to directive parser and watcher mechanism.
 *
 * @param {String} exp
 * @param {Boolean} single
 * @return {String}
 */

var filterRE = /[^|]\|[^|]/;
function inlineFilters(exp, single) {
  if (!filterRE.test(exp)) {
    return single ? exp : '(' + exp + ')';
  } else {
    var dir = parseDirective(exp);
    if (!dir.filters) {
      return '(' + exp + ')';
    } else {
      return 'this._applyFilters(' + dir.expression + // value
      ',null,' + // oldValue (null for read)
      JSON.stringify(dir.filters) + // filter descriptors
      ',false)'; // write?
    }
  }
}

var text = Object.freeze({
  compileRegex: compileRegex,
  parseText: parseText,
  tokensToExp: tokensToExp
});

var delimiters = ['{{', '}}'];
var unsafeDelimiters = ['{{{', '}}}'];

var config = Object.defineProperties({

  /**
   * Whether to print debug messages.
   * Also enables stack trace for warnings.
   *
   * @type {Boolean}
   */

  debug: false,

  /**
   * Whether to suppress warnings.
   *
   * @type {Boolean}
   */

  silent: false,

  /**
   * Whether to use async rendering.
   */

  async: true,

  /**
   * Whether to warn against errors caught when evaluating
   * expressions.
   */

  warnExpressionErrors: true,

  /**
   * Whether to allow devtools inspection.
   * Disabled by default in production builds.
   */

  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Internal flag to indicate the delimiters have been
   * changed.
   *
   * @type {Boolean}
   */

  _delimitersChanged: true,

  /**
   * List of asset types that a component can own.
   *
   * @type {Array}
   */

  _assetTypes: ['component', 'directive', 'elementDirective', 'filter', 'transition', 'partial'],

  /**
   * prop binding modes
   */

  _propBindingModes: {
    ONE_WAY: 0,
    TWO_WAY: 1,
    ONE_TIME: 2
  },

  /**
   * Max circular updates allowed in a batcher flush cycle.
   */

  _maxUpdateCount: 100

}, {
  delimiters: { /**
                 * Interpolation delimiters. Changing these would trigger
                 * the text parser to re-compile the regular expressions.
                 *
                 * @type {Array<String>}
                 */

    get: function get() {
      return delimiters;
    },
    set: function set(val) {
      delimiters = val;
      compileRegex();
    },
    configurable: true,
    enumerable: true
  },
  unsafeDelimiters: {
    get: function get() {
      return unsafeDelimiters;
    },
    set: function set(val) {
      unsafeDelimiters = val;
      compileRegex();
    },
    configurable: true,
    enumerable: true
  }
});

var warn = undefined;
var formatComponentName = undefined;

if (process.env.NODE_ENV !== 'production') {
  (function () {
    var hasConsole = typeof console !== 'undefined';

    warn = function (msg, vm) {
      if (hasConsole && !config.silent) {
        console.error('[Vue warn]: ' + msg + (vm ? formatComponentName(vm) : ''));
      }
    };

    formatComponentName = function (vm) {
      var name = vm._isVue ? vm.$options.name : vm.name;
      return name ? ' (found in component: <' + hyphenate(name) + '>)' : '';
    };
  })();
}

/**
 * Append with transition.
 *
 * @param {Element} el
 * @param {Element} target
 * @param {Vue} vm
 * @param {Function} [cb]
 */

function appendWithTransition(el, target, vm, cb) {
  applyTransition(el, 1, function () {
    target.appendChild(el);
  }, vm, cb);
}

/**
 * InsertBefore with transition.
 *
 * @param {Element} el
 * @param {Element} target
 * @param {Vue} vm
 * @param {Function} [cb]
 */

function beforeWithTransition(el, target, vm, cb) {
  applyTransition(el, 1, function () {
    before(el, target);
  }, vm, cb);
}

/**
 * Remove with transition.
 *
 * @param {Element} el
 * @param {Vue} vm
 * @param {Function} [cb]
 */

function removeWithTransition(el, vm, cb) {
  applyTransition(el, -1, function () {
    remove(el);
  }, vm, cb);
}

/**
 * Apply transitions with an operation callback.
 *
 * @param {Element} el
 * @param {Number} direction
 *                  1: enter
 *                 -1: leave
 * @param {Function} op - the actual DOM operation
 * @param {Vue} vm
 * @param {Function} [cb]
 */

function applyTransition(el, direction, op, vm, cb) {
  var transition = el.__v_trans;
  if (!transition ||
  // skip if there are no js hooks and CSS transition is
  // not supported
  !transition.hooks && !transitionEndEvent ||
  // skip transitions for initial compile
  !vm._isCompiled ||
  // if the vm is being manipulated by a parent directive
  // during the parent's compilation phase, skip the
  // animation.
  vm.$parent && !vm.$parent._isCompiled) {
    op();
    if (cb) cb();
    return;
  }
  var action = direction > 0 ? 'enter' : 'leave';
  transition[action](op, cb);
}

var transition = Object.freeze({
  appendWithTransition: appendWithTransition,
  beforeWithTransition: beforeWithTransition,
  removeWithTransition: removeWithTransition,
  applyTransition: applyTransition
});

/**
 * Query an element selector if it's not an element already.
 *
 * @param {String|Element} el
 * @return {Element}
 */

function query(el) {
  if (typeof el === 'string') {
    var selector = el;
    el = document.querySelector(el);
    if (!el) {
      process.env.NODE_ENV !== 'production' && warn('Cannot find element: ' + selector);
    }
  }
  return el;
}

/**
 * Check if a node is in the document.
 * Note: document.documentElement.contains should work here
 * but always returns false for comment nodes in phantomjs,
 * making unit tests difficult. This is fixed by doing the
 * contains() check on the node's parentNode instead of
 * the node itself.
 *
 * @param {Node} node
 * @return {Boolean}
 */

function inDoc(node) {
  var doc = document.documentElement;
  var parent = node && node.parentNode;
  return doc === node || doc === parent || !!(parent && parent.nodeType === 1 && doc.contains(parent));
}

/**
 * Get and remove an attribute from a node.
 *
 * @param {Node} node
 * @param {String} _attr
 */

function getAttr(node, _attr) {
  var val = node.getAttribute(_attr);
  if (val !== null) {
    node.removeAttribute(_attr);
  }
  return val;
}

/**
 * Get an attribute with colon or v-bind: prefix.
 *
 * @param {Node} node
 * @param {String} name
 * @return {String|null}
 */

function getBindAttr(node, name) {
  var val = getAttr(node, ':' + name);
  if (val === null) {
    val = getAttr(node, 'v-bind:' + name);
  }
  return val;
}

/**
 * Check the presence of a bind attribute.
 *
 * @param {Node} node
 * @param {String} name
 * @return {Boolean}
 */

function hasBindAttr(node, name) {
  return node.hasAttribute(name) || node.hasAttribute(':' + name) || node.hasAttribute('v-bind:' + name);
}

/**
 * Insert el before target
 *
 * @param {Element} el
 * @param {Element} target
 */

function before(el, target) {
  target.parentNode.insertBefore(el, target);
}

/**
 * Insert el after target
 *
 * @param {Element} el
 * @param {Element} target
 */

function after(el, target) {
  if (target.nextSibling) {
    before(el, target.nextSibling);
  } else {
    target.parentNode.appendChild(el);
  }
}

/**
 * Remove el from DOM
 *
 * @param {Element} el
 */

function remove(el) {
  el.parentNode.removeChild(el);
}

/**
 * Prepend el to target
 *
 * @param {Element} el
 * @param {Element} target
 */

function prepend(el, target) {
  if (target.firstChild) {
    before(el, target.firstChild);
  } else {
    target.appendChild(el);
  }
}

/**
 * Replace target with el
 *
 * @param {Element} target
 * @param {Element} el
 */

function replace(target, el) {
  var parent = target.parentNode;
  if (parent) {
    parent.replaceChild(el, target);
  }
}

/**
 * Add event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 * @param {Boolean} [useCapture]
 */

function on(el, event, cb, useCapture) {
  el.addEventListener(event, cb, useCapture);
}

/**
 * Remove event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 */

function off(el, event, cb) {
  el.removeEventListener(event, cb);
}

/**
 * For IE9 compat: when both class and :class are present
 * getAttribute('class') returns wrong value...
 *
 * @param {Element} el
 * @return {String}
 */

function getClass(el) {
  var classname = el.className;
  if (typeof classname === 'object') {
    classname = classname.baseVal || '';
  }
  return classname;
}

/**
 * In IE9, setAttribute('class') will result in empty class
 * if the element also has the :class attribute; However in
 * PhantomJS, setting `className` does not work on SVG elements...
 * So we have to do a conditional check here.
 *
 * @param {Element} el
 * @param {String} cls
 */

function setClass(el, cls) {
  /* istanbul ignore if */
  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
    el.className = cls;
  } else {
    el.setAttribute('class', cls);
  }
}

/**
 * Add class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {String} cls
 */

function addClass(el, cls) {
  if (el.classList) {
    el.classList.add(cls);
  } else {
    var cur = ' ' + getClass(el) + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      setClass(el, (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {String} cls
 */

function removeClass(el, cls) {
  if (el.classList) {
    el.classList.remove(cls);
  } else {
    var cur = ' ' + getClass(el) + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    setClass(el, cur.trim());
  }
  if (!el.className) {
    el.removeAttribute('class');
  }
}

/**
 * Extract raw content inside an element into a temporary
 * container div
 *
 * @param {Element} el
 * @param {Boolean} asFragment
 * @return {Element|DocumentFragment}
 */

function extractContent(el, asFragment) {
  var child;
  var rawContent;
  /* istanbul ignore if */
  if (isTemplate(el) && isFragment(el.content)) {
    el = el.content;
  }
  if (el.hasChildNodes()) {
    trimNode(el);
    rawContent = asFragment ? document.createDocumentFragment() : document.createElement('div');
    /* eslint-disable no-cond-assign */
    while (child = el.firstChild) {
      /* eslint-enable no-cond-assign */
      rawContent.appendChild(child);
    }
  }
  return rawContent;
}

/**
 * Trim possible empty head/tail text and comment
 * nodes inside a parent.
 *
 * @param {Node} node
 */

function trimNode(node) {
  var child;
  /* eslint-disable no-sequences */
  while ((child = node.firstChild, isTrimmable(child))) {
    node.removeChild(child);
  }
  while ((child = node.lastChild, isTrimmable(child))) {
    node.removeChild(child);
  }
  /* eslint-enable no-sequences */
}

function isTrimmable(node) {
  return node && (node.nodeType === 3 && !node.data.trim() || node.nodeType === 8);
}

/**
 * Check if an element is a template tag.
 * Note if the template appears inside an SVG its tagName
 * will be in lowercase.
 *
 * @param {Element} el
 */

function isTemplate(el) {
  return el.tagName && el.tagName.toLowerCase() === 'template';
}

/**
 * Create an "anchor" for performing dom insertion/removals.
 * This is used in a number of scenarios:
 * - fragment instance
 * - v-html
 * - v-if
 * - v-for
 * - component
 *
 * @param {String} content
 * @param {Boolean} persist - IE trashes empty textNodes on
 *                            cloneNode(true), so in certain
 *                            cases the anchor needs to be
 *                            non-empty to be persisted in
 *                            templates.
 * @return {Comment|Text}
 */

function createAnchor(content, persist) {
  var anchor = config.debug ? document.createComment(content) : document.createTextNode(persist ? ' ' : '');
  anchor.__v_anchor = true;
  return anchor;
}

/**
 * Find a component ref attribute that starts with $.
 *
 * @param {Element} node
 * @return {String|undefined}
 */

var refRE = /^v-ref:/;

function findRef(node) {
  if (node.hasAttributes()) {
    var attrs = node.attributes;
    for (var i = 0, l = attrs.length; i < l; i++) {
      var name = attrs[i].name;
      if (refRE.test(name)) {
        return camelize(name.replace(refRE, ''));
      }
    }
  }
}

/**
 * Map a function to a range of nodes .
 *
 * @param {Node} node
 * @param {Node} end
 * @param {Function} op
 */

function mapNodeRange(node, end, op) {
  var next;
  while (node !== end) {
    next = node.nextSibling;
    op(node);
    node = next;
  }
  op(end);
}

/**
 * Remove a range of nodes with transition, store
 * the nodes in a fragment with correct ordering,
 * and call callback when done.
 *
 * @param {Node} start
 * @param {Node} end
 * @param {Vue} vm
 * @param {DocumentFragment} frag
 * @param {Function} cb
 */

function removeNodeRange(start, end, vm, frag, cb) {
  var done = false;
  var removed = 0;
  var nodes = [];
  mapNodeRange(start, end, function (node) {
    if (node === end) done = true;
    nodes.push(node);
    removeWithTransition(node, vm, onRemoved);
  });
  function onRemoved() {
    removed++;
    if (done && removed >= nodes.length) {
      for (var i = 0; i < nodes.length; i++) {
        frag.appendChild(nodes[i]);
      }
      cb && cb();
    }
  }
}

/**
 * Check if a node is a DocumentFragment.
 *
 * @param {Node} node
 * @return {Boolean}
 */

function isFragment(node) {
  return node && node.nodeType === 11;
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 *
 * @param {Element} el
 * @return {String}
 */

function getOuterHTML(el) {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

var commonTagRE = /^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/i;
var reservedTagRE = /^(slot|partial|component)$/i;

var isUnknownElement = undefined;
if (process.env.NODE_ENV !== 'production') {
  isUnknownElement = function (el, tag) {
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
    } else {
      return (/HTMLUnknownElement/.test(el.toString()) &&
        // Chrome returns unknown for several HTML5 elements.
        // https://code.google.com/p/chromium/issues/detail?id=540526
        !/^(data|time|rtc|rb)$/.test(tag)
      );
    }
  };
}

/**
 * Check if an element is a component, if yes return its
 * component id.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Object|undefined}
 */

function checkComponentAttr(el, options) {
  var tag = el.tagName.toLowerCase();
  var hasAttrs = el.hasAttributes();
  if (!commonTagRE.test(tag) && !reservedTagRE.test(tag)) {
    if (resolveAsset(options, 'components', tag)) {
      return { id: tag };
    } else {
      var is = hasAttrs && getIsBinding(el);
      if (is) {
        return is;
      } else if (process.env.NODE_ENV !== 'production') {
        var expectedTag = options._componentNameMap && options._componentNameMap[tag];
        if (expectedTag) {
          warn('Unknown custom element: <' + tag + '> - ' + 'did you mean <' + expectedTag + '>? ' + 'HTML is case-insensitive, remember to use kebab-case in templates.');
        } else if (isUnknownElement(el, tag)) {
          warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.');
        }
      }
    }
  } else if (hasAttrs) {
    return getIsBinding(el);
  }
}

/**
 * Get "is" binding from an element.
 *
 * @param {Element} el
 * @return {Object|undefined}
 */

function getIsBinding(el) {
  // dynamic syntax
  var exp = getAttr(el, 'is');
  if (exp != null) {
    return { id: exp };
  } else {
    exp = getBindAttr(el, 'is');
    if (exp != null) {
      return { id: exp, dynamic: true };
    }
  }
}

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 *
 * All strategy functions follow the same signature:
 *
 * @param {*} parentVal
 * @param {*} childVal
 * @param {Vue} [vm]
 */

var strats = config.optionMergeStrategies = Object.create(null);

/**
 * Helper that recursively merges two data objects together.
 */

function mergeData(to, from) {
  var key, toVal, fromVal;
  for (key in from) {
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isObject(toVal) && isObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to;
}

/**
 * Data
 */

strats.data = function (parentVal, childVal, vm) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal;
    }
    if (typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
      return parentVal;
    }
    if (!parentVal) {
      return childVal;
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn() {
      return mergeData(childVal.call(this), parentVal.call(this));
    };
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn() {
      // instance merge
      var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData);
      } else {
        return defaultData;
      }
    };
  }
};

/**
 * El
 */

strats.el = function (parentVal, childVal, vm) {
  if (!vm && childVal && typeof childVal !== 'function') {
    process.env.NODE_ENV !== 'production' && warn('The "el" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
    return;
  }
  var ret = childVal || parentVal;
  // invoke the element factory if this is instance merge
  return vm && typeof ret === 'function' ? ret.call(vm) : ret;
};

/**
 * Hooks and param attributes are merged as arrays.
 */

strats.init = strats.created = strats.ready = strats.attached = strats.detached = strats.beforeCompile = strats.compiled = strats.beforeDestroy = strats.destroyed = strats.activate = function (parentVal, childVal) {
  return childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
};

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */

function mergeAssets(parentVal, childVal) {
  var res = Object.create(parentVal);
  return childVal ? extend(res, guardArrayAssets(childVal)) : res;
}

config._assetTypes.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Events & Watchers.
 *
 * Events & watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */

strats.watch = strats.events = function (parentVal, childVal) {
  if (!childVal) return parentVal;
  if (!parentVal) return childVal;
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent ? parent.concat(child) : [child];
  }
  return ret;
};

/**
 * Other object hashes.
 */

strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
  if (!childVal) return parentVal;
  if (!parentVal) return childVal;
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret;
};

/**
 * Default strategy.
 */

var defaultStrat = function defaultStrat(parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal;
};

/**
 * Make sure component options get converted to actual
 * constructors.
 *
 * @param {Object} options
 */

function guardComponents(options) {
  if (options.components) {
    var components = options.components = guardArrayAssets(options.components);
    var ids = Object.keys(components);
    var def;
    if (process.env.NODE_ENV !== 'production') {
      var map = options._componentNameMap = {};
    }
    for (var i = 0, l = ids.length; i < l; i++) {
      var key = ids[i];
      if (commonTagRE.test(key) || reservedTagRE.test(key)) {
        process.env.NODE_ENV !== 'production' && warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + key);
        continue;
      }
      // record a all lowercase <-> kebab-case mapping for
      // possible custom element case error warning
      if (process.env.NODE_ENV !== 'production') {
        map[key.replace(/-/g, '').toLowerCase()] = hyphenate(key);
      }
      def = components[key];
      if (isPlainObject(def)) {
        components[key] = Vue.extend(def);
      }
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 *
 * @param {Object} options
 */

function guardProps(options) {
  var props = options.props;
  var i, val;
  if (isArray(props)) {
    options.props = {};
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        options.props[val] = null;
      } else if (val.name) {
        options.props[val.name] = val;
      }
    }
  } else if (isPlainObject(props)) {
    var keys = Object.keys(props);
    i = keys.length;
    while (i--) {
      val = props[keys[i]];
      if (typeof val === 'function') {
        props[keys[i]] = { type: val };
      }
    }
  }
}

/**
 * Guard an Array-format assets option and converted it
 * into the key-value Object format.
 *
 * @param {Object|Array} assets
 * @return {Object}
 */

function guardArrayAssets(assets) {
  if (isArray(assets)) {
    var res = {};
    var i = assets.length;
    var asset;
    while (i--) {
      asset = assets[i];
      var id = typeof asset === 'function' ? asset.options && asset.options.name || asset.id : asset.name || asset.id;
      if (!id) {
        process.env.NODE_ENV !== 'production' && warn('Array-syntax assets must provide a "name" or "id" field.');
      } else {
        res[id] = asset;
      }
    }
    return res;
  }
  return assets;
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 *
 * @param {Object} parent
 * @param {Object} child
 * @param {Vue} [vm] - if vm is present, indicates this is
 *                     an instantiation merge.
 */

function mergeOptions(parent, child, vm) {
  guardComponents(child);
  guardProps(child);
  var options = {};
  var key;
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options;
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 *
 * @param {Object} options
 * @param {String} type
 * @param {String} id
 * @param {Boolean} warnMissing
 * @return {Object|Function}
 */

function resolveAsset(options, type, id, warnMissing) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return;
  }
  var assets = options[type];
  var camelizedId;
  var res = assets[id] ||
  // camelCase ID
  assets[camelizedId = camelize(id)] ||
  // Pascal Case ID
  assets[camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
  }
  return res;
}

var uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 *
 * @constructor
 */
function Dep() {
  this.id = uid$1++;
  this.subs = [];
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;

/**
 * Add a directive subscriber.
 *
 * @param {Directive} sub
 */

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub);
};

/**
 * Remove a directive subscriber.
 *
 * @param {Directive} sub
 */

Dep.prototype.removeSub = function (sub) {
  this.subs.$remove(sub);
};

/**
 * Add self as a dependency to the target watcher.
 */

Dep.prototype.depend = function () {
  Dep.target.addDep(this);
};

/**
 * Notify all subscribers of a new value.
 */

Dep.prototype.notify = function () {
  // stablize the subscriber list first
  var subs = toArray(this.subs);
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto)

/**
 * Intercept mutating methods and emit events
 */

;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator() {
    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break;
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);
    // notify change
    ob.dep.notify();
    return result;
  });
});

/**
 * Swap the element at the given index with a new value
 * and emits corresponding event.
 *
 * @param {Number} index
 * @param {*} val
 * @return {*} - replaced element
 */

def(arrayProto, '$set', function $set(index, val) {
  if (index >= this.length) {
    this.length = Number(index) + 1;
  }
  return this.splice(index, 1, val)[0];
});

/**
 * Convenience method to remove the element at given index or target element reference.
 *
 * @param {*} item
 */

def(arrayProto, '$remove', function $remove(item) {
  /* istanbul ignore if */
  if (!this.length) return;
  var index = indexOf(this, item);
  if (index > -1) {
    return this.splice(index, 1);
  }
});

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However in certain cases, e.g.
 * v-for scope alias and props, we don't want to force conversion
 * because the value may be a nested value under a frozen data structure.
 *
 * So whenever we want to set a reactive property without forcing
 * conversion on the new value, we wrap that call inside this function.
 */

var shouldConvert = true;

function withoutConversion(fn) {
  shouldConvert = false;
  fn();
  shouldConvert = true;
}

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 *
 * @param {Array|Object} value
 * @constructor
 */

function Observer(value) {
  this.value = value;
  this.dep = new Dep();
  def(value, '__ob__', this);
  if (isArray(value)) {
    var augment = hasProto ? protoAugment : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
}

// Instance methods

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 *
 * @param {Object} obj
 */

Observer.prototype.walk = function (obj) {
  var keys = Object.keys(obj);
  for (var i = 0, l = keys.length; i < l; i++) {
    this.convert(keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 *
 * @param {Array} items
 */

Observer.prototype.observeArray = function (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

/**
 * Convert a property into getter/setter so we can emit
 * the events when the property is accessed/changed.
 *
 * @param {String} key
 * @param {*} val
 */

Observer.prototype.convert = function (key, val) {
  defineReactive(this.value, key, val);
};

/**
 * Add an owner vm, so that when $set/$delete mutations
 * happen we can notify owner vms to proxy the keys and
 * digest the watchers. This is only called when the object
 * is observed as an instance's root $data.
 *
 * @param {Vue} vm
 */

Observer.prototype.addVm = function (vm) {
  (this.vms || (this.vms = [])).push(vm);
};

/**
 * Remove an owner vm. This is called when the object is
 * swapped out as an instance's $data object.
 *
 * @param {Vue} vm
 */

Observer.prototype.removeVm = function (vm) {
  this.vms.$remove(vm);
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 *
 * @param {Object|Array} target
 * @param {Object} src
 */

function protoAugment(target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 *
 * @param {Object|Array} target
 * @param {Object} proto
 */

function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 *
 * @param {*} value
 * @param {Vue} [vm]
 * @return {Observer|undefined}
 * @static
 */

function observe(value, vm) {
  if (!value || typeof value !== 'object') {
    return;
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (shouldConvert && (isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
    ob = new Observer(value);
  }
  if (ob && vm) {
    ob.addVm(vm);
  }
  return ob;
}

/**
 * Define a reactive property on an Object.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 */

function defineReactive(obj, key, val) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (isArray(value)) {
          for (var e, i = 0, l = value.length; i < l; i++) {
            e = value[i];
            e && e.__ob__ && e.__ob__.dep.depend();
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val;
      if (newVal === value) {
        return;
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });
}



var util = Object.freeze({
	defineReactive: defineReactive,
	set: set,
	del: del,
	hasOwn: hasOwn,
	isLiteral: isLiteral,
	isReserved: isReserved,
	_toString: _toString,
	toNumber: toNumber,
	toBoolean: toBoolean,
	stripQuotes: stripQuotes,
	camelize: camelize,
	hyphenate: hyphenate,
	classify: classify,
	bind: bind,
	toArray: toArray,
	extend: extend,
	isObject: isObject,
	isPlainObject: isPlainObject,
	def: def,
	debounce: _debounce,
	indexOf: indexOf,
	cancellable: cancellable,
	looseEqual: looseEqual,
	isArray: isArray,
	hasProto: hasProto,
	inBrowser: inBrowser,
	devtools: devtools,
	isIE9: isIE9,
	isAndroid: isAndroid,
	get transitionProp () { return transitionProp; },
	get transitionEndEvent () { return transitionEndEvent; },
	get animationProp () { return animationProp; },
	get animationEndEvent () { return animationEndEvent; },
	nextTick: nextTick,
	query: query,
	inDoc: inDoc,
	getAttr: getAttr,
	getBindAttr: getBindAttr,
	hasBindAttr: hasBindAttr,
	before: before,
	after: after,
	remove: remove,
	prepend: prepend,
	replace: replace,
	on: on,
	off: off,
	setClass: setClass,
	addClass: addClass,
	removeClass: removeClass,
	extractContent: extractContent,
	trimNode: trimNode,
	isTemplate: isTemplate,
	createAnchor: createAnchor,
	findRef: findRef,
	mapNodeRange: mapNodeRange,
	removeNodeRange: removeNodeRange,
	isFragment: isFragment,
	getOuterHTML: getOuterHTML,
	mergeOptions: mergeOptions,
	resolveAsset: resolveAsset,
	checkComponentAttr: checkComponentAttr,
	commonTagRE: commonTagRE,
	reservedTagRE: reservedTagRE,
	get warn () { return warn; }
});

var uid = 0;

function initMixin (Vue) {
  /**
   * The main init sequence. This is called for every
   * instance, including ones that are created from extended
   * constructors.
   *
   * @param {Object} options - this options object should be
   *                           the result of merging class
   *                           options and the options passed
   *                           in to the constructor.
   */

  Vue.prototype._init = function (options) {
    options = options || {};

    this.$el = null;
    this.$parent = options.parent;
    this.$root = this.$parent ? this.$parent.$root : this;
    this.$children = [];
    this.$refs = {}; // child vm references
    this.$els = {}; // element references
    this._watchers = []; // all watchers as an array
    this._directives = []; // all directives

    // a uid
    this._uid = uid++;

    // a flag to avoid this being observed
    this._isVue = true;

    // events bookkeeping
    this._events = {}; // registered callbacks
    this._eventsCount = {}; // for $broadcast optimization

    // fragment instance properties
    this._isFragment = false;
    this._fragment = // @type {DocumentFragment}
    this._fragmentStart = // @type {Text|Comment}
    this._fragmentEnd = null; // @type {Text|Comment}

    // lifecycle state
    this._isCompiled = this._isDestroyed = this._isReady = this._isAttached = this._isBeingDestroyed = this._vForRemoving = false;
    this._unlinkFn = null;

    // context:
    // if this is a transcluded component, context
    // will be the common parent vm of this instance
    // and its host.
    this._context = options._context || this.$parent;

    // scope:
    // if this is inside an inline v-for, the scope
    // will be the intermediate scope created for this
    // repeat fragment. this is used for linking props
    // and container directives.
    this._scope = options._scope;

    // fragment:
    // if this instance is compiled inside a Fragment, it
    // needs to reigster itself as a child of that fragment
    // for attach/detach to work properly.
    this._frag = options._frag;
    if (this._frag) {
      this._frag.children.push(this);
    }

    // push self into parent / transclusion host
    if (this.$parent) {
      this.$parent.$children.push(this);
    }

    // merge options.
    options = this.$options = mergeOptions(this.constructor.options, options, this);

    // set ref
    this._updateRef();

    // initialize data as empty object.
    // it will be filled up in _initScope().
    this._data = {};

    // save raw constructor data before merge
    // so that we know which properties are provided at
    // instantiation.
    this._runtimeData = options.data;

    // call init hook
    this._callHook('init');

    // initialize data observation and scope inheritance.
    this._initState();

    // setup event system and option events.
    this._initEvents();

    // call created hook
    this._callHook('created');

    // if `el` option is passed, start compilation.
    if (options.el) {
      this.$mount(options.el);
    }
  };
}

var pathCache = new Cache(1000);

// actions
var APPEND = 0;
var PUSH = 1;
var INC_SUB_PATH_DEPTH = 2;
var PUSH_SUB_PATH = 3;

// states
var BEFORE_PATH = 0;
var IN_PATH = 1;
var BEFORE_IDENT = 2;
var IN_IDENT = 3;
var IN_SUB_PATH = 4;
var IN_SINGLE_QUOTE = 5;
var IN_DOUBLE_QUOTE = 6;
var AFTER_PATH = 7;
var ERROR = 8;

var pathStateMachine = [];

pathStateMachine[BEFORE_PATH] = {
  'ws': [BEFORE_PATH],
  'ident': [IN_IDENT, APPEND],
  '[': [IN_SUB_PATH],
  'eof': [AFTER_PATH]
};

pathStateMachine[IN_PATH] = {
  'ws': [IN_PATH],
  '.': [BEFORE_IDENT],
  '[': [IN_SUB_PATH],
  'eof': [AFTER_PATH]
};

pathStateMachine[BEFORE_IDENT] = {
  'ws': [BEFORE_IDENT],
  'ident': [IN_IDENT, APPEND]
};

pathStateMachine[IN_IDENT] = {
  'ident': [IN_IDENT, APPEND],
  '0': [IN_IDENT, APPEND],
  'number': [IN_IDENT, APPEND],
  'ws': [IN_PATH, PUSH],
  '.': [BEFORE_IDENT, PUSH],
  '[': [IN_SUB_PATH, PUSH],
  'eof': [AFTER_PATH, PUSH]
};

pathStateMachine[IN_SUB_PATH] = {
  "'": [IN_SINGLE_QUOTE, APPEND],
  '"': [IN_DOUBLE_QUOTE, APPEND],
  '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
  ']': [IN_PATH, PUSH_SUB_PATH],
  'eof': ERROR,
  'else': [IN_SUB_PATH, APPEND]
};

pathStateMachine[IN_SINGLE_QUOTE] = {
  "'": [IN_SUB_PATH, APPEND],
  'eof': ERROR,
  'else': [IN_SINGLE_QUOTE, APPEND]
};

pathStateMachine[IN_DOUBLE_QUOTE] = {
  '"': [IN_SUB_PATH, APPEND],
  'eof': ERROR,
  'else': [IN_DOUBLE_QUOTE, APPEND]
};

/**
 * Determine the type of a character in a keypath.
 *
 * @param {Char} ch
 * @return {String} type
 */

function getPathCharType(ch) {
  if (ch === undefined) {
    return 'eof';
  }

  var code = ch.charCodeAt(0);

  switch (code) {
    case 0x5B: // [
    case 0x5D: // ]
    case 0x2E: // .
    case 0x22: // "
    case 0x27: // '
    case 0x30:
      // 0
      return ch;

    case 0x5F: // _
    case 0x24:
      // $
      return 'ident';

    case 0x20: // Space
    case 0x09: // Tab
    case 0x0A: // Newline
    case 0x0D: // Return
    case 0xA0: // No-break space
    case 0xFEFF: // Byte Order Mark
    case 0x2028: // Line Separator
    case 0x2029:
      // Paragraph Separator
      return 'ws';
  }

  // a-z, A-Z
  if (code >= 0x61 && code <= 0x7A || code >= 0x41 && code <= 0x5A) {
    return 'ident';
  }

  // 1-9
  if (code >= 0x31 && code <= 0x39) {
    return 'number';
  }

  return 'else';
}

/**
 * Format a subPath, return its plain form if it is
 * a literal string or number. Otherwise prepend the
 * dynamic indicator (*).
 *
 * @param {String} path
 * @return {String}
 */

function formatSubPath(path) {
  var trimmed = path.trim();
  // invalid leading 0
  if (path.charAt(0) === '0' && isNaN(path)) {
    return false;
  }
  return isLiteral(trimmed) ? stripQuotes(trimmed) : '*' + trimmed;
}

/**
 * Parse a string path into an array of segments
 *
 * @param {String} path
 * @return {Array|undefined}
 */

function parse(path) {
  var keys = [];
  var index = -1;
  var mode = BEFORE_PATH;
  var subPathDepth = 0;
  var c, newChar, key, type, transition, action, typeMap;

  var actions = [];

  actions[PUSH] = function () {
    if (key !== undefined) {
      keys.push(key);
      key = undefined;
    }
  };

  actions[APPEND] = function () {
    if (key === undefined) {
      key = newChar;
    } else {
      key += newChar;
    }
  };

  actions[INC_SUB_PATH_DEPTH] = function () {
    actions[APPEND]();
    subPathDepth++;
  };

  actions[PUSH_SUB_PATH] = function () {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = IN_SUB_PATH;
      actions[APPEND]();
    } else {
      subPathDepth = 0;
      key = formatSubPath(key);
      if (key === false) {
        return false;
      } else {
        actions[PUSH]();
      }
    }
  };

  function maybeUnescapeQuote() {
    var nextChar = path[index + 1];
    if (mode === IN_SINGLE_QUOTE && nextChar === "'" || mode === IN_DOUBLE_QUOTE && nextChar === '"') {
      index++;
      newChar = '\\' + nextChar;
      actions[APPEND]();
      return true;
    }
  }

  while (mode != null) {
    index++;
    c = path[index];

    if (c === '\\' && maybeUnescapeQuote()) {
      continue;
    }

    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap['else'] || ERROR;

    if (transition === ERROR) {
      return; // parse error
    }

    mode = transition[0];
    action = actions[transition[1]];
    if (action) {
      newChar = transition[2];
      newChar = newChar === undefined ? c : newChar;
      if (action() === false) {
        return;
      }
    }

    if (mode === AFTER_PATH) {
      keys.raw = path;
      return keys;
    }
  }
}

/**
 * External parse that check for a cache hit first
 *
 * @param {String} path
 * @return {Array|undefined}
 */

function parsePath(path) {
  var hit = pathCache.get(path);
  if (!hit) {
    hit = parse(path);
    if (hit) {
      pathCache.put(path, hit);
    }
  }
  return hit;
}

/**
 * Get from an object from a path string
 *
 * @param {Object} obj
 * @param {String} path
 */

function getPath(obj, path) {
  return parseExpression(path).get(obj);
}

/**
 * Warn against setting non-existent root path on a vm.
 */

var warnNonExistent;
if (process.env.NODE_ENV !== 'production') {
  warnNonExistent = function (path, vm) {
    warn('You are setting a non-existent path "' + path.raw + '" ' + 'on a vm instance. Consider pre-initializing the property ' + 'with the "data" option for more reliable reactivity ' + 'and better performance.', vm);
  };
}

/**
 * Set on an object from a path
 *
 * @param {Object} obj
 * @param {String | Array} path
 * @param {*} val
 */

function setPath(obj, path, val) {
  var original = obj;
  if (typeof path === 'string') {
    path = parse(path);
  }
  if (!path || !isObject(obj)) {
    return false;
  }
  var last, key;
  for (var i = 0, l = path.length; i < l; i++) {
    last = obj;
    key = path[i];
    if (key.charAt(0) === '*') {
      key = parseExpression(key.slice(1)).get.call(original, original);
    }
    if (i < l - 1) {
      obj = obj[key];
      if (!isObject(obj)) {
        obj = {};
        if (process.env.NODE_ENV !== 'production' && last._isVue) {
          warnNonExistent(path, last);
        }
        set(last, key, obj);
      }
    } else {
      if (isArray(obj)) {
        obj.$set(key, val);
      } else if (key in obj) {
        obj[key] = val;
      } else {
        if (process.env.NODE_ENV !== 'production' && obj._isVue) {
          warnNonExistent(path, obj);
        }
        set(obj, key, val);
      }
    }
  }
  return true;
}

var path = Object.freeze({
  parsePath: parsePath,
  getPath: getPath,
  setPath: setPath
});

var expressionCache = new Cache(1000);

var allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
var allowedKeywordsRE = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');

// keywords that don't make sense inside expressions
var improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' + 'delete,do,else,export,extends,finally,for,function,if,' + 'import,in,instanceof,let,return,super,switch,throw,try,' + 'var,while,with,yield,enum,await,implements,package,' + 'protected,static,interface,private,public';
var improperKeywordsRE = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');

var wsRE = /\s/g;
var newlineRE = /\n/g;
var saveRE = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
var restoreRE = /"(\d+)"/g;
var pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
var identRE = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g;
var booleanLiteralRE = /^(?:true|false)$/;

/**
 * Save / Rewrite / Restore
 *
 * When rewriting paths found in an expression, it is
 * possible for the same letter sequences to be found in
 * strings and Object literal property keys. Therefore we
 * remove and store these parts in a temporary array, and
 * restore them after the path rewrite.
 */

var saved = [];

/**
 * Save replacer
 *
 * The save regex can match two possible cases:
 * 1. An opening object literal
 * 2. A string
 * If matched as a plain string, we need to escape its
 * newlines, since the string needs to be preserved when
 * generating the function body.
 *
 * @param {String} str
 * @param {String} isString - str if matched as a string
 * @return {String} - placeholder with index
 */

function save(str, isString) {
  var i = saved.length;
  saved[i] = isString ? str.replace(newlineRE, '\\n') : str;
  return '"' + i + '"';
}

/**
 * Path rewrite replacer
 *
 * @param {String} raw
 * @return {String}
 */

function rewrite(raw) {
  var c = raw.charAt(0);
  var path = raw.slice(1);
  if (allowedKeywordsRE.test(path)) {
    return raw;
  } else {
    path = path.indexOf('"') > -1 ? path.replace(restoreRE, restore) : path;
    return c + 'scope.' + path;
  }
}

/**
 * Restore replacer
 *
 * @param {String} str
 * @param {String} i - matched save index
 * @return {String}
 */

function restore(str, i) {
  return saved[i];
}

/**
 * Rewrite an expression, prefixing all path accessors with
 * `scope.` and generate getter/setter functions.
 *
 * @param {String} exp
 * @return {Function}
 */

function compileGetter(exp) {
  if (improperKeywordsRE.test(exp)) {
    process.env.NODE_ENV !== 'production' && warn('Avoid using reserved keywords in expression: ' + exp);
  }
  // reset state
  saved.length = 0;
  // save strings and object literal keys
  var body = exp.replace(saveRE, save).replace(wsRE, '');
  // rewrite all paths
  // pad 1 space here becaue the regex matches 1 extra char
  body = (' ' + body).replace(identRE, rewrite).replace(restoreRE, restore);
  return makeGetterFn(body);
}

/**
 * Build a getter function. Requires eval.
 *
 * We isolate the try/catch so it doesn't affect the
 * optimization of the parse function when it is not called.
 *
 * @param {String} body
 * @return {Function|undefined}
 */

function makeGetterFn(body) {
  try {
    /* eslint-disable no-new-func */
    return new Function('scope', 'return ' + body + ';');
    /* eslint-enable no-new-func */
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn('Invalid expression. ' + 'Generated function body: ' + body);
  }
}

/**
 * Compile a setter function for the expression.
 *
 * @param {String} exp
 * @return {Function|undefined}
 */

function compileSetter(exp) {
  var path = parsePath(exp);
  if (path) {
    return function (scope, val) {
      setPath(scope, path, val);
    };
  } else {
    process.env.NODE_ENV !== 'production' && warn('Invalid setter expression: ' + exp);
  }
}

/**
 * Parse an expression into re-written getter/setters.
 *
 * @param {String} exp
 * @param {Boolean} needSet
 * @return {Function}
 */

function parseExpression(exp, needSet) {
  exp = exp.trim();
  // try cache
  var hit = expressionCache.get(exp);
  if (hit) {
    if (needSet && !hit.set) {
      hit.set = compileSetter(hit.exp);
    }
    return hit;
  }
  var res = { exp: exp };
  res.get = isSimplePath(exp) && exp.indexOf('[') < 0
  // optimized super simple getter
  ? makeGetterFn('scope.' + exp)
  // dynamic getter
  : compileGetter(exp);
  if (needSet) {
    res.set = compileSetter(exp);
  }
  expressionCache.put(exp, res);
  return res;
}

/**
 * Check if an expression is a simple path.
 *
 * @param {String} exp
 * @return {Boolean}
 */

function isSimplePath(exp) {
  return pathTestRE.test(exp) &&
  // don't treat true/false as paths
  !booleanLiteralRE.test(exp) &&
  // Math constants e.g. Math.PI, Math.E etc.
  exp.slice(0, 5) !== 'Math.';
}

var expression = Object.freeze({
  parseExpression: parseExpression,
  isSimplePath: isSimplePath
});

// we have two separate queues: one for directive updates
// and one for user watcher registered via $watch().
// we want to guarantee directive updates to be called
// before user watchers so that when user watchers are
// triggered, the DOM would have already been in updated
// state.

var queueIndex;
var queue = [];
var userQueue = [];
var has = {};
var circular = {};
var waiting = false;
var internalQueueDepleted = false;

/**
 * Reset the batcher's state.
 */

function resetBatcherState() {
  queue = [];
  userQueue = [];
  has = {};
  circular = {};
  waiting = internalQueueDepleted = false;
}

/**
 * Flush both queues and run the watchers.
 */

function flushBatcherQueue() {
  runBatcherQueue(queue);
  internalQueueDepleted = true;
  runBatcherQueue(userQueue);
  // dev tool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
  resetBatcherState();
}

/**
 * Run the watchers in a single queue.
 *
 * @param {Array} queue
 */

function runBatcherQueue(queue) {
  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (queueIndex = 0; queueIndex < queue.length; queueIndex++) {
    var watcher = queue[queueIndex];
    var id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > config._maxUpdateCount) {
        warn('You may have an infinite update loop for watcher ' + 'with expression "' + watcher.expression + '"', watcher.vm);
        break;
      }
    }
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 *
 * @param {Watcher} watcher
 *   properties:
 *   - {Number} id
 *   - {Function} run
 */

function pushWatcher(watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    if (internalQueueDepleted && !watcher.user) {
      // an internal watcher triggered by a user watcher...
      // let's run it immediately after current user watcher is done.
      userQueue.splice(queueIndex + 1, 0, watcher);
    } else {
      // push watcher into appropriate queue
      var q = watcher.user ? userQueue : queue;
      has[id] = q.length;
      q.push(watcher);
      // queue the flush
      if (!waiting) {
        waiting = true;
        nextTick(flushBatcherQueue);
      }
    }
  }
}

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 *
 * @param {Vue} vm
 * @param {String|Function} expOrFn
 * @param {Function} cb
 * @param {Object} options
 *                 - {Array} filters
 *                 - {Boolean} twoWay
 *                 - {Boolean} deep
 *                 - {Boolean} user
 *                 - {Boolean} sync
 *                 - {Boolean} lazy
 *                 - {Function} [preProcess]
 *                 - {Function} [postProcess]
 * @constructor
 */
function Watcher(vm, expOrFn, cb, options) {
  // mix in options
  if (options) {
    extend(this, options);
  }
  var isFn = typeof expOrFn === 'function';
  this.vm = vm;
  vm._watchers.push(this);
  this.expression = expOrFn;
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = Object.create(null);
  this.newDepIds = null;
  this.prevError = null; // for async error stacks
  // parse expression for getter/setter
  if (isFn) {
    this.getter = expOrFn;
    this.setter = undefined;
  } else {
    var res = parseExpression(expOrFn, this.twoWay);
    this.getter = res.get;
    this.setter = res.set;
  }
  this.value = this.lazy ? undefined : this.get();
  // state for avoiding false triggers for deep and Array
  // watchers during vm._digest()
  this.queued = this.shallow = false;
}

/**
 * Evaluate the getter, and re-collect dependencies.
 */

Watcher.prototype.get = function () {
  this.beforeGet();
  var scope = this.scope || this.vm;
  var value;
  try {
    value = this.getter.call(scope, scope);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production' && config.warnExpressionErrors) {
      warn('Error when evaluating expression ' + '"' + this.expression + '": ' + e.toString(), this.vm);
    }
  }
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value);
  }
  if (this.preProcess) {
    value = this.preProcess(value);
  }
  if (this.filters) {
    value = scope._applyFilters(value, null, this.filters, false);
  }
  if (this.postProcess) {
    value = this.postProcess(value);
  }
  this.afterGet();
  return value;
};

/**
 * Set the corresponding value with the setter.
 *
 * @param {*} value
 */

Watcher.prototype.set = function (value) {
  var scope = this.scope || this.vm;
  if (this.filters) {
    value = scope._applyFilters(value, this.value, this.filters, true);
  }
  try {
    this.setter.call(scope, scope, value);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production' && config.warnExpressionErrors) {
      warn('Error when evaluating setter ' + '"' + this.expression + '": ' + e.toString(), this.vm);
    }
  }
  // two-way sync for v-for alias
  var forContext = scope.$forContext;
  if (forContext && forContext.alias === this.expression) {
    if (forContext.filters) {
      process.env.NODE_ENV !== 'production' && warn('It seems you are using two-way binding on ' + 'a v-for alias (' + this.expression + '), and the ' + 'v-for has filters. This will not work properly. ' + 'Either remove the filters or use an array of ' + 'objects and bind to object properties instead.', this.vm);
      return;
    }
    forContext._withLock(function () {
      if (scope.$key) {
        // original is an object
        forContext.rawValue[scope.$key] = value;
      } else {
        forContext.rawValue.$set(scope.$index, value);
      }
    });
  }
};

/**
 * Prepare for dependency collection.
 */

Watcher.prototype.beforeGet = function () {
  Dep.target = this;
  this.newDepIds = Object.create(null);
  this.newDeps.length = 0;
};

/**
 * Add a dependency to this directive.
 *
 * @param {Dep} dep
 */

Watcher.prototype.addDep = function (dep) {
  var id = dep.id;
  if (!this.newDepIds[id]) {
    this.newDepIds[id] = true;
    this.newDeps.push(dep);
    if (!this.depIds[id]) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */

Watcher.prototype.afterGet = function () {
  Dep.target = null;
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds[dep.id]) {
      dep.removeSub(this);
    }
  }
  this.depIds = this.newDepIds;
  var tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 *
 * @param {Boolean} shallow
 */

Watcher.prototype.update = function (shallow) {
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync || !config.async) {
    this.run();
  } else {
    // if queued, only overwrite shallow with non-shallow,
    // but not the other way around.
    this.shallow = this.queued ? shallow ? this.shallow : false : !!shallow;
    this.queued = true;
    // record before-push error stack in debug mode
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.debug) {
      this.prevError = new Error('[vue] async stack trace');
    }
    pushWatcher(this);
  }
};

/**
 * Batcher job interface.
 * Will be called by the batcher.
 */

Watcher.prototype.run = function () {
  if (this.active) {
    var value = this.get();
    if (value !== this.value ||
    // Deep watchers and watchers on Object/Arrays should fire even
    // when the value is the same, because the value may
    // have mutated; but only do so if this is a
    // non-shallow update (caused by a vm digest).
    (isObject(value) || this.deep) && !this.shallow) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      // in debug + async mode, when a watcher callbacks
      // throws, we also throw the saved before-push error
      // so the full cross-tick stack trace is available.
      var prevError = this.prevError;
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.debug && prevError) {
        this.prevError = null;
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          nextTick(function () {
            throw prevError;
          }, 0);
          throw e;
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
    this.queued = this.shallow = false;
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */

Watcher.prototype.evaluate = function () {
  // avoid overwriting another watcher that is being
  // collected.
  var current = Dep.target;
  this.value = this.get();
  this.dirty = false;
  Dep.target = current;
};

/**
 * Depend on all deps collected by this watcher.
 */

Watcher.prototype.depend = function () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subcriber list.
 */

Watcher.prototype.teardown = function () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed or is performing a v-for
    // re-render (the watcher list is then filtered by v-for).
    if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
      this.vm._watchers.$remove(this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
    this.vm = this.cb = this.value = null;
  }
};

/**
 * Recrusively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 *
 * @param {*} val
 */

function traverse(val) {
  var i, keys;
  if (isArray(val)) {
    i = val.length;
    while (i--) traverse(val[i]);
  } else if (isObject(val)) {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) traverse(val[keys[i]]);
  }
}

var text$1 = {

  bind: function bind() {
    this.attr = this.el.nodeType === 3 ? 'data' : 'textContent';
  },

  update: function update(value) {
    this.el[this.attr] = _toString(value);
  }
};

var templateCache = new Cache(1000);
var idSelectorCache = new Cache(1000);

var map = {
  efault: [0, '', ''],
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>']
};

map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];

map.g = map.defs = map.symbol = map.use = map.image = map.text = map.circle = map.ellipse = map.line = map.path = map.polygon = map.polyline = map.rect = [1, '<svg ' + 'xmlns="http://www.w3.org/2000/svg" ' + 'xmlns:xlink="http://www.w3.org/1999/xlink" ' + 'xmlns:ev="http://www.w3.org/2001/xml-events"' + 'version="1.1">', '</svg>'];

/**
 * Check if a node is a supported template node with a
 * DocumentFragment content.
 *
 * @param {Node} node
 * @return {Boolean}
 */

function isRealTemplate(node) {
  return isTemplate(node) && isFragment(node.content);
}

var tagRE$1 = /<([\w:-]+)/;
var entityRE = /&#?\w+?;/;

/**
 * Convert a string template to a DocumentFragment.
 * Determines correct wrapping by tag types. Wrapping
 * strategy found in jQuery & component/domify.
 *
 * @param {String} templateString
 * @param {Boolean} raw
 * @return {DocumentFragment}
 */

function stringToFragment(templateString, raw) {
  // try a cache hit first
  var cacheKey = raw ? templateString : templateString.trim();
  var hit = templateCache.get(cacheKey);
  if (hit) {
    return hit;
  }

  var frag = document.createDocumentFragment();
  var tagMatch = templateString.match(tagRE$1);
  var entityMatch = entityRE.test(templateString);

  if (!tagMatch && !entityMatch) {
    // text only, return a single text node.
    frag.appendChild(document.createTextNode(templateString));
  } else {
    var tag = tagMatch && tagMatch[1];
    var wrap = map[tag] || map.efault;
    var depth = wrap[0];
    var prefix = wrap[1];
    var suffix = wrap[2];
    var node = document.createElement('div');

    node.innerHTML = prefix + templateString + suffix;
    while (depth--) {
      node = node.lastChild;
    }

    var child;
    /* eslint-disable no-cond-assign */
    while (child = node.firstChild) {
      /* eslint-enable no-cond-assign */
      frag.appendChild(child);
    }
  }
  if (!raw) {
    trimNode(frag);
  }
  templateCache.put(cacheKey, frag);
  return frag;
}

/**
 * Convert a template node to a DocumentFragment.
 *
 * @param {Node} node
 * @return {DocumentFragment}
 */

function nodeToFragment(node) {
  // if its a template tag and the browser supports it,
  // its content is already a document fragment.
  if (isRealTemplate(node)) {
    trimNode(node.content);
    return node.content;
  }
  // script template
  if (node.tagName === 'SCRIPT') {
    return stringToFragment(node.textContent);
  }
  // normal node, clone it to avoid mutating the original
  var clonedNode = cloneNode(node);
  var frag = document.createDocumentFragment();
  var child;
  /* eslint-disable no-cond-assign */
  while (child = clonedNode.firstChild) {
    /* eslint-enable no-cond-assign */
    frag.appendChild(child);
  }
  trimNode(frag);
  return frag;
}

// Test for the presence of the Safari template cloning bug
// https://bugs.webkit.org/showug.cgi?id=137755
var hasBrokenTemplate = (function () {
  /* istanbul ignore else */
  if (inBrowser) {
    var a = document.createElement('div');
    a.innerHTML = '<template>1</template>';
    return !a.cloneNode(true).firstChild.innerHTML;
  } else {
    return false;
  }
})();

// Test for IE10/11 textarea placeholder clone bug
var hasTextareaCloneBug = (function () {
  /* istanbul ignore else */
  if (inBrowser) {
    var t = document.createElement('textarea');
    t.placeholder = 't';
    return t.cloneNode(true).value === 't';
  } else {
    return false;
  }
})();

/**
 * 1. Deal with Safari cloning nested <template> bug by
 *    manually cloning all template instances.
 * 2. Deal with IE10/11 textarea placeholder bug by setting
 *    the correct value after cloning.
 *
 * @param {Element|DocumentFragment} node
 * @return {Element|DocumentFragment}
 */

function cloneNode(node) {
  /* istanbul ignore if */
  if (!node.querySelectorAll) {
    return node.cloneNode();
  }
  var res = node.cloneNode(true);
  var i, original, cloned;
  /* istanbul ignore if */
  if (hasBrokenTemplate) {
    var tempClone = res;
    if (isRealTemplate(node)) {
      node = node.content;
      tempClone = res.content;
    }
    original = node.querySelectorAll('template');
    if (original.length) {
      cloned = tempClone.querySelectorAll('template');
      i = cloned.length;
      while (i--) {
        cloned[i].parentNode.replaceChild(cloneNode(original[i]), cloned[i]);
      }
    }
  }
  /* istanbul ignore if */
  if (hasTextareaCloneBug) {
    if (node.tagName === 'TEXTAREA') {
      res.value = node.value;
    } else {
      original = node.querySelectorAll('textarea');
      if (original.length) {
        cloned = res.querySelectorAll('textarea');
        i = cloned.length;
        while (i--) {
          cloned[i].value = original[i].value;
        }
      }
    }
  }
  return res;
}

/**
 * Process the template option and normalizes it into a
 * a DocumentFragment that can be used as a partial or a
 * instance template.
 *
 * @param {*} template
 *        Possible values include:
 *        - DocumentFragment object
 *        - Node object of type Template
 *        - id selector: '#some-template-id'
 *        - template string: '<div><span>{{msg}}</span></div>'
 * @param {Boolean} shouldClone
 * @param {Boolean} raw
 *        inline HTML interpolation. Do not check for id
 *        selector and keep whitespace in the string.
 * @return {DocumentFragment|undefined}
 */

function parseTemplate(template, shouldClone, raw) {
  var node, frag;

  // if the template is already a document fragment,
  // do nothing
  if (isFragment(template)) {
    trimNode(template);
    return shouldClone ? cloneNode(template) : template;
  }

  if (typeof template === 'string') {
    // id selector
    if (!raw && template.charAt(0) === '#') {
      // id selector can be cached too
      frag = idSelectorCache.get(template);
      if (!frag) {
        node = document.getElementById(template.slice(1));
        if (node) {
          frag = nodeToFragment(node);
          // save selector to cache
          idSelectorCache.put(template, frag);
        }
      }
    } else {
      // normal string template
      frag = stringToFragment(template, raw);
    }
  } else if (template.nodeType) {
    // a direct node
    frag = nodeToFragment(template);
  }

  return frag && shouldClone ? cloneNode(frag) : frag;
}

var template = Object.freeze({
  cloneNode: cloneNode,
  parseTemplate: parseTemplate
});

var html = {

  bind: function bind() {
    // a comment node means this is a binding for
    // {{{ inline unescaped html }}}
    if (this.el.nodeType === 8) {
      // hold nodes
      this.nodes = [];
      // replace the placeholder with proper anchor
      this.anchor = createAnchor('v-html');
      replace(this.el, this.anchor);
    }
  },

  update: function update(value) {
    value = _toString(value);
    if (this.nodes) {
      this.swap(value);
    } else {
      this.el.innerHTML = value;
    }
  },

  swap: function swap(value) {
    // remove old nodes
    var i = this.nodes.length;
    while (i--) {
      remove(this.nodes[i]);
    }
    // convert new value to a fragment
    // do not attempt to retrieve from id selector
    var frag = parseTemplate(value, true, true);
    // save a reference to these nodes so we can remove later
    this.nodes = toArray(frag.childNodes);
    before(frag, this.anchor);
  }
};

/**
 * Abstraction for a partially-compiled fragment.
 * Can optionally compile content with a child scope.
 *
 * @param {Function} linker
 * @param {Vue} vm
 * @param {DocumentFragment} frag
 * @param {Vue} [host]
 * @param {Object} [scope]
 * @param {Fragment} [parentFrag]
 */
function Fragment(linker, vm, frag, host, scope, parentFrag) {
  this.children = [];
  this.childFrags = [];
  this.vm = vm;
  this.scope = scope;
  this.inserted = false;
  this.parentFrag = parentFrag;
  if (parentFrag) {
    parentFrag.childFrags.push(this);
  }
  this.unlink = linker(vm, frag, host, scope, this);
  var single = this.single = frag.childNodes.length === 1 &&
  // do not go single mode if the only node is an anchor
  !frag.childNodes[0].__v_anchor;
  if (single) {
    this.node = frag.childNodes[0];
    this.before = singleBefore;
    this.remove = singleRemove;
  } else {
    this.node = createAnchor('fragment-start');
    this.end = createAnchor('fragment-end');
    this.frag = frag;
    prepend(this.node, frag);
    frag.appendChild(this.end);
    this.before = multiBefore;
    this.remove = multiRemove;
  }
  this.node.__v_frag = this;
}

/**
 * Call attach/detach for all components contained within
 * this fragment. Also do so recursively for all child
 * fragments.
 *
 * @param {Function} hook
 */

Fragment.prototype.callHook = function (hook) {
  var i, l;
  for (i = 0, l = this.childFrags.length; i < l; i++) {
    this.childFrags[i].callHook(hook);
  }
  for (i = 0, l = this.children.length; i < l; i++) {
    hook(this.children[i]);
  }
};

/**
 * Insert fragment before target, single node version
 *
 * @param {Node} target
 * @param {Boolean} withTransition
 */

function singleBefore(target, withTransition) {
  this.inserted = true;
  var method = withTransition !== false ? beforeWithTransition : before;
  method(this.node, target, this.vm);
  if (inDoc(this.node)) {
    this.callHook(attach);
  }
}

/**
 * Remove fragment, single node version
 */

function singleRemove() {
  this.inserted = false;
  var shouldCallRemove = inDoc(this.node);
  var self = this;
  this.beforeRemove();
  removeWithTransition(this.node, this.vm, function () {
    if (shouldCallRemove) {
      self.callHook(detach);
    }
    self.destroy();
  });
}

/**
 * Insert fragment before target, multi-nodes version
 *
 * @param {Node} target
 * @param {Boolean} withTransition
 */

function multiBefore(target, withTransition) {
  this.inserted = true;
  var vm = this.vm;
  var method = withTransition !== false ? beforeWithTransition : before;
  mapNodeRange(this.node, this.end, function (node) {
    method(node, target, vm);
  });
  if (inDoc(this.node)) {
    this.callHook(attach);
  }
}

/**
 * Remove fragment, multi-nodes version
 */

function multiRemove() {
  this.inserted = false;
  var self = this;
  var shouldCallRemove = inDoc(this.node);
  this.beforeRemove();
  removeNodeRange(this.node, this.end, this.vm, this.frag, function () {
    if (shouldCallRemove) {
      self.callHook(detach);
    }
    self.destroy();
  });
}

/**
 * Prepare the fragment for removal.
 */

Fragment.prototype.beforeRemove = function () {
  var i, l;
  for (i = 0, l = this.childFrags.length; i < l; i++) {
    // call the same method recursively on child
    // fragments, depth-first
    this.childFrags[i].beforeRemove(false);
  }
  for (i = 0, l = this.children.length; i < l; i++) {
    // Call destroy for all contained instances,
    // with remove:false and defer:true.
    // Defer is necessary because we need to
    // keep the children to call detach hooks
    // on them.
    this.children[i].$destroy(false, true);
  }
  var dirs = this.unlink.dirs;
  for (i = 0, l = dirs.length; i < l; i++) {
    // disable the watchers on all the directives
    // so that the rendered content stays the same
    // during removal.
    dirs[i]._watcher && dirs[i]._watcher.teardown();
  }
};

/**
 * Destroy the fragment.
 */

Fragment.prototype.destroy = function () {
  if (this.parentFrag) {
    this.parentFrag.childFrags.$remove(this);
  }
  this.node.__v_frag = null;
  this.unlink();
};

/**
 * Call attach hook for a Vue instance.
 *
 * @param {Vue} child
 */

function attach(child) {
  if (!child._isAttached && inDoc(child.$el)) {
    child._callHook('attached');
  }
}

/**
 * Call detach hook for a Vue instance.
 *
 * @param {Vue} child
 */

function detach(child) {
  if (child._isAttached && !inDoc(child.$el)) {
    child._callHook('detached');
  }
}

var linkerCache = new Cache(5000);

/**
 * A factory that can be used to create instances of a
 * fragment. Caches the compiled linker if possible.
 *
 * @param {Vue} vm
 * @param {Element|String} el
 */
function FragmentFactory(vm, el) {
  this.vm = vm;
  var template;
  var isString = typeof el === 'string';
  if (isString || isTemplate(el)) {
    template = parseTemplate(el, true);
  } else {
    template = document.createDocumentFragment();
    template.appendChild(el);
  }
  this.template = template;
  // linker can be cached, but only for components
  var linker;
  var cid = vm.constructor.cid;
  if (cid > 0) {
    var cacheId = cid + (isString ? el : getOuterHTML(el));
    linker = linkerCache.get(cacheId);
    if (!linker) {
      linker = compile(template, vm.$options, true);
      linkerCache.put(cacheId, linker);
    }
  } else {
    linker = compile(template, vm.$options, true);
  }
  this.linker = linker;
}

/**
 * Create a fragment instance with given host and scope.
 *
 * @param {Vue} host
 * @param {Object} scope
 * @param {Fragment} parentFrag
 */

FragmentFactory.prototype.create = function (host, scope, parentFrag) {
  var frag = cloneNode(this.template);
  return new Fragment(this.linker, this.vm, frag, host, scope, parentFrag);
};

var ON = 700;
var MODEL = 800;
var BIND = 850;
var TRANSITION = 1100;
var EL = 1500;
var COMPONENT = 1500;
var PARTIAL = 1750;
var IF = 2100;
var FOR = 2200;
var SLOT = 2300;

var uid$3 = 0;

var vFor = {

  priority: FOR,
  terminal: true,

  params: ['track-by', 'stagger', 'enter-stagger', 'leave-stagger'],

  bind: function bind() {
    // support "item in/of items" syntax
    var inMatch = this.expression.match(/(.*) (?:in|of) (.*)/);
    if (inMatch) {
      var itMatch = inMatch[1].match(/\((.*),(.*)\)/);
      if (itMatch) {
        this.iterator = itMatch[1].trim();
        this.alias = itMatch[2].trim();
      } else {
        this.alias = inMatch[1].trim();
      }
      this.expression = inMatch[2];
    }

    if (!this.alias) {
      process.env.NODE_ENV !== 'production' && warn('Invalid v-for expression "' + this.descriptor.raw + '": ' + 'alias is required.', this.vm);
      return;
    }

    // uid as a cache identifier
    this.id = '__v-for__' + ++uid$3;

    // check if this is an option list,
    // so that we know if we need to update the <select>'s
    // v-model when the option list has changed.
    // because v-model has a lower priority than v-for,
    // the v-model is not bound here yet, so we have to
    // retrive it in the actual updateModel() function.
    var tag = this.el.tagName;
    this.isOption = (tag === 'OPTION' || tag === 'OPTGROUP') && this.el.parentNode.tagName === 'SELECT';

    // setup anchor nodes
    this.start = createAnchor('v-for-start');
    this.end = createAnchor('v-for-end');
    replace(this.el, this.end);
    before(this.start, this.end);

    // cache
    this.cache = Object.create(null);

    // fragment factory
    this.factory = new FragmentFactory(this.vm, this.el);
  },

  update: function update(data) {
    this.diff(data);
    this.updateRef();
    this.updateModel();
  },

  /**
   * Diff, based on new data and old data, determine the
   * minimum amount of DOM manipulations needed to make the
   * DOM reflect the new data Array.
   *
   * The algorithm diffs the new data Array by storing a
   * hidden reference to an owner vm instance on previously
   * seen data. This allows us to achieve O(n) which is
   * better than a levenshtein distance based algorithm,
   * which is O(m * n).
   *
   * @param {Array} data
   */

  diff: function diff(data) {
    // check if the Array was converted from an Object
    var item = data[0];
    var convertedFromObject = this.fromObject = isObject(item) && hasOwn(item, '$key') && hasOwn(item, '$value');

    var trackByKey = this.params.trackBy;
    var oldFrags = this.frags;
    var frags = this.frags = new Array(data.length);
    var alias = this.alias;
    var iterator = this.iterator;
    var start = this.start;
    var end = this.end;
    var inDocument = inDoc(start);
    var init = !oldFrags;
    var i, l, frag, key, value, primitive;

    // First pass, go through the new Array and fill up
    // the new frags array. If a piece of data has a cached
    // instance for it, we reuse it. Otherwise build a new
    // instance.
    for (i = 0, l = data.length; i < l; i++) {
      item = data[i];
      key = convertedFromObject ? item.$key : null;
      value = convertedFromObject ? item.$value : item;
      primitive = !isObject(value);
      frag = !init && this.getCachedFrag(value, i, key);
      if (frag) {
        // reusable fragment
        frag.reused = true;
        // update $index
        frag.scope.$index = i;
        // update $key
        if (key) {
          frag.scope.$key = key;
        }
        // update iterator
        if (iterator) {
          frag.scope[iterator] = key !== null ? key : i;
        }
        // update data for track-by, object repeat &
        // primitive values.
        if (trackByKey || convertedFromObject || primitive) {
          withoutConversion(function () {
            frag.scope[alias] = value;
          });
        }
      } else {
        // new isntance
        frag = this.create(value, alias, i, key);
        frag.fresh = !init;
      }
      frags[i] = frag;
      if (init) {
        frag.before(end);
      }
    }

    // we're done for the initial render.
    if (init) {
      return;
    }

    // Second pass, go through the old fragments and
    // destroy those who are not reused (and remove them
    // from cache)
    var removalIndex = 0;
    var totalRemoved = oldFrags.length - frags.length;
    // when removing a large number of fragments, watcher removal
    // turns out to be a perf bottleneck, so we batch the watcher
    // removals into a single filter call!
    this.vm._vForRemoving = true;
    for (i = 0, l = oldFrags.length; i < l; i++) {
      frag = oldFrags[i];
      if (!frag.reused) {
        this.deleteCachedFrag(frag);
        this.remove(frag, removalIndex++, totalRemoved, inDocument);
      }
    }
    this.vm._vForRemoving = false;
    if (removalIndex) {
      this.vm._watchers = this.vm._watchers.filter(function (w) {
        return w.active;
      });
    }

    // Final pass, move/insert new fragments into the
    // right place.
    var targetPrev, prevEl, currentPrev;
    var insertionIndex = 0;
    for (i = 0, l = frags.length; i < l; i++) {
      frag = frags[i];
      // this is the frag that we should be after
      targetPrev = frags[i - 1];
      prevEl = targetPrev ? targetPrev.staggerCb ? targetPrev.staggerAnchor : targetPrev.end || targetPrev.node : start;
      if (frag.reused && !frag.staggerCb) {
        currentPrev = findPrevFrag(frag, start, this.id);
        if (currentPrev !== targetPrev && (!currentPrev ||
        // optimization for moving a single item.
        // thanks to suggestions by @livoras in #1807
        findPrevFrag(currentPrev, start, this.id) !== targetPrev)) {
          this.move(frag, prevEl);
        }
      } else {
        // new instance, or still in stagger.
        // insert with updated stagger index.
        this.insert(frag, insertionIndex++, prevEl, inDocument);
      }
      frag.reused = frag.fresh = false;
    }
  },

  /**
   * Create a new fragment instance.
   *
   * @param {*} value
   * @param {String} alias
   * @param {Number} index
   * @param {String} [key]
   * @return {Fragment}
   */

  create: function create(value, alias, index, key) {
    var host = this._host;
    // create iteration scope
    var parentScope = this._scope || this.vm;
    var scope = Object.create(parentScope);
    // ref holder for the scope
    scope.$refs = Object.create(parentScope.$refs);
    scope.$els = Object.create(parentScope.$els);
    // make sure point $parent to parent scope
    scope.$parent = parentScope;
    // for two-way binding on alias
    scope.$forContext = this;
    // define scope properties
    // important: define the scope alias without forced conversion
    // so that frozen data structures remain non-reactive.
    withoutConversion(function () {
      defineReactive(scope, alias, value);
    });
    defineReactive(scope, '$index', index);
    if (key) {
      defineReactive(scope, '$key', key);
    } else if (scope.$key) {
      // avoid accidental fallback
      def(scope, '$key', null);
    }
    if (this.iterator) {
      defineReactive(scope, this.iterator, key !== null ? key : index);
    }
    var frag = this.factory.create(host, scope, this._frag);
    frag.forId = this.id;
    this.cacheFrag(value, frag, index, key);
    return frag;
  },

  /**
   * Update the v-ref on owner vm.
   */

  updateRef: function updateRef() {
    var ref = this.descriptor.ref;
    if (!ref) return;
    var hash = (this._scope || this.vm).$refs;
    var refs;
    if (!this.fromObject) {
      refs = this.frags.map(findVmFromFrag);
    } else {
      refs = {};
      this.frags.forEach(function (frag) {
        refs[frag.scope.$key] = findVmFromFrag(frag);
      });
    }
    hash[ref] = refs;
  },

  /**
   * For option lists, update the containing v-model on
   * parent <select>.
   */

  updateModel: function updateModel() {
    if (this.isOption) {
      var parent = this.start.parentNode;
      var model = parent && parent.__v_model;
      if (model) {
        model.forceUpdate();
      }
    }
  },

  /**
   * Insert a fragment. Handles staggering.
   *
   * @param {Fragment} frag
   * @param {Number} index
   * @param {Node} prevEl
   * @param {Boolean} inDocument
   */

  insert: function insert(frag, index, prevEl, inDocument) {
    if (frag.staggerCb) {
      frag.staggerCb.cancel();
      frag.staggerCb = null;
    }
    var staggerAmount = this.getStagger(frag, index, null, 'enter');
    if (inDocument && staggerAmount) {
      // create an anchor and insert it synchronously,
      // so that we can resolve the correct order without
      // worrying about some elements not inserted yet
      var anchor = frag.staggerAnchor;
      if (!anchor) {
        anchor = frag.staggerAnchor = createAnchor('stagger-anchor');
        anchor.__v_frag = frag;
      }
      after(anchor, prevEl);
      var op = frag.staggerCb = cancellable(function () {
        frag.staggerCb = null;
        frag.before(anchor);
        remove(anchor);
      });
      setTimeout(op, staggerAmount);
    } else {
      frag.before(prevEl.nextSibling);
    }
  },

  /**
   * Remove a fragment. Handles staggering.
   *
   * @param {Fragment} frag
   * @param {Number} index
   * @param {Number} total
   * @param {Boolean} inDocument
   */

  remove: function remove(frag, index, total, inDocument) {
    if (frag.staggerCb) {
      frag.staggerCb.cancel();
      frag.staggerCb = null;
      // it's not possible for the same frag to be removed
      // twice, so if we have a pending stagger callback,
      // it means this frag is queued for enter but removed
      // before its transition started. Since it is already
      // destroyed, we can just leave it in detached state.
      return;
    }
    var staggerAmount = this.getStagger(frag, index, total, 'leave');
    if (inDocument && staggerAmount) {
      var op = frag.staggerCb = cancellable(function () {
        frag.staggerCb = null;
        frag.remove();
      });
      setTimeout(op, staggerAmount);
    } else {
      frag.remove();
    }
  },

  /**
   * Move a fragment to a new position.
   * Force no transition.
   *
   * @param {Fragment} frag
   * @param {Node} prevEl
   */

  move: function move(frag, prevEl) {
    // fix a common issue with Sortable:
    // if prevEl doesn't have nextSibling, this means it's
    // been dragged after the end anchor. Just re-position
    // the end anchor to the end of the container.
    /* istanbul ignore if */
    if (!prevEl.nextSibling) {
      this.end.parentNode.appendChild(this.end);
    }
    frag.before(prevEl.nextSibling, false);
  },

  /**
   * Cache a fragment using track-by or the object key.
   *
   * @param {*} value
   * @param {Fragment} frag
   * @param {Number} index
   * @param {String} [key]
   */

  cacheFrag: function cacheFrag(value, frag, index, key) {
    var trackByKey = this.params.trackBy;
    var cache = this.cache;
    var primitive = !isObject(value);
    var id;
    if (key || trackByKey || primitive) {
      id = trackByKey ? trackByKey === '$index' ? index : getPath(value, trackByKey) : key || value;
      if (!cache[id]) {
        cache[id] = frag;
      } else if (trackByKey !== '$index') {
        process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
      }
    } else {
      id = this.id;
      if (hasOwn(value, id)) {
        if (value[id] === null) {
          value[id] = frag;
        } else {
          process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
        }
      } else {
        def(value, id, frag);
      }
    }
    frag.raw = value;
  },

  /**
   * Get a cached fragment from the value/index/key
   *
   * @param {*} value
   * @param {Number} index
   * @param {String} key
   * @return {Fragment}
   */

  getCachedFrag: function getCachedFrag(value, index, key) {
    var trackByKey = this.params.trackBy;
    var primitive = !isObject(value);
    var frag;
    if (key || trackByKey || primitive) {
      var id = trackByKey ? trackByKey === '$index' ? index : getPath(value, trackByKey) : key || value;
      frag = this.cache[id];
    } else {
      frag = value[this.id];
    }
    if (frag && (frag.reused || frag.fresh)) {
      process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
    }
    return frag;
  },

  /**
   * Delete a fragment from cache.
   *
   * @param {Fragment} frag
   */

  deleteCachedFrag: function deleteCachedFrag(frag) {
    var value = frag.raw;
    var trackByKey = this.params.trackBy;
    var scope = frag.scope;
    var index = scope.$index;
    // fix #948: avoid accidentally fall through to
    // a parent repeater which happens to have $key.
    var key = hasOwn(scope, '$key') && scope.$key;
    var primitive = !isObject(value);
    if (trackByKey || key || primitive) {
      var id = trackByKey ? trackByKey === '$index' ? index : getPath(value, trackByKey) : key || value;
      this.cache[id] = null;
    } else {
      value[this.id] = null;
      frag.raw = null;
    }
  },

  /**
   * Get the stagger amount for an insertion/removal.
   *
   * @param {Fragment} frag
   * @param {Number} index
   * @param {Number} total
   * @param {String} type
   */

  getStagger: function getStagger(frag, index, total, type) {
    type = type + 'Stagger';
    var trans = frag.node.__v_trans;
    var hooks = trans && trans.hooks;
    var hook = hooks && (hooks[type] || hooks.stagger);
    return hook ? hook.call(frag, index, total) : index * parseInt(this.params[type] || this.params.stagger, 10);
  },

  /**
   * Pre-process the value before piping it through the
   * filters. This is passed to and called by the watcher.
   */

  _preProcess: function _preProcess(value) {
    // regardless of type, store the un-filtered raw value.
    this.rawValue = value;
    return value;
  },

  /**
   * Post-process the value after it has been piped through
   * the filters. This is passed to and called by the watcher.
   *
   * It is necessary for this to be called during the
   * wathcer's dependency collection phase because we want
   * the v-for to update when the source Object is mutated.
   */

  _postProcess: function _postProcess(value) {
    if (isArray(value)) {
      return value;
    } else if (isPlainObject(value)) {
      // convert plain object to array.
      var keys = Object.keys(value);
      var i = keys.length;
      var res = new Array(i);
      var key;
      while (i--) {
        key = keys[i];
        res[i] = {
          $key: key,
          $value: value[key]
        };
      }
      return res;
    } else {
      if (typeof value === 'number' && !isNaN(value)) {
        value = range(value);
      }
      return value || [];
    }
  },

  unbind: function unbind() {
    if (this.descriptor.ref) {
      (this._scope || this.vm).$refs[this.descriptor.ref] = null;
    }
    if (this.frags) {
      var i = this.frags.length;
      var frag;
      while (i--) {
        frag = this.frags[i];
        this.deleteCachedFrag(frag);
        frag.destroy();
      }
    }
  }
};

/**
 * Helper to find the previous element that is a fragment
 * anchor. This is necessary because a destroyed frag's
 * element could still be lingering in the DOM before its
 * leaving transition finishes, but its inserted flag
 * should have been set to false so we can skip them.
 *
 * If this is a block repeat, we want to make sure we only
 * return frag that is bound to this v-for. (see #929)
 *
 * @param {Fragment} frag
 * @param {Comment|Text} anchor
 * @param {String} id
 * @return {Fragment}
 */

function findPrevFrag(frag, anchor, id) {
  var el = frag.node.previousSibling;
  /* istanbul ignore if */
  if (!el) return;
  frag = el.__v_frag;
  while ((!frag || frag.forId !== id || !frag.inserted) && el !== anchor) {
    el = el.previousSibling;
    /* istanbul ignore if */
    if (!el) return;
    frag = el.__v_frag;
  }
  return frag;
}

/**
 * Find a vm from a fragment.
 *
 * @param {Fragment} frag
 * @return {Vue|undefined}
 */

function findVmFromFrag(frag) {
  var node = frag.node;
  // handle multi-node frag
  if (frag.end) {
    while (!node.__vue__ && node !== frag.end && node.nextSibling) {
      node = node.nextSibling;
    }
  }
  return node.__vue__;
}

/**
 * Create a range array from given number.
 *
 * @param {Number} n
 * @return {Array}
 */

function range(n) {
  var i = -1;
  var ret = new Array(Math.floor(n));
  while (++i < n) {
    ret[i] = i;
  }
  return ret;
}

if (process.env.NODE_ENV !== 'production') {
  vFor.warnDuplicate = function (value) {
    warn('Duplicate value found in v-for="' + this.descriptor.raw + '": ' + JSON.stringify(value) + '. Use track-by="$index" if ' + 'you are expecting duplicate values.', this.vm);
  };
}

var vIf = {

  priority: IF,
  terminal: true,

  bind: function bind() {
    var el = this.el;
    if (!el.__vue__) {
      // check else block
      var next = el.nextElementSibling;
      if (next && getAttr(next, 'v-else') !== null) {
        remove(next);
        this.elseEl = next;
      }
      // check main block
      this.anchor = createAnchor('v-if');
      replace(el, this.anchor);
    } else {
      process.env.NODE_ENV !== 'production' && warn('v-if="' + this.expression + '" cannot be ' + 'used on an instance root element.', this.vm);
      this.invalid = true;
    }
  },

  update: function update(value) {
    if (this.invalid) return;
    if (value) {
      if (!this.frag) {
        this.insert();
      }
    } else {
      this.remove();
    }
  },

  insert: function insert() {
    if (this.elseFrag) {
      this.elseFrag.remove();
      this.elseFrag = null;
    }
    // lazy init factory
    if (!this.factory) {
      this.factory = new FragmentFactory(this.vm, this.el);
    }
    this.frag = this.factory.create(this._host, this._scope, this._frag);
    this.frag.before(this.anchor);
  },

  remove: function remove() {
    if (this.frag) {
      this.frag.remove();
      this.frag = null;
    }
    if (this.elseEl && !this.elseFrag) {
      if (!this.elseFactory) {
        this.elseFactory = new FragmentFactory(this.elseEl._context || this.vm, this.elseEl);
      }
      this.elseFrag = this.elseFactory.create(this._host, this._scope, this._frag);
      this.elseFrag.before(this.anchor);
    }
  },

  unbind: function unbind() {
    if (this.frag) {
      this.frag.destroy();
    }
    if (this.elseFrag) {
      this.elseFrag.destroy();
    }
  }
};

var show = {

  bind: function bind() {
    // check else block
    var next = this.el.nextElementSibling;
    if (next && getAttr(next, 'v-else') !== null) {
      this.elseEl = next;
    }
  },

  update: function update(value) {
    this.apply(this.el, value);
    if (this.elseEl) {
      this.apply(this.elseEl, !value);
    }
  },

  apply: function apply(el, value) {
    if (inDoc(el)) {
      applyTransition(el, value ? 1 : -1, toggle, this.vm);
    } else {
      toggle();
    }
    function toggle() {
      el.style.display = value ? '' : 'none';
    }
  }
};

var text$2 = {

  bind: function bind() {
    var self = this;
    var el = this.el;
    var isRange = el.type === 'range';
    var lazy = this.params.lazy;
    var number = this.params.number;
    var debounce = this.params.debounce;

    // handle composition events.
    //   http://blog.evanyou.me/2014/01/03/composition-event/
    // skip this for Android because it handles composition
    // events quite differently. Android doesn't trigger
    // composition events for language input methods e.g.
    // Chinese, but instead triggers them for spelling
    // suggestions... (see Discussion/#162)
    var composing = false;
    if (!isAndroid && !isRange) {
      this.on('compositionstart', function () {
        composing = true;
      });
      this.on('compositionend', function () {
        composing = false;
        // in IE11 the "compositionend" event fires AFTER
        // the "input" event, so the input handler is blocked
        // at the end... have to call it here.
        //
        // #1327: in lazy mode this is unecessary.
        if (!lazy) {
          self.listener();
        }
      });
    }

    // prevent messing with the input when user is typing,
    // and force update on blur.
    this.focused = false;
    if (!isRange && !lazy) {
      this.on('focus', function () {
        self.focused = true;
      });
      this.on('blur', function () {
        self.focused = false;
        // do not sync value after fragment removal (#2017)
        if (!self._frag || self._frag.inserted) {
          self.rawListener();
        }
      });
    }

    // Now attach the main listener
    this.listener = this.rawListener = function () {
      if (composing || !self._bound) {
        return;
      }
      var val = number || isRange ? toNumber(el.value) : el.value;
      self.set(val);
      // force update on next tick to avoid lock & same value
      // also only update when user is not typing
      nextTick(function () {
        if (self._bound && !self.focused) {
          self.update(self._watcher.value);
        }
      });
    };

    // apply debounce
    if (debounce) {
      this.listener = _debounce(this.listener, debounce);
    }

    // Support jQuery events, since jQuery.trigger() doesn't
    // trigger native events in some cases and some plugins
    // rely on $.trigger()
    //
    // We want to make sure if a listener is attached using
    // jQuery, it is also removed with jQuery, that's why
    // we do the check for each directive instance and
    // store that check result on itself. This also allows
    // easier test coverage control by unsetting the global
    // jQuery variable in tests.
    this.hasjQuery = typeof jQuery === 'function';
    if (this.hasjQuery) {
      var method = jQuery.fn.on ? 'on' : 'bind';
      jQuery(el)[method]('change', this.rawListener);
      if (!lazy) {
        jQuery(el)[method]('input', this.listener);
      }
    } else {
      this.on('change', this.rawListener);
      if (!lazy) {
        this.on('input', this.listener);
      }
    }

    // IE9 doesn't fire input event on backspace/del/cut
    if (!lazy && isIE9) {
      this.on('cut', function () {
        nextTick(self.listener);
      });
      this.on('keyup', function (e) {
        if (e.keyCode === 46 || e.keyCode === 8) {
          self.listener();
        }
      });
    }

    // set initial value if present
    if (el.hasAttribute('value') || el.tagName === 'TEXTAREA' && el.value.trim()) {
      this.afterBind = this.listener;
    }
  },

  update: function update(value) {
    this.el.value = _toString(value);
  },

  unbind: function unbind() {
    var el = this.el;
    if (this.hasjQuery) {
      var method = jQuery.fn.off ? 'off' : 'unbind';
      jQuery(el)[method]('change', this.listener);
      jQuery(el)[method]('input', this.listener);
    }
  }
};

var radio = {

  bind: function bind() {
    var self = this;
    var el = this.el;

    this.getValue = function () {
      // value overwrite via v-bind:value
      if (el.hasOwnProperty('_value')) {
        return el._value;
      }
      var val = el.value;
      if (self.params.number) {
        val = toNumber(val);
      }
      return val;
    };

    this.listener = function () {
      self.set(self.getValue());
    };
    this.on('change', this.listener);

    if (el.hasAttribute('checked')) {
      this.afterBind = this.listener;
    }
  },

  update: function update(value) {
    this.el.checked = looseEqual(value, this.getValue());
  }
};

var select = {

  bind: function bind() {
    var self = this;
    var el = this.el;

    // method to force update DOM using latest value.
    this.forceUpdate = function () {
      if (self._watcher) {
        self.update(self._watcher.get());
      }
    };

    // check if this is a multiple select
    var multiple = this.multiple = el.hasAttribute('multiple');

    // attach listener
    this.listener = function () {
      var value = getValue(el, multiple);
      value = self.params.number ? isArray(value) ? value.map(toNumber) : toNumber(value) : value;
      self.set(value);
    };
    this.on('change', this.listener);

    // if has initial value, set afterBind
    var initValue = getValue(el, multiple, true);
    if (multiple && initValue.length || !multiple && initValue !== null) {
      this.afterBind = this.listener;
    }

    // All major browsers except Firefox resets
    // selectedIndex with value -1 to 0 when the element
    // is appended to a new parent, therefore we have to
    // force a DOM update whenever that happens...
    this.vm.$on('hook:attached', this.forceUpdate);
  },

  update: function update(value) {
    var el = this.el;
    el.selectedIndex = -1;
    var multi = this.multiple && isArray(value);
    var options = el.options;
    var i = options.length;
    var op, val;
    while (i--) {
      op = options[i];
      val = op.hasOwnProperty('_value') ? op._value : op.value;
      /* eslint-disable eqeqeq */
      op.selected = multi ? indexOf$1(value, val) > -1 : looseEqual(value, val);
      /* eslint-enable eqeqeq */
    }
  },

  unbind: function unbind() {
    /* istanbul ignore next */
    this.vm.$off('hook:attached', this.forceUpdate);
  }
};

/**
 * Get select value
 *
 * @param {SelectElement} el
 * @param {Boolean} multi
 * @param {Boolean} init
 * @return {Array|*}
 */

function getValue(el, multi, init) {
  var res = multi ? [] : null;
  var op, val, selected;
  for (var i = 0, l = el.options.length; i < l; i++) {
    op = el.options[i];
    selected = init ? op.hasAttribute('selected') : op.selected;
    if (selected) {
      val = op.hasOwnProperty('_value') ? op._value : op.value;
      if (multi) {
        res.push(val);
      } else {
        return val;
      }
    }
  }
  return res;
}

/**
 * Native Array.indexOf uses strict equal, but in this
 * case we need to match string/numbers with custom equal.
 *
 * @param {Array} arr
 * @param {*} val
 */

function indexOf$1(arr, val) {
  var i = arr.length;
  while (i--) {
    if (looseEqual(arr[i], val)) {
      return i;
    }
  }
  return -1;
}

var checkbox = {

  bind: function bind() {
    var self = this;
    var el = this.el;

    this.getValue = function () {
      return el.hasOwnProperty('_value') ? el._value : self.params.number ? toNumber(el.value) : el.value;
    };

    function getBooleanValue() {
      var val = el.checked;
      if (val && el.hasOwnProperty('_trueValue')) {
        return el._trueValue;
      }
      if (!val && el.hasOwnProperty('_falseValue')) {
        return el._falseValue;
      }
      return val;
    }

    this.listener = function () {
      var model = self._watcher.value;
      if (isArray(model)) {
        var val = self.getValue();
        if (el.checked) {
          if (indexOf(model, val) < 0) {
            model.push(val);
          }
        } else {
          model.$remove(val);
        }
      } else {
        self.set(getBooleanValue());
      }
    };

    this.on('change', this.listener);
    if (el.hasAttribute('checked')) {
      this.afterBind = this.listener;
    }
  },

  update: function update(value) {
    var el = this.el;
    if (isArray(value)) {
      el.checked = indexOf(value, this.getValue()) > -1;
    } else {
      if (el.hasOwnProperty('_trueValue')) {
        el.checked = looseEqual(value, el._trueValue);
      } else {
        el.checked = !!value;
      }
    }
  }
};

var handlers = {
  text: text$2,
  radio: radio,
  select: select,
  checkbox: checkbox
};

var model = {

  priority: MODEL,
  twoWay: true,
  handlers: handlers,
  params: ['lazy', 'number', 'debounce'],

  /**
   * Possible elements:
   *   <select>
   *   <textarea>
   *   <input type="*">
   *     - text
   *     - checkbox
   *     - radio
   *     - number
   */

  bind: function bind() {
    // friendly warning...
    this.checkFilters();
    if (this.hasRead && !this.hasWrite) {
      process.env.NODE_ENV !== 'production' && warn('It seems you are using a read-only filter with ' + 'v-model="' + this.descriptor.raw + '". ' + 'You might want to use a two-way filter to ensure correct behavior.', this.vm);
    }
    var el = this.el;
    var tag = el.tagName;
    var handler;
    if (tag === 'INPUT') {
      handler = handlers[el.type] || handlers.text;
    } else if (tag === 'SELECT') {
      handler = handlers.select;
    } else if (tag === 'TEXTAREA') {
      handler = handlers.text;
    } else {
      process.env.NODE_ENV !== 'production' && warn('v-model does not support element type: ' + tag, this.vm);
      return;
    }
    el.__v_model = this;
    handler.bind.call(this);
    this.update = handler.update;
    this._unbind = handler.unbind;
  },

  /**
   * Check read/write filter stats.
   */

  checkFilters: function checkFilters() {
    var filters = this.filters;
    if (!filters) return;
    var i = filters.length;
    while (i--) {
      var filter = resolveAsset(this.vm.$options, 'filters', filters[i].name);
      if (typeof filter === 'function' || filter.read) {
        this.hasRead = true;
      }
      if (filter.write) {
        this.hasWrite = true;
      }
    }
  },

  unbind: function unbind() {
    this.el.__v_model = null;
    this._unbind && this._unbind();
  }
};

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  'delete': [8, 46],
  up: 38,
  left: 37,
  right: 39,
  down: 40
};

function keyFilter(handler, keys) {
  var codes = keys.map(function (key) {
    var charCode = key.charCodeAt(0);
    if (charCode > 47 && charCode < 58) {
      return parseInt(key, 10);
    }
    if (key.length === 1) {
      charCode = key.toUpperCase().charCodeAt(0);
      if (charCode > 64 && charCode < 91) {
        return charCode;
      }
    }
    return keyCodes[key];
  });
  codes = [].concat.apply([], codes);
  return function keyHandler(e) {
    if (codes.indexOf(e.keyCode) > -1) {
      return handler.call(this, e);
    }
  };
}

function stopFilter(handler) {
  return function stopHandler(e) {
    e.stopPropagation();
    return handler.call(this, e);
  };
}

function preventFilter(handler) {
  return function preventHandler(e) {
    e.preventDefault();
    return handler.call(this, e);
  };
}

function selfFilter(handler) {
  return function selfHandler(e) {
    if (e.target === e.currentTarget) {
      return handler.call(this, e);
    }
  };
}

var on$1 = {

  priority: ON,
  acceptStatement: true,
  keyCodes: keyCodes,

  bind: function bind() {
    // deal with iframes
    if (this.el.tagName === 'IFRAME' && this.arg !== 'load') {
      var self = this;
      this.iframeBind = function () {
        on(self.el.contentWindow, self.arg, self.handler, self.modifiers.capture);
      };
      this.on('load', this.iframeBind);
    }
  },

  update: function update(handler) {
    // stub a noop for v-on with no value,
    // e.g. @mousedown.prevent
    if (!this.descriptor.raw) {
      handler = function () {};
    }

    if (typeof handler !== 'function') {
      process.env.NODE_ENV !== 'production' && warn('v-on:' + this.arg + '="' + this.expression + '" expects a function value, ' + 'got ' + handler, this.vm);
      return;
    }

    // apply modifiers
    if (this.modifiers.stop) {
      handler = stopFilter(handler);
    }
    if (this.modifiers.prevent) {
      handler = preventFilter(handler);
    }
    if (this.modifiers.self) {
      handler = selfFilter(handler);
    }
    // key filter
    var keys = Object.keys(this.modifiers).filter(function (key) {
      return key !== 'stop' && key !== 'prevent' && key !== 'self';
    });
    if (keys.length) {
      handler = keyFilter(handler, keys);
    }

    this.reset();
    this.handler = handler;

    if (this.iframeBind) {
      this.iframeBind();
    } else {
      on(this.el, this.arg, this.handler, this.modifiers.capture);
    }
  },

  reset: function reset() {
    var el = this.iframeBind ? this.el.contentWindow : this.el;
    if (this.handler) {
      off(el, this.arg, this.handler);
    }
  },

  unbind: function unbind() {
    this.reset();
  }
};

var prefixes = ['-webkit-', '-moz-', '-ms-'];
var camelPrefixes = ['Webkit', 'Moz', 'ms'];
var importantRE = /!important;?$/;
var propCache = Object.create(null);

var testEl = null;

var style = {

  deep: true,

  update: function update(value) {
    if (typeof value === 'string') {
      this.el.style.cssText = value;
    } else if (isArray(value)) {
      this.handleObject(value.reduce(extend, {}));
    } else {
      this.handleObject(value || {});
    }
  },

  handleObject: function handleObject(value) {
    // cache object styles so that only changed props
    // are actually updated.
    var cache = this.cache || (this.cache = {});
    var name, val;
    for (name in cache) {
      if (!(name in value)) {
        this.handleSingle(name, null);
        delete cache[name];
      }
    }
    for (name in value) {
      val = value[name];
      if (val !== cache[name]) {
        cache[name] = val;
        this.handleSingle(name, val);
      }
    }
  },

  handleSingle: function handleSingle(prop, value) {
    prop = normalize(prop);
    if (!prop) return; // unsupported prop
    // cast possible numbers/booleans into strings
    if (value != null) value += '';
    if (value) {
      var isImportant = importantRE.test(value) ? 'important' : '';
      if (isImportant) {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          warn('It\'s probably a bad idea to use !important with inline rules. ' + 'This feature will be deprecated in a future version of Vue.');
        }
        value = value.replace(importantRE, '').trim();
        this.el.style.setProperty(prop.kebab, value, isImportant);
      } else {
        this.el.style[prop.camel] = value;
      }
    } else {
      this.el.style[prop.camel] = '';
    }
  }

};

/**
 * Normalize a CSS property name.
 * - cache result
 * - auto prefix
 * - camelCase -> dash-case
 *
 * @param {String} prop
 * @return {String}
 */

function normalize(prop) {
  if (propCache[prop]) {
    return propCache[prop];
  }
  var res = prefix(prop);
  propCache[prop] = propCache[res] = res;
  return res;
}

/**
 * Auto detect the appropriate prefix for a CSS property.
 * https://gist.github.com/paulirish/523692
 *
 * @param {String} prop
 * @return {String}
 */

function prefix(prop) {
  prop = hyphenate(prop);
  var camel = camelize(prop);
  var upper = camel.charAt(0).toUpperCase() + camel.slice(1);
  if (!testEl) {
    testEl = document.createElement('div');
  }
  var i = prefixes.length;
  var prefixed;
  while (i--) {
    prefixed = camelPrefixes[i] + upper;
    if (prefixed in testEl.style) {
      return {
        kebab: prefixes[i] + prop,
        camel: prefixed
      };
    }
  }
  if (camel in testEl.style) {
    return {
      kebab: prop,
      camel: camel
    };
  }
}

// xlink
var xlinkNS = 'http://www.w3.org/1999/xlink';
var xlinkRE = /^xlink:/;

// check for attributes that prohibit interpolations
var disallowedInterpAttrRE = /^v-|^:|^@|^(?:is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/;
// these attributes should also set their corresponding properties
// because they only affect the initial state of the element
var attrWithPropsRE = /^(?:value|checked|selected|muted)$/;
// these attributes expect enumrated values of "true" or "false"
// but are not boolean attributes
var enumeratedAttrRE = /^(?:draggable|contenteditable|spellcheck)$/;

// these attributes should set a hidden property for
// binding v-model to object values
var modelProps = {
  value: '_value',
  'true-value': '_trueValue',
  'false-value': '_falseValue'
};

var bind$1 = {

  priority: BIND,

  bind: function bind() {
    var attr = this.arg;
    var tag = this.el.tagName;
    // should be deep watch on object mode
    if (!attr) {
      this.deep = true;
    }
    // handle interpolation bindings
    var descriptor = this.descriptor;
    var tokens = descriptor.interp;
    if (tokens) {
      // handle interpolations with one-time tokens
      if (descriptor.hasOneTime) {
        this.expression = tokensToExp(tokens, this._scope || this.vm);
      }

      // only allow binding on native attributes
      if (disallowedInterpAttrRE.test(attr) || attr === 'name' && (tag === 'PARTIAL' || tag === 'SLOT')) {
        process.env.NODE_ENV !== 'production' && warn(attr + '="' + descriptor.raw + '": ' + 'attribute interpolation is not allowed in Vue.js ' + 'directives and special attributes.', this.vm);
        this.el.removeAttribute(attr);
        this.invalid = true;
      }

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production') {
        var raw = attr + '="' + descriptor.raw + '": ';
        // warn src
        if (attr === 'src') {
          warn(raw + 'interpolation in "src" attribute will cause ' + 'a 404 request. Use v-bind:src instead.', this.vm);
        }

        // warn style
        if (attr === 'style') {
          warn(raw + 'interpolation in "style" attribute will cause ' + 'the attribute to be discarded in Internet Explorer. ' + 'Use v-bind:style instead.', this.vm);
        }
      }
    }
  },

  update: function update(value) {
    if (this.invalid) {
      return;
    }
    var attr = this.arg;
    if (this.arg) {
      this.handleSingle(attr, value);
    } else {
      this.handleObject(value || {});
    }
  },

  // share object handler with v-bind:class
  handleObject: style.handleObject,

  handleSingle: function handleSingle(attr, value) {
    var el = this.el;
    var interp = this.descriptor.interp;
    if (this.modifiers.camel) {
      attr = camelize(attr);
    }
    if (!interp && attrWithPropsRE.test(attr) && attr in el) {
      el[attr] = attr === 'value' ? value == null // IE9 will set input.value to "null" for null...
      ? '' : value : value;
    }
    // set model props
    var modelProp = modelProps[attr];
    if (!interp && modelProp) {
      el[modelProp] = value;
      // update v-model if present
      var model = el.__v_model;
      if (model) {
        model.listener();
      }
    }
    // do not set value attribute for textarea
    if (attr === 'value' && el.tagName === 'TEXTAREA') {
      el.removeAttribute(attr);
      return;
    }
    // update attribute
    if (enumeratedAttrRE.test(attr)) {
      el.setAttribute(attr, value ? 'true' : 'false');
    } else if (value != null && value !== false) {
      if (attr === 'class') {
        // handle edge case #1960:
        // class interpolation should not overwrite Vue transition class
        if (el.__v_trans) {
          value += ' ' + el.__v_trans.id + '-transition';
        }
        setClass(el, value);
      } else if (xlinkRE.test(attr)) {
        el.setAttributeNS(xlinkNS, attr, value === true ? '' : value);
      } else {
        el.setAttribute(attr, value === true ? '' : value);
      }
    } else {
      el.removeAttribute(attr);
    }
  }
};

var el = {

  priority: EL,

  bind: function bind() {
    /* istanbul ignore if */
    if (!this.arg) {
      return;
    }
    var id = this.id = camelize(this.arg);
    var refs = (this._scope || this.vm).$els;
    if (hasOwn(refs, id)) {
      refs[id] = this.el;
    } else {
      defineReactive(refs, id, this.el);
    }
  },

  unbind: function unbind() {
    var refs = (this._scope || this.vm).$els;
    if (refs[this.id] === this.el) {
      refs[this.id] = null;
    }
  }
};

var ref = {
  bind: function bind() {
    process.env.NODE_ENV !== 'production' && warn('v-ref:' + this.arg + ' must be used on a child ' + 'component. Found on <' + this.el.tagName.toLowerCase() + '>.', this.vm);
  }
};

var cloak = {
  bind: function bind() {
    var el = this.el;
    this.vm.$once('pre-hook:compiled', function () {
      el.removeAttribute('v-cloak');
    });
  }
};

// must export plain object
var directives = {
  text: text$1,
  html: html,
  'for': vFor,
  'if': vIf,
  show: show,
  model: model,
  on: on$1,
  bind: bind$1,
  el: el,
  ref: ref,
  cloak: cloak
};

var vClass = {

  deep: true,

  update: function update(value) {
    if (value && typeof value === 'string') {
      this.handleObject(stringToObject(value));
    } else if (isPlainObject(value)) {
      this.handleObject(value);
    } else if (isArray(value)) {
      this.handleArray(value);
    } else {
      this.cleanup();
    }
  },

  handleObject: function handleObject(value) {
    this.cleanup(value);
    this.prevKeys = Object.keys(value);
    setObjectClasses(this.el, value);
  },

  handleArray: function handleArray(value) {
    this.cleanup(value);
    for (var i = 0, l = value.length; i < l; i++) {
      var val = value[i];
      if (val && isPlainObject(val)) {
        setObjectClasses(this.el, val);
      } else if (val && typeof val === 'string') {
        addClass(this.el, val);
      }
    }
    this.prevKeys = value.slice();
  },

  cleanup: function cleanup(value) {
    if (!this.prevKeys) return;

    var i = this.prevKeys.length;
    while (i--) {
      var key = this.prevKeys[i];
      if (!key) continue;

      var keys = isPlainObject(key) ? Object.keys(key) : [key];
      for (var j = 0, l = keys.length; j < l; j++) {
        toggleClasses(this.el, keys[j], removeClass);
      }
    }
  }
};

function setObjectClasses(el, obj) {
  var keys = Object.keys(obj);
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    if (!obj[key]) continue;
    toggleClasses(el, key, addClass);
  }
}

function stringToObject(value) {
  var res = {};
  var keys = value.trim().split(/\s+/);
  for (var i = 0, l = keys.length; i < l; i++) {
    res[keys[i]] = true;
  }
  return res;
}

/**
 * Add or remove a class/classes on an element
 *
 * @param {Element} el
 * @param {String} key The class name. This may or may not
 *                     contain a space character, in such a
 *                     case we'll deal with multiple class
 *                     names at once.
 * @param {Function} fn
 */

function toggleClasses(el, key, fn) {
  key = key.trim();

  if (key.indexOf(' ') === -1) {
    fn(el, key);
    return;
  }

  // The key contains one or more space characters.
  // Since a class name doesn't accept such characters, we
  // treat it as multiple classes.
  var keys = key.split(/\s+/);
  for (var i = 0, l = keys.length; i < l; i++) {
    fn(el, keys[i]);
  }
}

var component = {

  priority: COMPONENT,

  params: ['keep-alive', 'transition-mode', 'inline-template'],

  /**
   * Setup. Two possible usages:
   *
   * - static:
   *   <comp> or <div v-component="comp">
   *
   * - dynamic:
   *   <component :is="view">
   */

  bind: function bind() {
    if (!this.el.__vue__) {
      // keep-alive cache
      this.keepAlive = this.params.keepAlive;
      if (this.keepAlive) {
        this.cache = {};
      }
      // check inline-template
      if (this.params.inlineTemplate) {
        // extract inline template as a DocumentFragment
        this.inlineTemplate = extractContent(this.el, true);
      }
      // component resolution related state
      this.pendingComponentCb = this.Component = null;
      // transition related state
      this.pendingRemovals = 0;
      this.pendingRemovalCb = null;
      // create a ref anchor
      this.anchor = createAnchor('v-component');
      replace(this.el, this.anchor);
      // remove is attribute.
      // this is removed during compilation, but because compilation is
      // cached, when the component is used elsewhere this attribute
      // will remain at link time.
      this.el.removeAttribute('is');
      // remove ref, same as above
      if (this.descriptor.ref) {
        this.el.removeAttribute('v-ref:' + hyphenate(this.descriptor.ref));
      }
      // if static, build right now.
      if (this.literal) {
        this.setComponent(this.expression);
      }
    } else {
      process.env.NODE_ENV !== 'production' && warn('cannot mount component "' + this.expression + '" ' + 'on already mounted element: ' + this.el);
    }
  },

  /**
   * Public update, called by the watcher in the dynamic
   * literal scenario, e.g. <component :is="view">
   */

  update: function update(value) {
    if (!this.literal) {
      this.setComponent(value);
    }
  },

  /**
   * Switch dynamic components. May resolve the component
   * asynchronously, and perform transition based on
   * specified transition mode. Accepts a few additional
   * arguments specifically for vue-router.
   *
   * The callback is called when the full transition is
   * finished.
   *
   * @param {String} value
   * @param {Function} [cb]
   */

  setComponent: function setComponent(value, cb) {
    this.invalidatePending();
    if (!value) {
      // just remove current
      this.unbuild(true);
      this.remove(this.childVM, cb);
      this.childVM = null;
    } else {
      var self = this;
      this.resolveComponent(value, function () {
        self.mountComponent(cb);
      });
    }
  },

  /**
   * Resolve the component constructor to use when creating
   * the child vm.
   *
   * @param {String|Function} value
   * @param {Function} cb
   */

  resolveComponent: function resolveComponent(value, cb) {
    var self = this;
    this.pendingComponentCb = cancellable(function (Component) {
      self.ComponentName = Component.options.name || (typeof value === 'string' ? value : null);
      self.Component = Component;
      cb();
    });
    this.vm._resolveComponent(value, this.pendingComponentCb);
  },

  /**
   * Create a new instance using the current constructor and
   * replace the existing instance. This method doesn't care
   * whether the new component and the old one are actually
   * the same.
   *
   * @param {Function} [cb]
   */

  mountComponent: function mountComponent(cb) {
    // actual mount
    this.unbuild(true);
    var self = this;
    var activateHooks = this.Component.options.activate;
    var cached = this.getCached();
    var newComponent = this.build();
    if (activateHooks && !cached) {
      this.waitingFor = newComponent;
      callActivateHooks(activateHooks, newComponent, function () {
        if (self.waitingFor !== newComponent) {
          return;
        }
        self.waitingFor = null;
        self.transition(newComponent, cb);
      });
    } else {
      // update ref for kept-alive component
      if (cached) {
        newComponent._updateRef();
      }
      this.transition(newComponent, cb);
    }
  },

  /**
   * When the component changes or unbinds before an async
   * constructor is resolved, we need to invalidate its
   * pending callback.
   */

  invalidatePending: function invalidatePending() {
    if (this.pendingComponentCb) {
      this.pendingComponentCb.cancel();
      this.pendingComponentCb = null;
    }
  },

  /**
   * Instantiate/insert a new child vm.
   * If keep alive and has cached instance, insert that
   * instance; otherwise build a new one and cache it.
   *
   * @param {Object} [extraOptions]
   * @return {Vue} - the created instance
   */

  build: function build(extraOptions) {
    var cached = this.getCached();
    if (cached) {
      return cached;
    }
    if (this.Component) {
      // default options
      var options = {
        name: this.ComponentName,
        el: cloneNode(this.el),
        template: this.inlineTemplate,
        // make sure to add the child with correct parent
        // if this is a transcluded component, its parent
        // should be the transclusion host.
        parent: this._host || this.vm,
        // if no inline-template, then the compiled
        // linker can be cached for better performance.
        _linkerCachable: !this.inlineTemplate,
        _ref: this.descriptor.ref,
        _asComponent: true,
        _isRouterView: this._isRouterView,
        // if this is a transcluded component, context
        // will be the common parent vm of this instance
        // and its host.
        _context: this.vm,
        // if this is inside an inline v-for, the scope
        // will be the intermediate scope created for this
        // repeat fragment. this is used for linking props
        // and container directives.
        _scope: this._scope,
        // pass in the owner fragment of this component.
        // this is necessary so that the fragment can keep
        // track of its contained components in order to
        // call attach/detach hooks for them.
        _frag: this._frag
      };
      // extra options
      // in 1.0.0 this is used by vue-router only
      /* istanbul ignore if */
      if (extraOptions) {
        extend(options, extraOptions);
      }
      var child = new this.Component(options);
      if (this.keepAlive) {
        this.cache[this.Component.cid] = child;
      }
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && this.el.hasAttribute('transition') && child._isFragment) {
        warn('Transitions will not work on a fragment instance. ' + 'Template: ' + child.$options.template, child);
      }
      return child;
    }
  },

  /**
   * Try to get a cached instance of the current component.
   *
   * @return {Vue|undefined}
   */

  getCached: function getCached() {
    return this.keepAlive && this.cache[this.Component.cid];
  },

  /**
   * Teardown the current child, but defers cleanup so
   * that we can separate the destroy and removal steps.
   *
   * @param {Boolean} defer
   */

  unbuild: function unbuild(defer) {
    if (this.waitingFor) {
      if (!this.keepAlive) {
        this.waitingFor.$destroy();
      }
      this.waitingFor = null;
    }
    var child = this.childVM;
    if (!child || this.keepAlive) {
      if (child) {
        // remove ref
        child._inactive = true;
        child._updateRef(true);
      }
      return;
    }
    // the sole purpose of `deferCleanup` is so that we can
    // "deactivate" the vm right now and perform DOM removal
    // later.
    child.$destroy(false, defer);
  },

  /**
   * Remove current destroyed child and manually do
   * the cleanup after removal.
   *
   * @param {Function} cb
   */

  remove: function remove(child, cb) {
    var keepAlive = this.keepAlive;
    if (child) {
      // we may have a component switch when a previous
      // component is still being transitioned out.
      // we want to trigger only one lastest insertion cb
      // when the existing transition finishes. (#1119)
      this.pendingRemovals++;
      this.pendingRemovalCb = cb;
      var self = this;
      child.$remove(function () {
        self.pendingRemovals--;
        if (!keepAlive) child._cleanup();
        if (!self.pendingRemovals && self.pendingRemovalCb) {
          self.pendingRemovalCb();
          self.pendingRemovalCb = null;
        }
      });
    } else if (cb) {
      cb();
    }
  },

  /**
   * Actually swap the components, depending on the
   * transition mode. Defaults to simultaneous.
   *
   * @param {Vue} target
   * @param {Function} [cb]
   */

  transition: function transition(target, cb) {
    var self = this;
    var current = this.childVM;
    // for devtool inspection
    if (current) current._inactive = true;
    target._inactive = false;
    this.childVM = target;
    switch (self.params.transitionMode) {
      case 'in-out':
        target.$before(self.anchor, function () {
          self.remove(current, cb);
        });
        break;
      case 'out-in':
        self.remove(current, function () {
          target.$before(self.anchor, cb);
        });
        break;
      default:
        self.remove(current);
        target.$before(self.anchor, cb);
    }
  },

  /**
   * Unbind.
   */

  unbind: function unbind() {
    this.invalidatePending();
    // Do not defer cleanup when unbinding
    this.unbuild();
    // destroy all keep-alive cached instances
    if (this.cache) {
      for (var key in this.cache) {
        this.cache[key].$destroy();
      }
      this.cache = null;
    }
  }
};

/**
 * Call activate hooks in order (asynchronous)
 *
 * @param {Array} hooks
 * @param {Vue} vm
 * @param {Function} cb
 */

function callActivateHooks(hooks, vm, cb) {
  var total = hooks.length;
  var called = 0;
  hooks[0].call(vm, next);
  function next() {
    if (++called >= total) {
      cb();
    } else {
      hooks[called].call(vm, next);
    }
  }
}

var propBindingModes = config._propBindingModes;
var empty = {};

// regexes
var identRE$1 = /^[$_a-zA-Z]+[\w$]*$/;
var settablePathRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]+\])*$/;

/**
 * Compile props on a root element and return
 * a props link function.
 *
 * @param {Element|DocumentFragment} el
 * @param {Array} propOptions
 * @param {Vue} vm
 * @return {Function} propsLinkFn
 */

function compileProps(el, propOptions, vm) {
  var props = [];
  var names = Object.keys(propOptions);
  var i = names.length;
  var options, name, attr, value, path, parsed, prop;
  while (i--) {
    name = names[i];
    options = propOptions[name] || empty;

    if (process.env.NODE_ENV !== 'production' && name === '$data') {
      warn('Do not use $data as prop.', vm);
      continue;
    }

    // props could contain dashes, which will be
    // interpreted as minus calculations by the parser
    // so we need to camelize the path here
    path = camelize(name);
    if (!identRE$1.test(path)) {
      process.env.NODE_ENV !== 'production' && warn('Invalid prop key: "' + name + '". Prop keys ' + 'must be valid identifiers.', vm);
      continue;
    }

    prop = {
      name: name,
      path: path,
      options: options,
      mode: propBindingModes.ONE_WAY,
      raw: null
    };

    attr = hyphenate(name);
    // first check dynamic version
    if ((value = getBindAttr(el, attr)) === null) {
      if ((value = getBindAttr(el, attr + '.sync')) !== null) {
        prop.mode = propBindingModes.TWO_WAY;
      } else if ((value = getBindAttr(el, attr + '.once')) !== null) {
        prop.mode = propBindingModes.ONE_TIME;
      }
    }
    if (value !== null) {
      // has dynamic binding!
      prop.raw = value;
      parsed = parseDirective(value);
      value = parsed.expression;
      prop.filters = parsed.filters;
      // check binding type
      if (isLiteral(value) && !parsed.filters) {
        // for expressions containing literal numbers and
        // booleans, there's no need to setup a prop binding,
        // so we can optimize them as a one-time set.
        prop.optimizedLiteral = true;
      } else {
        prop.dynamic = true;
        // check non-settable path for two-way bindings
        if (process.env.NODE_ENV !== 'production' && prop.mode === propBindingModes.TWO_WAY && !settablePathRE.test(value)) {
          prop.mode = propBindingModes.ONE_WAY;
          warn('Cannot bind two-way prop with non-settable ' + 'parent path: ' + value, vm);
        }
      }
      prop.parentPath = value;

      // warn required two-way
      if (process.env.NODE_ENV !== 'production' && options.twoWay && prop.mode !== propBindingModes.TWO_WAY) {
        warn('Prop "' + name + '" expects a two-way binding type.', vm);
      }
    } else if ((value = getAttr(el, attr)) !== null) {
      // has literal binding!
      prop.raw = value;
    } else if (process.env.NODE_ENV !== 'production') {
      // check possible camelCase prop usage
      var lowerCaseName = path.toLowerCase();
      value = /[A-Z\-]/.test(name) && (el.getAttribute(lowerCaseName) || el.getAttribute(':' + lowerCaseName) || el.getAttribute('v-bind:' + lowerCaseName) || el.getAttribute(':' + lowerCaseName + '.once') || el.getAttribute('v-bind:' + lowerCaseName + '.once') || el.getAttribute(':' + lowerCaseName + '.sync') || el.getAttribute('v-bind:' + lowerCaseName + '.sync'));
      if (value) {
        warn('Possible usage error for prop `' + lowerCaseName + '` - ' + 'did you mean `' + attr + '`? HTML is case-insensitive, remember to use ' + 'kebab-case for props in templates.', vm);
      } else if (options.required) {
        // warn missing required
        warn('Missing required prop: ' + name, vm);
      }
    }
    // push prop
    props.push(prop);
  }
  return makePropsLinkFn(props);
}

/**
 * Build a function that applies props to a vm.
 *
 * @param {Array} props
 * @return {Function} propsLinkFn
 */

function makePropsLinkFn(props) {
  return function propsLinkFn(vm, scope) {
    // store resolved props info
    vm._props = {};
    var i = props.length;
    var prop, path, options, value, raw;
    while (i--) {
      prop = props[i];
      raw = prop.raw;
      path = prop.path;
      options = prop.options;
      vm._props[path] = prop;
      if (raw === null) {
        // initialize absent prop
        initProp(vm, prop, undefined);
      } else if (prop.dynamic) {
        // dynamic prop
        if (prop.mode === propBindingModes.ONE_TIME) {
          // one time binding
          value = (scope || vm._context || vm).$get(prop.parentPath);
          initProp(vm, prop, value);
        } else {
          if (vm._context) {
            // dynamic binding
            vm._bindDir({
              name: 'prop',
              def: propDef,
              prop: prop
            }, null, null, scope); // el, host, scope
          } else {
              // root instance
              initProp(vm, prop, vm.$get(prop.parentPath));
            }
        }
      } else if (prop.optimizedLiteral) {
        // optimized literal, cast it and just set once
        var stripped = stripQuotes(raw);
        value = stripped === raw ? toBoolean(toNumber(raw)) : stripped;
        initProp(vm, prop, value);
      } else {
        // string literal, but we need to cater for
        // Boolean props with no value, or with same
        // literal value (e.g. disabled="disabled")
        // see https://github.com/vuejs/vue-loader/issues/182
        value = options.type === Boolean && (raw === '' || raw === hyphenate(prop.name)) ? true : raw;
        initProp(vm, prop, value);
      }
    }
  };
}

/**
 * Process a prop with a rawValue, applying necessary coersions,
 * default values & assertions and call the given callback with
 * processed value.
 *
 * @param {Vue} vm
 * @param {Object} prop
 * @param {*} rawValue
 * @param {Function} fn
 */

function processPropValue(vm, prop, rawValue, fn) {
  var isSimple = prop.dynamic && isSimplePath(prop.parentPath);
  var value = rawValue;
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop);
  }
  value = coerceProp(prop, value);
  var coerced = value !== rawValue;
  if (!assertProp(prop, value, vm)) {
    value = undefined;
  }
  if (isSimple && !coerced) {
    withoutConversion(function () {
      fn(value);
    });
  } else {
    fn(value);
  }
}

/**
 * Set a prop's initial value on a vm and its data object.
 *
 * @param {Vue} vm
 * @param {Object} prop
 * @param {*} value
 */

function initProp(vm, prop, value) {
  processPropValue(vm, prop, value, function (value) {
    defineReactive(vm, prop.path, value);
  });
}

/**
 * Update a prop's value on a vm.
 *
 * @param {Vue} vm
 * @param {Object} prop
 * @param {*} value
 */

function updateProp(vm, prop, value) {
  processPropValue(vm, prop, value, function (value) {
    vm[prop.path] = value;
  });
}

/**
 * Get the default value of a prop.
 *
 * @param {Vue} vm
 * @param {Object} prop
 * @return {*}
 */

function getPropDefaultValue(vm, prop) {
  // no default, return undefined
  var options = prop.options;
  if (!hasOwn(options, 'default')) {
    // absent boolean value defaults to false
    return options.type === Boolean ? false : undefined;
  }
  var def = options['default'];
  // warn against non-factory defaults for Object & Array
  if (isObject(def)) {
    process.env.NODE_ENV !== 'production' && warn('Invalid default value for prop "' + prop.name + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
  }
  // call factory function for non-Function types
  return typeof def === 'function' && options.type !== Function ? def.call(vm) : def;
}

/**
 * Assert whether a prop is valid.
 *
 * @param {Object} prop
 * @param {*} value
 * @param {Vue} vm
 */

function assertProp(prop, value, vm) {
  if (!prop.options.required && ( // non-required
  prop.raw === null || // abscent
  value == null) // null or undefined
  ) {
      return true;
    }
  var options = prop.options;
  var type = options.type;
  var valid = !type;
  var expectedTypes = [];
  if (type) {
    if (!isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType);
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    if (process.env.NODE_ENV !== 'production') {
      warn('Invalid prop: type check failed for prop "' + prop.name + '".' + ' Expected ' + expectedTypes.map(formatType).join(', ') + ', got ' + formatValue(value) + '.', vm);
    }
    return false;
  }
  var validator = options.validator;
  if (validator) {
    if (!validator(value)) {
      process.env.NODE_ENV !== 'production' && warn('Invalid prop: custom validator check failed for prop "' + prop.name + '".', vm);
      return false;
    }
  }
  return true;
}

/**
 * Force parsing value with coerce option.
 *
 * @param {*} value
 * @param {Object} options
 * @return {*}
 */

function coerceProp(prop, value) {
  var coerce = prop.options.coerce;
  if (!coerce) {
    return value;
  }
  // coerce is a function
  return coerce(value);
}

/**
 * Assert the type of a value
 *
 * @param {*} value
 * @param {Function} type
 * @return {Object}
 */

function assertType(value, type) {
  var valid;
  var expectedType;
  if (type === String) {
    expectedType = 'string';
    valid = typeof value === expectedType;
  } else if (type === Number) {
    expectedType = 'number';
    valid = typeof value === expectedType;
  } else if (type === Boolean) {
    expectedType = 'boolean';
    valid = typeof value === expectedType;
  } else if (type === Function) {
    expectedType = 'function';
    valid = typeof value === expectedType;
  } else if (type === Object) {
    expectedType = 'object';
    valid = isPlainObject(value);
  } else if (type === Array) {
    expectedType = 'array';
    valid = isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  };
}

/**
 * Format type for output
 *
 * @param {String} type
 * @return {String}
 */

function formatType(type) {
  return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'custom type';
}

/**
 * Format value
 *
 * @param {*} value
 * @return {String}
 */

function formatValue(val) {
  return Object.prototype.toString.call(val).slice(8, -1);
}

var bindingModes = config._propBindingModes;

var propDef = {

  bind: function bind() {
    var child = this.vm;
    var parent = child._context;
    // passed in from compiler directly
    var prop = this.descriptor.prop;
    var childKey = prop.path;
    var parentKey = prop.parentPath;
    var twoWay = prop.mode === bindingModes.TWO_WAY;

    var parentWatcher = this.parentWatcher = new Watcher(parent, parentKey, function (val) {
      updateProp(child, prop, val);
    }, {
      twoWay: twoWay,
      filters: prop.filters,
      // important: props need to be observed on the
      // v-for scope if present
      scope: this._scope
    });

    // set the child initial value.
    initProp(child, prop, parentWatcher.value);

    // setup two-way binding
    if (twoWay) {
      // important: defer the child watcher creation until
      // the created hook (after data observation)
      var self = this;
      child.$once('pre-hook:created', function () {
        self.childWatcher = new Watcher(child, childKey, function (val) {
          parentWatcher.set(val);
        }, {
          // ensure sync upward before parent sync down.
          // this is necessary in cases e.g. the child
          // mutates a prop array, then replaces it. (#1683)
          sync: true
        });
      });
    }
  },

  unbind: function unbind() {
    this.parentWatcher.teardown();
    if (this.childWatcher) {
      this.childWatcher.teardown();
    }
  }
};

var queue$1 = [];
var queued = false;

/**
 * Push a job into the queue.
 *
 * @param {Function} job
 */

function pushJob(job) {
  queue$1.push(job);
  if (!queued) {
    queued = true;
    nextTick(flush);
  }
}

/**
 * Flush the queue, and do one forced reflow before
 * triggering transitions.
 */

function flush() {
  // Force layout
  var f = document.documentElement.offsetHeight;
  for (var i = 0; i < queue$1.length; i++) {
    queue$1[i]();
  }
  queue$1 = [];
  queued = false;
  // dummy return, so js linters don't complain about
  // unused variable f
  return f;
}

var TYPE_TRANSITION = 'transition';
var TYPE_ANIMATION = 'animation';
var transDurationProp = transitionProp + 'Duration';
var animDurationProp = animationProp + 'Duration';

/**
 * If a just-entered element is applied the
 * leave class while its enter transition hasn't started yet,
 * and the transitioned property has the same value for both
 * enter/leave, then the leave transition will be skipped and
 * the transitionend event never fires. This function ensures
 * its callback to be called after a transition has started
 * by waiting for double raf.
 *
 * It falls back to setTimeout on devices that support CSS
 * transitions but not raf (e.g. Android 4.2 browser) - since
 * these environments are usually slow, we are giving it a
 * relatively large timeout.
 */

var raf = inBrowser && window.requestAnimationFrame;
var waitForTransitionStart = raf
/* istanbul ignore next */
? function (fn) {
  raf(function () {
    raf(fn);
  });
} : function (fn) {
  setTimeout(fn, 50);
};

/**
 * A Transition object that encapsulates the state and logic
 * of the transition.
 *
 * @param {Element} el
 * @param {String} id
 * @param {Object} hooks
 * @param {Vue} vm
 */
function Transition(el, id, hooks, vm) {
  this.id = id;
  this.el = el;
  this.enterClass = hooks && hooks.enterClass || id + '-enter';
  this.leaveClass = hooks && hooks.leaveClass || id + '-leave';
  this.hooks = hooks;
  this.vm = vm;
  // async state
  this.pendingCssEvent = this.pendingCssCb = this.cancel = this.pendingJsCb = this.op = this.cb = null;
  this.justEntered = false;
  this.entered = this.left = false;
  this.typeCache = {};
  // check css transition type
  this.type = hooks && hooks.type;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production') {
    if (this.type && this.type !== TYPE_TRANSITION && this.type !== TYPE_ANIMATION) {
      warn('invalid CSS transition type for transition="' + this.id + '": ' + this.type, vm);
    }
  }
  // bind
  var self = this;['enterNextTick', 'enterDone', 'leaveNextTick', 'leaveDone'].forEach(function (m) {
    self[m] = bind(self[m], self);
  });
}

var p$1 = Transition.prototype;

/**
 * Start an entering transition.
 *
 * 1. enter transition triggered
 * 2. call beforeEnter hook
 * 3. add enter class
 * 4. insert/show element
 * 5. call enter hook (with possible explicit js callback)
 * 6. reflow
 * 7. based on transition type:
 *    - transition:
 *        remove class now, wait for transitionend,
 *        then done if there's no explicit js callback.
 *    - animation:
 *        wait for animationend, remove class,
 *        then done if there's no explicit js callback.
 *    - no css transition:
 *        done now if there's no explicit js callback.
 * 8. wait for either done or js callback, then call
 *    afterEnter hook.
 *
 * @param {Function} op - insert/show the element
 * @param {Function} [cb]
 */

p$1.enter = function (op, cb) {
  this.cancelPending();
  this.callHook('beforeEnter');
  this.cb = cb;
  addClass(this.el, this.enterClass);
  op();
  this.entered = false;
  this.callHookWithCb('enter');
  if (this.entered) {
    return; // user called done synchronously.
  }
  this.cancel = this.hooks && this.hooks.enterCancelled;
  pushJob(this.enterNextTick);
};

/**
 * The "nextTick" phase of an entering transition, which is
 * to be pushed into a queue and executed after a reflow so
 * that removing the class can trigger a CSS transition.
 */

p$1.enterNextTick = function () {
  var _this = this;

  // prevent transition skipping
  this.justEntered = true;
  waitForTransitionStart(function () {
    _this.justEntered = false;
  });
  var enterDone = this.enterDone;
  var type = this.getCssTransitionType(this.enterClass);
  if (!this.pendingJsCb) {
    if (type === TYPE_TRANSITION) {
      // trigger transition by removing enter class now
      removeClass(this.el, this.enterClass);
      this.setupCssCb(transitionEndEvent, enterDone);
    } else if (type === TYPE_ANIMATION) {
      this.setupCssCb(animationEndEvent, enterDone);
    } else {
      enterDone();
    }
  } else if (type === TYPE_TRANSITION) {
    removeClass(this.el, this.enterClass);
  }
};

/**
 * The "cleanup" phase of an entering transition.
 */

p$1.enterDone = function () {
  this.entered = true;
  this.cancel = this.pendingJsCb = null;
  removeClass(this.el, this.enterClass);
  this.callHook('afterEnter');
  if (this.cb) this.cb();
};

/**
 * Start a leaving transition.
 *
 * 1. leave transition triggered.
 * 2. call beforeLeave hook
 * 3. add leave class (trigger css transition)
 * 4. call leave hook (with possible explicit js callback)
 * 5. reflow if no explicit js callback is provided
 * 6. based on transition type:
 *    - transition or animation:
 *        wait for end event, remove class, then done if
 *        there's no explicit js callback.
 *    - no css transition:
 *        done if there's no explicit js callback.
 * 7. wait for either done or js callback, then call
 *    afterLeave hook.
 *
 * @param {Function} op - remove/hide the element
 * @param {Function} [cb]
 */

p$1.leave = function (op, cb) {
  this.cancelPending();
  this.callHook('beforeLeave');
  this.op = op;
  this.cb = cb;
  addClass(this.el, this.leaveClass);
  this.left = false;
  this.callHookWithCb('leave');
  if (this.left) {
    return; // user called done synchronously.
  }
  this.cancel = this.hooks && this.hooks.leaveCancelled;
  // only need to handle leaveDone if
  // 1. the transition is already done (synchronously called
  //    by the user, which causes this.op set to null)
  // 2. there's no explicit js callback
  if (this.op && !this.pendingJsCb) {
    // if a CSS transition leaves immediately after enter,
    // the transitionend event never fires. therefore we
    // detect such cases and end the leave immediately.
    if (this.justEntered) {
      this.leaveDone();
    } else {
      pushJob(this.leaveNextTick);
    }
  }
};

/**
 * The "nextTick" phase of a leaving transition.
 */

p$1.leaveNextTick = function () {
  var type = this.getCssTransitionType(this.leaveClass);
  if (type) {
    var event = type === TYPE_TRANSITION ? transitionEndEvent : animationEndEvent;
    this.setupCssCb(event, this.leaveDone);
  } else {
    this.leaveDone();
  }
};

/**
 * The "cleanup" phase of a leaving transition.
 */

p$1.leaveDone = function () {
  this.left = true;
  this.cancel = this.pendingJsCb = null;
  this.op();
  removeClass(this.el, this.leaveClass);
  this.callHook('afterLeave');
  if (this.cb) this.cb();
  this.op = null;
};

/**
 * Cancel any pending callbacks from a previously running
 * but not finished transition.
 */

p$1.cancelPending = function () {
  this.op = this.cb = null;
  var hasPending = false;
  if (this.pendingCssCb) {
    hasPending = true;
    off(this.el, this.pendingCssEvent, this.pendingCssCb);
    this.pendingCssEvent = this.pendingCssCb = null;
  }
  if (this.pendingJsCb) {
    hasPending = true;
    this.pendingJsCb.cancel();
    this.pendingJsCb = null;
  }
  if (hasPending) {
    removeClass(this.el, this.enterClass);
    removeClass(this.el, this.leaveClass);
  }
  if (this.cancel) {
    this.cancel.call(this.vm, this.el);
    this.cancel = null;
  }
};

/**
 * Call a user-provided synchronous hook function.
 *
 * @param {String} type
 */

p$1.callHook = function (type) {
  if (this.hooks && this.hooks[type]) {
    this.hooks[type].call(this.vm, this.el);
  }
};

/**
 * Call a user-provided, potentially-async hook function.
 * We check for the length of arguments to see if the hook
 * expects a `done` callback. If true, the transition's end
 * will be determined by when the user calls that callback;
 * otherwise, the end is determined by the CSS transition or
 * animation.
 *
 * @param {String} type
 */

p$1.callHookWithCb = function (type) {
  var hook = this.hooks && this.hooks[type];
  if (hook) {
    if (hook.length > 1) {
      this.pendingJsCb = cancellable(this[type + 'Done']);
    }
    hook.call(this.vm, this.el, this.pendingJsCb);
  }
};

/**
 * Get an element's transition type based on the
 * calculated styles.
 *
 * @param {String} className
 * @return {Number}
 */

p$1.getCssTransitionType = function (className) {
  /* istanbul ignore if */
  if (!transitionEndEvent ||
  // skip CSS transitions if page is not visible -
  // this solves the issue of transitionend events not
  // firing until the page is visible again.
  // pageVisibility API is supported in IE10+, same as
  // CSS transitions.
  document.hidden ||
  // explicit js-only transition
  this.hooks && this.hooks.css === false ||
  // element is hidden
  isHidden(this.el)) {
    return;
  }
  var type = this.type || this.typeCache[className];
  if (type) return type;
  var inlineStyles = this.el.style;
  var computedStyles = window.getComputedStyle(this.el);
  var transDuration = inlineStyles[transDurationProp] || computedStyles[transDurationProp];
  if (transDuration && transDuration !== '0s') {
    type = TYPE_TRANSITION;
  } else {
    var animDuration = inlineStyles[animDurationProp] || computedStyles[animDurationProp];
    if (animDuration && animDuration !== '0s') {
      type = TYPE_ANIMATION;
    }
  }
  if (type) {
    this.typeCache[className] = type;
  }
  return type;
};

/**
 * Setup a CSS transitionend/animationend callback.
 *
 * @param {String} event
 * @param {Function} cb
 */

p$1.setupCssCb = function (event, cb) {
  this.pendingCssEvent = event;
  var self = this;
  var el = this.el;
  var onEnd = this.pendingCssCb = function (e) {
    if (e.target === el) {
      off(el, event, onEnd);
      self.pendingCssEvent = self.pendingCssCb = null;
      if (!self.pendingJsCb && cb) {
        cb();
      }
    }
  };
  on(el, event, onEnd);
};

/**
 * Check if an element is hidden - in that case we can just
 * skip the transition alltogether.
 *
 * @param {Element} el
 * @return {Boolean}
 */

function isHidden(el) {
  if (/svg$/.test(el.namespaceURI)) {
    // SVG elements do not have offset(Width|Height)
    // so we need to check the client rect
    var rect = el.getBoundingClientRect();
    return !(rect.width || rect.height);
  } else {
    return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }
}

var transition$1 = {

  priority: TRANSITION,

  update: function update(id, oldId) {
    var el = this.el;
    // resolve on owner vm
    var hooks = resolveAsset(this.vm.$options, 'transitions', id);
    id = id || 'v';
    el.__v_trans = new Transition(el, id, hooks, this.vm);
    if (oldId) {
      removeClass(el, oldId + '-transition');
    }
    addClass(el, id + '-transition');
  }
};

var internalDirectives = {
  style: style,
  'class': vClass,
  component: component,
  prop: propDef,
  transition: transition$1
};

// special binding prefixes
var bindRE = /^v-bind:|^:/;
var onRE = /^v-on:|^@/;
var dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/;
var modifierRE = /\.[^\.]+/g;
var transitionRE = /^(v-bind:|:)?transition$/;

// default directive priority
var DEFAULT_PRIORITY = 1000;
var DEFAULT_TERMINAL_PRIORITY = 2000;

/**
 * Compile a template and return a reusable composite link
 * function, which recursively contains more link functions
 * inside. This top level compile function would normally
 * be called on instance root nodes, but can also be used
 * for partial compilation if the partial argument is true.
 *
 * The returned composite link function, when called, will
 * return an unlink function that tearsdown all directives
 * created during the linking phase.
 *
 * @param {Element|DocumentFragment} el
 * @param {Object} options
 * @param {Boolean} partial
 * @return {Function}
 */

function compile(el, options, partial) {
  // link function for the node itself.
  var nodeLinkFn = partial || !options._asComponent ? compileNode(el, options) : null;
  // link function for the childNodes
  var childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && el.tagName !== 'SCRIPT' && el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null;

  /**
   * A composite linker function to be called on a already
   * compiled piece of DOM, which instantiates all directive
   * instances.
   *
   * @param {Vue} vm
   * @param {Element|DocumentFragment} el
   * @param {Vue} [host] - host vm of transcluded content
   * @param {Object} [scope] - v-for scope
   * @param {Fragment} [frag] - link context fragment
   * @return {Function|undefined}
   */

  return function compositeLinkFn(vm, el, host, scope, frag) {
    // cache childNodes before linking parent, fix #657
    var childNodes = toArray(el.childNodes);
    // link
    var dirs = linkAndCapture(function compositeLinkCapturer() {
      if (nodeLinkFn) nodeLinkFn(vm, el, host, scope, frag);
      if (childLinkFn) childLinkFn(vm, childNodes, host, scope, frag);
    }, vm);
    return makeUnlinkFn(vm, dirs);
  };
}

/**
 * Apply a linker to a vm/element pair and capture the
 * directives created during the process.
 *
 * @param {Function} linker
 * @param {Vue} vm
 */

function linkAndCapture(linker, vm) {
  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'production') {
    // reset directives before every capture in production
    // mode, so that when unlinking we don't need to splice
    // them out (which turns out to be a perf hit).
    // they are kept in development mode because they are
    // useful for Vue's own tests.
    vm._directives = [];
  }
  var originalDirCount = vm._directives.length;
  linker();
  var dirs = vm._directives.slice(originalDirCount);
  dirs.sort(directiveComparator);
  for (var i = 0, l = dirs.length; i < l; i++) {
    dirs[i]._bind();
  }
  return dirs;
}

/**
 * Directive priority sort comparator
 *
 * @param {Object} a
 * @param {Object} b
 */

function directiveComparator(a, b) {
  a = a.descriptor.def.priority || DEFAULT_PRIORITY;
  b = b.descriptor.def.priority || DEFAULT_PRIORITY;
  return a > b ? -1 : a === b ? 0 : 1;
}

/**
 * Linker functions return an unlink function that
 * tearsdown all directives instances generated during
 * the process.
 *
 * We create unlink functions with only the necessary
 * information to avoid retaining additional closures.
 *
 * @param {Vue} vm
 * @param {Array} dirs
 * @param {Vue} [context]
 * @param {Array} [contextDirs]
 * @return {Function}
 */

function makeUnlinkFn(vm, dirs, context, contextDirs) {
  function unlink(destroying) {
    teardownDirs(vm, dirs, destroying);
    if (context && contextDirs) {
      teardownDirs(context, contextDirs);
    }
  }
  // expose linked directives
  unlink.dirs = dirs;
  return unlink;
}

/**
 * Teardown partial linked directives.
 *
 * @param {Vue} vm
 * @param {Array} dirs
 * @param {Boolean} destroying
 */

function teardownDirs(vm, dirs, destroying) {
  var i = dirs.length;
  while (i--) {
    dirs[i]._teardown();
    if (process.env.NODE_ENV !== 'production' && !destroying) {
      vm._directives.$remove(dirs[i]);
    }
  }
}

/**
 * Compile link props on an instance.
 *
 * @param {Vue} vm
 * @param {Element} el
 * @param {Object} props
 * @param {Object} [scope]
 * @return {Function}
 */

function compileAndLinkProps(vm, el, props, scope) {
  var propsLinkFn = compileProps(el, props, vm);
  var propDirs = linkAndCapture(function () {
    propsLinkFn(vm, scope);
  }, vm);
  return makeUnlinkFn(vm, propDirs);
}

/**
 * Compile the root element of an instance.
 *
 * 1. attrs on context container (context scope)
 * 2. attrs on the component template root node, if
 *    replace:true (child scope)
 *
 * If this is a fragment instance, we only need to compile 1.
 *
 * @param {Element} el
 * @param {Object} options
 * @param {Object} contextOptions
 * @return {Function}
 */

function compileRoot(el, options, contextOptions) {
  var containerAttrs = options._containerAttrs;
  var replacerAttrs = options._replacerAttrs;
  var contextLinkFn, replacerLinkFn;

  // only need to compile other attributes for
  // non-fragment instances
  if (el.nodeType !== 11) {
    // for components, container and replacer need to be
    // compiled separately and linked in different scopes.
    if (options._asComponent) {
      // 2. container attributes
      if (containerAttrs && contextOptions) {
        contextLinkFn = compileDirectives(containerAttrs, contextOptions);
      }
      if (replacerAttrs) {
        // 3. replacer attributes
        replacerLinkFn = compileDirectives(replacerAttrs, options);
      }
    } else {
      // non-component, just compile as a normal element.
      replacerLinkFn = compileDirectives(el.attributes, options);
    }
  } else if (process.env.NODE_ENV !== 'production' && containerAttrs) {
    // warn container directives for fragment instances
    var names = containerAttrs.filter(function (attr) {
      // allow vue-loader/vueify scoped css attributes
      return attr.name.indexOf('_v-') < 0 &&
      // allow event listeners
      !onRE.test(attr.name) &&
      // allow slots
      attr.name !== 'slot';
    }).map(function (attr) {
      return '"' + attr.name + '"';
    });
    if (names.length) {
      var plural = names.length > 1;
      warn('Attribute' + (plural ? 's ' : ' ') + names.join(', ') + (plural ? ' are' : ' is') + ' ignored on component ' + '<' + options.el.tagName.toLowerCase() + '> because ' + 'the component is a fragment instance: ' + 'http://vuejs.org/guide/components.html#Fragment_Instance');
    }
  }

  options._containerAttrs = options._replacerAttrs = null;
  return function rootLinkFn(vm, el, scope) {
    // link context scope dirs
    var context = vm._context;
    var contextDirs;
    if (context && contextLinkFn) {
      contextDirs = linkAndCapture(function () {
        contextLinkFn(context, el, null, scope);
      }, context);
    }

    // link self
    var selfDirs = linkAndCapture(function () {
      if (replacerLinkFn) replacerLinkFn(vm, el);
    }, vm);

    // return the unlink function that tearsdown context
    // container directives.
    return makeUnlinkFn(vm, selfDirs, context, contextDirs);
  };
}

/**
 * Compile a node and return a nodeLinkFn based on the
 * node type.
 *
 * @param {Node} node
 * @param {Object} options
 * @return {Function|null}
 */

function compileNode(node, options) {
  var type = node.nodeType;
  if (type === 1 && node.tagName !== 'SCRIPT') {
    return compileElement(node, options);
  } else if (type === 3 && node.data.trim()) {
    return compileTextNode(node, options);
  } else {
    return null;
  }
}

/**
 * Compile an element and return a nodeLinkFn.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function|null}
 */

function compileElement(el, options) {
  // preprocess textareas.
  // textarea treats its text content as the initial value.
  // just bind it as an attr directive for value.
  if (el.tagName === 'TEXTAREA') {
    var tokens = parseText(el.value);
    if (tokens) {
      el.setAttribute(':value', tokensToExp(tokens));
      el.value = '';
    }
  }
  var linkFn;
  var hasAttrs = el.hasAttributes();
  var attrs = hasAttrs && toArray(el.attributes);
  // check terminal directives (for & if)
  if (hasAttrs) {
    linkFn = checkTerminalDirectives(el, attrs, options);
  }
  // check element directives
  if (!linkFn) {
    linkFn = checkElementDirectives(el, options);
  }
  // check component
  if (!linkFn) {
    linkFn = checkComponent(el, options);
  }
  // normal directives
  if (!linkFn && hasAttrs) {
    linkFn = compileDirectives(attrs, options);
  }
  return linkFn;
}

/**
 * Compile a textNode and return a nodeLinkFn.
 *
 * @param {TextNode} node
 * @param {Object} options
 * @return {Function|null} textNodeLinkFn
 */

function compileTextNode(node, options) {
  // skip marked text nodes
  if (node._skip) {
    return removeText;
  }

  var tokens = parseText(node.wholeText);
  if (!tokens) {
    return null;
  }

  // mark adjacent text nodes as skipped,
  // because we are using node.wholeText to compile
  // all adjacent text nodes together. This fixes
  // issues in IE where sometimes it splits up a single
  // text node into multiple ones.
  var next = node.nextSibling;
  while (next && next.nodeType === 3) {
    next._skip = true;
    next = next.nextSibling;
  }

  var frag = document.createDocumentFragment();
  var el, token;
  for (var i = 0, l = tokens.length; i < l; i++) {
    token = tokens[i];
    el = token.tag ? processTextToken(token, options) : document.createTextNode(token.value);
    frag.appendChild(el);
  }
  return makeTextNodeLinkFn(tokens, frag, options);
}

/**
 * Linker for an skipped text node.
 *
 * @param {Vue} vm
 * @param {Text} node
 */

function removeText(vm, node) {
  remove(node);
}

/**
 * Process a single text token.
 *
 * @param {Object} token
 * @param {Object} options
 * @return {Node}
 */

function processTextToken(token, options) {
  var el;
  if (token.oneTime) {
    el = document.createTextNode(token.value);
  } else {
    if (token.html) {
      el = document.createComment('v-html');
      setTokenType('html');
    } else {
      // IE will clean up empty textNodes during
      // frag.cloneNode(true), so we have to give it
      // something here...
      el = document.createTextNode(' ');
      setTokenType('text');
    }
  }
  function setTokenType(type) {
    if (token.descriptor) return;
    var parsed = parseDirective(token.value);
    token.descriptor = {
      name: type,
      def: directives[type],
      expression: parsed.expression,
      filters: parsed.filters
    };
  }
  return el;
}

/**
 * Build a function that processes a textNode.
 *
 * @param {Array<Object>} tokens
 * @param {DocumentFragment} frag
 */

function makeTextNodeLinkFn(tokens, frag) {
  return function textNodeLinkFn(vm, el, host, scope) {
    var fragClone = frag.cloneNode(true);
    var childNodes = toArray(fragClone.childNodes);
    var token, value, node;
    for (var i = 0, l = tokens.length; i < l; i++) {
      token = tokens[i];
      value = token.value;
      if (token.tag) {
        node = childNodes[i];
        if (token.oneTime) {
          value = (scope || vm).$eval(value);
          if (token.html) {
            replace(node, parseTemplate(value, true));
          } else {
            node.data = value;
          }
        } else {
          vm._bindDir(token.descriptor, node, host, scope);
        }
      }
    }
    replace(el, fragClone);
  };
}

/**
 * Compile a node list and return a childLinkFn.
 *
 * @param {NodeList} nodeList
 * @param {Object} options
 * @return {Function|undefined}
 */

function compileNodeList(nodeList, options) {
  var linkFns = [];
  var nodeLinkFn, childLinkFn, node;
  for (var i = 0, l = nodeList.length; i < l; i++) {
    node = nodeList[i];
    nodeLinkFn = compileNode(node, options);
    childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && node.tagName !== 'SCRIPT' && node.hasChildNodes() ? compileNodeList(node.childNodes, options) : null;
    linkFns.push(nodeLinkFn, childLinkFn);
  }
  return linkFns.length ? makeChildLinkFn(linkFns) : null;
}

/**
 * Make a child link function for a node's childNodes.
 *
 * @param {Array<Function>} linkFns
 * @return {Function} childLinkFn
 */

function makeChildLinkFn(linkFns) {
  return function childLinkFn(vm, nodes, host, scope, frag) {
    var node, nodeLinkFn, childrenLinkFn;
    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
      node = nodes[n];
      nodeLinkFn = linkFns[i++];
      childrenLinkFn = linkFns[i++];
      // cache childNodes before linking parent, fix #657
      var childNodes = toArray(node.childNodes);
      if (nodeLinkFn) {
        nodeLinkFn(vm, node, host, scope, frag);
      }
      if (childrenLinkFn) {
        childrenLinkFn(vm, childNodes, host, scope, frag);
      }
    }
  };
}

/**
 * Check for element directives (custom elements that should
 * be resovled as terminal directives).
 *
 * @param {Element} el
 * @param {Object} options
 */

function checkElementDirectives(el, options) {
  var tag = el.tagName.toLowerCase();
  if (commonTagRE.test(tag)) {
    return;
  }
  var def = resolveAsset(options, 'elementDirectives', tag);
  if (def) {
    return makeTerminalNodeLinkFn(el, tag, '', options, def);
  }
}

/**
 * Check if an element is a component. If yes, return
 * a component link function.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function|undefined}
 */

function checkComponent(el, options) {
  var component = checkComponentAttr(el, options);
  if (component) {
    var ref = findRef(el);
    var descriptor = {
      name: 'component',
      ref: ref,
      expression: component.id,
      def: internalDirectives.component,
      modifiers: {
        literal: !component.dynamic
      }
    };
    var componentLinkFn = function componentLinkFn(vm, el, host, scope, frag) {
      if (ref) {
        defineReactive((scope || vm).$refs, ref, null);
      }
      vm._bindDir(descriptor, el, host, scope, frag);
    };
    componentLinkFn.terminal = true;
    return componentLinkFn;
  }
}

/**
 * Check an element for terminal directives in fixed order.
 * If it finds one, return a terminal link function.
 *
 * @param {Element} el
 * @param {Array} attrs
 * @param {Object} options
 * @return {Function} terminalLinkFn
 */

function checkTerminalDirectives(el, attrs, options) {
  // skip v-pre
  if (getAttr(el, 'v-pre') !== null) {
    return skip;
  }
  // skip v-else block, but only if following v-if
  if (el.hasAttribute('v-else')) {
    var prev = el.previousElementSibling;
    if (prev && prev.hasAttribute('v-if')) {
      return skip;
    }
  }

  var attr, name, value, modifiers, matched, dirName, rawName, arg, def, termDef;
  for (var i = 0, j = attrs.length; i < j; i++) {
    attr = attrs[i];
    modifiers = parseModifiers(attr.name);
    name = attr.name.replace(modifierRE, '');
    if (matched = name.match(dirAttrRE)) {
      def = resolveAsset(options, 'directives', matched[1]);
      if (def && def.terminal) {
        if (!termDef || (def.priority || DEFAULT_TERMINAL_PRIORITY) > termDef.priority) {
          termDef = def;
          rawName = attr.name;
          value = attr.value;
          dirName = matched[1];
          arg = matched[2];
        }
      }
    }
  }

  if (termDef) {
    return makeTerminalNodeLinkFn(el, dirName, value, options, termDef, rawName, arg, modifiers);
  }
}

function skip() {}
skip.terminal = true;

/**
 * Build a node link function for a terminal directive.
 * A terminal link function terminates the current
 * compilation recursion and handles compilation of the
 * subtree in the directive.
 *
 * @param {Element} el
 * @param {String} dirName
 * @param {String} value
 * @param {Object} options
 * @param {Object} def
 * @param {String} [rawName]
 * @param {String} [arg]
 * @param {Object} [modifiers]
 * @return {Function} terminalLinkFn
 */

function makeTerminalNodeLinkFn(el, dirName, value, options, def, rawName, arg, modifiers) {
  var parsed = parseDirective(value);
  var descriptor = {
    name: dirName,
    arg: arg,
    expression: parsed.expression,
    filters: parsed.filters,
    raw: value,
    attr: rawName,
    modifiers: modifiers,
    def: def
  };
  // check ref for v-for and router-view
  if (dirName === 'for' || dirName === 'router-view') {
    descriptor.ref = findRef(el);
  }
  var fn = function terminalNodeLinkFn(vm, el, host, scope, frag) {
    if (descriptor.ref) {
      defineReactive((scope || vm).$refs, descriptor.ref, null);
    }
    vm._bindDir(descriptor, el, host, scope, frag);
  };
  fn.terminal = true;
  return fn;
}

/**
 * Compile the directives on an element and return a linker.
 *
 * @param {Array|NamedNodeMap} attrs
 * @param {Object} options
 * @return {Function}
 */

function compileDirectives(attrs, options) {
  var i = attrs.length;
  var dirs = [];
  var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched;
  while (i--) {
    attr = attrs[i];
    name = rawName = attr.name;
    value = rawValue = attr.value;
    tokens = parseText(value);
    // reset arg
    arg = null;
    // check modifiers
    modifiers = parseModifiers(name);
    name = name.replace(modifierRE, '');

    // attribute interpolations
    if (tokens) {
      value = tokensToExp(tokens);
      arg = name;
      pushDir('bind', directives.bind, tokens);
      // warn against mixing mustaches with v-bind
      if (process.env.NODE_ENV !== 'production') {
        if (name === 'class' && Array.prototype.some.call(attrs, function (attr) {
          return attr.name === ':class' || attr.name === 'v-bind:class';
        })) {
          warn('class="' + rawValue + '": Do not mix mustache interpolation ' + 'and v-bind for "class" on the same element. Use one or the other.', options);
        }
      }
    } else

      // special attribute: transition
      if (transitionRE.test(name)) {
        modifiers.literal = !bindRE.test(name);
        pushDir('transition', internalDirectives.transition);
      } else

        // event handlers
        if (onRE.test(name)) {
          arg = name.replace(onRE, '');
          pushDir('on', directives.on);
        } else

          // attribute bindings
          if (bindRE.test(name)) {
            dirName = name.replace(bindRE, '');
            if (dirName === 'style' || dirName === 'class') {
              pushDir(dirName, internalDirectives[dirName]);
            } else {
              arg = dirName;
              pushDir('bind', directives.bind);
            }
          } else

            // normal directives
            if (matched = name.match(dirAttrRE)) {
              dirName = matched[1];
              arg = matched[2];

              // skip v-else (when used with v-show)
              if (dirName === 'else') {
                continue;
              }

              dirDef = resolveAsset(options, 'directives', dirName, true);
              if (dirDef) {
                pushDir(dirName, dirDef);
              }
            }
  }

  /**
   * Push a directive.
   *
   * @param {String} dirName
   * @param {Object|Function} def
   * @param {Array} [interpTokens]
   */

  function pushDir(dirName, def, interpTokens) {
    var hasOneTimeToken = interpTokens && hasOneTime(interpTokens);
    var parsed = !hasOneTimeToken && parseDirective(value);
    dirs.push({
      name: dirName,
      attr: rawName,
      raw: rawValue,
      def: def,
      arg: arg,
      modifiers: modifiers,
      // conversion from interpolation strings with one-time token
      // to expression is differed until directive bind time so that we
      // have access to the actual vm context for one-time bindings.
      expression: parsed && parsed.expression,
      filters: parsed && parsed.filters,
      interp: interpTokens,
      hasOneTime: hasOneTimeToken
    });
  }

  if (dirs.length) {
    return makeNodeLinkFn(dirs);
  }
}

/**
 * Parse modifiers from directive attribute name.
 *
 * @param {String} name
 * @return {Object}
 */

function parseModifiers(name) {
  var res = Object.create(null);
  var match = name.match(modifierRE);
  if (match) {
    var i = match.length;
    while (i--) {
      res[match[i].slice(1)] = true;
    }
  }
  return res;
}

/**
 * Build a link function for all directives on a single node.
 *
 * @param {Array} directives
 * @return {Function} directivesLinkFn
 */

function makeNodeLinkFn(directives) {
  return function nodeLinkFn(vm, el, host, scope, frag) {
    // reverse apply because it's sorted low to high
    var i = directives.length;
    while (i--) {
      vm._bindDir(directives[i], el, host, scope, frag);
    }
  };
}

/**
 * Check if an interpolation string contains one-time tokens.
 *
 * @param {Array} tokens
 * @return {Boolean}
 */

function hasOneTime(tokens) {
  var i = tokens.length;
  while (i--) {
    if (tokens[i].oneTime) return true;
  }
}

var specialCharRE = /[^\w\-:\.]/;

/**
 * Process an element or a DocumentFragment based on a
 * instance option object. This allows us to transclude
 * a template node/fragment before the instance is created,
 * so the processed fragment can then be cloned and reused
 * in v-for.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Element|DocumentFragment}
 */

function transclude(el, options) {
  // extract container attributes to pass them down
  // to compiler, because they need to be compiled in
  // parent scope. we are mutating the options object here
  // assuming the same object will be used for compile
  // right after this.
  if (options) {
    options._containerAttrs = extractAttrs(el);
  }
  // for template tags, what we want is its content as
  // a documentFragment (for fragment instances)
  if (isTemplate(el)) {
    el = parseTemplate(el);
  }
  if (options) {
    if (options._asComponent && !options.template) {
      options.template = '<slot></slot>';
    }
    if (options.template) {
      options._content = extractContent(el);
      el = transcludeTemplate(el, options);
    }
  }
  if (isFragment(el)) {
    // anchors for fragment instance
    // passing in `persist: true` to avoid them being
    // discarded by IE during template cloning
    prepend(createAnchor('v-start', true), el);
    el.appendChild(createAnchor('v-end', true));
  }
  return el;
}

/**
 * Process the template option.
 * If the replace option is true this will swap the $el.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Element|DocumentFragment}
 */

function transcludeTemplate(el, options) {
  var template = options.template;
  var frag = parseTemplate(template, true);
  if (frag) {
    var replacer = frag.firstChild;
    var tag = replacer.tagName && replacer.tagName.toLowerCase();
    if (options.replace) {
      /* istanbul ignore if */
      if (el === document.body) {
        process.env.NODE_ENV !== 'production' && warn('You are mounting an instance with a template to ' + '<body>. This will replace <body> entirely. You ' + 'should probably use `replace: false` here.');
      }
      // there are many cases where the instance must
      // become a fragment instance: basically anything that
      // can create more than 1 root nodes.
      if (
      // multi-children template
      frag.childNodes.length > 1 ||
      // non-element template
      replacer.nodeType !== 1 ||
      // single nested component
      tag === 'component' || resolveAsset(options, 'components', tag) || hasBindAttr(replacer, 'is') ||
      // element directive
      resolveAsset(options, 'elementDirectives', tag) ||
      // for block
      replacer.hasAttribute('v-for') ||
      // if block
      replacer.hasAttribute('v-if')) {
        return frag;
      } else {
        options._replacerAttrs = extractAttrs(replacer);
        mergeAttrs(el, replacer);
        return replacer;
      }
    } else {
      el.appendChild(frag);
      return el;
    }
  } else {
    process.env.NODE_ENV !== 'production' && warn('Invalid template option: ' + template);
  }
}

/**
 * Helper to extract a component container's attributes
 * into a plain object array.
 *
 * @param {Element} el
 * @return {Array}
 */

function extractAttrs(el) {
  if (el.nodeType === 1 && el.hasAttributes()) {
    return toArray(el.attributes);
  }
}

/**
 * Merge the attributes of two elements, and make sure
 * the class names are merged properly.
 *
 * @param {Element} from
 * @param {Element} to
 */

function mergeAttrs(from, to) {
  var attrs = from.attributes;
  var i = attrs.length;
  var name, value;
  while (i--) {
    name = attrs[i].name;
    value = attrs[i].value;
    if (!to.hasAttribute(name) && !specialCharRE.test(name)) {
      to.setAttribute(name, value);
    } else if (name === 'class' && !parseText(value)) {
      value.trim().split(/\s+/).forEach(function (cls) {
        addClass(to, cls);
      });
    }
  }
}

/**
 * Scan and determine slot content distribution.
 * We do this during transclusion instead at compile time so that
 * the distribution is decoupled from the compilation order of
 * the slots.
 *
 * @param {Element|DocumentFragment} template
 * @param {Element} content
 * @param {Vue} vm
 */

function resolveSlots(vm, content) {
  if (!content) {
    return;
  }
  var contents = vm._slotContents = Object.create(null);
  var el, name;
  for (var i = 0, l = content.children.length; i < l; i++) {
    el = content.children[i];
    /* eslint-disable no-cond-assign */
    if (name = el.getAttribute('slot')) {
      (contents[name] || (contents[name] = [])).push(el);
    }
    /* eslint-enable no-cond-assign */
    if (process.env.NODE_ENV !== 'production' && getBindAttr(el, 'slot')) {
      warn('The "slot" attribute must be static.', vm.$parent);
    }
  }
  for (name in contents) {
    contents[name] = extractFragment(contents[name], content);
  }
  if (content.hasChildNodes()) {
    contents['default'] = extractFragment(content.childNodes, content);
  }
}

/**
 * Extract qualified content nodes from a node list.
 *
 * @param {NodeList} nodes
 * @return {DocumentFragment}
 */

function extractFragment(nodes, parent) {
  var frag = document.createDocumentFragment();
  nodes = toArray(nodes);
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    if (isTemplate(node) && !node.hasAttribute('v-if') && !node.hasAttribute('v-for')) {
      parent.removeChild(node);
      node = parseTemplate(node);
    }
    frag.appendChild(node);
  }
  return frag;
}



var compiler = Object.freeze({
	compile: compile,
	compileAndLinkProps: compileAndLinkProps,
	compileRoot: compileRoot,
	transclude: transclude,
	resolveSlots: resolveSlots
});

function stateMixin (Vue) {
  /**
   * Accessor for `$data` property, since setting $data
   * requires observing the new object and updating
   * proxied properties.
   */

  Object.defineProperty(Vue.prototype, '$data', {
    get: function get() {
      return this._data;
    },
    set: function set(newData) {
      if (newData !== this._data) {
        this._setData(newData);
      }
    }
  });

  /**
   * Setup the scope of an instance, which contains:
   * - observed data
   * - computed properties
   * - user methods
   * - meta properties
   */

  Vue.prototype._initState = function () {
    this._initProps();
    this._initMeta();
    this._initMethods();
    this._initData();
    this._initComputed();
  };

  /**
   * Initialize props.
   */

  Vue.prototype._initProps = function () {
    var options = this.$options;
    var el = options.el;
    var props = options.props;
    if (props && !el) {
      process.env.NODE_ENV !== 'production' && warn('Props will not be compiled if no `el` option is ' + 'provided at instantiation.', this);
    }
    // make sure to convert string selectors into element now
    el = options.el = query(el);
    this._propsUnlinkFn = el && el.nodeType === 1 && props
    // props must be linked in proper scope if inside v-for
    ? compileAndLinkProps(this, el, props, this._scope) : null;
  };

  /**
   * Initialize the data.
   */

  Vue.prototype._initData = function () {
    var dataFn = this.$options.data;
    var data = this._data = dataFn ? dataFn() : {};
    if (!isPlainObject(data)) {
      data = {};
      process.env.NODE_ENV !== 'production' && warn('data functions should return an object.', this);
    }
    var props = this._props;
    var runtimeData = this._runtimeData ? typeof this._runtimeData === 'function' ? this._runtimeData() : this._runtimeData : null;
    // proxy data on instance
    var keys = Object.keys(data);
    var i, key;
    i = keys.length;
    while (i--) {
      key = keys[i];
      // there are two scenarios where we can proxy a data key:
      // 1. it's not already defined as a prop
      // 2. it's provided via a instantiation option AND there are no
      //    template prop present
      if (!props || !hasOwn(props, key) || runtimeData && hasOwn(runtimeData, key) && props[key].raw === null) {
        this._proxy(key);
      } else if (process.env.NODE_ENV !== 'production') {
        warn('Data field "' + key + '" is already defined ' + 'as a prop. Use prop default value instead.', this);
      }
    }
    // observe data
    observe(data, this);
  };

  /**
   * Swap the instance's $data. Called in $data's setter.
   *
   * @param {Object} newData
   */

  Vue.prototype._setData = function (newData) {
    newData = newData || {};
    var oldData = this._data;
    this._data = newData;
    var keys, key, i;
    // unproxy keys not present in new data
    keys = Object.keys(oldData);
    i = keys.length;
    while (i--) {
      key = keys[i];
      if (!(key in newData)) {
        this._unproxy(key);
      }
    }
    // proxy keys not already proxied,
    // and trigger change for changed values
    keys = Object.keys(newData);
    i = keys.length;
    while (i--) {
      key = keys[i];
      if (!hasOwn(this, key)) {
        // new property
        this._proxy(key);
      }
    }
    oldData.__ob__.removeVm(this);
    observe(newData, this);
    this._digest();
  };

  /**
   * Proxy a property, so that
   * vm.prop === vm._data.prop
   *
   * @param {String} key
   */

  Vue.prototype._proxy = function (key) {
    if (!isReserved(key)) {
      // need to store ref to self here
      // because these getter/setters might
      // be called by child scopes via
      // prototype inheritance.
      var self = this;
      Object.defineProperty(self, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter() {
          return self._data[key];
        },
        set: function proxySetter(val) {
          self._data[key] = val;
        }
      });
    }
  };

  /**
   * Unproxy a property.
   *
   * @param {String} key
   */

  Vue.prototype._unproxy = function (key) {
    if (!isReserved(key)) {
      delete this[key];
    }
  };

  /**
   * Force update on every watcher in scope.
   */

  Vue.prototype._digest = function () {
    for (var i = 0, l = this._watchers.length; i < l; i++) {
      this._watchers[i].update(true); // shallow updates
    }
  };

  /**
   * Setup computed properties. They are essentially
   * special getter/setters
   */

  function noop() {}
  Vue.prototype._initComputed = function () {
    var computed = this.$options.computed;
    if (computed) {
      for (var key in computed) {
        var userDef = computed[key];
        var def = {
          enumerable: true,
          configurable: true
        };
        if (typeof userDef === 'function') {
          def.get = makeComputedGetter(userDef, this);
          def.set = noop;
        } else {
          def.get = userDef.get ? userDef.cache !== false ? makeComputedGetter(userDef.get, this) : bind(userDef.get, this) : noop;
          def.set = userDef.set ? bind(userDef.set, this) : noop;
        }
        Object.defineProperty(this, key, def);
      }
    }
  };

  function makeComputedGetter(getter, owner) {
    var watcher = new Watcher(owner, getter, null, {
      lazy: true
    });
    return function computedGetter() {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    };
  }

  /**
   * Setup instance methods. Methods must be bound to the
   * instance since they might be passed down as a prop to
   * child components.
   */

  Vue.prototype._initMethods = function () {
    var methods = this.$options.methods;
    if (methods) {
      for (var key in methods) {
        this[key] = bind(methods[key], this);
      }
    }
  };

  /**
   * Initialize meta information like $index, $key & $value.
   */

  Vue.prototype._initMeta = function () {
    var metas = this.$options._meta;
    if (metas) {
      for (var key in metas) {
        defineReactive(this, key, metas[key]);
      }
    }
  };
}

var eventRE = /^v-on:|^@/;

function eventsMixin (Vue) {
  /**
   * Setup the instance's option events & watchers.
   * If the value is a string, we pull it from the
   * instance's methods by name.
   */

  Vue.prototype._initEvents = function () {
    var options = this.$options;
    if (options._asComponent) {
      registerComponentEvents(this, options.el);
    }
    registerCallbacks(this, '$on', options.events);
    registerCallbacks(this, '$watch', options.watch);
  };

  /**
   * Register v-on events on a child component
   *
   * @param {Vue} vm
   * @param {Element} el
   */

  function registerComponentEvents(vm, el) {
    var attrs = el.attributes;
    var name, handler;
    for (var i = 0, l = attrs.length; i < l; i++) {
      name = attrs[i].name;
      if (eventRE.test(name)) {
        name = name.replace(eventRE, '');
        handler = (vm._scope || vm._context).$eval(attrs[i].value, true);
        if (typeof handler === 'function') {
          handler._fromParent = true;
          vm.$on(name.replace(eventRE), handler);
        } else if (process.env.NODE_ENV !== 'production') {
          warn('v-on:' + name + '="' + attrs[i].value + '" ' + 'expects a function value, got ' + handler, vm);
        }
      }
    }
  }

  /**
   * Register callbacks for option events and watchers.
   *
   * @param {Vue} vm
   * @param {String} action
   * @param {Object} hash
   */

  function registerCallbacks(vm, action, hash) {
    if (!hash) return;
    var handlers, key, i, j;
    for (key in hash) {
      handlers = hash[key];
      if (isArray(handlers)) {
        for (i = 0, j = handlers.length; i < j; i++) {
          register(vm, action, key, handlers[i]);
        }
      } else {
        register(vm, action, key, handlers);
      }
    }
  }

  /**
   * Helper to register an event/watch callback.
   *
   * @param {Vue} vm
   * @param {String} action
   * @param {String} key
   * @param {Function|String|Object} handler
   * @param {Object} [options]
   */

  function register(vm, action, key, handler, options) {
    var type = typeof handler;
    if (type === 'function') {
      vm[action](key, handler, options);
    } else if (type === 'string') {
      var methods = vm.$options.methods;
      var method = methods && methods[handler];
      if (method) {
        vm[action](key, method, options);
      } else {
        process.env.NODE_ENV !== 'production' && warn('Unknown method: "' + handler + '" when ' + 'registering callback for ' + action + ': "' + key + '".', vm);
      }
    } else if (handler && type === 'object') {
      register(vm, action, key, handler.handler, handler);
    }
  }

  /**
   * Setup recursive attached/detached calls
   */

  Vue.prototype._initDOMHooks = function () {
    this.$on('hook:attached', onAttached);
    this.$on('hook:detached', onDetached);
  };

  /**
   * Callback to recursively call attached hook on children
   */

  function onAttached() {
    if (!this._isAttached) {
      this._isAttached = true;
      this.$children.forEach(callAttach);
    }
  }

  /**
   * Iterator to call attached hook
   *
   * @param {Vue} child
   */

  function callAttach(child) {
    if (!child._isAttached && inDoc(child.$el)) {
      child._callHook('attached');
    }
  }

  /**
   * Callback to recursively call detached hook on children
   */

  function onDetached() {
    if (this._isAttached) {
      this._isAttached = false;
      this.$children.forEach(callDetach);
    }
  }

  /**
   * Iterator to call detached hook
   *
   * @param {Vue} child
   */

  function callDetach(child) {
    if (child._isAttached && !inDoc(child.$el)) {
      child._callHook('detached');
    }
  }

  /**
   * Trigger all handlers for a hook
   *
   * @param {String} hook
   */

  Vue.prototype._callHook = function (hook) {
    this.$emit('pre-hook:' + hook);
    var handlers = this.$options[hook];
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        handlers[i].call(this);
      }
    }
    this.$emit('hook:' + hook);
  };
}

function noop() {}

/**
 * A directive links a DOM element with a piece of data,
 * which is the result of evaluating an expression.
 * It registers a watcher with the expression and calls
 * the DOM update function when a change is triggered.
 *
 * @param {Object} descriptor
 *                 - {String} name
 *                 - {Object} def
 *                 - {String} expression
 *                 - {Array<Object>} [filters]
 *                 - {Object} [modifiers]
 *                 - {Boolean} literal
 *                 - {String} attr
 *                 - {String} arg
 *                 - {String} raw
 *                 - {String} [ref]
 *                 - {Array<Object>} [interp]
 *                 - {Boolean} [hasOneTime]
 * @param {Vue} vm
 * @param {Node} el
 * @param {Vue} [host] - transclusion host component
 * @param {Object} [scope] - v-for scope
 * @param {Fragment} [frag] - owner fragment
 * @constructor
 */
function Directive(descriptor, vm, el, host, scope, frag) {
  this.vm = vm;
  this.el = el;
  // copy descriptor properties
  this.descriptor = descriptor;
  this.name = descriptor.name;
  this.expression = descriptor.expression;
  this.arg = descriptor.arg;
  this.modifiers = descriptor.modifiers;
  this.filters = descriptor.filters;
  this.literal = this.modifiers && this.modifiers.literal;
  // private
  this._locked = false;
  this._bound = false;
  this._listeners = null;
  // link context
  this._host = host;
  this._scope = scope;
  this._frag = frag;
  // store directives on node in dev mode
  if (process.env.NODE_ENV !== 'production' && this.el) {
    this.el._vue_directives = this.el._vue_directives || [];
    this.el._vue_directives.push(this);
  }
}

/**
 * Initialize the directive, mixin definition properties,
 * setup the watcher, call definition bind() and update()
 * if present.
 */

Directive.prototype._bind = function () {
  var name = this.name;
  var descriptor = this.descriptor;

  // remove attribute
  if ((name !== 'cloak' || this.vm._isCompiled) && this.el && this.el.removeAttribute) {
    var attr = descriptor.attr || 'v-' + name;
    this.el.removeAttribute(attr);
  }

  // copy def properties
  var def = descriptor.def;
  if (typeof def === 'function') {
    this.update = def;
  } else {
    extend(this, def);
  }

  // setup directive params
  this._setupParams();

  // initial bind
  if (this.bind) {
    this.bind();
  }
  this._bound = true;

  if (this.literal) {
    this.update && this.update(descriptor.raw);
  } else if ((this.expression || this.modifiers) && (this.update || this.twoWay) && !this._checkStatement()) {
    // wrapped updater for context
    var dir = this;
    if (this.update) {
      this._update = function (val, oldVal) {
        if (!dir._locked) {
          dir.update(val, oldVal);
        }
      };
    } else {
      this._update = noop;
    }
    var preProcess = this._preProcess ? bind(this._preProcess, this) : null;
    var postProcess = this._postProcess ? bind(this._postProcess, this) : null;
    var watcher = this._watcher = new Watcher(this.vm, this.expression, this._update, // callback
    {
      filters: this.filters,
      twoWay: this.twoWay,
      deep: this.deep,
      preProcess: preProcess,
      postProcess: postProcess,
      scope: this._scope
    });
    // v-model with inital inline value need to sync back to
    // model instead of update to DOM on init. They would
    // set the afterBind hook to indicate that.
    if (this.afterBind) {
      this.afterBind();
    } else if (this.update) {
      this.update(watcher.value);
    }
  }
};

/**
 * Setup all param attributes, e.g. track-by,
 * transition-mode, etc...
 */

Directive.prototype._setupParams = function () {
  if (!this.params) {
    return;
  }
  var params = this.params;
  // swap the params array with a fresh object.
  this.params = Object.create(null);
  var i = params.length;
  var key, val, mappedKey;
  while (i--) {
    key = hyphenate(params[i]);
    mappedKey = camelize(key);
    val = getBindAttr(this.el, key);
    if (val != null) {
      // dynamic
      this._setupParamWatcher(mappedKey, val);
    } else {
      // static
      val = getAttr(this.el, key);
      if (val != null) {
        this.params[mappedKey] = val === '' ? true : val;
      }
    }
  }
};

/**
 * Setup a watcher for a dynamic param.
 *
 * @param {String} key
 * @param {String} expression
 */

Directive.prototype._setupParamWatcher = function (key, expression) {
  var self = this;
  var called = false;
  var unwatch = (this._scope || this.vm).$watch(expression, function (val, oldVal) {
    self.params[key] = val;
    // since we are in immediate mode,
    // only call the param change callbacks if this is not the first update.
    if (called) {
      var cb = self.paramWatchers && self.paramWatchers[key];
      if (cb) {
        cb.call(self, val, oldVal);
      }
    } else {
      called = true;
    }
  }, {
    immediate: true,
    user: false
  });(this._paramUnwatchFns || (this._paramUnwatchFns = [])).push(unwatch);
};

/**
 * Check if the directive is a function caller
 * and if the expression is a callable one. If both true,
 * we wrap up the expression and use it as the event
 * handler.
 *
 * e.g. on-click="a++"
 *
 * @return {Boolean}
 */

Directive.prototype._checkStatement = function () {
  var expression = this.expression;
  if (expression && this.acceptStatement && !isSimplePath(expression)) {
    var fn = parseExpression(expression).get;
    var scope = this._scope || this.vm;
    var handler = function handler(e) {
      scope.$event = e;
      fn.call(scope, scope);
      scope.$event = null;
    };
    if (this.filters) {
      handler = scope._applyFilters(handler, null, this.filters);
    }
    this.update(handler);
    return true;
  }
};

/**
 * Set the corresponding value with the setter.
 * This should only be used in two-way directives
 * e.g. v-model.
 *
 * @param {*} value
 * @public
 */

Directive.prototype.set = function (value) {
  /* istanbul ignore else */
  if (this.twoWay) {
    this._withLock(function () {
      this._watcher.set(value);
    });
  } else if (process.env.NODE_ENV !== 'production') {
    warn('Directive.set() can only be used inside twoWay' + 'directives.');
  }
};

/**
 * Execute a function while preventing that function from
 * triggering updates on this directive instance.
 *
 * @param {Function} fn
 */

Directive.prototype._withLock = function (fn) {
  var self = this;
  self._locked = true;
  fn.call(self);
  nextTick(function () {
    self._locked = false;
  });
};

/**
 * Convenience method that attaches a DOM event listener
 * to the directive element and autometically tears it down
 * during unbind.
 *
 * @param {String} event
 * @param {Function} handler
 * @param {Boolean} [useCapture]
 */

Directive.prototype.on = function (event, handler, useCapture) {
  on(this.el, event, handler, useCapture);(this._listeners || (this._listeners = [])).push([event, handler]);
};

/**
 * Teardown the watcher and call unbind.
 */

Directive.prototype._teardown = function () {
  if (this._bound) {
    this._bound = false;
    if (this.unbind) {
      this.unbind();
    }
    if (this._watcher) {
      this._watcher.teardown();
    }
    var listeners = this._listeners;
    var i;
    if (listeners) {
      i = listeners.length;
      while (i--) {
        off(this.el, listeners[i][0], listeners[i][1]);
      }
    }
    var unwatchFns = this._paramUnwatchFns;
    if (unwatchFns) {
      i = unwatchFns.length;
      while (i--) {
        unwatchFns[i]();
      }
    }
    if (process.env.NODE_ENV !== 'production' && this.el) {
      this.el._vue_directives.$remove(this);
    }
    this.vm = this.el = this._watcher = this._listeners = null;
  }
};

function lifecycleMixin (Vue) {
  /**
   * Update v-ref for component.
   *
   * @param {Boolean} remove
   */

  Vue.prototype._updateRef = function (remove) {
    var ref = this.$options._ref;
    if (ref) {
      var refs = (this._scope || this._context).$refs;
      if (remove) {
        if (refs[ref] === this) {
          refs[ref] = null;
        }
      } else {
        refs[ref] = this;
      }
    }
  };

  /**
   * Transclude, compile and link element.
   *
   * If a pre-compiled linker is available, that means the
   * passed in element will be pre-transcluded and compiled
   * as well - all we need to do is to call the linker.
   *
   * Otherwise we need to call transclude/compile/link here.
   *
   * @param {Element} el
   */

  Vue.prototype._compile = function (el) {
    var options = this.$options;

    // transclude and init element
    // transclude can potentially replace original
    // so we need to keep reference; this step also injects
    // the template and caches the original attributes
    // on the container node and replacer node.
    var original = el;
    el = transclude(el, options);
    this._initElement(el);

    // handle v-pre on root node (#2026)
    if (el.nodeType === 1 && getAttr(el, 'v-pre') !== null) {
      return;
    }

    // root is always compiled per-instance, because
    // container attrs and props can be different every time.
    var contextOptions = this._context && this._context.$options;
    var rootLinker = compileRoot(el, options, contextOptions);

    // resolve slot distribution
    resolveSlots(this, options._content);

    // compile and link the rest
    var contentLinkFn;
    var ctor = this.constructor;
    // component compilation can be cached
    // as long as it's not using inline-template
    if (options._linkerCachable) {
      contentLinkFn = ctor.linker;
      if (!contentLinkFn) {
        contentLinkFn = ctor.linker = compile(el, options);
      }
    }

    // link phase
    // make sure to link root with prop scope!
    var rootUnlinkFn = rootLinker(this, el, this._scope);
    var contentUnlinkFn = contentLinkFn ? contentLinkFn(this, el) : compile(el, options)(this, el);

    // register composite unlink function
    // to be called during instance destruction
    this._unlinkFn = function () {
      rootUnlinkFn();
      // passing destroying: true to avoid searching and
      // splicing the directives
      contentUnlinkFn(true);
    };

    // finally replace original
    if (options.replace) {
      replace(original, el);
    }

    this._isCompiled = true;
    this._callHook('compiled');
  };

  /**
   * Initialize instance element. Called in the public
   * $mount() method.
   *
   * @param {Element} el
   */

  Vue.prototype._initElement = function (el) {
    if (isFragment(el)) {
      this._isFragment = true;
      this.$el = this._fragmentStart = el.firstChild;
      this._fragmentEnd = el.lastChild;
      // set persisted text anchors to empty
      if (this._fragmentStart.nodeType === 3) {
        this._fragmentStart.data = this._fragmentEnd.data = '';
      }
      this._fragment = el;
    } else {
      this.$el = el;
    }
    this.$el.__vue__ = this;
    this._callHook('beforeCompile');
  };

  /**
   * Create and bind a directive to an element.
   *
   * @param {Object} descriptor - parsed directive descriptor
   * @param {Node} node   - target node
   * @param {Vue} [host] - transclusion host component
   * @param {Object} [scope] - v-for scope
   * @param {Fragment} [frag] - owner fragment
   */

  Vue.prototype._bindDir = function (descriptor, node, host, scope, frag) {
    this._directives.push(new Directive(descriptor, this, node, host, scope, frag));
  };

  /**
   * Teardown an instance, unobserves the data, unbind all the
   * directives, turn off all the event listeners, etc.
   *
   * @param {Boolean} remove - whether to remove the DOM node.
   * @param {Boolean} deferCleanup - if true, defer cleanup to
   *                                 be called later
   */

  Vue.prototype._destroy = function (remove, deferCleanup) {
    if (this._isBeingDestroyed) {
      if (!deferCleanup) {
        this._cleanup();
      }
      return;
    }

    var destroyReady;
    var pendingRemoval;

    var self = this;
    // Cleanup should be called either synchronously or asynchronoysly as
    // callback of this.$remove(), or if remove and deferCleanup are false.
    // In any case it should be called after all other removing, unbinding and
    // turning of is done
    var cleanupIfPossible = function cleanupIfPossible() {
      if (destroyReady && !pendingRemoval && !deferCleanup) {
        self._cleanup();
      }
    };

    // remove DOM element
    if (remove && this.$el) {
      pendingRemoval = true;
      this.$remove(function () {
        pendingRemoval = false;
        cleanupIfPossible();
      });
    }

    this._callHook('beforeDestroy');
    this._isBeingDestroyed = true;
    var i;
    // remove self from parent. only necessary
    // if parent is not being destroyed as well.
    var parent = this.$parent;
    if (parent && !parent._isBeingDestroyed) {
      parent.$children.$remove(this);
      // unregister ref (remove: true)
      this._updateRef(true);
    }
    // destroy all children.
    i = this.$children.length;
    while (i--) {
      this.$children[i].$destroy();
    }
    // teardown props
    if (this._propsUnlinkFn) {
      this._propsUnlinkFn();
    }
    // teardown all directives. this also tearsdown all
    // directive-owned watchers.
    if (this._unlinkFn) {
      this._unlinkFn();
    }
    i = this._watchers.length;
    while (i--) {
      this._watchers[i].teardown();
    }
    // remove reference to self on $el
    if (this.$el) {
      this.$el.__vue__ = null;
    }

    destroyReady = true;
    cleanupIfPossible();
  };

  /**
   * Clean up to ensure garbage collection.
   * This is called after the leave transition if there
   * is any.
   */

  Vue.prototype._cleanup = function () {
    if (this._isDestroyed) {
      return;
    }
    // remove self from owner fragment
    // do it in cleanup so that we can call $destroy with
    // defer right when a fragment is about to be removed.
    if (this._frag) {
      this._frag.children.$remove(this);
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (this._data.__ob__) {
      this._data.__ob__.removeVm(this);
    }
    // Clean up references to private properties and other
    // instances. preserve reference to _data so that proxy
    // accessors still work. The only potential side effect
    // here is that mutating the instance after it's destroyed
    // may affect the state of other components that are still
    // observing the same object, but that seems to be a
    // reasonable responsibility for the user rather than
    // always throwing an error on them.
    this.$el = this.$parent = this.$root = this.$children = this._watchers = this._context = this._scope = this._directives = null;
    // call the last hook...
    this._isDestroyed = true;
    this._callHook('destroyed');
    // turn off all instance listeners.
    this.$off();
  };
}

function miscMixin (Vue) {
  /**
   * Apply a list of filter (descriptors) to a value.
   * Using plain for loops here because this will be called in
   * the getter of any watcher with filters so it is very
   * performance sensitive.
   *
   * @param {*} value
   * @param {*} [oldValue]
   * @param {Array} filters
   * @param {Boolean} write
   * @return {*}
   */

  Vue.prototype._applyFilters = function (value, oldValue, filters, write) {
    var filter, fn, args, arg, offset, i, l, j, k;
    for (i = 0, l = filters.length; i < l; i++) {
      filter = filters[write ? l - i - 1 : i];
      fn = resolveAsset(this.$options, 'filters', filter.name, true);
      if (!fn) continue;
      fn = write ? fn.write : fn.read || fn;
      if (typeof fn !== 'function') continue;
      args = write ? [value, oldValue] : [value];
      offset = write ? 2 : 1;
      if (filter.args) {
        for (j = 0, k = filter.args.length; j < k; j++) {
          arg = filter.args[j];
          args[j + offset] = arg.dynamic ? this.$get(arg.value) : arg.value;
        }
      }
      value = fn.apply(this, args);
    }
    return value;
  };

  /**
   * Resolve a component, depending on whether the component
   * is defined normally or using an async factory function.
   * Resolves synchronously if already resolved, otherwise
   * resolves asynchronously and caches the resolved
   * constructor on the factory.
   *
   * @param {String|Function} value
   * @param {Function} cb
   */

  Vue.prototype._resolveComponent = function (value, cb) {
    var factory;
    if (typeof value === 'function') {
      factory = value;
    } else {
      factory = resolveAsset(this.$options, 'components', value, true);
    }
    if (!factory) {
      return;
    }
    // async component factory
    if (!factory.options) {
      if (factory.resolved) {
        // cached
        cb(factory.resolved);
      } else if (factory.requested) {
        // pool callbacks
        factory.pendingCallbacks.push(cb);
      } else {
        factory.requested = true;
        var cbs = factory.pendingCallbacks = [cb];
        factory.call(this, function resolve(res) {
          if (isPlainObject(res)) {
            res = Vue.extend(res);
          }
          // cache resolved
          factory.resolved = res;
          // invoke callbacks
          for (var i = 0, l = cbs.length; i < l; i++) {
            cbs[i](res);
          }
        }, function reject(reason) {
          process.env.NODE_ENV !== 'production' && warn('Failed to resolve async component' + (typeof value === 'string' ? ': ' + value : '') + '. ' + (reason ? '\nReason: ' + reason : ''));
        });
      }
    } else {
      // normal component
      cb(factory);
    }
  };
}

var filterRE$1 = /[^|]\|[^|]/;

function dataAPI (Vue) {
  /**
   * Get the value from an expression on this vm.
   *
   * @param {String} exp
   * @param {Boolean} [asStatement]
   * @return {*}
   */

  Vue.prototype.$get = function (exp, asStatement) {
    var res = parseExpression(exp);
    if (res) {
      if (asStatement && !isSimplePath(exp)) {
        var self = this;
        return function statementHandler() {
          self.$arguments = toArray(arguments);
          var result = res.get.call(self, self);
          self.$arguments = null;
          return result;
        };
      } else {
        try {
          return res.get.call(this, this);
        } catch (e) {}
      }
    }
  };

  /**
   * Set the value from an expression on this vm.
   * The expression must be a valid left-hand
   * expression in an assignment.
   *
   * @param {String} exp
   * @param {*} val
   */

  Vue.prototype.$set = function (exp, val) {
    var res = parseExpression(exp, true);
    if (res && res.set) {
      res.set.call(this, this, val);
    }
  };

  /**
   * Delete a property on the VM
   *
   * @param {String} key
   */

  Vue.prototype.$delete = function (key) {
    del(this._data, key);
  };

  /**
   * Watch an expression, trigger callback when its
   * value changes.
   *
   * @param {String|Function} expOrFn
   * @param {Function} cb
   * @param {Object} [options]
   *                 - {Boolean} deep
   *                 - {Boolean} immediate
   * @return {Function} - unwatchFn
   */

  Vue.prototype.$watch = function (expOrFn, cb, options) {
    var vm = this;
    var parsed;
    if (typeof expOrFn === 'string') {
      parsed = parseDirective(expOrFn);
      expOrFn = parsed.expression;
    }
    var watcher = new Watcher(vm, expOrFn, cb, {
      deep: options && options.deep,
      sync: options && options.sync,
      filters: parsed && parsed.filters,
      user: !options || options.user !== false
    });
    if (options && options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn() {
      watcher.teardown();
    };
  };

  /**
   * Evaluate a text directive, including filters.
   *
   * @param {String} text
   * @param {Boolean} [asStatement]
   * @return {String}
   */

  Vue.prototype.$eval = function (text, asStatement) {
    // check for filters.
    if (filterRE$1.test(text)) {
      var dir = parseDirective(text);
      // the filter regex check might give false positive
      // for pipes inside strings, so it's possible that
      // we don't get any filters here
      var val = this.$get(dir.expression, asStatement);
      return dir.filters ? this._applyFilters(val, null, dir.filters) : val;
    } else {
      // no filter
      return this.$get(text, asStatement);
    }
  };

  /**
   * Interpolate a piece of template text.
   *
   * @param {String} text
   * @return {String}
   */

  Vue.prototype.$interpolate = function (text) {
    var tokens = parseText(text);
    var vm = this;
    if (tokens) {
      if (tokens.length === 1) {
        return vm.$eval(tokens[0].value) + '';
      } else {
        return tokens.map(function (token) {
          return token.tag ? vm.$eval(token.value) : token.value;
        }).join('');
      }
    } else {
      return text;
    }
  };

  /**
   * Log instance data as a plain JS object
   * so that it is easier to inspect in console.
   * This method assumes console is available.
   *
   * @param {String} [path]
   */

  Vue.prototype.$log = function (path) {
    var data = path ? getPath(this._data, path) : this._data;
    if (data) {
      data = clean(data);
    }
    // include computed fields
    if (!path) {
      var key;
      for (key in this.$options.computed) {
        data[key] = clean(this[key]);
      }
      if (this._props) {
        for (key in this._props) {
          data[key] = clean(this[key]);
        }
      }
    }
    console.log(data);
  };

  /**
   * "clean" a getter/setter converted object into a plain
   * object copy.
   *
   * @param {Object} - obj
   * @return {Object}
   */

  function clean(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}

function domAPI (Vue) {
  /**
   * Convenience on-instance nextTick. The callback is
   * auto-bound to the instance, and this avoids component
   * modules having to rely on the global Vue.
   *
   * @param {Function} fn
   */

  Vue.prototype.$nextTick = function (fn) {
    nextTick(fn, this);
  };

  /**
   * Append instance to target
   *
   * @param {Node} target
   * @param {Function} [cb]
   * @param {Boolean} [withTransition] - defaults to true
   */

  Vue.prototype.$appendTo = function (target, cb, withTransition) {
    return insert(this, target, cb, withTransition, append, appendWithTransition);
  };

  /**
   * Prepend instance to target
   *
   * @param {Node} target
   * @param {Function} [cb]
   * @param {Boolean} [withTransition] - defaults to true
   */

  Vue.prototype.$prependTo = function (target, cb, withTransition) {
    target = query(target);
    if (target.hasChildNodes()) {
      this.$before(target.firstChild, cb, withTransition);
    } else {
      this.$appendTo(target, cb, withTransition);
    }
    return this;
  };

  /**
   * Insert instance before target
   *
   * @param {Node} target
   * @param {Function} [cb]
   * @param {Boolean} [withTransition] - defaults to true
   */

  Vue.prototype.$before = function (target, cb, withTransition) {
    return insert(this, target, cb, withTransition, beforeWithCb, beforeWithTransition);
  };

  /**
   * Insert instance after target
   *
   * @param {Node} target
   * @param {Function} [cb]
   * @param {Boolean} [withTransition] - defaults to true
   */

  Vue.prototype.$after = function (target, cb, withTransition) {
    target = query(target);
    if (target.nextSibling) {
      this.$before(target.nextSibling, cb, withTransition);
    } else {
      this.$appendTo(target.parentNode, cb, withTransition);
    }
    return this;
  };

  /**
   * Remove instance from DOM
   *
   * @param {Function} [cb]
   * @param {Boolean} [withTransition] - defaults to true
   */

  Vue.prototype.$remove = function (cb, withTransition) {
    if (!this.$el.parentNode) {
      return cb && cb();
    }
    var inDocument = this._isAttached && inDoc(this.$el);
    // if we are not in document, no need to check
    // for transitions
    if (!inDocument) withTransition = false;
    var self = this;
    var realCb = function realCb() {
      if (inDocument) self._callHook('detached');
      if (cb) cb();
    };
    if (this._isFragment) {
      removeNodeRange(this._fragmentStart, this._fragmentEnd, this, this._fragment, realCb);
    } else {
      var op = withTransition === false ? removeWithCb : removeWithTransition;
      op(this.$el, this, realCb);
    }
    return this;
  };

  /**
   * Shared DOM insertion function.
   *
   * @param {Vue} vm
   * @param {Element} target
   * @param {Function} [cb]
   * @param {Boolean} [withTransition]
   * @param {Function} op1 - op for non-transition insert
   * @param {Function} op2 - op for transition insert
   * @return vm
   */

  function insert(vm, target, cb, withTransition, op1, op2) {
    target = query(target);
    var targetIsDetached = !inDoc(target);
    var op = withTransition === false || targetIsDetached ? op1 : op2;
    var shouldCallHook = !targetIsDetached && !vm._isAttached && !inDoc(vm.$el);
    if (vm._isFragment) {
      mapNodeRange(vm._fragmentStart, vm._fragmentEnd, function (node) {
        op(node, target, vm);
      });
      cb && cb();
    } else {
      op(vm.$el, target, vm, cb);
    }
    if (shouldCallHook) {
      vm._callHook('attached');
    }
    return vm;
  }

  /**
   * Check for selectors
   *
   * @param {String|Element} el
   */

  function query(el) {
    return typeof el === 'string' ? document.querySelector(el) : el;
  }

  /**
   * Append operation that takes a callback.
   *
   * @param {Node} el
   * @param {Node} target
   * @param {Vue} vm - unused
   * @param {Function} [cb]
   */

  function append(el, target, vm, cb) {
    target.appendChild(el);
    if (cb) cb();
  }

  /**
   * InsertBefore operation that takes a callback.
   *
   * @param {Node} el
   * @param {Node} target
   * @param {Vue} vm - unused
   * @param {Function} [cb]
   */

  function beforeWithCb(el, target, vm, cb) {
    before(el, target);
    if (cb) cb();
  }

  /**
   * Remove operation that takes a callback.
   *
   * @param {Node} el
   * @param {Vue} vm - unused
   * @param {Function} [cb]
   */

  function removeWithCb(el, vm, cb) {
    remove(el);
    if (cb) cb();
  }
}

function eventsAPI (Vue) {
  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   */

  Vue.prototype.$on = function (event, fn) {
    (this._events[event] || (this._events[event] = [])).push(fn);
    modifyListenerCount(this, event, 1);
    return this;
  };

  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   */

  Vue.prototype.$once = function (event, fn) {
    var self = this;
    function on() {
      self.$off(event, on);
      fn.apply(this, arguments);
    }
    on.fn = fn;
    this.$on(event, on);
    return this;
  };

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   */

  Vue.prototype.$off = function (event, fn) {
    var cbs;
    // all
    if (!arguments.length) {
      if (this.$parent) {
        for (event in this._events) {
          cbs = this._events[event];
          if (cbs) {
            modifyListenerCount(this, event, -cbs.length);
          }
        }
      }
      this._events = {};
      return this;
    }
    // specific event
    cbs = this._events[event];
    if (!cbs) {
      return this;
    }
    if (arguments.length === 1) {
      modifyListenerCount(this, event, -cbs.length);
      this._events[event] = null;
      return this;
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        modifyListenerCount(this, event, -1);
        cbs.splice(i, 1);
        break;
      }
    }
    return this;
  };

  /**
   * Trigger an event on self.
   *
   * @param {String|Object} event
   * @return {Boolean} shouldPropagate
   */

  Vue.prototype.$emit = function (event) {
    var isSource = typeof event === 'string';
    event = isSource ? event : event.name;
    var cbs = this._events[event];
    var shouldPropagate = isSource || !cbs;
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      // this is a somewhat hacky solution to the question raised
      // in #2102: for an inline component listener like <comp @test="doThis">,
      // the propagation handling is somewhat broken. Therefore we
      // need to treat these inline callbacks differently.
      var hasParentCbs = isSource && cbs.some(function (cb) {
        return cb._fromParent;
      });
      if (hasParentCbs) {
        shouldPropagate = false;
      }
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        var cb = cbs[i];
        var res = cb.apply(this, args);
        if (res === true && (!hasParentCbs || cb._fromParent)) {
          shouldPropagate = true;
        }
      }
    }
    return shouldPropagate;
  };

  /**
   * Recursively broadcast an event to all children instances.
   *
   * @param {String|Object} event
   * @param {...*} additional arguments
   */

  Vue.prototype.$broadcast = function (event) {
    var isSource = typeof event === 'string';
    event = isSource ? event : event.name;
    // if no child has registered for this event,
    // then there's no need to broadcast.
    if (!this._eventsCount[event]) return;
    var children = this.$children;
    var args = toArray(arguments);
    if (isSource) {
      // use object event to indicate non-source emit
      // on children
      args[0] = { name: event, source: this };
    }
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var shouldPropagate = child.$emit.apply(child, args);
      if (shouldPropagate) {
        child.$broadcast.apply(child, args);
      }
    }
    return this;
  };

  /**
   * Recursively propagate an event up the parent chain.
   *
   * @param {String} event
   * @param {...*} additional arguments
   */

  Vue.prototype.$dispatch = function (event) {
    var shouldPropagate = this.$emit.apply(this, arguments);
    if (!shouldPropagate) return;
    var parent = this.$parent;
    var args = toArray(arguments);
    // use object event to indicate non-source emit
    // on parents
    args[0] = { name: event, source: this };
    while (parent) {
      shouldPropagate = parent.$emit.apply(parent, args);
      parent = shouldPropagate ? parent.$parent : null;
    }
    return this;
  };

  /**
   * Modify the listener counts on all parents.
   * This bookkeeping allows $broadcast to return early when
   * no child has listened to a certain event.
   *
   * @param {Vue} vm
   * @param {String} event
   * @param {Number} count
   */

  var hookRE = /^hook:/;
  function modifyListenerCount(vm, event, count) {
    var parent = vm.$parent;
    // hooks do not get broadcasted so no need
    // to do bookkeeping for them
    if (!parent || !count || hookRE.test(event)) return;
    while (parent) {
      parent._eventsCount[event] = (parent._eventsCount[event] || 0) + count;
      parent = parent.$parent;
    }
  }
}

function lifecycleAPI (Vue) {
  /**
   * Set instance target element and kick off the compilation
   * process. The passed in `el` can be a selector string, an
   * existing Element, or a DocumentFragment (for block
   * instances).
   *
   * @param {Element|DocumentFragment|string} el
   * @public
   */

  Vue.prototype.$mount = function (el) {
    if (this._isCompiled) {
      process.env.NODE_ENV !== 'production' && warn('$mount() should be called only once.', this);
      return;
    }
    el = query(el);
    if (!el) {
      el = document.createElement('div');
    }
    this._compile(el);
    this._initDOMHooks();
    if (inDoc(this.$el)) {
      this._callHook('attached');
      ready.call(this);
    } else {
      this.$once('hook:attached', ready);
    }
    return this;
  };

  /**
   * Mark an instance as ready.
   */

  function ready() {
    this._isAttached = true;
    this._isReady = true;
    this._callHook('ready');
  }

  /**
   * Teardown the instance, simply delegate to the internal
   * _destroy.
   *
   * @param {Boolean} remove
   * @param {Boolean} deferCleanup
   */

  Vue.prototype.$destroy = function (remove, deferCleanup) {
    this._destroy(remove, deferCleanup);
  };

  /**
   * Partially compile a piece of DOM and return a
   * decompile function.
   *
   * @param {Element|DocumentFragment} el
   * @param {Vue} [host]
   * @param {Object} [scope]
   * @param {Fragment} [frag]
   * @return {Function}
   */

  Vue.prototype.$compile = function (el, host, scope, frag) {
    return compile(el, this.$options, true)(this, el, host, scope, frag);
  };
}

/**
 * The exposed Vue constructor.
 *
 * API conventions:
 * - public API methods/properties are prefixed with `$`
 * - internal methods/properties are prefixed with `_`
 * - non-prefixed properties are assumed to be proxied user
 *   data.
 *
 * @constructor
 * @param {Object} [options]
 * @public
 */

function Vue(options) {
  this._init(options);
}

// install internals
initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
miscMixin(Vue);

// install instance APIs
dataAPI(Vue);
domAPI(Vue);
eventsAPI(Vue);
lifecycleAPI(Vue);

var slot = {

  priority: SLOT,
  params: ['name'],

  bind: function bind() {
    // this was resolved during component transclusion
    var name = this.params.name || 'default';
    var content = this.vm._slotContents && this.vm._slotContents[name];
    if (!content || !content.hasChildNodes()) {
      this.fallback();
    } else {
      this.compile(content.cloneNode(true), this.vm._context, this.vm);
    }
  },

  compile: function compile(content, context, host) {
    if (content && context) {
      if (this.el.hasChildNodes() && content.childNodes.length === 1 && content.childNodes[0].nodeType === 1 && content.childNodes[0].hasAttribute('v-if')) {
        // if the inserted slot has v-if
        // inject fallback content as the v-else
        var elseBlock = document.createElement('template');
        elseBlock.setAttribute('v-else', '');
        elseBlock.innerHTML = this.el.innerHTML;
        // the else block should be compiled in child scope
        elseBlock._context = this.vm;
        content.appendChild(elseBlock);
      }
      var scope = host ? host._scope : this._scope;
      this.unlink = context.$compile(content, host, scope, this._frag);
    }
    if (content) {
      replace(this.el, content);
    } else {
      remove(this.el);
    }
  },

  fallback: function fallback() {
    this.compile(extractContent(this.el, true), this.vm);
  },

  unbind: function unbind() {
    if (this.unlink) {
      this.unlink();
    }
  }
};

var partial = {

  priority: PARTIAL,

  params: ['name'],

  // watch changes to name for dynamic partials
  paramWatchers: {
    name: function name(value) {
      vIf.remove.call(this);
      if (value) {
        this.insert(value);
      }
    }
  },

  bind: function bind() {
    this.anchor = createAnchor('v-partial');
    replace(this.el, this.anchor);
    this.insert(this.params.name);
  },

  insert: function insert(id) {
    var partial = resolveAsset(this.vm.$options, 'partials', id, true);
    if (partial) {
      this.factory = new FragmentFactory(this.vm, partial);
      vIf.insert.call(this);
    }
  },

  unbind: function unbind() {
    if (this.frag) {
      this.frag.destroy();
    }
  }
};

var elementDirectives = {
  slot: slot,
  partial: partial
};

var convertArray = vFor._postProcess;

/**
 * Limit filter for arrays
 *
 * @param {Number} n
 * @param {Number} offset (Decimal expected)
 */

function limitBy(arr, n, offset) {
  offset = offset ? parseInt(offset, 10) : 0;
  n = toNumber(n);
  return typeof n === 'number' ? arr.slice(offset, offset + n) : arr;
}

/**
 * Filter filter for arrays
 *
 * @param {String} search
 * @param {String} [delimiter]
 * @param {String} ...dataKeys
 */

function filterBy(arr, search, delimiter) {
  arr = convertArray(arr);
  if (search == null) {
    return arr;
  }
  if (typeof search === 'function') {
    return arr.filter(search);
  }
  // cast to lowercase string
  search = ('' + search).toLowerCase();
  // allow optional `in` delimiter
  // because why not
  var n = delimiter === 'in' ? 3 : 2;
  // extract and flatten keys
  var keys = Array.prototype.concat.apply([], toArray(arguments, n));
  var res = [];
  var item, key, val, j;
  for (var i = 0, l = arr.length; i < l; i++) {
    item = arr[i];
    val = item && item.$value || item;
    j = keys.length;
    if (j) {
      while (j--) {
        key = keys[j];
        if (key === '$key' && contains(item.$key, search) || contains(getPath(val, key), search)) {
          res.push(item);
          break;
        }
      }
    } else if (contains(item, search)) {
      res.push(item);
    }
  }
  return res;
}

/**
 * Filter filter for arrays
 *
 * @param {String|Array<String>|Function} ...sortKeys
 * @param {Number} [order]
 */

function orderBy(arr) {
  var comparator = null;
  var sortKeys = undefined;
  arr = convertArray(arr);

  // determine order (last argument)
  var args = toArray(arguments, 1);
  var order = args[args.length - 1];
  if (typeof order === 'number') {
    order = order < 0 ? -1 : 1;
    args = args.length > 1 ? args.slice(0, -1) : args;
  } else {
    order = 1;
  }

  // determine sortKeys & comparator
  var firstArg = args[0];
  if (!firstArg) {
    return arr;
  } else if (typeof firstArg === 'function') {
    // custom comparator
    comparator = function (a, b) {
      return firstArg(a, b) * order;
    };
  } else {
    // string keys. flatten first
    sortKeys = Array.prototype.concat.apply([], args);
    comparator = function (a, b, i) {
      i = i || 0;
      return i >= sortKeys.length - 1 ? baseCompare(a, b, i) : baseCompare(a, b, i) || comparator(a, b, i + 1);
    };
  }

  function baseCompare(a, b, sortKeyIndex) {
    var sortKey = sortKeys[sortKeyIndex];
    if (sortKey) {
      if (sortKey !== '$key') {
        if (isObject(a) && '$value' in a) a = a.$value;
        if (isObject(b) && '$value' in b) b = b.$value;
      }
      a = isObject(a) ? getPath(a, sortKey) : a;
      b = isObject(b) ? getPath(b, sortKey) : b;
    }
    return a === b ? 0 : a > b ? order : -order;
  }

  // sort on a copy to avoid mutating original array
  return arr.slice().sort(comparator);
}

/**
 * String contain helper
 *
 * @param {*} val
 * @param {String} search
 */

function contains(val, search) {
  var i;
  if (isPlainObject(val)) {
    var keys = Object.keys(val);
    i = keys.length;
    while (i--) {
      if (contains(val[keys[i]], search)) {
        return true;
      }
    }
  } else if (isArray(val)) {
    i = val.length;
    while (i--) {
      if (contains(val[i], search)) {
        return true;
      }
    }
  } else if (val != null) {
    return val.toString().toLowerCase().indexOf(search) > -1;
  }
}

var digitsRE = /(\d{3})(?=\d)/g;

// asset collections must be a plain object.
var filters = {

  orderBy: orderBy,
  filterBy: filterBy,
  limitBy: limitBy,

  /**
   * Stringify value.
   *
   * @param {Number} indent
   */

  json: {
    read: function read(value, indent) {
      return typeof value === 'string' ? value : JSON.stringify(value, null, Number(indent) || 2);
    },
    write: function write(value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
  },

  /**
   * 'abc' => 'Abc'
   */

  capitalize: function capitalize(value) {
    if (!value && value !== 0) return '';
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
  },

  /**
   * 'abc' => 'ABC'
   */

  uppercase: function uppercase(value) {
    return value || value === 0 ? value.toString().toUpperCase() : '';
  },

  /**
   * 'AbC' => 'abc'
   */

  lowercase: function lowercase(value) {
    return value || value === 0 ? value.toString().toLowerCase() : '';
  },

  /**
   * 12345 => $12,345.00
   *
   * @param {String} sign
   */

  currency: function currency(value, _currency) {
    value = parseFloat(value);
    if (!isFinite(value) || !value && value !== 0) return '';
    _currency = _currency != null ? _currency : '$';
    var stringified = Math.abs(value).toFixed(2);
    var _int = stringified.slice(0, -3);
    var i = _int.length % 3;
    var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
    var _float = stringified.slice(-3);
    var sign = value < 0 ? '-' : '';
    return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
  },

  /**
   * 'item' => 'items'
   *
   * @params
   *  an array of strings corresponding to
   *  the single, double, triple ... forms of the word to
   *  be pluralized. When the number to be pluralized
   *  exceeds the length of the args, it will use the last
   *  entry in the array.
   *
   *  e.g. ['single', 'double', 'triple', 'multiple']
   */

  pluralize: function pluralize(value) {
    var args = toArray(arguments, 1);
    return args.length > 1 ? args[value % 10 - 1] || args[args.length - 1] : args[0] + (value === 1 ? '' : 's');
  },

  /**
   * Debounce a handler function.
   *
   * @param {Function} handler
   * @param {Number} delay = 300
   * @return {Function}
   */

  debounce: function debounce(handler, delay) {
    if (!handler) return;
    if (!delay) {
      delay = 300;
    }
    return _debounce(handler, delay);
  }
};

function installGlobalAPI (Vue) {
  /**
   * Vue and every constructor that extends Vue has an
   * associated options object, which can be accessed during
   * compilation steps as `this.constructor.options`.
   *
   * These can be seen as the default options of every
   * Vue instance.
   */

  Vue.options = {
    directives: directives,
    elementDirectives: elementDirectives,
    filters: filters,
    transitions: {},
    components: {},
    partials: {},
    replace: true
  };

  /**
   * Expose useful internals
   */

  Vue.util = util;
  Vue.config = config;
  Vue.set = set;
  Vue['delete'] = del;
  Vue.nextTick = nextTick;

  /**
   * The following are exposed for advanced usage / plugins
   */

  Vue.compiler = compiler;
  Vue.FragmentFactory = FragmentFactory;
  Vue.internalDirectives = internalDirectives;
  Vue.parsers = {
    path: path,
    text: text,
    template: template,
    directive: directive,
    expression: expression
  };

  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */

  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   *
   * @param {Object} extendOptions
   */

  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var isFirstExtend = Super.cid === 0;
    if (isFirstExtend && extendOptions._Ctor) {
      return extendOptions._Ctor;
    }
    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production') {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characaters and the hyphen.');
        name = null;
      }
    }
    var Sub = createClass(name || 'VueComponent');
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(Super.options, extendOptions);
    Sub['super'] = Super;
    // allow further extension
    Sub.extend = Super.extend;
    // create asset registers, so extended classes
    // can have their private assets too.
    config._assetTypes.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }
    // cache constructor
    if (isFirstExtend) {
      extendOptions._Ctor = Sub;
    }
    return Sub;
  };

  /**
   * A function that returns a sub-class constructor with the
   * given name. This gives us much nicer output when
   * logging instances in the console.
   *
   * @param {String} name
   * @return {Function}
   */

  function createClass(name) {
    /* eslint-disable no-new-func */
    return new Function('return function ' + classify(name) + ' (options) { this._init(options) }')();
    /* eslint-enable no-new-func */
  }

  /**
   * Plugin system
   *
   * @param {Object} plugin
   */

  Vue.use = function (plugin) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return;
    }
    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else {
      plugin.apply(null, args);
    }
    plugin.installed = true;
    return this;
  };

  /**
   * Apply a global mixin by merging it into the default
   * options.
   */

  Vue.mixin = function (mixin) {
    Vue.options = mergeOptions(Vue.options, mixin);
  };

  /**
   * Create asset registration methods with the following
   * signature:
   *
   * @param {String} id
   * @param {*} definition
   */

  config._assetTypes.forEach(function (type) {
    Vue[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id];
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && (commonTagRE.test(id) || reservedTagRE.test(id))) {
            warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + id);
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = id;
          definition = Vue.extend(definition);
        }
        this.options[type + 's'][id] = definition;
        return definition;
      }
    };
  });

  // expose internal transition API
  extend(Vue.transition, transition);
}

installGlobalAPI(Vue);

Vue.version = '1.0.21';

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue);
    } else if (process.env.NODE_ENV !== 'production' && inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)) {
      console.log('Download the Vue Devtools for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
    }
  }
}, 0);

module.exports = Vue;
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}],4:[function(require,module,exports){
'use strict';

var Vue = require('vue');
var VueValidator = require('vue-validator');

Vue.use(VueValidator);
function changeAccess() {

    $('#access')
        .live("change", function(e) {
            // console.log("change val=" + e.val);
            if(e.val == 0){
              /*  $('#usersContacts').select2({
                    ajax: {
                        url: "userContacts/" + $('#user_id').val(),
                        dataType: 'json',
                        delay: 250,
                        data: function (data) {
                            return {
                                data: data // search term
                                //page: params.email
                            };
                        },
                        processResults: function (data) {
                            return {
                                results: $.map(data, function (item) {
                                    return {
                                        text: item.email,
                                        id: item.id
                                    }
                                })
                            };
                        },
                        cache: true
                    }
                });*/

                    $.ajax( {
                         url: "userContacts/" + $('#user_id').val(),
                        success: function (data) {
                            var t = data;
                            var select = $('#usersContacts').select2();
                            select.data(data);
                            

                            //$('#usersContacts').select2('data', data, true);
                             }
                 });

                
                $('#usersContacts').parent('div').removeClass('hidden');
            }else{
                $('#usersContacts').parent('div').addClass('hidden');
                $('#usersContacts').val('');
            }
        });
}
    new Vue({
        el: '#access',
        ready: function () {
            changeAccess();
        },
        methods: {

        }
    });

new Vue({
    el: '#create-post'

});

},{"vue":3,"vue-validator":2}]},{},[4]);

//# sourceMappingURL=adminCreatePost.js.map

/**
 Copyright 2012 Igor Vaynberg
 Select2
 http://www.apache.org/licenses/LICENSE-2.0
 http://www.gnu.org/licenses/gpl-2.0.html
*/
!function(e){"undefined"==typeof e.fn.each2&&e.extend(e.fn,{each2:function(t){for(var s=e([0]),i=-1,n=this.length;++i<n&&(s.context=s[0]=this[i])&&t.call(s[0],i,s)!==!1;);return this}})}(jQuery),function(e,t){"use strict";function s(e){var t,s,i,n;if(!e||e.length<1)return e;for(t="",s=0,i=e.length;i>s;s++)n=e.charAt(s),t+=z[n]||n;return t}function i(e,t){for(var s=0,i=t.length;i>s;s+=1)if(o(e,t[s]))return s;return-1}function n(){var t=e(F);t.appendTo("body");var s={width:t.width()-t[0].clientWidth,height:t.height()-t[0].clientHeight};return t.remove(),s}function o(e,s){return e===s?!0:e===t||s===t?!1:null===e||null===s?!1:e.constructor===String?e+""==s+"":s.constructor===String?s+""==e+"":!1}function a(t,s){var i,n,o;if(null===t||t.length<1)return[];for(i=t.split(s),n=0,o=i.length;o>n;n+=1)i[n]=e.trim(i[n]);return i}function r(e){return e.outerWidth(!1)-e.width()}function c(s){var i="keyup-change-value";s.on("keydown",function(){e.data(s,i)===t&&e.data(s,i,s.val())}),s.on("keyup",function(){var n=e.data(s,i);n!==t&&s.val()!==n&&(e.removeData(s,i),s.trigger("keyup-change"))})}function l(s){s.on("mousemove",function(s){var i=M;(i===t||i.x!==s.pageX||i.y!==s.pageY)&&e(s.target).trigger("mousemove-filtered",s)})}function h(e,s,i){i=i||t;var n;return function(){var t=arguments;window.clearTimeout(n),n=window.setTimeout(function(){s.apply(i,t)},e)}}function u(e){var t,s=!1;return function(){return s===!1&&(t=e(),s=!0),t}}function d(e,t){var s=h(e,function(e){t.trigger("scroll-debounced",e)});t.on("scroll",function(e){i(e.target,t.get())>=0&&s(e)})}function p(e){e[0]!==document.activeElement&&window.setTimeout(function(){var t,s=e[0],i=e.val().length;e.focus(),e.is(":visible")&&s===document.activeElement&&(s.setSelectionRange?s.setSelectionRange(i,i):s.createTextRange&&(t=s.createTextRange(),t.collapse(!1),t.select()))},0)}function f(t){t=e(t)[0];var s=0,i=0;if("selectionStart"in t)s=t.selectionStart,i=t.selectionEnd-s;else if("selection"in document){t.focus();var n=document.selection.createRange();i=document.selection.createRange().text.length,n.moveStart("character",-t.value.length),s=n.text.length-i}return{offset:s,length:i}}function g(e){e.preventDefault(),e.stopPropagation()}function m(e){e.preventDefault(),e.stopImmediatePropagation()}function v(t){if(!H){var s=t[0].currentStyle||window.getComputedStyle(t[0],null);H=e(document.createElement("div")).css({position:"absolute",left:"-10000px",top:"-10000px",display:"none",fontSize:s.fontSize,fontFamily:s.fontFamily,fontStyle:s.fontStyle,fontWeight:s.fontWeight,letterSpacing:s.letterSpacing,textTransform:s.textTransform,whiteSpace:"nowrap"}),H.attr("class","select2-sizer"),e("body").append(H)}return H.text(t.val()),H.width()}function w(t,s,i){var n,o,a=[];n=t.attr("class"),n&&(n=""+n,e(n.split(" ")).each2(function(){0===this.indexOf("select2-")&&a.push(this)})),n=s.attr("class"),n&&(n=""+n,e(n.split(" ")).each2(function(){0!==this.indexOf("select2-")&&(o=i(this),o&&a.push(this))})),t.attr("class",a.join(" "))}function C(e,t,i,n){var o=s(e.toUpperCase()).indexOf(s(t.toUpperCase())),a=t.length;return 0>o?void i.push(n(e)):(i.push(n(e.substring(0,o))),i.push("<span class='select2-match'>"),i.push(n(e.substring(o,o+a))),i.push("</span>"),void i.push(n(e.substring(o+a,e.length))))}function b(e){var t={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return String(e).replace(/[&<>"'\/\\]/g,function(e){return t[e]})}function S(s){var i,n=null,o=s.quietMillis||100,a=s.url,r=this;return function(c){window.clearTimeout(i),i=window.setTimeout(function(){var i=s.data,o=a,l=s.transport||e.fn.select2.ajaxDefaults.transport,h={type:s.type||"GET",cache:s.cache||!1,jsonpCallback:s.jsonpCallback||t,dataType:s.dataType||"json"},u=e.extend({},e.fn.select2.ajaxDefaults.params,h);i=i?i.call(r,c.term,c.page,c.context):null,o="function"==typeof o?o.call(r,c.term,c.page,c.context):o,n&&n.abort(),s.params&&(e.isFunction(s.params)?e.extend(u,s.params.call(r)):e.extend(u,s.params)),e.extend(u,{url:o,dataType:s.dataType,data:i,success:function(e){var t=s.results(e,c.page);c.callback(t)}}),n=l.call(r,u)},o)}}function y(t){var s,i,n=t,o=function(e){return""+e.text};e.isArray(n)&&(i=n,n={results:i}),e.isFunction(n)===!1&&(i=n,n=function(){return i});var a=n();return a.text&&(o=a.text,e.isFunction(o)||(s=a.text,o=function(e){return e[s]})),function(t){var s,i=t.term,a={results:[]};return""===i?void t.callback(n()):(s=function(n,a){var r,c;if(n=n[0],n.children){r={};for(c in n)n.hasOwnProperty(c)&&(r[c]=n[c]);r.children=[],e(n.children).each2(function(e,t){s(t,r.children)}),(r.children.length||t.matcher(i,o(r),n))&&a.push(r)}else t.matcher(i,o(n),n)&&a.push(n)},e(n().results).each2(function(e,t){s(t,a.results)}),void t.callback(a))}}function E(s){var i=e.isFunction(s);return function(n){var o=n.term,a={results:[]};e(i?s():s).each(function(){var e=this.text!==t,s=e?this.text:this;(""===o||n.matcher(o,s))&&a.results.push(e?this:{id:this,text:this})}),n.callback(a)}}function x(t,s){if(e.isFunction(t))return!0;if(!t)return!1;throw new Error(s+" must be a function or a falsy value")}function T(t){return e.isFunction(t)?t():t}function O(t){var s=0;return e.each(t,function(e,t){t.children?s+=O(t.children):s++}),s}function k(e,s,i,n){var a,r,c,l,h,u=e,d=!1;if(!n.createSearchChoice||!n.tokenSeparators||n.tokenSeparators.length<1)return t;for(;;){for(r=-1,c=0,l=n.tokenSeparators.length;l>c&&(h=n.tokenSeparators[c],r=e.indexOf(h),!(r>=0));c++);if(0>r)break;if(a=e.substring(0,r),e=e.substring(r+h.length),a.length>0&&(a=n.createSearchChoice.call(this,a,s),a!==t&&null!==a&&n.id(a)!==t&&null!==n.id(a))){for(d=!1,c=0,l=s.length;l>c;c++)if(o(n.id(a),n.id(s[c]))){d=!0;break}d||i(a)}}return u!==e?e:void 0}function I(t,s){var i=function(){};return i.prototype=new t,i.prototype.constructor=i,i.prototype.parent=t.prototype,i.prototype=e.extend(i.prototype,s),i}if(window.Select2===t){var A,P,R,D,L,H,U,N,M={x:0,y:0},A={TAB:9,ENTER:13,ESC:27,SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40,SHIFT:16,CTRL:17,ALT:18,PAGE_UP:33,PAGE_DOWN:34,HOME:36,END:35,BACKSPACE:8,DELETE:46,isArrow:function(e){switch(e=e.which?e.which:e){case A.LEFT:case A.RIGHT:case A.UP:case A.DOWN:return!0}return!1},isControl:function(e){var t=e.which;switch(t){case A.SHIFT:case A.CTRL:case A.ALT:return!0}return e.metaKey?!0:!1},isFunctionKey:function(e){return e=e.which?e.which:e,e>=112&&123>=e}},F="<div class='select2-measure-scrollbar'></div>",z={"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z"};U=e(document),L=function(){var e=1;return function(){return e++}}(),U.on("mousemove",function(e){M.x=e.pageX,M.y=e.pageY}),P=I(Object,{bind:function(e){var t=this;return function(){e.apply(t,arguments)}},init:function(s){var i,o,a,r,h=".select2-results";this.opts=s=this.prepareOpts(s),this.id=s.id,s.element.data("select2")!==t&&null!==s.element.data("select2")&&s.element.data("select2").destroy(),this.container=this.createContainer(),this.containerId="s2id_"+(s.element.attr("id")||"autogen"+L()),this.containerSelector="#"+this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g,"\\$1"),this.container.attr("id",this.containerId),this.body=u(function(){return s.element.closest("body")}),w(this.container,this.opts.element,this.opts.adaptContainerCssClass),this.container.attr("style",s.element.attr("style")),this.container.css(T(s.containerCss)),this.container.addClass(T(s.containerCssClass)),this.elementTabIndex=this.opts.element.attr("tabindex"),this.opts.element.data("select2",this).attr("tabindex","-1").before(this.container),this.container.data("select2",this),this.dropdown=this.container.find(".select2-drop"),this.dropdown.addClass(T(s.dropdownCssClass)),this.dropdown.data("select2",this),w(this.dropdown,this.opts.element,this.opts.adaptDropdownCssClass),this.results=i=this.container.find(h),this.search=o=this.container.find("input.select2-input"),this.queryCount=0,this.resultsPage=0,this.context=null,this.initContainer(),l(this.results),this.dropdown.on("mousemove-filtered touchstart touchmove touchend",h,this.bind(this.highlightUnderEvent)),d(80,this.results),this.dropdown.on("scroll-debounced",h,this.bind(this.loadMoreIfNeeded)),e(this.container).on("change",".select2-input",function(e){e.stopPropagation()}),e(this.dropdown).on("change",".select2-input",function(e){e.stopPropagation()}),e.fn.mousewheel&&i.mousewheel(function(e,t,s,n){var o=i.scrollTop();n>0&&0>=o-n?(i.scrollTop(0),g(e)):0>n&&i.get(0).scrollHeight-i.scrollTop()+n<=i.height()&&(i.scrollTop(i.get(0).scrollHeight-i.height()),g(e))}),c(o),o.on("keyup-change input paste",this.bind(this.updateResults)),o.on("focus",function(){o.addClass("select2-focused")}),o.on("blur",function(){o.removeClass("select2-focused")}),this.dropdown.on("mouseup",h,this.bind(function(t){e(t.target).closest(".select2-result-selectable").length>0&&(this.highlightUnderEvent(t),this.selectHighlighted(t))})),this.dropdown.on("click mouseup mousedown",function(e){e.stopPropagation()}),e.isFunction(this.opts.initSelection)&&(this.initSelection(),this.monitorSource()),null!==s.maximumInputLength&&this.search.attr("maxlength",s.maximumInputLength);var a=s.element.prop("disabled");a===t&&(a=!1),this.enable(!a);var r=s.element.prop("readonly");r===t&&(r=!1),this.readonly(r),N=N||n(),this.autofocus=s.element.prop("autofocus"),s.element.prop("autofocus",!1),this.autofocus&&this.focus(),this.nextSearchTerm=t},destroy:function(){var e=this.opts.element,s=e.data("select2");this.close(),this.propertyObserver&&(delete this.propertyObserver,this.propertyObserver=null),s!==t&&(s.container.remove(),s.dropdown.remove(),e.removeClass("select2-offscreen").removeData("select2").off(".select2").prop("autofocus",this.autofocus||!1),this.elementTabIndex?e.attr({tabindex:this.elementTabIndex}):e.removeAttr("tabindex"),e.show())},optionToData:function(e){return e.is("option")?{id:e.prop("value"),text:e.text(),element:e.get(),css:e.attr("class"),disabled:e.prop("disabled"),locked:o(e.attr("locked"),"locked")||o(e.data("locked"),!0)}:e.is("optgroup")?{text:e.attr("label"),children:[],element:e.get(),css:e.attr("class")}:void 0},prepareOpts:function(s){var i,n,r,c,l=this;if(i=s.element,"select"===i.get(0).tagName.toLowerCase()&&(this.select=n=s.element),n&&e.each(["id","multiple","ajax","query","createSearchChoice","initSelection","data","tags"],function(){if(this in s)throw new Error("Option '"+this+"' is not allowed for Select2 when attached to a <select> element.")}),s=e.extend({},{populateResults:function(i,n,o){var a,r=this.opts.id;(a=function(i,n,c){var h,u,d,p,f,g,m,v,w,C;for(i=s.sortResults(i,n,o),h=0,u=i.length;u>h;h+=1)d=i[h],f=d.disabled===!0,p=!f&&r(d)!==t,g=d.children&&d.children.length>0,m=e("<li></li>"),m.addClass("select2-results-dept-"+c),m.addClass("select2-result"),m.addClass(p?"select2-result-selectable":"select2-result-unselectable"),f&&m.addClass("select2-disabled"),g&&m.addClass("select2-result-with-children"),m.addClass(l.opts.formatResultCssClass(d)),v=e(document.createElement("div")),v.addClass("select2-result-label"),C=s.formatResult(d,v,o,l.opts.escapeMarkup),C!==t&&v.html(C),m.append(v),g&&(w=e("<ul></ul>"),w.addClass("select2-result-sub"),a(d.children,w,c+1),m.append(w)),m.data("select2-data",d),n.append(m)})(n,i,0)}},e.fn.select2.defaults,s),"function"!=typeof s.id&&(r=s.id,s.id=function(e){return e[r]}),e.isArray(s.element.data("select2Tags"))){if("tags"in s)throw"tags specified as both an attribute 'data-select2-tags' and in options of Select2 "+s.element.attr("id");s.tags=s.element.data("select2Tags")}if(n?(s.query=this.bind(function(e){var s,n,o,a={results:[],more:!1},r=e.term;o=function(t,s){var i;t.is("option")?e.matcher(r,t.text(),t)&&s.push(l.optionToData(t)):t.is("optgroup")&&(i=l.optionToData(t),t.children().each2(function(e,t){o(t,i.children)}),i.children.length>0&&s.push(i))},s=i.children(),this.getPlaceholder()!==t&&s.length>0&&(n=this.getPlaceholderOption(),n&&(s=s.not(n))),s.each2(function(e,t){o(t,a.results)}),e.callback(a)}),s.id=function(e){return e.id},s.formatResultCssClass=function(e){return e.css}):"query"in s||("ajax"in s?(c=s.element.data("ajax-url"),c&&c.length>0&&(s.ajax.url=c),s.query=S.call(s.element,s.ajax)):"data"in s?s.query=y(s.data):"tags"in s&&(s.query=E(s.tags),s.createSearchChoice===t&&(s.createSearchChoice=function(t){return{id:e.trim(t),text:e.trim(t)}}),s.initSelection===t&&(s.initSelection=function(t,i){var n=[];e(a(t.val(),s.separator)).each(function(){var t=this,i=this,a=s.tags;e.isFunction(a)&&(a=a()),e(a).each(function(){return o(this.id,t)?(i=this.text,!1):void 0}),n.push({id:t,text:i})}),i(n)}))),"function"!=typeof s.query)throw"query function not defined for Select2 "+s.element.attr("id");return s},monitorSource:function(){var e,s=this.opts.element;s.on("change.select2",this.bind(function(){this.opts.element.data("select2-change-triggered")!==!0&&this.initSelection()})),e=this.bind(function(){var e,i=s.prop("disabled");i===t&&(i=!1),this.enable(!i);var e=s.prop("readonly");e===t&&(e=!1),this.readonly(e),w(this.container,this.opts.element,this.opts.adaptContainerCssClass),this.container.addClass(T(this.opts.containerCssClass)),w(this.dropdown,this.opts.element,this.opts.adaptDropdownCssClass),this.dropdown.addClass(T(this.opts.dropdownCssClass))}),s.on("propertychange.select2 DOMAttrModified.select2",e),this.mutationCallback===t&&(this.mutationCallback=function(t){t.forEach(e)}),"undefined"!=typeof WebKitMutationObserver&&(this.propertyObserver&&(delete this.propertyObserver,this.propertyObserver=null),this.propertyObserver=new WebKitMutationObserver(this.mutationCallback),this.propertyObserver.observe(s.get(0),{attributes:!0,subtree:!1}))},triggerSelect:function(t){var s=e.Event("select2-selecting",{val:this.id(t),object:t});return this.opts.element.trigger(s),!s.isDefaultPrevented()},triggerChange:function(t){t=t||{},t=e.extend({},t,{type:"change",val:this.val()}),this.opts.element.data("select2-change-triggered",!0),this.opts.element.trigger(t),this.opts.element.data("select2-change-triggered",!1),this.opts.element.click(),this.opts.blurOnChange&&this.opts.element.blur()},isInterfaceEnabled:function(){return this.enabledInterface===!0},enableInterface:function(){var e=this._enabled&&!this._readonly,t=!e;return e===this.enabledInterface?!1:(this.container.toggleClass("select2-container-disabled",t),this.close(),this.enabledInterface=e,!0)},enable:function(e){e===t&&(e=!0),this._enabled!==e&&(this._enabled=e,this.opts.element.prop("disabled",!e),this.enableInterface())},disable:function(){this.enable(!1)},readonly:function(e){return e===t&&(e=!1),this._readonly===e?!1:(this._readonly=e,this.opts.element.prop("readonly",e),this.enableInterface(),!0)},opened:function(){return this.container.hasClass("select2-dropdown-open")},positionDropdown:function(){var t,s,i,n,o=this.dropdown,a=this.container.offset(),r=this.container.outerHeight(!1),c=this.container.outerWidth(!1),l=o.outerHeight(!1),h=e(window).scrollLeft()+e(window).width(),u=e(window).scrollTop()+e(window).height(),d=a.top+r,p=a.left,f=u>=d+l,g=a.top-l>=this.body().scrollTop(),m=o.outerWidth(!1),v=h>=p+m,w=o.hasClass("select2-drop-above");this.opts.dropdownAutoWidth?(n=e(".select2-results",o)[0],o.addClass("select2-drop-auto-width"),o.css("width",""),m=o.outerWidth(!1)+(n.scrollHeight===n.clientHeight?0:N.width),m>c?c=m:m=c,v=h>=p+m):this.container.removeClass("select2-drop-auto-width"),"static"!==this.body().css("position")&&(t=this.body().offset(),d-=t.top,p-=t.left),w?(s=!0,!g&&f&&(s=!1)):(s=!1,!f&&g&&(s=!0)),v||(p=a.left+c-m),s?(d=a.top-l,this.container.addClass("select2-drop-above"),o.addClass("select2-drop-above")):(this.container.removeClass("select2-drop-above"),o.removeClass("select2-drop-above")),i=e.extend({top:d,left:p,width:c},T(this.opts.dropdownCss)),o.css(i)},shouldOpen:function(){var t;return this.opened()?!1:this._enabled===!1||this._readonly===!0?!1:(t=e.Event("select2-opening"),this.opts.element.trigger(t),!t.isDefaultPrevented())},clearDropdownAlignmentPreference:function(){this.container.removeClass("select2-drop-above"),this.dropdown.removeClass("select2-drop-above")},open:function(){return this.shouldOpen()?(this.opening(),!0):!1},opening:function(){var t,s=this.containerId,i="scroll."+s,n="resize."+s,o="orientationchange."+s;this.container.addClass("select2-dropdown-open").addClass("select2-container-active"),this.clearDropdownAlignmentPreference(),this.dropdown[0]!==this.body().children().last()[0]&&this.dropdown.detach().appendTo(this.body()),t=e("#select2-drop-mask"),0==t.length&&(t=e(document.createElement("div")),t.attr("id","select2-drop-mask").attr("class","select2-drop-mask"),t.hide(),t.appendTo(this.body()),t.on("mousedown touchstart click",function(t){var s,i=e("#select2-drop");i.length>0&&(s=i.data("select2"),s.opts.selectOnBlur&&s.selectHighlighted({noFocus:!0}),s.close({focus:!1}),t.preventDefault(),t.stopPropagation())})),this.dropdown.prev()[0]!==t[0]&&this.dropdown.before(t),e("#select2-drop").removeAttr("id"),this.dropdown.attr("id","select2-drop"),t.show(),this.positionDropdown(),this.dropdown.show(),this.positionDropdown(),this.dropdown.addClass("select2-drop-active");var a=this;this.container.parents().add(window).each(function(){e(this).on(n+" "+i+" "+o,function(){a.positionDropdown()})})},close:function(){if(this.opened()){var t=this.containerId,s="scroll."+t,i="resize."+t,n="orientationchange."+t;this.container.parents().add(window).each(function(){e(this).off(s).off(i).off(n)}),this.clearDropdownAlignmentPreference(),e("#select2-drop-mask").hide(),this.dropdown.removeAttr("id"),this.dropdown.hide(),this.container.removeClass("select2-dropdown-open"),this.results.empty(),this.clearSearch(),this.search.removeClass("select2-active"),this.opts.element.trigger(e.Event("select2-close"))}},externalSearch:function(e){this.open(),this.search.val(e),this.updateResults(!1)},clearSearch:function(){},getMaximumSelectionSize:function(){return T(this.opts.maximumSelectionSize)},ensureHighlightVisible:function(){var t,s,i,n,o,a,r,c=this.results;if(s=this.highlight(),!(0>s)){if(0==s)return void c.scrollTop(0);t=this.findHighlightableChoices().find(".select2-result-label"),i=e(t[s]),n=i.offset().top+i.outerHeight(!0),s===t.length-1&&(r=c.find("li.select2-more-results"),r.length>0&&(n=r.offset().top+r.outerHeight(!0))),o=c.offset().top+c.outerHeight(!0),n>o&&c.scrollTop(c.scrollTop()+(n-o)),a=i.offset().top-c.offset().top,0>a&&"none"!=i.css("display")&&c.scrollTop(c.scrollTop()+a)}},findHighlightableChoices:function(){return this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)")},moveHighlight:function(t){for(var s=this.findHighlightableChoices(),i=this.highlight();i>-1&&i<s.length;){i+=t;var n=e(s[i]);if(n.hasClass("select2-result-selectable")&&!n.hasClass("select2-disabled")&&!n.hasClass("select2-selected")){this.highlight(i);break}}},highlight:function(t){var s,n,o=this.findHighlightableChoices();return 0===arguments.length?i(o.filter(".select2-highlighted")[0],o.get()):(t>=o.length&&(t=o.length-1),0>t&&(t=0),this.removeHighlight(),s=e(o[t]),s.addClass("select2-highlighted"),this.ensureHighlightVisible(),n=s.data("select2-data"),void(n&&this.opts.element.trigger({type:"select2-highlight",val:this.id(n),choice:n})))},removeHighlight:function(){this.results.find(".select2-highlighted").removeClass("select2-highlighted")},countSelectableResults:function(){return this.findHighlightableChoices().length},highlightUnderEvent:function(t){var s=e(t.target).closest(".select2-result-selectable");if(s.length>0&&!s.is(".select2-highlighted")){var i=this.findHighlightableChoices();this.highlight(i.index(s))}else 0==s.length&&this.removeHighlight()},loadMoreIfNeeded:function(){var e,t=this.results,s=t.find("li.select2-more-results"),i=this.resultsPage+1,n=this,o=this.search.val(),a=this.context;0!==s.length&&(e=s.offset().top-t.offset().top-t.height(),e<=this.opts.loadMorePadding&&(s.addClass("select2-active"),this.opts.query({element:this.opts.element,term:o,page:i,context:a,matcher:this.opts.matcher,callback:this.bind(function(e){n.opened()&&(n.opts.populateResults.call(this,t,e.results,{term:o,page:i,context:a}),n.postprocessResults(e,!1,!1),e.more===!0?(s.detach().appendTo(t).text(n.opts.formatLoadMore(i+1)),window.setTimeout(function(){n.loadMoreIfNeeded()},10)):s.remove(),n.positionDropdown(),n.resultsPage=i,n.context=e.context,this.opts.element.trigger({type:"select2-loaded",items:e}))})})))},tokenize:function(){},updateResults:function(s){function i(){l.removeClass("select2-active"),d.positionDropdown()}function n(e){h.html(e),i()}var a,r,c,l=this.search,h=this.results,u=this.opts,d=this,p=l.val(),f=e.data(this.container,"select2-last-term");if((s===!0||!f||!o(p,f))&&(e.data(this.container,"select2-last-term",p),s===!0||this.showSearchInput!==!1&&this.opened())){c=++this.queryCount;var g=this.getMaximumSelectionSize();if(g>=1&&(a=this.data(),e.isArray(a)&&a.length>=g&&x(u.formatSelectionTooBig,"formatSelectionTooBig")))return void n("<li class='select2-selection-limit'>"+u.formatSelectionTooBig(g)+"</li>");if(l.val().length<u.minimumInputLength)return n(x(u.formatInputTooShort,"formatInputTooShort")?"<li class='select2-no-results'>"+u.formatInputTooShort(l.val(),u.minimumInputLength)+"</li>":""),void(s&&this.showSearch&&this.showSearch(!0));if(u.maximumInputLength&&l.val().length>u.maximumInputLength)return void n(x(u.formatInputTooLong,"formatInputTooLong")?"<li class='select2-no-results'>"+u.formatInputTooLong(l.val(),u.maximumInputLength)+"</li>":"");u.formatSearching&&0===this.findHighlightableChoices().length&&n("<li class='select2-searching'>"+u.formatSearching()+"</li>"),l.addClass("select2-active"),this.removeHighlight(),r=this.tokenize(),r!=t&&null!=r&&l.val(r),this.resultsPage=1,u.query({element:u.element,term:l.val(),page:this.resultsPage,context:null,matcher:u.matcher,callback:this.bind(function(a){var r;if(c==this.queryCount){if(!this.opened())return void this.search.removeClass("select2-active");if(this.context=a.context===t?null:a.context,this.opts.createSearchChoice&&""!==l.val()&&(r=this.opts.createSearchChoice.call(d,l.val(),a.results),r!==t&&null!==r&&d.id(r)!==t&&null!==d.id(r)&&0===e(a.results).filter(function(){return o(d.id(this),d.id(r))}).length&&a.results.unshift(r)),0===a.results.length&&x(u.formatNoMatches,"formatNoMatches"))return void n("<li class='select2-no-results'>"+u.formatNoMatches(l.val())+"</li>");h.empty(),d.opts.populateResults.call(this,h,a.results,{term:l.val(),page:this.resultsPage,context:null}),a.more===!0&&x(u.formatLoadMore,"formatLoadMore")&&(h.append("<li class='select2-more-results'>"+d.opts.escapeMarkup(u.formatLoadMore(this.resultsPage))+"</li>"),window.setTimeout(function(){d.loadMoreIfNeeded()},10)),this.postprocessResults(a,s),i(),this.opts.element.trigger({type:"select2-loaded",items:a})}})})}},cancel:function(){this.close()},blur:function(){this.opts.selectOnBlur&&this.selectHighlighted({noFocus:!0}),this.close(),this.container.removeClass("select2-container-active"),this.search[0]===document.activeElement&&this.search.blur(),this.clearSearch(),this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus")},focusSearch:function(){p(this.search)},selectHighlighted:function(e){var t=this.highlight(),s=this.results.find(".select2-highlighted"),i=s.closest(".select2-result").data("select2-data");i?(this.highlight(t),this.onSelect(i,e)):e&&e.noFocus&&this.close()},getPlaceholder:function(){var e;return this.opts.element.attr("placeholder")||this.opts.element.attr("data-placeholder")||this.opts.element.data("placeholder")||this.opts.placeholder||((e=this.getPlaceholderOption())!==t?e.text():t)},getPlaceholderOption:function(){if(this.select){var e=this.select.children().first();if(this.opts.placeholderOption!==t)return"first"===this.opts.placeholderOption&&e||"function"==typeof this.opts.placeholderOption&&this.opts.placeholderOption(this.select);if(""===e.text()&&""===e.val())return e}},initContainerWidth:function(){function s(){var s,i,n,o,a;if("off"===this.opts.width)return null;if("element"===this.opts.width)return 0===this.opts.element.outerWidth(!1)?"auto":this.opts.element.outerWidth(!1)+"px";if("copy"===this.opts.width||"resolve"===this.opts.width){if(s=this.opts.element.attr("style"),s!==t)for(i=s.split(";"),o=0,a=i.length;a>o;o+=1)if(n=i[o].replace(/\s/g,"").match(/[^-]width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i),null!==n&&n.length>=1)return n[1];return"resolve"===this.opts.width?(s=this.opts.element.css("width"),s.indexOf("%")>0?s:0===this.opts.element.outerWidth(!1)?"auto":this.opts.element.outerWidth(!1)+"px"):null}return e.isFunction(this.opts.width)?this.opts.width():this.opts.width}var i=s.call(this);null!==i&&this.container.css("width",i)}}),R=I(P,{createContainer:function(){var t=e(document.createElement("div")).attr({"class":"select2-container"}).html(["<a href='javascript:void(0)' onclick='return false;' class='select2-choice' tabindex='-1'>","   <span class='select2-chosen'>&nbsp;</span><abbr class='select2-search-choice-close'></abbr>","   <span class='select2-arrow'><b></b></span>","</a>","<input class='select2-focusser select2-offscreen' type='text'/>","<div class='select2-drop select2-display-none'>","   <div class='select2-search'>","       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'/>","   </div>","   <ul class='select2-results'>","   </ul>","</div>"].join(""));
    return t},enableInterface:function(){this.parent.enableInterface.apply(this,arguments)&&this.focusser.prop("disabled",!this.isInterfaceEnabled())},opening:function(){var s,i,n;this.opts.minimumResultsForSearch>=0&&this.showSearch(!0),this.parent.opening.apply(this,arguments),this.showSearchInput!==!1&&this.search.val(this.focusser.val()),this.search.focus(),s=this.search.get(0),s.createTextRange?(i=s.createTextRange(),i.collapse(!1),i.select()):s.setSelectionRange&&(n=this.search.val().length,s.setSelectionRange(n,n)),""===this.search.val()&&this.nextSearchTerm!=t&&(this.search.val(this.nextSearchTerm),this.search.select()),this.focusser.prop("disabled",!0).val(""),this.updateResults(!0),this.opts.element.trigger(e.Event("select2-open"))},close:function(e){this.opened()&&(this.parent.close.apply(this,arguments),e=e||{focus:!0},this.focusser.removeAttr("disabled"),e.focus&&this.focusser.focus())},focus:function(){this.opened()?this.close():(this.focusser.removeAttr("disabled"),this.focusser.focus())},isFocused:function(){return this.container.hasClass("select2-container-active")},cancel:function(){this.parent.cancel.apply(this,arguments),this.focusser.removeAttr("disabled"),this.focusser.focus()},destroy:function(){e("label[for='"+this.focusser.attr("id")+"']").attr("for",this.opts.element.attr("id")),this.parent.destroy.apply(this,arguments)},initContainer:function(){var t,s=this.container,i=this.dropdown;this.showSearch(this.opts.minimumResultsForSearch<0?!1:!0),this.selection=t=s.find(".select2-choice"),this.focusser=s.find(".select2-focusser"),this.focusser.attr("id","s2id_autogen"+L()),e("label[for='"+this.opts.element.attr("id")+"']").attr("for",this.focusser.attr("id")),this.focusser.attr("tabindex",this.elementTabIndex),this.search.on("keydown",this.bind(function(e){if(this.isInterfaceEnabled()){if(e.which===A.PAGE_UP||e.which===A.PAGE_DOWN)return void g(e);switch(e.which){case A.UP:case A.DOWN:return this.moveHighlight(e.which===A.UP?-1:1),void g(e);case A.ENTER:return this.selectHighlighted(),void g(e);case A.TAB:return void(this.opts.selectOnBlur&&this.selectHighlighted({noFocus:!0}));case A.ESC:return this.cancel(e),void g(e)}}})),this.search.on("blur",this.bind(function(){document.activeElement===this.body().get(0)&&window.setTimeout(this.bind(function(){this.search.focus()}),0)})),this.focusser.on("keydown",this.bind(function(e){if(this.isInterfaceEnabled()&&e.which!==A.TAB&&!A.isControl(e)&&!A.isFunctionKey(e)&&e.which!==A.ESC){if(this.opts.openOnEnter===!1&&e.which===A.ENTER)return void g(e);if(e.which==A.DOWN||e.which==A.UP||e.which==A.ENTER&&this.opts.openOnEnter){if(e.altKey||e.ctrlKey||e.shiftKey||e.metaKey)return;return this.open(),void g(e)}return e.which==A.DELETE||e.which==A.BACKSPACE?(this.opts.allowClear&&this.clear(),void g(e)):void 0}})),c(this.focusser),this.focusser.on("keyup-change input",this.bind(function(e){if(this.opts.minimumResultsForSearch>=0){if(e.stopPropagation(),this.opened())return;this.open()}})),t.on("mousedown","abbr",this.bind(function(e){this.isInterfaceEnabled()&&(this.clear(),m(e),this.close(),this.selection.focus())})),t.on("mousedown",this.bind(function(t){this.container.hasClass("select2-container-active")||this.opts.element.trigger(e.Event("select2-focus")),this.opened()?this.close():this.isInterfaceEnabled()&&this.open(),g(t)})),i.on("mousedown",this.bind(function(){this.search.focus()})),t.on("focus",this.bind(function(e){g(e)})),this.focusser.on("focus",this.bind(function(){this.container.hasClass("select2-container-active")||this.opts.element.trigger(e.Event("select2-focus")),this.container.addClass("select2-container-active")})).on("blur",this.bind(function(){this.opened()||(this.container.removeClass("select2-container-active"),this.opts.element.trigger(e.Event("select2-blur")))})),this.search.on("focus",this.bind(function(){this.container.hasClass("select2-container-active")||this.opts.element.trigger(e.Event("select2-focus")),this.container.addClass("select2-container-active")})),this.initContainerWidth(),this.opts.element.addClass("select2-offscreen"),this.setPlaceholder()},clear:function(e){var t=this.selection.data("select2-data");if(t){var s=this.getPlaceholderOption();this.opts.element.val(s?s.val():""),this.selection.find(".select2-chosen").empty(),this.selection.removeData("select2-data"),this.setPlaceholder(),e!==!1&&(this.opts.element.trigger({type:"select2-removed",val:this.id(t),choice:t}),this.triggerChange({removed:t}))}},initSelection:function(){if(this.isPlaceholderOptionSelected())this.updateSelection(null),this.close(),this.setPlaceholder();else{var e=this;this.opts.initSelection.call(null,this.opts.element,function(s){s!==t&&null!==s&&(e.updateSelection(s),e.close(),e.setPlaceholder())})}},isPlaceholderOptionSelected:function(){var e;return this.opts.placeholder?(e=this.getPlaceholderOption())!==t&&e.is(":selected")||""===this.opts.element.val()||this.opts.element.val()===t||null===this.opts.element.val():!1},prepareOpts:function(){var t=this.parent.prepareOpts.apply(this,arguments),s=this;return"select"===t.element.get(0).tagName.toLowerCase()?t.initSelection=function(e,t){var i=e.find(":selected");t(s.optionToData(i))}:"data"in t&&(t.initSelection=t.initSelection||function(s,i){var n=s.val(),a=null;t.query({matcher:function(e,s,i){var r=o(n,t.id(i));return r&&(a=i),r},callback:e.isFunction(i)?function(){i(a)}:e.noop})}),t},getPlaceholder:function(){return this.select&&this.getPlaceholderOption()===t?t:this.parent.getPlaceholder.apply(this,arguments)},setPlaceholder:function(){var e=this.getPlaceholder();if(this.isPlaceholderOptionSelected()&&e!==t){if(this.select&&this.getPlaceholderOption()===t)return;this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(e)),this.selection.addClass("select2-default"),this.container.removeClass("select2-allowclear")}},postprocessResults:function(e,t,s){var i=0,n=this;if(this.findHighlightableChoices().each2(function(e,t){return o(n.id(t.data("select2-data")),n.opts.element.val())?(i=e,!1):void 0}),s!==!1&&this.highlight(t===!0&&i>=0?i:0),t===!0){var a=this.opts.minimumResultsForSearch;a>=0&&this.showSearch(O(e.results)>=a)}},showSearch:function(t){this.showSearchInput!==t&&(this.showSearchInput=t,this.dropdown.find(".select2-search").toggleClass("select2-search-hidden",!t),this.dropdown.find(".select2-search").toggleClass("select2-offscreen",!t),e(this.dropdown,this.container).toggleClass("select2-with-searchbox",t))},onSelect:function(e,t){if(this.triggerSelect(e)){var s=this.opts.element.val(),i=this.data();this.opts.element.val(this.id(e)),this.updateSelection(e),this.opts.element.trigger({type:"select2-selected",val:this.id(e),choice:e}),this.nextSearchTerm=this.opts.nextSearchTerm(e,this.search.val()),this.close(),t&&t.noFocus||this.selection.focus(),o(s,this.id(e))||this.triggerChange({added:e,removed:i})}},updateSelection:function(e){var s,i,n=this.selection.find(".select2-chosen");this.selection.data("select2-data",e),n.empty(),null!==e&&(s=this.opts.formatSelection(e,n,this.opts.escapeMarkup)),s!==t&&n.append(s),i=this.opts.formatSelectionCssClass(e,n),i!==t&&n.addClass(i),this.selection.removeClass("select2-default"),this.opts.allowClear&&this.getPlaceholder()!==t&&this.container.addClass("select2-allowclear")},val:function(){var e,s=!1,i=null,n=this,o=this.data();if(0===arguments.length)return this.opts.element.val();if(e=arguments[0],arguments.length>1&&(s=arguments[1]),this.select)this.select.val(e).find(":selected").each2(function(e,t){return i=n.optionToData(t),!1}),this.updateSelection(i),this.setPlaceholder(),s&&this.triggerChange({added:i,removed:o});else{if(!e&&0!==e)return void this.clear(s);if(this.opts.initSelection===t)throw new Error("cannot call val() if initSelection() is not defined");this.opts.element.val(e),this.opts.initSelection(this.opts.element,function(e){n.opts.element.val(e?n.id(e):""),n.updateSelection(e),n.setPlaceholder(),s&&n.triggerChange({added:e,removed:o})})}},clearSearch:function(){this.search.val(""),this.focusser.val("")},data:function(e){var s,i=!1;return 0===arguments.length?(s=this.selection.data("select2-data"),s==t&&(s=null),s):(arguments.length>1&&(i=arguments[1]),void(e?(s=this.data(),this.opts.element.val(e?this.id(e):""),this.updateSelection(e),i&&this.triggerChange({added:e,removed:s})):this.clear(i)))}}),D=I(P,{createContainer:function(){var t=e(document.createElement("div")).attr({"class":"select2-container select2-container-multi"}).html(["<ul class='select2-choices'>","  <li class='select2-search-field'>","    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>","  </li>","</ul>","<div class='select2-drop select2-drop-multi select2-display-none'>","   <ul class='select2-results'>","   </ul>","</div>"].join(""));return t},prepareOpts:function(){var t=this.parent.prepareOpts.apply(this,arguments),s=this;return"select"===t.element.get(0).tagName.toLowerCase()?t.initSelection=function(e,t){var i=[];e.find(":selected").each2(function(e,t){i.push(s.optionToData(t))}),t(i)}:"data"in t&&(t.initSelection=t.initSelection||function(s,i){var n=a(s.val(),t.separator),r=[];t.query({matcher:function(s,i,a){var c=e.grep(n,function(e){return o(e,t.id(a))}).length;return c&&r.push(a),c},callback:e.isFunction(i)?function(){for(var e=[],s=0;s<n.length;s++)for(var a=n[s],c=0;c<r.length;c++){var l=r[c];if(o(a,t.id(l))){e.push(l),r.splice(c,1);break}}i(e)}:e.noop})}),t},selectChoice:function(e){var t=this.container.find(".select2-search-choice-focus");t.length&&e&&e[0]==t[0]||(t.length&&this.opts.element.trigger("choice-deselected",t),t.removeClass("select2-search-choice-focus"),e&&e.length&&(this.close(),e.addClass("select2-search-choice-focus"),this.opts.element.trigger("choice-selected",e)))},destroy:function(){e("label[for='"+this.search.attr("id")+"']").attr("for",this.opts.element.attr("id")),this.parent.destroy.apply(this,arguments)},initContainer:function(){var t,s=".select2-choices";this.searchContainer=this.container.find(".select2-search-field"),this.selection=t=this.container.find(s);var i=this;this.selection.on("click",".select2-search-choice",function(){i.search[0].focus(),i.selectChoice(e(this))}),this.search.attr("id","s2id_autogen"+L()),e("label[for='"+this.opts.element.attr("id")+"']").attr("for",this.search.attr("id")),this.search.on("input paste",this.bind(function(){this.isInterfaceEnabled()&&(this.opened()||this.open())})),this.search.attr("tabindex",this.elementTabIndex),this.keydowns=0,this.search.on("keydown",this.bind(function(e){if(this.isInterfaceEnabled()){++this.keydowns;var s=t.find(".select2-search-choice-focus"),i=s.prev(".select2-search-choice:not(.select2-locked)"),n=s.next(".select2-search-choice:not(.select2-locked)"),o=f(this.search);if(s.length&&(e.which==A.LEFT||e.which==A.RIGHT||e.which==A.BACKSPACE||e.which==A.DELETE||e.which==A.ENTER)){var a=s;return e.which==A.LEFT&&i.length?a=i:e.which==A.RIGHT?a=n.length?n:null:e.which===A.BACKSPACE?(this.unselect(s.first()),this.search.width(10),a=i.length?i:n):e.which==A.DELETE?(this.unselect(s.first()),this.search.width(10),a=n.length?n:null):e.which==A.ENTER&&(a=null),this.selectChoice(a),g(e),void(a&&a.length||this.open())}if((e.which===A.BACKSPACE&&1==this.keydowns||e.which==A.LEFT)&&0==o.offset&&!o.length)return this.selectChoice(t.find(".select2-search-choice:not(.select2-locked)").last()),void g(e);if(this.selectChoice(null),this.opened())switch(e.which){case A.UP:case A.DOWN:return this.moveHighlight(e.which===A.UP?-1:1),void g(e);case A.ENTER:return this.selectHighlighted(),void g(e);case A.TAB:return this.opts.selectOnBlur&&this.selectHighlighted({noFocus:!0}),void this.close();case A.ESC:return this.cancel(e),void g(e)}if(e.which!==A.TAB&&!A.isControl(e)&&!A.isFunctionKey(e)&&e.which!==A.BACKSPACE&&e.which!==A.ESC){if(e.which===A.ENTER){if(this.opts.openOnEnter===!1)return;if(e.altKey||e.ctrlKey||e.shiftKey||e.metaKey)return}this.open(),(e.which===A.PAGE_UP||e.which===A.PAGE_DOWN)&&g(e),e.which===A.ENTER&&g(e)}}})),this.search.on("keyup",this.bind(function(){this.keydowns=0,this.resizeSearch()})),this.search.on("blur",this.bind(function(t){this.container.removeClass("select2-container-active"),this.search.removeClass("select2-focused"),this.selectChoice(null),this.opened()||this.clearSearch(),t.stopImmediatePropagation(),this.opts.element.trigger(e.Event("select2-blur"))})),this.container.on("click",s,this.bind(function(t){this.isInterfaceEnabled()&&(e(t.target).closest(".select2-search-choice").length>0||(this.selectChoice(null),this.clearPlaceholder(),this.container.hasClass("select2-container-active")||this.opts.element.trigger(e.Event("select2-focus")),this.open(),this.focusSearch(),t.preventDefault()))})),this.container.on("focus",s,this.bind(function(){this.isInterfaceEnabled()&&(this.container.hasClass("select2-container-active")||this.opts.element.trigger(e.Event("select2-focus")),this.container.addClass("select2-container-active"),this.dropdown.addClass("select2-drop-active"),this.clearPlaceholder())})),this.initContainerWidth(),this.opts.element.addClass("select2-offscreen"),this.clearSearch()},enableInterface:function(){this.parent.enableInterface.apply(this,arguments)&&this.search.prop("disabled",!this.isInterfaceEnabled())},initSelection:function(){if(""===this.opts.element.val()&&""===this.opts.element.text()&&(this.updateSelection([]),this.close(),this.clearSearch()),this.select||""!==this.opts.element.val()){var e=this;this.opts.initSelection.call(null,this.opts.element,function(s){s!==t&&null!==s&&(e.updateSelection(s),e.close(),e.clearSearch())})}},clearSearch:function(){var e=this.getPlaceholder(),s=this.getMaxSearchWidth();e!==t&&0===this.getVal().length&&this.search.hasClass("select2-focused")===!1?(this.search.val(e).addClass("select2-default"),this.search.width(s>0?s:this.container.css("width"))):this.search.val("").width(10)},clearPlaceholder:function(){this.search.hasClass("select2-default")&&this.search.val("").removeClass("select2-default")},opening:function(){this.clearPlaceholder(),this.resizeSearch(),this.parent.opening.apply(this,arguments),this.focusSearch(),this.updateResults(!0),this.search.focus(),this.opts.element.trigger(e.Event("select2-open"))},close:function(){this.opened()&&this.parent.close.apply(this,arguments)},focus:function(){this.close(),this.search.focus()},isFocused:function(){return this.search.hasClass("select2-focused")},updateSelection:function(t){var s=[],n=[],o=this;e(t).each(function(){i(o.id(this),s)<0&&(s.push(o.id(this)),n.push(this))}),t=n,this.selection.find(".select2-search-choice").remove(),e(t).each(function(){o.addSelectedChoice(this)}),o.postprocessResults()},tokenize:function(){var e=this.search.val();e=this.opts.tokenizer.call(this,e,this.data(),this.bind(this.onSelect),this.opts),null!=e&&e!=t&&(this.search.val(e),e.length>0&&this.open())},onSelect:function(e,t){this.triggerSelect(e)&&(this.addSelectedChoice(e),this.opts.element.trigger({type:"selected",val:this.id(e),choice:e}),(this.select||!this.opts.closeOnSelect)&&this.postprocessResults(e,!1,this.opts.closeOnSelect===!0),this.opts.closeOnSelect?(this.close(),this.search.width(10)):this.countSelectableResults()>0?(this.search.width(10),this.resizeSearch(),this.getMaximumSelectionSize()>0&&this.val().length>=this.getMaximumSelectionSize()&&this.updateResults(!0),this.positionDropdown()):(this.close(),this.search.width(10)),this.triggerChange({added:e}),t&&t.noFocus||this.focusSearch())},cancel:function(){this.close(),this.focusSearch()},addSelectedChoice:function(s){var i,n,o=!s.locked,a=e("<li class='select2-search-choice'>    <div></div>    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a></li>"),r=e("<li class='select2-search-choice select2-locked'><div></div></li>"),c=o?a:r,l=this.id(s),h=this.getVal();i=this.opts.formatSelection(s,c.find("div"),this.opts.escapeMarkup),i!=t&&c.find("div").replaceWith("<div>"+i+"</div>"),n=this.opts.formatSelectionCssClass(s,c.find("div")),n!=t&&c.addClass(n),o&&c.find(".select2-search-choice-close").on("mousedown",g).on("click dblclick",this.bind(function(t){this.isInterfaceEnabled()&&(e(t.target).closest(".select2-search-choice").fadeOut("fast",this.bind(function(){this.unselect(e(t.target)),this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus"),this.close(),this.focusSearch()})).dequeue(),g(t))})).on("focus",this.bind(function(){this.isInterfaceEnabled()&&(this.container.addClass("select2-container-active"),this.dropdown.addClass("select2-drop-active"))})),c.data("select2-data",s),c.insertBefore(this.searchContainer),h.push(l),this.setVal(h)},unselect:function(e){var t,s,n=this.getVal();if(e=e.closest(".select2-search-choice"),0===e.length)throw"Invalid argument: "+e+". Must be .select2-search-choice";t=e.data("select2-data"),t&&(s=i(this.id(t),n),s>=0&&(n.splice(s,1),this.setVal(n),this.select&&this.postprocessResults()),e.remove(),this.opts.element.trigger({type:"removed",val:this.id(t),choice:t}),this.triggerChange({removed:t}))},postprocessResults:function(e,t,s){var n=this.getVal(),o=this.results.find(".select2-result"),a=this.results.find(".select2-result-with-children"),r=this;o.each2(function(e,t){var s=r.id(t.data("select2-data"));i(s,n)>=0&&(t.addClass("select2-selected"),t.find(".select2-result-selectable").addClass("select2-selected"))}),a.each2(function(e,t){t.is(".select2-result-selectable")||0!==t.find(".select2-result-selectable:not(.select2-selected)").length||t.addClass("select2-selected")}),-1==this.highlight()&&s!==!1&&r.highlight(0),!this.opts.createSearchChoice&&!o.filter(".select2-result:not(.select2-selected)").length>0&&(!e||e&&!e.more&&0===this.results.find(".select2-no-results").length)&&x(r.opts.formatNoMatches,"formatNoMatches")&&this.results.append("<li class='select2-no-results'>"+r.opts.formatNoMatches(r.search.val())+"</li>")},getMaxSearchWidth:function(){return this.selection.width()-r(this.search)},resizeSearch:function(){var e,t,s,i,n,o=r(this.search);e=v(this.search)+10,t=this.search.offset().left,s=this.selection.width(),i=this.selection.offset().left,n=s-(t-i)-o,e>n&&(n=s-o),40>n&&(n=s-o),0>=n&&(n=e),this.search.width(n)},getVal:function(){var e;return this.select?(e=this.select.val(),null===e?[]:e):(e=this.opts.element.val(),a(e,this.opts.separator))},setVal:function(t){var s;this.select?this.select.val(t):(s=[],e(t).each(function(){i(this,s)<0&&s.push(this)}),this.opts.element.val(0===s.length?"":s.join(this.opts.separator)))},buildChangeDetails:function(e,t){for(var t=t.slice(0),e=e.slice(0),s=0;s<t.length;s++)for(var i=0;i<e.length;i++)o(this.opts.id(t[s]),this.opts.id(e[i]))&&(t.splice(s,1),s--,e.splice(i,1),i--);return{added:t,removed:e}},val:function(s,i){var n,o=this;if(0===arguments.length)return this.getVal();if(n=this.data(),n.length||(n=[]),!s&&0!==s)return this.opts.element.val(""),this.updateSelection([]),this.clearSearch(),void(i&&this.triggerChange({added:this.data(),removed:n}));if(this.setVal(s),this.select)this.opts.initSelection(this.select,this.bind(this.updateSelection)),i&&this.triggerChange(this.buildChangeDetails(n,this.data()));else{if(this.opts.initSelection===t)throw new Error("val() cannot be called if initSelection() is not defined");this.opts.initSelection(this.opts.element,function(t){var s=e.map(t,o.id);o.setVal(s),o.updateSelection(t),o.clearSearch(),i&&o.triggerChange(o.buildChangeDetails(n,this.data()))})}this.clearSearch()},onSortStart:function(){if(this.select)throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");this.search.width(0),this.searchContainer.hide()},onSortEnd:function(){var t=[],s=this;this.searchContainer.show(),this.searchContainer.appendTo(this.searchContainer.parent()),this.resizeSearch(),this.selection.find(".select2-search-choice").each(function(){t.push(s.opts.id(e(this).data("select2-data")))}),this.setVal(t),this.triggerChange()},data:function(t,s){var i,n,o=this;return 0===arguments.length?this.selection.find(".select2-search-choice").map(function(){return e(this).data("select2-data")}).get():(n=this.data(),t||(t=[]),i=e.map(t,function(e){return o.opts.id(e)}),this.setVal(i),this.updateSelection(t),this.clearSearch(),s&&this.triggerChange(this.buildChangeDetails(n,this.data())),void 0)}}),e.fn.select2=function(){var s,n,o,a,r,c=Array.prototype.slice.call(arguments,0),l=["val","destroy","opened","open","close","focus","isFocused","container","dropdown","onSortStart","onSortEnd","enable","disable","readonly","positionDropdown","data","search"],h=["opened","isFocused","container","dropdown"],u=["val","data"],d={search:"externalSearch"};return this.each(function(){if(0===c.length||"object"==typeof c[0])s=0===c.length?{}:e.extend({},c[0]),s.element=e(this),"select"===s.element.get(0).tagName.toLowerCase()?r=s.element.prop("multiple"):(r=s.multiple||!1,"tags"in s&&(s.multiple=r=!0)),n=r?new D:new R,n.init(s);else{if("string"!=typeof c[0])throw"Invalid arguments to select2 plugin: "+c;if(i(c[0],l)<0)throw"Unknown method: "+c[0];if(a=t,n=e(this).data("select2"),n===t)return;if(o=c[0],"container"===o?a=n.container:"dropdown"===o?a=n.dropdown:(d[o]&&(o=d[o]),a=n[o].apply(n,c.slice(1))),i(c[0],h)>=0||i(c[0],u)&&1==c.length)return!1}}),a===t?this:a},e.fn.select2.defaults={width:"copy",loadMorePadding:0,closeOnSelect:!0,openOnEnter:!0,containerCss:{},dropdownCss:{},containerCssClass:"",dropdownCssClass:"",formatResult:function(e,t,s,i){var n=[];return C(e.text,s.term,n,i),n.join("")},formatSelection:function(e,s,i){return e?i(e.text):t},sortResults:function(e){return e},formatResultCssClass:function(){return t},formatSelectionCssClass:function(){return t},formatNoMatches:function(){return"No matches found"},formatInputTooShort:function(e,t){var s=t-e.length;return"Please enter "+s+" more character"+(1==s?"":"s")},formatInputTooLong:function(e,t){var s=e.length-t;return"Please delete "+s+" character"+(1==s?"":"s")},formatSelectionTooBig:function(e){return"You can only select "+e+" item"+(1==e?"":"s")},formatLoadMore:function(){return"Loading more results..."},formatSearching:function(){return"Searching..."},minimumResultsForSearch:0,minimumInputLength:0,maximumInputLength:null,maximumSelectionSize:0,id:function(e){return e.id},matcher:function(e,t){return s(""+t).toUpperCase().indexOf(s(""+e).toUpperCase())>=0},separator:",",tokenSeparators:[],tokenizer:k,escapeMarkup:b,blurOnChange:!1,selectOnBlur:!1,adaptContainerCssClass:function(e){return e},adaptDropdownCssClass:function(){return null},nextSearchTerm:function(){return t}},e.fn.select2.ajaxDefaults={transport:e.ajax,params:{type:"GET",cache:!1,dataType:"json"}},window.Select2={query:{ajax:S,local:y,tags:E},util:{debounce:h,markMatch:C,escapeMarkup:b,stripDiacritics:s},"class":{"abstract":P,single:R,multi:D}}}}(jQuery);


/**
 * Created by mosaddek on 3/9/15.
 */

// Select2

function format(state) {
    if (!state.id) return state.text; // optgroup
    return "<img class='flag' src='img/flags/" + state.id.toLowerCase() + ".png'/>" + state.text;
}
//        if ($.fn.select2) {
var placeholder = "Select a State";
$('.select2, .select2-multiple').select2({
    placeholder: placeholder
});
$("#e4").select2({
    formatResult: format,
    formatSelection: format,
    escapeMarkup: function(m) {
        return m;
    }
});
$('.select2-allow-clear').select2({
    allowClear: true,
    placeholder: placeholder
});
$('button[data-select2-open]').click(function() {
    $('#' + $(this).data('select2-open')).select2('open');
});
var select2OpenEventName = "select2-open";
$(':checkbox').on("click", function() {
    $(this).parent().nextAll('select').select2("enable", this.checked);
});


//# sourceMappingURL=profile.js.map

//====== Enums & Constants =========

var AjaxActionToBePerformed = '';

var ajaxRequestQueue = [];
var ajaxSubmitRequestQueue = [];

var MessageType = {
    Success: 1,
    Error: 2,
    Warning: 3,
    None: 4
};

var ActionStatus = {
    Success: 1,
    Error: 2
}

var UserRoles = {
    User: 1,
    CompanyAdmin: 2,
    SuperAdmin: 3
}

var EditActionType = {
    Edit: 1,
    EditAndNew: 2,
    Cancel: 3
}


var timeoutTimer = null;

//====== End Enums & Constants =====

$(document).ready(function () {
    //$(document).on('click', '.delete', function () {
    //    return window.confirm("Are you sure you want to delete this item?");
    //})
    $(document).mouseup(function (e) {
        var container = $("span.common-msg");
        if (!container.is(e.target) // if the target of the click isn't the container...
                        && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.hide();
        }
    });
});



$.ScrollToTop = function () {
    var offset = 220;
    var duration = 500;
    $(window).scroll(function () {
        if ($(this).scrollTop() > offset) $('.back-to-top').fadeIn(duration);
        else $('.back-to-top').fadeOut(duration);
    });
    
    
    $('.back-to-top').click(function (event) {
        event.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, duration);
        return false;
    });
}

$.CreateWaterMark = function () {
    
    /*==========Sample Usage & Datatype Examples =============    
    <input name="" type="text" watermark="XXXXXXXX">    
    ==========================================================*/

    $("input[type=text][watermark], textarea[watermark]").each(function () {
        $(this).bind("focus", function () {
            if ($(this).val() == $(this).attr("watermark")) $(this).val("");
        });
        
        $(this).bind("blur", function () {
            if ($(this).val() == "") $(this).val($(this).attr("watermark"));
        });
    });
}

$.ShowThrobber = function (throbberPosition) {
    $("#MainThrobberImage").show().position(throbberPosition);
}

$.RemoveThrobber = function () {
    $("#MainThrobberImage").hide();
}


$.ShowMessage = function (messageSpan, message, messageType) {
    /*================= Sample Usage =========================
    $.ShowMessage($(selector), "This is a dummy message", MessageType.Success)
    ==========================================================*/
    if (message != undefined && message != null && message != '') {
        if (messageType == MessageType.Success) {
            $(messageSpan).html(message).removeClass("info").addClass("success").removeClass('error').fadeIn();
            // remove message after 5 seconds
            if (timeoutTimer) {
                clearTimeout(timeoutTimer); //cancel the previous timer.
                timeoutTimer = null;
            }
            timeoutTimer = setTimeout(function () { 
                $(messageSpan).fadeOut().html('');
            }, 5000);
        //$("html,body").animate({ scrollTop: "0" }, "slow");
        }
        else if (messageType == MessageType.Error) {
            $(messageSpan).html(message).removeClass("success").removeClass("info").addClass('error').fadeIn();
            $("html,body").animate({ scrollTop: "0" }, "slow");
        }
        else if (messageType == MessageType.Warning) {
            $(messageSpan).html(message).removeClass("success").removeClass('error').addClass("info").fadeIn();
            $("html,body").animate({ scrollTop: "0" }, "slow");
        }
    }
    else $(messageSpan).html('').hide();
}

$.IsNumericCustom = function (input) {
    return (input - 0) == input && input.length > 0;
}

$.IsEmailCustom = function (email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

$.ValidateFiles = function (form) {
    
    var isValid = true;
    
    $(form).find("input[type=file][required-field]").each(function () {
        if (!$.trim($(this).val())) {
            isValid = false;
            $(form).find('span[for=' + $(this).attr('name') + ']').addClass('field-validation-error').removeClass('field-validation-valid').html($(this).attr('required-field'));
        }
        else $(form).find('span[for=' + $(this).attr('name') + ']').addClass('field-validation-valid').removeClass('field-validation-error').html('');
    });
    
    $(form).find("input[type=file][allowed-formats]").each(function () {
        if ($(this).val()) {
            var filetype = $(this).val().split(".");
            filetype = filetype[filetype.length - 1].toLowerCase();
            
            if ($(this).attr("allowed-formats").indexOf(filetype) == -1) {
                isValid = false;
                $(form).find('span[for=' + $(this).attr('name') + ']').addClass('field-validation-error').removeClass('field-validation-valid').html($(this).attr('error-message'));
            }
            else $(form).find('span[for=' + $(this).attr('name') + ']').addClass('field-validation-valid').removeClass('field-validation-error').html('');
        }
    });
    
    return isValid;
}
$.IsAlphaNumericCustom = function (val) {
    if (/[^a-zA-Z0-9 ]/.test(val)) return false;
    return true;
}

$.ValidateFiles = function (form) {
    
    var isValid = true;
    
    $(form).find("input[type=file][required-field]").each(function () {
        if (!$.trim($(this).val())) {
            isValid = false;
            $(form).find('span[for=' + $(this).attr('name') + ']').addClass('field-validation-error').removeClass('field-validation-valid').html($(this).attr('required-field'));
        }
        else $(form).find('span[for=' + $(this).attr('name') + ']').addClass('field-validation-valid').removeClass('field-validation-error').html('');
    });
    
    $(form).find("input[type=file][allowed-formats]").each(function () {
        if ($(this).val()) {
            var filetype = $(this).val().split(".");
            filetype = filetype[filetype.length - 1].toLowerCase();
            
            if ($(this).attr("allowed-formats").indexOf(filetype) == -1) {
                isValid = false;
                $(form).find('span[for=' + $(this).attr('name') + ']').addClass('field-validation-error').removeClass('field-validation-valid').html($(this).attr('error-message'));
            }
            else $(form).find('span[for=' + $(this).attr('name') + ']').addClass('field-validation-valid').removeClass('field-validation-error').html('');
        }
    });
    
    return isValid;
}


$.ajaxExt = function (parameters) {
    /*=====================================Sample Usage======================================================
    $.ajaxExt({
    type: "POST",                                                                                       //default is "POST"
    error: function () { },                                                                             //called when an unexpected error occurs
    data: {name: "value"}                                                                               //overwrites the form parameter
    messageControl:  $(selector),                                                                       //the control where the status message needs to be displayed
    throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },             //the position at which the throbber needs to be displayed 
    url: url,                                                                                           //the url that needs to be hit
    success: function (data) {},                                                                        //called after the request has been executed without any unhandeled exception
    showThrobber: false                                                                                 //If the throbber need to be displayed
    showErrorMessage : true                                                                             //If the error message needs to be displayed
    containFiles: false                                                                                 //If the form contains files            
    formToPost: $('form'),                                                                               //The reference to the form to be posted
    abort: true,                                                                                        // Pass this parameter if you want to abort the ajax request on focus lost
    forPopup: true,                                                                                      // Pass this as true if want to open the result in a popup
    title: 'popupTitle',
    width:300,
    html:"htmlcontent" //The html content that need to be shown in the popup
    });
    ===============================================================================================*/
    function onError(a, b, c, parameters) {
        if (parameters.showErrorMessage != false) $.ShowMessage($(parameters.messageControl), "Unexpected Error", MessageType.Error);
        else if (parameters.error != undefined) parameters.error("Unexpected Error");
        
        if (parameters.showThrobber == true) $.RemoveThrobber();
    }
    
    function onSuccess(data, parameters) {
        if (parameters.showThrobber == true) $.RemoveThrobber();
        
        try {
            if (data.Status == undefined) {
                if (parameters.showErrorMessage != false) $.ShowMessage($(parameters.messageControl), "Invalid data returned in the response", MessageType.Error);
                else if (parameters.error != undefined) parameters.error("Invalid data returned in the response");
                
                return false;
            }
        }
        catch (ex) {
            if (parameters.showErrorMessage != false) $.ShowMessage($(parameters.messageControl), "Invalid data returned in the response", MessageType.Error);
            else if (parameters.error != undefined) parameters.error("Invalid data returned in the response");
        }
        
        if (data.Status == ActionStatus.Error) {
            if (parameters.showErrorMessage != false) $.ShowMessage($(parameters.messageControl), data.Message, MessageType.Error);
            if (parameters.error != undefined) { parameters.error(data.Message); }
            if (data.Results != undefined && data.Results[0] == 'LoginExipred') {
                //window.location.href = '/Login.aspx'; //data.Results[1];                
                $('a.signup-window').trigger('click');
            }
            parameters.error(data.Results, data.Message)
        }
        else if (parameters.success) {
            
            if (parameters.forPopup == true) {
                $.OpenPopup(parameters, data.Results)
                $('.backgroundPopup').show();
            } else {
                $.ShowMessage($(parameters.messageControl), data.Message, MessageType.Success);
                parameters.success(data.Results, data);
            }
            setTimeout(function () {
                var h = $('.inner-popup').outerHeight();
                if (h > 0)
                    $('.popupbox').css({ 'height': h + 'px' });
            }, 100);
        }
    }
    
    parameters.type = parameters.type == undefined ? "POST" : parameters.type;
    parameters.showErrorMessage = parameters.showErrorMessage == undefined ? false : parameters.showErrorMessage;
    parameters.showThrobber = parameters.showThrobber == undefined ? true : parameters.showThrobber;
    parameters.validate = parameters.validate == undefined ? false : parameters.validate;
    parameters.containFiles = parameters.containFiles == undefined ? false : parameters.containFiles;
    
    if (parameters.validate == true) {
        var isValidForm = $(parameters.formToValidate).valid();
        var isValidFiles = $.ValidateFiles(parameters.formToValidate);
        //if (!!isValidForm) return false;
        if (!isValidForm || !isValidFiles) return false;
    }
    
    
    if (parameters.showErrorMessage != false) $.ShowMessage($(parameters.messageControl), "", MessageType.None);
    if (parameters.showThrobber == true) {
        if (parameters.throbberPosition == undefined)
            parameters.throbberPosition = { my: "center center", at: "center center", of: $(window), offset: "5 0" };
        $.ShowThrobber(parameters.throbberPosition);
    }
    if (parameters.forPopup == true && parameters.html != "" && parameters.html != undefined) {
        $(parameters.html).show();
    }
    else {
        if (parameters.containFiles == true) {
            // inside event callbacks 'this' is the DOM element so we first 
            // wrap it in a jQuery object and then invoke ajaxSubmit 
            $(parameters.formToPost).ajaxSubmit({
                target: parameters.messageControl,   // target element(s) to be updated with server response 
                beforeSubmit: function (arr, $form, options) {
 /*$('#lightbox_overlay').show();*/
                    // The array of form data takes the following form: 
                    // [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ] 
                    
                    // return false to cancel submit  
                    if (parameters.abort == true) {
                        if (ajaxSubmitRequestQueue.length > 0) {
                            ajaxSubmitRequestQueue.length = 0;
                            return false;
                        }
                    }
                    $.ShowThrobber(parameters.throbberPosition);
                },  // pre-submit callback
                success: function (data) { $('#lightbox_overlay').hide(); onSuccess(data, parameters); },  // post-submit callback
                // other available options: 
                url: parameters.url,         // override for form's 'action' attribute 
                type: parameters.type,        // 'get' or 'post', override for form's 'method' attribute 
                dataType: 'json',        // 'xml', 'script', or 'json' (expected server response type) 
                clearForm: false,        // clear all form fields after successful submit 
                resetForm: false        // reset the form after successful submit 
            });
            // !!! Important !!! 
            // always return false to prevent standard browser submit and page navigation 
            return false;
        }
        else {
            // Enable Div Overlay to prevent user clicks to interrupt ajax request.
            //$('#lightbox_overlay').show();
            var request = $.ajax({
                url: parameters.url,
                type: parameters.type,
                dataType: "json",
                data: parameters.data,
                error: function (a, b, c) { $('#lightbox_overlay').hide(); onError(a, b, c, parameters); },
                success: function (data) { $('#lightbox_overlay').hide(); onSuccess(data, parameters); }
            });
            if (parameters.abort == true)
                ajaxRequestQueue.push(request);
        }
    }
}

$(document).on('click', '.backgroundPopup', function () {
    //$.ClosePopupWindow();
});

$.OpenPopup = function (parameters, data) {
    var offsetX = parameters.offsetX == undefined ? "0" : parameters.offsetX;
    var offsetY = parameters.offsetY == undefined ? "0" : parameters.offsetY;
    $("#lightBox div.popUpContent h4[name=Title]").html(parameters.title)
    $("#lightBox").show().position({ my: "center center", at: "center center", of: $(window), offset: offsetX + " " + offsetY });
    $("#lightBox div.popUpContent div[name=ActualContent]").html(data[0])
                                                           .css({ 'overflow-y': 'auto', 'overflow-x': 'hidden', 'max-width': parameters.width });
    $("#lightBox").show()
                  //.css({ 'min-height': '400px' })
                  .position({ my: "center center", at: "center center", of: $(window), offset: offsetX + " " + offsetY });
    $('.popUp .popUpContent .selectbox-section ul').css({ 'max-width': (parameters.width - 4) + 'px' });
    var form = $("#lightBox form:first");
    $.ResetUnobtrusiveValidation(form);
}


$.OpenPopupWindow = function (parameters) {
    
    /*=====================================Sample Usage======================================================
    $.OpenPopupWindow({
    url: url,           //the url that needs to be hit
    width: xxx,         //The width of the popup window 
    offsetX: xxx,       //No of pixels to be added horizontally from the center of the screen 
    offsetY: xxx,       //No of pixels to be added vertically from the center of the screen 
    title: "xxxxxx"     //The text to be displayed as the title of the popup windiw 
    html:"htmlcontent" //The html content that need to be shown in the popup
    type: "POST"    
    });
    ===============================================================================================*/

    var offsetX = parameters.offsetX == undefined ? "0" : parameters.offsetX;
    var offsetY = parameters.offsetY == undefined ? "0" : parameters.offsetY;
    var type = parameters.type == undefined ? "POST" : parameters.type;
    var scroll = parameters.scroll == undefined ? false : true;
    
    $("#lightbox_overlay").show();
    $("#lightBox div.popUpContent h4[name=Title]").html(parameters.title)
    //var popupdiv = $("#lightBox div.popUpContent div[name=ActualContent]");
    //popupdiv.css("min-width", parameters.width == undefined ? 400 : parameters.width);
    $("#lightBox div.popUpContent div[name=ActualContent]").css("min-width", parameters.width == undefined ? 400 : parameters.width)//.css("overflow-x","hidden").css("overflow-y","auto");
    //    if (scroll == true) {
    //        popupdiv.css("overflow-x", "hidden").css("overflow-y", "auto");
    //    }
    $("#lightBox").show().position({ my: "center center", at: "center center", of: $(window), offset: offsetX + " " + offsetY });
    
    if (parameters.form != undefined) parameters.data = "null";
    else if (parameters.data == undefined) parameters.data = "null";
    
    if (!parameters.html) {
        $.ajaxExt({
            type: type,
            validate: false,
            showThrobber: true,
            throbberPosition: { my: "center center", at: "center center", of: $("#lightBox div.popUpContent div[name=ActualContent]"), offset: "0 0" },
            messageControl: $("div[name=StatusMessagePopup]"),
            url: parameters.url,
            data: parameters.data,
            success: function (results) {
                $("#lightBox div.popUpContent div[name=ActualContent]").html(results[0]).css('max-height', '400px').css('overflow-y', 'auto').css('overflow-x', 'hidden');
                $("#lightBox").show()
                              .css('max-height', '400px')
                              .position({ my: "center center", at: "center center", of: $(window), offset: offsetX + " " + offsetY });
                
                $.CreateWaterMark();
                $.ApplyMaxLength();
                $.InitializeDatatypeControls();
                
                var form = $("#lightBox div.popUpContent div[name=ActualContent] form:first");
                $.ResetUnobtrusiveValidation(form);
            }
        });
    } else {
        $("#lightBox div.popUpContent div[name=ActualContent]").html(parameters.html);
        $("#lightBox").show().position({ my: "center center", at: "center center", of: $(window), offset: offsetX + " " + offsetY });
    }
}

$.CenterPopupWindow = function (parameters) {
    var offsetX = parameters.offsetX == undefined ? "0" : parameters.offsetX;
    var offsetY = parameters.offsetY == undefined ? "0" : parameters.offsetY;
    
    $("#lightBox").show().position({ my: "center center", at: "center center", of: $(window), offset: offsetX + " " + offsetY });
}

$.ClosePopupWindow = function () {
    $('.backgroundPopup').fadeOut(300);
    $("#lightBox").fadeOut(300);
    $("#lightbox_overlay").fadeOut(300);
    setTimeout(function () {
        $("#lightBox div.popUpContent div[name=ActualContent]").html('<div class="autofeedback"><span name="StatusMessagePopup" class="errormessage" style="display: none"></span></div>');
    }, 300);
    $.RemoveThrobber();
}

$.postifyData = function (value) {
    var result = {};
    
    var buildResult = function (object, prefix) {
        for (var key in object) {
            var postKey = isFinite(key)
                ? (prefix != "" ? prefix : "") + "[" + key + "]"
                : (prefix != "" ? prefix + "." : "") + key;
            
            switch (typeof (object[key])) {
                case "number": case "string": case "boolean":
                    result[postKey] = object[key];
                    break;

                case "object":
                    if (object[key] != null) {
                        if (object[key].toUTCString) result[postKey] = object[key].toUTCString().replace("UTC", "GMT");
                        else buildResult(object[key], postKey != "" ? postKey : key);
                    }
            }
        }
    };
    buildResult(value, "");
    
    return result;
}

$.CompareDateRange = function (url, startDate, endDate, callback) {
    $.ajaxExt({
        type: 'POST',
        validate: false,
        showThrobber: false,
        showErrorMessage: false,
        url: url,
        data: { startDate: startDate, endDate: endDate },
        error: function (message) { alert(message); },
        success: function (results) { callback(results[0]); }
    });
}

$.ResetUnobtrusiveValidation = function (form) {
    form.removeData('validator');
    form.removeData('unobtrusiveValidation');
    $.validator.unobtrusive.parse(form);
}

//=============================================
//EXTENSION METHODS============================
//=============================================

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return $.trim(this);
    };
}

if (!String.prototype.isNullOrEmpty) {
    String.prototype.isNullOrEmpty = function () {
        return (this.trim() == '' || this == null || this == undefined)
    };
}

if (!String.prototype.fetchNumber) {
    String.prototype.fetchNumber = function () {
        return parseInt(this.trim().replace(/[^\d.]/g, ''));
    };
}

function setDefaultText(editorid, msg) {
    if (CKEDITOR.instances[editorid].getData() == '') {
        CKEDITOR.instances[editorid].setData(msg);
    }
}

function RemoveDefaultText(editorid, msg) {
    if (CKEDITOR.instances[editorid].getData().indexOf(msg) >= 0) {
        CKEDITOR.instances[editorid].setData('');
        CKEDITOR.instances[editorid].focus();
    }
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 46 && charCode > 31 
        && (charCode < 48 || charCode > 57))
        return false;
    
    return true;
}

$(document).on('keydown', ".auto-complete", function (e) {
    if (e.keyCode == 13) { // enter
        if ($(".autocomplete_listItem").is(":visible")) {
            selectOption();
        } else {
            //$(".autocomplete_listItem").show();
            $('div.search-box').find('button.orange-btn').trigger('click');
        }
        //menuOpen = !menuOpen;        
    }
    if (e.keyCode == 38) { // up
        var selected = $(".selected");
        $(".autocomplete_listItem li").removeClass("selected");
        if (selected.prev().length == 0) {
            selected.siblings().last().addClass("selected");
        } else {
            selected.prev().addClass("selected");
        }
    }
    if (e.keyCode == 40) { // down
        var selected = $(".selected");
        $(".autocomplete_listItem li").removeClass("selected");
        if (selected.next().length == 0) {
            selected.siblings().first().addClass("selected");
        } else {
            selected.next().addClass("selected");
        }
    }
});

$(document).on('mouseover', ".autocomplete_listItem li", function () {
    $(".autocomplete_listItem li").removeClass("selected");
    $(this).addClass("selected");
}).click(function () {
    selectOption();
});

function selectOption() {
    $('.autocomplete_listItem li.selected').trigger('click');
    //$(".auto-complete").val($(".selected a").text());
    //$(".autocomplete_listItem").hide();
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

Array.prototype.clean = function (deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};


/* Thanks to CSS Tricks for pointing out this bit of jQuery
http://css-tricks.com/equal-height-blocks-in-rows/
It's been modified into a function called at page load and then each time the page is resized. One large modification was to remove the set height before each new calculation. */

equalheight = function (container) {
    
    var currentTallest = 0,
        currentRowStart = 0,
        rowDivs = new Array(),
        $el,
        topPosition = 0;
    $(container).each(function () {
        
        $el = $(this);
        $($el).height('auto')
        topPostion = $el.position().top;
        
        if (currentRowStart != topPostion) {
            for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
            rowDivs.length = 0; // empty the array
            currentRowStart = topPostion;
            currentTallest = $el.height();
            rowDivs.push($el);
        } else {
            rowDivs.push($el);
            currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
        }
        for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
            rowDivs[currentDiv].height(currentTallest);
        }
    });
}

$(window).load(function () {
    equalheight('.gallary-view .item-box');
});


$(window).resize(function () {
    equalheight('.gallary-view .item-box');
});

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

$('.dropdown-navbar').click(function (e) {
    console.log('clicked');
});
$(function () {
    // initialize form options		
    $('form#change-employer').validate({
        onfocusout: false, // disable blur on fields so animate doesn't replay
        onclick: false, // disable click event on fields especially select elements so animation doesn't play again.
        rules: {
            CorporateID: "required"
        },
        messages: {
            CorporateID: ""
        },
        submitHandler: function (form) {
            ChangeEmployer(form);
            return false;
        },		
        highlight: function (element) {
            //if (!$(element).is(':focus')) {
            $(element).stop()
                          .addClass("inputValidate")
                          .parents('.input-icon')
                          .animate({ left: "-10px" }, 70).animate({ left: "10px" }, 70)
                          .animate({ left: "-10px" }, 70).animate({ left: "10px" }, 70)
                          .animate({ left: "0px" }, 70);
            //}
        },
        unhighlight: function (element) {
            $(element).stop().removeClass("inputValidate");
        }
    });
});

function ChangeEmployer(sender) {
    //if ($('form#change-employer').validate().form()) {
    $.ajaxExt({
        url: '/ChangeEmployer',
        type: 'POST',
        showErrorMessage: true,
        validate: true,
        formToPost: $(sender),
        messageControl: $('.common-msg'),
        formToValidate: $(sender),
        showThrobber: true,
        throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
        containFiles: true,
        success: function (results, op) {
            //window.location.href = window.location.href;
            $('span.navbar-title small').html('| ' + op.Results[1]);
            $('span.user-info').html('<small>Welcome, </small>' + op.Results[0]);
            $('#CorporateID').val('');
        },
        error: function () {
                //$('.msg').html(data[0]).css({ 'color': 'Red' });
        }
    });
    return false;
    //}
    //return false;
}


$(function () {
    // initialize form options		
    $('form.advance-login').validate({
        onfocusout: false, // disable blur on fields so animate doesn't replay
        onclick: false, // disable click event on fields especially select elements so animation doesn't play again.
        rules: {
            LoginID: "required",
            Password: "required"
        },
        messages: {
            LoginID: "",
            Password: ""
        },
        submitHandler: function (form) {
            AdvanceLogin(form);
            return false;
        },		
        highlight: function (element) {
            //if (!$(element).is(':focus')) {
            $(element).stop()
                          .addClass("inputValidate")
                          .parents('.box-container')
                          .animate({ left: "-10px" }, 70).animate({ left: "10px" }, 70)
                          .animate({ left: "-10px" }, 70).animate({ left: "10px" }, 70)
                          .animate({ left: "0px" }, 70);
            //}
        },
        unhighlight: function (element) {
            $(element).stop().removeClass("inputValidate");
        }
    });
});

function AdvanceLogin(sender) {
    //if ($('form#change-employer').validate().form()) {
    var selectedMenu = $('ul.nav-list li.active').attr('class').split(' ')[0];
    //debugger;
    $.ajaxExt({
        url: '/AdvanceLogin',
        type: 'POST',
        showErrorMessage: true,
        validate: true,
        formToPost: $(sender),
        messageControl: $('.common-msg'),
        formToValidate: $(sender),
        showThrobber: true,
        throbberPosition: { my: "left center", at: "right center", of: $(sender).find('input[type="submit"]'), offset: "5 0" },
        containFiles: true,
        success: function (results, op) {
            //window.location.href = window.location.href;
            $('ul.nav.nav-list').html(op.Results[0]);
            $('ul.user-menu').html(op.Results[1]);
            $('span.user-info').html('<small>Welcome, </small>' + op.Results[2]);
            $('#ace-settings-btn').trigger('click');
            $('ul.nav-list li').removeClass('active');            
            switch (selectedMenu) {
                case 'dashboard':
                    $('ul.nav-list li.dashboard').addClass('active');
                    break;
                case 'archivesetup':
                    $('ul.nav-list li.archivesetup').addClass('active');
                    break;
                case 'monitoring':
                    $('ul.nav-list li.monitoring').addClass('active');
                    break;
            }
        },
        error: function () {
                //$('.msg').html(data[0]).css({ 'color': 'Red' });
        }
    });
    return false;
    //}
    //return false;
}
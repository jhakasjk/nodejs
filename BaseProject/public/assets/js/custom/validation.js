$(function () {
    // initialize form options		
    $('form').validate({
        onfocusout: false, // disable blur on fields so animate doesn't replay
        onclick: false, // disable click event on fields especially select elements so animation doesn't play again.
        rules: {
            CorpID: "required",
            LoginID: { required: true },
            Password: "required"
        },
        messages: {
            CorpID: "Required",
            LoginID: { required: 'Required' },
            Password: "*Required"
        },
        submitHandler: function (form) {
            Login(form);
            return false;
        },		
        highlight: function (element) {
            if (!$(element).is(':focus')) {
                $(element).stop()
                          .addClass("inputValidate")
                          .animate({ left: "-10px" }, 70).animate({ left: "10px" }, 70)
                          .animate({ left: "-10px" }, 70).animate({ left: "10px" }, 70)
                          .animate({ left: "0px" }, 70);
            }
        },
        unhighlight: function (element) {
            $(element).stop().removeClass("inputValidate");
        }
    });
});

function Login(sender) {
    if ($('form').validate().form()) {
        sender = $(sender).find('button[type="submit"]');
        $('form').find('button[type="submit"]').attr('disabled', 'disabled');
        $.ajaxExt({
            url: '/login',
            type: 'POST',
            showErrorMessage: true,
            validate: true,
            formToPost: $(sender).parents('form'),
            messageControl: $('.msg'),
            formToValidate: $(sender).parents('form'),
            showThrobber: true,
            throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
            containFiles: true,
            success: function (data, msg) {
                //$('.msg').html(data[0]).css({ 'color': 'Green' });
                //window.location.href = data[1];
                window.location.href = '/dashboard';
            },
            error: function () {
                //$('.msg').html(data[0]).css({ 'color': 'Red' });
                $('form').find('button[type="submit"]').removeAttr('disabled');
            }
        });
        return false;
    }
    return false;
}
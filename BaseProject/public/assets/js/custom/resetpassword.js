

function UpdatePassword(employeeid,employerid) {
    
   
    //if ($('form#change-employer').validate().form()) {
    $.ajaxExt({
        url: '/resetpassword/updatepwd',
        type: 'POST',
        data: { empid : employeeid, corpid : employerid },
        contentType: 'application/json',
        showErrorMessage: true,
        messageControl: $('.common-msg'),
        showThrobber: true,
        //throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
        containFiles: false,
        success: function () {
               
        },
        error: function () {
                //$('.msg').html(data[0]).css({ 'color': 'Red' });
        }
    });
    return false;
    //}
    //return false;
}
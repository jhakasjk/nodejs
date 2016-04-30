$(document).ready(function () {
    
    var totalCount = parseInt($('.total-results').val());
    //paging.pageSize = parseInt(DefaultPageSize);
    paging.pageSize = parseInt('10');
    paging.currentPage = 0;
    paging.startIndex = paging.currentPage;
    PageNumbering(totalCount);
    
    $('ul.nav-list li').removeClass('active');
    $('ul.nav-list li.monitoring').addClass('active');
   
    var str = $('.page-header h1').html();
    var alert = 0;
    if (str.indexOf('Alert')) {
        alert = 1;
    }
    //$.ajaxExt({
    //    url: '/monitor/showdata',
    //    type: 'POST',
    //    data: { isalert : alert },
    //    contentType: 'application/json',
    //    showErrorMessage: false,
    //    messageControl: '',
    //    showThrobber: false,
    //    //throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
    //    containFiles: false,
    //    success: function (data, msg) {
    //        $.each(data[0], function (ind) {
    //            var alertTypeId = data[0][ind].AlertTypeid.toString();
    //            var desc = data[0][ind].Description.toString();
    //            $("#ddlAlert").append('<option value=' + alertTypeId + '>' + desc + '<option>');
    //        });
    //        $.each(data[1], function (ind) {
    //            var SiteId = data[1][ind].SiteId.toString();
    //            var SiteName = data[1][ind].SiteName.toString();
    //            $("#ddlsite").append('<option value=' + SiteId + '>' + SiteName + '<option>');
    //        });
    //        $.each(data[2], function (ind) {
    //            var EmployeeId = data[2][ind].EmployeeId.toString();
    //            var EmployeeName = data[2][ind].EmployeeName.toString();
    //            $("#ddlEmployee").append('<option value=' + EmployeeId + '>' + EmployeeName + '<option>');
    //        });
               
    //    },
    //    error: function (data, msg) {
          
    //            //$('.msg').html(data[0]).css({ 'color': 'Red' });
    //    }
    //});



   // var totalCount = parseInt($('#TotalRecords').val());
    //paging.pageSize = parseInt(DefaultPageSize);
   // paging.pageSize = parseInt('3');
   // paging.currentPage = parseInt('1') - 1;
    //paging.startIndex = paging.currentPage;
   // PageNumbering(totalCount);
});


$('#btnalertSearch').click(function () {

    var siteId = $("#ddlsite option:selected").val();
    var alertTypeId = $("#ddlAlert option:selected").val();
    var employeeid = $("#ddlEmployee option:selected").val();
    $.ajaxExt({
        url: '/monitor/getAlertDetail',
        type: 'POST',
        data: { siteId: siteId, alertType: alertTypeId , employee : employeeid },
        showErrorMessage: true,
        messageControl: $('.common-msg'),
        showThrobber: true,
        throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
        abort: true,
        success: function (data, msg) {
            
        },
        error: function (msg) {
           // $('.common-msg').html(msg).css({ 'color': 'Red' });
        }
    });
});

$('#btnqueueSearch').click(function () {
    
    var siteId = $("#ddlsite option:selected").val();
    var employeeid = $("#ddlEmployee option:selected").val();
    $.ajaxExt({
        url: '/monitor/getAlertDetail',
        type: 'POST',
        data: { siteId: siteId, alertType: alertTypeId , employee : employeeid },
        showErrorMessage: true,
        messageControl: $('.common-msg'),
        showThrobber: true,
        throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
        abort: true,
        success: function (data, msg) {
            
        },
        error: function (msg) {
           // $('.common-msg').html(msg).css({ 'color': 'Red' });
        }
    });
});

$('#btntcSearch').click(function () {
    
    var siteId = $("#ddlsite option:selected").val();
    var alertTypeId = $("#ddlAlert option:selected").val();
    var employeeid = $("#ddlEmployee option:selected").val();
    $.ajaxExt({
        url: '/monitor/getAlertDetail',
        type: 'POST',
        data: { siteId: siteId, alertType: alertTypeId , employee : employeeid },
        showErrorMessage: true,
        messageControl: $('.common-msg'),
        showThrobber: true,
        throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
        abort: true,
        success: function (data, msg) {
            
        },
        error: function (msg) {
           // $('.common-msg').html(msg).css({ 'color': 'Red' });
        }
    });
});


function Paging(sender) {
    $.ajaxExt({
        url: '/monitor/_monitor',
        type: 'POST',
        data: { PageIndex: paging.currentPage, Type: $('.type').val() },
        showErrorMessage: true,
        messageControl: $('.common-msg'),
        showThrobber: true,
        throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
        abort: true,
        success: function (data, msg) {
            $('.Result').html(data[0])
            var totalResults = parseInt(data[1]);
            PageNumbering(totalResults);
            //$('html, body').animate({
            //    scrollTop: 0
            //}, 800);

        },
        error: function (msg) {
           // $('.common-msg').html(msg).css({ 'color': 'Red' });
        }
    });
    return false;
}

function sortTable(f, n) {
    var rows = $('#tblAlert tbody  tr').get();
    
    rows.sort(function (a, b) {
        
        var A = getVal(a);
        var B = getVal(b);
        
        if (A < B) {
            return -1 * f;
        }
        if (A > B) {
            return 1 * f;
        }
        return 0;
    });
    
    function getVal(elm) {
        var v = $(elm).children('td').eq(n).text().toUpperCase();
        if ($.isNumeric(v)) {
            v = parseInt(v, 10);
        }
        return v;
    }
    
    $.each(rows, function (index, row) {
        $('#tblAlert').children('tbody').append(row);
    });
}
        var f_sl = 1;
        var f_nm = 1;
        $("#empName").click(function () {
            f_sl *= -1;
            var n = $(this).prevAll().length;
            sortTable(f_sl, n);
        });
        $("#sitename").click(function () {
            f_nm *= -1;
            var n = $(this).prevAll().length;
            sortTable(f_nm, n);
        });
        $("#paygroup").click(function () {
            f_nm *= -1;
            var n = $(this).prevAll().length;
            sortTable(f_nm, n);
        });
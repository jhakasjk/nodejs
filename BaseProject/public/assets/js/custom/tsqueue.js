

$(document).ready(function () {
    
    $('ul.nav-list li').removeClass('active');
    $('ul.nav-list li.monitoring').addClass('active');
    
    $(document).on('click', '#btntcSearch', function () {

        var EmployerId = $('#ddlCorpId option:selected').val();
        var SiteId = $('#ddlSite option:selected').val();
        var PayGroupId = $('#ddlPayGroup option:selected').val();
        var EmployeeId = $('#ddlEmployee option:selected').val();
        var search = 1;
        
        $.ajaxExt( {
            url: '/tsqueue/search',
            type: 'POST',
            data: {EmployerId : EmployerId, SiteId : SiteId, PayGroupId : PayGroupId, EmployeeId : EmployeeId, search : search },
            contentType: 'application/json',
            showErrorMessage: false,
            messageControl: '',
            showThrobber: false,
            //throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
            containFiles: false,
            success: function (data, msg) {
                //$("#tcTable tbody").remove();
                $("#tcTable tbody").not("thead tr").remove();
                $("#tcTable tbody", this.element).remove();
                for (var i = 0; i < data[0].length; i++) {
                    var row;
                    var reprocesstd;
                    switch (data[0][i].StatusId.toString()) {
                        case '0':
                            row = $("<tr />")
                            reprocesstd = $("<td>" + "<a href='#'  Title=''> </a>" + "</td>")
                            break;
                        case '1':
                            row = $("<tr bgcolor='' />") //#ffb44b
                            reprocesstd = $("<td>" + "<a href='#'  Title=''> </a>" + "</td>")
                            break;
                        case '2':
                            row = $("<tr bgcolor='' />") //#82af6f
                            reprocesstd = $("<td>" + "<a href='#'  Title=''> </a>" + "</td>")
                            break;
                        case '3':
                            row = $("<tr bgcolor='' />") //#d15b47
                            reprocesstd = $("<td>" + "<a href='#'  Title='Reprocess'> Reprocess </a>" + "</td>")
                            break;
                    }
                    
                    $("#tcTable").append(row);
                    row.append($("<td>" + data[0][i].CorporateID.toString() + "</td>"));
                    row.append($("<td>" + data[0][i].SiteName + "</td>"));
                    row.append($("<td>" + data[0][i].Paygroups + "</td>"));
                    row.append($("<td>" + data[0][i].Employeename + "</td>"));
                    row.append($("<td>" + data[0][i].ReportingPeriod + "</td>"));
                    row.append($("<td>" + data[0][i].PayPeriod + "</td>"));
                    row.append($("<td>" + data[0][i].RequestCreated + "</td>"));
                    row.append($("<td>" + data[0][i].RequestCreatedby + "</td>"));
                    row.append($("<td>" + data[0][i].RequestStatus + "</td>"));
                    row.append(reprocesstd);
                }
              
                //$.getScript("../assets/js/custom/custompaging.js");
                //$('#tcTable').paging({ limit: 10 });
            },
            error: function (data, msg) {
            
                //$('.msg').html(data[0]).css({ 'color': 'Red' });
            }
        });
        
    });
    
    
    $.ajaxExt({
        url: '/tsqueue?Flag=1',
        type: 'GET',
        data: {},
        contentType: 'application/json',
        showErrorMessage: false,
        messageControl: '',
        showThrobber: false,
        //throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
        containFiles: false,
        success: function (data, msg) {
            debugger;
            
            $("#ddlCorpId").empty();
            $("#ddlSite").empty();
            $("#ddlPayGroup").empty();
            $("#ddlEmployee").empty();
            $("#ddlCorpId").append('<option value=' + -1 + '>' + 'All CorpId' + '</option>');
            $("#ddlSite").append('<option value="' + -1 + '">' + 'All Sites' + '</option>');
            $("#ddlPayGroup").append('<option value="' + -1 + '">' + 'All Paygroups' + '</option>');
            $("#ddlEmployee").append('<option value="' + -1 + '">' + 'All Employees' + '</option>');

            $.each(data[0], function (ind) {
                var EmployerId = data[0][ind].EmployerId.toString();
                var CorpId = data[0][ind].CorpId.toString();
                $("#ddlCorpId").append('<option value="' + EmployerId + '">' + CorpId + '</option>');
            });
          
               $.each(data[1], function (ind) {
            var SiteId = data[1][ind].SiteID.toString();
            var SiteName = data[1][ind].SiteName.toString();
            $("#ddlSite").append('<option value="' + SiteId + '">' + SiteName + '</option>');
        });
            $.each(data[2], function (ind) {
             var payGroupId = data[2][ind].PayGroupId.toString();
            var payGroupName = data[2][ind].PayGroupName.toString();
            $("#ddlPayGroup").append('<option value="' + payGroupId + '">' + payGroupName + '</option>');
        });
            $.each(data[3], function (ind) {              
            var EmployeeId = data[3][ind].EmployeeID.toString();
            var EmployeeName = data[3][ind].EmployeeFullName.toString();
            $("#ddlEmployee").append('<option value="' + EmployeeId + '">' + EmployeeName + '</option>');
            });   
            
            for (var i = 0; i < data[4].length; i++) {
                var row;
                var reprocesstd;
                switch (data[4][i].StatusId.toString()) {
                    case '0':
                        row = $("<tr />")
                        reprocesstd = $("<td>" + "<a href='#'  Title=''> </a>" + "</td>")
                        break;
                    case '1':
                        row = $("<tr bgcolor='' />") //#ffb44b
                        reprocesstd = $("<td>" + "<a href='#'  Title=''> </a>" + "</td>")
                        break;
                    case '2':
                        row = $("<tr bgcolor='' />") //#82af6f
                        reprocesstd = $("<td>" + "<a href='#'  Title=''> </a>" + "</td>")
                        break;
                    case '3':
                        row = $("<tr bgcolor='' />") //#d15b47
                        reprocesstd = $("<td>" + "<a href='#'  Title='Reprocess'> Reprocess </a>" + "</td>")
                        break;
                  }
             
                $("#tcTable").append(row);
                row.append($("<td>" + data[4][i].CorporateID.toString() + "</td>"));
                row.append($("<td>" + data[4][i].SiteName + "</td>"));
                row.append($("<td>" + data[4][i].Paygroups + "</td>"));
                row.append($("<td>" + data[4][i].Employeename + "</td>"));
                row.append($("<td>" + data[4][i].ReportingPeriod + "</td>"));
                row.append($("<td>" + data[4][i].PayPeriod + "</td>"));
                row.append($("<td>" + data[4][i].RequestCreated + "</td>"));
                row.append($("<td>" + data[4][i].RequestCreatedby + "</td>"));
                row.append($("<td>" + data[4][i].RequestStatus + "</td>"));
                row.append(reprocesstd);
              
            }
            //$('#tcTable').paging({ limit: 10 });
                
               
        },
        error: function (data, msg) {
            
                //$('.msg').html(data[0]).css({ 'color': 'Red' });
        }
    });


});